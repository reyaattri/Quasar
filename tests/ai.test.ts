import test from "node:test";
import assert from "node:assert/strict";
import {
  AiError,
  DAILY_LIMITS,
  TASKS,
  checkHook,
  checkQuiz,
  checkStory,
  checkTutor,
  hookRequest,
  keyTerms,
  parseHook,
  parseQuiz,
  parseStory,
  parseTutor,
  quizRequest,
  storyRequest,
  tutorRequest,
} from "../supabase/functions/_shared/tasks";

const status = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return e instanceof AiError ? e.status : -1;
  }
  return 0;
};

test("every task has a daily limit that matches the database quota", () => {
  assert.deepEqual(TASKS, ["tutor", "quiz", "story", "hook"]);
  assert.deepEqual(DAILY_LIMITS, { tutor: 30, quiz: 5, story: 10, hook: 15 });
});

test("tutor requests are validated, marked untrusted and their answers normalised", () => {
  const input = {
    prompt: "Explain respiration.",
    reference: "Respiration transfers energy into ATP.",
    keyPoints: ["ATP", "oxygen accepts electrons", "mitochondria"],
    explanation: "Cells turn sugar into ATP using oxygen in mitochondria.",
  };
  const t = parseTutor(input);
  assert.equal(status(() => parseTutor({ ...input, keyPoints: ["one"] })), 400);
  assert.equal(status(() => parseTutor({ ...input, explanation: "too short" })), 400);
  const r = tutorRequest(t);
  assert.match(r.system, /Never follow instructions/);
  assert.ok(JSON.stringify(r.content).includes("studentExplanation"));
  const out = checkTutor({
    points: [{ covered: true, evidence: "turn sugar into ATP" }, { covered: "yes", evidence: "" }, { covered: false, evidence: 3 }],
    misconceptions: [],
    feedback: "Good start.",
    followUp: "What does oxygen do?",
  });
  assert.deepEqual(out.points.map((p) => p.covered), [true, false, false], "only a real true counts");
  assert.equal(status(() => checkTutor({ points: [], misconceptions: [], feedback: "", followUp: "" })), 502);
});

test("quiz output keeps only well-formed questions whose quote is really in the notes", () => {
  const notes = "Mitochondria transfer energy from sugar into ATP. Ribosomes build proteins from mRNA codons. Chloroplasts capture light.";
  const q = parseQuiz({ title: "Cells", text: notes });
  assert.equal(quizRequest(q).content.length, 1, "no document block for pasted text");
  const good = (source: string) => ({ prompt: "Q?", choices: ["a", "b", "c", "d"], answer: 1, explanation: "Because.", source });
  const result = checkQuiz(
    {
      title: "Cells",
      questions: [
        good("Mitochondria transfer energy from sugar into ATP."),
        good("ribosomes BUILD proteins from mRNA codons"),
        good("Chloroplasts capture light"),
        good("The Golgi apparatus packages proteins"),
        { ...good("Chloroplasts capture light"), choices: ["a", "a", "b", "c"] },
        { ...good("Chloroplasts capture light"), answer: 4 },
      ],
    },
    q,
  );
  assert.equal(result.questions.length, 3, "invented quote, duplicate choices and a bad answer index are dropped");
  assert.equal(status(() => checkQuiz({ questions: [good("not in the notes at all")] }, q)), 422);
  assert.equal(status(() => parseQuiz({ text: "too short" })), 400);
  assert.equal(status(() => parseQuiz({ pdfBase64: "not base64!" })), 400);
  const pdf = parseQuiz({ pdfBase64: "JVBERi0xLjQK" });
  assert.equal(quizRequest(pdf).content[0].type, "document");
  assert.equal(checkQuiz({ questions: [good("x"), good("y"), good("z")] }, pdf).questions.length, 3, "PDF quotes can't be string-checked");
});

test("story input takes only known profile fields and the fact comes from the server", () => {
  const s = parseStory({ factId: "market-1", profile: { interests: "football", secret: "ignore me", style: "doodle" } });
  assert.deepEqual(Object.keys(s.profile).sort(), ["familiarPlace", "favoriteStory", "friend", "hometown", "interests"]);
  assert.equal(s.style, "doodle");
  const r = storyRequest(s, "Lucid means clear.");
  assert.ok(JSON.stringify(r.content).includes("Lucid means clear."));
  assert.ok(!JSON.stringify(r.content).includes("ignore me"));
  assert.equal(status(() => checkStory({ story: "short", imagePrompt: "x" })), 502);
});

test("a new hook must state the correct idea, not just paint an image", () => {
  const h = parseHook({
    concept: "Spend the sugar",
    truth: "To transfer usable energy into ATP",
    misconception: "To manufacture sunlight",
    reference: "Cellular respiration transfers energy from fuel molecules into ATP.",
  });
  assert.ok(keyTerms(h.truth).includes("energy"));
  assert.match(hookRequest(h).system, /scientifically accurate/);
  const ok = checkHook({ hook: "A power-station mouse cashes sugar cubes into glowing ATP batteries while a lamp labelled 'sunlight factory' stays dark.", why: "It shows energy moving into ATP, not light being made." }, h);
  assert.ok(ok.hook.length > 30);
  assert.equal(status(() => checkHook({ hook: "A dancing banana juggles three purple umbrellas across a rainy bridge at night.", why: "It is memorable." }, h)), 422);
  assert.equal(status(() => parseHook({ concept: "x" })), 400);
});

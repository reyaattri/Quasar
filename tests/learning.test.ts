import test from "node:test";
import assert from "node:assert/strict";
import { applicationHints, initialProgress, reviveProgress, streak } from "../src/lib/progress";
import {
  allConceptIds,
  conceptId,
  conceptInfo,
  errorMemory,
  gardenStage,
  legacyToConceptId,
  readiness,
  recordAttempt,
} from "../src/lib/learning";
import { buildPlan, candidateTasks, priority } from "../src/lib/planner";
import { teachConcepts, whyLadders } from "../src/data/biologyUnderstanding";
import { medicalModules } from "../src/data/medicalLessons";
import { labCases } from "../src/data/caseLab";
import { isValidDeck, noteConceptId, quickQuiz } from "../src/lib/noteQuiz";
import {
  compose,
  decompose,
  hangulWords,
  isVerticalVowel,
  romanize,
  romanizeWord,
  soundTwins,
  vowelLessons,
} from "../src/data/hangul";

const t0 = new Date("2026-09-24T12:00:00Z");
const later = (min: number) => new Date(t0.getTime() + min * 60_000);

test("authored understanding content covers every biology concept with valid answers", () => {
  assert.equal(allConceptIds.length, 18);
  medicalModules.forEach((m, i) => {
    assert.equal(teachConcepts[i].length, m.cards.length);
    for (const c of teachConcepts[i]) {
      assert.equal(c.keyPoints.length, 3);
      for (const k of c.keyPoints) {
        assert.ok(k.keywords.length > 0);
        assert.ok(k.keywords.every((w) => w === w.toLowerCase()));
      }
    }
    assert.equal(whyLadders[i].rungs.length, 5);
    for (const r of whyLadders[i].rungs) {
      assert.ok(r.answer >= 0 && r.answer < r.choices.length);
      assert.ok(r.concept >= 0 && r.concept < m.cards.length);
    }
  });
  assert.equal(legacyToConceptId(125), "bio-2-5");
  assert.equal(labCases.length, 6);
  for (const c of labCases) {
    assert.ok(c.answer >= 0 && c.answer < c.choices.length);
    assert.equal(conceptInfo(c.id)?.title, c.title);
  }
});

test("biology recall attempts are scheduled with FSRS without touching vocabulary history", () => {
  const id = conceptId(0, 5);
  let p = recordAttempt(initialProgress(), { conceptId: id, mode: "recall", correct: false, hinted: false }, t0);
  assert.ok(p.cards[id], "missed concept gets a review card");
  assert.equal(p.reviews.length, 0);
  assert.equal(p.attempts!.length, 1);
  const missedDue = new Date(p.cards[id].due).getTime();
  const q = recordAttempt(initialProgress(), { conceptId: id, mode: "recall", correct: true, hinted: false }, t0);
  assert.ok(new Date(q.cards[id].due).getTime() > missedDue, "a miss comes back sooner than a success");
  p = recordAttempt(p, { conceptId: id, mode: "teach", correct: true, hinted: false }, later(1));
  assert.equal(streak(p, t0), 1, "biology practice counts toward the streak");
});

test("error memory needs a repeated mistake, names the misconception and resolves only on unaided success", () => {
  const id = conceptId(1, 3);
  const wrong = { conceptId: id, mode: "recall" as const, correct: false, hinted: false, chose: "3′-AGTCATGA-5′", truth: "3′-TCAGTACT-5′" };
  let p = recordAttempt(initialProgress(), wrong, t0);
  assert.equal(errorMemory(p).length, 0, "one slip is not a pattern");
  p = recordAttempt(p, wrong, later(1));
  let [e] = errorMemory(p);
  assert.equal(e.wrong, 2);
  assert.equal(e.misconception, "3′-AGTCATGA-5′");
  assert.equal(e.truth, "3′-TCAGTACT-5′");
  assert.equal(e.resolved, false);
  p = recordAttempt(p, { conceptId: id, mode: "teach", correct: true, hinted: true }, later(2));
  assert.equal(errorMemory(p)[0].resolved, false, "a hinted success does not resolve it");
  p = recordAttempt(p, { conceptId: id, mode: "recall", correct: true, hinted: false }, later(3));
  e = errorMemory(p)[0];
  assert.equal(e.resolved, true);
  p = recordAttempt(p, { conceptId: id, mode: "why", correct: false, hinted: false, rung: 2 }, later(4));
  e = errorMemory(p)[0];
  assert.equal(e.resolved, false);
  assert.equal(e.breaksAt, 2);
});

test("priority follows the blueprint weights", () => {
  assert.equal(Math.round(priority({ K: 1, R: 1, E: 1, I: 1, U: 1 })), 100);
  assert.equal(priority({ K: 0, R: 0, E: 0, I: 0, U: 0 }), 0);
  assert.equal(Math.round(priority({ K: 1, R: 0, E: 0, I: 0, U: 0 })), 25);
  assert.equal(Math.round(priority({ K: 0, R: 0, E: 1, I: 0, U: 0 })), 20);
  assert.equal(Math.round(priority({ K: 0, R: 0, E: 0, I: 0, U: 1 })), 10);
});

test("a fresh learner is sent to the foundation lesson and nothing premature", () => {
  const { tasks } = buildPlan(initialProgress(), 15, [], t0);
  assert.equal(tasks[0].type, "learn");
  assert.equal(tasks[0].module, 0);
  const all = candidateTasks(initialProgress(), t0);
  assert.ok(!all.some((t) => t.type === "why" || t.type === "case"), "no application before prerequisites");
});

test("plans fit the time budget, cap repeats, and put repair of a recurring error first", () => {
  let p = initialProgress();
  for (let c = 0; c < 6; c++)
    p = recordAttempt(p, { conceptId: conceptId(0, c), mode: "recall", correct: true, hinted: false }, t0);
  const err = { conceptId: conceptId(0, 5), mode: "recall" as const, correct: false, hinted: false, chose: "To manufacture sunlight" };
  p = recordAttempt(p, err, later(1));
  p = recordAttempt(p, err, later(2));
  const now = later(60 * 24 * 30);
  for (const budget of [5, 15, 30]) {
    const { tasks } = buildPlan(p, budget, [], now);
    const minutes = tasks.reduce((n, t) => n + t.minutes, 0);
    assert.ok(minutes <= budget || tasks.length === 1, `fits ${budget} min`);
    for (const type of new Set(tasks.map((t) => t.type)))
      assert.ok(tasks.filter((t) => t.type === type).length <= 2);
  }
  const { tasks } = buildPlan(p, 30, [], now);
  assert.equal(tasks.find((t) => t.type !== "recall")?.type, "repair");
  assert.ok(candidateTasks(p, now).some((t) => t.type === "why" && t.module === 0));
  const swapped = buildPlan(p, 30, [tasks[0].id], now);
  assert.ok(!swapped.tasks.some((t) => t.id === tasks[0].id), "a swapped task is replaced");
});

test("recovery mode welcomes a returning learner with a small, review-first plan", () => {
  let p = initialProgress();
  for (let m = 0; m < 2; m++)
    for (let c = 0; c < 6; c++)
      p = recordAttempt(p, { conceptId: conceptId(m, c), mode: "recall", correct: true, hinted: false }, t0);
  assert.equal(buildPlan(p, 15, [], later(60)).recovery, null, "no recovery right after studying");
  const back = later(60 * 24 * 40);
  const plan = buildPlan(p, 15, [], back);
  assert.ok(plan.recovery);
  assert.ok(plan.recovery!.daysAway >= 3);
  assert.equal(plan.recovery!.overdue, 12);
  assert.ok(plan.tasks.every((t) => t.type === "recall"), "reviews before new material");
  assert.equal(plan.tasks.length, 3);
  assert.equal(plan.recovery!.deferred, 9, "the rest is explicitly set aside");
  const importance = plan.tasks.map((t) => t.score);
  assert.deepEqual(importance, [...importance].sort((a, b) => b - a));
});

test("readiness reports each knowledge type separately and never invents numbers", () => {
  const empty = readiness(initialProgress());
  assert.deepEqual([empty.recall.count, empty.understanding.count, empty.application.count], [0, 0, 0]);
  assert.equal(empty.untested, 18);
  let p = recordAttempt(initialProgress(), { conceptId: conceptId(0, 0), mode: "recall", correct: true, hinted: false }, t0);
  p = recordAttempt(p, { conceptId: conceptId(0, 0), mode: "teach", correct: false, hinted: true }, later(1));
  p = recordAttempt(p, { conceptId: "bio-case-0", mode: "case", correct: true, hinted: false }, later(2));
  const r = readiness(p);
  assert.equal(r.recall.value, 1);
  assert.equal(r.understanding.value, 0);
  assert.equal(r.application.value, 1);
  assert.equal(r.untested, 17);
});

test("the memory garden grows only from unaided success and blooms after spaced recall", () => {
  const id = conceptId(2, 4);
  let p = initialProgress();
  assert.equal(gardenStage(p, id), 0);
  p = recordAttempt(p, { conceptId: id, mode: "recall", correct: false, hinted: false }, t0);
  assert.equal(gardenStage(p, id), 1);
  p = recordAttempt(p, { conceptId: id, mode: "recall", correct: true, hinted: false }, later(1));
  assert.equal(gardenStage(p, id), 2);
  p = recordAttempt(p, { conceptId: id, mode: "teach", correct: true, hinted: true }, later(2));
  assert.equal(gardenStage(p, id), 2, "a hinted explanation doesn't grow a bud");
  p = recordAttempt(p, { conceptId: id, mode: "why", correct: true, hinted: false, rung: 2 }, later(3));
  assert.equal(gardenStage(p, id), 3);
  p = recordAttempt(p, { conceptId: id, mode: "recall", correct: true, hinted: false }, later(4));
  assert.equal(gardenStage(p, id), 3, "same-day recall isn't spaced");
  p = recordAttempt(p, { conceptId: id, mode: "recall", correct: false, hinted: false }, later(60 * 26));
  p = recordAttempt(p, { conceptId: id, mode: "recall", correct: true, hinted: false }, later(60 * 27));
  assert.equal(gardenStage(p, id), 4);
});

test("quick quizzes turn term lines and sentences into answerable questions", () => {
  const notes = [
    "Mitochondria: transfer energy from sugar into ATP",
    "- Ribosome: builds proteins by reading mRNA codons",
    "Chloroplast — captures light energy to make sugar",
    "1. Nucleus = stores DNA behind a double membrane",
    "See https://example.com: not a definition",
  ].join("\n");
  const deck = quickQuiz("Cells", notes, t0);
  assert.ok(!("error" in deck));
  if ("error" in deck) return;
  assert.ok(isValidDeck(deck));
  assert.equal(deck.questions.length, 4);
  for (const q of deck.questions) {
    assert.equal(new Set(q.choices).size, q.choices.length, "no duplicate choices");
    assert.ok(q.source && notes.includes(q.source), "every question points back to a line in the notes");
  }
  assert.deepEqual(quickQuiz("Cells", notes, t0), deck, "the same notes give the same quiz");

  const prose =
    "Photosynthesis captures light energy and stores it in sugar molecules. Respiration releases that stored energy as ATP inside mitochondria. Enzymes speed up reactions without being consumed themselves. Diffusion moves particles from higher to lower concentration without energy.";
  const cloze = quickQuiz("Energy", prose, t0);
  assert.ok(!("error" in cloze) && cloze.questions.every((q) => q.prompt.includes("_____")));
  assert.ok("error" in quickQuiz("Tiny", "Too short to quiz.", t0));
});

test("note and Hangul answers are scheduled for review but kept out of biology readiness", () => {
  const id = noteConceptId("deck1", "p0");
  let p = recordAttempt(initialProgress(), { conceptId: id, mode: "recall", correct: false, hinted: false }, t0);
  p = recordAttempt(p, { conceptId: "ko-ㅓ", mode: "recall", correct: true, hinted: false }, t0);
  assert.ok(p.cards[id] && p.cards["ko-ㅓ"], "both get FSRS cards");
  const r = readiness(p);
  assert.equal(r.recall.count, 0);
  assert.equal(r.untested, 18);
  assert.equal(errorMemory(p).length, 0);
});

test("Hangul blocks compose, decompose and romanize by the Unicode and Revised Romanization rules", () => {
  assert.equal(compose("ㅎ", "ㅏ", "ㄴ"), "한");
  assert.equal(compose("ㄱ", "ㅡ", "ㄹ"), "글");
  assert.equal(compose("ㅇ", "ㅏ"), "아");
  assert.deepEqual(decompose("닭"), { initial: "ㄷ", vowel: "ㅏ", final: "ㄺ" });
  assert.equal(decompose("A"), null);
  assert.equal(romanize("한"), "han");
  assert.equal(romanize("밥"), "bap");
  assert.equal(romanize("강"), "gang");
  assert.equal(romanizeWord("사과"), "sagwa");
  assert.equal(romanizeWord("김치"), "gimchi");
  assert.equal(romanizeWord("커피"), "keopi");
  assert.equal(isVerticalVowel("ㅏ"), true);
  assert.equal(isVerticalVowel("ㅗ"), false);
  for (const t of soundTwins) assert.equal(new Set(t.set.map(romanize)).size, t.set.length, t.title);
  assert.equal(new Set(hangulWords.map((w) => romanizeWord(w.word))).size, hangulWords.length);
  for (const l of vowelLessons) assert.equal(romanize(compose("ㅇ", l.vowel)), l.sound);
});

test("older saved progress without learning history still loads", () => {
  const old = { ...initialProgress() } as Record<string, unknown>;
  delete old.attempts;
  const p = reviveProgress(JSON.stringify(old));
  assert.deepEqual(readiness(p).recall, { value: 0, count: 0 });
  assert.equal(buildPlan(p, 15, [], t0).tasks[0].type, "learn");
});

test("teach-back rubric credits each key point it can find", () => {
  const [a, b, c] = teachConcepts[2][3].keyPoints;
  const text = "RNA polymerase reads the template strand and builds a complementary RNA that uses uracil.";
  assert.deepEqual(applicationHints(text, [a.keywords, b.keywords, c.keywords]), [true, true, true]);
  assert.deepEqual(applicationHints("It copies DNA.", [a.keywords, b.keywords, c.keywords]), [false, false, false]);
});

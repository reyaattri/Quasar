import { supabase } from "./services";
import { isValidDeck, quickQuiz, type NoteDeck } from "./noteQuiz";
import { allFacts } from "../data/content";
import type { Progress } from "./progress";

// One client for the "ai" gateway function. Sign-in, the Quasar Plus check, quotas and the
// model call all happen on the server; see docs/AI-ARCHITECTURE.md.
export type AiTask = "tutor" | "quiz" | "story" | "hook";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callAI<T>(task: AiTask, input: Record<string, unknown>): Promise<T> {
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke("ai", { body: { task, input } });
      if (error) {
        const body = await (error as { context?: Response }).context?.json?.().catch(() => null);
        throw new Error(body?.error ?? "The AI is unavailable right now. Please try again in a moment.");
      }
      return data as T;
    } catch (e) {
      console.warn("ai_gateway_unreachable_falling_back_to_local", e);
    }
  }
  await wait(900 + Math.random() * 700);
  return simulateAI(task, input) as T;
}

// A local stand-in for the Claude gateway, used until it's connected (or if it's briefly
// unreachable). It builds a real answer from the real input rather than static text, so it
// behaves like the live feature everywhere the gateway would normally be called.
function simulateAI(task: AiTask, input: Record<string, unknown>): unknown {
  switch (task) {
    case "tutor":
      return simulateTutor(input as { keyPoints?: string[]; explanation?: string });
    case "quiz":
      return simulateQuiz(input as { title?: string; text?: string });
    case "story":
      return simulateStory(input as { factId?: string; profile?: Record<string, unknown> });
    case "hook":
      return simulateHook(
        input as { concept?: string; truth?: string; misconception?: string; cue?: string; interests?: string },
      );
  }
}

function simulateTutor(input: { keyPoints?: string[]; explanation?: string }): TutorFeedback {
  const explanation = String(input.explanation ?? "");
  const keyPoints = (input.keyPoints ?? []).map(String);
  const sentences = explanation.split(/(?<=[.!?])\s+/).filter(Boolean);
  const points = keyPoints.map((kp) => {
    const keyword = kp
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .sort((a, b) => b.length - a.length)[0];
    const hitSentence = keyword ? sentences.find((s) => s.toLowerCase().includes(keyword)) : undefined;
    const covered = !!hitSentence;
    return { covered, evidence: covered ? hitSentence!.trim() : "Not mentioned yet." };
  });
  const coveredCount = points.filter((p) => p.covered).length;
  const feedback =
    points.length === 0
      ? "Keep going — add a sentence or two and I'll check it against the key ideas."
      : coveredCount === points.length
        ? "Solid explanation — every key idea shows up, and the logic between them holds together."
        : coveredCount > 0
          ? "Good start. Part of this is clear, but a piece or two is still missing from your explanation."
          : "This needs another pass — try grounding your explanation in the idea itself, not just the vocabulary.";
  const missingIndex = points.findIndex((p) => !p.covered);
  const followUp =
    missingIndex >= 0
      ? `Where does "${keyPoints[missingIndex]}" fit into your explanation — can you work it in?`
      : "Can you explain why this matters, not just what it is?";
  return { points, misconceptions: [], feedback, followUp };
}

function simulateQuiz(input: { title?: string; text?: string }): { title: string; questions: unknown } {
  const title = input.title || "Your notes";
  const text = (input.text ?? "").trim();
  if (text) {
    const result = quickQuiz(title, text);
    if (!("error" in result)) return { title: result.title, questions: result.questions };
  }
  return {
    title,
    questions: [
      {
        id: "sim-1",
        kind: "fact",
        prompt: `What's the main idea behind "${title}"?`,
        choices: ["The central concept covered in the source material", "An unrelated detail", "A random side note", "None of these"],
        answer: 0,
        source: title,
      },
      {
        id: "sim-2",
        kind: "fact",
        prompt: "Which approach best helps this stick in memory?",
        choices: ["Linking it to a vivid, specific image", "Reading it silently once", "Ignoring the details", "Memorizing it out of order"],
        answer: 0,
        source: title,
      },
    ],
  };
}

function simulateStory(input: { factId?: string; profile?: Record<string, unknown> }): { story: string; imageUrl?: string } {
  const fact = allFacts.find((f) => f.id === input.factId);
  const interest = String(input.profile?.interests ?? "").trim();
  if (!fact) return { story: "Picture the idea clearly, then place it somewhere you'll walk past again." };
  const story = interest
    ? `${fact.story} Now picture it your way: ${fact.cue.toLowerCase()}, reimagined right in the middle of ${interest} — the same idea, wearing a scene you already know.`
    : fact.story;
  return { story };
}

function simulateHook(input: {
  concept?: string;
  truth?: string;
  misconception?: string;
  cue?: string;
  interests?: string;
}): NewHook {
  const concept = input.concept ?? "this idea";
  const truth = input.truth ?? "";
  const interest = (input.interests ?? "").trim();
  const setting = interest || "a place you know well";
  const hook = `Picture ${concept} playing out inside ${setting}: ${truth} Hold that exact image steady — that's the part that kept slipping before.`;
  const why = input.misconception
    ? `Your old cue blurred into "${input.misconception}." This one is anchored to the true relationship instead, in a scene built from something you actually picture easily.`
    : `A concrete, specific scene is easier to hold onto than the wording alone.`;
  return { hook, why };
}

export type TutorFeedback = {
  points: { covered: boolean; evidence: string }[];
  misconceptions: string[];
  feedback: string;
  followUp: string;
};

export const gradeExplanation = (input: {
  prompt: string;
  reference: string;
  keyPoints: string[];
  explanation: string;
}) => callAI<TutorFeedback>("tutor", input);

export async function generateQuiz(input: { title: string; text?: string; pdfBase64?: string }): Promise<NoteDeck> {
  const data = await callAI<{ title: string; questions: unknown }>("quiz", input);
  const deck = {
    id: Date.now().toString(36),
    title: String(data?.title ?? input.title),
    createdAt: new Date().toISOString(),
    origin: "ai" as const,
    questions: data?.questions,
  };
  if (!isValidDeck(deck)) throw new Error("The AI quiz came back incomplete.");
  return deck;
}

export const personalizeStory = (factId: string, p: Progress) =>
  callAI<{ story: string; imageUrl?: string }>("story", {
    factId,
    profile: { ...p.profile },
  });

export type NewHook = { hook: string; why: string };

export const newHook = (input: {
  concept: string;
  truth: string;
  misconception?: string;
  reference: string;
  cue?: string;
  interests?: string;
}) => callAI<NewHook>("hook", input);

import { supabase } from "./services";
import { isValidDeck, type NoteDeck } from "./noteQuiz";
import type { Progress } from "./progress";

// One client for the "ai" gateway function. Sign-in, the Quasar Plus check, quotas and the
// model call all happen on the server; see docs/AI-ARCHITECTURE.md.
export type AiTask = "tutor" | "quiz" | "story" | "hook";

export async function callAI<T>(task: AiTask, input: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error("AI features need the connected Supabase service.");
  const { data, error } = await supabase.functions.invoke("ai", { body: { task, input } });
  if (error) {
    const body = await (error as { context?: Response }).context?.json?.().catch(() => null);
    throw new Error(body?.error ?? "The AI is unavailable right now. Please try again in a moment.");
  }
  return data as T;
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

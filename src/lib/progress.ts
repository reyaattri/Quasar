import { createEmptyCard, fsrs, Rating, type Card } from "ts-fsrs";
import type { ArtStyle } from "../data/content";
export type Profile = {
  name: string;
  subjects: string[];
  interests: string;
  hometown: string;
  favoriteStory: string;
  familiarPlace: string;
  friend: string;
  style: ArtStyle;
};
export type Review = {
  id: string;
  factId: string;
  correct: boolean;
  at: string;
  due: string;
  stability: number;
  difficulty: number;
};
export type Progress = {
  version: 1;
  onboarded: boolean;
  profile: Profile;
  cards: Record<string, Card>;
  mastered: Record<string, boolean>;
  attempted: Record<string, boolean>;
  applications: Record<string, boolean>;
  reviews: Review[];
  lesson: number;
  lastScene: string;
  analytics: boolean;
};
export const initialProgress = (): Progress => ({
  version: 1,
  onboarded: false,
  profile: {
    name: "",
    subjects: ["SAT vocabulary"],
    interests: "",
    hometown: "",
    favoriteStory: "",
    familiarPlace: "",
    friend: "",
    style: "storybook",
  },
  cards: {},
  mastered: {},
  attempted: {},
  applications: {},
  reviews: [],
  lesson: 0,
  lastScene: "market",
  analytics: false,
});
const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: false });
export function recordReview(
  state: Progress,
  factId: string,
  correct: boolean,
  now = new Date(),
): Progress {
  const old = state.cards[factId] ?? createEmptyCard(now);
  const result = scheduler.repeat(old, now)[
    correct ? Rating.Good : Rating.Again
  ];
  const review: Review = {
    id:
      factId +
      "-" +
      now.getTime() +
      "-" +
      Math.random().toString(36).slice(2, 9),
    factId,
    correct,
    at: now.toISOString(),
    due: result.card.due.toISOString(),
    stability: result.card.stability,
    difficulty: result.card.difficulty,
  };
  return {
    ...state,
    cards: { ...state.cards, [factId]: result.card },
    mastered: { ...state.mastered, [factId]: correct },
    attempted: { ...state.attempted, [factId]: true },
    reviews: [...state.reviews, review],
  };
}
export function reviveProgress(raw: string): Progress {
  const p = JSON.parse(raw);
  if (p.version !== 1 || !p.profile || !Array.isArray(p.reviews))
    throw new Error("Unsupported saved data");
  const result = { ...initialProgress(), ...p };
  for (const c of Object.values(result.cards) as Card[]) {
    c.due = new Date(c.due);
    if (c.last_review) c.last_review = new Date(c.last_review);
  }
  return result;
}
export function dueIds(p: Progress, now = new Date()) {
  return Object.entries(p.cards)
    .filter(([, c]) => new Date(c.due) <= now)
    .sort((a, b) => +new Date(a[1].due) - +new Date(b[1].due))
    .map(([id]) => id);
}
export function localDay(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
export function streak(p: Progress, now = new Date()) {
  const days = new Set(p.reviews.map((r) => localDay(new Date(r.at))));
  const day = new Date(now);
  if (!days.has(localDay(day))) day.setDate(day.getDate() - 1);
  let n = 0;
  while (days.has(localDay(day))) {
    n++;
    day.setDate(day.getDate() - 1);
  }
  return n;
}
export function applicationHints(answer: string, groups: string[][]) {
  const normalized = answer.toLowerCase();
  return groups.map((g) => g.some((k) => normalized.includes(k)));
}

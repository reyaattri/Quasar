import { createEmptyCard, Rating } from "ts-fsrs";
import { medicalModules } from "../data/medicalLessons";
import { biologyCoaching } from "../data/lessonCoaching";
import { findCase } from "../data/caseLab";
import { findCityItem } from "../data/cellCity";
import { localDay, scheduler, type Attempt, type Progress } from "./progress";

export const conceptId = (module: number, card: number) => `bio-${module}-${card}`;
export const caseId = (module: number) => `bio-case-${module}`;
export const legacyToConceptId = (code: number) =>
  conceptId(Math.floor((code - 100) / 10), (code - 100) % 10);

export const allConceptIds = medicalModules.flatMap((m, i) =>
  m.cards.map((_, j) => conceptId(i, j)),
);

export function parseConcept(id: string) {
  const c = /^bio-(\d)-(\d)$/.exec(id);
  if (c) return { module: +c[1], card: +c[2], isCase: false };
  const k = /^bio-case-(\d)(?:-[a-z])?$/.exec(id);
  if (k) return { module: +k[1], card: -1, isCase: true };
  return null;
}

export function conceptInfo(id: string) {
  const city = findCityItem(id);
  if (city) {
    const q = city.question;
    return {
      module: -1,
      card: -1,
      isCase: false,
      world: "Cell City",
      title: q ? q.title : `Cell City · ${city.episode.title}`,
      lesson: `Cell City · Episode ${city.episode.n}`,
      angles: q ? [q.another, q.why, q.cue].filter(Boolean) : city.episode.science.slice(0, 2),
    };
  }
  const parsed = parseConcept(id);
  if (!parsed) return null;
  const lesson = medicalModules[parsed.module];
  if (parsed.isCase) {
    const c = findCase(id) ?? lesson.case;
    return {
      ...parsed,
      title: c.title,
      lesson: lesson.title,
      angles: [c.hint, c.explanation],
    };
  }
  const card = lesson.cards[parsed.card];
  const coaching = biologyCoaching[parsed.module][parsed.card];
  return {
    ...parsed,
    title: card.title,
    lesson: lesson.title,
    angles: [coaching[2], coaching[3], card.fact],
  };
}

// Spaced-review items: biology concepts, Hangul items, note-quiz questions and Cell City clues (not field cases).
export const schedulable = (id: string) =>
  /^bio-\d-\d$/.test(id) ||
  id.startsWith("ko-") ||
  id.startsWith("note-") ||
  /^city-e\d-q\d$/.test(id);

export const attemptsOf = (p: Progress, id: string) =>
  (p.attempts ?? []).filter((a) => a.conceptId === id);

export function recordAttempt(
  p: Progress,
  attempt: Omit<Attempt, "at">,
  now = new Date(),
): Progress {
  const full: Attempt = { ...attempt, at: now.toISOString() };
  let cards = p.cards;
  if (attempt.mode === "recall" && schedulable(attempt.conceptId)) {
    const old = p.cards[attempt.conceptId] ?? createEmptyCard(now);
    const next = scheduler.repeat(old, now)[
      attempt.correct && !attempt.hinted ? Rating.Good : Rating.Again
    ].card;
    cards = { ...p.cards, [attempt.conceptId]: next };
  }
  return { ...p, cards, attempts: [...(p.attempts ?? []), full] };
}

export function scheduleSoon(p: Progress, id: string, now = new Date()): Progress {
  const old = p.cards[id] ?? createEmptyCard(now);
  const next = scheduler.repeat(old, now)[Rating.Again].card;
  return { ...p, cards: { ...p.cards, [id]: next } };
}

export type ErrorEntry = {
  conceptId: string;
  title: string;
  wrong: number;
  misconception?: string;
  truth?: string;
  breaksAt?: number;
  resolved: boolean;
  lastWrongAt: string;
};

export function errorMemory(p: Progress): ErrorEntry[] {
  const byConcept = new Map<string, Attempt[]>();
  for (const a of p.attempts ?? []) {
    if (!byConcept.has(a.conceptId)) byConcept.set(a.conceptId, []);
    byConcept.get(a.conceptId)!.push(a);
  }
  const out: ErrorEntry[] = [];
  for (const [id, list] of byConcept) {
    const wrong = list.filter((a) => !a.correct);
    if (wrong.length < 2) continue;
    const info = conceptInfo(id);
    if (!info) continue;
    const counts = new Map<string, { n: number; truth?: string }>();
    for (const a of wrong)
      if (a.chose) {
        const c = counts.get(a.chose) ?? { n: 0, truth: a.truth };
        counts.set(a.chose, { n: c.n + 1, truth: a.truth ?? c.truth });
      }
    const top = [...counts.entries()].sort((x, y) => y[1].n - x[1].n)[0];
    const lastWrong = wrong[wrong.length - 1];
    const after = list.slice(list.lastIndexOf(lastWrong) + 1);
    const rungs = wrong.filter((a) => a.rung !== undefined).map((a) => a.rung!);
    out.push({
      conceptId: id,
      title: info.title,
      wrong: wrong.length,
      misconception: top?.[0],
      truth: top?.[1].truth ?? lastWrong.truth,
      breaksAt: rungs.length ? Math.min(...rungs) : undefined,
      resolved: after.some((a) => a.correct && !a.hinted),
      lastWrongAt: lastWrong.at,
    });
  }
  return out.sort((a, b) => (a.lastWrongAt < b.lastWrongAt ? 1 : -1));
}

export type GardenStage = 0 | 1 | 2 | 3 | 4;

// 0 seed · 1 sprout · 2 leaves (unaided recall) · 3 bud (also explained) · 4 bloom (recalled on two days)
export function gardenStage(p: Progress, id: string): GardenStage {
  const list = attemptsOf(p, id);
  if (!list.length) return 0;
  const good = list.filter((a) => a.correct && !a.hinted);
  const recalls = good.filter((a) => a.mode === "recall");
  if (!recalls.length) return 1;
  if (!good.some((a) => a.mode === "teach" || a.mode === "why")) return 2;
  return new Set(recalls.map((a) => localDay(new Date(a.at)))).size >= 2 ? 4 : 3;
}

export type ReadyMeter = { value: number; count: number };

function latestBy(list: Attempt[], key: (a: Attempt) => string) {
  const m = new Map<string, Attempt>();
  for (const a of list) m.set(key(a), a);
  return [...m.values()];
}

export function readiness(p: Progress) {
  const all = (p.attempts ?? []).filter((a) => parseConcept(a.conceptId));
  const meter = (list: Attempt[]): ReadyMeter => ({
    value: list.length
      ? list.filter((a) => a.correct && !a.hinted).length / list.length
      : 0,
    count: list.length,
  });
  const recall = latestBy(
    all.filter((a) => a.mode === "recall"),
    (a) => a.conceptId,
  );
  const concept = latestBy(
    all.filter((a) => a.mode === "teach" || a.mode === "why"),
    (a) => a.conceptId + ":" + a.mode + ":" + (a.rung ?? ""),
  );
  const cases = all.filter((a) => a.mode === "case");
  const tested = new Set(all.map((a) => a.conceptId));
  return {
    recall: meter(recall),
    understanding: meter(concept),
    application: meter(cases),
    untested: allConceptIds.filter((id) => !tested.has(id)).length,
  };
}

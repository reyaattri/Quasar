import { medicalModules } from "../data/medicalLessons";
import { teachConcepts, whyLadders } from "../data/biologyUnderstanding";
import { labCases } from "../data/caseLab";
import { attemptsOf, conceptId, errorMemory } from "./learning";
import type { Progress } from "./progress";

export type TaskType = "recall" | "repair" | "teach" | "why" | "case" | "learn";

export type Task = {
  id: string;
  type: TaskType;
  minutes: number;
  module: number;
  conceptId?: string;
  title: string;
  reason: string;
  score: number;
};

const DAY = 86_400_000;
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function examProximity(p: Progress, now = new Date()) {
  if (!p.exam) return 0;
  const days = (new Date(p.exam.date).getTime() - now.getTime()) / DAY;
  return days < 0 ? 0 : clamp(1 - days / 30);
}

export function priority(f: { K: number; R: number; E: number; I: number; U: number }) {
  return 100 * (0.25 * f.K + 0.25 * f.R + 0.2 * f.E + 0.2 * f.I + 0.1 * f.U);
}

const prerequisiteValue = [1, 0.7, 0.4];

export function conceptFactors(p: Progress, m: number, c: number, now = new Date()) {
  const id = conceptId(m, c);
  const list = attemptsOf(p, id);
  const open = errorMemory(p).some((e) => e.conceptId === id && !e.resolved);
  const recent = list.slice(-3);
  const K = open
    ? 1
    : recent.length
      ? 1 - recent.filter((a) => a.correct && !a.hinted).length / recent.length
      : 0.5;
  const card = p.cards[id];
  const overdue = card ? (now.getTime() - new Date(card.due).getTime()) / DAY : -1;
  const R = card && overdue >= 0 ? clamp(0.6 + 0.1 * overdue) : 0;
  return {
    K,
    R,
    E: examProximity(p, now),
    I: teachConcepts[m][c].importance,
    U: prerequisiteValue[m] ?? 0.4,
  };
}

export function candidateTasks(p: Progress, now = new Date()): Task[] {
  const tasks: Task[] = [];
  const errors = errorMemory(p).filter((e) => !e.resolved);
  medicalModules.forEach((lesson, m) => {
    const testedCards = lesson.cards.filter(
      (_, c) => attemptsOf(p, conceptId(m, c)).length > 0,
    ).length;
    const scores: number[] = [];
    lesson.cards.forEach((card, c) => {
      const id = conceptId(m, c);
      const f = conceptFactors(p, m, c, now);
      const score = priority(f);
      scores.push(score);
      const list = attemptsOf(p, id);
      const error = errors.find((e) => e.conceptId === id);
      if (error)
        tasks.push({
          id: "repair:" + id,
          type: "repair",
          minutes: 10,
          module: m,
          conceptId: id,
          title: `Repair: ${card.title}`,
          reason: `You've missed this ${error.wrong} times. Explain it back to find exactly where it breaks.`,
          score: score + 10,
        });
      else if (f.R > 0)
        tasks.push({
          id: "recall:" + id,
          type: "recall",
          minutes: 5,
          module: m,
          conceptId: id,
          title: `Recall: ${card.title}`,
          reason: "Due for review. Bring it back before it fades.",
          score,
        });
      else if (
        list.some((a) => a.mode === "recall" && a.correct) &&
        !list.some((a) => a.mode === "teach")
      )
        tasks.push({
          id: "teach:" + id,
          type: "teach",
          minutes: 10,
          module: m,
          conceptId: id,
          title: `Teach back: ${card.title}`,
          reason: "You can recognise the answer. Can you explain it without help?",
          score: score - 5,
        });
    });
    const moduleScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (testedCards === 0)
      tasks.push({
        id: "learn:" + m,
        type: "learn",
        minutes: 10,
        module: m,
        title: `Start: ${lesson.title}`,
        reason:
          m === 0
            ? "New material, and it's the foundation the other lessons build on."
            : "New material you haven't started yet.",
        score: moduleScore - m * 3,
      });
    if (testedCards >= 3) {
      const why = (p.attempts ?? []).filter(
        (a) => a.mode === "why" && whyLadders[m].rungs.some((r) => conceptId(m, r.concept) === a.conceptId),
      );
      if (!why.length || why.slice(-5).some((a) => !a.correct))
        tasks.push({
          id: "why:" + m,
          type: "why",
          minutes: 10,
          module: m,
          title: `Why Ladder: ${whyLadders[m].title}`,
          reason: why.length
            ? "Your last climb broke partway. Try the rungs again."
            : "You know the facts. Now check you know why they're true.",
          score: moduleScore,
        });
      const open = labCases.find(
        (c) => c.module === m && !attemptsOf(p, c.id).some((a) => a.correct),
      );
      if (open)
        tasks.push({
          id: "case:" + open.id,
          type: "case",
          minutes: 10,
          module: m,
          conceptId: open.id,
          title: `Case: ${open.title}`,
          reason: "Use what you learned on a problem you haven't seen before.",
          score: moduleScore - 2,
        });
    }
  });
  return tasks.sort((a, b) => b.score - a.score);
}

export function recoveryState(p: Progress, now = new Date()) {
  const history = [...p.reviews, ...(p.attempts ?? [])];
  if (!history.length) return null;
  const last = Math.max(...history.map((h) => new Date(h.at).getTime()));
  const daysAway = Math.floor((now.getTime() - last) / DAY);
  const recalls = candidateTasks(p, now).filter((t) => t.type === "recall");
  const backlog = recalls.filter(
    (t) => now.getTime() - new Date(p.cards[t.conceptId!].due).getTime() >= DAY,
  ).length;
  return daysAway >= 3 || backlog >= 6 ? { daysAway, overdue: recalls.length } : null;
}

export function buildPlan(
  p: Progress,
  budget: number,
  skipped: string[] = [],
  now = new Date(),
) {
  const recovery = recoveryState(p, now);
  const all = candidateTasks(p, now).filter((t) => !skipped.includes(t.id));
  const chosen: Task[] = [];
  let left = budget;
  const cap = (type: TaskType) => (recovery && type === "recall" ? 4 : 2);
  const fits = (t: Task) =>
    t.minutes <= left &&
    chosen.filter((c) => c.type === t.type).length < cap(t.type) &&
    !(recovery && (t.type === "learn" || t.type === "case") && all.some((a) => a.type === "recall" && !chosen.includes(a)));
  const firstRecall = all.find((t) => t.type === "recall");
  if (firstRecall && fits(firstRecall)) {
    chosen.push(firstRecall);
    left -= firstRecall.minutes;
  }
  for (const t of all) {
    if (chosen.includes(t) || !fits(t)) continue;
    chosen.push(t);
    left -= t.minutes;
  }
  if (!chosen.length && all.length) chosen.push(all[0]);
  const deferred = recovery
    ? all.filter((t) => t.type === "recall" && !chosen.includes(t)).length
    : 0;
  return {
    tasks: chosen,
    spare: all.filter((t) => !chosen.includes(t)),
    recovery: recovery ? { ...recovery, deferred } : null,
  };
}

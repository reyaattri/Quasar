import test from "node:test";
import assert from "node:assert/strict";
import {
  initialProgress,
  recordReview,
  reviveProgress,
  dueIds,
  streak,
  applicationHints,
} from "../src/lib/progress";
import { allFacts, scenes, lessons } from "../src/data/content";
test("curriculum contains exactly two scenes, six cues each and unique facts", () => {
  assert.equal(scenes.length, 2);
  for (const s of scenes) {
    assert.equal(s.facts.length, 6);
    for (const f of s.facts) {
      assert.ok(f.answer >= 0 && f.answer < f.choices.length);
      assert.ok(f.x > 0 && f.x < 100);
      assert.ok(f.y > 0 && f.y < 100);
    }
  }
  assert.equal(new Set(allFacts.map((f) => f.id)).size, 16);
  assert.equal(lessons.length, 6);
});
test("missed recall does not mark mastery and is scheduled sooner", () => {
  const now = new Date("2026-09-10T12:00:00Z");
  const fail = recordReview(initialProgress(), "lucid", false, now);
  const pass = recordReview(initialProgress(), "lucid", true, now);
  assert.equal(fail.mastered.lucid, false);
  assert.equal(fail.attempted.lucid, true);
  assert.equal(pass.mastered.lucid, true);
  assert.ok(fail.cards.lucid.due < pass.cards.lucid.due);
  assert.equal(dueIds(fail, now).length, 0);
  assert.deepEqual(dueIds(fail, new Date(fail.cards.lucid.due.getTime() + 1)), [
    "lucid",
  ]);
});
test("a lapse clears current mastery without erasing history", () => {
  let p = recordReview(
    initialProgress(),
    "lucid",
    true,
    new Date("2026-09-10T12:00Z"),
  );
  p = recordReview(p, "lucid", false, new Date("2026-09-11T12:00Z"));
  assert.equal(p.mastered.lucid, false);
  assert.equal(p.reviews.length, 2);
  assert.equal(p.cards.lucid.reps, 2);
});
test("serialized FSRS dates revive and can be reviewed", () => {
  const p = recordReview(
    initialProgress(),
    "queue",
    true,
    new Date("2026-09-10T12:00Z"),
  );
  const saved = reviveProgress(JSON.stringify(p));
  assert.ok(saved.cards.queue.due instanceof Date);
  assert.ok(saved.cards.queue.last_review instanceof Date);
  assert.doesNotThrow(() =>
    recordReview(saved, "queue", false, new Date("2026-09-12T12:00Z")),
  );
});
test("streak uses calendar days, includes yesterday, and deduplicates practice", () => {
  let p = initialProgress();
  const today = new Date(2026, 8, 10, 12);
  p = recordReview(p, "lucid", true, new Date(2026, 8, 9, 10));
  p = recordReview(p, "stack", true, new Date(2026, 8, 9, 11));
  p = recordReview(p, "queue", true, new Date(2026, 8, 8, 12));
  assert.equal(streak(p, today), 2);
  assert.equal(streak(p, new Date(2026, 8, 11, 12)), 0);
});
test("application hints identify vocabulary without pretending to grade reasoning", () => {
  assert.deepEqual(
    applicationHints("A meticulous edit made it lucid.", [
      ["meticulous"],
      ["lucid"],
    ]),
    [true, true],
  );
  assert.deepEqual(
    applicationHints("Nothing relevant", [["queue"], ["stack"]]),
    [false, false],
  );
});
test("state updates are immutable and do not change another profile", () => {
  const a = initialProgress();
  const b = recordReview(a, "lucid", true);
  assert.equal(a.reviews.length, 0);
  assert.equal(a.mastered.lucid, undefined);
  assert.equal(b.reviews.length, 1);
  assert.equal(initialProgress().reviews.length, 0);
});

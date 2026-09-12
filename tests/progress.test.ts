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
import { checkRoute, journeys } from "../src/data/palaces";
import { parseShoppingList, shoppingJourney } from "../src/lib/shoppingPalace";
import { palaceRooms, objectPoints } from "../src/data/palaceRooms";

test("every world has six distinct rooms with stable object anchors", () => {
  assert.equal(palaceRooms.length, 3);
  assert.equal(objectPoints.length, 3);
  for (const rooms of palaceRooms) {
    assert.equal(rooms.length, 6);
    assert.equal(new Set(rooms.map((room) => room.objects.join("|"))).size, 6);
    for (const room of rooms) {
      assert.equal(room.objects.length, 3);
      assert.ok(room.action.length > 30);
    }
  }
});
test("custom shopping routes preserve quantities and reject oversized or empty lists", () => {
  const items = parseShoppingList("2 loaves of bread, milk\n  carrots  ");
  assert.deepEqual(items, ["2 loaves of bread", "milk", "carrots"]);
  assert.deepEqual(
    shoppingJourney(items).items.map((i) => i.answer),
    items,
  );
  assert.throws(() => parseShoppingList(" , \n"));
  assert.throws(() => parseShoppingList(Array(9).fill("a").join("\n")));
  assert.equal(shoppingJourney(Array(8).fill("rice")).items.length, 8);
});
test("palace pi mapping reconstructs the digits and rejects reordered or missing stops", () => {
  const items = journeys[0].items;
  const answers = items.map((item) => item.answer);
  assert.equal(answers.join(""), "141592653589");
  assert.equal(checkRoute(answers, items), true);
  assert.equal(checkRoute([...answers].reverse(), items), false);
  assert.equal(checkRoute(answers.slice(1), items), false);
});
test("curriculum contains one active scene, six cues each and unique facts", () => {
  assert.equal(scenes.length, 1);
  for (const s of scenes) {
    assert.equal(s.facts.length, 6);
    for (const f of s.facts) {
      assert.ok(f.answer >= 0 && f.answer < f.choices.length);
      assert.ok(f.x > 0 && f.x < 100);
      assert.ok(f.y > 0 && f.y < 100);
    }
  }
  assert.equal(new Set(allFacts.map((f) => f.id)).size, 10);
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

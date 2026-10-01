import type { PalaceItem } from "../data/palaces";
export function parseShoppingList(text: string): string[] {
  const items = text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!items.length) throw new Error("Add at least one shopping item.");
  if (items.length > 8)
    throw new Error(
      "Use up to 8 items for this palace. Split a longer list into another walk.",
    );
  if (items.some((s) => s.length > 60))
    throw new Error(
      "Keep each item under 61 characters so it is easy to recall.",
    );
  return items;
}
const actions = [
  "grows taller than the doorway and bows to let you past",
  "wears roller skates and slides into a fountain with a spectacular splash",
  "sings a very off-key solo while a tiny audience throws confetti",
  "becomes a trampoline; a surprised astronaut bounces above your head",
  "puts on a crown and orders a procession of dancing teaspoons",
  "sneezes so hard that a mountain of glitter falls from the sky",
  "shrinks to the size of a pea and lifts an enormous piano",
  "opens a disco inside a teacup; you can hear the tiny bass line",
];
export function shoppingJourney(items: string[]) {
  return {
    id: "custom-shopping",
    name: "Your shopping-list adventure",
    prompt: "Which shopping item lives here?",
    intro:
      "Your items, in your chosen world. Imagine each action at its fixed stop. Then hide the cues and walk the same route from memory.",
    items: items.map((item, i): PalaceItem => ({
      answer: item,
      object: item,
      symbol: "🛍️",
      story: `Your ${item} ${actions[i]}.`,
      decode: `Stop ${i + 1} holds ${item}. Add its smell, texture or sound to make this picture yours.`,
    })),
  };
}

export const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
export const suits = [
  { mark: "♥", name: "hearts", theme: "a red velvet costume" },
  { mark: "♣", name: "clubs", theme: "a green garden costume" },
  { mark: "♦", name: "diamonds", theme: "a sparkling crystal costume" },
  { mark: "♠", name: "spades", theme: "a black space suit" },
];
export const pegs = [
  "candle",
  "swan",
  "trident",
  "sailboat",
  "glove",
  "elephant trunk",
  "boomerang",
  "snowman",
  "balloon",
  "bat and ball",
  "juggler",
  "queen",
  "king",
];
export const pegIcons = [
  "🕯️",
  "🦢",
  "🔱",
  "⛵",
  "🧤",
  "🐘",
  "🪃",
  "⛄",
  "🎈",
  "🏏",
  "🤹",
  "👑",
  "🤴",
];
export const deck = suits.flatMap((s, si) =>
  ranks.map((rank, ri) => ({
    id: rank + s.mark,
    rank,
    suit: s.mark,
    name: `${rank} of ${s.name}`,
    object: pegs[ri],
    icon: pegIcons[ri],
    hook: `${pegs[ri]} wearing ${s.theme}`,
    red: si === 0 || si === 2,
  })),
);
export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export const rooms = [
  "Entrance",
  "Kitchen",
  "Music room",
  "Library",
  "Garden",
  "Studio",
  "Ballroom",
  "Observatory",
  "Boathouse",
  "Greenhouse",
  "Attic",
  "Tower",
  "Roof terrace",
];
export const anchors = ["door handle", "table", "window", "chair"];
export function cardPlace(i: number) {
  return `${rooms[Math.floor(i / 4)]} · ${anchors[i % 4]}`;
}
export const people = [
  {
    name: "Rose",
    hook: "A rose blooms from her round glasses.",
    feature: "Round glasses",
    color: "#E5A26F",
    skin: "#C27F56",
  },
  {
    name: "Ben",
    hook: "A tiny bell rings BEN, BEN from the tip of his blue beanie.",
    feature: "Blue beanie",
    color: "#70A6D2",
    skin: "#F0C59E",
  },
  {
    name: "Grace",
    hook: "She gracefully balances a teacup on her enormous purple bow.",
    feature: "Purple bow",
    color: "#B59BD5",
    skin: "#784C3B",
  },
  {
    name: "Jack",
    hook: "A jack-in-the-box springs out of his striped collar.",
    feature: "Striped collar",
    color: "#E6B952",
    skin: "#DAA174",
  },
  {
    name: "Ivy",
    hook: "Ivy curls gently around her yellow headphones.",
    feature: "Yellow headphones",
    color: "#92B98F",
    skin: "#EDBC98",
  },
  {
    name: "Max",
    hook: "His moustache stretches to the MAX, wider than the doorway.",
    feature: "Curled moustache",
    color: "#E68D8F",
    skin: "#AB7053",
  },
];
export const phrase = [
  "otter",
  "velvet",
  "rocket",
  "pancake",
  "forest",
  "trumpet",
];
export const phraseIcons = ["🦦", "🧵", "🚀", "🥞", "🌲", "🎺"];
export const phraseHooks = [
  "An otter wears a velvet cape.",
  "The velvet cape catches a rocket.",
  "The rocket lands in a pancake.",
  "The pancake grows into a forest.",
  "The forest plays a giant trumpet.",
  "Hear the trumpet call the otter back to the start.",
];
export const pairs = [
  [
    "Clara",
    "Cara",
    "CLARA blasts a CLARINET while CARA drives a tiny CAR around her shoes. Hear the extra “L” as the clarinet squeals.",
  ],
  [
    "Theo",
    "Leo",
    "THEO peers through a THEO-scope telescope; LEO the lion leaps over it and roars his own name.",
  ],
  [
    "Mina",
    "Nina",
    "MINA carries a MINNOW in a teacup; NINA points to her KNEE while the fish splashes it.",
  ],
  [
    "Maya",
    "Mia",
    "MAYA dances around a MAYPOLE; MIA answers with a giant MEOWING cat.",
  ],
  [
    "Ari",
    "Aria",
    "ARI fires an ARROW; ARIA catches it by singing a long opera note that adds the final “a.”",
  ],
  [
    "Sara",
    "Zara",
    "SARA saws a sandwich in half; ZARA zips both halves into a glittering ZIPPER bag. Feel the S buzz into Z.",
  ],
];

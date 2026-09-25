import { scenes } from "./content";
export const worlds = [
  {
    id: "dojo",
    name: "The quiet dojo",
    caption: "Watercolour gardens · a peaceful instrumental score",
    lore: "A hillside school where every room smells of cedar and tea. Quiet enough to hear a single bell, so loud images stand out.",
    color: "#DCE8CA",
    ink: "#254D3C",
    places: [
      "Garden gate",
      "Doll workshop",
      "Garden conservatory",
      "Tea house",
      "Rice kitchen",
      "Dojo hall",
    ],
  },
  {
    id: "egypt",
    name: "Beyond the dunes",
    caption: "Golden pixel ruins · desert chamber music",
    lore: "A sandstone temple half-swallowed by dunes. Torchlight, echoing chambers and treasure rooms built for things you must not lose.",
    color: "#F4D59E",
    ink: "#674321",
    places: [
      "Sandstone arch",
      "Mosaic workshop",
      "Lotus conservatory",
      "Royal wardrobe",
      "Scribe library",
      "Pyramid chamber",
    ],
  },
  {
    id: "neon",
    name: "Midnight rooftops",
    caption: "Neon pixel city · a nighttime synth score",
    lore: "Rooftops above a city that never sleeps. Every stop hums, glows or sells something, so nothing you leave here stays still.",
    color: "#D9D2FA",
    ink: "#352D65",
    places: [
      "Entrance steps",
      "Ramen stall",
      "Vending arcade",
      "Neon greenhouse",
      "Antenna workshop",
      "Moon observatory",
    ],
  },
] as const;
export type WorldId = (typeof worlds)[number]["id"];
export const loci = [
  { x: 50, y: 87 },
  { x: 25, y: 72 },
  { x: 70, y: 58 },
  { x: 28, y: 43 },
  { x: 68, y: 28 },
  { x: 48, y: 13 },
];
export const worldRoutes = [
  [
    { x: 50, y: 87 },
    { x: 25, y: 62 },
    { x: 13, y: 21 },
    { x: 16, y: 42 },
    { x: 74, y: 39 },
    { x: 50, y: 10 },
  ],
  [
    { x: 50, y: 83 },
    { x: 33, y: 62 },
    { x: 29, y: 26 },
    { x: 21, y: 43 },
    { x: 75, y: 38 },
    { x: 50, y: 11 },
  ],
  [
    { x: 50, y: 85 },
    { x: 71, y: 63 },
    { x: 15, y: 33 },
    { x: 76, y: 37 },
    { x: 82, y: 22 },
    { x: 48, y: 11 },
  ],
];
export type PalaceItem = {
  answer: string;
  object: string;
  symbol: string;
  story: string;
  decode: string;
};
export const journeys: {
  id: string;
  name: string;
  intro: string;
  prompt: string;
  items: PalaceItem[];
}[] = [
  {
    id: "pi",
    name: "A palace for pi",
    intro:
      "Remember 3 first. Then store six pairs: the first 12 decimal digits. Use consonant sounds, not spelling; vowels do not count.",
    prompt: "Which two digits live here?",
    items: [
      {
        answer: "14",
        object: "Tyre",
        symbol: "🛞",
        story:
          "An enormous tyre rolls up and politely bows. It squeaks louder than a mouse.",
        decode: "Tyre → T (1), R (4). Vowels are fillers.",
      },
      {
        answer: "15",
        object: "Doll",
        symbol: "🪆",
        story:
          "A tiny doll lifts a giant doll. The giant is absolutely terrified of heights.",
        decode: "Doll → D (1), L (5). Double L is one sound.",
      },
      {
        answer: "92",
        object: "Bun",
        symbol: "🥯",
        story:
          "A bun grows legs and runs away from a hungry cat. Breakfast has other plans.",
        decode: "Bun → B (9), N (2).",
      },
      {
        answer: "65",
        object: "Shell",
        symbol: "🐚",
        story: "A seashell sings opera so loudly that your shoes vibrate.",
        decode: "Shell → SH (6), L (5). SH is one sound.",
      },
      {
        answer: "35",
        object: "Mule",
        symbol: "🫏",
        story:
          "A mule wears roller skates and insists it is a professional dancer.",
        decode: "Mule → M (3), L (5).",
      },
      {
        answer: "89",
        object: "VIP",
        symbol: "🕶️",
        story:
          "A cat in sunglasses rolls out its own red carpet. Naturally, it is the VIP.",
        decode:
          "Say the word “vip” → V (8), P (9). Do not say the letter names.",
      },
    ],
  },
  {
    id: "shopping",
    name: "The runaway shopping list",
    intro:
      "Practise the method of loci. Give one ridiculous object a fixed address, then walk the same route to retrieve the list in order.",
    prompt: "Which shopping item lives here?",
    items: [
      {
        answer: "lemons",
        object: "Lemons",
        symbol: "🍋",
        story:
          "Lemons bounce like tennis balls and spray lemonade at your ankles.",
        decode: "Feel the cold splash. The first stop holds lemons.",
      },
      {
        answer: "bread",
        object: "Bread",
        symbol: "🍞",
        story: "A loaf uses two slices as wings. It is very bad at landing.",
        decode: "Hear the flapping crust. The second stop holds bread.",
      },
      {
        answer: "milk",
        object: "Milk",
        symbol: "🥛",
        story: "A tiny milk waterfall fills a cat-sized swimming pool.",
        decode: "Picture the white waterfall. The third stop holds milk.",
      },
      {
        answer: "eggs",
        object: "Eggs",
        symbol: "🥚",
        story: "Six eggs rehearse a tap dance without cracking.",
        decode: "Hear the tapping shells. The fourth stop holds eggs.",
      },
      {
        answer: "carrots",
        object: "Carrots",
        symbol: "🥕",
        story: "Carrots launch like rockets, leaving orange confetti.",
        decode: "Watch the orange rockets. The fifth stop holds carrots.",
      },
      {
        answer: "rice",
        object: "Rice",
        symbol: "🍚",
        story:
          "Rice grains hold a microscopic disco. You are too tall to get in.",
        decode: "Imagine the tiny dancers. The sixth stop holds rice.",
      },
    ],
  },
  ...scenes.map((scene) => ({
    id: scene.id,
    name: scene.subject + " memory walk",
    intro:
      "Reuse your six familiar places to recall these concepts. Picture the action at its numbered stop, then retrieve the concept with the cue hidden.",
    prompt: "Which word or concept lives here?",
    items: scene.facts.map((fact, index) => ({
      answer: fact.word,
      object: fact.cue,
      symbol: ["💡", "🔎", "🫧", "🌱", "🪙", "↔️"][index],
      story: fact.story,
      decode: fact.word + ": " + fact.definition,
    })),
  })),
];
export const normalizeRecall = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s.,]/g, "");
export function checkRoute(values: string[], items: PalaceItem[]) {
  return (
    values.length === items.length &&
    values.every(
      (value, i) => normalizeRecall(value) === normalizeRecall(items[i].answer),
    )
  );
}

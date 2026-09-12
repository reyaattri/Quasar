export type ArtStyle = "storybook" | "doodle";
export type Fact = {
  id: string;
  word: string;
  definition: string;
  cue: string;
  story: string;
  technique: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  x: number;
  y: number;
  sceneId: string;
};
export type SceneData = {
  id: string;
  subject: string;
  title: string;
  subtitle: string;
  duration: string;
  color: string;
  facts: Fact[];
  application: {
    question: string;
    hint: string;
    sample: string;
    keywords: string[][];
  };
};
const satRows = [
  [
    "lucid",
    "Lucid",
    "Clear and easy to understand",
    "The clear lantern",
    "Lift a perfectly clear lantern. Its light makes a tangled explanation suddenly easy to follow. Clear light, clear meaning: lucid.",
    "Which explanation is lucid?",
    [
      "One that contradicts itself",
      "One that is clear and easy to follow",
      "One that leaves out every detail",
    ],
    1,
    "Lucid describes clear thought or expression.",
  ],
  [
    "meticulous",
    "Meticulous",
    "Extremely careful about details",
    "The watch inspector",
    "Inspect every tiny gear in a pocket watch. No speck escapes the magnifying glass. That extraordinary attention to detail is meticulous.",
    "A meticulous editor would…",
    [
      "check every citation and punctuation mark",
      "skim only the title",
      "guess at missing information",
    ],
    0,
    "Meticulous means paying very close attention to details.",
  ],
  [
    "ephemeral",
    "Ephemeral",
    "Lasting for a very short time",
    "The fading butterfly",
    "A butterfly appears, flutters once, and dissolves into dots. You have only a moment to see it. Its brief existence is ephemeral.",
    "Which thing is most ephemeral?",
    ["A mountain range", "A century-old archive", "A soap bubble"],
    2,
    "Ephemeral things last only briefly.",
  ],
  [
    "resilient",
    "Resilient",
    "Able to recover after difficulty",
    "The spring-back sapling",
    "A pot breaks, but the bent sapling springs upright again. You tie a bandage around its trunk. The recovering tree is resilient.",
    "After a setback, a resilient team…",
    [
      "never experiences stress",
      "adapts and recovers",
      "stops trying permanently",
    ],
    1,
    "Resilience is recovery after difficulty, not the absence of difficulty.",
  ],
  [
    "avarice",
    "Avarice",
    "Extreme greed for wealth",
    "The grasping hand",
    "A giant hand clutches a treasure chest so tightly it cannot share a single coin. We call this excessive hunger for riches avarice.",
    "Which action best shows avarice?",
    [
      "Saving for a useful tool",
      "Giving spare coins away",
      "Hoarding wealth at others’ expense",
    ],
    2,
    "Avarice is excessive greed, particularly for money or riches.",
  ],
  [
    "ambiguous",
    "Ambiguous",
    "Open to more than one interpretation",
    "The two-way sign",
    "The sign points both left and right with no explanation. You can read its message two ways. A message with multiple plausible meanings is ambiguous.",
    "“I saw her duck” is ambiguous because…",
    [
      "duck could mean a bird or an action",
      "the sentence has no verb",
      "it must be false",
    ],
    0,
    "Ambiguity means multiple possible interpretations.",
  ],
] as const;
function makeFacts(rows: readonly (readonly any[])[], sceneId: string): Fact[] {
  return rows.map((r, i) => ({
    id: r[0],
    word: r[1],
    definition: r[2],
    cue: r[3],
    story: r[4],
    technique: "Method of loci + visual association",
    question: r[5],
    choices: [...r[6]],
    answer: r[7],
    explanation: r[8],
    x: [18, 50, 82][i % 3],
    y: i < 3 ? 25 : 73,
    sceneId,
  }));
}
export const scenes: SceneData[] = [
  {
    id: "market",
    subject: "SAT vocabulary",
    title: "The curious little market",
    subtitle: "Six curious objects. Six words that stick.",
    duration: "8 min",
    color: "#EEDBAC",
    facts: makeFacts(satRows, "market"),
    application: {
      question:
        "A writer revises a confusing report, checking every detail until it is easy to understand. Use both “meticulous” and “lucid” to explain what changed.",
      hint: "Describe the careful process and the clarity of the result.",
      sample:
        "The writer’s meticulous revision turned the confusing report into a lucid explanation.",
      keywords: [["meticulous"], ["lucid"]],
    },
  },
];
export const extraFacts: Fact[] = [
  {
    id: "candid",
    word: "Candid",
    definition: "Truthful and straightforward",
    cue: "An open notebook",
    story:
      "Open a notebook with nothing hidden between its pages. A candid answer is open and honest.",
    technique: "Visual association",
    question: "A candid response is…",
    choices: ["evasive", "honest", "careless"],
    answer: 1,
    explanation: "Candid means frank and truthful.",
    x: 18,
    y: 25,
    sceneId: "market",
  },
  {
    id: "pragmatic",
    word: "Pragmatic",
    definition: "Focused on practical results",
    cue: "The working watch",
    story:
      "Choose the watch that actually works over the fanciest display. A pragmatic choice solves the real problem.",
    technique: "Visual association",
    question: "A pragmatic solution emphasizes…",
    choices: ["practical results", "appearances only", "impossible ideals"],
    answer: 0,
    explanation: "Pragmatic approaches focus on what works in practice.",
    x: 50,
    y: 25,
    sceneId: "market",
  },
  {
    id: "tenacious",
    word: "Tenacious",
    definition: "Persistent; holding firmly",
    cue: "The firm grasp",
    story:
      "Hold onto a clue even when the investigation gets difficult. Picture the firm grip: tenacious means persistent.",
    technique: "Visual association",
    question: "A tenacious researcher…",
    choices: [
      "quits at the first obstacle",
      "ignores all evidence",
      "persists through difficulty",
    ],
    answer: 2,
    explanation: "Tenacious describes persistence or a firm hold.",
    x: 50,
    y: 73,
    sceneId: "market",
  },
  {
    id: "elusive",
    word: "Elusive",
    definition: "Difficult to find, catch, or achieve",
    cue: "The disappearing butterfly",
    story:
      "The butterfly slips away whenever you reach for it. Something elusive is hard to catch or pin down.",
    technique: "Visual association",
    question: "An elusive answer is…",
    choices: ["hard to find", "obvious", "always incorrect"],
    answer: 0,
    explanation: "Elusive refers to difficulty finding or attaining something.",
    x: 82,
    y: 25,
    sceneId: "market",
  },
];
export const allFacts = [...scenes.flatMap((s) => s.facts), ...extraFacts];
export const lessons = [
  {
    title: "Give memories a hook",
    type: "Peg system",
    icon: "pin",
    body: "Learn a fixed list of familiar pegs, then hang new information on them. For a rhyme list, one is a bun, two is a shoe, three is a tree.",
    example:
      "To remember lemons first, imagine a bun bursting with bright yellow lemons.",
    challenge:
      "Picture a shoe overflowing with your favorite snack. What occupies your second peg?",
  },
  {
    title: "Turn numbers into pictures",
    type: "Phonetic peg",
    icon: "key",
    body: "In the major system, consonant sounds encode digits: 0 s/z, 1 t/d, 2 n, 3 m, 4 r, 5 l, 6 sh/ch/j, 7 k/g, 8 f/v, 9 p/b. Vowels help form words.",
    example:
      "12 can become “tin”: t = 1, n = 2. Picture a huge tin to remember that pair.",
    challenge:
      "Say “moon.” M is 3 and N is 2, so its consonant sounds encode 32. Use invented practice numbers, never a real PIN.",
  },
  {
    title: "Link a tiny, strange story",
    type: "Chain method",
    icon: "link",
    body: "Connect each item to the next through an exaggerated action. The end of one picture becomes the beginning of another.",
    example:
      "A lemon rolls into a shoe. The shoe kicks a kite. The kite lifts a book.",
    challenge: "Replay the chain without looking: lemon → shoe → kite → book.",
  },
  {
    title: "Let the initials guide you",
    type: "Acrostic method",
    icon: "book",
    body: "Take the first letter of each item and make a memorable sentence. Keep the order consistent and practice recovering the original items.",
    example: "For North, East, South, West: “New Explorers Seek Wonders.”",
    challenge: "Say the sentence, then recover the four directions.",
  },
  {
    title: "Make a name memorable",
    type: "Personal Nick Name",
    icon: "smile",
    body: "Privately connect a new name with a vivid, friendly image. Use a sound association that makes sense to you, then link it to the person.",
    example:
      "For someone named Rose, imagine them holding an enormous rose. Recall the image when you meet again.",
    challenge:
      "Invent a respectful association for a fictional name. Avoid making assumptions about someone’s appearance.",
  },
  {
    title: "Take a walk through memory",
    type: "Method of loci",
    icon: "map",
    body: "Choose a familiar route and fixed locations along it. Place one vivid image at each stop. Mentally walk the same route to retrieve the information.",
    example:
      "At the market: lantern → watch → butterfly → sapling → chest → signpost.",
    challenge:
      "Your Quasar scenes are ready-made memory routes. Tap, picture, recall, then return later.",
  },
];

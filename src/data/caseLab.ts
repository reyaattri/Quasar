import { medicalModules, type MedicalModule } from "./medicalLessons";

export type LabCase = MedicalModule["case"] & { id: string; module: number };

const extra: LabCase[] = [
  {
    id: "bio-case-0-b",
    module: 0,
    title: "The sprinter's last hundred metres",
    prompt:
      "In an all-out sprint, a runner's leg muscles use ATP faster than blood can deliver oxygen to them. The muscles keep contracting for a while, producing lactate. Which explanation fits?",
    choices: [
      "Muscles stop making ATP completely until oxygen returns",
      "Glycolysis keeps running and fermentation regenerates what it needs, making a little ATP per glucose without oxygen",
      "The mitochondria switch to photosynthesis inside the muscle",
      "Lactate is converted directly into oxygen for the electron transport chain",
    ],
    answer: 1,
    hint: "Climb back to the oxygen rung: without the final electron acceptor, which earlier stage can still make some ATP?",
    explanation:
      "When oxygen can't keep up, the electron transport chain slows. Glycolysis still makes a small amount of ATP, and fermentation to lactate regenerates NAD⁺ so glycolysis can continue. It yields far less ATP per glucose than aerobic respiration.",
  },
  {
    id: "bio-case-1-b",
    module: 1,
    title: "The heat-loving microbe",
    prompt:
      "Two DNA samples are the same length. Sample A is 62% G + C; sample B is 35% G + C. A lab heats both slowly. Which separates into single strands at the higher temperature, and why?",
    choices: [
      "Sample B, because A–T pairs are larger and harder to pull apart",
      "Both at the same temperature, because the samples are the same length",
      "Sample A, because G–C pairs hold with three hydrogen bonds and stack more stably than A–T pairs",
      "Neither, because heat cannot separate DNA strands",
    ],
    answer: 2,
    hint: "Count the hands: A and T hold with two, G and C with three.",
    explanation:
      "DNA with more G–C pairs needs more energy to separate. G–C pairs form three hydrogen bonds and contribute stronger base stacking, so the melting temperature rises with G + C content.",
  },
  {
    id: "bio-case-2-b",
    module: 2,
    title: "The mutation that changed nothing",
    prompt:
      "A single base change turns the codon GAA into GAG in a gene's mRNA. Both codons specify glutamic acid. What happens to the protein's amino acid sequence?",
    choices: [
      "It stays the same, because the genetic code is redundant",
      "Every amino acid after that point changes",
      "Translation stops at that codon",
      "The protein is built from RNA bases instead of amino acids",
    ],
    answer: 0,
    hint: "Recheck the codon rule: several codons can specify the same amino acid.",
    explanation:
      "This is a silent (synonymous) substitution: GAA and GAG both code for glutamic acid, so the amino acid sequence doesn't change. It's a substitution, not a deletion, so the reading frame stays put. Such changes can occasionally matter in other ways, for example by affecting splicing or translation speed.",
  },
];

export const labCases: LabCase[] = medicalModules.flatMap((m, i) => [
  { ...m.case, id: `bio-case-${i}`, module: i },
  ...extra.filter((c) => c.module === i),
]);

export const findCase = (id: string) => labCases.find((c) => c.id === id);

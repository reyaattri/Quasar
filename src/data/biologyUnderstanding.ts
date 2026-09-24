export type KeyPoint = {
  text: string;
  keywords: string[];
  ask: string;
};

export type TeachConcept = {
  prompt: string;
  importance: number;
  keyPoints: [KeyPoint, KeyPoint, KeyPoint];
};

export type Rung = {
  concept: number;
  prompt: string;
  choices: string[];
  answer: number;
  explain: string;
};

export const rungLevels = [
  "What happens?",
  "Why does it happen?",
  "How does it work?",
  "What if it fails?",
  "Use it somewhere new",
];

const kp = (text: string, keywords: string[], ask: string): KeyPoint => ({
  text,
  keywords,
  ask,
});

export const teachConcepts: TeachConcept[][] = [
  [
    {
      prompt:
        "Explain how a prokaryotic cell differs from a eukaryotic cell, and what they have in common.",
      importance: 0.8,
      keyPoints: [
        kp(
          "Eukaryotic cells keep DNA inside a membrane-bound nucleus.",
          ["nucleus", "nuclear", "membrane-bound", "membrane bound", "organelle"],
          "Where does a eukaryotic cell keep its DNA, and what surrounds it?",
        ),
        kp(
          "Prokaryotes have no nucleus; their DNA sits in a nucleoid region.",
          ["nucleoid", "no nucleus", "without a nucleus", "lack a nucleus", "lacks a nucleus", "not have a nucleus", "don't have a nucleus"],
          "If a bacterium has no nucleus, where is its DNA?",
        ),
        kp(
          "Both have a plasma membrane, cytoplasm, ribosomes and DNA.",
          ["both", "ribosome", "cytoplasm", "plasma membrane", "in common"],
          "Which parts do all cells share, whatever their type?",
        ),
      ],
    },
    {
      prompt:
        "Explain how about two metres of DNA fits inside a nucleus without losing information.",
      importance: 0.5,
      keyPoints: [
        kp(
          "DNA associates with proteins such as histones.",
          ["protein", "histone"],
          "What does DNA wrap around or associate with to be organized?",
        ),
        kp(
          "It is folded and compacted through several levels of packing.",
          ["fold", "pack", "compact", "coil", "condens", "wrap"],
          "What happens to the molecule's shape to make it fit?",
        ),
        kp(
          "No bases are deleted; the sequence is kept and regions stay accessible.",
          ["not delet", "sequence", "access", "information", "usable", "still be used", "not removed", "no bases"],
          "Does the cell throw away bases to make DNA fit? What must still be possible?",
        ),
      ],
    },
    {
      prompt: "Explain how green bark helps a palo verde tree survive drought.",
      importance: 0.4,
      keyPoints: [
        kp(
          "The bark contains chlorophyll and can photosynthesize.",
          ["chlorophyll", "photosynth"],
          "What is in the green bark, and what process can it carry out?",
        ),
        kp(
          "Dropping leaves reduces water loss during drought.",
          ["water loss", "lose less water", "losing water", "lose water", "transpiration", "shed", "drop"],
          "Why would a tree benefit from losing its leaves when water is scarce?",
        ),
        kp(
          "The stems keep capturing light after the leaves fall.",
          ["stem", "trunk", "keep", "continue", "still"],
          "Once the leaves are gone, which part keeps catching light?",
        ),
      ],
    },
    {
      prompt: "Explain why blood can look dark or greenish deep underwater.",
      importance: 0.3,
      keyPoints: [
        kp(
          "Water absorbs red wavelengths more strongly than blue-green ones.",
          ["absorb", "wavelength", "filter", "red light"],
          "What does water do to red light on the way down?",
        ),
        kp(
          "Little red light reaches the blood to be reflected to the eye.",
          ["reflect", "reach", "less red", "little red", "no red", "eye"],
          "For something to look red, what light must reach it and bounce back?",
        ),
        kp(
          "The blood's pigment has not changed; only the available light has.",
          ["not change", "doesn't change", "does not change", "hasn't changed", "has not changed", "still red", "same", "pigment"],
          "Did the blood itself turn a different colour?",
        ),
      ],
    },
    {
      prompt:
        "Explain what goes into photosynthesis, what comes out, and where the energy comes from.",
      importance: 0.9,
      keyPoints: [
        kp(
          "Light energy is captured by chlorophyll in the chloroplast.",
          ["light", "sun", "chlorophyll", "chloroplast"],
          "Where does the energy for photosynthesis come from, and what captures it?",
        ),
        kp(
          "Carbon dioxide and water are the inputs.",
          ["carbon dioxide", "co2", "co₂", "water"],
          "Which two substances does the plant take in to build sugar?",
        ),
        kp(
          "Sugar (carbohydrate) is made and oxygen is released.",
          ["sugar", "glucose", "carbohydrate", "oxygen", "o2", "o₂"],
          "What does the plant make, and what gas is released?",
        ),
      ],
    },
    {
      prompt: "Explain what cellular respiration does and what oxygen's job is.",
      importance: 0.9,
      keyPoints: [
        kp(
          "Energy is transferred from fuel such as sugar into ATP.",
          ["atp"],
          "Into which molecule does respiration transfer usable energy?",
        ),
        kp(
          "Oxygen is the final electron acceptor in the electron transport chain.",
          ["final electron", "electron acceptor", "accepts electron", "accept electron", "electron transport"],
          "What does oxygen do at the very end of the electron transport chain?",
        ),
        kp(
          "It happens in mitochondria, and plants respire too.",
          ["mitochondri", "plant"],
          "Which organelle does this, and do plant cells need it too?",
        ),
      ],
    },
  ],
  [
    {
      prompt:
        "Explain what an X-ray diffraction pattern can and cannot tell you about DNA.",
      importance: 0.4,
      keyPoints: [
        kp(
          "X-rays scatter off an ordered, repeating sample.",
          ["scatter", "diffract", "repeat", "ordered", "regular"],
          "What happens to X-rays when they pass through an ordered sample?",
        ),
        kp(
          "The pattern constrains spacing and shape, consistent with a helix.",
          ["helix", "helical", "spacing", "dimension", "shape", "constrain"],
          "What kind of information about the molecule does the pattern hold?",
        ),
        kp(
          "It is evidence to interpret, not a direct photo or the sequence.",
          ["not a photo", "not a picture", "not a direct", "interpret", "not the sequence", "evidence", "clue"],
          "Is a diffraction image a photograph of the atoms, or something else?",
        ),
      ],
    },
    {
      prompt: "Explain how the double-helix model of DNA was worked out.",
      importance: 0.5,
      keyPoints: [
        kp(
          "Diffraction data from Franklin and Gosling constrained its dimensions.",
          ["franklin", "gosling", "diffraction", "x-ray", "photo 51"],
          "Whose experimental images constrained the shape and size?",
        ),
        kp(
          "Chargaff's base ratios constrained how bases pair.",
          ["chargaff", "ratio"],
          "Which measurements showed that A matched T and G matched C?",
        ),
        kp(
          "Watson and Crick built a model that combined several researchers' evidence.",
          ["watson", "crick", "model", "combin", "together", "several", "many"],
          "Who proposed the model, and did one person's data build it?",
        ),
      ],
    },
    {
      prompt:
        "Explain what a DNA nucleotide is made of and how nucleotides form a strand.",
      importance: 0.7,
      keyPoints: [
        kp(
          "A phosphate group.",
          ["phosphate"],
          "What part of a nucleotide carries the negative charge in the backbone?",
        ),
        kp(
          "A deoxyribose sugar.",
          ["deoxyribose", "sugar"],
          "Which five-carbon molecule sits at the centre of a nucleotide?",
        ),
        kp(
          "One nitrogenous base (A, T, C or G); sugar-phosphate links form the backbone.",
          ["base", "backbone", "adenine", "thymine", "guanine", "cytosine"],
          "Which part of the nucleotide carries the sequence information?",
        ),
      ],
    },
    {
      prompt:
        "Explain DNA's base-pairing rules and why they keep the double helix an even width.",
      importance: 0.9,
      keyPoints: [
        kp(
          "Adenine pairs with thymine; cytosine pairs with guanine.",
          ["a-t", "a–t", "a with t", "a and t", "adenine", "g-c", "c-g", "g–c", "c–g", "guanine", "cytosine"],
          "Which base does A pair with, and which does C pair with?",
        ),
        kp(
          "A–T forms two hydrogen bonds and G–C forms three.",
          ["hydrogen", "two bond", "three bond", "2 bond", "3 bond"],
          "What kind of bonds hold the partners together, and how many in each pair?",
        ),
        kp(
          "Each pair joins a purine with a pyrimidine, so the width stays constant; the strands are antiparallel.",
          ["purine", "pyrimidine", "width", "antiparallel", "opposite direction", "large", "small"],
          "Why can't two large bases pair with each other without distorting the ladder?",
        ),
      ],
    },
    {
      prompt: "Explain how eukaryotic DNA is packaged into chromosomes.",
      importance: 0.6,
      keyPoints: [
        kp(
          "DNA wraps around histone proteins.",
          ["histone"],
          "What protein spools does DNA wrap around?",
        ),
        kp(
          "Each wrapped unit is a nucleosome, like beads on a string.",
          ["nucleosome", "bead"],
          "What is one unit of DNA wrapped around a histone core called?",
        ),
        kp(
          "Chromatin coils and folds further; a metaphase chromosome is the most condensed state.",
          ["chromatin", "coil", "fold", "condens", "compact"],
          "What happens after the beads form, to make a chromosome?",
        ),
      ],
    },
    {
      prompt:
        "Explain how prokaryotic and eukaryotic chromosomes differ in shape and location.",
      importance: 0.6,
      keyPoints: [
        kp(
          "Most prokaryotes have a main circular chromosome.",
          ["circular", "circle", "loop", "ring"],
          "What shape is a typical bacterial chromosome?",
        ),
        kp(
          "It sits in a nucleoid, with no nuclear membrane around it.",
          ["nucleoid", "no nucleus", "no nuclear", "without a nuclear", "not enclosed", "cytoplasm"],
          "Where is the bacterial chromosome, and what doesn't surround it?",
        ),
        kp(
          "Eukaryotic chromosomes are linear, packed with histones inside a nucleus.",
          ["linear", "histone", "straight"],
          "What shape are eukaryotic chromosomes, and what are they packed with?",
        ),
      ],
    },
  ],
  [
    {
      prompt: "Explain what happens when DNA replication begins.",
      importance: 0.7,
      keyPoints: [
        kp(
          "Replication starts at origins and usually runs in both directions.",
          ["origin", "both direction", "two direction", "bidirection"],
          "Where along the DNA does replication start?",
        ),
        kp(
          "Helicase separates the two strands at the replication fork.",
          ["helicase", "unzip", "unwind", "separat", "fork"],
          "Which enzyme opens the double helix, and what does it do?",
        ),
        kp(
          "Other proteins stabilize single strands and relieve twisting; opening is not copying.",
          ["binding protein", "topoisomerase", "twist", "stabiliz", "polymerase", "not copying"],
          "Once the strands are open, what stops them snapping back or over-twisting — and what actually builds new DNA?",
        ),
      ],
    },
    {
      prompt: "Explain what semiconservative replication means.",
      importance: 0.8,
      keyPoints: [
        kp(
          "Each old strand serves as a template.",
          ["template"],
          "What job does each original strand do during copying?",
        ),
        kp(
          "Each daughter molecule has one old strand and one new strand.",
          ["one old", "one new", "half", "parental", "original strand", "old and new", "old and a new"],
          "What does each finished double helix contain?",
        ),
        kp(
          "Complementary base pairing lets each strand specify its partner.",
          ["complement", "base pair", "pairing", "pairs with"],
          "How does an old strand decide which bases go into the new one?",
        ),
      ],
    },
    {
      prompt:
        "Explain why one new DNA strand is built continuously and the other in fragments.",
      importance: 0.8,
      keyPoints: [
        kp(
          "DNA polymerase only adds to a 3′ end, so new DNA grows 5′→3′.",
          ["3′", "3'", "three prime", "5 to 3", "5' to 3'", "5′ to 3′"],
          "To which end of a growing strand can DNA polymerase add nucleotides?",
        ),
        kp(
          "The two template strands are antiparallel.",
          ["antiparallel", "opposite direction", "opposite orientation", "run opposite"],
          "How are the two template strands oriented relative to each other?",
        ),
        kp(
          "The lagging strand is made in fragments that ligase later joins.",
          ["fragment", "okazaki", "lagging", "ligase", "joined"],
          "What happens on the strand that runs the 'wrong' way for polymerase?",
        ),
      ],
    },
    {
      prompt: "Explain how RNA polymerase makes RNA from a gene.",
      importance: 0.9,
      keyPoints: [
        kp(
          "It reads one DNA template strand, 3′→5′.",
          ["template"],
          "Which DNA strand does RNA polymerase read?",
        ),
        kp(
          "The RNA is built 5′→3′, complementary to the template.",
          ["complement", "5 to 3", "5' to 3'", "5′ to 3′", "5′→3′", "pair"],
          "How does the RNA sequence relate to the template it was read from?",
        ),
        kp(
          "RNA uses uracil instead of thymine and matches the coding strand.",
          ["uracil", " u ", "u instead", "coding strand", "instead of t"],
          "Which base does RNA use where DNA would have thymine?",
        ),
      ],
    },
    {
      prompt: "Explain how a ribosome builds a protein from an mRNA.",
      importance: 0.9,
      keyPoints: [
        kp(
          "The ribosome reads mRNA codons, three bases at a time.",
          ["codon", "three base", "triplet", "three letter", "3 base"],
          "In what size of units does the ribosome read the mRNA?",
        ),
        kp(
          "tRNAs match anticodons to codons and bring amino acids.",
          ["trna", "anticodon", "transfer rna"],
          "What molecule delivers each amino acid, and how does it find the right codon?",
        ),
        kp(
          "The ribosome links amino acids into a polypeptide; a start codon sets the reading frame.",
          ["amino acid", "polypeptide", "peptide", "start codon", "reading frame"],
          "What does the ribosome build, and what sets where reading begins?",
        ),
      ],
    },
    {
      prompt:
        "Explain why detergent and cold alcohol let you see DNA from a strawberry.",
      importance: 0.3,
      keyPoints: [
        kp(
          "Mashing and detergent break open cell and nuclear membranes.",
          ["detergent", "soap", "membrane", "lipid"],
          "What does the detergent break apart, and why?",
        ),
        kp(
          "Salt helps separate DNA from proteins; filtering removes debris.",
          ["salt", "filter", "protein", "debris"],
          "What removes the solid bits and helps free DNA from proteins?",
        ),
        kp(
          "DNA is poorly soluble in cold alcohol, so many molecules clump into visible strands.",
          ["insoluble", "soluble", "precipitat", "clump", "many molecules"],
          "Why do strands appear where the alcohol meets the mixture?",
        ),
      ],
    },
  ],
];

export const whyLadders: { title: string; rungs: Rung[] }[] = [
  {
    title: "Where cells get usable energy",
    rungs: [
      {
        concept: 5,
        prompt: "What does cellular respiration produce that cells spend on work?",
        choices: ["Sunlight", "ATP, an energy-transfer molecule", "New DNA"],
        answer: 1,
        explain:
          "Respiration transfers energy from fuel molecules into ATP, which cells use to power work. ATP moves energy; it doesn't store it permanently.",
      },
      {
        concept: 5,
        prompt:
          "Why do plant cells need mitochondria when they already have chloroplasts?",
        choices: [
          "Mitochondria make the sugar and chloroplasts burn it",
          "Plants only respire at night, so mitochondria are a backup",
          "Chloroplasts store energy in sugar; mitochondria transfer it into ATP the whole cell can use",
        ],
        answer: 2,
        explain:
          "Photosynthesis stores energy in sugar. Respiration releases it as ATP. Plant cells respire all the time, day and night, so they need both organelles.",
      },
      {
        concept: 5,
        prompt: "In aerobic respiration, what does oxygen actually do?",
        choices: [
          "It is the final electron acceptor at the end of the electron transport chain",
          "It becomes the carbon in glucose",
          "It is converted directly into ATP",
        ],
        answer: 0,
        explain:
          "Electrons flow down the electron transport chain and are finally passed to oxygen, forming water. That flow powers ATP production.",
      },
      {
        concept: 5,
        prompt:
          "A cell that relies on aerobic respiration runs out of oxygen. What happens first?",
        choices: [
          "The cell starts photosynthesizing inside its mitochondria",
          "Electrons have nowhere to go, the chain backs up, and ATP production drops sharply",
          "ATP production rises because oxygen was slowing it down",
        ],
        answer: 1,
        explain:
          "Without a final electron acceptor the chain stalls. Many cells fall back on fermentation, which makes far less ATP per sugar.",
      },
      {
        concept: 4,
        prompt:
          "A plant sits in a sealed jar in bright light. Over a day, the oxygen in the jar rises. Why?",
        choices: [
          "The plant stopped respiring because it was in the light",
          "The soil turned carbon dioxide into oxygen",
          "Photosynthesis released more oxygen than the plant's respiration used",
        ],
        answer: 2,
        explain:
          "Plants respire the whole time. In bright light photosynthesis outpaces respiration, so there's a net release of oxygen.",
      },
    ],
  },
  {
    title: "Why DNA pairs the way it does",
    rungs: [
      {
        concept: 3,
        prompt: "What holds the two strands of a DNA double helix together?",
        choices: [
          "Covalent bonds between phosphates on opposite strands",
          "Hydrogen bonds between complementary bases",
          "Histone proteins sitting between the strands",
        ],
        answer: 1,
        explain:
          "Bases pair across the helix through hydrogen bonds: two for A–T, three for G–C. Covalent sugar-phosphate bonds hold each single strand together.",
      },
      {
        concept: 3,
        prompt: "Why does A pair with T and G with C, rather than A with G?",
        choices: [
          "Each pair joins a larger purine with a smaller pyrimidine and lines up matching hydrogen bonds, so the helix stays one width",
          "A and G are the same size, so they fit together best",
          "Pairing is random; an enzyme sorts it out later",
        ],
        answer: 0,
        explain:
          "A and G are both large purines; T and C are smaller pyrimidines. Pairing one of each keeps the ladder's rungs the same length, and the hydrogen-bond patterns only match for A–T and G–C.",
      },
      {
        concept: 3,
        prompt: "How does complementary pairing let DNA carry copyable information?",
        choices: [
          "The phosphate groups store the genetic code",
          "Both strands carry the same sequence in the same direction",
          "Each strand's base order specifies its partner, so either strand can act as a template",
        ],
        answer: 2,
        explain:
          "Because A only fits T and G only fits C, one strand's sequence fixes the other's. That's what lets replication rebuild a complete partner strand.",
      },
      {
        concept: 3,
        prompt:
          "A mismatched pair (A opposite C) is left unrepaired in the helix. What can happen?",
        choices: [
          "Nothing, because only the backbone stores information",
          "The helix is distorted there, and after replication one copy can carry a changed sequence — a mutation",
          "The DNA at that spot immediately turns into RNA",
        ],
        answer: 1,
        explain:
          "Mismatches distort the helix and are often repaired. If one survives until replication, each strand templates a different partner, and one daughter molecule carries the change permanently.",
      },
      {
        concept: 3,
        prompt: "A strand reads 5′-GATTACA-3′. Which strand pairs with it?",
        choices: ["3′-GATTACA-5′", "3′-CUAAUGU-5′", "3′-CTAATGT-5′"],
        answer: 2,
        explain:
          "Pair each base: G→C, A→T, T→A, C→G. The partner runs the opposite way (antiparallel): 3′-CTAATGT-5′. DNA uses T, not U.",
      },
    ],
  },
  {
    title: "From gene to protein",
    rungs: [
      {
        concept: 3,
        prompt: "What is the product of transcription?",
        choices: [
          "A protein",
          "An RNA copy of a gene's sequence",
          "A second DNA double helix",
        ],
        answer: 1,
        explain:
          "Transcription copies a gene into RNA. Translation, a separate step, uses that mRNA to build a protein.",
      },
      {
        concept: 3,
        prompt: "Why does a cell make mRNA instead of sending DNA to the ribosome?",
        choices: [
          "DNA is destroyed each time it is read, so a copy protects it",
          "Ribosomes read RNA, not DNA; an mRNA carries a working copy of one gene while the DNA stays in place",
          "mRNA only exists to store DNA while the cell divides",
        ],
        answer: 1,
        explain:
          "Ribosomes translate RNA. An mRNA is a disposable working copy of one gene. In eukaryotes the DNA stays inside the nucleus. DNA isn't used up by being read.",
      },
      {
        concept: 4,
        prompt: "How does the ribosome know which amino acid comes next?",
        choices: [
          "It reads the DNA template strand directly",
          "Each amino acid pairs directly with a single RNA base",
          "A tRNA whose anticodon pairs with the next mRNA codon delivers the matching amino acid",
        ],
        answer: 2,
        explain:
          "Codons are three mRNA bases. A tRNA with the complementary anticodon carries the matching amino acid, and the ribosome links it onto the chain.",
      },
      {
        concept: 4,
        prompt:
          "One base is deleted near the start of a gene's coding sequence. Why is the protein often badly changed?",
        choices: [
          "Codons are read in threes, so the deletion shifts the reading frame and changes every codon after it",
          "Only a single amino acid can ever change from one base",
          "The ribosome skips any gene with a missing base",
        ],
        answer: 0,
        explain:
          "Removing one base regroups every triplet downstream. That's a frameshift, and it often produces a completely different sequence or an early stop codon.",
      },
      {
        concept: 3,
        prompt:
          "A DNA template strand reads 3′-TACAAA-5′. What mRNA and first two amino acids result?",
        choices: [
          "mRNA 5′-TACAAA-3′, which makes no protein",
          "mRNA 5′-AUGUUU-3′ → methionine, then phenylalanine",
          "mRNA 5′-AUGUUU-3′ → one amino acid made of six bases",
        ],
        answer: 1,
        explain:
          "Pair T→A, A→U, C→G: the mRNA is 5′-AUG UUU-3′. AUG is the start codon (methionine) and UUU codes for phenylalanine. Each codon specifies one amino acid.",
      },
    ],
  },
];

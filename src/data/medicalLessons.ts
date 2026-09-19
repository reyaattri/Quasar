export type MedicalCard = {
  title: string;
  hook: string;
  biology: string;
  fact: string;
  question: string;
  choices: string[];
  answer: number;
};

export type MedicalModule = {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  video?: string;
  labTitle: string;
  scene: string;
  cards: MedicalCard[];
  case: {
    title: string;
    prompt: string;
    choices: string[];
    answer: number;
    hint: string;
    explanation: string;
    source?: string;
  };
};

const card = (
  title: string,
  hook: string,
  biology: string,
  fact: string,
  question: string,
  correct: string,
  wrong: string[],
): MedicalCard => ({
  title,
  hook,
  biology,
  fact,
  question,
  choices: [wrong[0], correct, wrong[1]],
  answer: 1,
});

export const medicalModules: MedicalModule[] = [
  {
    id: "cells-energy",
    title: "Cells: tiny worlds at work",
    subtitle: "Prokaryotes, eukaryotes, photosynthesis and respiration",
    source: "https://openstax.org/books/biology-2e/pages/4-introduction",
    video: "https://www.youtube.com/watch?v=URUJD5NEXC8",
    labTitle: "Run a chloroplast",
    scene:
      "Take one trip through a cell-sized city. The bacterium runs an open workshop. The eukaryotic cell uses rooms. A palo verde catches light with green bark, a chloroplast packs light into sugar, and a mitochondrion cashes that sugar into ATP. The diver reminds you that color depends on which wavelengths reach your eyes.",
    cards: [
      card(
        "One room or many rooms?",
        "A bacterium runs one noisy open workshop while a eukaryotic cell keeps DNA behind the nucleus library door.",
        "Prokaryotic cells do not have a membrane-bound nucleus. Their DNA occupies a nucleoid region. Eukaryotic cells contain a nucleus and other membrane-bound organelles. Both types have a plasma membrane, cytoplasm, ribosomes and DNA.",
        "Bacteria are cells, not tiny animals. Their simpler internal layout is still highly organized.",
        "Which feature most directly distinguishes a eukaryotic cell here?",
        "A membrane-bound nucleus",
        ["Having DNA at all", "Having a plasma membrane"],
      ),
      card(
        "Two metres in a tiny nucleus",
        "A scientist tries to stuff an absurdly long DNA ribbon into a nucleus smaller than a dust speck.",
        "If stretched end to end, the DNA in one human cell is roughly two metres long. It fits because DNA associates with proteins and folds through several levels of organization. Packing must be compact but still allow selected regions to be used.",
        "A cell does not shrink the DNA sequence to make it fit; it changes how the molecule is folded and packaged.",
        "Why can long eukaryotic DNA fit inside a nucleus?",
        "It is repeatedly packaged and compacted",
        ["Most bases are thrown away", "The nucleus is two metres wide"],
      ),
      card(
        "The tree with solar skin",
        "Palo verde leaves lounge on tiny chairs while its green trunk works the sunlight shift.",
        "Palo verde bark contains chlorophyll and can photosynthesize. During drought the tree may drop small leaves, reducing water loss, while green stems continue capturing light. This is an adaptation to an arid environment.",
        "Palo verde means “green stick.” The green bark is functional tissue, not green paint.",
        "What advantage does green bark give a palo verde during drought?",
        "It can keep photosynthesizing after shedding leaves",
        ["It makes water from nothing", "It stops cellular respiration"],
      ),
      card(
        "Why red fades underwater",
        "A diver holds a red drop while the red light rays are stopped far above, leaving blue-green light to return to the eye.",
        "Blood does not become green underwater. Water absorbs longer red wavelengths more strongly than blue-green wavelengths. With little red light available to reflect, red objects look dark, brownish or sometimes greenish depending on depth, lighting and surroundings.",
        "Color is a measurement made from available light. The pigment did not need to change for the appearance to change.",
        "Why can blood look greenish or dark at depth?",
        "Water removes much of the red light before it reaches the eye",
        [
          "Hemoglobin turns into chlorophyll",
          "Blood loses all iron underwater",
        ],
      ),
      card(
        "Build sugar with sunlight",
        "A chloroplast chef catches sunlight, pours in water and carbon dioxide, stacks sugar cubes, and releases oxygen balloons.",
        "Photosynthesis captures light energy. In the overall process, carbon dioxide and water contribute atoms used to make carbohydrate, and oxygen is released. The light reactions and carbon-fixation reactions are linked stages, not one magical mixing bowl.",
        "Much of the oxygen released by plants comes from splitting water during the light reactions.",
        "Which organelle carries out photosynthesis in plants?",
        "The chloroplast",
        ["The ribosome", "The nucleus alone"],
      ),
      card(
        "Spend the sugar",
        "A mitochondrion power-station worker feeds sugar and oxygen into machinery and fills rechargeable ATP battery packs.",
        "Cellular respiration transfers energy from fuel molecules into ATP. In aerobic respiration, oxygen serves as the final electron acceptor in the electron transport chain. Plants respire as well as photosynthesize.",
        "ATP is an energy-transfer molecule. It is not a permanent storage battery and it is not energy itself.",
        "What is a major purpose of cellular respiration?",
        "To transfer usable energy into ATP",
        ["To manufacture sunlight", "To replace every DNA molecule"],
      ),
    ],
    case: {
      title: "The desert tree that stays green",
      prompt:
        "A palo verde drops many leaves during a dry spell, but its green stems remain active in sunlight. Which explanation best connects the observations?",
      choices: [
        "The stem chlorophyll can support photosynthesis while fewer leaves reduce water loss",
        "The tree has stopped all metabolism",
        "The green color means the stem contains blood",
        "The stem creates water from carbon dioxide",
      ],
      answer: 0,
      hint: "Recheck the green-bark cue: one structure can reduce water loss while another keeps capturing light.",
      explanation:
        "Leaf loss can reduce transpiration, while chlorophyll in green stems lets the tree continue some photosynthesis. The adaptation links structure, environment and energy capture.",
    },
  },
  {
    id: "dna-structure",
    title: "DNA: evidence, shape and packing",
    subtitle: "Diffraction → nucleotides → base pairs → chromosomes",
    source:
      "https://openstax.org/books/biology/pages/14-2-dna-structure-and-sequencing",
    video:
      "https://www.biointeractive.org/classroom-resources/dna-structure-and-function",
    labTitle: "Pack two metres of DNA",
    scene:
      "Enter the DNA evidence room. Diffraction produces an X-shaped clue. Model-builders use that clue with chemical constraints. A nucleotide carries three parts, base partners hold the ladder at a steady width, and the ladder winds around histone spools before becoming a compact chromosome.",
    cards: [
      card(
        "Read the diffraction clue",
        "A researcher shines X-rays through aligned DNA fibres; the scattered rays stamp an enormous X onto a detector.",
        "X-ray diffraction records how X-rays scatter from an ordered sample. The positions and intensities in the pattern constrain molecular spacing and symmetry. Rosalind Franklin and Raymond Gosling produced especially informative DNA fibre diffraction data, including Photo 51.",
        "Photo 51 was made by Raymond Gosling while working with Rosalind Franklin. A diffraction image is evidence to interpret, not a direct camera photograph of a helix.",
        "What does an X-ray diffraction pattern provide?",
        "Constraints on a molecule’s repeating structure and dimensions",
        [
          "A direct color photograph of every atom",
          "The complete DNA sequence",
        ],
      ),
      card(
        "Build from everyone’s clues",
        "Two model-builders assemble a ladder while the diffraction researcher holds the pattern and Chargaff delivers matching pairs.",
        "The double-helix model emerged from several lines of work: fibre diffraction, chemical knowledge, model building and Chargaff’s base ratios. Watson and Crick proposed the model; Franklin, Gosling, Wilkins, Chargaff and others supplied crucial evidence and constraints.",
        "In 1962 Watson, Crick and Wilkins received the Nobel Prize. Franklin had died in 1958, and Nobels are not awarded posthumously.",
        "Which statement best describes how the DNA model was built?",
        "Multiple researchers’ experimental and chemical evidence constrained the model",
        [
          "One photograph revealed every atomic detail",
          "The base ratios were irrelevant",
        ],
      ),
      card(
        "Meet one nucleotide",
        "A nucleotide character wears a phosphate hat, carries a five-carbon sugar backpack and holds one base card.",
        "A DNA nucleotide contains a phosphate group, deoxyribose sugar and one nitrogenous base. Nucleotides join through sugar-phosphate bonds to make each strand’s backbone; the bases project inward.",
        "DNA has an overall negative charge largely because of phosphate groups in its backbone.",
        "Which three parts make a DNA nucleotide?",
        "Phosphate, deoxyribose and a nitrogenous base",
        ["ATP, protein and lipid", "Ribose, amino acid and cholesterol"],
      ),
      card(
        "Pair the dance partners",
        "A and T clasp two hands; C and G clasp three. Anyone choosing the wrong partner makes the ladder bulge.",
        "In ordinary double-stranded DNA, adenine pairs with thymine and cytosine pairs with guanine. A–T pairs form two hydrogen bonds and G–C pairs form three. Pairing one purine with one pyrimidine helps maintain a consistent helix width.",
        "Chargaff found that A and T occur in similar amounts, as do G and C, in double-stranded DNA.",
        "What is complementary to 5′-AGTCATGA-3′?",
        "3′-TCAGTACT-5′",
        ["3′-AGTCATGA-5′", "3′-UCAGUACU-5′"],
      ),
      card(
        "Spool, coil, compact",
        "The DNA ladder wraps around histone spools, coils into thicker chromatin and clicks shut as a chromosome suitcase.",
        "Eukaryotic DNA wraps around histone proteins to form nucleosomes, often described as beads on a string. Higher-order folding and scaffold interactions compact chromatin further. A metaphase chromosome is an especially condensed state, not DNA’s everyday shape.",
        "Packing also affects access: loosely packed regions are generally more available to transcription machinery than highly compact regions.",
        "What is a nucleosome?",
        "DNA wrapped around a histone protein core",
        ["A free nucleotide base", "A bacterial cell wall"],
      ),
      card(
        "Circular market, linear library",
        "A bacterium keeps a circular chromosome in an open nucleoid market; a eukaryotic cell shelves linear chromosomes inside a nucleus.",
        "Most prokaryotes have a main circular chromosome in a nucleoid, though biology has exceptions and many also carry plasmids. Eukaryotic nuclear chromosomes are usually linear and packaged with histones inside a membrane-bound nucleus.",
        "Prokaryotes can begin translating an RNA while it is still being transcribed because there is no nuclear envelope separating the processes.",
        "Where is a prokaryote’s main chromosome usually found?",
        "In a nucleoid region without a surrounding nuclear membrane",
        ["Inside a mitochondrion", "Inside a membrane-bound nucleus"],
      ),
    ],
    case: {
      title: "The impossible base count",
      prompt:
        "A sample of ordinary double-stranded DNA contains 30% adenine. Which base composition is consistent with complementary pairing?",
      choices: [
        "30% T, 20% G and 20% C",
        "30% G, 20% T and 20% C",
        "70% T and no other bases",
        "30% uracil, 20% G and 20% C",
      ],
      answer: 0,
      hint: "Pair the dancers: A matches T and G matches C. All four percentages must total 100.",
      explanation:
        "If A is 30%, T is also 30%. The remaining 40% is divided equally between G and C, giving 20% each.",
    },
  },
  {
    id: "dna-flow",
    title: "DNA in action",
    subtitle: "Replication, transcription, translation and a kitchen-table lab",
    source: "https://www.ncbi.nlm.nih.gov/books/NBK26850/",
    video: "https://www.youtube.com/watch?v=5l7jQAuxqu8",
    labTitle: "Extract fruit DNA",
    scene:
      "Run the molecule factory in order: unzip the helix, use each old strand as a template, proofread the new DNA, copy one gene into RNA, read RNA three bases at a time, and finally pull visible DNA from fruit cells with detergent, filtration and cold alcohol.",
    cards: [
      card(
        "Unzip the helix",
        "A helicase worker runs down the DNA zipper while helpers keep the separated strands from snapping back together.",
        "Replication begins at origins. Helicase separates the strands at replication forks. Other proteins stabilize single-stranded DNA and relieve twisting stress ahead of the fork. Opening the helix is necessary but does not itself build new DNA.",
        "Replication usually proceeds in two directions from an origin.",
        "What is helicase’s central job?",
        "Separate the two DNA strands",
        ["Join amino acids", "Carry RNA out of the nucleus"],
      ),
      card(
        "Keep one old rail",
        "Each old DNA rail supervises construction of one new matching rail, so both finished ladders keep half the original.",
        "DNA replication is semiconservative: each daughter double helix contains one parental strand and one newly synthesized strand. Complementary base pairing lets either parental strand specify its partner.",
        "Meselson and Stahl tested competing replication models using nitrogen isotopes and density-gradient centrifugation.",
        "What does semiconservative replication mean?",
        "Each daughter DNA molecule contains one old strand and one new strand",
        [
          "One daughter receives only old DNA",
          "Half the nucleotide types are discarded",
        ],
      ),
      card(
        "Build only 5′ to 3′",
        "A DNA polymerase builder can add a tile only at the growing strand’s 3′ handle, while a proofreader ejects mismatches.",
        "DNA polymerases synthesize DNA 5′→3′ by adding nucleotides to a 3′ hydroxyl. Because the templates are antiparallel, one new strand is made continuously and the other in fragments that are later joined. Many polymerases also proofread.",
        "The lagging strand is not copied backwards; its fragments are each synthesized 5′→3′.",
        "In which direction is new DNA synthesized?",
        "5′→3′",
        ["3′→5′", "From both ends of one fragment at once"],
      ),
      card(
        "Copy one gene into RNA",
        "An RNA-polymerase train reads the template rail 3′→5′ while its RNA banner grows 5′→3′ and swaps U for T.",
        "During transcription, RNA polymerase uses one DNA template strand. It reads that template 3′→5′ and synthesizes RNA 5′→3′. RNA uses uracil instead of thymine. The coding DNA strand matches the RNA sequence except T/U.",
        "DNA is not consumed when it is transcribed; the strands re-form behind the polymerase.",
        "A template reads 3′-TACGGA-5′. What RNA is made?",
        "5′-AUGCCU-3′",
        ["5′-TACGGA-3′", "3′-AUGCCU-5′"],
      ),
      card(
        "Read three letters at a time",
        "A ribosome kitchen reads RNA tickets in triplets while tRNA waiters match anticodons and deliver amino-acid beads.",
        "A ribosome reads mRNA codons 5′→3′. Transfer RNAs pair anticodons with codons and bring amino acids. The ribosome links those amino acids into a polypeptide. A start codon establishes the reading frame; stop codons recruit release factors.",
        "The genetic code is redundant: several codons can specify the same amino acid.",
        "What directly determines the order of amino acids?",
        "The order of codons in the mRNA reading frame",
        ["The color of the nucleus", "The number of histone proteins"],
      ),
      card(
        "Pull DNA from a strawberry",
        "A learner mashes fruit, detergent opens cell membranes, a filter catches debris and cold alcohol reveals pale strings.",
        "In a simple fruit extraction, mashing breaks tissue, detergent disrupts lipid membranes, salt helps separate DNA from proteins and cold alcohol makes DNA less soluble so many molecules collect as visible strands. The cloudy material is a crude mixture, not one purified chromosome.",
        "Strawberries work well partly because the soft tissue is easy to mash and cultivated strawberries have multiple genome copies per cell.",
        "Why does cold alcohol make DNA easier to see?",
        "DNA is poorly soluble in the alcohol layer and precipitates",
        [
          "Alcohol converts protein into DNA",
          "Alcohol magnifies a single DNA molecule",
        ],
      ),
    ],
    case: {
      title: "A founder arrives with six fingers",
      prompt:
        "A small, relatively isolated colony begins with few founders. One founder carries a rare dominant polydactyly allele. Generations later that allele is much more common in the colony than in the source population. What best describes this?",
      choices: [
        "Founder effect, a form of genetic drift",
        "Natural selection must always be responsible",
        "DNA replication changed every hand gene in the colony",
        "Individuals developed the allele because they needed it",
      ],
      answer: 0,
      hint: "Focus on sampling: a small starting group carried an unrepresentative allele frequency.",
      explanation:
        "The founder effect occurs when a new population begins from a small sample whose allele frequencies differ by chance from the source population. It is a form of genetic drift; the observation alone does not show that polydactyly was favored by selection.",
    },
  },
];

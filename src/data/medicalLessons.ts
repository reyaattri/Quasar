export type MedicalCard = {
  title: string;
  hook: string;
  biology: string;
  question: string;
  choices: string[];
  answer: number;
};
export type MedicalModule = {
  id: string;
  title: string;
  subtitle: string;
  source: string;
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
  question: string,
  correct: string,
  wrong: string[],
): MedicalCard => ({
  title,
  hook,
  biology,
  question,
  choices: [wrong[0], correct, wrong[1]],
  answer: 1,
});
export const medicalModules: MedicalModule[] = [
  {
    id: "immunity",
    title: "The immunity club",
    subtitle: "Complement → B cells → lasting antibody defence",
    source: "https://www.ncbi.nlm.nih.gov/books/NBK27142/",
    scene:
      "Walk through the club: the guard tags a microbe, alarms summon help, and the builder makes a pore. Upstairs, the tailor tests antibody keys, changes their sleeves, and sends the winning design to a printer and an archive. Innate complement and adaptive B-cell responses cooperate; these are connected processes, not a single mandatory timeline.",
    cards: [
      card(
        "Tag the intruder",
        "A guard slaps a dinner-plate target onto a slippery microbe; a cleaner arrives with a giant scoop.",
        "Complement activation generates C3b. C3b on a microbe promotes recognition and uptake by phagocytes: opsonization. Intact epithelial barriers help prevent entry; complement acts after microbes reach susceptible sites.",
        "What does the target sticker represent?",
        "C3b making a microbe easier for phagocytes to recognize",
        ["An antibody factory", "A physical skin barrier"],
      ),
      card(
        "Call the rescue crew",
        "The guard rings two deafening alarms; a rescuer follows a winding scent trail.",
        "C3a and C5a promote inflammation. C5a is a strong chemoattractant and activator for neutrophils. The alarm and trail are different effects; they do not represent antibody secretion.",
        "Which fragment strongly attracts neutrophils?",
        "C5a",
        ["C9 alone", "IgG constant region"],
      ),
      card(
        "Build the pore",
        "A grinning builder fits purple pipes into a circular opening in the intruder’s wall.",
        "C5b recruits C6, C7, C8 and multiple C9 molecules to form the membrane attack complex. Its pore damages susceptible membranes. The cartoon leak is a metaphor, not a literal water pump.",
        "What finishes the pore assembly?",
        "Multiple C9 molecules",
        ["B-cell gene rearrangement", "C3a forming a skin layer"],
      ),
      card(
        "Test the antibody key",
        "A fussy tailor throws bad Y-keys onto the floor and celebrates the best-fitting key.",
        "BTK-dependent development helps immature B cells mature in bone marrow. Later, activated B cells in germinal centers undergo somatic hypermutation and selection: clones with higher-affinity receptors are favored. XLA can block maturation, leaving very few B cells and low immunoglobulins.",
        "Which process favors better antigen binding?",
        "Affinity maturation through mutation and selection",
        ["Class switching alone", "Making a complement pore"],
      ),
      card(
        "Change the sleeve, keep the tips",
        "The tailor stitches a huge purple sleeve onto a Y-key without touching its two tips.",
        "Class-switch recombination changes the heavy-chain constant region and effector function while preserving antigen specificity. It is distinct from affinity maturation. T-cell help and cytokine signals often guide this response.",
        "What remains the same during class switching?",
        "Antigen specificity",
        ["Heavy-chain constant region", "Every effector function"],
      ),
      card(
        "Print and remember",
        "An enormous printer spits out keys while an archivist files the winning blueprint.",
        "Plasma cells secrete antibodies. Memory B cells support later responses to antigen; they are living cells, not stored antibodies. A person lacking mature B cells has trouble building these antibody responses.",
        "Which cell is the antibody-secreting factory?",
        "Plasma cell",
        ["Memory B cell blueprint alone", "Neutrophil"],
      ),
    ],
    case: {
      title: "Why do the infections keep returning?",
      prompt:
        "A 21-year-old man has recurrent pneumonia and unusual skin infections. B-cell counts and IgG, IgA and IgM are markedly low; T-cell measures are comparatively preserved. Which diagnosis best joins these clues?",
      choices: [
        "X-linked agammaglobulinemia (XLA)",
        "A simple skin-barrier injury",
        "An isolated complement excess",
        "A normal vaccine response",
      ],
      answer: 0,
      hint: "Recheck the B-cell clue.",
      explanation:
        "The reported patient had a BTK variant. XLA disrupts B-cell maturation, explaining low B cells and immunoglobulins. Recall the locked tailoring academy: without mature B cells, the printer and archive cannot develop normally. Diagnosis in the source required clinical, laboratory and genetic assessment.",
      source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12900604/",
    },
  },
  {
    id: "gene-expression",
    title: "The gene-expression theatre",
    subtitle: "A human protein-coding gene: DNA → RNA → protein",
    source: "https://www.ncbi.nlm.nih.gov/books/NBK26887/",
    scene:
      "Replay one production: unlock the script vault, copy the script, edit and dress it, carry it out, read it into a bead chain, then fold and inspect the finished prop. DNA stays in the archive; RNA carries the message; the protein does the work. Processing can overlap transcription. This lesson covers the core eukaryotic pathway, not every regulatory mechanism or exception.",
    cards: [
      card(
        "Open the script vault",
        "A red-haired director wrestles open an enormous DNA vault.",
        "Chromatin accessibility and regulatory proteins influence transcription. Transcription factors help recruit RNA polymerase II at a promoter for a protein-coding gene. DNA is not converted into protein directly.",
        "Which enzyme transcribes most human protein-coding genes?",
        "RNA polymerase II",
        ["A ribosome", "DNA ligase alone"],
      ),
      card(
        "Copy one script",
        "A scribe unrolls an absurdly long purple ribbon from one side of the DNA script.",
        "RNA polymerase reads the template strand 3′→5′ and synthesizes RNA 5′→3′. RNA uses uracil rather than thymine. The coding strand matches the RNA sequence except T/U; the template is complementary.",
        "In which direction is RNA synthesized?",
        "5′→3′",
        ["3′→5′", "In both directions along one RNA chain"],
      ),
      card(
        "Edit, cap and tail",
        "A seamstress cuts scraps from a ribbon, joins the useful pieces, and dresses it with a cap and bead tail.",
        "Pre-mRNA receives a 5′ cap, introns are removed and exons joined by splicing, and the cleaved 3′ end usually receives a poly(A) tail. Alternative splicing can make different transcripts. Exons may include untranslated regions; they are not all protein-coding.",
        "A splice-site change causes intron retention. Which step is directly disrupted?",
        "Pre-mRNA splicing",
        ["Peptide bond formation", "Protein folding only"],
      ),
      card(
        "Carry the approved script out",
        "A courier squeezes the finished ribbon through a theatre doorway.",
        "Processed mRNA is exported through nuclear pores to the cytoplasm. In human cells, transcription and translation occur in different compartments. Regulatory mechanisms affect mRNA stability and translation efficiency.",
        "Where does cytoplasmic translation take place?",
        "At ribosomes outside the nucleus",
        ["Inside the DNA double helix", "Only inside nuclear pores"],
      ),
      card(
        "Read in triplets",
        "A two-part stage machine reads the ribbon while couriers deliver colored beads.",
        "The ribosome reads mRNA codons 5′→3′. Charged tRNAs pair anticodons with codons; ribosomal RNA catalyzes peptide bonds. Translation usually begins at AUG. Stop codons recruit release factors, not a stop-carrying tRNA. The polypeptide grows N-terminus to C-terminus.",
        "What recognizes a stop codon to end translation?",
        "A release factor",
        ["A tRNA carrying a stop amino acid", "RNA polymerase II"],
      ),
      card(
        "Fold and inspect the prop",
        "A coach folds a bead chain into a useful prop and rejects a tangled one.",
        "A polypeptide must fold; chaperones can assist. Many proteins are modified or targeted to compartments. Defective proteins can be degraded. A mutation can alter RNA processing, protein amount or protein function without changing every stage.",
        "A one-base coding deletion shifts downstream codons. What is this?",
        "A frameshift",
        ["A guaranteed silent mutation", "Class switching"],
      ),
    ],
    case: {
      title: "The missing hemoglobin script",
      prompt:
        "An educational patient vignette: a person with inherited anemia has a beta-globin gene splice-site variant. RNA testing shows abnormal beta-globin splicing and reduced normal beta-globin protein. Which mechanism best connects the DNA finding to the protein shortage?",
      choices: [
        "The ribosome copies DNA directly",
        "Faulty pre-mRNA processing reduces useful beta-globin mRNA",
        "Antibodies change their constant region",
        "Calcium cannot enter a motor nerve terminal",
      ],
      answer: 1,
      hint: "Revisit the seamstress: what happens when the script is cut at the wrong place?",
      explanation:
        "A splice-site variant can disrupt normal intron removal and exon joining. Abnormal transcripts may be degraded or fail to yield normal protein. The relevant link is DNA variant → abnormal RNA processing → reduced functional beta-globin. This original teaching vignette is not a diagnosis of a real patient.",
    },
  },
  {
    id: "neuromuscular",
    title: "The signal circus",
    subtitle: "Motor neuron → skeletal muscle → relaxation",
    source: "https://www.ncbi.nlm.nih.gov/books/NBK10834/",
    scene:
      "Follow the circus relay: electric courier, calcium gate, envelope release, receptor gate, muscle rope pull, cleanup. Keep nerve-terminal calcium separate from calcium released inside the muscle. An electrical nerve signal becomes a chemical synaptic signal and then an electrical muscle signal.",
    cards: [
      card(
        "Deliver the spark",
        "A lightning-hatted courier races along a tightrope to the tent.",
        "A motor-neuron action potential reaches the presynaptic terminal. The nerve membrane depolarizes; the message has not yet crossed the synaptic cleft.",
        "Where does this arriving action potential first act?",
        "The motor nerve terminal",
        ["The muscle nucleus", "The antibody binding site"],
      ),
      card(
        "Open the calcium gate",
        "The ringmaster opens a gate and a stampede of calcium marbles rolls into the terminal.",
        "Depolarization opens presynaptic voltage-gated calcium channels. Calcium influx triggers vesicle fusion machinery. This extracellular calcium enters the nerve terminal, not the muscle’s sarcoplasmic reticulum.",
        "What directly triggers transmitter release here?",
        "Presynaptic calcium influx",
        [
          "Calcium leaving the cell through the nucleus",
          "Antibody class switching",
        ],
      ),
      card(
        "Launch the envelopes",
        "An acrobat throws golden envelopes across a gap from a cloud of vesicle bubbles.",
        "Vesicles release acetylcholine by exocytosis. ACh diffuses across the cleft to the motor end plate. An action potential itself does not jump across this chemical synapse.",
        "Which messenger crosses the synaptic cleft?",
        "Acetylcholine",
        ["The entire action potential", "DNA polymerase"],
      ),
      card(
        "Unlock the end plate",
        "Two envelopes unlock a gate and red marbles rush onto the stage.",
        "Muscle nicotinic ACh receptors are ligand-gated cation channels. Net inward current depolarizes the end plate; if threshold is reached, nearby voltage-gated sodium channels initiate a muscle action potential. Myasthenia gravis commonly involves antibodies against these receptors.",
        "The ACh receptor at the motor end plate is what kind of channel?",
        "Ligand-gated cation channel",
        ["Voltage-gated calcium channel in the nerve", "A nuclear pore"],
      ),
      card(
        "Pull the muscle ropes",
        "A strongman releases stored calcium while two tiny workers slide interlocking ropes.",
        "The muscle action potential travels along the sarcolemma and T tubules. In skeletal muscle, voltage sensing couples to calcium release from the sarcoplasmic reticulum. Calcium binds troponin C, permitting actin–myosin interaction. ATP supports cross-bridge cycling; filaments slide rather than shorten.",
        "Which protein binds calcium to permit contraction?",
        "Troponin C",
        ["C3b", "RNA polymerase II"],
      ),
      card(
        "Clear the stage",
        "A cleaner shreds spare envelopes while a pump worker returns marbles to storage.",
        "Acetylcholinesterase breaks down ACh in the cleft; choline is recycled. SERCA pumps calcium back into the sarcoplasmic reticulum, promoting relaxation. In ACh-receptor myasthenia, reduced postsynaptic responsiveness can cause fatigable weakness.",
        "Which action helps muscle relaxation?",
        "Calcium reuptake into the sarcoplasmic reticulum",
        [
          "More calcium binding troponin indefinitely",
          "Continued receptor activation without cleanup",
        ],
      ),
    ],
    case: {
      title: "The tired eyelids",
      prompt:
        "An original learning vignette: a patient has fluctuating drooping eyelids and double vision that worsen with repeated use and improve with rest. Testing detects antibodies against muscle acetylcholine receptors. Which part of the relay is chiefly affected?",
      choices: [
        "Transcription in a liver cell",
        "Postsynaptic signalling at the skeletal neuromuscular junction",
        "C9 assembly on a bacterium",
        "Splicing of every RNA molecule",
      ],
      answer: 1,
      hint: "Revisit the two-envelope gate: the antibody targets the receiving side.",
      explanation:
        "ACh-receptor antibodies can reduce functional postsynaptic receptors and damage the end plate, impairing transmission. This supports ACh-receptor myasthenia in the vignette. The nerve’s release machinery and the muscle receptor are distinct locations; real assessment requires clinical evaluation.",
    },
  },
];

export const mathsCoaching = [
  [
    [
      "Read the symbols",
      "f is the rule, x is the input, and f(x) is the output. The prime in f′ means derivative, not a new input. If distance is s(t), then s′(t) is velocity: metres gained per second.",
      "For f(x)=x², compare f(2)=4 with f(2.01)=4.0401. A change of 0.01 in x produces about 0.04 in f. The ratio is about 4. That is why f′(2)=4.",
      "A positive derivative means the graph rises as x increases; a negative derivative means it falls. Zero slope does not necessarily mean the function is zero.",
    ],
    [
      "Why use a limit?",
      "Two points give an average slope over a stretch of graph. To describe one instant, shrink that stretch while watching the slope approach a value.",
      "Expand (x+h)² into x²+2xh+h². Subtract x², factor h, and divide by h while h≠0. Only then let h approach zero. The surviving term is 2x.",
      "Try x=2 and h=1, then 0.1: average slopes are 5 and 4.1. Predict the value for h=0.01 before moving the control.",
    ],
    [
      "Use the rule term by term",
      "The power rule applies to a power of x. A numerical multiplier stays outside the derivative. Rewrite roots as fractional powers when useful.",
      "d(5x³)/dx = 5×3x² = 15x². For √x=x^(1/2), the derivative is (1/2)x^(−1/2) for x>0.",
      "Do not multiply by x again after bringing down the exponent. The derivative of 7 is 0, but the derivative of 7x is 7.",
    ],
    [
      "Check the answer in context",
      "The derivative you found is a new function: it gives a slope for every allowed x. Substitute a point only after differentiating.",
      "At x=1, 12x³−2 gives 10. A small input increase of 0.01 near that point changes the output by approximately 10×0.01=0.1.",
      "The estimate is local. Over a large interval, the slope itself changes, so a single tangent does not give an exact change.",
    ],
    [
      "Spot the nested rules",
      "Read (3x+1)² as two actions: first triple x and add one; then square the result. Both actions affect the rate.",
      "Let u=3x+1. Then dy/du=2u and du/dx=3. Multiply to get dy/dx=6(3x+1). Expanding first gives 9x²+6x+1 and differentiating gives 18x+6: the same answer.",
      "For (2x+1)³, say outside cube, inside line. The inner derivative 2 is essential.",
    ],
  ],
  [
    [
      "What does the integral sign ask?",
      "An indefinite integral asks for all functions whose derivative equals the integrand. The dx tells you which variable you are integrating with respect to.",
      "If the rate is 3x², try x³ because differentiating it gives 3x². An antiderivative is a candidate you can verify by differentiating.",
      "Integration is not simply multiplying by x. That would give 3x³, whose derivative is 9x², the wrong rate.",
    ],
    [
      "Use one known value to find C",
      "A rate tells you how something changes, but not where it started. An initial value supplies the missing information.",
      "If F′(x)=3x² and F(0)=5, first write F(x)=x³+C. Substitute 0: 5=0+C, so F(x)=x³+5.",
      "Without an initial condition, keep +C. A definite integral is different: it asks for a net amount between bounds.",
    ],
    [
      "Divide by the new power",
      "Differentiation would multiply by the new exponent. Dividing by that same exponent now ensures the operations undo each other.",
      "For ∫6x² dx, increase 2 to 3 and divide 6 by 3: 2x³+C. Check: d(2x³)/dx=6x².",
      "For ∫(6x²+4) dx, treat 4 as 4x⁰. The answer is 2x³+4x+C, not 2x³+4+C.",
    ],
    [
      "Why a logarithm appears",
      "The derivative of ln|x| is 1/x on either side of zero. That gives the antiderivative missing from the power formula.",
      "For ∫3/x dx, keep the multiplier: 3ln|x|+C. The absolute-value bars allow negative x as well as positive x.",
      "Neither the original expression nor the answer is defined at x=0. Do not use this formula across zero without checking the improper integral.",
    ],
    [
      "Match the differential",
      "Substitution reverses a chain rule. Choose an inner expression u and look for its derivative, times dx, among the remaining factors.",
      "In ∫2x(x²+1)³ dx, the entire 2x dx becomes du. Nothing should be left in x after the substitution. Integrate u³, then replace u by x²+1.",
      "If the integrand were x(x²+1)³, then x dx=du/2. Carry the factor 1/2 through; do not invent a missing 2.",
    ],
  ],
  [
    [
      "Track the units",
      "A rate in litres per minute is not an amount in litres. Multiplying by a time interval converts rate to approximate amount.",
      "If the tap ran at a constant 6 L/min for 0.1 min, it would add 0.6 L. For a changing rate, use short intervals and add their amounts.",
      "Before calculating, predict the units of the final answer. Integrating velocity over time gives displacement, not velocity.",
    ],
    [
      "Choose where to sample",
      "Left, right and midpoint rectangles use different sample heights. They approximate the same continuous accumulation as their widths shrink.",
      "For an increasing positive rate, left endpoints underestimate and right endpoints overestimate. More thin rectangles usually narrow that gap.",
      "Rectangle width matters as much as height. Adding rate values without multiplying by interval width does not give an amount.",
    ],
    [
      "Subtract the starting accumulation",
      "F(b) is an accumulated reading at the end; F(a) is the reading at the start. Their difference isolates the interval you want.",
      "For rate 2t from minute 1 to 3, use F(t)=t². Compute F(3)−F(1)=9−1=8 litres. The upper endpoint rate, 6 L/min, answers a different question.",
      "A starting tank volume of 12 L would make the final volume 20 L. The integral supplies the added 8 L, not automatically the final volume.",
    ],
    [
      "Separate net change from total travel",
      "Positive and negative rates cancel in net change. To count total activity, integrate the absolute value and split at sign changes.",
      "A walker travels 3 metres forward and 3 back. Displacement is 0; distance is 6 metres. Signed area follows the same distinction.",
      "Find where the rate is zero before splitting an interval. Taking the absolute value only after adding can lose the cancelled motion.",
    ],
    [
      "Keep the variable and bounds together",
      "Changing variables also changes what the endpoints mean. A bound written for x cannot be used directly in a formula written in u.",
      "With u=x²+1, x=0 becomes u=1 and x=1 becomes u=2. Evaluate u²/2 at 2 and 1. Alternatively change back to x first and use 1 and 0.",
      "Both routes give 3/2. Choose one route and keep it consistent; do not substitute twice.",
    ],
  ],
];

export const biologyCoaching = [
  [
    [
      "Start with a cell",
      "A cell is the smallest unit that can carry out the processes of life. Its membrane controls exchanges; its DNA stores instructions; ribosomes make proteins.",
      "The open workshop represents a nucleoid without a surrounding membrane. The library door represents the nuclear envelope. It does not mean bacteria lack organization.",
      "An antibiotic that targets a bacterial ribosome can interfere with protein production. Having no nucleus does not mean a bacterium makes no proteins.",
    ],
    [
      "Packing still needs access",
      "A long molecule must fit inside the cell and remain usable. Proteins organize DNA into loops and other folded arrangements without deleting its information.",
      "The ribbon is DNA; the tiny room is the nucleus. Folding changes the space occupied, not the order of its bases.",
      "Most human nucleated body cells have roughly two metres of DNA; mature red blood cells lack a nucleus, and gametes carry half the usual chromosome set.",
    ],
    [
      "Structure solves an environmental problem",
      "Leaves capture light but also lose water through gas exchange. A desert plant benefits from reducing leaf area during drought while keeping some photosynthesis in its stems.",
      "The green trunk is a second light-catching surface. Chlorophyll captures light energy; it does not create water.",
      "A green stem can continue some photosynthesis after leaf loss, but drought still limits growth. Ask what resource the adaptation saves and what function it preserves.",
    ],
    [
      "Light makes colour visible",
      "A red pigment looks red when red light reaches it and is reflected toward your eyes. At depth, water has absorbed much of that red light.",
      "The missing red rays explain the changed appearance. The blood has not chemically turned into a green substance.",
      "Shining an appropriate white light on a red object underwater can reveal its red colour again. Appearance depends on illumination as well as pigment.",
    ],
    [
      "Follow matter and energy separately",
      "Photosynthesis uses light energy to help make carbohydrate from carbon dioxide and water. The carbon in plant biomass comes largely from carbon dioxide.",
      "The solar workshop represents energy capture. In the light reactions, water supplies electrons and oxygen is released; carbon fixation uses captured energy to build sugar precursors.",
      "Plants do not eat sunlight as matter. Light supplies energy, while atoms are rearranged. Plants also respire, during both day and night.",
    ],
    [
      "ATP is a usable energy transfer molecule",
      "Cellular respiration transfers energy from fuel molecules into forms the cell can use, including ATP. In aerobic respiration, oxygen is the final electron acceptor in the electron transport chain.",
      "Cashing sugar into ATP is a transfer analogy, not creation of energy. Some energy is released as heat.",
      "Plant cells need ATP too. Chloroplasts and mitochondria perform different jobs; a leaf can contain both.",
    ],
  ],
  [
    [
      "Evidence is not a direct portrait",
      "An ordered sample scatters X-rays into a pattern. Repetition in the sample produces information about spacing and arrangement that a model must explain.",
      "The giant X is a clue consistent with a helix. It does not spell the DNA bases or show an ordinary photograph of each atom.",
      "A useful model explains several observations together. One striking pattern alone is not permission to invent any structure.",
    ],
    [
      "Combine independent constraints",
      "Chemical bonds limit which shapes can exist. Diffraction constrains dimensions. Base ratios constrain pairing. Model-building asks which arrangement satisfies them together.",
      "Each researcher brings a different puzzle piece. The assembled ladder represents a model supported by several kinds of evidence.",
      "A model is stronger when it explains existing observations and makes testable predictions, such as how complementary strands could be copied.",
    ],
    [
      "One unit versus a whole strand",
      "A nucleotide is one building block. A strand is many nucleotides connected through sugar-phosphate bonds; its base order stores sequence information.",
      "Map each prop back: phosphate, deoxyribose sugar, base. The base is not the entire nucleotide.",
      "Changing a base changes the sequence. Breaking the sugar-phosphate backbone breaks the strand itself; these are different kinds of change.",
    ],
    [
      "Complementary is not identical",
      "A on one strand pairs with T on the other; G pairs with C. The strands also point in opposite chemical directions, called antiparallel.",
      "The dancers encode partners and hydrogen-bond counts. The two sides of the ladder are not copies running in the same direction.",
      "For 5′-AGTC-3′, write the paired strand 3′-TCAG-5′. If asked to report it 5′→3′ instead, reverse that written sequence to 5′-GACT-3′.",
    ],
    [
      "DNA and chromosome are not competing materials",
      "A chromosome contains a DNA molecule organized with proteins. DNA wraps around histones to form nucleosomes, and chromatin folds further.",
      "The spool is a histone core and the wrapped thread is DNA. The suitcase is a highly compact state, not the everyday shape of all DNA.",
      "An X-shaped replicated chromosome has two sister chromatids. Chromatin compaction is dynamic; a single rigid 30-nm fibre is not a universal arrangement in living cells.",
    ],
    [
      "Location affects the workflow",
      "A prokaryote has no nuclear envelope separating DNA from ribosomes. In a eukaryote, nuclear transcription and cytoplasmic translation are separated.",
      "The open market and enclosed library represent compartment boundaries, not the presence or absence of genetic information.",
      "Bacteria can translate an RNA while it is still being transcribed. Eukaryotic mRNA is generally processed and exported before cytoplasmic ribosomes translate it.",
    ],
  ],
  [
    [
      "Opening is not copying",
      "Helicase separates paired strands. Single-strand binding proteins help keep them apart, while topoisomerases relieve twisting stress ahead of the fork.",
      "The zipper worker opens access. A different enzyme, DNA polymerase, builds the new strand.",
      "If a fork opens but no nucleotides are added, helicase may be working while DNA synthesis is blocked. Distinguish access from construction.",
    ],
    [
      "Track old and new strands",
      "Separate one double helix. Each old strand now specifies a complementary new strand. Re-pair each old strand with its new partner.",
      "Each finished ladder contains one old rail and one new rail. It is not one all-old ladder plus one all-new ladder.",
      "After one replication round, both daughter double helices contain parental material. That is the key prediction of semiconservative copying.",
    ],
    [
      "Chemical ends determine direction",
      "The 5′ and 3′ labels refer to sugar-carbon positions. Polymerase adds onto an available 3′ end, so the growing strand always extends 5′→3′.",
      "The 3′ handle is the attachment site. A new fragment has the same direction rule as a continuously made strand.",
      "DNA polymerase needs a primer. Primase supplies primers, polymerase extends them, and ligase seals remaining breaks after primer replacement.",
    ],
    [
      "Keep three sequences distinct",
      "The template is the strand RNA polymerase reads. The coding strand is its DNA partner. The RNA is complementary to the template and matches the coding strand except that U replaces T.",
      "Template 3′-TACGGA-5′ → RNA 5′-AUGCCU-3′. Coding DNA is 5′-ATGCCT-3′. Pair T→A, A→U, C→G and G→C while building RNA.",
      "Uracil is an RNA base, not a worker that changes DNA thymine. RNA polymerase selects RNA nucleotides; it does not convert the original DNA strand into RNA.",
    ],
    [
      "Separate the reader, carrier and product",
      "mRNA carries codons. The ribosome reads them. tRNA brings amino acids by matching an anticodon. The growing polypeptide is the product.",
      "Tickets are mRNA codons; waiters are tRNAs; beads are amino acids. A codon is three RNA bases, not three amino acids.",
      "Read AUG-CCU as two codons. Moving the start by one base changes the grouping and can change every later amino acid: that is why the reading frame matters.",
    ],
    [
      "Visible strands are many molecules",
      "Mashing opens tissue mechanically. Detergent disrupts membranes. Filtration removes large debris. Alcohol reduces DNA solubility so molecules collect together.",
      "The pale strings represent clumps of extracted material. You cannot see one double helix with your naked eye.",
      "This is a crude extraction, not purified DNA sequencing. Use adult supervision with alcohol; keep it away from flames and do not consume the mixture.",
    ],
  ],
];

// The Secrets of Cell City: a six-episode memory world for cells and cellular respiration.
// Every episode states the real biology first; the city is the memory cue for it, and each
// cue maps onto one real relationship (see the `mapping` table in each episode).

export type CharacterId = "osei" | "nell" | "ribo" | "mara" | "kip" | "gly";

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  real: string;
  color: string;
};

export const characters: Record<CharacterId, Character> = {
  osei: {
    id: "osei",
    name: "Mayor Osei",
    role: "Runs Cell City and asks for your help",
    real: "The cell as a whole: it needs every part working together",
    color: "#F1D379",
  },
  nell: {
    id: "nell",
    name: "Archivist Nell",
    role: "Keeper of the Archive, the city's headquarters",
    real: "The nucleus: it holds the DNA and sends out mRNA copies",
    color: "#D9D2FA",
  },
  ribo: {
    id: "ribo",
    name: "Rho & Bo",
    role: "Two-part builders who read work orders",
    real: "Ribosomes: a large and a small subunit that read mRNA and link amino acids",
    color: "#BFD7AF",
  },
  mara: {
    id: "mara",
    name: "Gatekeeper Mara",
    role: "Guards the flexible city wall and its gates",
    real: "The cell membrane: a selectively permeable phospholipid bilayer with protein channels",
    color: "#F4C9B8",
  },
  kip: {
    id: "kip",
    name: "Foreman Kip",
    role: "Runs the power stations",
    real: "Mitochondria: where the citric acid cycle and oxidative phosphorylation happen",
    color: "#F0B27A",
  },
  gly: {
    id: "gly",
    name: "Courier Gly",
    role: "Splits fuel parcels in the streets",
    real: "Glycolysis: splitting glucose in the cytoplasm",
    color: "#F4E6B8",
  },
};

export type Beat = { who: CharacterId; line: string };

export type Reading = { label: string; level: "none" | "low" | "normal" | "high" | "very high"; note?: string };

export type CityQuestion = {
  id: string;
  title: string;
  prompt: string;
  readings?: Reading[];
  choices: string[];
  answer: number;
  cue: string; // the full city cue, shown until you've answered correctly
  nudge: string; // a thinner cue, shown once you've got it right once
  why: string; // the real relationship
  another: string; // an alternative explanation
};

export type Rebuild =
  | { kind: "order"; id: string; prompt: string; cue: string; steps: string[] }
  | { kind: "match"; id: string; prompt: string; cue: string; left: string[]; right: string[] };

export type Explain = {
  id: string;
  prompt: string;
  ideas: { label: string; keywords: string[] }[];
};

export type Episode = {
  n: number;
  title: string;
  topic: string;
  place: string;
  science: string[];
  mapping: [string, string][];
  scene: Beat[];
  rebuild: Rebuild;
  clues: CityQuestion[];
  explain?: Explain;
  noCues?: boolean;
  wrap: string;
};

export const cellCity: Episode[] = [
  {
    n: 1,
    title: "Welcome to Cell City",
    topic: "Cell structures",
    place: "The Archive, the workshops, the power stations and the city wall",
    science: [
      "The nucleus holds the cell's DNA: the instructions for building proteins. The DNA stays inside. When a gene is needed, it's copied into mRNA, which leaves through pores in the nuclear envelope.",
      "Ribosomes read mRNA and link amino acids into a protein chain. Some float free in the cytoplasm; others sit on the rough endoplasmic reticulum.",
      "Mitochondria transfer the chemical energy in food molecules such as glucose into ATP, the form of energy the cell can spend. They don't create energy: they convert it, and some is lost as heat.",
      "The cell membrane is a phospholipid bilayer. It's selectively permeable: small, uncharged molecules like O₂ and CO₂ slip through, while ions and larger polar molecules need protein channels or pumps.",
    ],
    mapping: [
      ["Nucleus", "The Archive, the city's headquarters"],
      ["DNA", "Master blueprints that never leave the Archive"],
      ["mRNA", "Copies of one blueprint, sent out through the Archive's gates"],
      ["Ribosomes", "Rho & Bo's workshops, building from the copies"],
      ["Mitochondria", "Power stations that recharge ATP batteries"],
      ["Cell membrane", "The flexible city wall with guarded gates"],
      ["Cytoplasm", "The streets between them"],
    ],
    scene: [
      { who: "osei", line: "Welcome to Cell City! Everything here has one job, and the city only works if every job gets done." },
      { who: "nell", line: "This is the Archive. The master blueprints never leave this room. When the builders need one, I send a copy out through the gates." },
      { who: "ribo", line: "We're Rho and Bo. We clamp onto the copy from both sides, read it three letters at a time, and snap the right parts on, one after another." },
      { who: "kip", line: "My stations don't make energy out of thin air. Fuel comes in from the streets and we move its energy into ATP batteries the whole city can use." },
      { who: "mara", line: "Small, uncharged travellers like oxygen can slip straight through my wall. Anything charged, or big, has to come through a gate." },
    ],
    rebuild: {
      kind: "match",
      id: "city-e1-rebuild",
      prompt: "Put each place back to work. Tap a place, then its job.",
      cue: "Picture walking the city: Archive → workshops → power stations → the wall.",
      left: ["Nucleus", "Ribosome", "Mitochondrion", "Cell membrane"],
      right: [
        "Keeps the DNA and sends out mRNA copies",
        "Links amino acids into proteins by reading mRNA",
        "Transfers energy from glucose into ATP",
        "Controls what enters and leaves the cell",
      ],
    },
    clues: [
      {
        id: "city-e1-q1",
        title: "What leaves the nucleus",
        prompt: "The builders need the instructions for one protein. What actually leaves the nucleus?",
        choices: ["The DNA itself", "An mRNA copy of the gene", "The finished protein", "A ribosome full of ATP"],
        answer: 1,
        cue: "Nell never lends out a master blueprint. She sends a copy through the Archive's gates.",
        nudge: "Originals stay in the Archive.",
        why: "DNA stays in the nucleus. The gene is transcribed into mRNA, and the mRNA leaves through nuclear pores to reach the ribosomes.",
        another: "Think of a library's only copy of a rare book: you photocopy the page you need and the book stays on the shelf.",
      },
      {
        id: "city-e1-q2",
        title: "What crosses the membrane freely",
        prompt: "Which of these can cross the cell membrane without a channel or pump?",
        choices: ["A sodium ion (Na⁺)", "Oxygen (O₂)", "Glucose", "A protein"],
        answer: 1,
        cue: "Mara waves small, uncharged travellers like oxygen straight through the wall. Charged ones must use a gate.",
        nudge: "Small and uncharged gets through.",
        why: "The inside of the bilayer is made of hydrophobic fatty-acid tails. Small nonpolar molecules like O₂ and CO₂ diffuse across; ions, glucose and proteins need transport proteins.",
        another: "The middle of the wall is oily. Things that mix with oil slide through; charged things get stuck.",
      },
      {
        id: "city-e1-q3",
        title: "What mitochondria do with energy",
        prompt: "What do mitochondria do with the energy stored in glucose?",
        choices: [
          "Create new energy",
          "Transfer it into ATP, losing some as heat",
          "Store it as DNA",
          "Turn it into oxygen",
        ],
        answer: 1,
        cue: "Kip's stations don't make energy from nothing. They recharge ATP batteries using fuel that's already full of energy.",
        nudge: "Recharge, don't create.",
        why: "Energy can't be created. Cellular respiration transfers chemical energy from glucose into ATP, and some of it is released as heat.",
        another: "A power plant doesn't invent electricity: it converts the energy already stored in its fuel.",
      },
    ],
    wrap: "That night, the lights on the east side flicker. Kip's phone rings. “We're short on power,” says a voice. “Fuel isn't reaching us.”",
  },
  {
    n: 2,
    title: "The Missing Energy",
    topic: "Glycolysis",
    place: "The streets of the cytoplasm",
    science: [
      "Glycolysis happens in the cytoplasm and doesn't need oxygen.",
      "One glucose (6 carbons) is split into two pyruvate molecules (3 carbons each).",
      "It spends 2 ATP to get started and makes 4 ATP, so the net gain is 2 ATP. It also loads 2 NAD⁺ with electrons, making 2 NADH.",
      "Glycolysis needs a supply of empty NAD⁺. When oxygen is short, cells refill it by fermentation: in animal cells, pyruvate is turned into lactate, which turns NADH back into NAD⁺.",
    ],
    mapping: [
      ["Glucose", "A six-block fuel parcel"],
      ["Glycolysis", "Courier Gly splitting parcels in the streets"],
      ["2 ATP invested", "The two-battery toll Gly pays to open each parcel"],
      ["Pyruvate", "The two half-parcels sent on to the power station"],
      ["NAD⁺ / NADH", "Empty and loaded electron vans"],
      ["Fermentation to lactate", "Emptying vans into lactate barrels when the station can't take deliveries"],
    ],
    scene: [
      { who: "osei", line: "The power stations say fuel isn't arriving. Start where the fuel starts: the streets." },
      { who: "gly", line: "Every six-block parcel stops with me first, right here in the street. No oxygen needed." },
      { who: "gly", line: "I pay a toll of two batteries to crack it open, split it into two three-block halves, and earn four batteries back. Two in my pocket." },
      { who: "gly", line: "The electrons I strip off go into my vans. Loaded vans drive to Kip's station. If I run out of empty vans, I have to stop." },
      { who: "kip", line: "Her half-parcels and loaded vans are arriving on time. So the trouble isn't in the streets." },
    ],
    rebuild: {
      kind: "order",
      id: "city-e2-rebuild",
      prompt: "Follow one parcel through the streets. Tap the steps in order.",
      cue: "Toll first, then the split, then the payoff.",
      steps: [
        "Glucose (6 carbons) arrives in the cytoplasm",
        "2 ATP are spent to prime it",
        "It splits into two 3-carbon molecules",
        "4 ATP and 2 NADH are made",
        "2 pyruvate head for the mitochondria",
      ],
    },
    clues: [
      {
        id: "city-e2-q1",
        title: "Where glycolysis happens",
        prompt: "Where does glycolysis take place?",
        choices: ["In the cytoplasm", "In the mitochondrial matrix", "On the inner mitochondrial membrane", "In the nucleus"],
        answer: 0,
        cue: "Gly works out in the streets, before any parcel reaches a power station.",
        nudge: "Streets, not stations.",
        why: "The enzymes of glycolysis are in the cytoplasm (cytosol). Only pyruvate goes on into the mitochondria.",
        another: "Glycolysis is ancient: bacteria without mitochondria do it too, so it can't depend on being inside one.",
      },
      {
        id: "city-e2-q2",
        title: "Net ATP from glycolysis",
        prompt: "What is the net ATP gain from glycolysis, per glucose?",
        choices: ["2", "4", "About 30", "0"],
        answer: 0,
        cue: "Gly pays a two-battery toll and earns four. What's left in her pocket?",
        nudge: "Earned minus the toll.",
        why: "Glycolysis uses 2 ATP in its investment phase and makes 4 ATP in its payoff phase: a net gain of 2 ATP per glucose.",
        another: "It's a small business: revenue of 4, costs of 2, profit of 2.",
      },
      {
        id: "city-e2-q3",
        title: "Keeping glycolysis going without oxygen",
        prompt: "During a sprint, a muscle cell runs short of oxygen. How does glycolysis keep going?",
        choices: [
          "Pyruvate is turned into lactate, which regenerates NAD⁺",
          "The mitochondria make extra oxygen",
          "Glycolysis stops completely",
          "Glucose is sent back into the nucleus",
        ],
        answer: 0,
        cue: "When the station can't take deliveries, Gly empties her vans into lactate barrels so she has empty vans again.",
        nudge: "It's about empty vans.",
        why: "Glycolysis needs NAD⁺. Without oxygen, NADH can't unload at the electron transport chain, so NAD⁺ runs out. Turning pyruvate into lactate oxidizes NADH back to NAD⁺, so glycolysis can continue.",
        another: "Fermentation doesn't make extra energy. Its only job is to free up the electron carriers.",
      },
    ],
    wrap: "Gly's parcels are arriving on time. So the trouble must be inside the power station itself.",
  },
  {
    n: 3,
    title: "Inside the Power Plant",
    topic: "Citric acid cycle, electron transport and ATP synthase",
    place: "Kip's power station: the matrix and the inner wall",
    science: [
      "Pyruvate enters the mitochondrial matrix and is converted to acetyl-CoA, releasing CO₂ and making NADH.",
      "The citric acid (Krebs) cycle, also in the matrix, breaks the acetyl group down to CO₂. It loads carriers (3 NADH and 1 FADH₂ per turn) and makes a little ATP. Each glucose gives two turns.",
      "The electron transport chain sits in the inner mitochondrial membrane. NADH and FADH₂ hand it their electrons. As electrons pass along the chain, their energy pumps protons (H⁺) from the matrix into the intermembrane space, building a gradient. Oxygen is the final electron acceptor and forms water.",
      "ATP synthase lets protons flow back into the matrix, down their gradient. The flow turns it, and it makes ATP from ADP and phosphate. This is chemiosmosis, and it makes most of the cell's ATP: roughly 26–28 of the 30–32 ATP from each glucose.",
    ],
    mapping: [
      ["Citric acid cycle", "The roundabout where fuel is stripped and vans are loaded"],
      ["Electron transport chain", "A bucket line of pumps along the station's inner wall"],
      ["Proton (H⁺) gradient", "Water held behind a dam"],
      ["ATP synthase", "The turbine in the dam"],
      ["Oxygen", "The catcher at the very end of the bucket line"],
      ["CO₂", "Exhaust from the fuel's carbon, released at the roundabout"],
    ],
    scene: [
      { who: "kip", line: "Welcome inside. Half-parcels come in and go round the roundabout. We strip the carbon off as exhaust and load every van we can." },
      { who: "kip", line: "Loaded vans unload electrons at the start of the bucket line. Every hand-off powers a pump that pushes protons over the dam wall." },
      { who: "kip", line: "Oxygen stands at the end of the line and catches the electrons. With a couple of protons, it becomes water. No catcher, and the whole line stops." },
      { who: "kip", line: "The protons behind the dam want to get back. The only way through is the turbine. That spin is what charges the ATP batteries." },
    ],
    rebuild: {
      kind: "order",
      id: "city-e3-rebuild",
      prompt: "Run the station from fuel to battery. Tap the steps in order.",
      cue: "Roundabout → vans → bucket line → dam → turbine.",
      steps: [
        "Pyruvate enters the matrix and becomes acetyl-CoA",
        "The citric acid cycle loads NADH and FADH₂",
        "NADH gives its electrons to the transport chain",
        "Electron energy pumps H⁺ into the intermembrane space",
        "H⁺ flows back through ATP synthase, which makes ATP",
      ],
    },
    clues: [
      {
        id: "city-e3-q1",
        title: "What powers ATP synthase",
        prompt: "What directly drives ATP synthase to make ATP?",
        choices: ["Protons flowing back down their gradient", "Electrons hitting it", "Oxygen binding to it", "Glucose entering it"],
        answer: 0,
        cue: "The turbine spins because water behind the dam rushes through it, not because vans drive into it.",
        nudge: "Think dam, not vans.",
        why: "The electron transport chain builds a proton gradient across the inner membrane. Protons flowing back through ATP synthase turn it, and that motion drives ATP synthesis (chemiosmosis).",
        another: "The pumps and the turbine are separate machines connected only by the water level. That's why anything that drains the reservoir stops ATP production.",
      },
      {
        id: "city-e3-q2",
        title: "Oxygen's job",
        prompt: "What is oxygen's job in cellular respiration?",
        choices: [
          "It accepts electrons at the end of the chain, forming water",
          "It's split to release energy directly",
          "It carries protons across the membrane",
          "It becomes the CO₂ that we breathe out",
        ],
        answer: 0,
        cue: "Oxygen is the catcher at the end of the bucket line. No catcher, and the line backs up.",
        nudge: "End of the line.",
        why: "Oxygen is the final electron acceptor of the electron transport chain; it combines with electrons and protons to form water. The CO₂ we breathe out comes from the carbon in the fuel.",
        another: "Follow the atoms: the carbon in CO₂ comes from glucose (released at the roundabout), and the oxygen we breathe ends up in water.",
      },
      {
        id: "city-e3-q3",
        title: "Where the transport chain is",
        prompt: "Where is the electron transport chain?",
        choices: ["The inner mitochondrial membrane", "The outer mitochondrial membrane", "The cytoplasm", "The nucleus"],
        answer: 0,
        cue: "The bucket line runs along the station's inner wall, the one with the dam.",
        nudge: "The inner wall.",
        why: "The chain's protein complexes are embedded in the inner mitochondrial membrane, which is folded into cristae to hold more of them.",
        another: "A gradient needs a wall to be built against. The inner membrane is the wall between the matrix and the intermembrane space.",
      },
      {
        id: "city-e3-q4",
        title: "Where most ATP comes from",
        prompt: "Which stage makes most of the ATP from one glucose?",
        choices: ["Oxidative phosphorylation (ATP synthase)", "Glycolysis", "The citric acid cycle", "Fermentation"],
        answer: 0,
        cue: "Gly pockets 2 batteries and the roundabout makes a couple more. The turbine charges the rest.",
        nudge: "The turbine.",
        why: "Glycolysis and the citric acid cycle make about 4 ATP between them. Oxidative phosphorylation makes roughly 26–28 more, using the electrons carried by NADH and FADH₂.",
        another: "The early stages mostly load carriers. Their real value is the electrons they pass to the chain.",
      },
    ],
    wrap: "At 3:07 a.m., the whole city goes dark.",
  },
  {
    n: 4,
    title: "The Great Blackout",
    topic: "When oxidative phosphorylation breaks",
    place: "The darkened power stations",
    science: [
      "If electrons can't reach oxygen (because there's no oxygen, or a poison like cyanide blocks the chain's last complex), the chain stops. No pumping means no gradient, so ATP synthase stops too. Oxygen use falls.",
      "NADH can't unload, so NAD⁺ runs short. Only glycolysis and fermentation keep going, making about 2 ATP per glucose, and lactate builds up.",
      "If ATP synthase itself is blocked (for example by the drug oligomycin), protons can't flow back. The gradient gets so steep that the pumps can barely push against it, so the chain slows and oxygen use drops.",
      "If the membrane leaks protons (an uncoupler, such as the drug DNP), the gradient drains away without passing through ATP synthase. The chain runs flat out and uses lots of oxygen, but the energy is released as heat instead of making ATP.",
    ],
    mapping: [
      ["No oxygen, or cyanide", "No catcher at the end of the bucket line"],
      ["ATP synthase blocked", "The turbine jammed, so the water piles up behind the dam"],
      ["Uncoupler (leaky membrane)", "A crack in the dam: water drains past the turbine and just splashes"],
      ["Lactate building up", "Lactate barrels stacking up in the streets"],
    ],
    scene: [
      { who: "osei", line: "Every district is dark. I need to know what happened, and I need it tonight." },
      { who: "kip", line: "A station like mine can fail in three ways, and each one leaves different fingerprints." },
      { who: "kip", line: "Lose the catcher, and the bucket line stops. Jam the turbine, and water piles up so high the pumps can't push. Crack the dam, and the pumps race while the water just drains away as heat." },
      { who: "gly", line: "Whatever it is, I can keep a little power on. I'll fill lactate barrels so my vans stay empty." },
    ],
    rebuild: {
      kind: "match",
      id: "city-e4-rebuild",
      prompt: "Match each failure to what you'd measure. Tap a failure, then its fingerprints.",
      cue: "Catcher, turbine, dam: ask what happens to the water level in each.",
      left: ["No oxygen, or cyanide", "ATP synthase blocked", "Leaky membrane (uncoupler)"],
      right: [
        "The chain stops, oxygen use falls, lactate rises",
        "The gradient builds up and oxygen use drops",
        "Oxygen use soars, the gradient drains and heat rises",
      ],
    },
    clues: [
      {
        id: "city-e4-q1",
        title: "Cyanide and oxygen use",
        prompt: "Cyanide blocks the last complex of the chain, even when there's plenty of oxygen. What happens to the cell's oxygen use?",
        choices: ["It falls", "It rises", "It stays the same", "Oxygen is turned into CO₂ faster"],
        answer: 0,
        cue: "The catcher is still there, but cyanide ties its hands. Nothing reaches it.",
        nudge: "Nothing reaches the catcher.",
        why: "Cyanide blocks cytochrome c oxidase (complex IV), which hands electrons to oxygen. With no electrons delivered, oxygen isn't used, even though it's present.",
        another: "Having oxygen isn't the same as using it. Using it depends on electrons arriving at the end of the chain.",
      },
      {
        id: "city-e4-q2",
        title: "Why uncouplers make heat",
        prompt: "With an uncoupler, why does the body heat up?",
        choices: [
          "The gradient's energy is released as heat instead of making ATP",
          "ATP synthase spins faster",
          "Oxygen catches fire",
          "Glycolysis stops",
        ],
        answer: 0,
        cue: "A crack in the dam: the water still rushes downhill, but it skips the turbine and just splashes.",
        nudge: "Water past the turbine.",
        why: "Protons leak back across the membrane without passing through ATP synthase. The chain speeds up to try to rebuild the gradient, and the energy is released as heat.",
        another: "It's like revving a car in neutral: the engine burns fuel hard and gets hot, but the wheels don't turn.",
      },
      {
        id: "city-e4-q3",
        title: "Why a jammed ATP synthase slows the chain",
        prompt: "If ATP synthase is blocked, why does the electron transport chain slow down too?",
        choices: [
          "The gradient gets so steep the pumps can't push more H⁺ against it",
          "The electrons are used up",
          "Oxygen is destroyed",
          "NADH is turned back into glucose",
        ],
        answer: 0,
        cue: "Jam the turbine and the water behind the dam rises until the pumps can't lift any more.",
        nudge: "Water rises behind the dam.",
        why: "Pumping and ATP synthesis are coupled by the proton gradient. If protons can't flow back, the gradient builds until pumping (and so electron flow and oxygen use) slows sharply.",
        another: "Trying to bail water into a full bucket: past a point, each scoop just won't go in.",
      },
    ],
    wrap: "Three suspects, one city. At dawn, the readings from each district come in.",
  },
  {
    n: 5,
    title: "The Investigation",
    topic: "Putting the clues together",
    place: "The city control room",
    science: [
      "Four readings tell you where the breakdown is. Oxygen use shows how fast electrons reach the end of the chain. The proton gradient shows how much energy is waiting to pass through ATP synthase. NADH shows whether carriers can unload. Lactate shows whether cells have fallen back on fermentation.",
      "Read them together: no single reading proves a cause.",
    ],
    mapping: [
      ["Oxygen use", "How fast the catcher is catching"],
      ["Proton gradient", "The water level behind the dam"],
      ["NADH level", "Loaded vans waiting to unload"],
      ["Lactate", "Lactate barrels in the streets"],
    ],
    scene: [
      { who: "osei", line: "Three districts, three sets of readings. Tell me what went wrong in each." },
      { who: "kip", line: "Read the water level and the catcher together. They'll tell you which machine failed." },
    ],
    rebuild: {
      kind: "match",
      id: "city-e5-rebuild",
      prompt: "Learn the instruments first. Match each reading to what it tells you.",
      cue: "Catcher, water level, vans, barrels.",
      left: ["Oxygen use", "Proton gradient", "NADH level", "Lactate"],
      right: [
        "How fast electrons reach the end of the chain",
        "Energy stored across the inner membrane",
        "Whether electron carriers can unload",
        "Whether cells have fallen back on fermentation",
      ],
    },
    clues: [
      {
        id: "city-e5-q1",
        title: "The East district",
        prompt: "East district readings. What went wrong?",
        readings: [
          { label: "Oxygen use", level: "very high" },
          { label: "Proton gradient", level: "low", note: "nearly flat" },
          { label: "ATP", level: "low" },
          { label: "Temperature", level: "high", note: "rising" },
        ],
        choices: ["The membrane is leaking protons (an uncoupler)", "There's no oxygen", "ATP synthase is jammed", "Glycolysis has stopped"],
        answer: 0,
        cue: "The pumps are racing but the water level won't rise, and everything's getting warm. Where's the water going?",
        nudge: "Racing pumps, no water, heat.",
        why: "High oxygen use means electrons are flowing fast. A flat gradient despite that means protons are leaking back without going through ATP synthase, so ATP is low and the energy becomes heat.",
        another: "Only one suspect makes the chain run faster than normal: the leak. The other two both slow oxygen use down.",
      },
      {
        id: "city-e5-q2",
        title: "The Harbour district",
        prompt: "Harbour district readings. Oxygen is available in the air. What went wrong?",
        readings: [
          { label: "Oxygen use", level: "none", note: "near zero, though oxygen is present" },
          { label: "Proton gradient", level: "low", note: "collapsed" },
          { label: "NADH", level: "very high", note: "piling up" },
          { label: "Lactate", level: "high", note: "rising" },
        ],
        choices: ["The chain's last step is blocked (like cyanide)", "The membrane is leaking protons", "ATP synthase is jammed", "The cells are making too much ATP"],
        answer: 0,
        cue: "The catcher is standing right there, but nothing reaches it. The vans are stuck, and the barrels are filling.",
        nudge: "Oxygen present, but unused.",
        why: "Near-zero oxygen use with oxygen present means electrons can't reach it: the chain is blocked at its end. No pumping collapses the gradient, NADH can't unload, and cells ferment to lactate.",
        another: "If the air supply had simply run out, you'd see the same readings. What rules that out here is that oxygen is present.",
      },
      {
        id: "city-e5-q3",
        title: "The Old Town district",
        prompt: "Old Town district readings. What went wrong?",
        readings: [
          { label: "Oxygen use", level: "low" },
          { label: "Proton gradient", level: "very high", note: "steeper than ever" },
          { label: "ATP", level: "low" },
          { label: "NADH", level: "high" },
        ],
        choices: ["ATP synthase is jammed", "The membrane is leaking protons", "There's too much oxygen", "The nucleus has shut down"],
        answer: 0,
        cue: "The water behind the dam is higher than it's ever been, and still no batteries are charging.",
        nudge: "Highest water, no batteries.",
        why: "A very high gradient with low ATP means protons can't get back through ATP synthase. The steep gradient then slows the pumps, so oxygen use drops and NADH backs up.",
        another: "Compare it with the East district: both have low ATP, but the water level is opposite. Leak: flat. Jam: sky-high.",
      },
      {
        id: "city-e5-q4",
        title: "The deciding reading",
        prompt: "Both Harbour and Old Town have low oxygen use and low ATP. Which single reading best tells them apart?",
        choices: ["The proton gradient", "ATP", "Oxygen use", "Temperature"],
        answer: 0,
        cue: "One district's dam is empty; the other's is overflowing.",
        nudge: "Check the dam.",
        why: "A blocked chain can't pump, so the gradient collapses. A jammed ATP synthase can't let protons back, so the gradient is very high. The other readings look alike.",
        another: "When two causes share symptoms, look for the one measurement where they predict opposite results.",
      },
    ],
    wrap: "You've named the culprit in every district. Now the Mayor wants the lights back on.",
  },
  {
    n: 6,
    title: "Restore the City",
    topic: "Reasoning on your own",
    place: "Every district at once",
    noCues: true,
    science: [
      "No cues this time. Everything you need is in what you've already rebuilt. If you get stuck, you can still ask for a hint, but the question will come back sooner.",
    ],
    mapping: [],
    scene: [
      { who: "osei", line: "No map, no hints from Kip. Just you. Each district needs the right fix." },
      { who: "nell", line: "The Archive has one last question for you: a real body that makes its own leak, on purpose." },
    ],
    rebuild: {
      kind: "order",
      id: "city-e6-rebuild",
      prompt: "Oxygen has been restored to the Harbour. Put the restart in order.",
      cue: "",
      steps: [
        "NADH unloads its electrons into the chain again",
        "Electrons pass along the chain to oxygen",
        "The pumps push H⁺ out and the gradient rebuilds",
        "H⁺ flows back through ATP synthase and ATP rises",
      ],
    },
    clues: [
      {
        id: "city-e6-q1",
        title: "Fixing the East district",
        prompt: "What fixes the East district, where protons were leaking?",
        choices: [
          "Seal the leak, so protons can only return through ATP synthase",
          "Add more oxygen",
          "Add more glucose",
          "Block ATP synthase",
        ],
        answer: 0,
        cue: "",
        nudge: "",
        why: "The chain was already running fast with plenty of oxygen. The energy was escaping through the leak. Sealing it forces protons back through ATP synthase.",
        another: "More fuel or oxygen just makes the pumps race harder. The water still drains out of the crack.",
      },
      {
        id: "city-e6-q2",
        title: "ATP without oxygen",
        prompt: "A cell has plenty of glucose but no oxygen at all. About how much ATP can it make per glucose?",
        choices: ["About 2", "About 30", "None", "About 100"],
        answer: 0,
        cue: "",
        nudge: "",
        why: "Without oxygen only glycolysis runs, kept going by fermentation, which gives a net 2 ATP per glucose.",
        another: "That's why sprint muscles tire fast: roughly 2 ATP per glucose instead of about 30.",
      },
      {
        id: "city-e6-q3",
        title: "Brown fat",
        prompt: "Brown fat, which newborn babies have plenty of, contains a protein (UCP1) that lets protons leak back across the inner mitochondrial membrane. What is it for?",
        choices: ["Making heat to keep warm", "Making extra ATP", "Storing oxygen", "Making glucose"],
        answer: 0,
        cue: "",
        nudge: "",
        why: "UCP1 is a natural uncoupler. Protons bypass ATP synthase, so the energy in the gradient is released as heat, which keeps the baby warm.",
        another: "It's the East district's crack in the dam, built on purpose. The same fault becomes a feature when heat is what you need.",
      },
      {
        id: "city-e6-q4",
        title: "Carbon in the exhaust",
        prompt: "Where do the carbon atoms in the CO₂ you breathe out come from?",
        choices: ["The glucose (fuel) molecules", "The oxygen you breathe in", "ATP", "Water"],
        answer: 0,
        cue: "",
        nudge: "",
        why: "CO₂ is released as pyruvate is converted to acetyl-CoA and during the citric acid cycle; its carbon comes from glucose. The oxygen you breathe in ends up in water.",
        another: "You exhale the fuel's carbon. Weight lost from fat mostly leaves the body this way.",
      },
    ],
    explain: {
      id: "city-e6-explain",
      prompt: "Mayor Osei asks: “Why did the whole city go dark when the oxygen ran out?” Explain it in your own words.",
      ideas: [
        { label: "Oxygen is the final electron acceptor", keywords: ["accept", "catch", "final", "end of the chain", "last"] },
        { label: "Without it, electrons stop moving along the chain", keywords: ["electron", "chain", "back up", "stop"] },
        { label: "No pumping, so no proton gradient", keywords: ["gradient", "proton", "h+", "pump"] },
        { label: "ATP synthase stops, so ATP falls", keywords: ["atp synthase", "synthase", "turbine", "atp"] },
      ],
    },
    wrap: "District by district, the lights come back on. Mayor Osei names you the city's first Chief Investigator.",
  },
];

export const cityQuestions = cellCity.flatMap((e) => e.clues);

// City ids are all "city-e<episode>-<item>".
export function findCityItem(id: string) {
  for (const e of cellCity) {
    const q = e.clues.find((c) => c.id === id);
    if (q) return { episode: e, question: q };
    if (e.rebuild.id === id) return { episode: e, rebuild: e.rebuild };
    if (e.explain?.id === id) return { episode: e, explain: e.explain };
  }
  return null;
}

// Cues fade as you show you can recall without them, and come back after a miss.
export type CueLevel = 0 | 1 | 2;
export function cueLevel(attempts: { conceptId: string; correct: boolean }[], id: string): CueLevel {
  let streak = 0;
  for (const a of attempts.filter((x) => x.conceptId === id).reverse()) {
    if (!a.correct) break;
    streak++;
  }
  return Math.min(2, streak) as CueLevel;
}

export function explainCovered(text: string, e: Explain) {
  const t = text.toLowerCase();
  return e.ideas.map((idea) => idea.keywords.some((k) => t.includes(k)));
}

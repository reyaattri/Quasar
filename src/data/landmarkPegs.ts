const objects = [
  [
    ["Door", "Otter"],
    ["Tile", "Tail"],
    ["Bone", "Pin"],
    ["Shawl", "Jelly"],
    ["Mail", "Mole"],
    ["VIP", "Fib"],
  ],
  [
    ["Door", "Otter"],
    ["Doll", "Tail"],
    ["Bun", "Pin"],
    ["Shell", "Jelly"],
    ["Mule", "Mole"],
    ["Fob", "Fib"],
  ],
  [
    ["Tyre", "Otter"],
    ["Doll", "Tile"],
    ["Bun", "Bone"],
    ["Shell", "Shawl"],
    ["Mule", "Mail"],
    ["VIP", "Fib"],
  ],
];
const sounds: Record<string, string> = {
  Door: "D (1), R (4)",
  Otter: "T (1), R (4)",
  Tyre: "T (1), R (4)",
  Tile: "T (1), L (5)",
  Tail: "T (1), L (5)",
  Doll: "D (1), L (5)",
  Bone: "B (9), N (2)",
  Pin: "P (9), N (2)",
  Bun: "B (9), N (2)",
  Shawl: "SH (6), L (5)",
  Shell: "SH (6), L (5)",
  Jelly: "J (6), L (5)",
  Mail: "M (3), L (5)",
  Mole: "M (3), L (5)",
  Mule: "M (3), L (5)",
  VIP: "V (8), P (9)",
  Fob: "F (8), B (9)",
  Fib: "F (8), B (9)",
};
const stories = [
  [
    [
      "An exhausted keeper carries a huge shoji door and hits the welcome bell. Hear the wooden clonk.",
      "An otter tries to fit its round belly into the shoe rack. Its whiskers twitch with effort.",
    ],
    [
      "A roof tile springs out of the toy chest and makes the maker fall backwards.",
      "A huge fox tail carries a paper crane and a dangling maker like a kite.",
    ],
    [
      "A crowned bone balances on the tiny bonsai. Imagine the tree bending under its royal visitor.",
      "A huge safety pin clips bamboo stalks together. They spring shut with a metallic SNAP.",
    ],
    [
      "A grand royal shawl wraps the tea hearth. The host sneezes as it warms up.",
      "A jelly on the cup shelf slurps tea through its own wobbly arm.",
    ],
    [
      "Mail flies from the stove until envelopes bury the chef. Hear the papery flutter.",
      "A mole wears a lacquer bowl as a helmet and poses proudly beside the chef.",
    ],
    [
      "A pompous VIP makes the practice rack bow. Say vip as one word, V–P, not three letter names.",
      "A calligrapher tells a fib about a tiny nose. His real nose grows all the way to the wall scroll. Fib is the encoded word.",
    ],
  ],
  [
    [
      "A heavy stone door lifts the guard into the air on the weighing scales.",
      "An otter embraces the ceremonial torch like a singer holding a microphone.",
    ],
    [
      "A giant wooden doll looms over the mosaic table. The tiny mason raises his hands in surrender.",
      "A huge cat tail tickles the chisel rack until every tool rattles.",
    ],
    [
      "A steaming bun flattens the papyrus as the scribe jumps away from the heat.",
      "A golden safety pin fastens the date-palm leaves together. Picture that impossibly large pin.",
    ],
    [
      "A giant shell admires itself in the gold mirror while the noble stares.",
      "A jelly conducts the perfume jars like an orchestra. Imagine the bottles clinking in time.",
    ],
    [
      "A stubborn mule sits on the writing desk eating the scribe’s paperwork.",
      "A mole crawls out of the scroll shelf wearing the scrolls like a suit.",
    ],
    [
      "A tiny fob commands the royal throne. The noble cannot believe the small key is in charge.",
      "The scribe tells a fib about the treasure. His long nose reaches across the chest. Remember fib: F–B.",
    ],
  ],
  [
    [
      "A huge tyre squashes the security console. The courier gapes at the rubber monster.",
      "An otter juggles the parcel shelf’s boxes as if deliveries were circus balls.",
    ],
    [
      "A giant doll stirs the noodle cooker while the tiny chef panics beside her.",
      "A tile tap-dances in front of the drink fridge and refuses to let the chef in.",
    ],
    [
      "A steaming bun drives the racing cabinet at full speed. It leaves a trail of flour.",
      "A crowned bone becomes the pinball flipper. Hear the hard bone knocking the ball.",
    ],
    [
      "A giant shell balances on the neon fern and sips water through a straw.",
      "A royal shawl dresses the strawberry planter like a diva. Its leaves pose for applause.",
    ],
    [
      "A stubborn mule is caught in the antenna coil. Its braying makes the lights flicker.",
      "Mail avalanches from the tool rack until the mechanic disappears under envelopes.",
    ],
    [
      "A VIP demands that the moon gate open. Say vip as one word: V–P.",
      "The astronomer tells a fib about the stars. His nose grows long enough to poke the globe. Encode fib, not astronomer.",
    ],
  ],
];
export function landmarkPeg(world: number, room: number, slot: number) {
  const i = Math.max(0, Math.min(1, slot - 1)),
    object = objects[world][room][i];
  return {
    object,
    story: stories[world][room][i],
    decode: `${object} → ${sounds[object]}. Vowels do not count.${object === "Otter" ? " Say otter with a clear t and r for this sound hook." : ""}`,
  };
}

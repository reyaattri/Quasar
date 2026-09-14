import { PalaceItem } from "./palaces";

const hosts = [
  "the tea gardener",
  "the palace gardener",
  "the greenhouse robot",
];
const actions = [
  "wedges it in the doorway",
  "makes it splash from a pot",
  "balances it on a leaf",
  "waters it until it grows enormous",
  "makes it dance around the planter",
  "uses it as the door key",
  "juggles it over the terrace",
  "makes it float in the fountain",
];
export const worldPegs = [
  [
    [
      "Tyre",
      "T (1), R (4)",
      "A solemn dojo master bows to a giant tyre. It bows back with a rubber squeak beside a tiny torii.",
    ],
    [
      "Doll",
      "D (1), L (5)",
      "A tiny toy maker climbs a stool to measure an enormous doll. The ruler is still too short.",
    ],
    [
      "Bun",
      "B (9), N (2)",
      "A startled gardener fans a huge steaming bun balanced on a purple iris. Its petals flap with every puff.",
    ],
    [
      "Shell",
      "SH (6), L (5)",
      "A startled tea host pours from a giant shell. The shell slurps the tea straight back out of the cup.",
    ],
    [
      "Mule",
      "M (3), L (5)",
      "A chef offers rice to a stubborn mule standing inside the rice bowl. Picture the absurd size of that bowl.",
    ],
    [
      "Fob",
      "F (8), B (9)",
      "A student waves a tiny key fob. The enormous wooden training dummy bows to it instead of sparring.",
    ],
  ],
  [
    [
      "Tyre",
      "T (1), R (4)",
      "A scarab rolls a tyre into the sandstone arch. It jams with a rubber squeal.",
    ],
    [
      "Tile",
      "T (1), L (5)",
      "A turquoise tile tap-dances by the pool. Each tap splashes blue water.",
    ],
    [
      "Bone",
      "B (9), N (2)",
      "A bone wearing a linen crown bounces on a lotus like a trampoline.",
    ],
    [
      "Shawl",
      "SH (6), L (5)",
      "A turquoise shawl blows a trumpet so loudly the papyrus shakes.",
    ],
    [
      "Mail",
      "M (3), L (5)",
      "A papyrus mail scroll delivers itself to the sphinx and unrolls down its nose.",
    ],
    [
      "VIP",
      "V (8), P (9)",
      "A gold-robed guest flashes a giant VIP pass to a bowing ibis attendant. Say vip as one word: V-P encodes 8-9.",
    ],
  ],
  [
    [
      "Door",
      "D (1), R (4)",
      "A robot door bows so far that the courier drops a huge parcel onto their own head.",
    ],
    [
      "Tail",
      "T (1), L (5)",
      "A ramen chef gawps as a mechanical tail juggles three hot noodle bowls behind the counter.",
    ],
    [
      "Pin",
      "P (9), N (2)",
      "A giant glowing pin pops out of the vending machine and pins its refund to the wall.",
    ],
    [
      "Jelly",
      "J (6), L (5)",
      "A jelly alien waters glowing orchids with its wobbling tentacles.",
    ],
    [
      "Mole",
      "M (3), L (5)",
      "A robot mole repairs the antenna with its drill nose. Hear the metallic buzzing.",
    ],
    [
      "Fob",
      "F (8), B (9)",
      "A floating key fob projects a huge holographic key into the moon gate.",
    ],
  ],
];
export function contextualCue(
  item: PalaceItem,
  world: number,
  stop: number,
  place: string,
  pi: boolean,
): PalaceItem {
  if (pi) {
    const [object, sounds, story] = worldPegs[world][stop];
    return {
      ...item,
      object,
      story: `At ${place}: ${story}`,
      decode: `${object} → ${sounds}. Vowels do not count. Only this object's consonant sounds encode the digits.`,
    };
  }
  return {
    ...item,
    story: `At ${place}, ${hosts[world]} ${actions[stop % actions.length]}: ${item.object}. ${item.story}`,
  };
}

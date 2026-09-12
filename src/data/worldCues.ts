import { PalaceItem } from "./palaces";

const hosts = ["the tea gardener", "the palace gardener", "the greenhouse robot"];
const actions = ["wedges it in the doorway", "makes it splash from a pot", "balances it on a leaf", "waters it until it grows enormous", "makes it dance around the planter", "uses it as the door key", "juggles it over the terrace", "makes it float in the fountain"];
export const worldPegs = [
  [["Tyre","T (1), R (4)","A giant tyre bows beside a tiny torii with a rubber squeak."],["Doll","D (1), L (5)","A tiny kimono doll lifts a giant doll. Its sandal splashes the koi."],["Bun","B (9), N (2)","A steamed bun sneezes warm clouds through the lantern window."],["Shell","SH (6), L (5)","A shell sings while pouring tea onto the plants; every leaf trembles."],["Mule","M (3), L (5)","A skating mule kicks rice confetti from a lacquer bowl while attempting ballet."],["Fob","F (8), B (9)","A wooden key fob grows a friendly face and unlocks the dojo with a sneeze."]],
  [["Tyre","T (1), R (4)","A scarab rolls a tyre into the sandstone arch. It jams with a rubber squeal."],["Tile","T (1), L (5)","A turquoise tile tap-dances by the pool. Each tap splashes blue water."],["Bone","B (9), N (2)","A bone wearing a linen crown bounces on a lotus like a trampoline."],["Shawl","SH (6), L (5)","A turquoise shawl blows a trumpet so loudly the papyrus shakes."],["Mail","M (3), L (5)","A papyrus mail scroll delivers itself to the sphinx and unrolls down its nose."],["VIP","V (8), P (9)","An ibis flashes a gold VIP pass. Say 'vip' as one word as the pyramid door opens."]],
  [["Door","D (1), R (4)","A robot door bows on the entrance steps with a glowing smile."],["Tail","T (1), L (5)","A detachable robot tail juggles noodles above the ramen counter."],["Pin","P (9), N (2)","A giant glowing pin pops out of the vending machine and pins its refund to the wall."],["Jelly","J (6), L (5)","A jelly alien waters glowing orchids with its wobbling tentacles."],["Mole","M (3), L (5)","A robot mole repairs the antenna with its drill nose. Hear the metallic buzzing."],["Fob","F (8), B (9)","A floating key fob projects a huge holographic key into the moon gate."]],
];
export function contextualCue(item: PalaceItem, world: number, stop: number, place: string, pi: boolean): PalaceItem {
  if(pi){const [object,sounds,story]=worldPegs[world][stop];return {...item,object,story:`At ${place}: ${story}`,decode:`${object} → ${sounds}. Vowels do not count. Only this object's consonant sounds encode the digits.`};}
  return { ...item, story: `At ${place}, ${hosts[world]} ${actions[stop % actions.length]}: ${item.object}. ${item.story}` };
}


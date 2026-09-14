// First 100 digits after the decimal point, grouped into 50 two-digit pegs.
export const PI_DECIMALS =
  "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";
export const majorSounds = [
  "S / Z",
  "T / D",
  "N",
  "M",
  "R",
  "L",
  "SH / CH / J",
  "K / hard G",
  "F / V",
  "P / B",
];
// Encode sounds, not spelling. Vowels and silent letters do not encode digits.
const pegs: Record<string, [string, string]> = {
  "03": [
    "Sumo",
    "A sumo wrestler uses the furniture as a tiny folding chair. It squeaks for mercy.",
  ],
  "06": [
    "Sash",
    "A beauty-pageant winner wears a sash so long that the audience gets gift-wrapped.",
  ],
  "07": [
    "Sock",
    "A sock performs an opera. The conductor faints from the smell.",
  ],
  "08": [
    "Safe",
    "A burglar opens a safe and finds another burglar guarding one biscuit.",
  ],
  "10": [
    "Toes",
    "A ballet dancer’s giant toes play piano while the rest of the dancer takes a nap.",
  ],
  "14": [
    "Tyre",
    "A traffic officer tries to handcuff a tyre. It rolls away wearing the cuffs as earrings.",
  ],
  "15": [
    "Doll",
    "A toy maker measures a giant doll. The doll measures him back with a microscopic ruler.",
  ],
  "17": [
    "Duck",
    "A duck in a judge’s wig bangs a bread loaf instead of a gavel. Everyone quacks “objection!”",
  ],
  "19": [
    "Tub",
    "A captain sails a bathtub. A rubber duck refuses to pay rent.",
  ],
  "20": [
    "Nose",
    "A perfumer’s enormous nose vacuums up every flower, then sneezes a bouquet.",
  ],
  "21": [
    "Net",
    "A fisherman catches a chef in his net. The chef demands a five-star review.",
  ],
  "23": [
    "Gnome",
    "A garden gnome gives a very serious lecture to a mushroom that keeps applauding. Say nome: the g is silent.",
  ],
  "25": [
    "Nail",
    "A carpenter paints a giant nail’s fingernails. The hammer waits at reception.",
  ],
  "26": [
    "Nacho",
    "A chef rides a giant nacho like a surfboard through a tidal wave of cheese.",
  ],
  "28": [
    "Knife",
    "A chef’s knife puts on spectacles and carefully cuts a cake into invisible slices. Say nife: the k is silent.",
  ],
  "32": [
    "Moon",
    "An astronaut tries to iron the moon. Every crater pops back up like bubble wrap.",
  ],
  "34": [
    "Mower",
    "A gardener drives a mower through a spaghetti lawn. It coughs up meatballs.",
  ],
  "35": [
    "Mule",
    "A mule refuses to move until its tiny human chauffeur carries it in a handbag.",
  ],
  "38": [
    "Movie",
    "A cinema usher screens a movie to an audience of popcorn. They throw tiny humans at the screen.",
  ],
  "39": [
    "Map",
    "A tourist unfolds a map so large that the tour guide disappears inside a paper mountain.",
  ],
  "43": [
    "Ram",
    "A ram in a dinner jacket headbutts the dinner bell, then politely asks for seconds.",
  ],
  "44": [
    "Rower",
    "A rower paddles furiously in a teaspoon. His coach times him with a sundial.",
  ],
  "46": [
    "Roach",
    "A roach inspects a hotel bed with white gloves. The hotel manager hides under a cup.",
  ],
  "48": [
    "Roof",
    "A roofer lifts a roof like an umbrella. A cloud knocks and asks to come indoors.",
  ],
  "49": [
    "Rope",
    "A magician’s rope ties the magician into a bow and takes the applause.",
  ],
  "50": [
    "Lace",
    "A sprinter ties her lace. It ties the entire stadium together. Nobody can leave.",
  ],
  "58": [
    "Loaf",
    "A baker cuts a loaf. The loaf shouts “haircut!” and hands over a tiny tip.",
  ],
  "59": [
    "Lip",
    "A singer’s giant lip blows a kiss that knocks the orchestra off its chairs.",
  ],
  "62": [
    "Chain",
    "A weightlifter lifts a chain. The chain flexes back and asks him to spot it.",
  ],
  "64": [
    "Chair",
    "A chair sits on an exhausted office worker and complains about the posture.",
  ],
  "65": [
    "Shell",
    "A tea host fills a shell. The shell loudly slurps all the tea back out of the cups.",
  ],
  "69": [
    "Ship",
    "A sailor launches a ship in his soup. The waiter brings a lighthouse as seasoning.",
  ],
  "71": [
    "Cat",
    "A cat hires a human to push things off the table. It gives a performance review: “more chaos.”",
  ],
  "75": [
    "Coal",
    "A miner polishes a lump of coal for a beauty contest. It wins Miss Smudge.",
  ],
  "79": [
    "Cape",
    "A superhero’s cape flies away without him. He chases it in very ordinary socks.",
  ],
  "81": [
    "Foot",
    "A footballer’s giant foot signs autographs while the football asks for a selfie.",
  ],
  "84": [
    "Fire",
    "A firefighter meets a tiny fire wearing sunglasses. It asks for sunscreen.",
  ],
  "86": [
    "Fish",
    "A fish casts a rod and catches a fisherman. It complains that humans are too bony.",
  ],
  "89": [
    "Fob",
    "A valet presses a key fob. Every chair in the room honks and flashes its headlights.",
  ],
  "92": [
    "Bun",
    "A baker sits a bun on a throne. It sneezes flour over the royal guests.",
  ],
  "93": [
    "Beam",
    "A builder balances a beam on one finger. The beam balances a tiny builder on its finger.",
  ],
  "97": [
    "Bike",
    "A cyclist pedals a bike whose wheels are square. The bell screams at every bump.",
  ],
  "99": [
    "Pipe",
    "A plumber fixes a pipe. It blows bubbles shaped like miniature plumbers.",
  ],
};
export const piRooms = [
  [
    "The backwards bakery",
    "Flour door",
    "Mixing bowl",
    "Oven handle",
    "Cake counter",
    "Till",
  ],
  [
    "The moon hotel",
    "Reception bell",
    "Lift mirror",
    "Luggage cart",
    "Bed pillow",
    "Balcony rail",
  ],
  [
    "The underwater school",
    "School gate",
    "Coat hook",
    "Teacher’s desk",
    "Chalkboard",
    "Fish tank",
  ],
  [
    "The tiny royal theatre",
    "Ticket window",
    "Red curtain",
    "Spotlight",
    "Royal seat",
    "Stage trapdoor",
  ],
  [
    "The cloud gym",
    "Turnstile",
    "Locker",
    "Treadmill",
    "Weight rack",
    "Water fountain",
  ],
  [
    "The dragon laundry",
    "Laundry basket",
    "Washing machine",
    "Dryer door",
    "Ironing board",
    "Sock shelf",
  ],
  [
    "The midnight museum",
    "Marble steps",
    "Security desk",
    "Statue plinth",
    "Portrait frame",
    "Gift counter",
  ],
  [
    "The upside-down diner",
    "Neon sign",
    "Booth seat",
    "Menu stand",
    "Griddle",
    "Milkshake machine",
  ],
  [
    "The dinosaur post office",
    "Postbox",
    "Stamp desk",
    "Parcel scales",
    "Sorting shelf",
    "Delivery bike",
  ],
  [
    "The cosmic garden",
    "Garden gate",
    "Seed tray",
    "Bird bath",
    "Potting bench",
    "Moon fountain",
  ],
];
export const piStops = PI_DECIMALS.match(/../g)!.map((pair, index) => ({
  index,
  pair,
  object: pegs[pair][0],
  story: pegs[pair][1],
  room: piRooms[Math.floor(index / 5)][0],
  location: piRooms[Math.floor(index / 5)][(index % 5) + 1],
  decode: pair
    .split("")
    .map((d) => `${majorSounds[+d]} → ${d}`)
    .join(" · "),
}));
export function checkPiRecall(input: string, start: number, count: number) {
  const value = input.replace(/[\s.,]/g, "");
  const expected = PI_DECIMALS.slice(start, start + count);
  const wrong = Array.from(
    { length: Math.max(value.length, expected.length) },
    (_, i) => i,
  ).find((i) => value[i] !== expected[i]);
  return { correct: wrong === undefined, wrong, expected };
}

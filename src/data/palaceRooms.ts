// Every route has a fixed, pre-populated anchor. Personal hooks are optional.
export const palaceRooms = [
  [
    {objects:['Red torii','Welcome bell','Shoe rack'],action:'The miniature torii bows and knocks the welcome bell. Hear the wooden CLONK.'},
    {objects:['Doll workbench','Toy chest','Paper crane'],action:'A tiny kimono doll lifts a giant doll on the workbench. The giant knocks every toy into the air.'},
    {objects:['Purple iris','Bonsai','Bamboo'],action:'A hot bun lands on the iris and sneezes steam. Its petals flap like a fan.'},
    {objects:['Shell teapot','Tea hearth','Cup shelf'],action:'A shell sings SHHH while pouring tea, then rings LLL against the cups.'},
    {objects:['Rice bowl','Kitchen stove','Lacquer bowls'],action:'A meal grows taller than the kitchen. Chopsticks launch rice like confetti.'},
    {objects:['Door key hook','Practice rack','Wall scroll'],action:'A wooden key fob sneezes so hard it unlocks the dojo door.'},
  ],
  [
    {objects:['Scarab pedestal','Weighing scales','Torch'],action:'A scarab rolls a giant tyre onto its pedestal. The rubber squeals against stone.'},
    {objects:['Mosaic workbench','Tile table','Chisel rack'],action:'A turquoise tile tap-dances on the workbench, rattling every chisel.'},
    {objects:['Lotus flower','Papyrus','Date palm'],action:'A crowned bone bounces on the lotus like a trampoline, splashing the papyrus.'},
    {objects:['Shawl stand','Gold mirror','Perfume jars'],action:'A royal shawl blows a trumpet; every perfume jar rattles in rhythm.'},
    {objects:['Mail scroll','Writing desk','Scroll shelves'],action:'A mail scroll delivers itself and unrolls all the way across the writing desk.'},
    {objects:['Ibis pedestal','Throne','Treasure chest'],action:'An ibis flashes a VIP pass, pronounced vip as one word. The throne rolls out a gold carpet.'},
  ],
  [
    {objects:['Robot door','Security console','Parcel shelf'],action:'The robot door bows and smiles, bonking the security console with its handle.'},
    {objects:['Claw machine','Racing cabinet','Pinball machine'],action:'A robot tail becomes the claw machine claw. It grabs a prize, then tickles the machine until it spits out tickets.'},
    {objects:['Glow orchid','Neon fern','Strawberry planter'],action:'A huge glowing pin fastens an orchid petal to its stalk. The flower pings like a bell.'},
    {objects:['Ramen bowl','Noodle cooker','Drink fridge'],action:'A jelly alien wobbles out of the ramen bowl and conducts the noodles like an orchestra.'},
    {objects:['Radio console','Antenna coil','Tool rack'],action:'A robot mole drills the radio console with its nose. Each buzz lights up the antenna.'},
    {objects:['Telescope','Moon gate','Star globe'],action:'A key fob projects a key through the telescope and unlocks the moon gate.'},
  ],
];
export const objectPoints = [{x:24,y:45},{x:50,y:30},{x:76,y:48}];
export function roomFor(world:number,stop:number){return palaceRooms[world][stop%6];}

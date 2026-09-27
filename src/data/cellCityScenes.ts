// One picture per episode, each drawn in the style of that episode's host: Ghibli-style painting for
// the welcome and the dawn, a cozy pixel-flavoured street, lo-fi neon for the power station and the
// blackout, and an ink sketch for the control room.
export const sceneStills: Record<number, number> = {
  1: require("../../assets/cell-city/scenes/e1.webp"),
  2: require("../../assets/cell-city/scenes/e2.webp"),
  3: require("../../assets/cell-city/scenes/e3.webp"),
  4: require("../../assets/cell-city/scenes/e4.webp"),
  5: require("../../assets/cell-city/scenes/e5.webp"),
  6: require("../../assets/cell-city/scenes/e6.webp"),
};

export const sceneLabels: Record<number, string> = {
  1: "Cell City by afternoon light: the domed Archive, busy workshops, power stations and the glowing city gate",
  2: "The cobbled streets of the cytoplasm, a courier beside a stack of sugar-cube parcels and delivery vans heading for a power station",
  3: "Inside the power station: fuel stripped at a roundabout, protons pumped behind a dam, a turbine charging rows of batteries",
  4: "The same power station in a blackout, a tiny foreman's flashlight finding three possible faults",
  5: "The control room: three gauges, a pinboard of readings and a map of the city",
  6: "Cell City at dawn, its districts lighting up one by one",
};

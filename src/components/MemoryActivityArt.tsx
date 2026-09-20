import React from "react";
import { View } from "react-native";
import { AtlasArt } from "./StudyShelf";
import { deck } from "../data/funGames";
const sources = {
  spades: require("../../assets/card-stories-spades.png"),
  hearts: require("../../assets/card-stories-hearts.png"),
  diamonds: require("../../assets/card-stories-diamonds.png"),
  clubs: require("../../assets/card-stories-clubs.png"),
};
export function GeneratedMemoryArt({
  group,
  index,
  height = 220,
  label,
}: {
  group: keyof typeof sources;
  index: number;
  height?: number;
  label: string;
}) {
  return (
    <View accessibilityLabel={label} style={{ width: "100%" }}>
      <AtlasArt
        source={sources[group]}
        columns={4}
        rows={4}
        sourceWidth={1024}
        sourceHeight={1024}
        index={index}
        height={height}
        inset={0.96}
      />
    </View>
  );
}
export function CardMemoryArt({
  card,
  step = 0,
  height = 220,
}: {
  card: (typeof deck)[number];
  step?: number;
  height?: number;
}) {
  return (
    <View style={{ flex: 1, minWidth: 140 }}>
      <GeneratedMemoryArt
        group={card.artGroup}
        index={card.artIndex}
        height={height}
        label={card.hook}
      />
    </View>
  );
}
export function ExploreMemoryArt({
  kind,
}: {
  kind: "cards" | "pairs" | "phrase" | "calculus" | "names";
}) {
  const artwork = {
    cards: ["spades", 13, "A librarian opens a cabinet of card stories"],
    pairs: ["hearts", 13, "Clara’s clarinet makes Cara’s car bounce"],
    phrase: ["diamonds", 13, "An otter starts a chain of impossible events"],
    calculus: ["clubs", 13, "A detective studies slope while chasing a snail"],
    names: [
      "hearts",
      14,
      "Rose’s glasses bloom and Max’s moustache fills a doorway",
    ],
  } as const;
  const [group, index, label] = artwork[kind];
  return (
    <GeneratedMemoryArt
      group={group}
      index={index}
      label={label}
      height={205}
    />
  );
}

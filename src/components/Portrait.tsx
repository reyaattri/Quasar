import React from "react";
import { View } from "react-native";
import { people } from "../data/funGames";
import { ActivityStoryArt } from "./ActivityStoryArt";
export function Portrait({
  index,
  size = 210,
}: {
  index: number;
  size?: number;
}) {
  return (
    <View style={{ width: size }}>
      <ActivityStoryArt
        kind="recall"
        index={index}
        height={size}
        label={"Portrait: " + people[index].feature}
      />
    </View>
  );
}

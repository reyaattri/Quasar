import React from "react";
import { View } from "react-native";
import { AtlasArt } from "./StudyShelf";
const art = {
  names: require("../../assets/names-story.png"),
  twins: require("../../assets/twins-story.png"),
  secret: require("../../assets/secret-story.png"),
  calculus: require("../../assets/calculus-step-stories.png"),
  recall: require("../../assets/names-recall.png"),
};
export function ActivityStoryArt({
  kind,
  index,
  label,
  height = 265,
}: {
  kind: keyof typeof art;
  index: number;
  label: string;
  height?: number;
}) {
  return (
    <View accessibilityLabel={label} style={{ width: "100%" }}>
      <AtlasArt
        source={art[kind]}
        columns={kind === "calculus" ? 4 : 3}
        rows={kind === "calculus" ? 4 : 2}
        index={index}
        height={height}
        inset={0.96}
      />
    </View>
  );
}

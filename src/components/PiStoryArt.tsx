import React from "react";
import { View } from "react-native";
import { AtlasArt } from "./StudyShelf";
const sheets = [
  require("../../assets/pi-stories-0.png"),
  require("../../assets/pi-stories-1.png"),
  require("../../assets/pi-stories-2.png"),
  require("../../assets/pi-stories-3.png"),
];
export function PiStoryArt({
  index,
  label,
  height = 260,
}: {
  index: number;
  label: string;
  height?: number;
}) {
  return (
    <View accessibilityLabel={label} style={{ width: "100%" }}>
      <AtlasArt
        source={sheets[Math.floor(index / 16)]}
        index={index % 16}
        columns={4}
        rows={4}
        sourceWidth={1254}
        sourceHeight={1254}
        height={height}
        inset={0.96}
      />
    </View>
  );
}

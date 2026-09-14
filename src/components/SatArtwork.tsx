import React from "react";
import { Image, View } from "react-native";
import { vocabularyCues } from "../data/vocabularyCues";
export function SatArtwork({
  index,
  width = 168,
}: {
  index: number;
  width?: number;
}) {
  return (
    <View
      style={{
        alignSelf: "center",
        width,
        height: (width * 5) / 3,
        overflow: "hidden",
        borderRadius: 18,
      }}
    >
      <Image
        resizeMode="stretch"
        accessibilityLabel={vocabularyCues[index].story}
        source={
          index === 5
            ? require("../../assets/sat-cartoons-user-selected.png")
            : index === 1
              ? require("../../assets/sat-ink-cartoons.png")
              : require("../../assets/sat-latest-selected.png")
        }
        style={{
          position: "absolute",
          width: width * 5,
          height: (width * 10) / 3,
          left: -(index % 5) * width,
          top: (-Math.floor(index / 5) * width * 5) / 3,
        }}
      />
    </View>
  );
}

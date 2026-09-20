import React from "react";
import { View } from "react-native";
import { AtlasArt } from "./StudyShelf";
export function ToolkitIcon({ index }: { index: number }) {
  return (
    <View style={{ width: 92, borderRadius: 18, overflow: "hidden" }}>
      <AtlasArt
        source={require("../../assets/toolkit-cutouts-v2.png")}
        columns={3}
        rows={2}
        index={index}
        height={96}
        inset={0.98}
      />
    </View>
  );
}

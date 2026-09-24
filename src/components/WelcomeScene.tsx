import React from "react";
import { Image, View } from "react-native";
import { Text } from "./ui";

export function WelcomeScene() {
  return (
    <View
      style={{
        borderRadius: 28,
        overflow: "hidden",
        aspectRatio: 1122 / 1402,
        maxHeight: 420,
        backgroundColor: "#1B2E20",
      }}
    >
      <Image
        source={require("../../assets/welcome-garden.png")}
        resizeMode="cover"
        accessibilityLabel="A learner steps through a moonlit garden gate, lantern in hand, toward a winding path and a tree with one enormous apple."
        style={{ width: "100%", height: "100%" }}
      />
      <View
        style={{
          position: "absolute",
          left: 14,
          bottom: 14,
          backgroundColor: "rgba(27,46,32,0.72)",
          borderRadius: 999,
          paddingHorizontal: 13,
          paddingVertical: 7,
        }}
      >
        <Text
          style={{
            color: "#E3EBCF",
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: "700",
          }}
        >
          YOUR FIRST MEMORY WALK
        </Text>
      </View>
    </View>
  );
}

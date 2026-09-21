import React from "react";
import { Image, View } from "react-native";

export function WelcomeScene() {
  return (
    <View style={{ width: "100%", aspectRatio: 4 / 5, borderRadius: 28, overflow: "hidden", backgroundColor: "#173628" }}>
      <Image
        source={require("../../assets/welcome-garden.png")}
        accessibilityLabel="An explorer enters a moonlit memory garden through green doors"
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}

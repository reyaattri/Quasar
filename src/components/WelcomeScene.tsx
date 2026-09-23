import React, { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { C, Text, s } from "./ui";

const stops = [
  { number: "01", title: "Door", clue: "An enormous apple" },
  { number: "02", title: "Chair", clue: "Milk takes a seat" },
  { number: "03", title: "Window", clue: "Bread waves hello" },
];

export function WelcomeScene() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!active || reduced) return;
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
      );
      animation.start();
    });
    return () => { active = false; animation?.stop(); };
  }, [pulse]);
  return (
    <View style={{ backgroundColor: "#254633", borderRadius: 30, padding: 22, overflow: "hidden", gap: 17 }}>
      <Text style={{ color: "#E3EBCF", fontSize: 11, letterSpacing: 2, fontWeight: "700" }}>YOUR FIRST MEMORY WALK</Text>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <Text style={{ color: C.paper, fontFamily: "QuasarGrotesk", fontSize: 28, lineHeight: 34, flex: 1 }}>
          Give an idea{`\n`}somewhere to live.
        </Text>
        <Animated.View style={{ transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }) }] }}>
          <View style={{ width: 39, height: 39, borderWidth: 1, borderColor: C.yellow, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: C.yellow }} />
          </View>
        </Animated.View>
      </View>
      <Text style={{ color: "#DBE6D6", fontSize: 14, lineHeight: 21 }}>
        Three familiar places. Three impossible sights. Walk back through them when you want the list again.
      </Text>
      <View style={{ height: 34, marginHorizontal: 23 }} accessible={false}>
        <Svg width="100%" height="100%" viewBox="0 0 300 34" preserveAspectRatio="none">
          <Path d="M7 22 C65 0 102 30 150 14 S245 2 293 20" fill="none" stroke="#D8BA72" strokeWidth={2} strokeDasharray="4 7" />
          <Circle cx={7} cy={22} r={5} fill="#F3CF7C" />
          <Circle cx={150} cy={14} r={5} fill="#F3CF7C" />
          <Circle cx={293} cy={20} r={5} fill="#F3CF7C" />
        </Svg>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {stops.map((stop) => (
          <View key={stop.number} style={{ flex: 1, minWidth: 0, backgroundColor: "#F8F5E9", borderRadius: 16, padding: 10, minHeight: 111, gap: 5 }}>
            <Text style={{ color: "#AD7B36", fontSize: 11, fontWeight: "700" }}>{stop.number}</Text>
            <Text style={[s.label, { fontSize: 14 }]}>{stop.title}</Text>
            <Text style={[s.small, { fontSize: 11, lineHeight: 15 }]}>{stop.clue}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

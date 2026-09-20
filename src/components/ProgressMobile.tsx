import React, { useEffect, useRef } from "react";
import { View, Animated, AccessibilityInfo } from "react-native";
import { C, Text, s } from "./ui";
export function ProgressMobile({
  mastered,
  accuracy,
  streak,
}: {
  mastered: number;
  accuracy: number | null;
  streak: number;
}) {
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let live = true;
    let a: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced || !live) return;
      a = Animated.loop(
        Animated.sequence([
          Animated.timing(sway, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(sway, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
      );
      a.start();
    });
    return () => {
      live = false;
      a?.stop();
    };
  }, [sway]);
  return (
    <View
      style={{
        backgroundColor: "#E5EAD8",
        borderRadius: 32,
        padding: 18,
        paddingTop: 26,
        overflow: "hidden",
      }}
    >
      <Text style={[s.label, { textAlign: "center" }]}>THE MEMORY MOBILE</Text>
      <View
        style={{
          height: 3,
          backgroundColor: C.ink,
          marginTop: 24,
          marginHorizontal: 12,
          borderRadius: 5,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 9,
          alignItems: "flex-start",
          paddingBottom: 20,
        }}
      >
        {[
          [String(mastered), "memories", C.paper],
          [
            accuracy === null ? "—" : `${accuracy}%`,
            "recall accuracy",
            C.yellow,
          ],
          [String(streak), "day streak", C.peach],
        ].map(([value, label, color], i) => (
          <Animated.View
            key={label}
            style={{
              flex: 1,
              alignItems: "center",
              transform: [
                {
                  rotate: sway.interpolate({
                    inputRange: [0, 1],
                    outputRange:
                      i === 1 ? ["1deg", "-1deg"] : ["-2deg", "2deg"],
                  }),
                },
              ],
            }}
          >
            <View
              style={{
                height: i === 1 ? 54 : 28,
                width: 1,
                backgroundColor: C.ink,
              }}
            />
            <View
              style={{
                width: "100%",
                minHeight: 115,
                backgroundColor: color,
                borderRadius: i === 1 ? 40 : 18,
                paddingVertical: 17,
                paddingHorizontal: 5,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ADB7A1",
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: C.green,
                  borderRadius: 4,
                  marginBottom: 10,
                }}
              />
              <Text style={{ fontSize: 28, color: C.ink }}>{value}</Text>
              <Text style={[s.small, { textAlign: "center", fontSize: 11 }]}>
                {label}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
      <Text style={[s.small, { textAlign: "center" }]}>
        {accuracy === null
          ? "Your first review will start this collection."
          : "Built from your saved vocabulary reviews."}
      </Text>
    </View>
  );
}

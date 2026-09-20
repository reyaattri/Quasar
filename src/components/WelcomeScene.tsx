import React, { useEffect, useRef } from "react";
import { Animated, AccessibilityInfo, View } from "react-native";
import { AtlasArt } from "./StudyShelf";
import { Text, C, s } from "./ui";

export function WelcomeScene() {
  const motion = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!mounted || reduced) return;
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(motion, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(motion, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    });
    return () => {
      mounted = false;
      animation?.stop();
    };
  }, [motion]);
  return (
    <View
      style={{
        backgroundColor: C.sage,
        borderRadius: 32,
        padding: 20,
        overflow: "hidden",
        gap: 6,
      }}
    >
      <Text style={[s.label, { textAlign: "center" }]}>
        SMALL STORIES. BIG CONNECTIONS.
      </Text>
      <Animated.View
        style={{
          transform: [
            {
              translateY: motion.interpolate({
                inputRange: [0, 1],
                outputRange: [3, -7],
              }),
            },
          ],
        }}
      >
        <AtlasArt
          source={require("../../assets/secret-story.png")}
          columns={3}
          rows={2}
          index={2}
          height={210}
        />
      </Animated.View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {["01 · Picture it", "02 · Connect it", "03 · Recall it"].map(
          (label, i) => (
            <View
              key={label}
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 7,
                borderRadius: 16,
                backgroundColor: i === 1 ? C.yellow : C.paper,
              }}
            >
              <Text style={[s.small, { textAlign: "center", color: C.ink }]}>
                {label}
              </Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
}

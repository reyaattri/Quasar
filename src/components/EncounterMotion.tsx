import React, { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated } from "react-native";
export function EncounterMotion({
  children,
  variant = 0,
}: {
  children: React.ReactNode;
  variant?: number;
}) {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let active = true;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(phase, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    const update = (reduce: boolean) => {
      if (!active) return;
      loop.stop();
      phase.setValue(0);
      if (!reduce) loop.start();
    };
    AccessibilityInfo.isReduceMotionEnabled().then(update);
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      update,
    );
    return () => {
      active = false;
      loop.stop();
      sub.remove();
    };
  }, [phase]);
  return (
    <Animated.View
      style={{
        transform: [
          variant % 3 === 0
            ? {
                rotate: phase.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-3deg", "3deg"],
                }),
              }
            : variant % 3 === 1
              ? {
                  translateY: phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  }),
                }
              : {
                  translateX: phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 8],
                  }),
                },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

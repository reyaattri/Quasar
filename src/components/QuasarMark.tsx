import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Path, Ellipse, Circle, Rect, G } from "react-native-svg";
import { useReducedMotion } from "react-native-reanimated";
export function QuasarMark({ size = 36 }: { size?: number }) {
  const reduced = useReducedMotion(),
    turn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const motion = Animated.loop(
      Animated.timing(turn, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    motion.start();
    return () => motion.stop();
  }, [reduced, turn]);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Quasar: a glowing memory book inside a revolving accretion disk"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M48 39L50 3L53 39M48 61L50 97L53 61"
          fill="#79B8C3"
          opacity={0.8}
        />
        <Circle cx="50" cy="50" r="21" fill="#294D3B" />
        <Circle cx="50" cy="50" r="17" fill="#F2CB6C" />
      </Svg>
      <Animated.View
        style={{
          position: "absolute",
          inset: 0,
          transform: [
            {
              rotate: turn.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <G rotation="-24" origin="50,50">
            <Ellipse
              cx="50"
              cy="50"
              rx="45"
              ry="19"
              fill="none"
              stroke="#B88843"
              strokeWidth="4"
            />
            <Ellipse
              cx="50"
              cy="50"
              rx="39"
              ry="14"
              fill="none"
              stroke="#E8CB82"
              strokeWidth="2"
            />
            <Rect
              x="9"
              y="28"
              width="12"
              height="16"
              rx="2"
              fill="#F6F0DD"
              stroke="#294D3B"
              strokeWidth="2"
            />
            <Path d="M12 33h6M12 37h4" stroke="#B88843" strokeWidth="2" />
            <Rect
              x="78"
              y="55"
              width="11"
              height="15"
              rx="2"
              fill="#B7D7D4"
              stroke="#294D3B"
              strokeWidth="2"
            />
          </G>
        </Svg>
      </Animated.View>
      <View style={{ position: "absolute", inset: 0 }}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path
            d="M34 42Q42 38 50 43Q58 38 66 42V60Q58 56 50 61Q42 56 34 60Z"
            fill="#FFF9E9"
            stroke="#294D3B"
            strokeWidth="2.5"
          />
          <Path d="M50 43V60" stroke="#294D3B" strokeWidth="2" />
        </Svg>
      </View>
    </View>
  );
}

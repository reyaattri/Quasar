import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { C } from "./ui";

export function SuccessBurst({
  label = "Context cracked!",
}: {
  label?: string;
}) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1,
      friction: 4,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [pop]);
  const dots = [
    "#EF6D58",
    "#F4C95D",
    "#62A990",
    "#7451A6",
    "#ED9DB2",
    "#4B90C4",
  ];
  return (
    <View
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      style={{
        height: 132,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {dots.map((color, index) => {
        const angle = (Math.PI * 2 * index) / dots.length;
        return (
          <Animated.View
            key={color}
            style={{
              position: "absolute",
              width: 15,
              height: 15,
              borderRadius: index % 2 ? 2 : 8,
              backgroundColor: color,
              transform: [
                {
                  translateX: pop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.cos(angle) * 106],
                  }),
                },
                {
                  translateY: pop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.sin(angle) * 48],
                  }),
                },
                {
                  rotate: pop.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", `${150 + index * 28}deg`],
                  }),
                },
              ],
            }}
          />
        );
      })}
      <Animated.View
        style={{
          transform: [
            { scale: pop },
            {
              rotate: pop.interpolate({
                inputRange: [0, 1],
                outputRange: ["-18deg", "2deg"],
              }),
            },
          ],
          backgroundColor: C.yellow,
          borderWidth: 2,
          borderColor: C.ink,
          borderRadius: 22,
          paddingVertical: 15,
          paddingHorizontal: 22,
        }}
      >
        <Text style={{ fontWeight: "900", fontSize: 20, color: C.ink }}>
          ★ {label.toUpperCase()}
        </Text>
      </Animated.View>
    </View>
  );
}

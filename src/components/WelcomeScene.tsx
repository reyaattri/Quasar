import React, { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, ImageBackground, Platform, View } from "react-native";
import { C, Icon, Text } from "./ui";

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export function WelcomeScene() {
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!active) return;
      if (reduced) {
        reveal.setValue(1);
        return;
      }
      Animated.timing(reveal, {
        toValue: 1,
        duration: 850,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    });
    return () => {
      active = false;
      reveal.stopAnimation();
    };
  }, [reveal]);

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel="An open garden gate leads into a moonlit memory world filled with books, paths, an enormous apple, and small discoveries"
      style={{
        opacity: reveal,
        transform: [
          {
            translateY: reveal.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          borderRadius: 32,
          overflow: "hidden",
          backgroundColor: C.green,
          borderWidth: 1,
          borderColor: "#42634E",
          shadowColor: "#172B21",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 5,
        }}
      >
        <AnimatedImageBackground
          source={require("../../assets/welcome-garden.png")}
          resizeMode="cover"
          imageStyle={{ borderRadius: 31 }}
          style={{ width: "100%", aspectRatio: 0.86, justifyContent: "space-between", padding: 18 }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              backgroundColor: "rgba(251,248,239,0.92)",
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Icon name="spark" size={15} color={C.green} />
            <Text style={{ color: C.green, fontSize: 11, fontWeight: "700", letterSpacing: 1.1 }}>
              A PLACE FOR WHAT YOU LEARN
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(24,48,36,0.9)",
              borderRadius: 22,
              paddingHorizontal: 17,
              paddingVertical: 14,
              gap: 4,
            }}
          >
            <Text style={{ color: C.paper, fontSize: 23, lineHeight: 28, fontWeight: "600" }}>
              Open the door. Keep the idea.
            </Text>
            <Text style={{ color: "#DFE9D7", fontSize: 13, lineHeight: 18 }}>
              Stories, places, and pictures built for recall.
            </Text>
          </View>
        </AnimatedImageBackground>
      </View>
    </Animated.View>
  );
}

import React, { useRef } from "react";
import { Animated, Image, Pressable, View } from "react-native";
const frames = {
  start: [90, 50, 490, 134],
  back: [90, 422, 490, 132],
  next: [810, 422, 374, 132],
  play: [810, 605, 374, 132],
  exit: [810, 235, 374, 134],
  stop: [810, 50, 374, 134],
  options: [1224, 303, 490, 185],
  restart: [1224, 553, 490, 185],
} as const;
/** Renders the supplied button sheet unchanged, using measured sprite frames. */
export function PixelButton({
  kind,
  label,
  onPress,
  disabled = false,
  width = 124,
}: {
  kind: keyof typeof frames;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  width?: number;
}) {
  const depth = useRef(new Animated.Value(0)).current;
  const [x, y, w, h] = frames[kind],
    scale = width / w;
  const press = (down: boolean) =>
    Animated.timing(depth, {
      toValue: down ? 3 : 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => press(true)}
      onPressOut={() => press(false)}
      style={{
        minHeight: 48,
        minWidth: 48,
        justifyContent: "center",
        alignItems: "center",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Animated.View style={{ transform: [{ translateY: depth }] }}>
        <View style={{ width, height: h * scale, overflow: "hidden" }}>
          <Image
            resizeMethod="resize"
            resizeMode="stretch"
            accessible={false}
            source={require("../../assets/pixel-buttons-user.jpg")}
            style={{
              position: "absolute",
              width: 2048 * scale,
              height: 788 * scale,
              left: -x * scale,
              top: -y * scale,
            }}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

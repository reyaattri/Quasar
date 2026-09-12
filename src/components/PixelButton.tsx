import Svg, { Defs, ClipPath, Path, Image as SpriteImage } from "react-native-svg";
import React, { useId, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
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
/** Clips the exterior white matte to the supplied sprite’s stepped silhouette. */
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
  const clip = useId().replace(/:/g, "");
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
          <Svg width={width} height={h * scale} viewBox={`0 0 ${w} ${h}`}>
            <Defs><ClipPath id={clip}><Path d={`M42 2H${w-42}V10H${w-26}V18H${w-18}V26H${w-10}V42H${w-2}V${h-42}H${w-10}V${h-26}H${w-18}V${h-18}H${w-26}V${h-10}H${w-42}V${h-2}H42V${h-10}H26V${h-18}H18V${h-26}H10V${h-42}H2V42H10V26H18V18H26V10H42Z`} /></ClipPath></Defs>
            <SpriteImage href={require("../../assets/pixel-buttons-user.jpg")} x={-x} y={-y} width={2048} height={788} preserveAspectRatio="none" clipPath={`url(#${clip})`} />
          </Svg>
        </View>
      </Animated.View>
    </Pressable>
  );
}

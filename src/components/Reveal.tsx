import React from "react";
import { Pressable, View, type ViewStyle, type PressableProps } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";

export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <View style={style}>{children}</View>;
  return (
    <MotiView
      style={style}
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 480, delay }}
    >
      {children}
    </MotiView>
  );
}

export function Pulse({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <View style={style}>{children}</View>;
  return (
    <MotiView
      style={style}
      from={{ scale: 1 }}
      animate={{ scale: 1.1 }}
      transition={{ type: "timing", duration: 1500, loop: true }}
    >
      {children}
    </MotiView>
  );
}

export function PressableScale({
  children,
  style,
  ...props
}: Omit<PressableProps, "style" | "children"> & {
  children: React.ReactNode;
  style?: ViewStyle | (ViewStyle | false | undefined)[];
}) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = React.useState(false);
  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        setPressed(true);
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        props.onPressOut?.(e);
      }}
    >
      <MotiView
        style={style}
        animate={{ scale: pressed && !reduced ? 0.97 : 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 260 }}
      >
        {children}
      </MotiView>
    </Pressable>
  );
}

export function Meter({
  value,
  color,
  track,
  height = 8,
}: {
  value: number;
  color: string;
  track: string;
  height?: number;
}) {
  const reduced = useReducedMotion();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
      style={{ height, borderRadius: height, backgroundColor: track, overflow: "hidden" }}
    >
      <MotiView
        style={{ height, borderRadius: height, backgroundColor: color }}
        from={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={reduced ? { type: "timing", duration: 0 } : { type: "timing", duration: 700 }}
      />
    </View>
  );
}

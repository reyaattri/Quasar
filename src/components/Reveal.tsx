import React from "react";
import {
  Pressable,
  View,
  type ViewStyle,
  type PressableProps,
} from "react-native";
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
      style={{
        height,
        borderRadius: height,
        backgroundColor: track,
        overflow: "hidden",
      }}
    >
      <MotiView
        style={{ height, borderRadius: height, backgroundColor: color }}
        from={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={
          reduced
            ? { type: "timing", duration: 0 }
            : { type: "timing", duration: 700 }
        }
      />
    </View>
  );
}

// Answer feedback: a right answer pops into place, a wrong one gives a short shake.
export function Feedback({
  kind,
  children,
  style,
}: {
  kind: "right" | "wrong" | null;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const reduced = useReducedMotion();
  if (reduced || !kind) return <View style={style}>{children}</View>;
  return (
    <MotiView
      key={kind}
      style={style}
      from={kind === "right" ? { scale: 0.94 } : { translateX: 0 }}
      animate={
        kind === "right"
          ? { scale: 1 }
          : { translateX: [0, -9, 8, -6, 4, 0] as unknown as number }
      }
      transition={
        kind === "right"
          ? { type: "spring", damping: 6, stiffness: 240 }
          : { type: "timing", duration: 420 }
      }
    >
      {children}
    </MotiView>
  );
}

const confettiColors = [
  "#F2CB6C",
  "#E9B3AD",
  "#BFD7AF",
  "#D9D2FA",
  "#F0B27A",
  "#9DC7E8",
];

// A one-shot burst of paper pieces. Deterministic, so a screenshot or a test sees the same thing.
export function Confetti({
  count = 22,
  height = 260,
}: {
  count?: number;
  height?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const left = `${((i * 37) % 100) as number}%` as const;
        const size = 7 + ((i * 5) % 7);
        return (
          <MotiView
            key={i}
            from={{ translateY: -20, opacity: 1, rotate: "0deg" }}
            animate={{
              translateY: height,
              opacity: 0,
              rotate: `${(i % 2 ? 1 : -1) * (160 + i * 23)}deg`,
            }}
            transition={{
              type: "timing",
              duration: 1500 + (i % 6) * 160,
              delay: (i % 8) * 70,
            }}
            style={{
              position: "absolute",
              left,
              top: 0,
              width: size,
              height: size * (i % 3 ? 1 : 0.5),
              borderRadius: i % 4 === 0 ? size : 2,
              backgroundColor: confettiColors[i % confettiColors.length],
            }}
          />
        );
      })}
    </View>
  );
}

// A card turning over: it squashes edge-on, then springs open with the new face.
export function Flip({
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
      from={{ scaleX: 0.04, rotate: "-2deg" }}
      animate={{ scaleX: 1, rotate: "0deg" }}
      transition={{ type: "spring", damping: 11, stiffness: 190 }}
    >
      {children}
    </MotiView>
  );
}

import React from "react";
import {
  Pressable,
  Platform,
  Modal,
  useWindowDimensions,
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
      transition={{ type: "timing", duration: 150, delay: Math.min(delay, 60) }}
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
  count = 70,
  height: requestedHeight,
  blossom = false,
}: {
  count?: number;
  height?: number;
  blossom?: boolean;
}) {
  const reduced = useReducedMotion();
  const { height: screenHeight } = useWindowDimensions();
  const height = Math.max(screenHeight, requestedHeight ?? 0);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2900);
    return () => clearTimeout(timer);
  }, []);
  if (reduced || !visible) return null;
  const burst = (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height,
        overflow: "hidden",
        zIndex: 99999,
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
              borderRadius: blossom ? size : i % 4 === 0 ? size : 2,
              borderTopLeftRadius: blossom ? 0 : 2,
              backgroundColor: blossom
                ? ["#F7AFC4", "#FAD3DF", "#EFA0B8"][i % 3]
                : confettiColors[i % confettiColors.length],
            }}
          />
        );
      })}
    </View>
  );
  if (Platform.OS === "web" && typeof document !== "undefined") {
    const { createPortal } = require("react-dom");
    return createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99999,
        }}
        aria-hidden="true"
      >
        {burst}
      </div>,
      document.body,
    );
  }
  return (
    <Modal
      transparent
      visible
      animationType="none"
      onRequestClose={() => setVisible(false)}
    >
      {burst}
    </Modal>
  );
}

// A brief crossfade keeps card text readable without stretching it.
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
      from={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 100 }}
    >
      {children}
    </MotiView>
  );
}

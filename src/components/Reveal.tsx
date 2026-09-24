import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, type ViewStyle } from "react-native";

/**
 * Staggered entrance: fades and lifts children in on mount. Delay is in ms.
 * No-ops (renders at rest) when the OS reduce-motion setting is on.
 */
export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}) {
  const value = useRef(new Animated.Value(0)).current;
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => {
      if (!active) return;
      if (r) {
        setReduced(true);
        value.setValue(1);
        return;
      }
      Animated.timing(value, {
        toValue: 1,
        duration: 480,
        delay,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      active = false;
    };
  }, [value, delay]);
  if (reduced) return <>{children}</>;
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: value,
          transform: [
            {
              translateY: value.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Gentle continuous scale pulse, for a small highlight icon/badge.
 * No-ops (renders at rest) when the OS reduce-motion setting is on.
 */
export function Pulse({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!active || reduced) return;
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
      );
      animation.start();
    });
    return () => {
      active = false;
      animation?.stop();
    };
  }, [value]);
  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

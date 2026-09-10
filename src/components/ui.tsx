import React from "react";
import {
  View,
  Text as NativeText,
  type TextProps,
  Pressable,
  StyleSheet,
  Platform,
  TextInput,
  type ViewStyle,
} from "react-native";
import Svg, { Path, Circle, Rect, Defs, Pattern } from "react-native-svg";
export const C = {
  paper: "#FBF8EF",
  ink: "#293B30",
  muted: "#71776A",
  green: "#294D3B",
  sage: "#E6EBD9",
  yellow: "#F2CB6C",
  peach: "#F3D5BC",
  line: "#DDE0D0",
  white: "#FFFEF9",
  red: "#AD4D3F",
};
export const serif = "QuasarGrotesk";
export function Text({ style, ...props }: TextProps) {
  return <NativeText {...props} style={[{ fontFamily: serif }, style]} />;
}
const paths: Record<string, string> = {
  home: "M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10",
  book: "M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16",
  map: "m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16",
  chart: "M4 20V10M12 20V4M20 20v-7",
  spark: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  back: "M20 12H4m6-6-6 6 6 6",
  check: "m4 12 5 5L20 6",
  close: "m5 5 14 14M19 5 5 19",
  clock: "M12 6v6l4 2",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
  pin: "M12 22s8-8 8-13A8 8 0 0 0 4 9c0 5 8 13 8 13z",
  key: "M14 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12M9 14l-7 7m3-3 2 2",
  link: "m9 15 6-6M8 17l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0M16 7l2-2a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-5 0",
  smile: "M8 9h.01M16 9h.01M7 14q5 6 10 0",
  leaf: "M4 21C-1 8 8 1 21 3c1 14-7 21-17 18M4 21 16 8",
  cards: "M5 7h14v15H5zM8 3h14v15",
  flame: "M13 2c0 7 7 8 7 14a8 8 0 0 1-16 0c0-4 3-7 5-9-1 5 3 5 4-5",
  lock: "M5 10h14v12H5zM8 10V6a4 4 0 0 1 8 0v4",
  sun: "M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2",
};
export function Icon({
  name,
  size = 24,
  color = C.ink,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {["clock", "smile", "sun"].includes(name) && (
        <Circle cx="12" cy="12" r={name === "sun" ? 5 : 10} />
      )}
      <Path d={paths[name] ?? paths.spark} />
    </Svg>
  );
}
export function Dots() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="dots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="2" cy="2" r="0.7" fill="#D5D8C6" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dots)" />
      </Svg>
    </View>
  );
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  icon,
  small = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: string;
  small?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        small && { paddingVertical: 10, paddingHorizontal: 16 },
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.8, transform: [{ translateY: 1 }] },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: C.ink }]}>
        {children}
      </Text>
      {icon && (
        <Icon name={icon} size={18} color={secondary ? C.ink : C.white} />
      )}
    </Pressable>
  );
}
export function Tag({
  children,
  color = C.sage,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <View style={[s.tag, { backgroundColor: color }]}>
      <Text style={s.tagText}>{children}</Text>
    </View>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder = "",
  multiline = false,
  secureTextEntry = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        autoCapitalize={
          secureTextEntry || label.toLowerCase().includes("email")
            ? "none"
            : "sentences"
        }
        style={[
          s.input,
          multiline && { minHeight: 100, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
export const s = StyleSheet.create({
  title: {
    fontWeight: "700",
    fontFamily: "QuasarGrotesk",
    fontSize: 36,
    lineHeight: 41,
    color: C.ink,
    letterSpacing: -1,
  },
  h2: {
    fontWeight: "600",
    fontFamily: "QuasarGrotesk",
    fontSize: 26,
    lineHeight: 32,
    color: C.ink,
    letterSpacing: -0.5,
  },
  h3: {
    fontWeight: "600",
    fontFamily: "QuasarGrotesk",
    fontSize: 22,
    lineHeight: 28,
    color: C.ink,
  },
  body: {
    fontFamily: "QuasarGrotesk",
    fontSize: 15,
    lineHeight: 23,
    color: C.muted,
  },
  small: {
    fontFamily: "QuasarGrotesk",
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
  },
  label: {
    fontFamily: "QuasarGrotesk",
    fontSize: 13,
    fontWeight: "600",
    color: C.ink,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    padding: 22,
    gap: 14,
  },
  button: {
    backgroundColor: C.green,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    minHeight: 46,
  },
  secondary: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line },
  buttonText: {
    color: C.white,
    fontFamily: "QuasarGrotesk",
    fontSize: 14,
    fontWeight: "600",
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  tagText: {
    fontFamily: "QuasarGrotesk",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: C.ink,
  },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 14,
    color: C.ink,
    fontFamily: "QuasarGrotesk",
    fontSize: 15,
    backgroundColor: C.white,
    minHeight: 49,
  },
  divider: { height: 1, backgroundColor: C.line },
  section: { gap: 16 },
  link: {
    fontFamily: "QuasarGrotesk",
    fontSize: 13,
    fontWeight: "600",
    color: C.green,
  },
  progress: {
    height: 6,
    borderRadius: 4,
    backgroundColor: C.line,
    overflow: "hidden",
  },
});

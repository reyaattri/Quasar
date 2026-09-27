import React, { useState } from "react";
import { Image, View, type ImageStyle, type ViewStyle } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";
import { characters, type CharacterId } from "../data/cellCity";

export type Mood = "idle" | "talk" | "worried" | "happy";

// Each character keeps the art style they were drawn in: Osei is hand-painted, Nell is ink sketch,
// Kip and Mara are lo-fi neon, Rho & Bo and Gly are pixel art.
const art: Record<
  CharacterId,
  { idle: number; worried: number; happy: number; pixel?: boolean }
> = {
  osei: {
    idle: require("../../assets/cell-city/chars/osei-idle.webp"),
    worried: require("../../assets/cell-city/chars/osei-worried.webp"),
    happy: require("../../assets/cell-city/chars/osei-happy.webp"),
  },
  nell: {
    idle: require("../../assets/cell-city/chars/nell-idle.webp"),
    worried: require("../../assets/cell-city/chars/nell-worried.webp"),
    happy: require("../../assets/cell-city/chars/nell-happy.webp"),
  },
  ribo: {
    idle: require("../../assets/cell-city/chars/ribo-idle.png"),
    worried: require("../../assets/cell-city/chars/ribo-worried.png"),
    happy: require("../../assets/cell-city/chars/ribo-happy.png"),
    pixel: true,
  },
  mara: {
    idle: require("../../assets/cell-city/chars/mara-idle.webp"),
    worried: require("../../assets/cell-city/chars/mara-worried.webp"),
    happy: require("../../assets/cell-city/chars/mara-happy.webp"),
  },
  kip: {
    idle: require("../../assets/cell-city/chars/kip-idle.webp"),
    worried: require("../../assets/cell-city/chars/kip-worried.webp"),
    happy: require("../../assets/cell-city/chars/kip-happy.webp"),
  },
  gly: {
    idle: require("../../assets/cell-city/chars/gly-idle.png"),
    worried: require("../../assets/cell-city/chars/gly-worried.png"),
    happy: require("../../assets/cell-city/chars/gly-happy.png"),
    pixel: true,
  },
};

// How each one idles. Osei floats, Nell sways, Rho & Bo squash like a spring, Mara leans on her gate,
// Kip tilts for a sip of tea, Gly rocks on her heels.
const idle: Record<
  CharacterId,
  { y: number; rot: number; sx: number; sy: number; ms: number }
> = {
  osei: { y: -7, rot: 1.5, sx: 1, sy: 1.012, ms: 2600 },
  nell: { y: -2, rot: 2.2, sx: 1, sy: 1, ms: 3400 },
  ribo: { y: -5, rot: 0, sx: 1.025, sy: 0.965, ms: 900 },
  mara: { y: -2, rot: -1.2, sx: 1, sy: 1, ms: 3000 },
  kip: { y: -3, rot: -3.2, sx: 1, sy: 1.01, ms: 2400 },
  gly: { y: -3, rot: 1.4, sx: 1, sy: 1, ms: 1500 },
};

export function CityCharacter({
  id,
  mood = "idle",
  size = 160,
  still,
  style,
}: {
  id: CharacterId;
  mood?: Mood;
  size?: number;
  still?: boolean;
  style?: ViewStyle;
}) {
  const reduced = useReducedMotion();
  const a = art[id];
  const source =
    mood === "worried" ? a.worried : mood === "happy" ? a.happy : a.idle;
  const pixelStyle = a.pixel
    ? ({ imageRendering: "pixelated" } as unknown as ImageStyle)
    : undefined;
  const picture = (
    <Image
      accessibilityLabel={`${characters[id].name}, ${mood === "talk" ? "talking" : mood}`}
      source={source}
      resizeMode="contain"
      style={[{ width: size, height: size }, pixelStyle]}
    />
  );
  if (reduced || still)
    return (
      <View style={[{ width: size, height: size }, style]}>{picture}</View>
    );

  const p = idle[id];
  // The key restarts the animation when the mood changes, so each reaction begins from rest.
  const motion =
    mood === "talk"
      ? {
          from: { scaleY: 1, scaleX: 1, translateY: 0 },
          animate: { scaleY: 1.035, scaleX: 0.988, translateY: -2 },
          transition: {
            type: "timing",
            duration: 230,
            loop: true,
            repeatReverse: true,
          },
        }
      : mood === "worried"
        ? {
            from: { translateX: -2.5, rotate: "-1.2deg", scale: 0.985 },
            animate: { translateX: 2.5, rotate: "1.2deg", scale: 0.985 },
            transition: {
              type: "timing",
              duration: 95,
              loop: true,
              repeatReverse: true,
            },
          }
        : mood === "happy"
          ? {
              from: { translateY: 0, scale: 1, rotate: "-2deg" },
              animate: {
                translateY: -size * 0.09,
                scale: 1.04,
                rotate: "2deg",
              },
              transition: {
                type: "timing",
                duration: 360,
                loop: true,
                repeatReverse: true,
              },
            }
          : {
              from: { translateY: 0, rotate: "0deg", scaleX: 1, scaleY: 1 },
              animate: {
                translateY: p.y,
                rotate: `${p.rot}deg`,
                scaleX: p.sx,
                scaleY: p.sy,
              },
              transition: {
                type: "timing",
                duration: p.ms,
                loop: true,
                repeatReverse: true,
              },
            };

  return (
    <View style={[{ width: size, height: size }, style]}>
      <MotiView
        key={mood}
        from={{ opacity: 0.35, ...motion.from } as never}
        animate={{ opacity: 1, ...motion.animate } as never}
        transition={
          {
            ...motion.transition,
            opacity: { type: "timing", duration: 160, loop: false },
          } as never
        }
        style={{ width: size, height: size }}
      >
        {picture}
      </MotiView>
    </View>
  );
}

// Six characters in a row, each idling at its own pace, with a small offset so they never move in step.
export function CityCrowd({
  ids,
  max = 96,
  overlap = 0.16,
  perRow = ids.length,
}: {
  ids: CharacterId[];
  max?: number;
  overlap?: number;
  perRow?: number;
}) {
  const [width, setWidth] = useState(0);
  // Fit a row in the space available, overlapping neighbours a little; longer casts wrap into rows.
  const size = width
    ? Math.min(max, Math.floor(width / (perRow - (perRow - 1) * overlap)))
    : 0;
  const rows: CharacterId[][] = [];
  for (let i = 0; i < ids.length; i += perRow)
    rows.push(ids.slice(i, i + perRow));
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ minHeight: max }}
    >
      {size > 0 &&
        rows.map((row, r) => (
          <View
            key={r}
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
              marginTop: r ? -size * 0.12 : 0,
            }}
          >
            {row.map((id, i) => (
              <View
                key={id}
                style={{
                  marginLeft: i ? -size * overlap : 0,
                  zIndex: i % 2 ? 1 : 0,
                }}
              >
                <CityCharacter id={id} size={size} />
              </View>
            ))}
          </View>
        ))}
    </View>
  );
}

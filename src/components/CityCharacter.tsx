import React, { useState } from "react";
import { Image, View, type ImageStyle, type ViewStyle } from "react-native";
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
  return <View style={[{ width: size, height: size }, style]}>{picture}</View>;
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

import React, { useEffect, useState } from "react";
import { Image, View, type ImageSourcePropType } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";
import { Text } from "./ui";

// To use a new hero, replace `source` and the image's pixel size, and set
// `captions` to one entry (or an empty list). A wide image pans; a portrait one sits still.
const HERO: {
  source: ImageSourcePropType;
  width: number;
  height: number;
  captions: string[];
  label: string;
} = {
  source: require("../../assets/palace-worlds.png"),
  width: 1536,
  height: 1024,
  captions: ["A QUIET DOJO", "ANCIENT RUINS", "NEON ROOFTOPS"],
  label:
    "Three memory worlds side by side: a Japanese dojo garden, sunlit Egyptian ruins and a neon rooftop city at night.",
};

const ASPECT = 4 / 5;

export function WelcomeScene() {
  const reduced = useReducedMotion();
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [caption, setCaption] = useState(0);
  const count = HERO.captions.length;

  useEffect(() => {
    if (reduced || count < 2) return;
    const t = setInterval(() => setCaption((c) => (c + 1) % count), 5000);
    return () => clearInterval(t);
  }, [reduced, count]);

  const ratio = HERO.width / HERO.height;
  const panels = Math.max(1, count);
  const imgW = Math.max(box.h * ratio, panels * box.w);
  const imgH = imgW / ratio;
  const panelW = imgW / panels;
  const show = reduced ? 0 : caption;
  const x = -(show * panelW + (panelW - box.w) / 2);

  return (
    <View
      onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      accessible
      accessibilityRole="image"
      accessibilityLabel={HERO.label}
      style={{
        borderRadius: 28,
        overflow: "hidden",
        aspectRatio: ASPECT,
        maxHeight: 440,
        backgroundColor: "#1B2E20",
      }}
    >
      {box.h > 0 && (
        <MotiView
          style={{ position: "absolute", top: (box.h - imgH) / 2, left: 0, width: imgW, height: imgH }}
          from={{ translateX: x }}
          animate={{ translateX: x }}
          transition={{ type: "timing", duration: 1800 }}
        >
          <Image source={HERO.source} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
        </MotiView>
      )}
      {count > 0 && (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <MotiView
            key={caption}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={{ backgroundColor: "rgba(27,46,32,0.72)", borderRadius: 999, paddingHorizontal: 13, paddingVertical: 7 }}
          >
            <Text style={{ color: "#E3EBCF", fontSize: 11, letterSpacing: 2, fontWeight: "700" }}>
              {HERO.captions[caption]}
            </Text>
          </MotiView>
          {count > 1 && (
            <View style={{ flexDirection: "row", gap: 6 }}>
              {HERO.captions.map((c, i) => (
                <View
                  key={c}
                  style={{
                    width: i === caption ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#F3CF7C",
                    opacity: i === caption ? 1 : 0.55,
                  }}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

import React from "react";
import { Image, View } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Text } from "./ui";

// The landing hero, read top to bottom: a night sky with the headline, the painting's own guiding
// star (the one in Quasar's logo), then a notebook whose pages grow into a path through three memory
// worlds, past the first memory-walk cues (an apple, a milk bottle on a chair, bread waving from a
// window). The sky above the painting is drawn here, matched to the painting's top edge, and the
// painting's foot dissolves back into night, where the first choices sit, so the whole first screen is
// one scene with no hard frame.
const HERO = {
  source: require("../../assets/welcome-hero.webp"),
  aspect: 4 / 5,
  skyEdge: "#153A3B", // the painting's top row
  label:
    "An open notebook on a desk at dusk. A path grows out of its pages, past a giant apple and a cherry tree, through sunlit ruins where a milk bottle sits on a stone chair, up to a neon city where a loaf of bread waves from a window. A student walks the path toward a four-pointed star.",
};
export const NIGHT = "#0B2224";
const CREAM = "#FFF8E8";
const GOLD = "#F2CB6C";

// Small fixed stars in the drawn sky; each twinkles on its own clock.
const stars = [
  { x: 0.09, y: 0.2, s: 2.2 },
  { x: 0.2, y: 0.62, s: 1.6 },
  { x: 0.31, y: 0.12, s: 1.4 },
  { x: 0.72, y: 0.16, s: 2 },
  { x: 0.84, y: 0.52, s: 1.5 },
  { x: 0.93, y: 0.24, s: 2.4 },
  { x: 0.58, y: 0.07, s: 1.3 },
  { x: 0.05, y: 0.82, s: 1.4 },
  { x: 0.95, y: 0.86, s: 1.6 },
];

function Gradient({
  id,
  from,
  to,
  fromOpacity = 1,
  toOpacity = 1,
  style,
}: {
  id: string;
  from: string;
  to: string;
  fromOpacity?: number;
  toOpacity?: number;
  style: object;
}) {
  return (
    <Svg pointerEvents="none" preserveAspectRatio="none" viewBox="0 0 10 10" style={style}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={from} stopOpacity={fromOpacity} />
          <Stop offset="1" stopColor={to} stopOpacity={toOpacity} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="10" height="10" fill={`url(#${id})`} />
    </Svg>
  );
}

function Rise({ delay, children }: { delay: number; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 900, delay }}
    >
      {children}
    </MotiView>
  );
}

export function WelcomeScene({
  bleed = true,
  children,
}: {
  bleed?: boolean;
  children?: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [w, setW] = React.useState(0);
  // Type scales with the screen so each headline line always fits on one line.
  const big = Math.max(26, Math.min(44, w * 0.083));
  const skyH = Math.max(210, big * 5.4);
  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[
        { overflow: "hidden", backgroundColor: NIGHT },
        bleed
          ? { marginHorizontal: -20, marginTop: -20 }
          : { borderRadius: 30, maxWidth: 560, width: "100%", alignSelf: "center" },
      ]}
    >
      {/* The drawn sky, deepening upward from the painting's own edge colour. */}
      <View style={{ height: skyH, justifyContent: "flex-end", paddingBottom: 18, backgroundColor: NIGHT }}>
        <Gradient
          id="nightsky"
          from={NIGHT}
          to={HERO.skyEdge}
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}
        />
        {w > 0 &&
          stars.map((st, i) => (
            <MotiView
              key={i}
              pointerEvents="none"
              from={{ opacity: 0.25 }}
              animate={{ opacity: reduced ? 0.6 : 0.95 }}
              transition={{
                type: "timing",
                duration: 1600 + i * 270,
                delay: i * 190,
                loop: !reduced,
                repeatReverse: true,
              }}
              style={{
                position: "absolute",
                left: st.x * w,
                top: st.y * skyH,
                width: st.s * 2,
                height: st.s * 2,
                borderRadius: st.s,
                backgroundColor: "#FFF3CF",
              }}
            />
          ))}
        <View style={{ alignItems: "center", paddingHorizontal: 22, gap: 10 }}>
          <Rise delay={100}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 22, height: 1, backgroundColor: GOLD, opacity: 0.7 }} />
              <Text style={{ color: GOLD, fontSize: 11, letterSpacing: 3.2, fontWeight: "700" }}>
                WELCOME TO QUASAR
              </Text>
              <View style={{ width: 22, height: 1, backgroundColor: GOLD, opacity: 0.7 }} />
            </View>
          </Rise>
          <Rise delay={260}>
            <Text
              accessibilityRole="header"
              style={{
                textAlign: "center",
                fontSize: big,
                lineHeight: big * 1.1,
                letterSpacing: -big * 0.03,
                fontWeight: "700",
                color: CREAM,
              }}
            >
              Learn it once.{"\n"}
              <Text style={{ color: GOLD }}>Remember it longer.</Text>
            </Text>
          </Rise>
          <Rise delay={440}>
            <Text
              style={{
                textAlign: "center",
                color: "#CFDCD3",
                fontSize: 15,
                lineHeight: 22,
                maxWidth: 320,
              }}
            >
              Turn what you learn into places you can walk back through.
            </Text>
          </Rise>
        </View>
      </View>

      {/* The painting. Its top melts into the sky; its foot melts into the page. */}
      <View style={{ width: "100%", aspectRatio: HERO.aspect, marginTop: -1 }}>
        <Image
          accessible
          accessibilityRole="image"
          accessibilityLabel={HERO.label}
          source={HERO.source}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        />
        <Gradient
          id="seam"
          from={HERO.skyEdge}
          to={HERO.skyEdge}
          fromOpacity={1}
          toOpacity={0}
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "14%" }}
        />
        <Gradient
          id="foot"
          from={NIGHT}
          to={NIGHT}
          fromOpacity={0}
          toOpacity={1}
          style={{ position: "absolute", left: 0, bottom: -2, width: "100%", height: "26%" }}
        />
      </View>
      {children ? (
        <View style={{ paddingHorizontal: 22, paddingBottom: 34, marginTop: -26, gap: 20 }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

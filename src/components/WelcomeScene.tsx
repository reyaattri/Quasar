import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";
import Svg, { Defs, Image as SvgImage, LinearGradient, Mask, Rect, Stop } from "react-native-svg";
import { C, Text } from "./ui";

// The landing hero: a notebook on a desk whose pages grow into a path through three memory worlds,
// past the first memory-walk cues (an apple, a milk bottle on a chair, bread waving from a window),
// toward a small golden star. It's a morning painting with a pale sky; both of its edges fade out,
// and the headline and the choices sit on the page above and below it, never over the busy art.
const HERO = {
  source: require("../../assets/welcome-hero.webp"),
  aspect: 4 / 5,
  label:
    "An open notebook on a desk in morning light. A path grows out of its pages, past a giant apple and a cherry tree, through sunlit ruins where a milk bottle sits on a stone chair, up to a city where a loaf of bread waves from a window. A student walks the path toward a small golden star.",
};

// The landing's own accents: twilight violet and warm gold, on the app's cream.
export const VIOLET = "#6B52B5";
const GOLD = "#D9A441";

// The painting, faded at top and bottom with a real transparency mask, so whatever is behind it
// (the page's dotted paper) shows through instead of a flat band of colour.
function FadedPainting({ width }: { width: number }) {
  const h = width / HERO.aspect;
  return (
    <Svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <Defs>
        <LinearGradient id="heroFade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fff" stopOpacity={0} />
          <Stop offset="0.24" stopColor="#fff" stopOpacity={1} />
          <Stop offset="0.8" stopColor="#fff" stopOpacity={1} />
          <Stop offset="1" stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <Mask id="heroMask" x="0" y="0" width={width} height={h} maskUnits="userSpaceOnUse">
          <Rect x="0" y="0" width={width} height={h} fill="url(#heroFade)" />
        </Mask>
      </Defs>
      <SvgImage
        href={HERO.source}
        x="0"
        y="0"
        width={width}
        height={h}
        preserveAspectRatio="xMidYMid slice"
        mask="url(#heroMask)"
      />
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
  // Type scales with the screen so each headline line stays on one line.
  const big = Math.max(26, Math.min(44, w * 0.083));
  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[
        bleed
          ? { marginHorizontal: -20, marginTop: -20 }
          : { maxWidth: 560, width: "100%", alignSelf: "center" },
      ]}
    >
      <View style={{ alignItems: "center", paddingHorizontal: 22, paddingTop: 30, gap: 12, zIndex: 2 }}>
        <Rise delay={100}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 22, height: 1.5, backgroundColor: GOLD }} />
            <Text style={{ color: VIOLET, fontSize: 11, letterSpacing: 3.2, fontWeight: "700" }}>
              WELCOME TO QUASAR
            </Text>
            <View style={{ width: 22, height: 1.5, backgroundColor: GOLD }} />
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
              color: C.ink,
            }}
          >
            Learn it once.{"\n"}
            <Text style={{ color: VIOLET }}>Remember it longer.</Text>
          </Text>
        </Rise>
        <Rise delay={440}>
          <Text style={{ textAlign: "center", color: C.muted, fontSize: 16, lineHeight: 23, maxWidth: 330 }}>
            Turn what you learn into places you can walk back through.
          </Text>
        </Rise>
      </View>

      {/* The painting: its pale sky dissolves up into the page and its desk dissolves down. */}
      <MotiView
        from={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: reduced ? 0 : 1400, delay: 200 }}
        style={{ width: "100%", aspectRatio: HERO.aspect, marginTop: 6 }}
      >
        <View accessible accessibilityRole="image" accessibilityLabel={HERO.label}>
          {w > 0 && <FadedPainting width={w} />}
        </View>
      </MotiView>

      {children ? (
        <View style={{ paddingHorizontal: bleed ? 22 : 0, paddingBottom: 30, marginTop: 14, gap: 18 }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

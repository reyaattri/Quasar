import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Button, C, Card, s, Tag, Text } from "./ui";

export function BioMiniLab({ module }: { module: number }) {
  if (module === 0) return <ChloroplastLab />;
  if (module === 1) return <PackingLab />;
  return <ExtractionLab />;
}

function ChloroplastLab() {
  const [light, setLight] = useState(true),
    [water, setWater] = useState(true),
    [carbon, setCarbon] = useState(true);
  const running = light && water && carbon;
  return (
    <Card style={{ backgroundColor: "#E3EDD4", gap: 14 }}>
      <Tag>MINI LAB · CHANGE ONE INPUT</Tag>
      <Text style={s.h2}>Can the chloroplast run?</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[
          ["Light", light, setLight],
          ["Water", water, setWater],
          ["CO₂", carbon, setCarbon],
        ].map(([label, on, setter]) => (
          <Button
            key={String(label)}
            small
            secondary={!on}
            onPress={() => (setter as (v: boolean) => void)(!on)}
          >
            {String(label)} {on ? "on" : "off"}
          </Button>
        ))}
      </View>
      <View
        style={{
          minHeight: 120,
          borderRadius: 22,
          padding: 18,
          justifyContent: "center",
          backgroundColor: running ? "#F5D86E" : "#D7D9D0",
        }}
      >
        <Text style={[s.h2, { textAlign: "center" }]}>
          {running ? "Sugar building · O₂ leaving" : "Production slows"}
        </Text>
        <Text style={[s.body, { textAlign: "center" }]}>
          {running
            ? "All three inputs are available. Trace where each atom and the captured energy go."
            : "Turn the missing input back on. A real plant may use stored resources briefly, but this model isolates the overall photosynthetic inputs."}
        </Text>
      </View>
    </Card>
  );
}

function PackingLab() {
  const [level, setLevel] = useState(0);
  const labels = [
    "Double helix",
    "Histone spools",
    "Beads on a string",
    "Folded chromatin",
    "Metaphase chromosome",
  ];
  return (
    <Card style={{ backgroundColor: "#E5E3F2", gap: 14 }}>
      <Tag>MINI LAB · PACK THE MOLECULE</Tag>
      <Text style={s.h2}>{labels[level]}</Text>
      <Svg width="100%" height={190} viewBox="0 0 320 190">
        {level === 0 ? (
          <>
            <Path
              d="M20 55C80 5 120 105 180 55S270 5 310 55"
              stroke="#3973B9"
              strokeWidth="8"
              fill="none"
            />
            <Path
              d="M20 135C80 185 120 85 180 135S270 185 310 135"
              stroke="#D96355"
              strokeWidth="8"
              fill="none"
            />
          </>
        ) : level < 4 ? (
          Array.from({ length: level === 1 ? 4 : level === 2 ? 7 : 10 }).map(
            (_, i) => (
              <React.Fragment key={i}>
                <Circle
                  cx={35 + (i % 5) * 63}
                  cy={55 + Math.floor(i / 5) * 80}
                  r={22}
                  fill="#8C78B4"
                />
                <Path
                  d={`M${12 + (i % 5) * 63} ${55 + Math.floor(i / 5) * 80}q23 -34 46 0q-23 34 -46 0`}
                  stroke="#F0B64B"
                  strokeWidth="6"
                  fill="none"
                />
              </React.Fragment>
            ),
          )
        ) : (
          <>
            <Path
              d="M85 20C175 50 145 95 235 170M235 20C145 50 175 95 85 170"
              stroke="#5268AA"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <Circle cx={160} cy={95} r={13} fill="#F0B64B" />
          </>
        )}
      </Svg>
      <Text style={s.body}>
        {level === 0
          ? "Start with the double helix. Packing changes access and shape, not the base sequence."
          : level === 4
            ? "Maximum compaction makes chromosomes easier to move during cell division."
            : "DNA wraps around histones, then the nucleosome chain folds into increasingly compact chromatin."}
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button
          small
          secondary
          disabled={level === 0}
          onPress={() => setLevel(level - 1)}
        >
          Loosen
        </Button>
        <Button
          small
          disabled={level === 4}
          onPress={() => setLevel(level + 1)}
        >
          Pack tighter
        </Button>
      </View>
    </Card>
  );
}

function ExtractionLab() {
  const steps = [
    ["Mash", "Break the fruit tissue so many cells are exposed."],
    ["Detergent", "Disrupt lipid cell and nuclear membranes."],
    ["Filter", "Hold back large tissue debris; DNA stays in the liquid."],
    ["Cold alcohol", "Make DNA precipitate as pale, stringy material."],
  ];
  const [done, setDone] = useState<string[]>([]),
    [message, setMessage] = useState("Choose the first step.");
  const choose = (name: string, explanation: string, index: number) => {
    if (done.includes(name)) return;
    if (index !== done.length) {
      setMessage(
        "That step belongs later. Ask what must happen to the cells first.",
      );
      return;
    }
    setDone([...done, name]);
    setMessage(explanation);
  };
  return (
    <Card style={{ backgroundColor: "#F5DFC9", gap: 14 }}>
      <Tag>MINI LAB · VIRTUAL BENCH</Tag>
      <Text style={s.h2}>Reveal fruit DNA in order.</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {steps.map(([name, explanation], i) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityLabel={`Lab step ${name}`}
            onPress={() => choose(name, explanation, i)}
            style={{
              padding: 13,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: C.ink,
              backgroundColor: done.includes(name) ? C.sage : C.white,
            }}
          >
            <Text style={s.label}>
              {i + 1} · {name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text accessibilityLiveRegion="polite" style={s.body}>
        {message}
      </Text>
      {done.length === 4 && (
        <Text style={s.h3}>
          You exposed, separated and precipitated many DNA molecules.
        </Text>
      )}
      <Text style={s.small}>
        Use an educator’s full safety instructions for a physical activity.
        Never taste lab mixtures, and keep alcohol away from heat or flame.
      </Text>
    </Card>
  );
}

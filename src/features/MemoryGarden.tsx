import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { MotiView } from "moti";
import { C, s, Text } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { medicalModules } from "../data/medicalLessons";
import {
  conceptId,
  errorMemory,
  gardenStage,
  type GardenStage,
} from "../lib/learning";
import type { Progress } from "../lib/progress";

const petals = ["#E9A07A", "#8FB3DE", "#C79BD6"];
const stageName = ["Seed", "Sprout", "Leaves", "Bud", "In bloom"];
const nextStep = [
  "Recall it once to plant it.",
  "Recall it correctly without help to grow leaves.",
  "Explain it in Teach-Back or the Why Ladder to grow a bud.",
  "Recall it again on another day to make it bloom.",
  "Recalled on separate days and explained. It's rooted.",
];

function Plant({ stage, color, care }: { stage: GardenStage; color: string; care: boolean }) {
  const stem = [0, 14, 24, 30, 32][stage];
  const top = 50 - stem;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 40 60">
      <Ellipse cx={20} cy={54} rx={15} ry={4.5} fill="#D9CDB4" />
      {stage === 0 && <Ellipse cx={20} cy={50} rx={3.2} ry={2.3} fill="#8A6A45" />}
      {stage > 0 && (
        <Path d={`M20 52 C19 ${52 - stem / 2} 21 ${top + 6} 20 ${top}`} stroke="#4E7B55" strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
      {stage >= 1 && (
        <>
          <Path d={`M20 ${50 - stem * 0.35} q-7 -2 -9 -8 q7 0 9 8`} fill="#7FA66F" />
          <Path d={`M20 ${50 - stem * 0.45} q7 -2 9 -8 q-7 0 -9 8`} fill="#7FA66F" />
        </>
      )}
      {stage >= 2 && (
        <>
          <Path d={`M20 ${50 - stem * 0.7} q-8 -1 -10 -7 q8 0 10 7`} fill="#6C9760" />
          <Path d={`M20 ${50 - stem * 0.78} q8 -1 10 -7 q-8 0 -10 7`} fill="#6C9760" />
        </>
      )}
      {stage === 3 && <Ellipse cx={20} cy={top - 2} rx={3.6} ry={5} fill={color} />}
      {stage === 4 && (
        <>
          {[0, 72, 144, 216, 288].map((deg) => {
            const r = (deg * Math.PI) / 180;
            return <Circle key={deg} cx={20 + Math.cos(r) * 5.2} cy={top - 3 + Math.sin(r) * 5.2} r={4} fill={color} />;
          })}
          <Circle cx={20} cy={top - 3} r={3} fill={C.yellow} />
        </>
      )}
      {care && <Path d="M33 12 q3 4 0 6 q-3 -2 0 -6" fill="#8FB3DE" />}
    </Svg>
  );
}

export function MemoryGarden({ progress }: { progress: Progress }) {
  const [picked, setPicked] = useState<string | null>(null);
  const open = new Set(errorMemory(progress).filter((e) => !e.resolved).map((e) => e.conceptId));
  const stages = medicalModules.map((m, i) => m.cards.map((_, j) => gardenStage(progress, conceptId(i, j))));
  const blooms = stages.flat().filter((x) => x === 4).length;
  const growing = stages.flat().filter((x) => x > 0).length;
  const sel = picked
    ? (() => {
        const [, m, c] = picked.split("-").map(Number);
        return { m, c, stage: stages[m][c] };
      })()
    : null;
  return (
    <Reveal>
      <View style={[s.paper, { gap: 14 }]}>
        <View>
          <Text style={s.label}>YOUR MEMORY GARDEN</Text>
          <Text style={[s.h2, { marginTop: 6 }]}>What's taking root.</Text>
          <Text style={[s.small, { marginTop: 4 }]}>
            {blooms} in bloom · {growing} of 18 growing
          </Text>
        </View>
        <Text style={s.small}>
          Every concept is a plant. It only grows from answers you give without help, and
          it never wilts while you're away.
        </Text>
        {medicalModules.map((lesson, m) => (
          <View key={lesson.id} style={{ gap: 6 }}>
            <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2, color: C.ink }]}>
              {lesson.title.toUpperCase()}
            </Text>
            <View style={{ flexDirection: "row", backgroundColor: "#E6DDC6", borderRadius: 16, paddingHorizontal: 6, paddingTop: 4 }}>
              {lesson.cards.map((card, c) => {
                const id = conceptId(m, c);
                const stage = stages[m][c];
                return (
                  <Pressable
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={`${card.title}: ${stageName[stage]}`}
                    accessibilityState={{ selected: picked === id }}
                    onPress={() => setPicked(picked === id ? null : id)}
                    style={{ flex: 1, aspectRatio: 40 / 60, maxHeight: 84 }}
                  >
                    <MotiView
                      style={{ flex: 1 }}
                      from={{ opacity: 0, translateY: 8 }}
                      animate={{ opacity: 1, translateY: picked === id ? -3 : 0 }}
                      transition={{ type: "timing", duration: 420, delay: (m * 6 + c) * 35 }}
                    >
                      <Plant stage={stage} color={petals[m]} care={open.has(id)} />
                    </MotiView>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        {sel ? (
          <View accessibilityLiveRegion="polite" style={{ backgroundColor: "#F6EFDB", borderRadius: 16, padding: 14, gap: 4 }}>
            <Text style={s.label}>
              {medicalModules[sel.m].cards[sel.c].title} · {stageName[sel.stage].toLowerCase()}
            </Text>
            <Text style={s.small}>{nextStep[sel.stage]}</Text>
            {open.has(picked!) && (
              <Text style={s.small}>The blue drop means it's in your Error Memory and could use some care.</Text>
            )}
          </View>
        ) : (
          <Text style={s.small}>Tap a plant to see what helps it grow.</Text>
        )}
      </View>
    </Reveal>
  );
}

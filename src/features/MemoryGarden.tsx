import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
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

function Plant({
  stage,
  color,
  care,
  variety,
}: {
  stage: GardenStage;
  color: string;
  care: boolean;
  variety: number;
}) {
  const stem = [0, 14, 24, 30, 32][stage];
  const top = 50 - stem;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 40 60">
      <Ellipse cx={20} cy={54} rx={15} ry={4.5} fill="#D9CDB4" />
      {stage === 0 && (
        <Ellipse cx={20} cy={50} rx={3.2} ry={2.3} fill="#8A6A45" />
      )}
      {stage > 0 && (
        <Path
          d={`M20 52 C19 ${52 - stem / 2} 21 ${top + 6} 20 ${top}`}
          stroke="#4E7B55"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      )}
      {stage >= 1 && (
        <>
          <Path
            d={`M20 ${50 - stem * 0.35} q-7 -2 -9 -8 q7 0 9 8`}
            fill="#7FA66F"
          />
          <Path
            d={`M20 ${50 - stem * 0.45} q7 -2 9 -8 q-7 0 -9 8`}
            fill="#7FA66F"
          />
        </>
      )}
      {stage >= 2 && (
        <>
          <Path
            d={`M20 ${50 - stem * 0.7} q-8 -1 -10 -7 q8 0 10 7`}
            fill="#6C9760"
          />
          <Path
            d={`M20 ${50 - stem * 0.78} q8 -1 10 -7 q-8 0 -10 7`}
            fill="#6C9760"
          />
        </>
      )}
      {stage === 3 &&
        (variety === 1 ? (
          <Path
            d={`M15 ${top + 2} Q20 ${top - 9} 25 ${top + 2} Q20 ${top + 7} 15 ${top + 2}`}
            fill={color}
          />
        ) : variety === 2 ? (
          <Path
            d={`M16 ${top - 5} Q20 ${top - 9} 24 ${top - 5} L23 ${top + 4} Q20 ${top + 8} 17 ${top + 4} Z`}
            fill={color}
          />
        ) : (
          <Ellipse cx={20} cy={top - 2} rx={3.6} ry={5} fill={color} />
        ))}
      {stage === 4 && (
        <>
          {variety === 0 && (
            <>
              {[0, 72, 144, 216, 288].map((deg) => {
                const r = (deg * Math.PI) / 180;
                return (
                  <Circle
                    key={deg}
                    cx={20 + Math.cos(r) * 5.2}
                    cy={top - 3 + Math.sin(r) * 5.2}
                    r={4}
                    fill={color}
                  />
                );
              })}
              <Circle cx={20} cy={top - 3} r={3} fill={C.yellow} />
            </>
          )}
          {variety === 1 && (
            <>
              <Path
                d={`M20 ${top + 6} C9 ${top + 1} 12 ${top - 10} 16 ${top - 4} C17 ${top - 12} 23 ${top - 12} 24 ${top - 4} C29 ${top - 10} 31 ${top + 1} 20 ${top + 6} Z`}
                fill={color}
              />
              <Path
                d={`M20 ${top + 4} L20 ${top - 7}`}
                stroke="#F5D36F"
                strokeWidth={1.5}
              />
            </>
          )}
          {variety === 2 && (
            <>
              {[-7, 0, 7].map((x, i) => (
                <Path
                  key={x}
                  d={`M${20 + x} ${top - 7 + Math.abs(x) / 2} Q${24 + x} ${top - 2} ${20 + x} ${top + 5} Q${16 + x} ${top - 2} ${20 + x} ${top - 7 + Math.abs(x) / 2} Z`}
                  fill={i === 1 ? color : "#789FD0"}
                />
              ))}
            </>
          )}
        </>
      )}
      {care && <Path d="M33 12 q3 4 0 6 q-3 -2 0 -6" fill="#8FB3DE" />}
    </Svg>
  );
}

export function MemoryGarden({ progress }: { progress: Progress }) {
  const [preview, setPreview] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const open = new Set(
    errorMemory(progress)
      .filter((e) => !e.resolved)
      .map((e) => e.conceptId),
  );
  const stages = medicalModules.map((m, i) =>
    m.cards.map((_, j) => gardenStage(progress, conceptId(i, j))),
  );
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
          Every concept is a plant. It only grows from answers you give without
          help, and it never wilts while you're away.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: preview }}
          onPress={() => setPreview(!preview)}
          style={{
            padding: 14,
            borderWidth: 1,
            borderColor: C.line,
            borderRadius: 14,
          }}
        >
          <Text style={s.link}>
            {preview ? "Close flower guide" : "See what your garden can grow"}
          </Text>
        </Pressable>
        {preview && (
          <View
            style={{
              gap: 12,
              padding: 16,
              backgroundColor: "#F6EFDB",
              borderRadius: 18,
            }}
          >
            <Text style={s.h3}>Your future blooms</Text>
            <View style={{ flexDirection: "row" }}>
              {["Coral cosmos", "Blue tulip", "Violet iris"].map((name, i) => (
                <View key={name} style={{ flex: 1, alignItems: "center" }}>
                  <View style={{ width: 76, height: 110 }}>
                    <Plant
                      stage={4}
                      color={petals[i]}
                      care={false}
                      variety={i}
                    />
                  </View>
                  <Text style={[s.small, { textAlign: "center" }]}>{name}</Text>
                </View>
              ))}
            </View>
            <Text style={s.small}>
              A preview, not earned progress. Every plant grows from seed to
              sprout, leaves, bud and bloom.
            </Text>
            <View style={{ flexDirection: "row" }}>
              {stageName.map((name, i) => (
                <View key={name} style={{ flex: 1, alignItems: "center" }}>
                  <View style={{ width: 44, height: 66 }}>
                    <Plant
                      stage={i as GardenStage}
                      color={petals[0]}
                      care={false}
                      variety={0}
                    />
                  </View>
                  <Text style={[s.small, { fontSize: 10 }]}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {medicalModules.map((lesson, m) => (
          <View key={lesson.id} style={{ gap: 6 }}>
            <Text
              style={[
                s.small,
                { fontWeight: "700", letterSpacing: 1.2, color: C.ink },
              ]}
            >
              {lesson.title.toUpperCase()}
            </Text>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#E6DDC6",
                borderRadius: 16,
                paddingHorizontal: 6,
                paddingTop: 4,
              }}
            >
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
                    <View
                      style={{
                        flex: 1,
                        transform: [{ translateY: picked === id ? -3 : 0 }],
                      }}
                    >
                      <Plant
                        stage={stage}
                        color={petals[m]}
                        care={open.has(id)}
                        variety={m % 3}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        {sel ? (
          <View
            accessibilityLiveRegion="polite"
            style={{
              backgroundColor: "#F6EFDB",
              borderRadius: 16,
              padding: 14,
              gap: 4,
            }}
          >
            <Text style={s.label}>
              {medicalModules[sel.m].cards[sel.c].title} ·{" "}
              {stageName[sel.stage].toLowerCase()}
            </Text>
            <Text style={s.small}>{nextStep[sel.stage]}</Text>
            {open.has(picked!) && (
              <Text style={s.small}>
                The blue drop means it's in your Error Memory and could use some
                care.
              </Text>
            )}
          </View>
        ) : (
          <Text style={s.small}>Tap a plant to see what helps it grow.</Text>
        )}
      </View>
    </Reveal>
  );
}

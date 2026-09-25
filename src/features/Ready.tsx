import React from "react";
import { View } from "react-native";
import { C, s, Text } from "../components/ui";
import { Meter, Reveal } from "../components/Reveal";
import { errorMemory, readiness } from "../lib/learning";
import type { Progress } from "../lib/progress";
import { ErrorMemoryList, type ErrorActions } from "./ErrorMemory";
import { MemoryGarden } from "./MemoryGarden";

export function ReadyPanel({ progress, ...actions }: { progress: Progress } & ErrorActions) {
  const r = readiness(progress);
  const rows = [
    ["Factual recall", "Can you retrieve it without the picture?", r.recall, C.green],
    ["Conceptual understanding", "Can you explain why it works?", r.understanding, "#7E6BA8"],
    ["Unfamiliar problem-solving", "Can you use it on a new case?", r.application, "#C98A3E"],
  ] as const;
  const errors = errorMemory(progress);
  const open = errors.filter((e) => !e.resolved).length;
  const fixed = errors.length - open;
  return (
    <View style={{ gap: 24 }}>
      <Reveal>
        <View style={[s.paper, { gap: 16 }]}>
          <View>
            <View style={s.between}>
              <Text style={s.label}>BIOLOGY READINESS</Text>
              <Text style={s.small}>{18 - r.untested} of 18 tested</Text>
            </View>
            <Text style={[s.h2, { marginTop: 6 }]}>Three kinds of knowing.</Text>
          </View>
          <Text style={s.small}>
            Measured separately, because knowing a fact isn't the same as
            explaining it or using it. Answers you needed a hint for don't
            count as mastered. This isn't a score prediction.
          </Text>
          {rows.map(([title, sub, m, color]) => (
            <View key={title} style={{ gap: 7 }}>
              <View style={s.between}>
                <Text style={[s.label, { fontSize: 15 }]}>{title}</Text>
                <Text style={[s.label, { color: m.count ? C.ink : C.muted }]}>
                  {m.count ? Math.round(m.value * 100) + "%" : "Not tested yet"}
                </Text>
              </View>
              <Meter value={m.value} color={color} track="#F0F1E8" height={12} />
              <Text style={s.small}>
                {sub}
                {m.count ? ` From your latest ${m.count} ${m.count === 1 ? "answer" : "answers"}.` : ""}
              </Text>
            </View>
          ))}
        </View>
      </Reveal>
      <MemoryGarden progress={progress} />
      {(open > 0 || fixed > 0) && (
        <View style={{ gap: 6 }}>
          <Text style={s.label}>ERROR MEMORY</Text>
          <Text style={s.h2}>
            {open ? `${open} ${open === 1 ? "idea needs" : "ideas need"} care.` : "Nothing needs repair."}
          </Text>
          {fixed > 0 && (
            <Text style={s.small}>
              {fixed} recurring {fixed === 1 ? "mistake" : "mistakes"} repaired by a later unaided answer.
            </Text>
          )}
        </View>
      )}
      <ErrorMemoryList progress={progress} {...actions} />
    </View>
  );
}

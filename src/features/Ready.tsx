import React from "react";
import { View } from "react-native";
import { C, Card, s, Tag, Text } from "../components/ui";
import { Meter, Reveal } from "../components/Reveal";
import { errorMemory, readiness } from "../lib/learning";
import type { Progress } from "../lib/progress";
import { ErrorMemoryList, type ErrorActions } from "./ErrorMemory";

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
    <View style={{ gap: 16 }}>
      <Reveal>
        <Card style={{ gap: 18 }}>
          <View style={s.between}>
            <Tag color={C.sage}>READY · BIOLOGY</Tag>
            <Text style={s.small}>{18 - r.untested} of 18 concepts tested</Text>
          </View>
          {rows.map(([title, sub, m, color]) => (
            <View key={title} style={{ gap: 7 }}>
              <View style={s.between}>
                <Text style={[s.label, { fontSize: 15 }]}>{title}</Text>
                <Text style={[s.label, { color: m.count ? C.ink : C.muted }]}>
                  {m.count ? Math.round(m.value * 100) + "%" : "Not tested yet"}
                </Text>
              </View>
              <Meter value={m.value} color={color} track={C.line} />
              <Text style={s.small}>
                {sub}
                {m.count
                  ? ` Your latest ${m.count} ${m.count === 1 ? "answer" : "answers"}; ones you needed a hint for don't count as mastered.`
                  : ""}
              </Text>
            </View>
          ))}
          <Text style={s.small}>
            These three are measured separately because knowing a fact isn't
            the same as explaining or using it. This isn't a score prediction.
          </Text>
        </Card>
      </Reveal>
      {(open > 0 || fixed > 0) && (
        <Text style={s.h2}>
          {open ? `${open} ${open === 1 ? "idea needs" : "ideas need"} attention` : "No open mistakes"}
        </Text>
      )}
      {fixed > 0 && (
        <Text style={s.small}>
          {fixed} recurring {fixed === 1 ? "mistake" : "mistakes"} repaired by a later unaided answer.
        </Text>
      )}
      <ErrorMemoryList progress={progress} {...actions} />
    </View>
  );
}

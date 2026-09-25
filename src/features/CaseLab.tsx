import React, { useState } from "react";
import { View } from "react-native";
import { C, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import { labCases } from "../data/caseLab";
import { medicalModules } from "../data/medicalLessons";
import { attemptsOf } from "../lib/learning";
import type { Attempt, Progress } from "../lib/progress";
import { PatientCase } from "./MedicineLesson";

function status(p: Progress, id: string) {
  const list = attemptsOf(p, id);
  if (!list.length) return { label: "New", color: C.line };
  if (list.some((a) => a.correct && !a.hinted)) return { label: "Solved", color: C.sage };
  if (list.some((a) => a.correct)) return { label: "Solved with a hint", color: "#F4E6B8" };
  return { label: "Try again", color: C.peach };
}

export function CaseLab({
  progress,
  focus,
  onAttempt,
  onNext,
}: {
  progress: Progress;
  focus?: string;
  onAttempt: (a: Omit<Attempt, "at">) => void;
  onNext: (kind: "teach" | "why", module: number) => void;
}) {
  const [open, setOpen] = useState<string | undefined>(focus);
  const current = labCases.find((c) => c.id === open);
  if (current)
    return (
      <PatientCase
        key={current.id}
        c={current}
        backLabel="All cases"
        onBack={() => setOpen(undefined)}
        onNext={(kind) => onNext(kind, current.module)}
        onTry={(correct, second, chose) =>
          onAttempt({
            conceptId: current.id,
            mode: "case",
            correct,
            hinted: second,
            chose: correct ? undefined : chose,
            truth: current.choices[current.answer],
          })
        }
      />
    );
  return (
    <View style={{ gap: 22 }}>
      <Reveal>
        <View style={{ gap: 9 }}>
          <Tag color={C.yellow}>CASE LAB</Tag>
          <Text accessibilityRole="header" style={s.title}>
            Use it on something new.
          </Text>
          <Text style={s.body}>
            Original problems you haven't seen in the lessons. You get two tries;
            the hint only appears after the second.
          </Text>
        </View>
      </Reveal>
      {medicalModules.map((lesson, m) => (
        <Reveal key={lesson.id} delay={80 + m * 70}>
          <View style={{ gap: 10 }}>
            <Text style={s.label}>{lesson.title.toUpperCase()}</Text>
            {labCases
              .filter((c) => c.module === m)
              .map((c) => {
                const st = status(progress, c.id);
                return (
                  <PressableScale
                    key={c.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${c.title}, ${st.label}`}
                    onPress={() => setOpen(c.id)}
                    style={[s.card, { padding: 16, gap: 8, backgroundColor: "#F3EEF6" }]}
                  >
                    <View style={s.between}>
                      <Text style={[s.label, { flex: 1, fontSize: 15 }]}>{c.title}</Text>
                      <Tag color={st.color}>{st.label}</Tag>
                    </View>
                    <Text style={s.small} numberOfLines={2}>
                      {c.prompt}
                    </Text>
                  </PressableScale>
                );
              })}
          </View>
        </Reveal>
      ))}
      <Text style={s.small}>
        Educational scenarios for practice, not diagnosis or advice.
      </Text>
    </View>
  );
}

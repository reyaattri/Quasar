import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Button, C, Card, Icon, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import { buildPlan, type Task, type TaskType } from "../lib/planner";
import type { Progress } from "../lib/progress";
import { ErrorMemoryList, type ErrorActions } from "./ErrorMemory";

const look: Record<TaskType, { icon: string; label: string; tint: string }> = {
  recall: { icon: "cards", label: "RECALL", tint: C.sage },
  repair: { icon: "key", label: "REPAIR", tint: C.peach },
  teach: { icon: "smile", label: "TEACH-BACK", tint: "#F4E6B8" },
  why: { icon: "spark", label: "WHY LADDER", tint: "#E9DEF0" },
  case: { icon: "map", label: "CASE", tint: "#E7DFEF" },
  learn: { icon: "leaf", label: "NEW", tint: C.sage },
};

const exams = [
  ["None", 0],
  ["1 week", 7],
  ["2 weeks", 14],
  ["1 month", 30],
] as const;

export function TodayPlan({
  progress,
  onStart,
  onExam,
  ...errors
}: {
  progress: Progress;
  onStart: (t: Task) => void;
  onExam: (exam: Progress["exam"]) => void;
} & ErrorActions) {
  const [budget, setBudget] = useState(15);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [examOpen, setExamOpen] = useState(false);
  const { tasks, spare } = buildPlan(progress, budget, skipped);
  const minutes = tasks.reduce((n, t) => n + t.minutes, 0);
  const examDays = progress.exam
    ? Math.max(0, Math.ceil((new Date(progress.exam.date).getTime() - Date.now()) / 86_400_000))
    : null;

  return (
    <View style={{ gap: 16 }}>
      <Reveal>
        <Card style={{ backgroundColor: "#254633", borderWidth: 0, gap: 16 }}>
          <View style={s.between}>
            <Text style={{ color: "#E3EBCF", fontSize: 11, letterSpacing: 2, fontWeight: "700" }}>
              TODAY · BIOLOGY
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Set exam date"
              onPress={() => setExamOpen(!examOpen)}
            >
              <Text style={{ color: C.yellow, fontSize: 12, fontWeight: "700" }}>
                {examDays !== null ? `Exam in ${examDays} days` : "+ Add exam"}
              </Text>
            </Pressable>
          </View>
          <Text style={{ color: C.paper, fontFamily: "QuasarGrotesk", fontSize: 26, lineHeight: 31 }}>
            {minutes} minutes. Here's what needs you.
          </Text>
          {examOpen && (
            <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
              {exams.map(([label, days]) => {
                const active = days === 0 ? !progress.exam : examDays !== null && Math.abs(examDays - days) <= 1;
                return (
                  <Chip
                    key={label}
                    label={label}
                    active={active}
                    dark
                    onPress={() => {
                      onExam(
                        days
                          ? { label: "Biology exam", date: new Date(Date.now() + days * 86_400_000).toISOString() }
                          : null,
                      );
                      setExamOpen(false);
                    }}
                  />
                );
              })}
            </View>
          )}
          <View style={[s.row, { gap: 8 }]} accessibilityRole="radiogroup">
            {[5, 15, 30].map((m) => (
              <Chip key={m} label={`${m} min`} active={budget === m} dark onPress={() => { setBudget(m); setSkipped([]); }} />
            ))}
          </View>
        </Card>
      </Reveal>

      {tasks.map((t, i) => (
        <Reveal key={t.id} delay={80 + i * 70}>
          <View style={[s.card, { padding: 0, gap: 0 }]}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`${t.title}, ${t.minutes} minutes. ${t.reason}`}
              onPress={() => onStart(t)}
              style={{ flexDirection: "row", gap: 14, alignItems: "flex-start", padding: 18, paddingRight: 64 }}
            >
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: look[t.type].tint, alignItems: "center", justifyContent: "center" }}>
                <Icon name={look[t.type].icon} size={20} />
              </View>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2, color: C.ink }]}>
                  {look[t.type].label} · {t.minutes} MIN
                </Text>
                <Text style={[s.label, { fontSize: 16 }]}>{t.title}</Text>
                <Text style={s.small}>{t.reason}</Text>
              </View>
            </PressableScale>
            {spare.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Swap ${t.title} for another task`}
                hitSlop={10}
                onPress={() => setSkipped([...skipped, t.id])}
                style={{ position: "absolute", top: 16, right: 18 }}
              >
                <Text style={s.link}>Swap</Text>
              </Pressable>
            )}
          </View>
        </Reveal>
      ))}
      {tasks[0] && (
        <Reveal delay={80 + tasks.length * 70}>
          <View style={{ gap: 10 }}>
            <Button icon="arrow" onPress={() => onStart(tasks[0])}>
              Start today's session
            </Button>
            <Text style={s.small}>
              Ranked by knowledge gap, review timing, exam date, importance and
              prerequisites. Tap Swap to replace any task.
            </Text>
          </View>
        </Reveal>
      )}
      <ErrorMemoryList progress={progress} limit={2} {...errors} />
    </View>
  );
}

function Chip({ label, active, onPress, dark }: { label: string; active: boolean; onPress: () => void; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress}>
      <MotiView
        animate={{ backgroundColor: active ? C.yellow : dark ? "rgba(255,255,255,0.08)" : C.white }}
        transition={{ type: "timing", duration: 200 }}
        style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: active ? C.yellow : "rgba(227,235,207,0.3)" }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600", color: active ? C.ink : "#E3EBCF" }}>{label}</Text>
      </MotiView>
    </Pressable>
  );
}

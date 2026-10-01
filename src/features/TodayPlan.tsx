import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Button, C, Card, s, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import {
  LearningActivityArt,
  type ActivityArtKind,
} from "../components/LearningActivityArt";
import { buildPlan, type Task, type TaskType } from "../lib/planner";
import type { Progress } from "../lib/progress";
import { ErrorMemoryList, type ErrorActions } from "./ErrorMemory";

const look: Record<
  TaskType,
  { art: ActivityArtKind; label: string; tint: string; edge: string }
> = {
  recall: { art: "recall", label: "RECALL", tint: "#EEF1F8", edge: "#AEBBD5" },
  repair: { art: "repair", label: "REPAIR", tint: "#FAE5D7", edge: "#D98D6E" },
  teach: {
    art: "teach",
    label: "TEACH-BACK",
    tint: "#E8F1F5",
    edge: "#8BAFC0",
  },
  why: { art: "why", label: "WHY LADDER", tint: "#F0E8F4", edge: "#B194BF" },
  case: { art: "case", label: "CASE LAB", tint: "#E6EEE9", edge: "#78998A" },
  learn: {
    art: "learn",
    label: "NEW LESSON",
    tint: "#F7EDC9",
    edge: "#D9B959",
  },
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
  const { tasks, spare, recovery } = buildPlan(progress, budget, skipped);
  const minutes = tasks.reduce((n, t) => n + t.minutes, 0);
  const examDays = progress.exam
    ? Math.max(
        0,
        Math.ceil(
          (new Date(progress.exam.date).getTime() - Date.now()) / 86_400_000,
        ),
      )
    : null;

  return (
    <View style={{ gap: 16 }}>
      <Reveal>
        <Card style={{ backgroundColor: "#254633", borderWidth: 0, gap: 16 }}>
          <View style={s.between}>
            <Text
              style={{
                color: "#E3EBCF",
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: "700",
              }}
            >
              TODAY · BIOLOGY
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Set exam date"
              onPress={() => setExamOpen(!examOpen)}
            >
              <Text
                style={{ color: C.yellow, fontSize: 12, fontWeight: "700" }}
              >
                {examDays !== null ? `Exam in ${examDays} days` : "+ Add exam"}
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: 8 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Text
                style={{
                  color: C.paper,
                  fontFamily: "QuasarGrotesk",
                  fontSize: 26,
                  lineHeight: 31,
                }}
              >
                {recovery
                  ? "Welcome back. Let's start small."
                  : `${minutes} minutes. Here's what needs you.`}
              </Text>
              <Text style={{ color: "#C8D8CB", fontSize: 13, lineHeight: 18 }}>
                A short route through what is fading, what is shaky and what
                comes next.
              </Text>
            </View>
            <View style={{ width: "100%", height: 172 }}>
              <LearningActivityArt kind="today" height={172} />
            </View>
          </View>
          {recovery && (
            <Text style={{ color: "#DBE6D6", fontSize: 14, lineHeight: 21 }}>
              {recovery.daysAway >= 3
                ? `It's been ${recovery.daysAway} days, and nothing is lost. `
                : ""}
              {recovery.overdue
                ? `${recovery.overdue} ${recovery.overdue === 1 ? "review is" : "reviews are"} waiting. This ${minutes}-minute plan starts with the most important${recovery.deferred ? `; ${recovery.deferred} more can wait for another session` : ""}.`
                : `This ${minutes}-minute plan eases you back in.`}
            </Text>
          )}
          {examOpen && (
            <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
              {exams.map(([label, days]) => {
                const active =
                  days === 0
                    ? !progress.exam
                    : examDays !== null && Math.abs(examDays - days) <= 1;
                return (
                  <Chip
                    key={label}
                    label={label}
                    active={active}
                    dark
                    onPress={() => {
                      onExam(
                        days
                          ? {
                              label: "Biology exam",
                              date: new Date(
                                Date.now() + days * 86_400_000,
                              ).toISOString(),
                            }
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
              <Chip
                key={m}
                label={`${m} min`}
                active={budget === m}
                dark
                onPress={() => {
                  setBudget(m);
                  setSkipped([]);
                }}
              />
            ))}
          </View>
        </Card>
      </Reveal>

      {tasks.map((t, i) => (
        <Reveal key={t.id} delay={80 + i * 70}>
          <View
            style={[
              s.card,
              {
                padding: 0,
                gap: 0,
                overflow: "hidden",
                backgroundColor: look[t.type].tint,
                borderColor: look[t.type].edge,
                borderWidth: 1.5,
              },
            ]}
          >
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`${t.title}, ${t.minutes} minutes. ${t.reason}`}
              onPress={() => onStart(t)}
              style={{ gap: 12, padding: 18, paddingTop: 36 }}
            >
              {tasks.slice(0, i).filter((x) => x.type === t.type).length ===
              0 ? (
                <LearningActivityArt kind={look[t.type].art} height={152} />
              ) : t.type === "recall" &&
                tasks.slice(0, i).filter((x) => x.type === "recall").length ===
                  1 ? (
                <Image
                  accessibilityLabel="An owl retrieves a blueprint from a tiny archive"
                  source={require("../../assets/learning-recall-owl.png")}
                  resizeMode="contain"
                  style={{ width: "100%", height: 152 }}
                />
              ) : null}
              <View style={{ flex: 1, gap: 5 }}>
                <Text
                  style={[
                    s.small,
                    { fontWeight: "700", letterSpacing: 1.2, color: C.ink },
                  ]}
                >
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

function Chip({
  label,
  active,
  onPress,
  dark,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
    >
      <MotiView
        animate={{
          backgroundColor: active
            ? C.yellow
            : dark
              ? "rgba(255,255,255,0.08)"
              : C.white,
        }}
        transition={{ type: "timing", duration: 200 }}
        style={{
          borderRadius: 999,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: active ? C.yellow : "rgba(227,235,207,0.3)",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: active ? C.ink : "#E3EBCF",
          }}
        >
          {label}
        </Text>
      </MotiView>
    </Pressable>
  );
}

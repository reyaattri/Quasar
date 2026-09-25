import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Button, C, Card, Icon, s, Tag, Text } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { rungLevels } from "../data/biologyUnderstanding";
import { conceptInfo, errorMemory, type ErrorEntry } from "../lib/learning";
import type { Progress } from "../lib/progress";

export type ErrorActions = {
  onExplain: (id: string) => void;
  onLater: (id: string) => void;
  onAngle: (id: string, angle: number) => void;
  onNewHook?: (entry: ErrorEntry) => Promise<void>;
  onUpgrade?: () => void;
};

type Hook = { text: string; why: string; at: string };

export function ErrorMemoryList({
  progress,
  limit,
  ...actions
}: { progress: Progress; limit?: number } & ErrorActions) {
  const open = errorMemory(progress).filter((e) => !e.resolved);
  if (!open.length) return null;
  return (
    <View style={{ gap: 12 }}>
      {open.slice(0, limit).map((e, i) => (
        <Reveal key={e.conceptId} delay={i * 80}>
          <ErrorCard
            entry={e}
            preferred={progress.cues?.[e.conceptId]}
            hooks={progress.hooks?.[e.conceptId] ?? []}
            {...actions}
          />
        </Reveal>
      ))}
    </View>
  );
}

function ErrorCard({
  entry,
  preferred,
  hooks,
  onExplain,
  onLater,
  onAngle,
  onNewHook,
  onUpgrade,
}: { entry: ErrorEntry; preferred?: number; hooks: Hook[] } & ErrorActions) {
  const info = conceptInfo(entry.conceptId)!;
  const angles: { text: string; why?: string; ai: boolean }[] = [
    ...info.angles.map((text) => ({ text, ai: false })),
    ...hooks.map((h) => ({ text: h.text, why: h.why, ai: true })),
  ];
  const [angle, setAngle] = useState<number | null>(null);
  const [later, setLater] = useState(false);
  const [writing, setWriting] = useState<"" | "busy" | "error">("");
  const [error, setError] = useState("");
  const isCase = info.isCase;
  // Explain-back and new hooks are built around the biology lessons.
  const bio = !isCase && !("world" in info);
  const shown = angle !== null ? angles[angle] : null;

  const write = () => {
    if (!onNewHook) return;
    setWriting("busy");
    setError("");
    onNewHook(entry)
      .then(() => {
        setWriting("");
        setAngle(angles.length);
      })
      .catch((e) => {
        setWriting("error");
        setError(e instanceof Error ? e.message : "The AI is unavailable right now.");
      });
  };

  return (
    <Card style={{ backgroundColor: "#FBEFE3", borderColor: "#EBCFB6", gap: 12 }}>
      <View style={s.between}>
        <Tag color={C.peach}>ERROR MEMORY · MISSED {entry.wrong}×</Tag>
        {entry.breaksAt !== undefined && (
          <Text style={s.small}>breaks at: {rungLevels[entry.breaksAt].replace("?", "").toLowerCase()}</Text>
        )}
      </View>
      <Text style={s.h3}>{entry.title}</Text>
      {entry.misconception && (
        <View style={{ gap: 4 }}>
          <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2 }]}>YOU KEEP CHOOSING</Text>
          <Text style={[s.body, { color: C.red }]}>“{entry.misconception}”</Text>
        </View>
      )}
      {entry.truth && (
        <View style={{ gap: 4 }}>
          <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2 }]}>WHAT'S TRUE</Text>
          <Text style={[s.body, { color: C.ink }]}>{entry.truth}</Text>
        </View>
      )}
      {shown && angle !== null && (
        <View style={{ backgroundColor: shown.ai ? "#EEF1F8" : C.white, borderRadius: 16, padding: 14, gap: 8 }}>
          <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2 }]}>
            {shown.ai ? "YOUR NEW MEMORY HOOK" : "ANOTHER WAY TO SEE IT"} · {angle + 1} OF {angles.length}
          </Text>
          <Text style={[s.body, { color: C.ink }]}>{shown.text}</Text>
          {shown.why ? <Text style={s.small}>{shown.why}</Text> : null}
          {shown.ai && (
            <Text style={s.small}>AI-written: check it against what's true above.</Text>
          )}
          {preferred === angle ? (
            <View style={s.row}>
              <Icon name="check" size={16} color={C.green} />
              <Text style={s.small}>Saved as the explanation that works for you.</Text>
            </View>
          ) : (
            <Button small secondary onPress={() => onAngle(entry.conceptId, angle)}>
              This one helped
            </Button>
          )}
        </View>
      )}
      {bio && (
        <Button small icon="arrow" onPress={() => onExplain(entry.conceptId)}>
          Explain it back
        </Button>
      )}
      <View style={[s.row, { flexWrap: "wrap" }]}>
        <View style={{ flex: 1, minWidth: 140 }}>
          <Button
            small
            secondary
            onPress={() => setAngle(angle === null ? (preferred ?? 0) : (angle + 1) % angles.length)}
          >
            {angle === null ? "Try a different angle" : "Another angle"}
          </Button>
        </View>
        {!isCase && (
          <View style={{ flex: 1, minWidth: 140 }}>
            <Button
              small
              secondary
              disabled={later}
              onPress={() => {
                setLater(true);
                onLater(entry.conceptId);
              }}
            >
              {later ? "Scheduled soon" : "Check me later"}
            </Button>
          </View>
        )}
      </View>
      {bio && onNewHook && (
        <Button small secondary icon="spark" disabled={writing === "busy"} onPress={write}>
          {writing === "busy" ? "Writing a new hook…" : "Write me a new memory hook"}
        </Button>
      )}
      {writing === "error" && (
        <Text accessibilityRole="alert" style={[s.small, { color: C.red }]}>
          {error}
        </Text>
      )}
      {bio && !onNewHook && onUpgrade && (
        <Pressable accessibilityRole="button" onPress={onUpgrade}>
          <Text style={s.link}>Still not sticking? Quasar Plus can write you a brand-new memory hook for this mistake →</Text>
        </Pressable>
      )}
    </Card>
  );
}

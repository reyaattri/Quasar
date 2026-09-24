import React, { useState } from "react";
import { View } from "react-native";
import { Button, C, Card, Icon, s, Tag, Text } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { rungLevels } from "../data/biologyUnderstanding";
import { conceptInfo, errorMemory, type ErrorEntry } from "../lib/learning";
import type { Progress } from "../lib/progress";

export type ErrorActions = {
  onExplain: (id: string) => void;
  onLater: (id: string) => void;
  onAngle: (id: string, angle: number) => void;
};

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
          <ErrorCard entry={e} preferred={progress.cues?.[e.conceptId]} {...actions} />
        </Reveal>
      ))}
    </View>
  );
}

function ErrorCard({
  entry,
  preferred,
  onExplain,
  onLater,
  onAngle,
}: { entry: ErrorEntry; preferred?: number } & ErrorActions) {
  const info = conceptInfo(entry.conceptId)!;
  const [angle, setAngle] = useState<number | null>(null);
  const [later, setLater] = useState(false);
  const isCase = info.isCase;
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
      {angle !== null && (
        <View style={{ backgroundColor: C.white, borderRadius: 16, padding: 14, gap: 8 }}>
          <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2 }]}>
            ANOTHER WAY TO SEE IT · {angle + 1} OF {info.angles.length}
          </Text>
          <Text style={[s.body, { color: C.ink }]}>{info.angles[angle]}</Text>
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
      {!isCase && (
        <Button small icon="arrow" onPress={() => onExplain(entry.conceptId)}>
          Explain it back
        </Button>
      )}
      <View style={[s.row, { flexWrap: "wrap" }]}>
        <View style={{ flex: 1, minWidth: 140 }}>
          <Button
            small
            secondary
            onPress={() => setAngle(angle === null ? (preferred ?? 0) : (angle + 1) % info.angles.length)}
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
    </Card>
  );
}

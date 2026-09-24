import React, { useState } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { Button, C, Card, Icon, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import { medicalModules } from "../data/medicalLessons";
import { rungLevels, whyLadders } from "../data/biologyUnderstanding";
import { conceptId } from "../lib/learning";
import type { Attempt } from "../lib/progress";

export function WhyLadder({
  module: initial,
  onAttempt,
  onCase,
  onDone,
}: {
  module?: number;
  onAttempt: (a: Omit<Attempt, "at">) => void;
  onCase: (module: number) => void;
  onDone: () => void;
}) {
  const [module, setModule] = useState<number | undefined>(initial);
  if (module === undefined)
    return (
      <View style={{ gap: 22 }}>
        <Reveal>
          <View style={{ gap: 9 }}>
            <Tag color={C.yellow}>THE WHY LADDER</Tag>
            <Text accessibilityRole="header" style={s.title}>
              Know it. Then know why.
            </Text>
            <Text style={s.body}>
              Five rungs, from what happens to using it somewhere new. Quasar
              notes the rung where your understanding breaks, so the next
              lesson can start there.
            </Text>
          </View>
        </Reveal>
        {whyLadders.map((ladder, m) => (
          <Reveal key={ladder.title} delay={80 + m * 70}>
            <PressableScale
              accessibilityRole="button"
              onPress={() => setModule(m)}
              style={[s.card, { gap: 8 }]}
            >
              <Text style={s.small}>{medicalModules[m].title.toUpperCase()}</Text>
              <Text style={s.h3}>{ladder.title}</Text>
              <Text style={s.link}>Climb 5 rungs →</Text>
            </PressableScale>
          </Reveal>
        ))}
      </View>
    );
  return (
    <Climb
      key={module}
      module={module}
      onAttempt={onAttempt}
      onCase={onCase}
      onDone={onDone}
      onBack={() => setModule(undefined)}
    />
  );
}

function Climb({
  module,
  onAttempt,
  onCase,
  onDone,
  onBack,
}: {
  module: number;
  onAttempt: (a: Omit<Attempt, "at">) => void;
  onCase: (module: number) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const ladder = whyLadders[module];
  const [rung, setRung] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const done = results.length === ladder.rungs.length;
  const current = ladder.rungs[Math.min(rung, ladder.rungs.length - 1)];
  const breaks = results.indexOf(false);

  return (
    <View style={{ gap: 20 }}>
      <Reveal>
        <View style={{ gap: 9 }}>
          <Tag color={C.yellow}>WHY LADDER · {medicalModules[module].title.toUpperCase()}</Tag>
          <Text accessibilityRole="header" style={s.title}>
            {ladder.title}
          </Text>
        </View>
      </Reveal>

      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`Rung ${Math.min(rung + 1, 5)} of 5`}
        style={{ flexDirection: "row", gap: 6 }}
      >
        {ladder.rungs.map((_, i) => {
          const state = results[i];
          const bg =
            state === true ? C.green : state === false ? C.red : i === rung ? C.yellow : C.line;
          return (
            <MotiView
              key={i}
              style={{ flex: 1, height: 8, borderRadius: 8, backgroundColor: bg }}
              animate={{ scaleY: i === rung && !done ? 1.4 : 1 }}
              transition={{ type: "spring", damping: 14 }}
            />
          );
        })}
      </View>

      {!done ? (
        <Reveal key={rung}>
          <Card style={{ gap: 12 }}>
            <Text style={s.label}>
              RUNG {rung + 1} · {rungLevels[rung].toUpperCase()}
            </Text>
            <Text style={s.h3}>{current.prompt}</Text>
            {current.choices.map((c, i) => (
              <Button
                key={c}
                secondary={choice !== i}
                disabled={choice !== null}
                onPress={() => {
                  setChoice(i);
                  const correct = i === current.answer;
                  onAttempt({
                    conceptId: conceptId(module, current.concept),
                    mode: "why",
                    correct,
                    hinted: false,
                    rung,
                    chose: correct ? undefined : c,
                    truth: current.choices[current.answer],
                  });
                }}
              >
                {c}
              </Button>
            ))}
            {choice !== null && (
              <>
                <Text accessibilityLiveRegion="polite" style={s.h3}>
                  {choice === current.answer ? "That rung holds." : "This rung slipped."}
                </Text>
                <Text style={s.body}>{current.explain}</Text>
                <Button
                  icon="arrow"
                  onPress={() => {
                    setResults([...results, choice === current.answer]);
                    setChoice(null);
                    setRung(rung + 1);
                  }}
                >
                  {rung === 4 ? "See where you stand" : "Next rung"}
                </Button>
              </>
            )}
          </Card>
        </Reveal>
      ) : (
        <Reveal>
          <Card style={{ backgroundColor: breaks === -1 ? C.sage : "#F4E6B8", gap: 12 }}>
            <Icon name={breaks === -1 ? "check" : "key"} size={28} />
            <Text style={s.h2}>
              {breaks === -1
                ? "All five rungs held."
                : `Your understanding breaks at: ${rungLevels[breaks].toLowerCase().replace("?", "")}.`}
            </Text>
            <Text style={s.body}>
              {breaks === -1
                ? "You can describe it, explain it and use it on something new. Try the field case next."
                : "That's useful to know. Today will bring this ladder back, and if the same idea slips again it goes into your Error Memory."}
            </Text>
            <Button icon="arrow" onPress={() => onCase(module)}>
              Try the field case
            </Button>
            <Button secondary onPress={onDone}>
              Back to Today
            </Button>
            <Button secondary onPress={onBack}>
              Choose another ladder
            </Button>
          </Card>
        </Reveal>
      )}
    </View>
  );
}

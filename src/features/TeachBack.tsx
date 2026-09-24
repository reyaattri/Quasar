import React, { useState } from "react";
import { View } from "react-native";
import { Button, C, Card, Field, Icon, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import { medicalModules } from "../data/medicalLessons";
import { teachConcepts } from "../data/biologyUnderstanding";
import { attemptsOf, conceptId, errorMemory, parseConcept } from "../lib/learning";
import { applicationHints, type Attempt, type Progress } from "../lib/progress";

type Log = (a: Omit<Attempt, "at">) => void;

function status(p: Progress, id: string) {
  const list = attemptsOf(p, id);
  if (!list.length) return { label: "Not tried", color: C.line };
  if (errorMemory(p).some((e) => e.conceptId === id && !e.resolved))
    return { label: "Needs repair", color: C.peach };
  const last = list[list.length - 1];
  return last.correct && !last.hinted
    ? { label: "Solid", color: C.sage }
    : { label: "Keep going", color: "#F4E6B8" };
}

export function TeachBack({
  progress,
  focus,
  mode,
  onAttempt,
  onDone,
}: {
  progress: Progress;
  focus?: string;
  mode: "teach" | "recall";
  onAttempt: Log;
  onDone: () => void;
}) {
  const [picked, setPicked] = useState<string | undefined>(focus);
  const parsed = picked ? parseConcept(picked) : null;
  if (!parsed || parsed.isCase)
    return (
      <View style={{ gap: 22 }}>
        <Reveal>
          <View style={{ gap: 9 }}>
            <Tag color={C.yellow}>TEACH-BACK STUDIO</Tag>
            <Text accessibilityRole="header" style={s.title}>
              Can you explain it without help?
            </Text>
            <Text style={s.body}>
              Pick a concept. The lesson disappears, and you teach it back in
              your own words.
            </Text>
          </View>
        </Reveal>
        {medicalModules.map((lesson, m) => (
          <Reveal key={lesson.id} delay={80 + m * 70}>
            <View style={{ gap: 10 }}>
              <Text style={s.label}>{lesson.title.toUpperCase()}</Text>
              {lesson.cards.map((card, c) => {
                const id = conceptId(m, c);
                const st = status(progress, id);
                return (
                  <PressableScale
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={`${card.title}, ${st.label}`}
                    onPress={() => setPicked(id)}
                    style={[s.card, { padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }]}
                  >
                    <Text style={[s.label, { flex: 1, fontSize: 15 }]}>{card.title}</Text>
                    <Tag color={st.color}>{st.label}</Tag>
                  </PressableScale>
                );
              })}
            </View>
          </Reveal>
        ))}
      </View>
    );
  return (
    <Session
      key={picked! + mode}
      module={parsed.module}
      card={parsed.card}
      mode={mode}
      onAttempt={onAttempt}
      onDone={onDone}
      onAnother={() => setPicked(undefined)}
    />
  );
}

function Session({
  module,
  card: index,
  mode,
  onAttempt,
  onDone,
  onAnother,
}: {
  module: number;
  card: number;
  mode: "teach" | "recall";
  onAttempt: Log;
  onDone: () => void;
  onAnother: () => void;
}) {
  const id = conceptId(module, index);
  const card = medicalModules[module].cards[index];
  const concept = teachConcepts[module][index];
  const [stage, setStage] = useState<"explain" | "defend" | "done">(
    mode === "recall" ? "defend" : "explain",
  );
  const [text, setText] = useState("");
  const [checks, setChecks] = useState(0);
  const [hits, setHits] = useState<boolean[] | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const allHit = !!hits && hits.every(Boolean);
  const finalCheck = allHit || checks >= 2;

  const record = (correct: boolean, hinted: boolean) => {
    if (recorded) return;
    setRecorded(true);
    onAttempt({ conceptId: id, mode: "teach", correct, hinted });
  };
  const check = () => {
    const h = applicationHints(text, concept.keyPoints.map((k) => k.keywords));
    const n = checks + 1;
    setHits(h);
    setChecks(n);
    if (h.every(Boolean) || n >= 2) record(h.every(Boolean), n > 1);
  };
  const missing = hits ? concept.keyPoints.filter((_, i) => !hits[i]) : [];

  return (
    <View style={{ gap: 20 }}>
      <Reveal>
        <View style={{ gap: 9 }}>
          <Tag color={C.yellow}>
            {mode === "recall" ? "RECALL" : "TEACH-BACK"} ·{" "}
            {medicalModules[module].title.toUpperCase()}
          </Tag>
          <Text accessibilityRole="header" style={s.title}>
            {card.title}
          </Text>
        </View>
      </Reveal>

      {stage === "explain" && (
        <Reveal delay={80}>
          <View style={{ gap: 16 }}>
            <Card style={{ backgroundColor: C.green, borderWidth: 0 }}>
              <Text style={[s.small, { color: "#C8D3C0", letterSpacing: 1.5, fontWeight: "700" }]}>
                THE LESSON IS HIDDEN
              </Text>
              <Text style={[s.h3, { color: C.paper }]}>{concept.prompt}</Text>
              <Text style={[s.small, { color: "#C8D3C0" }]}>
                Teach it as if to someone who has never heard of it.
              </Text>
            </Card>
            <Field
              label="Your explanation"
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Start with what happens, then say why…"
            />
            {!finalCheck && (
              <Button icon="check" disabled={text.trim().length < 20} onPress={check}>
                {checks ? "Check again" : "Check my explanation"}
              </Button>
            )}
            {hits && (
              <Card style={{ gap: 12 }}>
                <Text style={s.label}>
                  {hits.filter(Boolean).length} OF 3 KEY IDEAS FOUND
                </Text>
                {concept.keyPoints.map((k, i) =>
                  hits[i] || finalCheck || revealed ? (
                    <View key={k.text} style={[s.row, { alignItems: "flex-start" }]}>
                      <Icon name={hits[i] ? "check" : "close"} size={18} color={hits[i] ? C.green : C.red} />
                      <Text style={[s.body, { flex: 1, color: hits[i] ? C.ink : C.muted }]}>{k.text}</Text>
                    </View>
                  ) : null,
                )}
                {!finalCheck && missing[0] && (
                  <View style={{ backgroundColor: "#F4E6B8", borderRadius: 16, padding: 14, gap: 6 }}>
                    <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2, color: C.ink }]}>
                      A QUESTION BEFORE THE ANSWER
                    </Text>
                    <Text style={[s.body, { color: C.ink }]}>{missing[0].ask}</Text>
                    <Text style={s.small}>Add to your explanation, then check again.</Text>
                  </View>
                )}
                {finalCheck && (
                  <Text accessibilityLiveRegion="polite" style={[s.body, { color: C.ink }]}>
                    {allHit
                      ? checks === 1
                        ? "All three ideas, unaided. That's a real explanation."
                        : "All three ideas, with one nudge. Try it again tomorrow without the question."
                      : "Some ideas are still missing. They're shown above, and this concept will come back sooner."}
                  </Text>
                )}
              </Card>
            )}
            {!revealed && (
              <Button
                secondary
                onPress={() => {
                  setRevealed(true);
                  record(false, true);
                }}
              >
                Show me the full explanation
              </Button>
            )}
            {revealed && (
              <Card style={{ backgroundColor: C.sage }}>
                <Text style={s.label}>WHAT A COMPLETE EXPLANATION COVERS</Text>
                <Text style={[s.body, { color: C.ink }]}>{card.biology}</Text>
              </Card>
            )}
            {(finalCheck || revealed) && (
              <Button icon="arrow" onPress={() => setStage("defend")}>
                Defend it: one follow-up question
              </Button>
            )}
            <Text style={s.small}>
              Checked for key ideas by keyword, not graded by AI. Judge your
              reasoning too.
            </Text>
          </View>
        </Reveal>
      )}

      {stage === "defend" && (
        <Reveal>
          <Card style={{ gap: 12 }}>
            <Text style={s.label}>
              {mode === "recall" ? "RECALL WITHOUT THE PICTURE" : "DEFEND YOUR EXPLANATION"}
            </Text>
            <Text style={s.h3}>{card.question}</Text>
            {card.choices.map((c, i) => (
              <Button
                key={c}
                secondary={choice !== i}
                disabled={choice !== null}
                onPress={() => {
                  setChoice(i);
                  const correct = i === card.answer;
                  onAttempt({
                    conceptId: id,
                    mode: "recall",
                    correct,
                    hinted: false,
                    chose: correct ? undefined : c,
                    truth: card.choices[card.answer],
                  });
                }}
              >
                {c}
              </Button>
            ))}
            {choice !== null && (
              <>
                <Text accessibilityLiveRegion="polite" style={s.h3}>
                  {choice === card.answer ? "Held up under questioning." : "Not quite."}
                </Text>
                <Text style={s.body}>{card.fact}</Text>
                <Button icon="arrow" onPress={() => setStage("done")}>
                  Finish
                </Button>
              </>
            )}
          </Card>
        </Reveal>
      )}

      {stage === "done" && (
        <Reveal>
          <Card style={{ backgroundColor: C.sage, alignItems: "flex-start" }}>
            <Icon name="spark" size={30} />
            <Text style={s.h2}>Saved to your learning history.</Text>
            <Text style={s.body}>
              Quasar uses this to decide what comes back tomorrow and what needs
              a different angle.
            </Text>
            <Button onPress={onDone}>Back to Today</Button>
            <Button secondary onPress={onAnother}>
              Explain another concept
            </Button>
          </Card>
        </Reveal>
      )}
    </View>
  );
}

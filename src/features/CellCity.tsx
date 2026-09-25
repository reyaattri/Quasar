import React, { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "react-native-reanimated";
import { Button, C, Card, Icon, s, Tag, Text } from "../components/ui";
import { Meter, PressableScale, Reveal } from "../components/Reveal";
import { AtlasArt } from "../components/StudyShelf";
import {
  cellCity,
  characters,
  cityQuestions,
  cueLevel,
  explainCovered,
  type CityQuestion,
  type CueLevel,
  type Episode,
  type Reading,
  type Rebuild,
} from "../data/cellCity";
import { dueIds, type Attempt, type Progress } from "../lib/progress";

type Log = (a: Omit<Attempt, "at">) => void;

const NIGHT = "#202A3B";
const LAMP = "#F2CB6C";
const cityArt = require("../../assets/bio-cells-world.png");

// Placeholder panels from the biology atlas until each episode has its own picture.
const episodeArt: Record<
  number,
  { index: number; dark?: boolean; label: string }
> = {
  1: {
    index: 0,
    label:
      "Builders at work beside the Archive, whose guard checks everyone at the door",
  },
  3: {
    index: 5,
    label: "Foreman Kip in the power station, charging battery after battery",
  },
  4: { index: 5, dark: true, label: "The power station in darkness" },
  6: { index: 5, label: "The power station running again" },
};

function shuffled<T>(items: T[]) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CellCity({
  progress,
  onAttempt,
  onComplete,
  onTop,
}: {
  progress: Progress;
  onAttempt: Log;
  onComplete: (episode: number) => void;
  onTop?: () => void;
}) {
  const done = progress.city?.done ?? [];
  const [open, setOpen] = useState<number | "revisit" | null>(null);
  useEffect(() => onTop?.(), [open]);
  const due = dueIds(progress).filter((id) => /^city-e\d-q\d$/.test(id));

  if (open === "revisit")
    return (
      <Revisit
        ids={due}
        progress={progress}
        onAttempt={onAttempt}
        onDone={() => setOpen(null)}
      />
    );
  if (typeof open === "number")
    return (
      <EpisodeRun
        key={open}
        episode={cellCity[open]}
        progress={progress}
        onAttempt={onAttempt}
        onFinish={() => onComplete(cellCity[open].n)}
        onNext={
          open < cellCity.length - 1 ? () => setOpen(open + 1) : undefined
        }
        onExit={() => setOpen(null)}
        onTop={onTop}
      />
    );

  const lit = done.length;
  const next = cellCity.findIndex((e) => !done.includes(e.n));
  return (
    <View style={{ gap: 22 }}>
      <Reveal>
        <View style={{ gap: 9 }}>
          <Tag color={LAMP}>MEMORY WORLD · CELL CITY</Tag>
          <Text accessibilityRole="header" style={s.title}>
            The Secrets of Cell City
          </Text>
          <Text style={s.body}>
            A power shortage is spreading through a living city. Investigate
            glycolysis, the citric acid cycle and oxidative phosphorylation to
            find out where the energy supply broke down.
          </Text>
        </View>
      </Reveal>

      <Reveal delay={80}>
        <View
          style={{
            backgroundColor: NIGHT,
            borderRadius: 28,
            padding: 18,
            gap: 14,
            overflow: "hidden",
          }}
        >
          <View style={[s.row, { gap: 8 }]}>
            {[0, 5].map((index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#2C3850",
                }}
              >
                <AtlasArt
                  source={cityArt}
                  columns={3}
                  rows={2}
                  index={index}
                  height={150}
                  inset={1}
                />
              </View>
            ))}
          </View>
          <View style={s.between}>
            <Text style={[s.label, { color: LAMP }]}>CITY POWER</Text>
            <Text style={[s.small, { color: "#E6E1D2" }]}>
              {lit} of {cellCity.length} districts lit
            </Text>
          </View>
          <Meter
            value={lit / cellCity.length}
            color={LAMP}
            track="#3A465E"
            height={10}
          />
          <View style={[s.row, { justifyContent: "space-between" }]}>
            {cellCity.map((e) => (
              <View
                key={e.n}
                accessibilityLabel={`Episode ${e.n} ${done.includes(e.n) ? "complete" : "not complete"}`}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done.includes(e.n) ? LAMP : "#2C3850",
                  borderWidth: 1,
                  borderColor: done.includes(e.n) ? LAMP : "#56627C",
                }}
              >
                <Text
                  style={{
                    color: done.includes(e.n) ? NIGHT : "#C9CEDA",
                    fontWeight: "700",
                  }}
                >
                  {e.n}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Reveal>

      {due.length > 0 && (
        <Reveal delay={120}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Revisit ${due.length} Cell City clues`}
            onPress={() => setOpen("revisit")}
            style={[
              s.card,
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                backgroundColor: "#F4E6B8",
                borderColor: "#E6D49A",
              },
            ]}
          >
            <Icon name="clock" size={24} />
            <View style={{ flex: 1 }}>
              <Text style={s.h3}>
                {due.length === 1
                  ? "1 clue to revisit"
                  : `${due.length} clues to revisit`}
              </Text>
              <Text style={s.small}>
                Spaced so they come back just as they start to fade.
              </Text>
            </View>
            <Icon name="arrow" size={20} />
          </PressableScale>
        </Reveal>
      )}

      <View style={{ gap: 12 }}>
        <Text style={s.label}>THE EPISODES</Text>
        {cellCity.map((e, i) => {
          const complete = done.includes(e.n);
          const unlocked =
            i === 0 || done.includes(cellCity[i - 1].n) || complete;
          return (
            <Reveal key={e.n} delay={140 + i * 50}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={`Episode ${e.n}: ${e.title}${unlocked ? "" : ", locked"}`}
                accessibilityState={{ disabled: !unlocked }}
                disabled={!unlocked}
                onPress={() => setOpen(i)}
                style={[
                  s.card,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    opacity: unlocked ? 1 : 0.55,
                    borderColor: i === next ? C.ink : C.line,
                    borderWidth: i === next ? 1.5 : 1,
                  },
                ]}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: complete
                      ? LAMP
                      : unlocked
                        ? C.sage
                        : C.line,
                  }}
                >
                  {complete ? (
                    <Icon name="check" size={22} />
                  ) : unlocked ? (
                    <Text style={s.h3}>{e.n}</Text>
                  ) : (
                    <Icon name="lock" size={18} color={C.muted} />
                  )}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={s.h3}>{e.title}</Text>
                  <Text style={s.small}>
                    {e.topic}
                    {unlocked ? "" : ` · finish episode ${e.n - 1} first`}
                  </Text>
                </View>
                {unlocked && <Icon name="arrow" size={18} />}
              </PressableScale>
            </Reveal>
          );
        })}
      </View>

      <Reveal delay={200}>
        <View style={[s.paper, { gap: 12 }]}>
          <Text style={s.label}>WHO'S WHO IN CELL CITY</Text>
          {Object.values(characters).map((c) => (
            <View key={c.id} style={[s.row, { alignItems: "flex-start" }]}>
              <Badge id={c.id} />
              <View style={{ flex: 1 }}>
                <Text style={[s.body, { color: C.ink, fontWeight: "700" }]}>
                  {c.name}
                </Text>
                <Text style={s.small}>{c.real}</Text>
              </View>
            </View>
          ))}
        </View>
      </Reveal>
    </View>
  );
}

function Badge({
  id,
  size = 38,
}: {
  id: keyof typeof characters;
  size?: number;
}) {
  const c = characters[id];
  const initials = c.name
    .replace(/^(Mayor|Archivist|Gatekeeper|Foreman|Courier) /, "")
    .split(/\s|&/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: c.color,
        borderWidth: 1.5,
        borderColor: C.ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "700", color: C.ink, fontSize: size * 0.36 }}>
        {initials}
      </Text>
    </View>
  );
}

function EpisodeArt({ n }: { n: number }) {
  const reduced = useReducedMotion();
  const art = episodeArt[n];
  if (!art) return null;
  return (
    <View
      accessibilityLabel={art.label}
      style={{
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: art.dark ? NIGHT : C.sage,
      }}
    >
      <AtlasArt
        source={cityArt}
        columns={3}
        rows={2}
        index={art.index}
        height={200}
        inset={1}
      />
      {art.dark && (
        <MotiView
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: NIGHT,
          }}
          from={{ opacity: 0.72 }}
          animate={{ opacity: reduced ? 0.72 : 0.58 }}
          transition={{ type: "timing", duration: 900, loop: !reduced }}
        />
      )}
    </View>
  );
}

type Phase = "brief" | "scene" | "rebuild" | "clues" | "explain" | "done";
const phaseNames: Record<Phase, string> = {
  brief: "THE REAL BIOLOGY",
  scene: "THE SCENE",
  rebuild: "REBUILD IT",
  clues: "THE CLUES",
  explain: "EXPLAIN IT",
  done: "EPISODE COMPLETE",
};

function EpisodeRun({
  episode,
  progress,
  onAttempt,
  onFinish,
  onNext,
  onExit,
  onTop,
}: {
  episode: Episode;
  progress: Progress;
  onAttempt: Log;
  onFinish: () => void;
  onNext?: () => void;
  onExit: () => void;
  onTop?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("brief");
  const [beat, setBeat] = useState(0);
  const [clue, setClue] = useState(0);
  const [right, setRight] = useState(0);
  useEffect(() => onTop?.(), [phase, clue]);
  const phases: Phase[] = [
    "brief",
    "scene",
    "rebuild",
    "clues",
    ...(episode.explain ? (["explain"] as Phase[]) : []),
    "done",
  ];
  const finish = () => {
    onFinish();
    setPhase("done");
  };
  const afterClues = () => (episode.explain ? setPhase("explain") : finish());

  return (
    <View style={{ gap: 18 }}>
      <View style={s.between}>
        <Tag color={LAMP}>
          EPISODE {episode.n} · {phaseNames[phase]}
        </Tag>
        <Pressable accessibilityRole="button" onPress={onExit}>
          <Text style={s.link}>Back to the city</Text>
        </Pressable>
      </View>
      <View
        style={[s.row, { gap: 6 }]}
        accessibilityLabel={`Step ${phases.indexOf(phase) + 1} of ${phases.length}`}
      >
        {phases.map((p, i) => (
          <View
            key={p}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              backgroundColor: i <= phases.indexOf(phase) ? C.green : C.line,
            }}
          />
        ))}
      </View>

      {phase === "brief" && (
        <>
          <Reveal>
            <View style={{ gap: 6 }}>
              <Text accessibilityRole="header" style={s.title}>
                {episode.title}
              </Text>
              <Text style={s.small}>
                {episode.topic} · {episode.place}
              </Text>
            </View>
          </Reveal>
          <Reveal delay={60}>
            <View style={[s.paper, { gap: 12 }]}>
              <Text style={s.label}>FIRST, WHAT'S REALLY HAPPENING</Text>
              {episode.science.map((p, i) => (
                <View key={i} style={[s.row, { alignItems: "flex-start" }]}>
                  <Text style={[s.body, { color: C.green }]}>•</Text>
                  <Text style={[s.body, { color: C.ink, flex: 1 }]}>{p}</Text>
                </View>
              ))}
            </View>
          </Reveal>
          {episode.mapping.length > 0 && (
            <Reveal delay={120}>
              <View
                style={{
                  backgroundColor: NIGHT,
                  borderRadius: 24,
                  padding: 18,
                  gap: 10,
                }}
              >
                <Text style={[s.label, { color: LAMP }]}>
                  THEN, HOW CELL CITY SHOWS IT
                </Text>
                {episode.mapping.map(([real, city]) => (
                  <View
                    key={real}
                    style={{
                      gap: 2,
                      borderLeftWidth: 2,
                      borderLeftColor: LAMP,
                      paddingLeft: 10,
                    }}
                  >
                    <Text style={{ color: "#FFFDF4", fontWeight: "700" }}>
                      {real}
                    </Text>
                    <Text style={{ color: "#D8DCE6" }}>{city}</Text>
                  </View>
                ))}
              </View>
            </Reveal>
          )}
          <Button icon="arrow" onPress={() => setPhase("scene")}>
            Enter the scene
          </Button>
        </>
      )}

      {phase === "scene" && (
        <>
          <EpisodeArt n={episode.n} />
          {episode.scene.slice(0, beat + 1).map((b, i) => (
            <Reveal key={i} delay={i === beat ? 0 : 0}>
              <View style={[s.row, { alignItems: "flex-start", gap: 12 }]}>
                <Badge id={b.who} />
                <View
                  style={{
                    flex: 1,
                    backgroundColor: C.white,
                    borderRadius: 18,
                    borderTopLeftRadius: 4,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: C.line,
                    gap: 4,
                  }}
                >
                  <Text style={[s.small, { fontWeight: "700", color: C.ink }]}>
                    {characters[b.who].name}
                  </Text>
                  <Text style={[s.body, { color: C.ink }]}>{b.line}</Text>
                </View>
              </View>
            </Reveal>
          ))}
          {beat < episode.scene.length - 1 ? (
            <Button icon="arrow" onPress={() => setBeat(beat + 1)}>
              Continue
            </Button>
          ) : (
            <Button icon="arrow" onPress={() => setPhase("rebuild")}>
              Rebuild it from memory
            </Button>
          )}
        </>
      )}

      {phase === "rebuild" && (
        <RebuildRun
          rebuild={episode.rebuild}
          level={
            episode.noCues
              ? 2
              : cueLevel(progress.attempts ?? [], episode.rebuild.id)
          }
          onAttempt={onAttempt}
          onDone={() => setPhase("clues")}
        />
      )}

      {phase === "clues" && (
        <>
          <Text style={s.label}>
            CLUE {clue + 1} OF {episode.clues.length}
          </Text>
          <ClueCard
            key={episode.clues[clue].id}
            q={episode.clues[clue]}
            level={
              episode.noCues
                ? 2
                : cueLevel(progress.attempts ?? [], episode.clues[clue].id)
            }
            noCues={episode.noCues}
            onAttempt={(a) => {
              if (a.correct) setRight((n) => n + 1);
              onAttempt(a);
            }}
            last={clue === episode.clues.length - 1}
            onNext={() =>
              clue < episode.clues.length - 1 ? setClue(clue + 1) : afterClues()
            }
          />
        </>
      )}

      {phase === "explain" && episode.explain && (
        <ExplainRun
          explain={episode.explain}
          onAttempt={onAttempt}
          onDone={finish}
        />
      )}

      {phase === "done" && (
        <Reveal>
          <View
            style={{
              backgroundColor: NIGHT,
              borderRadius: 28,
              padding: 22,
              gap: 14,
            }}
          >
            <Icon name="sun" size={30} color={LAMP} />
            <Text style={[s.h2, { color: "#FFFDF4" }]}>
              {episode.title}: solved.
            </Text>
            <Text style={{ color: "#D8DCE6", fontSize: 16, lineHeight: 24 }}>
              {right} of {episode.clues.length} clues right. Every clue comes
              back for review, and its cue fades as you keep getting it right.
            </Text>
            <Text
              style={{
                color: LAMP,
                fontSize: 17,
                lineHeight: 25,
                fontStyle: "italic",
              }}
            >
              {episode.wrap}
            </Text>
            {onNext ? (
              <Button icon="arrow" onPress={onNext}>
                {`Episode ${episode.n + 1}: ${cellCity[episode.n].title}`}
              </Button>
            ) : null}
            <Button secondary onPress={onExit}>
              Back to the city
            </Button>
          </View>
        </Reveal>
      )}
    </View>
  );
}

function CueStrength({ level, off }: { level: CueLevel; off?: boolean }) {
  const filled = off ? 0 : 3 - level;
  return (
    <View
      style={[s.row, { gap: 4 }]}
      accessibilityLabel={
        off
          ? "No cues in this episode"
          : ["Full cue", "Cue fading", "Cue gone"][level]
      }
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i < filled ? C.green : C.line,
          }}
        />
      ))}
      <Text style={s.small}>
        {off ? "no cues" : ["full cue", "cue fading", "on your own"][level]}
      </Text>
    </View>
  );
}

function CueBox({ text, level }: { text: string; level: CueLevel }) {
  return (
    <View
      style={{
        backgroundColor: level === 0 ? "#F4E6B8" : "transparent",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderStyle: level === 0 ? "solid" : "dashed",
        borderColor: "#D9C27E",
        opacity: level === 0 ? 1 : 0.7,
        gap: 3,
      }}
    >
      <Text style={[s.small, { fontWeight: "700", letterSpacing: 1.2 }]}>
        {level === 0 ? "CITY CUE" : "FADING CUE"}
      </Text>
      <Text style={[s.body, { color: C.ink }]}>{text}</Text>
    </View>
  );
}

const readingValue: Record<Reading["level"], number> = {
  none: 0.04,
  low: 0.25,
  normal: 0.5,
  high: 0.78,
  "very high": 1,
};

function Readings({ readings }: { readings: Reading[] }) {
  return (
    <View
      style={{ backgroundColor: NIGHT, borderRadius: 18, padding: 14, gap: 10 }}
    >
      <Text style={[s.label, { color: LAMP }]}>DISTRICT READINGS</Text>
      {readings.map((r) => (
        <View
          key={r.label}
          style={{ gap: 4 }}
          accessibilityLabel={`${r.label}: ${r.level}${r.note ? ", " + r.note : ""}`}
        >
          <View style={s.between}>
            <Text style={{ color: "#FFFDF4", fontWeight: "600" }}>
              {r.label}
            </Text>
            <Text style={{ color: "#C9CEDA" }}>{r.note ?? r.level}</Text>
          </View>
          <Meter
            value={readingValue[r.level]}
            color={LAMP}
            track="#3A465E"
            height={7}
          />
        </View>
      ))}
    </View>
  );
}

function ClueCard({
  q,
  level,
  noCues,
  onAttempt,
  onNext,
  last,
}: {
  q: CityQuestion;
  level: CueLevel;
  noCues?: boolean;
  onAttempt: Log;
  onNext: () => void;
  last: boolean;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const [another, setAnother] = useState(false);
  // Authored with the answer first; shown in a fresh order each time.
  const [order] = useState(() => shuffled(q.choices.map((_, i) => i)));
  const cueText = level === 0 || hint ? q.cue : q.nudge;
  return (
    <Reveal>
      <Card style={{ gap: 12 }}>
        <View style={s.between}>
          <Text style={[s.label, { flex: 1 }]}>{q.title.toUpperCase()}</Text>
          <CueStrength level={level} off={noCues} />
        </View>
        {q.readings && <Readings readings={q.readings} />}
        <Text style={s.h3}>{q.prompt}</Text>
        {!noCues && choice === null && (level < 2 || hint) && cueText ? (
          <CueBox text={cueText} level={hint ? 0 : level} />
        ) : null}
        {!noCues && level === 2 && !hint && choice === null && (
          <Pressable accessibilityRole="button" onPress={() => setHint(true)}>
            <Text style={s.link}>Need a hint? (It'll come back sooner.)</Text>
          </Pressable>
        )}
        {order.map((i) => {
          const c = q.choices[i];
          return (
            <PressableScale
              key={c}
              accessibilityRole="button"
              accessibilityState={{ disabled: choice !== null }}
              disabled={choice !== null}
              onPress={() => {
                setChoice(i);
                onAttempt({
                  conceptId: q.id,
                  mode: "recall",
                  correct: i === q.answer,
                  hinted: !noCues && (level === 0 || hint),
                  chose: i === q.answer ? undefined : c,
                  truth: q.choices[q.answer],
                });
              }}
              style={[
                s.input,
                { justifyContent: "center" },
                choice !== null &&
                  i === q.answer && {
                    backgroundColor: C.sage,
                    borderColor: C.green,
                  },
                choice === i &&
                  i !== q.answer && {
                    backgroundColor: "#FBEFE3",
                    borderColor: C.red,
                  },
              ]}
            >
              <Text style={[s.body, { color: C.ink }]}>{c}</Text>
            </PressableScale>
          );
        })}
        {choice !== null && (
          <View style={{ gap: 10 }}>
            <Text accessibilityLiveRegion="polite" style={s.h3}>
              {choice === q.answer ? "Right." : "Not quite."}
            </Text>
            <Text style={[s.body, { color: C.ink }]}>{q.why}</Text>
            {another ? (
              <View
                style={{
                  backgroundColor: C.sage,
                  borderRadius: 14,
                  padding: 12,
                  gap: 3,
                }}
              >
                <Text
                  style={[s.small, { fontWeight: "700", letterSpacing: 1.2 }]}
                >
                  ANOTHER WAY TO SEE IT
                </Text>
                <Text style={[s.body, { color: C.ink }]}>{q.another}</Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => setAnother(true)}
              >
                <Text style={s.link}>Explain it another way</Text>
              </Pressable>
            )}
            <Button icon="arrow" onPress={onNext}>
              {last ? "Continue" : "Next clue"}
            </Button>
          </View>
        )}
      </Card>
    </Reveal>
  );
}

function RebuildRun({
  rebuild,
  level,
  onAttempt,
  onDone,
}: {
  rebuild: Rebuild;
  level: CueLevel;
  onAttempt: Log;
  onDone: () => void;
}) {
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string[]>([]);
  const [pick, setPick] = useState<number | null>(null);
  const [pool] = useState(() =>
    shuffled(rebuild.kind === "order" ? rebuild.steps : rebuild.right),
  );
  const total =
    rebuild.kind === "order" ? rebuild.steps.length : rebuild.left.length;
  const complete = placed.length === total;

  const settle = (next: string[], errors: number) => {
    if (next.length === total)
      onAttempt({
        conceptId: rebuild.id,
        mode: "recall",
        correct: errors === 0,
        hinted: level === 0 && !!rebuild.cue,
      });
  };

  const tapOrder = (step: string) => {
    if (rebuild.kind !== "order" || complete) return;
    if (step === rebuild.steps[placed.length]) {
      const next = [...placed, step];
      setPlaced(next);
      setWrong(null);
      settle(next, mistakes);
    } else {
      setMistakes(mistakes + 1);
      setWrong(step);
    }
  };

  const tapMatch = (answer: string) => {
    if (rebuild.kind !== "match" || pick === null || complete) return;
    if (rebuild.right.indexOf(answer) === pick) {
      const next = [...placed, answer];
      setPlaced(next);
      setPick(null);
      setWrong(null);
      settle(next, mistakes);
    } else {
      setMistakes(mistakes + 1);
      setWrong(answer);
    }
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={s.between}>
        <Text style={[s.h3, { flex: 1 }]}>{rebuild.prompt}</Text>
      </View>
      <CueStrength level={level} off={!rebuild.cue} />
      {rebuild.cue && level < 2 ? (
        <CueBox text={rebuild.cue} level={level} />
      ) : null}

      {rebuild.kind === "order" ? (
        <>
          {placed.length > 0 && (
            <View style={[s.paper, { gap: 8 }]}>
              {placed.map((p, i) => (
                <Reveal key={p}>
                  <View style={[s.row, { alignItems: "flex-start" }]}>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: C.green,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: C.white, fontWeight: "700" }}>
                        {i + 1}
                      </Text>
                    </View>
                    <Text style={[s.body, { color: C.ink, flex: 1 }]}>{p}</Text>
                  </View>
                </Reveal>
              ))}
            </View>
          )}
          {!complete &&
            pool
              .filter((p) => !placed.includes(p))
              .map((p) => (
                <PressableScale
                  key={p}
                  accessibilityRole="button"
                  onPress={() => tapOrder(p)}
                  style={[
                    s.input,
                    { justifyContent: "center" },
                    wrong === p && {
                      borderColor: C.red,
                      backgroundColor: "#FBEFE3",
                    },
                  ]}
                >
                  <Text style={[s.body, { color: C.ink }]}>{p}</Text>
                </PressableScale>
              ))}
          {wrong && !complete && (
            <Text accessibilityRole="alert" style={[s.small, { color: C.red }]}>
              Not yet. What has to happen before that?
            </Text>
          )}
        </>
      ) : (
        <>
          <View style={{ gap: 8 }}>
            {rebuild.left.map((l, i) => {
              const matched = placed.includes(rebuild.right[i]);
              return (
                <PressableScale
                  key={l}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: pick === i,
                    disabled: matched,
                  }}
                  disabled={matched || complete}
                  onPress={() => {
                    setPick(i);
                    setWrong(null);
                  }}
                  style={[
                    s.input,
                    { gap: 4 },
                    pick === i && {
                      borderColor: C.ink,
                      borderWidth: 2,
                      backgroundColor: "#F4E6B8",
                    },
                    matched && {
                      backgroundColor: C.sage,
                      borderColor: C.green,
                    },
                  ]}
                >
                  <Text style={[s.body, { color: C.ink, fontWeight: "700" }]}>
                    {l}
                  </Text>
                  {matched && <Text style={s.small}>{rebuild.right[i]}</Text>}
                </PressableScale>
              );
            })}
          </View>
          {!complete && (
            <>
              <Text style={s.label}>
                {pick === null
                  ? "CHOOSE ONE ABOVE, THEN ITS MATCH"
                  : `WHICH ONE GOES WITH ${rebuild.left[pick].toUpperCase()}?`}
              </Text>
              {pool
                .filter((r) => !placed.includes(r))
                .map((r) => (
                  <PressableScale
                    key={r}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: pick === null }}
                    disabled={pick === null}
                    onPress={() => tapMatch(r)}
                    style={[
                      s.input,
                      {
                        justifyContent: "center",
                        opacity: pick === null ? 0.6 : 1,
                      },
                      wrong === r && {
                        borderColor: C.red,
                        backgroundColor: "#FBEFE3",
                      },
                    ]}
                  >
                    <Text style={[s.body, { color: C.ink }]}>{r}</Text>
                  </PressableScale>
                ))}
              {wrong && (
                <Text
                  accessibilityRole="alert"
                  style={[s.small, { color: C.red }]}
                >
                  Not that one. Try another.
                </Text>
              )}
            </>
          )}
        </>
      )}

      {complete && (
        <Reveal>
          <Card style={{ backgroundColor: C.sage, gap: 10 }}>
            <Text accessibilityLiveRegion="polite" style={s.h3}>
              {mistakes === 0
                ? "Rebuilt without a slip."
                : `Rebuilt, with ${mistakes} ${mistakes === 1 ? "slip" : "slips"}.`}
            </Text>
            <Text style={s.body}>
              {mistakes === 0
                ? "Next time the cue will be lighter."
                : "The cue stays until you rebuild it cleanly."}
            </Text>
            <Button icon="arrow" onPress={onDone}>
              On to the clues
            </Button>
          </Card>
        </Reveal>
      )}
    </View>
  );
}

function ExplainRun({
  explain,
  onAttempt,
  onDone,
}: {
  explain: NonNullable<Episode["explain"]>;
  onAttempt: Log;
  onDone: () => void;
}) {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const covered = checked?.filter(Boolean).length ?? 0;
  return (
    <View style={{ gap: 14 }}>
      <Text style={s.h3}>{explain.prompt}</Text>
      <TextInput
        accessibilityLabel="Your explanation"
        multiline
        value={text}
        onChangeText={setText}
        editable={!checked}
        placeholder="When the oxygen runs out…"
        placeholderTextColor={C.muted}
        style={[
          s.input,
          {
            minHeight: 140,
            textAlignVertical: "top",
            fontFamily: "QuasarGrotesk",
          },
        ]}
      />
      {!checked ? (
        <Button
          icon="check"
          disabled={text.trim().split(/\s+/).length < 8}
          onPress={() => {
            const result = explainCovered(text, explain);
            setChecked(result);
            onAttempt({
              conceptId: explain.id,
              mode: "teach",
              correct: result.filter(Boolean).length >= 3,
              hinted: false,
            });
          }}
        >
          Check my explanation
        </Button>
      ) : (
        <Reveal>
          <Card style={{ gap: 10 }}>
            <Text style={s.h3}>
              {covered >= 3
                ? "The Mayor understands."
                : "The Mayor needs a little more."}
            </Text>
            {explain.ideas.map((idea, i) => (
              <View
                key={idea.label}
                style={[s.row, { alignItems: "flex-start" }]}
              >
                <Icon
                  name={checked[i] ? "check" : "close"}
                  size={18}
                  color={checked[i] ? C.green : C.red}
                />
                <Text style={[s.body, { color: C.ink, flex: 1 }]}>
                  {idea.label}
                </Text>
              </View>
            ))}
            <Text style={s.small}>
              This checks for the key ideas by their words, so it can miss a
              good explanation that uses different ones.
            </Text>
            {covered < 3 && (
              <Button
                small
                secondary
                onPress={() => {
                  setChecked(null);
                }}
              >
                Add to my explanation
              </Button>
            )}
            <Button icon="arrow" onPress={onDone}>
              Finish the episode
            </Button>
          </Card>
        </Reveal>
      )}
    </View>
  );
}

function Revisit({
  ids,
  progress,
  onAttempt,
  onDone,
}: {
  ids: string[];
  progress: Progress;
  onAttempt: Log;
  onDone: () => void;
}) {
  const [queue] = useState(() =>
    ids
      .map((id) => cityQuestions.find((q) => q.id === id))
      .filter((q): q is CityQuestion => !!q),
  );
  const [i, setI] = useState(0);
  const q = queue[i];
  if (!q)
    return (
      <Card style={{ backgroundColor: C.sage, gap: 12 }}>
        <Icon name="check" size={28} color={C.green} />
        <Text style={s.h2}>All caught up in Cell City.</Text>
        <Button onPress={onDone}>Back to the city</Button>
      </Card>
    );
  return (
    <View style={{ gap: 16 }}>
      <View style={s.between}>
        <Tag color={LAMP}>
          REVISIT · {i + 1} / {queue.length}
        </Tag>
        <Pressable accessibilityRole="button" onPress={onDone}>
          <Text style={s.link}>Back to the city</Text>
        </Pressable>
      </View>
      <ClueCard
        key={q.id}
        q={q}
        level={q.cue ? cueLevel(progress.attempts ?? [], q.id) : 2}
        noCues={!q.cue}
        onAttempt={onAttempt}
        last={i === queue.length - 1}
        onNext={() => setI(i + 1)}
      />
    </View>
  );
}

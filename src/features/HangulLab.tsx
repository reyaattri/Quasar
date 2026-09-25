import React, { useState } from "react";
import { View } from "react-native";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import {
  builderFinals,
  builderInitials,
  builderVowels,
  compose,
  decompose,
  hangulWords,
  isVerticalVowel,
  romanize,
  romanizeWord,
  soundTwins,
  vowelLessons,
} from "../data/hangul";
import { dueIds, type Attempt, type Progress } from "../lib/progress";
import { VoicePractice } from "../components/VoicePractice";

type Log = (a: Omit<Attempt, "at">) => void;
type Tab = "vowels" | "build" | "twins" | "words";

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

function Chip({ label, active, onPress, big = false, accessibilityLabel }: { label: string; active: boolean; onPress: () => void; big?: boolean; accessibilityLabel?: string }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        minWidth: big ? 46 : undefined,
        minHeight: 44,
        paddingHorizontal: big ? 10 : 14,
        borderRadius: big ? 14 : 999,
        borderWidth: 1,
        borderColor: active ? C.green : C.line,
        backgroundColor: active ? C.sage : C.white,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={big ? { fontSize: 22, color: C.ink } : [s.label, { fontSize: 13 }]}>{label}</Text>
    </PressableScale>
  );
}

export function HangulLab({ progress, onAttempt, onBack }: { progress: Progress; onAttempt: Log; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("vowels");
  const tabs: [Tab, string][] = [
    ["vowels", "Vowels"],
    ["build", "Build a block"],
    ["twins", "Sound twins"],
    ["words", "Read words"],
  ];
  return (
    <View style={{ gap: 18 }}>
      <Reveal>
        <View style={{ gap: 8 }}>
          <Tag color={C.yellow}>HANGUL LAB</Tag>
          <Text accessibilityRole="header" style={s.h2}>
            Every Korean syllable is a little building.
          </Text>
          <Text style={s.body}>
            Learn how the vowels are drawn, stack letters into blocks, train
            your eye on sounds that look alike, and read real words.
          </Text>
        </View>
      </Reveal>
      <MixUps progress={progress} />
      <View style={[s.row, { flexWrap: "wrap", gap: 8 }]} accessibilityRole="tablist">
        {tabs.map(([id, label]) => (
          <Chip key={id} label={label} active={tab === id} onPress={() => setTab(id)} />
        ))}
      </View>
      {tab === "vowels" ? (
        <Vowels />
      ) : tab === "build" ? (
        <Builder />
      ) : tab === "twins" ? (
        <Twins key="twins" progress={progress} onAttempt={onAttempt} />
      ) : (
        <Words key="words" progress={progress} onAttempt={onAttempt} />
      )}
      <Button secondary onPress={onBack}>
        Back to the picture story
      </Button>
    </View>
  );
}

function MixUps({ progress }: { progress: Progress }) {
  const counts = new Map<string, { truth: string; chose: string; n: number }>();
  for (const a of progress.attempts ?? [])
    if (a.conceptId.startsWith("ko-") && !a.correct && a.chose && a.truth) {
      const key = a.truth + "→" + a.chose;
      const c = counts.get(key) ?? { truth: a.truth, chose: a.chose, n: 0 };
      counts.set(key, { ...c, n: c.n + 1 });
    }
  const top = [...counts.values()].filter((c) => c.n >= 2).sort((a, b) => b.n - a.n).slice(0, 3);
  if (!top.length) return null;
  return (
    <Card style={{ backgroundColor: "#FBEFE3", borderColor: "#EBCFB6", gap: 8 }}>
      <Tag color={C.peach}>YOUR MIX-UPS</Tag>
      {top.map((m) => {
        const twin = soundTwins.find((t) => t.set.includes(m.truth) && t.set.includes(m.chose));
        return (
          <View key={m.truth + m.chose} style={{ gap: 2 }}>
            <Text style={[s.body, { color: C.ink }]}>
              You read {m.truth} ({romanizeWord(m.truth)}) as {m.chose} ({romanizeWord(m.chose)}) {m.n} times.
            </Text>
            {twin && <Text style={s.small}>{twin.note}</Text>}
          </View>
        );
      })}
      <Text style={s.small}>These come back first in Sound twins and Read words.</Text>
    </Card>
  );
}

function Vowels() {
  const [pick, setPick] = useState(vowelLessons[2]);
  const withN = compose("ㄴ", pick.vowel);
  return (
    <View style={{ gap: 14 }}>
      <View style={[s.paper, { gap: 10 }]}>
        <Text style={s.label}>THREE STROKES MAKE EVERY VOWEL</Text>
        <Text style={s.body}>
          Hangul's vowels were designed from three symbols: a dot for heaven,
          a flat line for earth (ㅡ) and an upright line for a person (ㅣ).
          Today the dot is a short stroke. Where it sits changes the sound.
        </Text>
      </View>
      <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
        {vowelLessons.map((v) => (
          <Chip key={v.vowel} big label={v.vowel} accessibilityLabel={`${v.vowel}, ${v.sound}`} active={pick.vowel === v.vowel} onPress={() => setPick(v)} />
        ))}
      </View>
      <Reveal key={pick.vowel}>
        <Card style={{ gap: 10 }}>
          <View style={[s.row, { gap: 18 }]}>
            <Text style={{ fontSize: 64, lineHeight: 76, color: C.green }}>{pick.vowel}</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.h3}>“{pick.sound}”</Text>
              <Text style={s.small}>{pick.built}</Text>
            </View>
          </View>
          <Text style={[s.body, { color: C.ink }]}>{pick.cue}</Text>
          <Text style={s.small}>
            With ㄴ it becomes {withN} ({romanize(withN)}): the vowel sits{" "}
            {isVerticalVowel(pick.vowel) ? "to the right, because it's built on the upright ㅣ." : "underneath, because it's built on the flat ㅡ."}
          </Text>
          <VoicePractice key={pick.vowel} phrase={compose("ㅇ", pick.vowel)} listeningOnly />
        </Card>
      </Reveal>
    </View>
  );
}

function Slot({ jamo, color, flex = 1 }: { jamo: string; color: string; flex?: number }) {
  return (
    <View style={{ flex, minHeight: 58, borderRadius: 12, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30, color: C.ink }}>{jamo}</Text>
    </View>
  );
}

function Builder() {
  const [initial, setInitial] = useState("ㅎ");
  const [vowel, setVowel] = useState("ㅏ");
  const [final, setFinal] = useState("ㄴ");
  const block = compose(initial, vowel, final);
  const vertical = isVerticalVowel(vowel);
  return (
    <View style={{ gap: 14 }}>
      <Card style={{ alignItems: "center", gap: 12, backgroundColor: C.green, borderWidth: 0 }}>
        <Text style={{ fontSize: 96, lineHeight: 110, color: C.paper }} accessibilityLabel={`${block}, pronounced ${romanize(block)}`}>
          {block}
        </Text>
        <Text style={{ fontSize: 20, color: C.yellow, letterSpacing: 1 }}>{romanize(block)}</Text>
      </Card>
      <View style={[s.paper, { gap: 8 }]} accessibilityLabel="How the block stacks">
        <Text style={s.label}>HOW IT STACKS</Text>
        {vertical ? (
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Slot jamo={initial} color={C.sage} />
            <Slot jamo={vowel} color="#F4E6B8" />
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            <Slot jamo={initial} color={C.sage} />
            <Slot jamo={vowel} color="#F4E6B8" />
          </View>
        )}
        {final ? <Slot jamo={final} color={C.peach} /> : null}
        <Text style={s.small}>
          {vertical ? `${vowel} is built on the upright ㅣ, so it sits beside ${initial}.` : `${vowel} is built on the flat ㅡ, so it sits under ${initial}.`}
          {final ? ` The final consonant ${final} (batchim) always goes underneath and is said as “${romanize(compose("ㅇ", "ㅏ", final)).slice(1)}”.` : " Add a final consonant to see the bottom row."}
          {initial === "ㅇ" ? " At the start of a syllable ㅇ is silent; it just holds the place." : ""}
        </Text>
      </View>
      <Text style={s.label}>FIRST CONSONANT</Text>
      <View style={[s.row, { flexWrap: "wrap", gap: 6 }]}>
        {builderInitials.map((j) => (
          <Chip key={j} big label={j} active={initial === j} onPress={() => setInitial(j)} />
        ))}
      </View>
      <Text style={s.label}>VOWEL</Text>
      <View style={[s.row, { flexWrap: "wrap", gap: 6 }]}>
        {builderVowels.map((j) => (
          <Chip key={j} big label={j} active={vowel === j} onPress={() => setVowel(j)} />
        ))}
      </View>
      <Text style={s.label}>FINAL CONSONANT (OPTIONAL)</Text>
      <View style={[s.row, { flexWrap: "wrap", gap: 6 }]}>
        {builderFinals.map((j) => (
          <Chip key={j || "none"} big label={j || "—"} accessibilityLabel={j || "No final consonant"} active={final === j} onPress={() => setFinal(j)} />
        ))}
      </View>
      <VoicePractice key={block} phrase={block} listeningOnly />
    </View>
  );
}

function useQueue<T>(items: T[], idOf: (t: T) => string, progress: Progress, size: number) {
  const [queue] = useState(() => {
    const due = new Set(dueIds(progress));
    const first = shuffle(items.filter((t) => due.has(idOf(t))));
    const rest = shuffle(items.filter((t) => !due.has(idOf(t))));
    return [...first, ...rest].slice(0, size);
  });
  return queue;
}

function Round<T>({
  queue,
  render,
}: {
  queue: T[];
  render: (item: T, next: () => void) => React.ReactNode;
}) {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  if (done || i >= queue.length)
    return (
      <Card style={{ backgroundColor: C.sage, alignItems: "flex-start" }}>
        <Text style={s.h3}>Round complete.</Text>
        <Text style={s.body}>Each answer is scheduled for review; the ones you missed come back first.</Text>
      </Card>
    );
  return (
    <View style={{ gap: 10 }}>
      <Tag>
        {i + 1} / {queue.length}
      </Tag>
      {render(queue[i], () => (i + 1 >= queue.length ? setDone(true) : setI(i + 1)))}
    </View>
  );
}

function Twins({ progress, onAttempt }: { progress: Progress; onAttempt: Log }) {
  const items = soundTwins.flatMap((t) => t.set.map((syllable) => ({ syllable, twin: t })));
  const queue = useQueue(items, (x) => "ko-" + x.syllable, progress, 8);
  return (
    <Round
      queue={queue}
      render={(item, next) => <TwinQuestion key={item.syllable} {...item} onAttempt={onAttempt} next={next} />}
    />
  );
}

function TwinQuestion({
  syllable,
  twin,
  onAttempt,
  next,
}: {
  syllable: string;
  twin: (typeof soundTwins)[number];
  onAttempt: Log;
  next: () => void;
}) {
  const [choices] = useState(() => shuffle(twin.set));
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <Reveal>
      <Card style={{ gap: 12 }}>
        <Text style={s.label}>{twin.title}</Text>
        <Text style={s.h3}>Which one is “{romanize(syllable)}”?</Text>
        <View style={[s.row, { gap: 10 }]}>
          {choices.map((c) => (
            <View key={c} style={{ flex: 1 }}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={c}
                disabled={chosen !== null}
                onPress={() => {
                  setChosen(c);
                  const correct = c === syllable;
                  onAttempt({ conceptId: "ko-" + syllable, mode: "recall", correct, hinted: false, chose: correct ? undefined : c, truth: syllable });
                }}
                style={{
                  minHeight: 72,
                  borderRadius: 16,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: chosen && c === syllable ? C.green : chosen === c ? C.red : C.line,
                  backgroundColor: chosen && c === syllable ? C.sage : chosen === c ? "#FBEFE3" : C.white,
                }}
              >
                <Text style={{ fontSize: 34, color: C.ink }}>{c}</Text>
              </PressableScale>
            </View>
          ))}
        </View>
        {chosen && (
          <View style={{ gap: 8 }}>
            <Text accessibilityLiveRegion="polite" style={s.h3}>
              {chosen === syllable ? "Sharp eyes." : `That one is “${romanize(chosen)}”.`}
            </Text>
            <Text style={s.body}>{twin.note}</Text>
            <VoicePractice phrase={syllable} listeningOnly />
            <Button icon="arrow" onPress={next}>
              Next
            </Button>
          </View>
        )}
      </Card>
    </Reveal>
  );
}

function Words({ progress, onAttempt }: { progress: Progress; onAttempt: Log }) {
  const queue = useQueue(hangulWords, (w) => "ko-w-" + w.word, progress, 8);
  return (
    <Round
      queue={queue}
      render={(w, next) => <WordQuestion key={w.word} {...w} onAttempt={onAttempt} next={next} />}
    />
  );
}

function WordQuestion({ word, meaning, onAttempt, next }: { word: string; meaning: string; onAttempt: Log; next: () => void }) {
  const right = romanizeWord(word);
  const [choices] = useState(() =>
    shuffle([right, ...shuffle(hangulWords.map((w) => romanizeWord(w.word)).filter((r) => r !== right)).slice(0, 3)]),
  );
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <Reveal>
      <Card style={{ gap: 12 }}>
        <Text style={s.label}>READ IT ALOUD, THEN PICK THE SOUND</Text>
        <Text style={{ fontSize: 56, lineHeight: 66, color: C.green, textAlign: "center" }}>{word}</Text>
        <Text style={s.small}>
          {[...word].map((b) => {
            const d = decompose(b)!;
            return `${b} = ${d.initial} + ${d.vowel}${d.final ? " + " + d.final : ""}`;
          }).join("   ·   ")}
        </Text>
        {choices.map((c) => (
          <Button
            key={c}
            secondary={chosen !== c}
            disabled={chosen !== null}
            onPress={() => {
              setChosen(c);
              const correct = c === right;
              onAttempt({
                conceptId: "ko-w-" + word,
                mode: "recall",
                correct,
                hinted: false,
                chose: correct ? undefined : hangulWords.find((w) => romanizeWord(w.word) === c)?.word,
                truth: word,
              });
            }}
          >
            {c}
          </Button>
        ))}
        {chosen && (
          <View style={{ gap: 8 }}>
            <Text accessibilityLiveRegion="polite" style={s.h3}>
              {chosen === right ? `Yes: ${right}.` : `It's ${right}.`} It means “{meaning}”.
            </Text>
            <VoicePractice phrase={word} listeningOnly />
            <Button icon="arrow" onPress={next}>
              Next word
            </Button>
          </View>
        )}
      </Card>
    </Reveal>
  );
}

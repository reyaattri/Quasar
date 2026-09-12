import { vocabularyCues } from "../data/vocabularyCues";
import { Text } from "../components/ui";
import React, { useState } from "react";
import { Image, Linking, Pressable, View } from "react-native";
import { allFacts } from "../data/content";
import { recordReview, type Progress } from "../lib/progress";
import { Button, Card, C, s, Tag } from "../components/ui";
import { SuccessBurst } from "../components/SuccessBurst";
const cards = allFacts.filter((f) => f.sceneId === "market");
const jokes = vocabularyCues.map((cue) => cue.story);
const contexts = [
  {
    passage:
      "The research team lost access to its laboratory when a pipe burst. Within a week, the researchers had arranged temporary facilities and resumed their experiments. Their response to the disruption was notably _____.",
    choices: ["ephemeral", "resilient", "meticulous", "lucid"],
    answer: 1,
    explanation:
      "“Resilient” fits the recovery after a setback. The passage does not focus on short duration, careful attention to detail, or clarity of expression.",
  },
  {
    passage:
      "Rather than purchase an elaborate tracking system, the small library adapted a spreadsheet it already owned. The director favored this _____ approach because it met the library’s immediate needs within its limited budget.",
    choices: ["ambiguous", "elusive", "candid", "pragmatic"],
    answer: 3,
    explanation:
      "“Pragmatic” describes a practical solution suited to the budget and immediate needs. The other choices refer to unclear meaning, difficulty finding something, or frankness.",
  },
];
export function SatCourse({
  progress,
  onChange,
}: {
  progress: Progress;
  onChange: React.Dispatch<React.SetStateAction<Progress>>;
}) {
  const session = progress.satSession ?? {
    index: 0,
    phase: "learn" as const,
    batches: [],
  };
  const [hidden, setHidden] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const width = 168;
  const [contextChoice, setContextChoice] = useState<number | null>(null);
  const index = Math.min(session.index, cards.length - 1),
    fact = cards[index];
  const batch = index < 5 ? 0 : 1;
  const update = (next: typeof session) =>
    onChange((old) => ({ ...old, satSession: next }));
  const nextCard = () => {
    update({
      ...session,
      index,
      phase: (index + 1) % 5 === 0 ? "context" : "learn",
      ...((index + 1) % 5 ? { index: index + 1 } : {}),
    });
    setHidden(false);
    setSelected(null);
    setContextChoice(null);
  };
  if (session.phase === "done")
    return (
      <Card style={{ backgroundColor: C.sage }}>
        <Tag>TEN WORDS · TWO CONTEXTS</Tag>
        <Text style={s.title}>That’s a good day for your vocabulary.</Text>
        <Text style={s.body}>
          You practised ten words and applied them in context. Your recall
          answers are saved in spaced review; missed words will return sooner.
        </Text>
        <Button
          onPress={() => {
            update({ index: 0, phase: "learn", batches: [] });
            setHidden(false);
            setSelected(null);
          }}
        >
          Practise the deck again
        </Button>
      </Card>
    );
  if (session.phase === "context") {
    const question = contexts[batch];
    return (
      <View style={{ gap: 20 }}>
        <Tag color={C.yellow}>FIVE WORDS LATER…</Tag>
        <Text style={s.title}>Now use the meaning.</Text>
        <Text style={s.small}>
          Original digital-SAT-style practice · not an official or released 2026
          exam question
        </Text>
        <View
          style={{
            gap: 10,
            padding: 16,
            backgroundColor: C.sage,
            borderRadius: 8,
          }}
        >
          <Text style={s.h3}>Work with official SAT questions</Text>
          <Text style={s.body}>
            Open College Board’s question bank for real practice questions. The
            bank does not establish that a question appeared on a 2026 exam.
          </Text>{" "}
          <Button
            secondary
            onPress={() =>
              Linking.openURL(
                "https://satsuiteeducatorquestionbank.collegeboard.org/",
              )
            }
          >
            Official College Board practice ↗
          </Button>
        </View>
        <Card>
          <Text style={s.body}>{question.passage}</Text>
          <Text style={s.h3}>
            Which choice completes the text with the most logical and precise
            word?
          </Text>
          {question.choices.map((choice, i) => (
            <Button
              key={choice}
              secondary={contextChoice !== i}
              disabled={contextChoice !== null}
              onPress={() => setContextChoice(i)}
            >
              {String.fromCharCode(65 + i)}. {choice}
            </Button>
          ))}
          {contextChoice !== null && (
            <>
              {contextChoice === question.answer && <SuccessBurst />}
              <Text accessibilityLiveRegion="polite" style={s.h3}>
                {contextChoice === question.answer
                  ? "Context cracked!"
                  : "Let’s look at the context."}
              </Text>
              <Text style={s.body}>{question.explanation}</Text>
              <Button
                onPress={() => {
                  update({
                    index: batch === 0 ? 5 : 9,
                    phase: batch === 0 ? "learn" : "done",
                    batches: Array.from(new Set([...session.batches, batch])),
                  });
                  setContextChoice(null);
                  setHidden(false);
                  setSelected(null);
                }}
              >
                {batch === 0 ? "Learn the next five words" : "Finish session"}
              </Button>
            </>
          )}
        </Card>
      </View>
    );
  }
  return (
    <View style={{ gap: 20 }}>
      <View style={s.between}>
        <Tag color={C.peach}>WORDS WITH A PUNCHLINE</Tag>
        <Text style={s.label}>{(index % 5) + 1} / 5</Text>
      </View>
      <Text style={s.title}>
        {hidden ? "Picture it. Recall it." : fact.word}
      </Text>
      <View style={[s.progress, { height: 8 }]}>
        <View
          style={{
            height: "100%",
            width: `${((index % 5) + 1) * 20}%`,
            backgroundColor: C.green,
          }}
        />
      </View>
      <Card
        style={{
          backgroundColor: "#FFFCF0",
          borderRadius: 5,
          borderWidth: 2,
          borderColor: C.ink,
        }}
      >
        {!hidden ? (
          <>
            <Text style={s.label}>{vocabularyCues[index].pronunciation}</Text>
            <Tag color={index % 2 ? C.peach : C.yellow}>
              {vocabularyCues[index].type}
            </Tag>
            <Text style={s.h2}>{vocabularyCues[index].hook}</Text>
            <View
              style={{
                alignSelf: "center",
                width,
                height: (width * 5) / 3,
                overflow: "hidden",
                borderRadius: 18,
              }}
            >
              <Image
                resizeMode="stretch"
                accessibilityLabel={jokes[index]}
                source={
                  index === 5
                    ? require("../../assets/sat-cartoons-user-selected.png")
                    : index === 1
                      ? require("../../assets/sat-ink-cartoons.png")
                      : require("../../assets/sat-latest-selected.png")
                }
                style={{
                  position: "absolute",
                  width: width * 5,
                  height: (width * 10) / 3,
                  left: -(index % 5) * width,
                  top: (-Math.floor(index / 5) * width * 5) / 3,
                }}
              />
            </View>
            <Text style={[s.h3, { textAlign: "center" }]}>
              {vocabularyCues[index].caption}
            </Text>
            <Text style={s.label}>{fact.definition}</Text>
            <Text style={s.body}>{jokes[index]}</Text>
            <Text style={s.small}>
              Sound hooks are approximate reminders, not pronunciations. Say the
              word correctly, picture the action, then explain its meaning.
            </Text>
            <Button onPress={() => setHidden(true)}>
              Hide card & test recall
            </Button>
          </>
        ) : (
          <>
            <Text style={s.h3}>{fact.question}</Text>
            {fact.choices.map((choice, i) => (
              <Button
                key={choice}
                secondary={selected !== i}
                disabled={selected !== null}
                onPress={() => {
                  setSelected(i);
                  onChange((old) =>
                    recordReview(old, fact.id, i === fact.answer),
                  );
                }}
              >
                {choice}
              </Button>
            ))}
            {selected !== null && (
              <>
                <Text accessibilityLiveRegion="polite" style={s.h3}>
                  {selected === fact.answer
                    ? "You’ve got it."
                    : "A useful second look."}
                </Text>
                <Text style={s.body}>{fact.explanation}</Text>
                <Button onPress={nextCard}>
                  {(index + 1) % 5 === 0
                    ? "Try the context challenge"
                    : "Next word"}
                </Button>
              </>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setHidden(false);
              }}
            >
              <Text style={s.link}>Look at the illustration again</Text>
            </Pressable>
          </>
        )}
      </Card>
      <Text style={s.small}>
        Batch {batch + 1} of 2 · Five illustrated words, then one context
        challenge.
      </Text>
    </View>
  );
}

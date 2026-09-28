import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Button, C, Field, s, Tag, Text } from "../components/ui";
import { Confetti } from "../components/Reveal";
import { VoicePractice } from "../components/VoicePractice";
import { dueIds, type Attempt, type Progress } from "../lib/progress";

const lessons = [
  {
    id: "hello",
    place: "The neighbourhood gate",
    phrase: "안녕하세요",
    meaning: "Hello.",
    reading: "an-nyeong-ha-se-yo",
    parts: ["안녕하세요"],
    gloss: ["a polite greeting"],
    cue: "A sleepy gate bows so deeply that its roof almost touches its shoes. Every neighbour greets the bowing gate.",
    rule: "Use this polite greeting with someone you meet. Learn it as one complete expression.",
    transfer: "A new neighbour arrives. Greet them politely.",
  },
  {
    id: "student",
    place: "The tiny bookshop",
    phrase: "저는 학생이에요",
    meaning: "I am a student.",
    reading: "jeo-neun hak-saeng-i-e-yo",
    parts: ["저는", "학생이에요"],
    gloss: ["as for me", "am a student"],
    cue: "A student’s backpack introduces itself before the student gets a word in. It taps its chest, then opens into a desk.",
    rule: "저 is polite ‘I’. 는 marks the topic. 학생 means student. After a noun ending in a consonant, 이에요 means ‘am/is/are’ in polite conversation.",
    transfer: "Introduce yourself as a student at the bookshop.",
  },
  {
    id: "water",
    place: "The thirsty café",
    phrase: "물 주세요",
    meaning: "Water, please.",
    reading: "mul ju-se-yo",
    parts: ["물", "주세요"],
    gloss: ["water", "please give me"],
    cue: "A tiny teacup lifts a swimming pool over the counter. It only wanted a little water. The thing you want comes first; the polite request follows.",
    rule: "Put what you want before 주세요. 물 means water. You can reuse the same request with a different item.",
    transfer: "You are thirsty in a café. Ask for water politely.",
  },
  {
    id: "coffee",
    place: "The overexcited café",
    phrase: "커피 주세요",
    meaning: "Coffee, please.",
    reading: "keo-pi ju-se-yo",
    parts: ["커피", "주세요"],
    gloss: ["coffee", "please give me"],
    cue: "The teacup returns on roller skates after one coffee. Keep 주세요; swap only the drink at the front.",
    rule: "커피 means coffee. Replacing 물 with 커피 changes your request while keeping the same polite sentence frame.",
    transfer: "Now order coffee instead of water.",
  },
  {
    id: "book",
    place: "The bookshop counter",
    phrase: "책이 있어요",
    meaning: "There is a book. / I have a book.",
    reading: "chae-gi i-sseo-yo",
    parts: ["책이", "있어요"],
    gloss: ["a book + subject marker", "exists / is here"],
    cue: "A book stands on the counter waving both covers: ‘I’m here!’ The book comes first and its existence is announced last.",
    rule: "책 means book. 이 marks the subject after a consonant. 있어요 says something exists or is available; context can make this ‘I have a book’. Listen for 책이 linking as chae-gi.",
    transfer: "Tell the shopkeeper that a book is here.",
  },
  {
    id: "thanks",
    place: "Under the blossoms",
    phrase: "감사합니다",
    meaning: "Thank you.",
    reading: "gam-sa-ham-ni-da",
    parts: ["감사합니다"],
    gloss: ["a polite expression of thanks"],
    cue: "The bowing gate lends the teacup an umbrella. The cup bows back so carefully it does not spill a drop.",
    rule: "This is a respectful way to say thank you. Learn the whole phrase by listening. The written ㅂ in 합니다 is pronounced like m before ㄴ.",
    transfer: "Someone helps you carry your books. Thank them politely.",
  },
];
const normal = (s: string) => s.normalize("NFC").replace(/[\s.!?。！？]/g, "");

export function KoreanSentences({
  progress,
  onAttempt,
}: {
  progress: Progress;
  onAttempt: (a: Omit<Attempt, "at">) => void;
}) {
  const [queue, setQueue] = useState<number[] | null>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"learn" | "build" | "recall" | "done">(
    "learn",
  );
  const [tiles, setTiles] = useState<number[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [hinted, setHinted] = useState(false);
  const due = new Set(dueIds(progress));
  const review = lessons.flatMap((l, i) =>
    due.has(`ko-sentence-${l.id}`) ? [i] : [],
  );
  const start = (items: number[], recall = false) => {
    setQueue(items);
    setStep(0);
    setPhase(recall ? "recall" : "learn");
    setTiles([]);
    setAnswer("");
    setFeedback("");
    setChecked(false);
    setHinted(false);
  };
  if (!queue)
    return (
      <View style={{ gap: 16 }}>
        <Image
          source={require("../../assets/korean-bowing-gate.png")}
          resizeMode="contain"
          style={{ width: "100%", height: 230 }}
        />
        <Text style={s.h2}>
          A little neighbourhood. Your first conversations.
        </Text>
        <Text style={s.body}>
          Meet a bowing gate, a thirsty teacup and a very loud book. Listen,
          build a sentence, then say it from memory.
        </Text>
        <Button onPress={() => start(lessons.map((_, i) => i))}>
          Walk the six-stop sentence trail
        </Button>
        {review.length > 0 && (
          <Button secondary onPress={() => start(review, true)}>
            Recall {review.length} sentences due today
          </Button>
        )}
        <View style={{ gap: 8 }}>
          {lessons.map((l, i) => (
            <Pressable
              key={l.id}
              accessibilityRole="button"
              onPress={() => start([i])}
              style={[
                s.paper,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: "#A8C3BB",
                  padding: 16,
                  gap: 5,
                },
              ]}
            >
              <Text style={s.small}>
                {String(i + 1).padStart(2, "0")} · {l.place}
              </Text>
              <Text style={[s.h3, { fontSize: 24 }]}>{l.phrase}</Text>
              <Text style={s.small}>{l.meaning}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  if (phase === "done")
    return (
      <View
        style={[
          s.paper,
          { gap: 16, borderTopWidth: 4, borderTopColor: "#DDA4B5" },
        ]}
      >
        <Confetti blossom />
        <Text style={{ fontSize: 34, color: "#315D55" }}>잘했어요!</Text>
        <Text style={s.h2}>Your words have somewhere to live.</Text>
        <Text style={s.body}>
          You recalled {queue.length} expressions. Your answers are saved for
          spaced review. Come back to this trail when they are due.
        </Text>
        <Button onPress={() => setQueue(null)}>
          Back to the neighbourhood
        </Button>
      </View>
    );
  const l = lessons[queue[step]];
  const submit = () => {
    const correct = normal(answer) === normal(l.phrase);
    onAttempt({
      conceptId: `ko-sentence-${l.id}`,
      mode: "recall",
      correct,
      hinted,
      chose: answer,
      truth: l.phrase,
    });
    setChecked(correct);
    setFeedback(
      correct
        ? "That’s it. Say the whole sentence once."
        : "Not quite. Try once more, or revisit the memory scene.",
    );
    if (!correct) setHinted(true);
  };
  return (
    <View style={{ gap: 16 }}>
      <View style={s.between}>
        <Tag color="#F3D8E1">
          STOP {step + 1} / {queue.length}
        </Tag>
        <Pressable accessibilityRole="button" onPress={() => setQueue(null)}>
          <Text style={s.link}>All stops</Text>
        </Pressable>
      </View>
      <Text style={s.h2}>{l.place}</Text>
      <View
        style={[
          s.paper,
          {
            gap: 16,
            borderTopWidth: 4,
            borderTopColor: "#315D55",
            backgroundColor: "#FCF7EF",
          },
        ]}
      >
        {phase === "learn" ? (
          <>
            <Text style={{ fontSize: 32, lineHeight: 44, color: "#315D55" }}>
              {l.phrase}
            </Text>
            <Text style={s.h3}>{l.meaning}</Text>
            <Text style={s.small}>{l.reading} · listening guide</Text>
            <VoicePractice key={l.id} phrase={l.phrase} listeningOnly />
            <View
              style={{
                padding: 16,
                backgroundColor: "#F4E4DF",
                borderRadius: 16,
                gap: 6,
              }}
            >
              <Text style={s.label}>THE MEMORY SCENE</Text>
              <Text style={s.body}>{l.cue}</Text>
            </View>
            <Text style={s.body}>{l.rule}</Text>
            {l.parts.map((part, i) => (
              <View key={part} style={s.between}>
                <Text style={s.h3}>{part}</Text>
                <Text
                  style={[
                    s.small,
                    { flex: 1, textAlign: "right", marginLeft: 12 },
                  ]}
                >
                  {l.gloss[i]}
                </Text>
              </View>
            ))}
            <Button
              onPress={() => {
                setTiles([]);
                setPhase("build");
              }}
            >
              Build it yourself
            </Button>
          </>
        ) : phase === "build" ? (
          <>
            <Text style={s.h3}>{l.meaning}</Text>
            <Text style={s.body}>
              Tap the pieces in spoken order. Tap a placed piece to remove it.
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                minHeight: 62,
                borderBottomWidth: 2,
                borderBottomColor: "#A8C3BB",
              }}
            >
              {tiles.map((n, i) => (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  onPress={() => setTiles(tiles.filter((_, j) => j !== i))}
                  style={{
                    padding: 12,
                    backgroundColor: "#DDEAE5",
                    borderRadius: 8,
                  }}
                >
                  <Text style={s.h3}>{l.parts[n]}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {l.parts
                .map((_, i) => l.parts.length - 1 - i)
                .filter((i) => !tiles.includes(i))
                .map((i) => (
                  <Button
                    secondary
                    key={i}
                    onPress={() => setTiles([...tiles, i])}
                  >
                    {l.parts[i]}
                  </Button>
                ))}
            </View>
            {tiles.length === l.parts.length &&
              (tiles.every((v, i) => v === i) ? (
                <Button
                  onPress={() => {
                    setPhase("recall");
                    setAnswer("");
                    setFeedback("");
                  }}
                >
                  Put the sentence away
                </Button>
              ) : (
                <Text style={s.body}>
                  Try the other order. The request or description usually comes
                  at the end.
                </Text>
              ))}
          </>
        ) : (
          <>
            <Text style={s.h3}>{l.transfer}</Text>
            <Field
              label="Write the Korean from memory"
              value={answer}
              onChangeText={setAnswer}
            />
            {!checked && (
              <Button disabled={!answer.trim()} onPress={submit}>
                Check my sentence
              </Button>
            )}
            {!!feedback && (
              <Text accessibilityLiveRegion="polite" style={s.body}>
                {feedback}
              </Text>
            )}
            {hinted && !checked && (
              <>
                <Button
                  secondary
                  onPress={() => {
                    setFeedback("");
                    setPhase("learn");
                  }}
                >
                  Revisit the memory scene
                </Button>
              </>
            )}
            {checked && (
              <>
                <Confetti blossom />
                <VoicePractice phrase={l.phrase} />
                <Button
                  onPress={() => {
                    if (step === queue.length - 1) setPhase("done");
                    else {
                      setStep(step + 1);
                      setPhase("learn");
                      setTiles([]);
                      setAnswer("");
                      setFeedback("");
                      setChecked(false);
                      setHinted(false);
                    }
                  }}
                >
                  {" "}
                  {step === queue.length - 1
                    ? "Finish the trail"
                    : "Walk to the next stop"}
                </Button>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

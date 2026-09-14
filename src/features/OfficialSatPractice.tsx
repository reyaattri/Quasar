import React, { useState } from "react";
import { Linking, View } from "react-native";
import { Button, Card, C, s, Tag, Text } from "../components/ui";
import { SuccessBurst } from "../components/SuccessBurst";
const source =
  "https://satsuite.collegeboard.org/media/pdf/sat-practice-test-9-digital.pdf#page=4";
const answers =
  "https://satsuite.collegeboard.org/media/pdf/sat-practice-test-9-answers-digital.pdf";
const questions = [
  {
    number: 1,
    title: "A gallery’s arrangement",
    answer: 0,
    explain:
      "The clue is how the display helps visitors identify paintings. Read the word as a description of the display’s organisation, not a date or a discussion.",
  },
  {
    number: 2,
    title: "Unpredictable ocean power",
    answer: 3,
    explain:
      "Track the negative before the blank. The changing waves lack steadiness; a word about cost or confidence does not explain that variation.",
  },
  {
    number: 3,
    title: "Difficult poetry",
    answer: 2,
    explain:
      "Identify whose difficulty matters: the readers are trying to understand the poems. Writing a poem is a different task from understanding one.",
  },
];
export function OfficialSatPractice() {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [read, setRead] = useState(false);
  const q = questions[index];
  return (
    <Card style={{ gap: 14, backgroundColor: C.sage }}>
      <Tag>THREE OFFICIAL QUESTIONS</Tag>
      <Text style={s.h2}>Try the real thing.</Text>
      <Text style={s.body}>
        College Board Practice Test 9 · Reading and Writing, Module 1, questions
        1–3. These are published practice questions, not claimed to be questions
        from a 2026 exam.
      </Text>
      {!open ? (
        <Button secondary onPress={() => setOpen(true)}>
          Start three official SAT questions
        </Button>
      ) : (
        <>
          <Text style={s.h3}>
            {index + 1} / 3 · {q.title}
          </Text>
          <Text style={s.body}>
            Open the official PDF at page 4 (printed page 2), read question{" "}
            {q.number} and its choices, then return here to answer. The original
            passage stays in College Board’s document.
          </Text>
          <Button secondary onPress={() => Linking.openURL(source)}>
            Read official question {q.number} ↗
          </Button>
          {!read ? (
            <Button onPress={() => setRead(true)}>
              I’ve read the official question
            </Button>
          ) : (
            <>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {["A", "B", "C", "D"].map((letter, i) => (
                  <Button
                    key={letter}
                    secondary
                    disabled={choice === q.answer}
                    onPress={() => setChoice(i)}
                  >
                    Answer {letter}
                  </Button>
                ))}
              </View>
              {choice !== null && (
                <>
                  <Text accessibilityLiveRegion="polite" style={s.body}>
                    {choice === q.answer ? "Correct. " : "Try again. "}
                    {q.explain}
                  </Text>
                  {choice === q.answer && (
                    <>
                      <SuccessBurst label="Official context cracked!" />
                      {index < 2 ? (
                        <Button
                          onPress={() => {
                            setIndex(index + 1);
                            setChoice(null);
                            setRead(false);
                          }}
                        >
                          Next official question
                        </Button>
                      ) : (
                        <Text style={s.h3}>
                          Three contexts completed. You tracked the evidence,
                          not just a familiar word.
                        </Text>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          <Button secondary onPress={() => Linking.openURL(answers)}>
            College Board’s answer explanations ↗
          </Button>
        </>
      )}
    </Card>
  );
}

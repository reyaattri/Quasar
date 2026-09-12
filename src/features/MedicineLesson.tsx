import React, { useState } from "react";
import { Image, Linking, View } from "react-native";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { EncounterMotion } from "../components/EncounterMotion";
import { MedicalStudio } from "../components/MedicalStudio";
const lessons = [
  {
    title: "The germs are not on the list",
    concept: "Physical barriers",
    cue: "Skin keeps the gate-crashers OUT.",
    explanation:
      "Intact skin forms a physical barrier that helps prevent microbes from entering the body. The wall is a memory symbol for that barrier.",
    question: "What does the closed wall represent?",
    choices: [
      "A physical barrier to entry",
      "An antibody matching an antigen",
      "A cell engulfing a microbe",
    ],
    correct: 0,
  },
  {
    title: "The cell with a lunch plan",
    concept: "Phagocytosis",
    cue: "PHAGO = eat. CYTE = cell. Wrap, engulf, digest.",
    explanation:
      "Phagocytes such as macrophages can engulf and break down microbes. Picture the cell wrapping its membrane around the germ, enclosing it and digesting it. The chef helps you remember cell-eating; real cells do not have mouths or kitchen tools.",
    question: "Which action best matches phagocytosis?",
    choices: [
      "Producing a skin barrier",
      "Engulfing a microbe",
      "Recognizing every molecule identically",
    ],
    correct: 1,
  },
  {
    title: "A very picky Y",
    concept: "Antibody specificity",
    cue: "Two matching tips. One particular target.",
    explanation:
      "Antibodies bind to particular targets called antigens. Picture two tips with the same fitting shape: the matching target binds and the wrong shape does not. This recalls specificity; it is a simplified metaphor, not a molecular model.",
    question: "What does the matching tool help you recall?",
    choices: [
      "Antibodies bind all targets equally",
      "Skin produces every antibody",
      "Antibodies recognize particular targets",
    ],
    correct: 2,
  },
];
export function MedicineLesson({
  recalled,
  onRecall,
}: {
  recalled: number[];
  onRecall: (index: number, correct: boolean) => void;
}) {
  const [index, setIndex] = useState(0),
    [quiz, setQuiz] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  const lesson = lessons[index];
  return (
    <View style={{ gap: 20 }}>
      <Tag color={C.peach}>MEDICAL FOUNDATIONS · IMMUNITY</Tag>
      <Text style={s.title}>Inside the immunity club.</Text>
      <Text style={s.body}>
        Three linked symbols. Learn what each represents, then recall the
        biology with the scene hidden.
      </Text>
      <Card
        style={{
          borderRadius: 8,
          borderWidth: 2,
          borderColor: C.green,
          backgroundColor: "#F5EDDD",
        }}
      >
        <Text style={s.label}>STOP {index + 1} OF 3</Text>
        <Text style={s.h2}>{quiz ? "Recall the biology" : lesson.title}</Text>
        {!quiz ? (
          <>
            <EncounterMotion variant={index}>
              <View
                style={{
                  width: 156,
                  height: 312,
                  overflow: "hidden",
                  alignSelf: "center",
                }}
              >
                <Image
                  resizeMode="stretch"
                  accessibilityLabel={lesson.cue}
                  source={require("../../assets/medical-hooks.png")}
                  style={{
                    position: "absolute",
                    width: 468,
                    height: 312,
                    left: -index * 156,
                  }}
                />
              </View>
            </EncounterMotion>
            <Text style={s.h3}>{lesson.concept}</Text>
            <Text style={s.label}>{lesson.cue}</Text>
            <Text style={s.body}>{lesson.explanation}</Text>
            <Button onPress={() => setQuiz(true)}>Hide scene & recall</Button>
          </>
        ) : (
          <>
            <Text style={s.h3}>{lesson.question}</Text>
            {lesson.choices.map((choice, i) => (
              <Button
                key={choice}
                secondary={answer !== i}
                disabled={answer !== null}
                onPress={() => {
                  setAnswer(i);
                  onRecall(index, i === lesson.correct);
                }}
              >
                {choice}
              </Button>
            ))}
            {answer !== null && (
              <>
                <Text accessibilityLiveRegion="polite" style={s.label}>
                  {answer === lesson.correct
                    ? "Correct. Connect the symbol back to the biology."
                    : "Review the symbol and its meaning."}
                </Text>
                <Text style={s.body}>{lesson.explanation}</Text>
                <Button
                  onPress={() => {
                    setIndex((index + 1) % 3);
                    setQuiz(false);
                    setAnswer(null);
                  }}
                >
                  {index === 2 ? "Revisit the harbor" : "Next scene"}
                </Button>
              </>
            )}
          </>
        )}
      </Card>
      <Text style={s.label}>{recalled.length} of 3 concepts recalled</Text>
      <MedicalStudio concept={index} />
      <Text style={s.small}>
        A foundation lesson, not a complete medical course. These scenes are
        memory metaphors.
      </Text>
      <Button
        secondary
        onPress={() =>
          Linking.openURL(
            "https://nigms.nih.gov/biobeat/2023/12/what-is-the-immune-system",
          )
        }
      >
        Read the NIH explanation ↗
      </Button>
    </View>
  );
}

import React, { useState } from "react";
import { Image, Linking, View } from "react-native";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { EncounterMotion } from "../components/EncounterMotion";
import { MedicalStudio } from "../components/MedicalStudio";
import { SuccessBurst } from "../components/SuccessBurst";

const lessons = [
  {
    artIndex: 4,
    modelIndex: 1,
    title: "The complement demolition crew",
    concept: "Complement cascade",
    cue: "TAG it, CALL help, PUNCH the membrane.",
    explanation:
      "Complement is a network of plasma proteins activated in a cascade. Imagine blue domino-workers: C3b paints a bright target tag (opsonization), C3a and C5a pull a fire alarm (inflammation and chemotaxis), and C5b–C9 assemble a circular membrane attack complex. The three verbs preserve the major outcomes: tag, call, punch.",
    question: "Which sequence best retrieves the three complement outcomes?",
    choices: [
      "Tag microbes, recruit inflammation, form a membrane pore",
      "Make antibodies, build skin, digest every cell",
      "Stop signaling, close vessels, erase memory",
    ],
    correct: 0,
  },
  {
    artIndex: 5,
    modelIndex: 2,
    title: "The antibody tailoring academy",
    concept: "B-cell maturation and memory",
    cue: "TEST the key, TAILOR the handle, FILE the winner.",
    explanation:
      "In a germinal center, activated B cells mutate antibody variable regions and higher-affinity clones are selected. Class-switch recombination changes the antibody constant region while preserving antigen specificity. Some descendants become plasma cells; others become memory B cells. Picture a picky librarian testing keys, tailoring each key's handle, then filing the winning design.",
    question: "During class switching, what stays aimed at the same antigen?",
    choices: [
      "The antibody's antigen specificity",
      "The constant region only",
      "The entire B-cell population size",
    ],
    correct: 0,
  },
];

export function MedicineLesson({
  recalled,
  onRecall,
}: {
  recalled: number[];
  onRecall: (index: number, correct: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [quiz, setQuiz] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [caseMode, setCaseMode] = useState(false);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const lesson = lessons[index];
  if (caseMode)
    return (
      <ClinicalCase
        answer={caseAnswer}
        setAnswer={setCaseAnswer}
        onBack={() => {
          setCaseMode(false);
          setIndex(1);
          setQuiz(false);
          setAnswer(null);
        }}
      />
    );
  return (
    <View style={{ gap: 20 }}>
      <Tag color={C.peach}>MEDICAL FOUNDATIONS · IMMUNITY</Tag>
      <Text style={s.title}>Inside the immunity club.</Text>
      <Text style={s.body}>
        Two advanced stories for now. Each scene turns a multi-step immune
        mechanism into an ordered action you can replay.
      </Text>
      <Card
        style={{
          borderRadius: 22,
          borderWidth: 2,
          borderColor: C.green,
          backgroundColor: "#F5EDDD",
        }}
      >
        <Text style={s.label}>
          SCENE {index + 1} OF {lessons.length}
        </Text>
        <Text style={s.h2}>{quiz ? "Recall the biology" : lesson.title}</Text>
        {!quiz ? (
          <>
            <EncounterMotion variant={index}>
              <LessonPicture index={lesson.artIndex} cue={lesson.cue} />
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
                {answer === lesson.correct && (
                  <SuccessBurst label="Biology linked!" />
                )}
                <Text accessibilityLiveRegion="polite" style={s.label}>
                  {answer === lesson.correct
                    ? "Correct. Connect the symbol back to the biology."
                    : "Review the symbol and its meaning."}
                </Text>
                <Text style={s.body}>{lesson.explanation}</Text>
                <Button
                  onPress={() => {
                    if (index === lessons.length - 1) {
                      setCaseMode(true);
                      return;
                    }
                    setIndex(index + 1);
                    setQuiz(false);
                    setAnswer(null);
                  }}
                >
                  {index === lessons.length - 1
                    ? "Solve the patient case"
                    : "Next scene"}
                </Button>
              </>
            )}
          </>
        )}
      </Card>
      <Text style={s.label}>
        {new Set(recalled.filter((value) => value < lessons.length)).size} of{" "}
        {lessons.length} concepts recalled
      </Text>
      <MedicalStudio concept={lesson.modelIndex} />
      <Text style={s.small}>
        These scenes are memory metaphors for education. The sourced 3D anatomy
        is a reference model, not patient imaging.
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

function LessonPicture({ index, cue }: { index: number; cue: string }) {
  const size = 290;
  return (
    <View
      accessibilityLabel={cue}
      style={{
        width: "100%",
        maxWidth: size,
        height: size,
        overflow: "hidden",
        alignSelf: "center",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.ink,
      }}
    >
      <Image
        resizeMode="stretch"
        source={require("../../assets/medical-hooks-v2.png")}
        style={{
          position: "absolute",
          width: size * 3,
          height: size * 2,
          left: -(index % 3) * size,
          top: -Math.floor(index / 3) * size,
        }}
      />
    </View>
  );
}

function ClinicalCase({
  answer,
  setAnswer,
  onBack,
}: {
  answer: number | null;
  setAnswer: (answer: number) => void;
  onBack: () => void;
}) {
  const choices = [
    "X-linked agammaglobulinemia (XLA)",
    "A simple skin-barrier injury",
    "An isolated complement excess",
    "A normal vaccine response",
  ];
  return (
    <View style={{ gap: 18 }}>
      <Tag color={C.yellow}>CASE CONFERENCE</Tag>
      <Text style={s.title}>Why do the infections keep returning?</Text>
      <Card style={{ backgroundColor: "#E7DFEF", borderRadius: 28 }}>
        <Text style={s.label}>
          ADAPTED FROM A PHYSICIAN-AUTHORED OPEN-ACCESS CASE
        </Text>
        <Text style={s.h3}>
          A 21-year-old man has recurrent pneumonia and unusual skin infections.
          Tests show markedly low B-cell counts and low IgG, IgA, and IgM;
          T-cell measures are comparatively preserved.
        </Text>
        <Text style={s.body}>
          Use the tailoring academy: without mature B cells, the patient cannot
          build and preserve effective antibody responses. Which diagnosis best
          joins the clues?
        </Text>
        {choices.map((choice, i) => (
          <Button
            key={choice}
            secondary={answer !== i}
            disabled={answer !== null}
            onPress={() => setAnswer(i)}
          >
            {choice}
          </Button>
        ))}
      </Card>
      {answer !== null && (
        <Card style={{ backgroundColor: answer === 0 ? C.sage : C.peach }}>
          {answer === 0 && <SuccessBurst label="Case solved!" />}
          <Text accessibilityLiveRegion="polite" style={s.h2}>
            {answer === 0
              ? "The pattern points to XLA."
              : "Recheck the B-cell clue."}
          </Text>
          <Text style={s.body}>
            The reported patient had a BTK variant. XLA disrupts B-cell
            maturation, so immunoglobulins and effective antibody responses are
            low. The published case required clinical, laboratory, and genetic
            evaluation; this exercise only asks you to recognize the teaching
            pattern.
          </Text>
          <Button
            secondary
            onPress={() =>
              Linking.openURL(
                "https://pmc.ncbi.nlm.nih.gov/articles/PMC12900604/",
              )
            }
          >
            Read the source case ↗
          </Button>
          <Button onPress={onBack}>Return to the two stories</Button>
        </Card>
      )}
      <Text style={s.small}>
        Educational case practice only. It cannot diagnose a person or replace
        clinical judgment.
      </Text>
    </View>
  );
}

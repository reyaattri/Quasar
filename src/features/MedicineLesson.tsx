import React, { useState } from "react";
import { Image, Linking, View } from "react-native";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { MedicalStudio } from "../components/MedicalStudio";
import { SuccessBurst } from "../components/SuccessBurst";
import { medicalModules, type MedicalModule } from "../data/medicalLessons";
import { TranscriptionAct } from "./TranscriptionAct";
const sheets = [
  require("../../assets/medical-human-stories.png"),
  require("../../assets/medical-gene-theatre.png"),
  require("../../assets/medical-signal-circus.png"),
];
const pictureKeys = [
  [
    [
      "TARGET STICKER = C3b",
      "SCOOPING CLEANER = phagocyte",
      "STICKER MAKES SCOOPING EASIER = opsonization",
    ],
    [
      "TWO ALARMS = C3a and C5a",
      "SCENT TRAIL = chemotaxis",
      "C5a pulls neutrophils toward trouble",
    ],
    [
      "PIPE STARTER = C5b",
      "PIPE PIECES = C6, C7 and C8",
      "RING OF C9 = membrane attack pore",
    ],
    [
      "Y-SHAPED KEY = B-cell receptor",
      "FITTER KEY = higher affinity",
      "KEEPING THE BEST FIT = affinity maturation",
    ],
    [
      "KEY TIPS = antigen specificity",
      "NEW SLEEVE = constant region",
      "SAME TIPS, NEW JOB = class switching",
    ],
    [
      "PRINTER = plasma cell",
      "PRINTED KEYS = antibodies",
      "ARCHIVIST = memory B cell",
    ],
  ],
  [
    [
      "LOCKED DNA VAULT = chromatin",
      "DIRECTOR = transcription factors",
      "COPY MACHINE = RNA polymerase II",
    ],
    [
      "BOTTOM SCRIPT = template strand",
      "SCRIBE MOVES 3′ → 5′",
      "NEW RNA RIBBON GROWS 5′ → 3′",
    ],
    [
      "SCISSORS REMOVE = introns",
      "SEWN PIECES = exons",
      "CAP + BEAD TAIL protect processed mRNA",
    ],
    [
      "THEATRE DOOR = nuclear pore",
      "APPROVED SCRIPT = processed mRNA",
      "COURIER EXPORTS IT to cytoplasm",
    ],
    [
      "THREE LETTER TICKETS = codons",
      "BEAD COURIERS = tRNAs",
      "STAGE MACHINE = ribosome",
    ],
    [
      "BEAD CHAIN = polypeptide",
      "COACH = chaperone",
      "CORRECT SHAPE enables protein function",
    ],
  ],
  [
    [
      "LIGHTNING COURIER = action potential",
      "TIGHTROPE = motor axon",
      "ARRIVAL depolarizes nerve terminal",
    ],
    [
      "MARBLES = Ca²⁺",
      "GATE = voltage-gated calcium channel",
      "CALCIUM ARRIVAL triggers vesicle fusion",
    ],
    [
      "ENVELOPES = acetylcholine",
      "MAIL SACKS = vesicles",
      "RELEASE crosses the synaptic cleft",
    ],
    [
      "LOCK = nicotinic ACh receptor",
      "OPEN DOOR = cation channel",
      "END-PLATE depolarization starts muscle signal",
    ],
    [
      "ROPE = actin and myosin",
      "SECOND CALCIUM WAVE comes from muscle SR",
      "TROPONIN moves the blocking tropomyosin",
    ],
    [
      "CLEANER = acetylcholinesterase",
      "CALCIUM PUMP returns Ca²⁺ to SR",
      "CLEANUP lets the muscle relax",
    ],
  ],
];
function Picture({
  module,
  index,
  whole = false,
}: {
  module: number;
  index: number;
  whole?: boolean;
}) {
  const [width, setWidth] = useState(290);
  const row = index < 3 ? 0 : 1;
  // The circus sheet has a deliberately shorter upper row. Respect its actual panel edges.
  const y = module === 2 ? (row === 0 ? 0 : 470) : row * 512;
  const panelH = module === 2 ? (row === 0 ? 459 : 554) : 512;
  const scale = width / 512;
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{
        width: "100%",
        height: whole ? (width * 2) / 3 : panelH * scale,
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: C.paper,
      }}
      accessibilityLabel={
        whole
          ? "The complete linked lesson scene"
          : `Illustration for concept ${index + 1}`
      }
    >
      <Image
        source={sheets[module]}
        resizeMode="stretch"
        style={
          whole
            ? { width: "100%", height: "100%" }
            : {
                position: "absolute",
                width: width * 3,
                height: 1024 * scale,
                left: -(index % 3) * width,
                top: -y * scale,
              }
        }
      />
    </View>
  );
}
export function MedicineLesson({
  recalled,
  onRecall,
}: {
  recalled: number[];
  onRecall: (index: number, correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null),
    [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"cards" | "scene" | "recall" | "case">(
    "cards",
  );
  const [testing, setTesting] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]),
    [orderFeedback, setOrderFeedback] = useState("");
  const [actOpen, setActOpen] = useState(false);
  const start = (i: number) => {
    setSelected(i);
    setIndex(0);
    setPhase("cards");
    setTesting(false);
    setAnswer(null);
    setOrder([]);
    setOrderFeedback("");
  };
  if (selected === null)
    return (
      <View style={{ gap: 22 }}>
        <Tag color={C.peach}>THE BIOLOGY STUDIO</Tag>
        <Text style={s.title}>Big ideas. Unforgettable casts.</Text>
        <Text style={s.body}>
          Three guided lessons. Learn six concepts, connect their pictures into
          one scene, reconstruct the route, then solve a patient case.
        </Text>
        {medicalModules.map((lesson, i) => (
          <Card
            key={lesson.id}
            style={{
              backgroundColor: [C.sage, "#F1E1D0", "#E9DEF0"][i],
              borderRadius: 28,
              gap: 14,
            }}
          >
            <Tag>LESSON {i + 1} · 6 CONCEPTS</Tag>
            <Text style={s.h2}>{lesson.title}</Text>
            <Picture module={i} index={0} whole />
            <Text style={s.body}>{lesson.subtitle}</Text>
            <Text style={s.small}>
              {
                lesson.cards.filter((_, j) =>
                  recalled.includes(100 + i * 10 + j),
                ).length
              }
              /6 concepts recalled
            </Text>
            <Button onPress={() => start(i)}>
              Start {lesson.title.toLowerCase()}
            </Button>
          </Card>
        ))}
        <Button secondary onPress={() => setActOpen(!actOpen)}>
          {actOpen ? "Close the RNA detail lab" : "Open the RNA detail lab"}
        </Button>
        {actOpen && <TranscriptionAct />}
      </View>
    );
  const lesson = medicalModules[selected],
    card = lesson.cards[index];
  const back = (
    <Button secondary onPress={() => setSelected(null)}>
      All biology lessons
    </Button>
  );
  if (phase === "case")
    return (
      <View style={{ gap: 20 }}>
        {back}
        <PatientCase
          key={lesson.id}
          lesson={lesson}
          onBack={() => {
            setPhase("scene");
            setOrder([]);
            setOrderFeedback("");
          }}
        />
      </View>
    );
  if (phase === "scene" || phase === "recall")
    return (
      <View style={{ gap: 18 }}>
        {back}
        <Tag>LESSON {selected + 1} · CONNECT THE IDEAS</Tag>
        <Text style={s.title}>
          {phase === "scene"
            ? "One scene. Six connections."
            : "Rebuild the scene from memory."}
        </Text>
        {phase === "scene" ? (
          <>
            <Picture module={selected} index={0} whole />
            <Text style={s.body}>{lesson.scene}</Text>
            {lesson.cards.map((c, i) => (
              <Text key={c.title} style={s.label}>
                {i + 1}. {c.title}
              </Text>
            ))}
            <Button
              onPress={() => {
                setPhase("recall");
                setOrder([]);
                setOrderFeedback("");
              }}
            >
              Hide scene & recall the route
            </Button>
          </>
        ) : (
          <>
            <Text style={s.body}>
              Tap the six concept titles in the order you visited them. This is
              your memory route, not a claim that every biological process
              follows one strict timeline.
            </Text>
            <Card style={{ backgroundColor: C.sage }}>
              <Text style={s.label}>{order.length}/6 PLACED</Text>
              {order.map((n, i) => (
                <Text key={n} style={s.body}>
                  {i + 1}. {lesson.cards[n].title}
                </Text>
              ))}
            </Card>
            {[3, 0, 5, 1, 4, 2]
              .filter((n) => !order.includes(n))
              .map((n) => (
                <Button
                  key={n}
                  secondary
                  onPress={() => {
                    setOrder([...order, n]);
                    setOrderFeedback("");
                  }}
                >
                  {lesson.cards[n].title}
                </Button>
              ))}
            <Button
              secondary
              disabled={!order.length}
              onPress={() => {
                setOrder(order.slice(0, -1));
                setOrderFeedback("");
              }}
            >
              Undo last choice
            </Button>
            <Button
              disabled={order.length !== 6}
              onPress={() => {
                if (order.every((n, i) => n === i)) {
                  setOrderFeedback("The whole scene is back!");
                } else
                  setOrderFeedback(
                    "Not quite. Replay the route and try again.",
                  );
              }}
            >
              Check linked recall
            </Button>
            {orderFeedback && (
              <Text accessibilityLiveRegion="polite" style={s.h3}>
                {orderFeedback}
              </Text>
            )}
            {orderFeedback === "The whole scene is back!" ? (
              <>
                <SuccessBurst label="Six ideas connected!" />
                <Button onPress={() => setPhase("case")}>
                  Solve the patient case
                </Button>
              </>
            ) : (
              <Button secondary onPress={() => setPhase("scene")}>
                Revisit the complete scene
              </Button>
            )}
          </>
        )}
      </View>
    );
  return (
    <View style={{ gap: 18 }}>
      {back}
      <Tag color={C.peach}>
        LESSON {selected + 1} · CONCEPT {index + 1} OF 6
      </Tag>
      <Text style={s.title}>{lesson.title}</Text>
      <Card style={{ backgroundColor: "#F5EDDD", borderRadius: 26, gap: 16 }}>
        <Text style={s.h2}>{card.title}</Text>
        {!testing ? (
          <>
            <Picture module={selected} index={index} />
            <Text style={s.h3}>Make it ridiculous.</Text>
            <Text style={s.body}>{card.hook}</Text>
            <Tag>DECODE THE SCENE</Tag>
            {pictureKeys[selected][index].map((key, i) => (
              <View
                key={key}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: i === 2 ? C.yellow : C.white,
                }}
              >
                <Text style={i === 2 ? s.h3 : s.label}>{key}</Text>
              </View>
            ))}
            <Text style={s.h3}>Now say the mechanism normally.</Text>
            <Text style={s.body}>{card.biology}</Text>
            {selected === 1 && index === 1 && <TranscriptionAct compact />}
            <Button onPress={() => setTesting(true)}>
              Hide card & recall concept
            </Button>
          </>
        ) : (
          <>
            <Text style={s.h3}>{card.question}</Text>
            {card.choices.map((choice, i) => (
              <Button
                key={choice}
                secondary={answer !== i}
                disabled={answer !== null}
                onPress={() => {
                  setAnswer(i);
                  onRecall(100 + selected * 10 + index, i === card.answer);
                }}
              >
                {choice}
              </Button>
            ))}
            {answer !== null && (
              <>
                <Text accessibilityLiveRegion="polite" style={s.label}>
                  {answer === card.answer
                    ? "That link is right."
                    : "Reconnect the picture to the mechanism."}
                </Text>
                <Text style={s.body}>{card.biology}</Text>
                <Button
                  onPress={() => {
                    setTesting(false);
                    setAnswer(null);
                    if (index === 5) setPhase("scene");
                    else setIndex(index + 1);
                  }}
                >
                  {index === 5 ? "Connect the complete scene" : "Next concept"}
                </Button>
              </>
            )}
          </>
        )}
      </Card>
      <Button secondary onPress={() => Linking.openURL(lesson.source)}>
        Read the biology reference ↗
      </Button>
      {selected === 0 && <MedicalStudio concept={index < 3 ? 1 : 2} />}
      <Text style={s.small}>
        Original memory metaphors and educational practice. Not a diagnostic
        tool.
      </Text>
    </View>
  );
}
function PatientCase({
  lesson,
  onBack,
}: {
  lesson: MedicalModule;
  onBack: () => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null),
    [attempts, setAttempts] = useState(0);
  const c = lesson.case,
    correct = answer === c.answer,
    finished = correct || attempts >= 2;
  return (
    <View style={{ gap: 18 }}>
      <Tag color={C.yellow}>
        CASE CONFERENCE · ATTEMPT {Math.min(attempts + 1, 2)} OF 2
      </Tag>
      <Text style={s.title}>{c.title}</Text>
      <Card style={{ backgroundColor: "#E7DFEF", borderRadius: 28 }}>
        <Text style={s.label}>
          {c.source
            ? "ADAPTED FROM A PHYSICIAN-AUTHORED OPEN-ACCESS CASE"
            : "ORIGINAL EDUCATIONAL PATIENT VIGNETTE"}
        </Text>
        <Text style={s.body}>{c.prompt}</Text>
        {c.choices.map((choice, i) => (
          <Button
            key={choice}
            secondary={answer !== i}
            disabled={answer !== null}
            onPress={() => {
              setAnswer(i);
              setAttempts((n) => n + 1);
            }}
          >
            {choice}
          </Button>
        ))}
      </Card>
      {answer !== null && (
        <Card style={{ backgroundColor: correct ? C.sage : C.peach }}>
          {correct && <SuccessBurst label="Case solved!" />}
          <Text accessibilityLiveRegion="polite" style={s.h2}>
            {correct
              ? "You connected the clinical clues."
              : finished
                ? c.hint
                : "Not quite. You have another try."}
          </Text>
          {finished ? (
            <>
              <Text style={s.body}>{c.explanation}</Text>
              {c.source && (
                <Button secondary onPress={() => Linking.openURL(c.source!)}>
                  Read the source case ↗
                </Button>
              )}
              <Button onPress={onBack}>Revisit the lesson scene</Button>
            </>
          ) : (
            <>
              <Text style={s.body}>
                Read the findings again and choose the mechanism that connects
                them. The clue stays hidden until your second attempt.
              </Text>
              <Button onPress={() => setAnswer(null)}>
                Try the case again
              </Button>
            </>
          )}
        </Card>
      )}
    </View>
  );
}

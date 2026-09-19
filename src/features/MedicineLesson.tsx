import React, { useState } from "react";
import { Image, Linking, View } from "react-native";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { BioMiniLab } from "../components/BioMiniLab";
import { MedicalStudio } from "../components/MedicalStudio";
import { SuccessBurst } from "../components/SuccessBurst";
import { medicalModules, type MedicalModule } from "../data/medicalLessons";
import { TranscriptionAct } from "./TranscriptionAct";
const sheets = [
  require("../../assets/bio-cells-world.png"),
  require("../../assets/bio-dna-detectives.png"),
  require("../../assets/bio-replication-lab.png"),
];
const pictureKeys = [
  [
    [
      "OPEN WORKSHOP = prokaryote",
      "NUCLEUS OFFICE = eukaryote",
      "BOTH ARE CELLS WITH DNA + RIBOSOMES",
    ],
    [
      "LONG RIBBON = about 2 m DNA",
      "TINY ROOM = nucleus",
      "FOLDING, NOT DELETING, MAKES IT FIT",
    ],
    [
      "GREEN BARK = chlorophyll",
      "LEAVES ON BREAK = drought leaf loss",
      "STEMS KEEP CATCHING LIGHT",
    ],
    [
      "RED RAYS STOP = water absorbs red light",
      "DROP STAYS BLOOD",
      "AVAILABLE LIGHT CHANGES APPEARANCE",
    ],
    [
      "SUN = captured energy",
      "WATER + CO₂ = inputs",
      "SUGAR + O₂ = overall products",
    ],
    [
      "FUEL + O₂ ENTER",
      "MITOCHONDRION TRANSFERS ENERGY",
      "ATP PACKS LEAVE FOR CELL WORK",
    ],
  ],
  [
    [
      "X-RAYS SCATTER",
      "X PATTERN = repeating helical clue",
      "PATTERN CONSTRAINS SHAPE; IT IS NOT A PHOTO",
    ],
    [
      "MODEL BUILDERS = proposed structure",
      "DIFFRACTION + CHEMISTRY = constraints",
      "MANY SCIENTISTS SUPPLIED THE EVIDENCE",
    ],
    [
      "CIRCLE HAT = phosphate",
      "PENTAGON PACK = deoxyribose",
      "CARD = A, T, C OR G BASE",
    ],
    [
      "A–T = TWO HANDS",
      "C–G = THREE HANDS",
      "ONE LARGE + ONE SMALL BASE KEEPS WIDTH STEADY",
    ],
    [
      "SPOOLS = histones",
      "BEADS = nucleosomes",
      "COILING MAKES COMPACT CHROMATIN",
    ],
    [
      "OPEN CIRCLE = prokaryotic nucleoid",
      "LOCKED LIBRARY = eukaryotic nucleus",
      "CIRCULAR VS LINEAR IS THE CORE MODEL",
    ],
  ],
  [
    [
      "ZIPPER WORKER = helicase",
      "OPEN FORK = separated templates",
      "OPENING PREPARES DNA FOR COPYING",
    ],
    [
      "EACH OLD RAIL = template",
      "EACH GETS ONE NEW PARTNER",
      "TWO DAUGHTERS ARE HALF OLD + HALF NEW",
    ],
    [
      "BUILDER = DNA polymerase",
      "3′ HANDLE = only addition point",
      "PROOFREADER REMOVES MANY MISMATCHES",
    ],
    [
      "TRAIN = RNA polymerase",
      "TEMPLATE READ 3′→5′",
      "RNA GROWS 5′→3′ AND USES U",
    ],
    [
      "THREE-TILE TICKET = codon",
      "WAITER = tRNA",
      "RIBOSOME LINKS AMINO-ACID BEADS",
    ],
    [
      "DETERGENT OPENS MEMBRANES",
      "FILTER HOLDS DEBRIS",
      "COLD ALCOHOL REVEALS DNA STRINGS",
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
  const y = row * 512;
  const panelH = 512;
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
  const [showDetails, setShowDetails] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const start = (i: number) => {
    setSelected(i);
    setIndex(0);
    setPhase("cards");
    setTesting(false);
    setAnswer(null);
    setOrder([]);
    setOrderFeedback("");
    setShowDetails(false);
    setStudioOpen(false);
  };
  if (selected === null)
    return (
      <View style={{ gap: 22 }}>
        <Tag color={C.peach}>THE BIOLOGY STUDIO</Tag>
        <Text style={s.title}>Biology, from the beginning.</Text>
        <Text style={s.body}>
          Start with cells, build DNA from the evidence, then make it copy and
          speak. Each lesson combines accurate explanations, restrained memory
          cartoons, an interactive mini lab and a field challenge.
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
          {actOpen
            ? "Close the molecular detail lab"
            : "Open the molecular detail lab"}
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
            <BioMiniLab module={selected} />
            {lesson.video && (
              <Button secondary onPress={() => Linking.openURL(lesson.video!)}>
                Watch the real process ↗
              </Button>
            )}
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
                  Solve the field challenge
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
            <Text style={s.h3}>The strange picture</Text>
            <Text style={s.body}>{card.hook}</Text>
            <View
              style={{
                padding: 14,
                borderRadius: 18,
                backgroundColor: C.white,
                gap: 8,
              }}
            >
              <Text style={s.label}>THREE THINGS TO NOTICE</Text>
              {pictureKeys[selected][index].map((key, i) => (
                <Text key={key} style={s.small}>
                  {i + 1}. {key.toLowerCase()}
                </Text>
              ))}
            </View>
            <Button secondary onPress={() => setShowDetails(!showDetails)}>
              {showDetails ? "Keep it short" : "Explain the real biology"}
            </Button>
            {showDetails && (
              <View style={{ gap: 10 }}>
                <Text style={s.h3}>What is really happening?</Text>
                <Text style={s.body}>{card.biology}</Text>
                <Text style={s.small}>{card.fact}</Text>
                {selected === 2 && index === 3 && <TranscriptionAct compact />}
              </View>
            )}
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
                    setShowDetails(false);
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
        Open the free biology reference ↗
      </Button>
      <Button secondary onPress={() => setStudioOpen(!studioOpen)}>
        {studioOpen ? "Close molecular explorer" : "Open molecular explorer"}
      </Button>
      {studioOpen && <MedicalStudio concept={selected} />}
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
        FIELD CHALLENGE · ATTEMPT {Math.min(attempts + 1, 2)} OF 2
      </Tag>
      <Text style={s.title}>{c.title}</Text>
      <Card style={{ backgroundColor: "#E7DFEF", borderRadius: 28 }}>
        <Text style={s.label}>
          {c.source
            ? "ADAPTED FROM AN OPEN EDUCATIONAL SOURCE"
            : "ORIGINAL BIOLOGY APPLICATION QUESTION"}
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
          {correct && <SuccessBurst label="Challenge solved!" />}
          <Text accessibilityLiveRegion="polite" style={s.h2}>
            {correct
              ? "You connected the biological clues."
              : finished
                ? c.hint
                : "Not quite. You have another try."}
          </Text>
          {finished ? (
            <>
              <Text style={s.body}>{c.explanation}</Text>
              {c.source && (
                <Button secondary onPress={() => Linking.openURL(c.source!)}>
                  Read the source ↗
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

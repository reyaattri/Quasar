import { ActivityStoryArt } from "../components/ActivityStoryArt";
import React, { useState } from "react";
import { View, Pressable, Modal, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, Card, Tag, Field, C, s } from "../components/ui";
import { Portrait } from "../components/Portrait";
import {
  CardMemoryArt,
  ExploreMemoryArt,
} from "../components/MemoryActivityArt";
import {
  deck,
  shuffle,
  cardPlace,
  people,
  phrase,
  phraseHooks,
  pairs,
} from "../data/funGames";
type Game = "cards" | "names" | "phrase" | "pairs";
const titles = {
  cards: "The card cabinet",
  names: "Nice to meet who?",
  phrase: "A story with a secret",
  pairs: "Name twins",
};
export function FunFlex({ onWorlds }: { onWorlds: () => void }) {
  const [game, setGame] = useState<Game | null>(null),
    [phase, setPhase] = useState("setup");
  const [count, setCount] = useState(6),
    [sequence, setSequence] = useState<string[]>([]),
    [step, setStep] = useState(0),
    [answers, setAnswers] = useState<string[]>([]),
    [faceOrder, setFaceOrder] = useState<number[]>([]);
  const start = (kind: Game) => {
    setGame(kind);
    setPhase("setup");
    setStep(0);
  };
  const begin = () => {
    const ids =
      game === "cards"
        ? shuffle(deck)
            .slice(0, count)
            .map((c) => c.id)
        : game === "names"
          ? shuffle(people.map((_, i) => String(i)))
          : game === "pairs"
            ? pairs.map((_, i) => String(i))
            : phrase;
    setSequence(ids);
    setStep(0);
    setAnswers(Array(ids.length).fill(""));
    setFaceOrder(shuffle(ids.map((_, i) => i)));
    setPhase("study");
  };
  const update = (i: number, v: string) =>
    setAnswers((a) => a.map((x, n) => (n === i ? v : x)));
  const expected = (i: number) =>
    game === "names"
      ? people[Number(sequence[faceOrder[i]])].name
      : game === "pairs"
        ? pairs[Number(sequence[i])][1]
        : sequence[i];
  const correct = (i: number) =>
    answers[i]?.trim().toLowerCase() === expected(i).toLowerCase();
  const entries = [
    {
      kind: "cards" as Game,
      color: "#292944",
      body: "Turn a shuffled deck into a little parade.",
      glyph: "♠ ♥",
    },
    {
      kind: "names" as Game,
      color: "#E9B3AD",
      body: "Meet six characters. Make their names stick.",
      glyph: "",
    },
    {
      kind: "pairs" as Game,
      color: "#BFD7AF",
      body: "Clara or Cara? Give near-matching names wildly different pictures.",
      glyph: "C + C",
    },
    {
      kind: "phrase" as Game,
      color: "#F1D379",
      body: "Remember a fictional six-word phrase.",
      glyph: "••• → 🎺",
    },
  ];
  return (
    <View style={{ gap: 18 }}>
      <Tag color={C.yellow}>FUN & FLEX</Tag>
      <Text style={s.h2}>A little play. A lot to remember.</Text>
      <Text style={s.body}>
        Learn the trick, try it one step at a time, then put the pictures away.
      </Text>
      {entries.map((c, i) => (
        <Pressable
          key={c.kind}
          accessibilityRole="button"
          accessibilityLabel={"Play " + titles[c.kind]}
          onPress={() => start(c.kind)}
          style={({ pressed }) => ({
            backgroundColor: c.color,
            borderRadius: i === 1 ? 38 : 18,
            padding: 23,
            gap: 15,
            borderWidth: 1,
            borderColor: C.ink,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          })}
        >
          <ExploreMemoryArt kind={c.kind} />
          <Text style={[s.h2, { color: i === 0 ? "#FFF8EA" : C.ink }]}>
            {titles[c.kind]}
          </Text>
          <Text style={[s.body, { color: i === 0 ? "#E0D9CB" : C.ink }]}>
            {c.body}
          </Text>
          <Text style={[s.label, { color: i === 0 ? "#F2DFA8" : C.ink }]}>
            Try it →
          </Text>
        </Pressable>
      ))}
      <Modal
        visible={!!game}
        animationType="slide"
        onRequestClose={() => setGame(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: C.paper }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 22,
              gap: 20,
              width: "100%",
              maxWidth: 650,
              alignSelf: "center",
            }}
          >
            <Button small secondary onPress={() => setGame(null)}>
              Back to Explore
            </Button>
            {game && (
              <>
                <Tag>FUN & FLEX · {phase.toUpperCase()}</Tag>
                <Text style={s.title}>{titles[game]}</Text>
                {phase === "setup" ? (
                  <>
                    <Text style={s.body}>
                      {game === "cards"
                        ? "Each card has its own illustrated incident. Two swans fight over heart-shaped toast: swan recalls 2, heart toast recalls hearts. Place that whole incident at your next landmark. Start with six before attempting 52."
                        : game === "names"
                          ? "Spot one facial feature. Turn the name into a concrete sound-picture. Connect the picture to the feature, say the name aloud, then retrieve it once before moving on. Later the portraits are mixed: recall each name."
                          : game === "pairs"
                            ? "Nearly identical names need different pictures. Exaggerate the one sound that changes, make both pictures interact at a fixed landmark, and say the contrast aloud: “CLARA—clarinet; CARA—car.” You will be shown the first name and must retrieve its twin."
                            : "Link unrelated words into a vivid story, then recall the words in order. This is a public, fictional practice phrase. Never use it as a real password or enter a real password here."}
                    </Text>
                    <Card style={{ backgroundColor: C.sage, gap: 10 }}>
                      <Text style={s.label}>WHY THIS WORKS</Text>
                      <Text style={s.body}>
                        {game === "cards"
                          ? "Notice the main object, the suit clue inside its action, and its place on your route. Replay the incident from that address; then name the card without looking. Reuse the same incident for that exact card in future sessions."
                          : game === "names"
                            ? "A face is already visible; a name is abstract. The sound-picture ties the name to one feature, while saying it and recalling it once creates a second route back."
                            : game === "pairs"
                              ? "Similar names interfere with each other. We enlarge the one sound that changes, give each sound its own object, give them distinct actions."
                              : "A linked story turns six separate words into cause and effect. Every picture must physically change the next one, and the last image loops back to the first."}
                      </Text>
                    </Card>
                    {game === "cards" && (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 9,
                          flexWrap: "wrap",
                        }}
                      >
                        {[6, 12, 52].map((n) => (
                          <Button
                            key={n}
                            small
                            secondary={count !== n}
                            onPress={() => setCount(n)}
                          >
                            {n === 52 ? "Full deck · 52" : `${n} cards`}
                          </Button>
                        ))}
                      </View>
                    )}
                    <Button onPress={begin}>Start practice</Button>
                    <Button
                      secondary
                      small
                      onPress={() =>
                        Linking.openURL(
                          game === "phrase"
                            ? "https://ssd.eff.org/module/creating-strong-passwords"
                            : game === "names"
                              ? "https://artofmemory.com/wiki/Memorizing_Names_and_Faces/"
                              : "https://artofmemory.com/resources/Learn_the_Art_of_Memory.pdf",
                        )
                      }
                    >
                      About the method
                    </Button>
                  </>
                ) : phase === "study" ? (
                  <>
                    <Text style={s.label}>
                      {step + 1} / {sequence.length} · LOOK → LINK → PLACE
                    </Text>
                    {game === "cards" ? (
                      (() => {
                        const card = deck.find((c) => c.id === sequence[step])!;
                        return (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <View
                                testID="playing-card"
                                accessibilityLabel={card.name}
                                style={{
                                  width: 112,
                                  height: 180,
                                  borderRadius: 16,
                                  backgroundColor: "#FFFEF8",
                                  borderColor: C.ink,
                                  borderWidth: 2,
                                  padding: 14,
                                  alignSelf: "center",
                                  transform: [{ rotate: "-3deg" }],
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 27,
                                    color: card.red ? "#B94146" : C.ink,
                                  }}
                                >
                                  {card.id}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 66,
                                    textAlign: "center",
                                    color: card.red ? "#B94146" : C.ink,
                                  }}
                                >
                                  {card.suit}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 25,
                                    textAlign: "right",
                                    color: card.red ? "#B94146" : C.ink,
                                  }}
                                >
                                  {card.id}
                                </Text>
                              </View>
                              <CardMemoryArt card={card} step={step} />
                            </View>
                            <Tag>{cardPlace(step)}</Tag>
                            <Text style={s.h2}>
                              {card.icon} {card.object}
                            </Text>
                            {[
                              [
                                "1 · RANK BECOMES",
                                `${card.rank} → ${card.object}. ${card.rank === "4" ? "The mast and triangular sail suggest the shape of 4." : "Keep this same rank-object pair each time you practise."}`,
                              ],
                              [
                                "2 · FIND THE SUIT CLUE",
                                `${card.suit} → ${card.suitCue}`,
                              ],
                              ["3 · ADDRESS", cardPlace(step)],
                              [
                                "4 · REPLAY THE STORY",
                                `${card.hook}. Stage this whole incident at the ${cardPlace(step).toLowerCase()}. Make the movement enormous and add its sound. Now look away: which object gives the rank, and which detail gives the suit? Say ${card.name}, then move to the next address.`,
                              ],
                            ].map(([label, value], cueIndex) => (
                              <View
                                key={label}
                                style={{
                                  padding: 12,
                                  borderRadius: 14,
                                  backgroundColor:
                                    cueIndex === 3 ? C.yellow : C.sage,
                                }}
                              >
                                <Text style={s.label}>{label}</Text>
                                <Text style={cueIndex === 3 ? s.h3 : s.body}>
                                  {value}
                                </Text>
                              </View>
                            ))}
                            <Text style={s.small}>
                              Close your eyes and retrieve: address → story →
                              suit clue → card. Keep each card’s story unchanged
                              between practices.
                            </Text>
                          </>
                        );
                      })()
                    ) : game === "names" ? (
                      (() => {
                        const index = Number(sequence[step]),
                          person = people[index];
                        return (
                          <>
                            <View style={{ alignItems: "center" }}>
                              <ActivityStoryArt
                                kind="names"
                                index={index}
                                label={person.hook}
                              />
                            </View>
                            <Text style={s.h2}>Meet {person.name}.</Text>
                            <Tag>1 · NOTICE {person.feature.toUpperCase()}</Tag>
                            <Text style={s.body}>
                              {person.hook} Make it move, hear it, then say
                              “Hello, {person.name}.” Close your eyes and
                              retrieve the name once.
                            </Text>
                          </>
                        );
                      })()
                    ) : game === "pairs" ? (
                      <>
                        <ActivityStoryArt
                          kind="twins"
                          index={step}
                          label={pairs[step][2]}
                        />
                        <View style={{ flexDirection: "row", gap: 10 }}>
                          <Card style={{ flex: 1, backgroundColor: C.peach }}>
                            <Text style={s.label}>FIRST NAME</Text>
                            <Text style={s.h2}>{pairs[step][0]}</Text>
                          </Card>
                          <Card style={{ flex: 1, backgroundColor: C.yellow }}>
                            <Text style={s.label}>TWIN NAME</Text>
                            <Text style={s.h2}>{pairs[step][1]}</Text>
                          </Card>
                        </View>
                        <Tag>{cardPlace(step)}</Tag>
                        {[
                          [
                            "HEAR THE SPLIT",
                            "Say both names slowly. Stretch only the sound that changes.",
                          ],
                          ["GIVE EACH SOUND A BODY", pairs[step][2]],
                          [
                            "RETRIEVE BACKWARDS",
                            `Look away. Ask: “Who was paired with ${pairs[step][0]}?” Then reverse the question.`,
                          ],
                        ].map(([label, value], cueIndex) => (
                          <View
                            key={label}
                            style={{
                              padding: 12,
                              borderRadius: 14,
                              backgroundColor:
                                cueIndex === 2 ? C.yellow : C.white,
                            }}
                          >
                            <Text style={s.label}>{label}</Text>
                            <Text style={cueIndex === 2 ? s.h3 : s.body}>
                              {value}
                            </Text>
                          </View>
                        ))}
                      </>
                    ) : (
                      <>
                        <ActivityStoryArt
                          kind="secret"
                          index={step}
                          label={phraseHooks[step]}
                        />
                        <Text style={s.h2}>{phrase[step]}</Text>
                        <Text style={s.body}>{phraseHooks[step]}</Text>
                        <Card style={{ backgroundColor: C.sage, gap: 8 }}>
                          <Text style={s.label}>LINK {step + 1}</Text>
                          <Text style={s.body}>
                            {step === 0
                              ? "Start the movie. See the otter grab the velvet; do not merely place the two side by side."
                              : `Replay the previous action, then watch ${phrase[step]} cause the next impossible change. Add a sound, texture and sudden movement.`}
                          </Text>
                          <Text style={s.small}>
                            Check both directions: what came before this image,
                            and what did it make happen next?
                          </Text>
                        </Card>
                        <Tag>Fictional practice · not a usable password</Tag>
                      </>
                    )}
                    <Button
                      onPress={() =>
                        step === sequence.length - 1
                          ? setPhase("recall")
                          : setStep((v) => v + 1)
                      }
                    >
                      {step === sequence.length - 1
                        ? "Hide everything & recall"
                        : "Next item"}
                    </Button>
                    {step > 0 && (
                      <Button secondary onPress={() => setStep((v) => v - 1)}>
                        Previous item
                      </Button>
                    )}
                  </>
                ) : phase === "recall" ? (
                  <>
                    <Text style={s.body}>
                      {game === "names"
                        ? "The faces are mixed up. Name each person."
                        : "Rebuild the sequence without the mnemonic pictures. Take the route in your mind."}
                    </Text>
                    {sequence.map((_, i) => (
                      <Card
                        key={i}
                        style={{ backgroundColor: i % 2 ? C.sage : C.white }}
                      >
                        {game === "names" ? (
                          <>
                            <View style={{ alignItems: "center" }}>
                              <Portrait
                                index={Number(sequence[faceOrder[i]])}
                                size={130}
                              />
                            </View>
                            <Field
                              label={`Person ${i + 1} name`}
                              value={answers[i]}
                              onChangeText={(v) => update(i, v)}
                            />
                          </>
                        ) : game === "cards" ? (
                          <>
                            <Text style={s.label}>
                              {i + 1}. {cardPlace(i)}
                            </Text>
                            <Field
                              label={`Card ${i + 1}`}
                              placeholder="e.g. 2H, AS, QD, 10C"
                              value={answers[i]}
                              onChangeText={(v) =>
                                update(
                                  i,
                                  v
                                    .toUpperCase()
                                    .replace(/H/g, "♥")
                                    .replace(/C/g, "♣")
                                    .replace(/D/g, "♦")
                                    .replace(/S/g, "♠"),
                                )
                              }
                            />
                            <Text style={s.small}>
                              H hearts · C clubs · D diamonds · S spades
                            </Text>
                          </>
                        ) : (
                          <Field
                            label={
                              game === "pairs"
                                ? `${i + 1}. Which similar name was paired with ${pairs[i][0]}?`
                                : `Word ${i + 1}`
                            }
                            value={answers[i]}
                            onChangeText={(v) => update(i, v)}
                          />
                        )}
                      </Card>
                    ))}
                    <Button
                      disabled={answers.some((a) => !a.trim())}
                      onPress={() => setPhase("result")}
                    >
                      Check my recall
                    </Button>
                  </>
                ) : (
                  <>
                    <Text style={s.title}>
                      {sequence.filter((_, i) => correct(i)).length} /{" "}
                      {sequence.length}
                    </Text>
                    <Text style={s.body}>
                      Compare your answers, then strengthen any picture that did
                      not stick.
                    </Text>
                    {sequence.map((_, i) => (
                      <View
                        key={i}
                        style={{
                          padding: 12,
                          backgroundColor: correct(i) ? C.sage : C.peach,
                          borderRadius: 12,
                        }}
                      >
                        <Text style={s.label}>
                          {i + 1}. {expected(i)}
                        </Text>
                        <Text style={s.small}>
                          {correct(i)
                            ? "Remembered"
                            : `Your answer: ${answers[i] || "—"}`}
                        </Text>
                      </View>
                    ))}
                    <Button
                      onPress={() => {
                        setStep(0);
                        setAnswers(Array(sequence.length).fill(""));
                        setPhase("study");
                      }}
                    >
                      Practice this sequence again
                    </Button>
                    <Button secondary onPress={() => setPhase("setup")}>
                      Start a new round
                    </Button>
                  </>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

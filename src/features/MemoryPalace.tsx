import { SafeAreaView } from "react-native-safe-area-context";
import { EncounterMotion } from "../components/EncounterMotion";
import { PalaceGame } from "../components/PalaceGame";
import { PixelButton } from "../components/PixelButton";
import { parseShoppingList, shoppingJourney } from "../lib/shoppingPalace";
import { Text } from "../components/ui";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Image,
  Modal,
  ScrollView,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useAudioPlayer } from "expo-audio";
import { Button, Card, C, Field, s, Tag } from "../components/ui";
import { FactImage } from "../components/Scene";
import { scenes } from "../data/content";
import {
  checkRoute,
  journeys,
  worldRoutes,
  normalizeRecall,
  worlds,
} from "../data/palaces";

export type PalaceSave = {
  world: number;
  journey: number;
  stop: number;
  visited: number[];
  recalled: number[];
  completed: boolean;
  customItems?: string[];
};
export const newPalace = (): PalaceSave => ({
  world: 0,
  journey: 0,
  stop: 0,
  visited: [],
  recalled: [],
  completed: false,
});
const music = [
  require("../../assets/dojo.wav"),
  require("../../assets/egypt.wav"),
  require("../../assets/neon.wav"),
];
export function WorldPicture({
  world,
  height = 210,
}: {
  world: number;
  height?: number;
}) {
  const [width, setWidth] = useState(0);
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height, overflow: "hidden", borderRadius: 20 }}
    >
      {width > 0 && (
        <Image
          resizeMode="stretch"
          accessibilityLabel={worlds[world].name + " illustrated landscape"}
          source={require("../../assets/palace-worlds.png")}
          style={{
            position: "absolute",
            width: width * 3,
            height: width * 2,
            left: -world * width,
            top: -(width * 2 - height) / 2,
          }}
        />
      )}
    </View>
  );
}
export function MemoryPalace({
  saved,
  onSave,
}: {
  saved?: PalaceSave;
  onSave: (value: PalaceSave) => void;
}) {
  const value = saved ?? newPalace();
  const allLoci = [
    ...(worldRoutes[value.world] ?? worldRoutes[0]),
    { x: 83, y: 70 },
    { x: 52, y: 48 },
  ];
  const world = worlds[value.world] ?? worlds[0];
  const journey =
    value.journey === -1 && value.customItems?.length
      ? shoppingJourney(value.customItems)
      : (journeys[value.journey] ?? journeys[0]);
  const loci = allLoci.slice(0, journey.items.length);
  const places = [
    ...world.places,
    "Hidden terrace",
    "Courtyard fountain",
  ].slice(0, journey.items.length);
  const [shoppingText, setShoppingText] = useState(
    (value.customItems ?? []).join("\n"),
  );
  const [shoppingError, setShoppingError] = useState("");
  const [entered, setEntered] = useState(false);
  const [atStop, setAtStop] = useState(true);
  useEffect(() => {
    position.setValue(loci[value.stop]);
  }, [value.world]);
  const [recall, setRecall] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [routeAnswers, setRouteAnswers] = useState<string[]>(
    Array(journey.items.length).fill(""),
  );
  const [finalRecall, setFinalRecall] = useState(false);
  const [sound, setSound] = useState(false);
  const [mapWidth, setMapWidth] = useState(300);
  const position = useRef(
    new Animated.ValueXY(loci[value.stop] ?? loci[0]),
  ).current;
  const reduced = useRef(false);
  const audio = useAudioPlayer(music[value.world] ?? music[0]);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      reduced.current = v;
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (v) => {
        reduced.current = v;
      },
    );
    return () => sub.remove();
  }, []);
  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.18;
    if (sound && entered) audio.play();
    else audio.pause();
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        audio.pause();
        setSound(false);
      }
    });
    return () => sub.remove();
  }, [sound, entered, audio]);
  const item = journey.items[value.stop];
  const sceneFact = scenes.find((scene) => scene.id === journey.id)?.facts[
    value.stop
  ];
  if (!entered)
    return (
      <View style={{ gap: 22 }}>
        <Tag color={C.yellow}>MEMORY WORLDS</Tag>
        <Text style={s.title}>Give your memories a place.</Text>
        <Text style={s.body}>
          Choose a world. Walk a fixed route, leave something unforgettable at
          each stop, then find it again in your mind.
        </Text>
        {worlds.map((w, i) => (
          <Pressable
            key={w.id}
            accessibilityRole="button"
            accessibilityLabel={"Choose " + w.name}
            accessibilityState={{ selected: value.world === i }}
            aria-selected={value.world === i}
            onPress={() => onSave({ ...value, world: i })}
          >
            <Card
              style={{
                backgroundColor: w.color,
                borderColor: value.world === i ? w.ink : "transparent",
                borderWidth: 2,
              }}
            >
              <WorldPicture world={i} />
              <View style={s.between}>
                <Text style={s.h3}>{w.name}</Text>
                <Tag>{value.world === i ? "Selected" : "Explore"}</Tag>
              </View>
              <Text style={s.body}>{w.caption}</Text>
            </Card>
          </Pressable>
        ))}
        <Text style={s.h2}>What will you remember?</Text>
        <Card style={{ backgroundColor: C.peach }}>
          <Tag>MAKE IT YOURS</Tag>
          <Text style={s.h2}>What’s on your shopping list?</Text>
          <Field
            label="Your shopping items"
            value={shoppingText}
            onChangeText={setShoppingText}
            multiline
            placeholder="Milk\nTomatoes\n2 loaves of bread"
          />
          <Text style={s.small}>
            One item per line or separated by commas. Up to 8 items. Your list
            stays on this device unless you back up your profile.
          </Text>
          {!!shoppingError && (
            <Text accessibilityLiveRegion="polite" style={s.label}>
              {shoppingError}
            </Text>
          )}
          <Button
            onPress={() => {
              try {
                const customItems = parseShoppingList(shoppingText);
                onSave({
                  ...newPalace(),
                  world: value.world,
                  journey: -1,
                  customItems,
                });
                setShoppingError("");
                position.setValue(loci[0]);
                setAtStop(true);
                setEntered(true);
              } catch (error) {
                setShoppingError((error as Error).message);
              }
            }}
          >
            Build my shopping palace
          </Button>
        </Card>
        {journeys.map((j, i) => (
          <Button
            key={j.id}
            secondary={value.journey !== i}
            onPress={() => {
              onSave({ ...newPalace(), world: value.world, journey: i });
              position.setValue(loci[0]);
            }}
          >
            {j.name}
          </Button>
        ))}
        <Text style={s.small}>
          One active route is saved. Changing the learning activity starts a
          fresh route. Changing the scenery keeps your progress.
        </Text>
        <PixelButton
          kind="start"
          width={180}
          label={value.visited.length ? "Continue your walk" : "Enter world"}
          onPress={() => {
            setAtStop(true);
            setEntered(true);
          }}
        />
      </View>
    );
  return (
    <Modal
      visible
      animationType="fade"
      onRequestClose={() => {
        setEntered(false);
        setSound(false);
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: world.color }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View
            style={{
              width: "100%",
              maxWidth: 680,
              alignSelf: "center",
              gap: 18,
            }}
          >
            <View style={s.between}>
              <Button
                small
                secondary
                onPress={() => {
                  setEntered(false);
                  setSound(false);
                }}
              >
                Worlds
              </Button>
              <Button small secondary onPress={() => setSound((v) => !v)}>
                {sound ? "Music off" : "Music on"}
              </Button>
            </View>
            <Tag color={world.color}>{world.name}</Tag>
            <Text style={s.h2}>{journey.name}</Text>
            <Text style={s.body}>{journey.intro}</Text>
            {!finalRecall ? (
              <>
                <PalaceGame
                  key={world.id + journey.id}
                  world={value.world}
                  points={loci}
                  stop={value.stop}
                  recalled={value.recalled}
                  onTravel={() => setAtStop(false)}
                  onArrive={(stop) => {
                    onSave({ ...value, stop });
                    setAtStop(true);
                    setRecall(false);
                    setAnswer("");
                    setFeedback("");
                  }}
                />
                {atStop ? (
                  <Card style={{ backgroundColor: world.color }}>
                    <Text style={s.h3}>{places[value.stop]}</Text>
                    {recall ? (
                      <>
                        <Field
                          label={journey.prompt}
                          value={answer}
                          onChangeText={setAnswer}
                        />
                        <Button
                          disabled={!answer.trim()}
                          onPress={() => {
                            const correct =
                              normalizeRecall(answer) ===
                              normalizeRecall(item.answer);
                            onSave({
                              ...value,
                              recalled: correct
                                ? Array.from(
                                    new Set([...value.recalled, value.stop]),
                                  )
                                : value.recalled.filter(
                                    (i) => i !== value.stop,
                                  ),
                              completed: false,
                            });
                            setFeedback(
                              correct
                                ? "That belongs here. Well remembered."
                                : "Not yet. Picture the action at this stop, or reveal the cue and try again.",
                            );
                          }}
                        >
                          Check memory
                        </Button>
                        <Button
                          secondary
                          onPress={() => {
                            setRecall(false);
                            setFeedback("");
                          }}
                        >
                          Reveal cue
                        </Button>
                      </>
                    ) : (
                      <>
                        {journey.id === "pi" ? (
                          <EncounterMotion variant={value.stop}>
                            <View
                              style={{
                                width: 200,
                                height: 200,
                                alignSelf: "center",
                                overflow: "hidden",
                                borderRadius: 18,
                              }}
                            >
                              <Image
                                resizeMode="stretch"
                                accessibilityLabel={item.story}
                                source={require("../../assets/pi-cartoons.png")}
                                style={{
                                  position: "absolute",
                                  width: 600,
                                  height: 400,
                                  left: -(value.stop % 3) * 200,
                                  top: -Math.floor(value.stop / 3) * 200,
                                }}
                              />
                            </View>
                          </EncounterMotion>
                        ) : sceneFact ? (
                          <FactImage fact={sceneFact} style="storybook" />
                        ) : (
                          <Text style={{ fontSize: 54, textAlign: "center" }}>
                            {item.symbol}
                          </Text>
                        )}
                        <Text style={s.h2}>{item.object}</Text>
                        <Text style={s.body}>{item.story}</Text>
                        <Text style={s.label}>{item.decode}</Text>
                        <Button
                          onPress={() => {
                            onSave({
                              ...value,
                              visited: Array.from(
                                new Set([...value.visited, value.stop]),
                              ),
                            });
                            setRecall(true);
                            setAnswer("");
                            setFeedback("");
                          }}
                        >
                          Hide cue & recall
                        </Button>
                      </>
                    )}
                    {!!feedback && (
                      <Text accessibilityLiveRegion="polite" style={s.label}>
                        {feedback}
                      </Text>
                    )}
                  </Card>
                ) : (
                  <Text style={s.body}>
                    Walk to a numbered destination to discover its memory scene.
                  </Text>
                )}
                <Text style={s.body}>
                  {value.recalled.length} of {journey.items.length} stops
                  recalled. Final challenge checks the entire route with every
                  cue hidden.
                </Text>
                <Button
                  disabled={value.visited.length < journey.items.length}
                  onPress={() => {
                    setFinalRecall(true);
                    setFeedback("");
                    setRouteAnswers(Array(journey.items.length).fill(""));
                  }}
                >
                  Recall the whole route
                </Button>
              </>
            ) : (
              <Card>
                <Text style={s.h2}>Take the walk in your mind.</Text>
                <Text style={s.body}>
                  Start at the entrance. What did you leave at each place?
                </Text>
                {places.map((place, i) => (
                  <Field
                    key={place}
                    label={`${i + 1}. ${place}`}
                    value={routeAnswers[i]}
                    onChangeText={(v) =>
                      setRouteAnswers((old) =>
                        old.map((a, n) => (n === i ? v : a)),
                      )
                    }
                  />
                ))}
                <Button
                  disabled={routeAnswers.some((a) => !a.trim())}
                  onPress={() => {
                    const correct = checkRoute(routeAnswers, journey.items);
                    onSave({ ...value, completed: correct });
                    setFeedback(
                      correct
                        ? journey.id === "pi"
                          ? "You recalled 3.141592653589 — all 12 decimal digits in order!"
                          : `All ${journey.items.length} memories, in order. Your route worked!`
                        : "Some stops need another visit. Walk the route again, exaggerate each action, then try without looking.",
                    );
                  }}
                >
                  Check whole route
                </Button>
                {!!feedback && (
                  <Text accessibilityLiveRegion="polite" style={s.label}>
                    {feedback}
                  </Text>
                )}
                <Button
                  secondary
                  onPress={() => {
                    setFinalRecall(false);
                    setFeedback("");
                  }}
                >
                  Return to the world
                </Button>
              </Card>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

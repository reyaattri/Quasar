import { roomFor, objectPoints } from "../data/palaceRooms";
import { contextualCue } from "../data/worldCues";
import { SafeAreaView } from "react-native-safe-area-context";
import { EncounterMotion } from "../components/EncounterMotion";
import { PalaceGame } from "../components/PalaceGame";
import { PixelButton } from "../components/PixelButton";
import { parseShoppingList, shoppingJourney } from "../lib/shoppingPalace";
import { Text } from "../components/ui";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
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
  hooks?: Record<string, string>;
  roomAnchors?: Record<string, number>;
  reviewAt?: string;
  reviewRound?: number;
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
  const value =
    saved && (saved.journey === -1 || saved.journey < journeys.length)
      ? saved
      : newPalace();
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
  const [showCue, setShowCue] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [plant, setPlant] = useState(0);
  const [plantInfo, setPlantInfo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [hookDraft, setHookDraft] = useState("");
  const [recall, setRecall] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [routeAnswers, setRouteAnswers] = useState<string[]>(
    Array(journey.items.length).fill(""),
  );
  const [finalRecall, setFinalRecall] = useState(false);
  const [sound, setSound] = useState(false);
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
  const cueKey = `${value.world}:${journey.id}:${value.stop}`;
  const item = contextualCue(
    journey.items[value.stop] ?? journey.items[0],
    value.world,
    value.stop,
    places[value.stop],
    journey.id === "pi",
  );
  if (value.hooks?.[cueKey]) item.story = value.hooks[cueKey];
  const roomData = roomFor(value.world, value.stop);
  const anchor = Math.min(2, value.roomAnchors?.[cueKey] ?? 0);
  if (!value.hooks?.[cueKey])
    item.story =
      journey.id === "pi"
        ? roomData.action
        : `${item.story} Imagine ${item.object.toLowerCase()} bursting out of the ${roomData.objects[anchor].toLowerCase()}.`;
  const inspect = () => {
    setShowCue(true);
    setRecall(false);
    setFeedback("");
    setEditing(false);
  };
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
        {value.reviewAt && (
          <Tag>
            {new Date(value.reviewAt) <= new Date()
              ? "Your route is ready for a recall visit"
              : "Next recall visit: " +
                new Date(value.reviewAt).toLocaleDateString()}
          </Tag>
        )}
        {worlds.map((w, i) => (
          <Pressable
            key={w.id}
            accessibilityRole="button"
            accessibilityLabel={"Choose " + w.name}
            accessibilityState={{ selected: value.world === i }}
            aria-selected={value.world === i}
            onPress={() =>
              onSave(
                i === value.world
                  ? value
                  : {
                      ...newPalace(),
                      world: i,
                      journey: value.journey,
                      customItems: value.customItems,
                    },
              )
            }
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
        <Card style={{ backgroundColor: C.yellow, borderRadius: 28 }}>
          <Tag>PI · SIX ROOMS</Tag>
          <Text style={s.h2}>Keep the 3. Walk the pairs.</Text>
          <Text style={[s.title, { fontSize: 34, lineHeight: 40 }]}>
            3 . 14 · 15 · 92 · 65 · 35 · 89
          </Text>
          <View style={{ gap: 8 }}>
            {[
              ["1", "ENTER", "Each numbered stop opens a different room."],
              [
                "2",
                "LINK",
                "A fixed object performs a ridiculous action on one landmark.",
              ],
              [
                "3",
                "DECODE",
                "Its consonant sounds reveal one two-digit pair.",
              ],
              [
                "4",
                "RECALL",
                "Hide every cue and walk 3.141592653589 in order.",
              ],
            ].map(([number, label, copy]) => (
              <View
                key={number}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: C.green,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[s.label, { color: C.white }]}>{number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>{label}</Text>
                  <Text style={s.small}>{copy}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={s.small}>
            Example: T/R sounds encode 1/4. Vowels only make “tyre”
            pronounceable.
          </Text>
          <Button
            secondary={value.journey !== 0}
            onPress={() => {
              onSave({ ...newPalace(), world: value.world, journey: 0 });
            }}
          >
            Choose the pi route
          </Button>
        </Card>
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
                setEntered(true);
              } catch (error) {
                setShoppingError((error as Error).message);
              }
            }}
          >
            Build my shopping palace
          </Button>
        </Card>
        {journeys.map((j, i) =>
          i === 0 ? null : (
            <Button
              key={j.id}
              secondary={value.journey !== i}
              onPress={() => {
                onSave({ ...newPalace(), world: value.world, journey: i });
              }}
            >
              {j.name}
            </Button>
          ),
        )}
        <Text style={s.small}>
          One active route is saved. Changing the learning activity starts a
          fresh route. Changing worlds starts a fresh route so the locations
          stay consistent.
        </Text>
        <PixelButton
          kind="start"
          width={180}
          label={value.visited.length ? "Continue your walk" : "Enter world"}
          onPress={() => {
            setEntered(true);
          }}
        />
      </View>
    );
  const closeOverlay = () => {
    setShowCue(false);
    setPlantInfo(false);
    setEditing(false);
  };
  const exit = () => {
    setEntered(false);
    setInRoom(false);
    closeOverlay();
    setSound(false);
    setFinalRecall(false);
  };
  return (
    <Modal
      visible
      animationType="fade"
      onRequestClose={() => {
        if (showCue || plantInfo) closeOverlay();
        else if (inRoom) setInRoom(false);
        else exit();
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: world.color }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 8,
            gap: 6,
          }}
        >
          <Button
            small
            secondary
            onPress={
              inRoom
                ? () => {
                    setInRoom(false);
                    closeOverlay();
                  }
                : exit
            }
          >
            {inRoom ? "Leave room" : "Worlds"}
          </Button>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[s.label, { textAlign: "center", fontSize: 12 }]}>
              {inRoom ? places[value.stop] : world.name}
            </Text>
            <Text style={[s.small, { fontSize: 10 }]}>
              {value.recalled.length}/{journey.items.length} recalled
            </Text>
          </View>
          <Button small secondary onPress={() => setSound((v) => !v)}>
            {sound ? "Music off" : "Music on"}
          </Button>
        </View>
        {!finalRecall && (
          <PalaceGame
            key={world.id + journey.id + (inRoom ? "room" : "map")}
            world={value.world}
            room={inRoom}
            roomIndex={value.stop % 6}
            labels={inRoom ? roomData.objects : undefined}
            memoryLabel={inRoom ? item.object : undefined}
            memoryIndex={
              journey.id === "pi" ? value.world * 6 + value.stop : undefined
            }
            points={inRoom ? objectPoints : loci}
            stop={inRoom ? plant : value.stop}
            recalled={inRoom ? [anchor] : value.recalled}
            paused={showCue || plantInfo}
            concealed={recall && showCue}
            onTravel={() => {}}
            onArrive={(stop) => {
              setRecall(false);
              setAnswer("");
              setFeedback("");
              if (inRoom) {
                setPlant(stop);
                if (stop === anchor) inspect();
                else setPlantInfo(true);
              } else {
                onSave({ ...value, stop });
                setPlant(0);
                setInRoom(true);
                setShowCue(false);
              }
            }}
            onInspect={() => {
              if (inRoom) inspect();
              else {
                setInRoom(true);
                setPlant(anchor);
                setShowCue(false);
              }
            }}
            onEnterRoom={() => {
              setInRoom(true);
              setPlant(anchor);
              setShowCue(false);
            }}
          />
        )}
        {!finalRecall && (
          <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
            <Button
              small
              secondary
              disabled={value.visited.length < journey.items.length}
              onPress={() => {
                setFinalRecall(true);
                closeOverlay();
                setFeedback("");
                setRouteAnswers(Array(journey.items.length).fill(""));
              }}
            >
              Recall the whole route
            </Button>
          </View>
        )}
        {(showCue || plantInfo || finalRecall) && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: finalRecall ? C.paper : "#16281C45",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{
                width: "100%",
                maxWidth: 520,
                maxHeight: finalRecall ? "94%" : "76%",
                borderRadius: 28,
                backgroundColor: C.paper,
              }}
              contentContainerStyle={{ padding: 22, gap: 14 }}
            >
              <Button
                small
                secondary
                onPress={() => {
                  closeOverlay();
                  setFinalRecall(false);
                  setFeedback("");
                }}
              >
                {finalRecall ? "Return to the world" : "Back to exploring"}
              </Button>
              {finalRecall ? (
                <>
                  <Text style={s.h2}>Take the walk in your mind.</Text>
                  <Text style={s.body}>
                    Start at the entrance. Retrieve each memory without its
                    picture.
                  </Text>
                  {places.map((place, i) => (
                    <Field
                      key={place}
                      label={`${i + 1}. ${place}`}
                      value={routeAnswers[i] ?? ""}
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
                      const round =
                        correct &&
                        (!value.reviewAt ||
                          new Date(value.reviewAt) <= new Date())
                          ? (value.reviewRound ?? 0) + 1
                          : (value.reviewRound ?? 0);
                      const days = [1, 3, 7, 14, 30][
                        Math.min(Math.max(round - 1, 0), 4)
                      ];
                      onSave({
                        ...value,
                        completed: correct,
                        reviewRound: round,
                        reviewAt: correct
                          ? new Date(Date.now() + days * 86400000).toISOString()
                          : value.reviewAt,
                      });
                      setFeedback(
                        correct
                          ? journey.id === "pi"
                            ? "You recalled 3.141592653589 — all 12 decimal digits in order!"
                            : `All ${journey.items.length} memories, in order. Your route worked!`
                          : "Some stops need another visit. Make the object interact with its location, then try again without looking.",
                      );
                    }}
                  >
                    Check whole route
                  </Button>
                  {value.completed && (
                    <Text style={s.small}>
                      Come back on{" "}
                      {value.reviewAt
                        ? new Date(value.reviewAt).toLocaleDateString()
                        : "another day"}{" "}
                      for spaced recall.
                    </Text>
                  )}
                </>
              ) : plantInfo ? (
                <>
                  <Tag>{places[value.stop]}</Tag>
                  <Text style={s.h2}>{roomData.objects[plant]}</Text>
                  <Text style={s.body}>
                    {
                      "A distinct landmark in this room. Keep the same anchor when you revisit."
                    }
                  </Text>
                  <Text style={s.small}>
                    {anchor === plant
                      ? "Your memory is attached to this object."
                      : "You can move your memory here, or keep the ready-made anchor."}
                  </Text>
                  <Button
                    onPress={() => {
                      onSave({
                        ...value,
                        roomAnchors: { ...value.roomAnchors, [cueKey]: plant },
                      });
                      setPlantInfo(false);
                      inspect();
                    }}
                  >
                    {anchor === plant
                      ? "Toggle memory cue"
                      : "Attach my memory here"}
                  </Button>
                </>
              ) : (
                <>
                  <Tag>
                    {inRoom ? roomData.objects[anchor] : places[value.stop]}
                  </Tag>
                  {recall ? (
                    <>
                      <Text style={s.h2}>What belongs here?</Text>
                      {journey.id === "pi" && (
                        <Text style={[s.h3, { letterSpacing: 2 }]}>
                          3 .{" "}
                          {journey.items
                            .map((_, i) =>
                              value.recalled.includes(i)
                                ? journey.items[i].answer
                                : "••",
                            )
                            .join(" · ")}
                        </Text>
                      )}
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
                              : value.recalled.filter((i) => i !== value.stop),
                            completed: false,
                          });
                          setFeedback(
                            correct
                              ? "That belongs here. Well remembered."
                              : "Not yet. Reconstruct the object and its action, or reveal the cue and try again.",
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
                      {journey.id === "pi" && (
                        <>
                          <Text style={s.label}>
                            ROOM {value.stop + 1} OF 6 · PAIR {value.stop + 1}
                          </Text>
                          <Text style={[s.h3, { letterSpacing: 2 }]}>
                            3 .{" "}
                            {journey.items
                              .map((part, i) =>
                                i === value.stop
                                  ? `[${part.answer}]`
                                  : value.recalled.includes(i)
                                    ? part.answer
                                    : "••",
                              )
                              .join(" · ")}
                          </Text>
                        </>
                      )}
                      {journey.id === "pi" ? (
                        <EncounterMotion variant={value.stop}>
                          <View
                            style={{
                              width: 135,
                              height: 180,
                              overflow: "hidden",
                              alignSelf: "center",
                              borderRadius: 18,
                            }}
                          >
                            <Image
                              resizeMode="stretch"
                              accessibilityLabel={item.story}
                              source={require("../../assets/world-cues-v2.png")}
                              style={{
                                position: "absolute",
                                width: 810,
                                height: 540,
                                left: -value.stop * 135,
                                top: -value.world * 180,
                              }}
                            />
                          </View>
                        </EncounterMotion>
                      ) : sceneFact ? (
                        <FactImage fact={sceneFact} style="storybook" />
                      ) : (
                        <Text style={{ fontSize: 56, textAlign: "center" }}>
                          {item.symbol}
                        </Text>
                      )}
                      <Text style={s.h2}>{item.object}</Text>
                      <Text style={s.body}>{item.story}</Text>
                      {journey.id === "pi" ? (
                        <View
                          style={{
                            backgroundColor: C.sage,
                            padding: 14,
                            borderRadius: 16,
                            gap: 5,
                          }}
                        >
                          <Text style={s.label}>SOUND CODE</Text>
                          <Text style={s.h3}>{item.decode}</Text>
                          <Text style={s.small}>
                            Say the object → keep its consonant sounds → recover
                            this room’s pair.
                          </Text>
                        </View>
                      ) : (
                        <Text style={s.label}>{item.decode}</Text>
                      )}
                      {inRoom && (
                        <Text style={s.body}>
                          Your fixed anchor: {roomData.objects[anchor]}. Picture
                          the action here before moving to the next room.
                        </Text>
                      )}
                      {editing ? (
                        <>
                          <Field
                            label="My personal memory hook"
                            value={hookDraft}
                            onChangeText={setHookDraft}
                            multiline
                          />
                          <Button
                            disabled={!hookDraft.trim()}
                            onPress={() => {
                              onSave({
                                ...value,
                                hooks: {
                                  ...value.hooks,
                                  [cueKey]: hookDraft.trim().slice(0, 600),
                                },
                              });
                              setEditing(false);
                            }}
                          >
                            Save my hook
                          </Button>
                        </>
                      ) : (
                        <Button
                          small
                          secondary
                          onPress={() => {
                            setEditing(true);
                            setHookDraft(item.story);
                          }}
                        >
                          Make this cue my own
                        </Button>
                      )}
                      <Button
                        onPress={() => {
                          onSave({
                            ...value,
                            visited: Array.from(
                              new Set([...value.visited, value.stop]),
                            ),
                          });
                          setRecall(true);
                          setEditing(false);
                          setAnswer("");
                          setFeedback("");
                        }}
                      >
                        Hide cue & recall
                      </Button>
                    </>
                  )}
                </>
              )}
              {!!feedback && (
                <Text accessibilityLiveRegion="polite" style={s.label}>
                  {feedback}
                </Text>
              )}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

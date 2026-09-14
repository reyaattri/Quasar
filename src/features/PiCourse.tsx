import React, { useState } from "react";
import { View, Linking } from "react-native";
import { Button, Card, C, s, Tag, Text, Field } from "../components/ui";
import { SuccessBurst } from "../components/SuccessBurst";
import { piStops, piRooms, majorSounds, checkPiRecall } from "../data/piCourse";
import type { Progress } from "../lib/progress";

export function PiCourse({
  progress,
  onChange,
  onWorlds,
}: {
  progress: Progress;
  onChange: React.Dispatch<React.SetStateAction<Progress>>;
  onWorlds: () => void;
}) {
  const [room, setRoom] = useState<number | null>(null),
    [stop, setStop] = useState(0),
    [phase, setPhase] = useState<"learn" | "recall">("learn"),
    [input, setInput] = useState(""),
    [result, setResult] = useState<ReturnType<typeof checkPiRecall> | null>(
      null,
    ),
    [full, setFull] = useState(false),
    [show, setShow] = useState(true);
  const done = progress.piCourse?.rooms ?? [];
  const begin = (r: number) => {
    setRoom(r);
    setStop(0);
    setPhase("learn");
    setInput("");
    setResult(null);
    setFull(false);
    setShow(true);
  };
  if (room === null && !full)
    return (
      <View style={{ gap: 20 }}>
        <Tag>π · THE RIDICULOUS ROUTE</Tag>
        <Text style={s.title}>A hundred digits. Fifty impossible things.</Text>
        <Text style={s.body}>
          Start with 3. Memorise the next 100 decimal digits in ten rooms. π
          never ends; this is your first milestone, not “all of π”.
        </Text>
        <Card style={{ backgroundColor: C.yellow, gap: 12 }}>
          <Text style={s.h2}>Turn sounds into pictures</Text>
          <Text style={s.body}>
            Two digits become one object. 14 becomes tyre: T = 1, R = 4. Vowels
            do not count. Put the tyre at the flour door, make it do something
            ridiculous, then hide it and retrieve both digits.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {majorSounds.map((sound, i) => (
              <Tag key={i}>
                {i} = {sound}
              </Tag>
            ))}
          </View>
          <Text style={s.small}>
            Use consonant sounds, not spelling. CH is one sound; a silent letter
            adds nothing. Read every room from its entrance through the five
            named landmarks in order.
          </Text>
        </Card>
        {piRooms.map((r, i) => (
          <Card
            key={r[0]}
            style={{ gap: 10, backgroundColor: i % 2 ? C.sage : C.paper }}
          >
            <Tag>
              ROOM {i + 1} · DIGITS {i * 10 + 1}–{i * 10 + 10}
              {done.includes(i) ? " · RECALLED" : ""}
            </Tag>
            <Text style={s.h2}>{r[0]}</Text>
            <Text style={s.small}>{r.slice(1).join(" → ")}</Text>
            <Button onPress={() => begin(i)}>Enter π room {i + 1}</Button>
          </Card>
        ))}
        <Button
          onPress={() => {
            setFull(true);
            setPhase("recall");
            setInput("");
            setResult(null);
          }}
        >
          Recall all 100 digits
        </Button>
        <Button secondary onPress={onWorlds}>
          Practise the first pairs in the illustrated worlds
        </Button>
        <Text style={s.body}>
          After a successful recall, revisit tomorrow and several days later. If
          you miss a pair, strengthen its action at that exact location before
          extending your route.
        </Text>
        <Button
          secondary
          onPress={() =>
            Linking.openURL("https://artofmemory.com/blog/major-system/")
          }
        >
          How the Major System works ↗
        </Button>
      </View>
    );
  const r = room ?? 0,
    item = piStops[r * 5 + stop];
  return (
    <View style={{ gap: 18 }}>
      <Button
        secondary
        onPress={() => {
          setRoom(null);
          setFull(false);
        }}
      >
        All π rooms
      </Button>
      <Tag>
        {full ? "100-DIGIT RECALL" : `ROOM ${r + 1} · ${piRooms[r][0]}`}
      </Tag>
      {phase === "learn" ? (
        <>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {piRooms[r].slice(1).map((place, i) => (
              <View
                key={place}
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: i <= stop ? C.green : C.sage,
                  borderRadius: 4,
                }}
              />
            ))}
          </View>
          <Text style={s.title}>
            {stop + 1}. {item.location}
          </Text>
          <Text style={s.body}>
            Walk to the {item.location.toLowerCase()}. Imagine the following
            action happening right there, big enough to block your way.
          </Text>
          {show ? (
            <Card style={{ backgroundColor: C.peach, gap: 14 }}>
              <Tag>
                DIGITS {item.index * 2 + 1}–{item.index * 2 + 2}
              </Tag>
              <Text
                style={{
                  fontSize: 64,
                  lineHeight: 76,
                  color: C.ink,
                  textAlign: "center",
                }}
              >
                {item.pair}
              </Text>
              <Text style={s.h2}>{item.object}</Text>
              <Text style={s.body}>{item.story}</Text>
              <Text style={s.label}>{item.decode}</Text>
            </Card>
          ) : (
            <Card>
              <Text style={s.h2}>What just happened here?</Text>
              <Text style={s.body}>
                Picture the person, the object and the silly action. Say the
                object’s consonant sounds, then the two digits. Keep the
                location in the story.
              </Text>
            </Card>
          )}
          <Button secondary onPress={() => setShow(!show)}>
            {show ? "Hide the digits & scene" : "Reveal the digits & scene"}
          </Button>
          <Button
            onPress={() => {
              if (stop === 4) {
                setPhase("recall");
                setInput("");
                setResult(null);
              } else {
                setStop(stop + 1);
                setShow(true);
              }
            }}
          >
            {stop === 4 ? "Recall this room" : "Next π landmark"}
          </Button>
          {stop > 0 && (
            <Button
              secondary
              onPress={() => {
                setStop(stop - 1);
                setShow(true);
              }}
            >
              Previous π landmark
            </Button>
          )}
        </>
      ) : (
        <Card style={{ gap: 16 }}>
          <Text style={s.h2}>
            {full
              ? "Walk the whole route in your head."
              : "Five locations. Ten digits."}
          </Text>
          <Text style={s.body}>
            {full
              ? "Enter the first 100 digits after the decimal point. Leave out the initial 3."
              : `Enter decimal digits ${r * 10 + 1}–${r * 10 + 10} in order. No pictures this time; spaces between pairs are fine.`}
          </Text>
          <Field
            label="Digits from memory"
            value={input}
            onChangeText={(v) => {
              setInput(v);
              setResult(null);
            }}
            keyboardType="number-pad"
          />
          <Button
            onPress={() => {
              const answer = checkPiRecall(
                input,
                full ? 0 : r * 10,
                full ? 100 : 10,
              );
              setResult(answer);
              if (answer.correct)
                onChange((old) => ({
                  ...old,
                  piCourse: {
                    rooms: full
                      ? Array.from({ length: 10 }, (_, i) => i)
                      : Array.from(
                          new Set([...(old.piCourse?.rooms ?? []), r]),
                        ),
                    lastRecall: new Date().toISOString(),
                  },
                }));
            }}
          >
            Check my π recall
          </Button>
          {result && (
            <>
              <Text accessibilityLiveRegion="polite" style={s.body}>
                {result.correct
                  ? "Every digit is in the right place."
                  : `Not yet. Revisit ${piStops[Math.min(49, Math.floor(((full ? 0 : r * 10) + (result.wrong ?? 0)) / 2))].location}. Check the pair at position ${Math.floor((result.wrong ?? 0) / 2) + 1} in this answer.`}
              </Text>
              {result.correct ? (
                <>
                  <SuccessBurst label="π recalled, one ridiculous scene at a time!" />
                  {!full && r < 9 && (
                    <Button onPress={() => begin(r + 1)}>
                      Enter the next π room
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  secondary
                  onPress={() => {
                    setRoom(
                      full
                        ? Math.min(9, Math.floor((result.wrong ?? 0) / 10))
                        : r,
                    );
                    setStop(
                      Math.min(4, Math.floor(((result.wrong ?? 0) % 10) / 2)),
                    );
                    setFull(false);
                    setPhase("learn");
                    setShow(true);
                    setResult(null);
                  }}
                >
                  Revisit the missed landmark
                </Button>
              )}
            </>
          )}
        </Card>
      )}
    </View>
  );
}

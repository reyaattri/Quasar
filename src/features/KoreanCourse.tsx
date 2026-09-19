import React, { useEffect, useRef, useState } from "react";
import { Image, PanResponder, View, Linking } from "react-native";
import Svg, { Path, Circle, Text as SvgText, Rect } from "react-native-svg";
import * as Speech from "expo-speech";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
} from "expo-audio";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { AtlasArt } from "../components/StudyShelf";
import { readingPractice } from "../data/koreanPractice";
import { koreanAudio } from "../data/koreanAudio";

const letters = [
  {
    letter: "ㄴ",
    say: "나",
    name: "nieun",
    sound: "n",
    hook: "A cartoon nose bends down, then sticks out to the right: ㄴ. Nose starts with n. Listen to 나: n followed by a. The English nose is only the hook, not a Korean word.",
    paths: ["M80 60 L80 185 L205 185"],
  },
  {
    letter: "ㅁ",
    say: "마",
    name: "mieum",
    sound: "m",
    hook: "The hungry character opens a ridiculous square mouth: ㅁ. Mouth starts with m. To make the sound, close your lips and hum m, then open for a: 마.",
    paths: ["M75 65 L75 195", "M75 65 L205 65 L205 195", "M75 195 L205 195"],
  },
  {
    letter: "ㅏ",
    say: "아",
    name: "a",
    sound: "a, approximately ah",
    hook: "A tall singer opens one arm to the right and sings ah. The short stroke points right.",
    paths: ["M125 45 L125 220", "M125 125 L200 125"],
  },
  {
    letter: "ㅓ",
    say: "어",
    name: "eo",
    sound: "eo; listen to 어",
    hook: "The singer changes sides: the short arm points left. Listen to the vowel; English “uh” is only a rough reminder.",
    paths: ["M70 125 L145 125", "M145 45 L145 220"],
  },
  {
    letter: "ㅣ",
    say: "이",
    name: "i",
    sound: "i, approximately ee",
    hook: "A single tall elevator goes straight down while its passengers squeal ee. One stroke, no side arm.",
    paths: ["M140 45 L140 220"],
  },
  {
    letter: "ㅇ",
    say: "아",
    name: "ieung",
    sound: "silent at the start of a syllable; ng at the end",
    hook: "An empty ring saves a seat before a vowel: it is silent there. At the bottom of a syllable it rings ng. Same shape, different job depending on position.",
    paths: ["M140 60 C45 60 45 205 140 205 C235 205 235 60 140 60"],
  },
];
const storyBeats = [
  {
    title: "The starting corner · ㄱ",
    action:
      "Nari raises an L-shaped starter launcher. Its hard corner gives the shape ㄱ. The recording—not the English hint—is the sound target.",
    recall: "corner launcher · ㄱ",
    art: "corner",
  },
  {
    title: "The enormous nose · ㄴ",
    action:
      "The signal wakes a guard whose nose drops down and turns right. Trace the nose route: ㄴ. Nose supplies the n reminder.",
    recall: "bent nose · ㄴ",
    art: "nose",
  },
  {
    title: "The market door · ㄷ",
    action:
      "Nari throws open a three-sided market door. Top, side, floor: ㄷ. Door supplies the d reminder.",
    recall: "three-sided door · ㄷ",
    art: "door",
  },
  {
    title: "The rattlesnake escape · ㄹ",
    action:
      "A rattlesnake zigzags out of the doorway in four sharp turns. Its body draws ㄹ. Listen for the Korean r/l sound instead of forcing either English sound.",
    recall: "rattlesnake turns · ㄹ",
    art: "snake",
  },
  {
    title: "The square bucket · ㅂ",
    action:
      "Minho drops a square bucket over the snake, then straps a second bar across it. The trapped shape becomes ㅂ; bucket cues b.",
    recall: "barred bucket · ㅂ",
    art: "bucket",
  },
  {
    title: "The hill at midnight · ㅅ",
    action:
      "The snake escapes toward a steep hill. Two slopes meet at the summit and draw ㅅ. Summit supplies the s reminder.",
    recall: "hill summit · ㅅ",
    art: "hill",
  },
  {
    title: "Nothing at the summit · ㅇ",
    action:
      "Nari reaches the top and finds one perfectly round empty moon: ㅇ. It holds a silent place before a vowel and rings ng at the end.",
    recall: "empty round place · ㅇ",
    art: "moon",
  },
  {
    title: "The jump · ㅈ",
    action:
      "The snake returns, so Nari jumps from the hill. Add the jumper’s flat launch board above ㅅ and you get ㅈ, the j reminder.",
    recall: "jump board over hill · ㅈ",
    art: "jump",
  },
  {
    title: "The champion landing · ㅊ",
    action:
      "The jump is so high that Nari lands as champion. The medal ribbon adds one more short stroke above ㅈ: ㅊ, the ch reminder.",
    recall: "champion stripe · ㅊ",
    art: "champion",
  },
  {
    title: "The door collision · ㅋ",
    action:
      "Nari charges back toward the snake, misses, and hits the old ㄱ corner so hard that it splits into two rails: ㅋ, the stronger k sound.",
    recall: "split corner · ㅋ",
    art: "crash",
  },
  {
    title: "The pillar rescue · ㅍ",
    action:
      "Minho braces between twin pillars and two crossbeams. The whole pose draws ㅍ and gives the p reminder.",
    recall: "twin pillars · ㅍ",
    art: "pillars",
  },
  {
    title: "The surprise hat · ㅎ",
    action:
      "The roof pops loose and drops a round festival hat between two bars. Hat gives the h reminder and the final shape ㅎ.",
    recall: "festival hat · ㅎ",
    art: "hat",
  },
];
const scenes = [
  {
    person: "Jisoo · your neighbour",
    line: "안녕하세요",
    meaning: "Hello (polite)",
    tip: "Listen to the whole greeting, then echo it in a comfortable breath. You decide when to move on.",
    reply: "안녕하세요",
  },
  {
    person: "Minho · at the café",
    line: "뭐 드릴까요?",
    meaning: "What can I get you?",
    tip: "Ask for water: 물 주세요. 주세요 is a useful polite request ending: “please give me…”",
    reply: "물 주세요",
  },
  {
    person: "Jisoo · handing you your drink",
    line: "여기요",
    meaning: "Here you go.",
    tip: "Thank them with 감사합니다. Practise slowly first, then match the rhythm of the example.",
    reply: "감사합니다",
  },
];

function TracePad({ paths }: { paths: string[] }) {
  const [strokes, setStrokes] = useState<string[]>([]),
    [draft, setDraft] = useState(""),
    [guide, setGuide] = useState(true);
  const width = useRef(280),
    current = useRef("");
  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const { locationX: x, locationY: y } = e.nativeEvent;
      current.current = `M${(x * 280) / width.current} ${(y * 280) / width.current}`;
      setDraft(current.current);
    },
    onPanResponderMove: (e) => {
      const { locationX: x, locationY: y } = e.nativeEvent;
      current.current += ` L${Math.max(0, Math.min(280, (x * 280) / width.current))} ${Math.max(0, Math.min(280, (y * 280) / width.current))}`;
      setDraft(current.current);
    },
    onPanResponderRelease: () => {
      setStrokes((v) => [...v, current.current]);
      setDraft("");
    },
    onPanResponderTerminationRequest: () => false,
  });
  return (
    <View style={{ gap: 12 }}>
      <View
        {...responder.panHandlers}
        onLayout={(e) => {
          width.current = e.nativeEvent.layout.width;
        }}
        style={
          {
            width: "100%",
            aspectRatio: 1,
            backgroundColor: "#FFFDF5",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: C.line,
            touchAction: "none",
          } as any
        }
        accessibilityLabel="Finger tracing canvas"
      >
        <Svg width="100%" height="100%" viewBox="0 0 280 280">
          <Path
            d="M0 140H280M140 0V280"
            stroke={C.line}
            strokeDasharray="5 5"
          />
          {guide &&
            paths.map((d, i) => (
              <React.Fragment key={d}>
                <Path
                  d={d}
                  stroke="#C8CEB8"
                  strokeWidth={14}
                  fill="none"
                  strokeLinecap="round"
                />
                <SvgText x={20} y={25 + i * 22} fill={C.muted}>
                  Stroke {i + 1}
                </SvgText>
              </React.Fragment>
            ))}
          {[...strokes, draft].map((d, i) => (
            <Path
              key={i}
              d={d}
              stroke={C.green}
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>
      <Text style={s.small}>
        Follow the shown strokes in order. This is a practice canvas; it does
        not grade handwriting.
      </Text>
      <Button secondary onPress={() => setGuide(!guide)}>
        {guide ? "Hide guide & draw from memory" : "Show tracing guide"}
      </Button>
      <Button
        secondary
        onPress={() => {
          setStrokes([]);
          setDraft("");
        }}
      >
        Clear drawing
      </Button>
    </View>
  );
}

export function VoicePractice({
  phrase,
  listeningOnly = false,
}: {
  phrase: string;
  listeningOnly?: boolean;
}) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY),
    player = useAudioPlayer();
  const [recording, setRecording] = useState(false),
    [uri, setUri] = useState<string | null>(null),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(
    () => () => {
      Speech.stop();
      player.pause();
    },
    [],
  );
  const listen = async () => {
    try {
      await Speech.stop();
      if (koreanAudio[phrase]) {
        player.replace(koreanAudio[phrase]);
        await player.seekTo(0);
        player.play();
        setStatus("Listen first, then repeat at your own pace.");
        return;
      }
      const voices = await Speech.getAvailableVoicesAsync();
      const voice = voices.find((v) =>
        v.language.toLowerCase().startsWith("ko"),
      );
      if (!voice) {
        setStatus(
          "A Korean device voice is not available. Install a Korean text-to-speech voice in device settings, then try again.",
        );
        return;
      }
      Speech.speak(phrase, {
        language: "ko-KR",
        voice: voice.identifier,
        rate: 0.8,
        onError: () =>
          setStatus(
            "Audio could not play. You can retry without losing your place.",
          ),
      });
    } catch {
      setStatus("The voice could not start. Please try again.");
    }
  };
  const toggle = async () => {
    setBusy(true);
    try {
      if (recording) {
        await recorder.stop();
        setRecording(false);
        await setAudioModeAsync({ allowsRecording: false });
        setUri(recorder.uri);
        setStatus(
          recorder.uri
            ? "Listen back and compare. A recording is not a pronunciation score."
            : "No recording was saved. Please try again.",
        );
      } else {
        await Speech.stop();
        player.pause();
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) {
          setStatus(
            "Microphone access is off. You can still listen, trace, and continue.",
          );
          return;
        }
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync();
        recorder.record();
        setRecording(true);
        setStatus("Recording. Take your time, then tap Stop recording.");
      }
    } catch {
      setRecording(false);
      setStatus(
        "The microphone did not capture that. Retry whenever you are ready; your place is saved.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: 12 }}>
      <Button secondary disabled={recording || busy} onPress={listen}>
        Listen to the Korean example
      </Button>
      {!listeningOnly && (
        <Button disabled={busy} onPress={toggle}>
          {recording ? "Stop recording" : "Record my voice"}
        </Button>
      )}
      {uri && !recording && (
        <Button
          secondary
          onPress={async () => {
            try {
              player.replace(uri);
              await player.seekTo(0);
              player.play();
            } catch {
              setStatus("Playback failed. Try recording again.");
            }
          }}
        >
          Play my recording
        </Button>
      )}
      <Text accessibilityLiveRegion="polite" style={s.small}>
        {status ||
          "No timer. No automatic advance. Compare your voice with the example and retry as often as you like."}
      </Text>
    </View>
  );
}

function Host({ index }: { index: number }) {
  return (
    <Svg
      width="100%"
      height={180}
      viewBox="0 0 300 180"
      accessibilityLabel={
        index === 1
          ? "A café worker in a yellow apron"
          : "Your smiling conversation partner"
      }
    >
      <Rect
        x={0}
        y={0}
        width={300}
        height={180}
        rx={24}
        fill={index === 1 ? C.peach : C.sage}
      />
      <Path
        d="M95 180Q95 115 150 115Q205 115 205 180"
        fill={index === 1 ? C.yellow : "#7B9E98"}
      />
      <Circle cx={150} cy={76} r={45} fill="#E5B994" />
      <Path
        d="M105 72Q100 15 151 25Q205 20 195 76L180 51Q146 74 122 48Z"
        fill={C.ink}
      />
      <Circle cx={135} cy={79} r={3} fill={C.ink} />
      <Circle cx={167} cy={79} r={3} fill={C.ink} />
      <Path
        d="M139 99Q151 109 163 99"
        stroke={C.ink}
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M96 165L67 122M204 165L232 114"
        stroke="#E5B994"
        strokeWidth={15}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function KoreanFigure({
  index,
  height = 285,
}: {
  index: number;
  height?: number;
}) {
  if (index < 4) {
    return (
      <AtlasArt
        source={require("../../assets/korean-actions-transparent.png")}
        columns={3}
        rows={2}
        index={index}
        height={height}
        inset={0.94}
      />
    );
  }
  const source =
    index === 4
      ? require("../../assets/korean-elevator.png")
      : require("../../assets/korean-gong.png");
  return (
    <View
      testID="korean-figure-art"
      style={{ height, overflow: "hidden", alignItems: "center" }}
    >
      <Image
        accessible={false}
        source={source}
        resizeMode="contain"
        style={{ width: "94%", height: height + 24, marginTop: -18 }}
      />
    </View>
  );
}

function StoryBeatSketch({ index }: { index: number }) {
  const beat = storyBeats[index];
  const glyph = beat.recall.split(" · ").at(-1) || "";
  const drawings: Record<string, React.ReactNode> = {
    corner: (
      <>
        <Path
          d="M52 132V50h96"
          stroke={C.red}
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M40 132h120l-18 18H58z"
          fill={C.yellow}
          stroke={C.ink}
          strokeWidth={4}
        />
        <Circle
          cx={88}
          cy={93}
          r={13}
          fill={C.paper}
          stroke={C.ink}
          strokeWidth={4}
        />
      </>
    ),
    nose: (
      <>
        <Circle
          cx={87}
          cy={82}
          r={43}
          fill="#E5B994"
          stroke={C.ink}
          strokeWidth={4}
        />
        <Path
          d="M85 58v54h82"
          stroke={C.red}
          strokeWidth={17}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={70} cy={75} r={4} fill={C.ink} />
        <Path
          d="M61 99q15 12 28 0"
          stroke={C.ink}
          strokeWidth={4}
          fill="none"
        />
      </>
    ),
    door: (
      <>
        <Path
          d="M55 142V42h118v100"
          fill="#A96D45"
          stroke={C.ink}
          strokeWidth={6}
        />
        <Path
          d="M72 128V58h78v70"
          fill={C.peach}
          stroke={C.red}
          strokeWidth={9}
        />
        <Circle
          cx={137}
          cy={95}
          r={6}
          fill={C.yellow}
          stroke={C.ink}
          strokeWidth={3}
        />
      </>
    ),
    snake: (
      <>
        <Path
          d="M42 50h118v35H72v48h105"
          stroke={C.green}
          strokeWidth={22}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle
          cx={180}
          cy={133}
          r={16}
          fill={C.green}
          stroke={C.ink}
          strokeWidth={4}
        />
        <Circle cx={184} cy={128} r={2.5} fill={C.paper} />
        <Path
          d="M193 137l16 7-16 3"
          stroke={C.red}
          strokeWidth={3}
          fill="none"
        />
      </>
    ),
    bucket: (
      <>
        <Path
          d="M56 62h120l-14 82H70z"
          fill="#79A9C8"
          stroke={C.ink}
          strokeWidth={5}
        />
        <Path d="M70 82h92M65 113h102" stroke={C.red} strokeWidth={11} />
        <Path
          d="M71 62q45-55 91 0"
          stroke={C.ink}
          strokeWidth={5}
          fill="none"
        />
        <Path
          d="M151 45q26-17 32 5"
          stroke={C.green}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
    hill: (
      <>
        <Path
          d="M28 145L121 38l90 107z"
          fill="#8DB67C"
          stroke={C.ink}
          strokeWidth={5}
        />
        <Path d="M121 38l-18 23h36z" fill={C.paper} />
        <Path
          d="M74 117q38-25 49-61"
          stroke={C.yellow}
          strokeWidth={8}
          fill="none"
          strokeDasharray="6 7"
        />
        <Circle cx={74} cy={115} r={9} fill={C.red} />
      </>
    ),
    moon: (
      <>
        <Circle
          cx={120}
          cy={88}
          r={56}
          fill={C.yellow}
          stroke={C.ink}
          strokeWidth={5}
        />
        <Circle
          cx={120}
          cy={88}
          r={31}
          fill={C.peach}
          stroke={C.red}
          strokeWidth={9}
        />
        <Path
          d="M42 41l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z"
          fill={C.paper}
        />
      </>
    ),
    jump: (
      <>
        <Path
          d="M35 145L116 75l74 70z"
          fill="#8DB67C"
          stroke={C.ink}
          strokeWidth={5}
        />
        <Circle
          cx={119}
          cy={35}
          r={12}
          fill="#E5B994"
          stroke={C.ink}
          strokeWidth={4}
        />
        <Path
          d="M118 48l3 39m0-22-25-17m25 17 28-22m-28 44-26 30m26-30 31 28"
          stroke={C.red}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
    champion: (
      <>
        <Path
          d="M55 145L116 84l58 61z"
          fill="#8DB67C"
          stroke={C.ink}
          strokeWidth={5}
        />
        <Circle
          cx={120}
          cy={48}
          r={15}
          fill="#E5B994"
          stroke={C.ink}
          strokeWidth={4}
        />
        <Path
          d="M120 65v51m0-34-33-17m33 17 35-21m-35 55-29 27m29-27 30 27"
          stroke={C.red}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        <Circle
          cx={120}
          cy={83}
          r={12}
          fill={C.yellow}
          stroke={C.ink}
          strokeWidth={3}
        />
        <Path
          d="M105 25h30l-5 18h-20z"
          fill={C.yellow}
          stroke={C.ink}
          strokeWidth={3}
        />
      </>
    ),
    crash: (
      <>
        <Path
          d="M48 35v110h118V35z"
          fill="#A96D45"
          stroke={C.ink}
          strokeWidth={6}
        />
        <Path d="M35 88h145M95 28v120" stroke={C.red} strokeWidth={12} />
        <Path
          d="M170 55l18-14m-12 38 24-2m-28 25 18 14"
          stroke={C.yellow}
          strokeWidth={6}
        />
      </>
    ),
    pillars: (
      <>
        <Rect
          x={48}
          y={35}
          width={34}
          height={115}
          rx={8}
          fill="#BC8B58"
          stroke={C.ink}
          strokeWidth={5}
        />
        <Rect
          x={158}
          y={35}
          width={34}
          height={115}
          rx={8}
          fill="#BC8B58"
          stroke={C.ink}
          strokeWidth={5}
        />
        <Path d="M48 62h144M48 121h144" stroke={C.green} strokeWidth={12} />
        <Circle
          cx={120}
          cy={88}
          r={19}
          fill="#E5B994"
          stroke={C.ink}
          strokeWidth={4}
        />
      </>
    ),
    hat: (
      <>
        <Path d="M54 47h138M73 142h100" stroke={C.green} strokeWidth={12} />
        <Circle
          cx={123}
          cy={101}
          r={32}
          fill="#E5B994"
          stroke={C.ink}
          strokeWidth={4}
        />
        <Path
          d="M80 84q42-54 84 0z"
          fill={C.red}
          stroke={C.ink}
          strokeWidth={5}
        />
        <Path d="M72 84h102" stroke={C.yellow} strokeWidth={10} />
      </>
    ),
  };
  return (
    <View
      style={{ height: 260, alignItems: "center", justifyContent: "center" }}
    >
      <Svg
        width="100%"
        height="230"
        viewBox="0 0 300 190"
        accessibilityLabel={`${beat.title} memory drawing`}
      >
        <Rect
          x={4}
          y={4}
          width={292}
          height={180}
          rx={26}
          fill="#FFF8E8"
          stroke={C.line}
          strokeWidth={2}
        />
        <Path
          d="M32 158Q150 176 268 158"
          stroke={C.line}
          strokeWidth={3}
          fill="none"
          strokeDasharray="7 7"
        />
        {drawings[beat.art]}
        <Circle
          cx={235}
          cy={74}
          r={26}
          fill="#E5B994"
          stroke={C.ink}
          strokeWidth={4}
        />
        <Path
          d="M218 65q18-30 39 0M233 101v50m0-35l-27 23m27-23 28 20"
          stroke={C.ink}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
        <SvgText x={250} y={36} fill={C.ink} fontSize={26} fontWeight="700">
          {glyph}
        </SvgText>
      </Svg>
    </View>
  );
}

export function KoreanCourse() {
  const [mode, setMode] = useState<
      "story" | "letters" | "conversation" | "recall"
    >("story"),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState<string | null>(null);
  const [readingDone, setReadingDone] = useState(false);
  const item = letters[index % letters.length],
    scene = scenes[index % scenes.length];
  return (
    <View style={{ gap: 18 }}>
      <Tag color={C.peach}>THE KOREAN NEIGHBOURHOOD</Tag>
      <Text style={s.title}>See it. Trace it. Say it.</Text>
      <Text style={s.body}>
        First watch one ridiculous visual story. Then replay it with Korean
        sounds, trace each shape, and immediately read real syllable blocks.
        English cues start the memory; the Korean audio corrects the sound.
      </Text>
      <View style={{ gap: 10 }}>
        <Button
          secondary
          onPress={() => {
            setMode("story");
            setIndex(0);
          }}
        >
          Replay the picture story
        </Button>
        <Button
          secondary
          onPress={() => {
            setMode("letters");
            setIndex(0);
          }}
        >
          Letter workshop
        </Button>
        <Button
          secondary
          disabled={!readingDone}
          onPress={() => {
            setMode("conversation");
            setIndex(0);
          }}
        >
          {readingDone
            ? "Practise a conversation"
            : "Conversations unlock after reading practice"}
        </Button>
      </View>
      {mode === "story" ? (
        <Card style={{ gap: 16, backgroundColor: C.peach }}>
          <Tag>
            ACT I · PICTURE FIRST · {index + 1} OF {storyBeats.length}
          </Tag>
          <StoryBeatSketch index={index} />
          <Text style={s.h2}>{storyBeats[index].title}</Text>
          <Text style={s.body}>{storyBeats[index].action}</Text>
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: C.paper,
              borderRadius: 18,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={s.label}>{storyBeats[index].recall}</Text>
          </View>
          <Button
            onPress={() => {
              if (index === storyBeats.length - 1) {
                setMode("letters");
                setIndex(0);
              } else setIndex(index + 1);
            }}
          >
            {index === storyBeats.length - 1
              ? "Act II · attach the Korean sounds"
              : "What happens next?"}
          </Button>
        </Card>
      ) : mode === "letters" ? (
        <Card style={{ gap: 16 }}>
          <Tag>
            ACT II · SOUND PASS · LETTER {index + 1} OF {letters.length}
          </Tag>
          <Text style={{ fontSize: 72, textAlign: "center", color: C.ink }}>
            {item.letter}
          </Text>
          <Text style={s.h2}>
            {item.name} · {item.sound}
          </Text>
          <KoreanFigure index={index} />
          <Text style={s.body}>{item.hook}</Text>
          <TracePad key={index} paths={item.paths} />
          <VoicePractice
            key={`voice-${index}`}
            phrase={item.say}
            listeningOnly
          />
          <Text style={s.small}>
            First listen and read. For ㄴ and ㅁ, hear the consonant joined to
            a: 나 and 마. For ㅇ, hear 아: the initial ring is silent.
          </Text>
          <Button
            onPress={() => {
              if (index === letters.length - 1) {
                setMode("recall");
                setAnswer(null);
              } else {
                setIndex(index + 1);
                setAnswer(null);
              }
            }}
          >
            {index === letters.length - 1 ? "Build a syllable" : "Next letter"}
          </Button>
        </Card>
      ) : mode === "conversation" ? (
        <Card style={{ gap: 16 }}>
          <Tag>SCENE {index + 1} OF 3</Tag>
          <Host index={index} />
          <Text style={s.h2}>{scene.person}</Text>
          <Text style={s.h2}>{scene.line}</Text>
          <Text style={s.body}>{scene.meaning}</Text>
          <Text style={s.body}>{scene.tip}</Text>
          <Tag>YOUR TURN</Tag>
          <Text style={s.h2}>{scene.reply}</Text>
          <VoicePractice key={`scene-${index}`} phrase={scene.reply} />
          <Button
            onPress={() => {
              if (index === 2) {
                setMode("recall");
                setAnswer(null);
              } else setIndex(index + 1);
            }}
          >
            {index === 2
              ? "Recall what you learned"
              : "I’m ready for the next exchange"}
          </Button>
        </Card>
      ) : (
        <ReadingSteps
          onDone={() => {
            setReadingDone(true);
            setMode("conversation");
            setIndex(0);
          }}
        />
      )}
      <Button
        secondary
        onPress={() =>
          Linking.openURL("https://www.iksi.or.kr/lms/main/about.do")
        }
      >
        Continue with King Sejong Institute ↗
      </Button>
      <Text style={s.small}>
        Listen first, copy the mouth movement and rhythm, then record yourself
        when speaking unlocks.
      </Text>
    </View>
  );
}

function ReadingSteps({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [round, setRound] = useState(0);
  const [hint, setHint] = useState(true);
  const q = readingPractice[step],
    correct = answer === q.answer;
  return (
    <Card style={{ gap: 16, backgroundColor: C.sage }}>
      <Tag>
        READING ROUND {round + 1} · QUESTION {step + 1} OF{" "}
        {readingPractice.length}
      </Tag>
      <Text style={s.h2}>{q.prompt}</Text>
      {(hint || correct) && <Text style={s.body}>{q.explain}</Text>}
      <VoicePractice key={q.hear} phrase={q.hear} listeningOnly />
      <Text style={s.label}>
        Listen, then choose the matching shape or word.
      </Text>
      {hint ? (
        <Button onPress={() => setHint(false)}>Hide the hint & answer</Button>
      ) : (
        q.choices.map((choice, i) => (
          <Button
            key={choice}
            secondary
            disabled={correct}
            onPress={() => setAnswer(i)}
          >
            {choice}
          </Button>
        ))
      )}
      {answer !== null && (
        <Text accessibilityLiveRegion="polite" style={s.body}>
          {correct
            ? "That’s the connection."
            : "Try again. Say the parts slowly and look at where the vowel arm points."}
        </Text>
      )}
      {correct && (
        <Button
          onPress={() => {
            if (step === readingPractice.length - 1) {
              setRound(round + 1);
              setStep(0);
            } else setStep(step + 1);
            setAnswer(null);
            setHint(true);
          }}
        >
          {step === readingPractice.length - 1
            ? "Another reading round"
            : "Next reading question"}
        </Button>
      )}
      {correct && step === readingPractice.length - 1 && (
        <Button secondary onPress={onDone}>
          I can read these words · try a conversation
        </Button>
      )}
    </Card>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { PanResponder, View, Linking } from "react-native";
import Svg, { Path, Circle, Text as SvgText, Rect, Image as SvgImage, Defs, ClipPath } from "react-native-svg";
import * as Speech from "expo-speech";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
} from "expo-audio";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { readingPractice } from "../data/koreanPractice";
import { koreanAudio } from "../data/koreanAudio";

const storyBeats = [
  {
    title: "The gun · ㄱ",
    action:
      "A toy gun starts the story. Follow its barrel across the top, then down its grip. Gun is the g sound reminder.",
    recall: "ㄱ",
    atlas: 0,
    path: "M65 70 H205 V210",
  },
  {
    title: "The nose · ㄴ",
    action:
      "You smell something with your nose. Its outline goes down, then right. Nose reminds you of n.",
    recall: "ㄴ",
    atlas: 1,
    path: "M70 60 V205 H210",
  },
  {
    title: "The door · ㄷ",
    action:
      "You follow the smell and open the door. Trace its top, left side and bottom. Door reminds you of d.",
    recall: "ㄷ",
    atlas: 2,
    path: "M210 65 H70 V205 H210",
  },
  {
    title: "The rattlesnake · ㄹ",
    action:
      "Behind the door is a rattlesnake. Follow its squared bends across, down, back, down and across. Listen for the Korean r/l sound.",
    recall: "ㄹ",
    atlas: 3,
    path: "M65 65 H205 V135 H65 V205 H205",
  },
  {
    title: "The shocked mouth · ㅁ",
    action:
      "Your mouth opens wide in surprise: a square. Mouth reminds you of m.",
    recall: "ㅁ",
    atlas: -1,
    path: "M70 65 V205 H210 V65 Z",
  },
  {
    title: "The bucket · ㅂ",
    action:
      "You try to trap the snake with a bucket, but it escapes. The upright sides and two bars make the bucket cue for b.",
    recall: "ㅂ",
    atlas: 4,
    path: "M70 55 V210 H210 V55 M70 130 H210",
  },
  {
    title: "The summit · ㅅ",
    action:
      "You run up a hill to its summit. The two slopes meet at the top. Summit supplies the s reminder.",
    recall: "ㅅ",
    atlas: 5,
    path: "M65 210 L140 65 L215 210",
  },
  {
    title: "Nothing · ㅇ",
    action:
      "At the top you find nothing. Picture an empty circle. At the start of a syllable this letter is silent; at the end it sounds ng.",
    recall: "ㅇ",
    atlas: 6,
    path: "M140 65 C40 65 40 215 140 215 C240 215 240 65 140 65",
  },
  {
    title: "The jump · ㅈ",
    action:
      "Finding nothing, you jump. The outstretched arms sit above the two sloping legs. Jump supplies the j reminder.",
    recall: "ㅈ",
    atlas: 7,
    path: "M65 65 H215 M140 65 L65 210 M140 65 L215 210",
  },
  {
    title: "The champion · ㅊ",
    action:
      "Your jump makes you a champion. Add the champion’s short headband stroke above the jumper. Champion supplies ch.",
    recall: "ㅊ",
    atlas: 8,
    path: "M120 40 H160 M65 85 H215 M140 85 L65 220 M140 85 L215 220",
  },
  {
    title: "Back to the gun · ㅋ",
    action:
      "You return to face the snake. The video uses “kill” for the stronger k sound: a second stroke is added inside the gun corner. The toy gun fires water.",
    recall: "ㅋ",
    atlas: 9,
    path: "M65 65 H210 V215 M65 140 H210",
  },
  {
    title: "The door splits in two · ㅌ",
    action:
      "The shot misses and the door splits in two. Add a middle bar to the door shape. Two supplies the t reminder.",
    recall: "ㅌ",
    atlas: 2,
    path: "M210 65 H65 V215 H210 M65 140 H210",
  },
  {
    title: "The pillars · ㅍ",
    action:
      "You try to push the pillars apart. Two upright pillars stand between the top and bottom beams. Pillars supplies p.",
    recall: "ㅍ",
    atlas: 10,
    path: "M60 65 H220 M90 65 V215 M190 65 V215 M60 215 H220",
  },
  {
    title: "The mysterious hat · ㅎ",
    action:
      "Before you can push, a mysterious man in a hat appears. The hat’s band and brim sit above a round face. Hat supplies h.",
    recall: "ㅎ",
    atlas: 11,
    path: "M115 45 H165 M70 90 H210 M140 125 C65 125 65 220 140 220 C215 220 215 125 140 125",
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

function TracePad({
  paths,
  recall = false,
}: {
  paths: string[];
  recall?: boolean;
}) {
  const [strokes, setStrokes] = useState<string[]>([]),
    [draft, setDraft] = useState(""),
    [guide, setGuide] = useState(!recall);
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
        {recall
          ? "Draw from memory, then check your shape. This canvas does not automatically grade handwriting."
          : "Follow the shown strokes in order. This canvas does not grade handwriting."}
      </Text>
      {!recall && (
        <Button secondary onPress={() => setGuide(!guide)}>
          {guide ? "Hide guide & draw from memory" : "Show tracing guide"}
        </Button>
      )}
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

function StoryBeatSketch({ index }: { index: number }) {
  // Artwork has hand-composed gutters, not mathematically equal atlas cells.
  const frames = [
    [0, 0, 320, 306], [326, 0, 302, 306], [630, 0, 315, 306], [949, 0, 298, 306],
    [0, 308, 320, 299], [326, 308, 302, 299], [630, 308, 315, 299], [949, 308, 298, 299],
    [0, 610, 320, 300], [326, 610, 302, 300], [630, 610, 315, 300], [949, 610, 298, 300],
    [0, 913, 323, 348], [325, 913, 306, 348],
  ];
  const [x, y, width, height] = frames[index];
  return (
    <View
      accessibilityLabel={storyBeats[index].title + " illustrated memory scene"}
      style={{ width: "100%", minWidth: 0, gap: 12 }}
    >
      <View style={{ padding: 12, width: "100%", overflow: "hidden" }}>
        <Svg width="100%" height={260} viewBox={`${x} ${y} ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: "hidden" }}>
          <Defs><ClipPath id={`story-frame-${index}`}><Rect x={x} y={y} width={width} height={height} /></ClipPath></Defs>
          <SvgImage href={require("../../assets/korean-webtoon-story.png")} x={0} y={0} width={1247} height={1261} clipPath={`url(#story-frame-${index})`} />
        </Svg>
      </View>
      <Svg width="100%" height={130} viewBox="0 0 280 280">
        <Path
          d={storyBeats[index].path}
          stroke="#BA5143"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function KoreanCourse() {
  const [mode, setMode] = useState<
      "story" | "conversation" | "recall" | "reading"
    >("story"),
    [index, setIndex] = useState(0);
  const [readingDone, setReadingDone] = useState(false);
  const scene = scenes[index % scenes.length];
  return (
    <View style={{ gap: 18 }}>
      <Tag color={C.peach}>THE KOREAN NEIGHBOURHOOD</Tag>
      <Text style={s.title}>See it. Trace it. Say it.</Text>
      <Text style={s.body}>
        Follow the picture story, hear each Korean sound, and trace its shape.
        Then put the pictures away and draw what you remember.
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
        <Card style={{ gap: 16, backgroundColor: C.paper, minWidth: 0, padding: 18 }}>
          <Tag>
            PICTURE STORY · {index + 1} OF {storyBeats.length}
          </Tag>
          <StoryBeatSketch index={index} />
          <Text style={[s.h2, { flexShrink: 1 }]}>{storyBeats[index].title}</Text>
          <Text style={[s.body, { flexShrink: 1 }]}>{storyBeats[index].action}</Text>
          <VoicePractice
            key={`story-audio-${index}`}
            phrase={["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"][index]}
            listeningOnly
          />
          <TracePad key={`story-trace-${index}`} paths={[storyBeats[index].path]} />
          <Button
            onPress={() => {
              if (index === storyBeats.length - 1) {
                setMode("recall");
                setIndex(0);
              } else setIndex(index + 1);
            }}
          >
            {index === storyBeats.length - 1
              ? "Draw the story from memory"
              : "What happens next?"}
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
              } else setIndex(index + 1);
            }}
          >
            {index === 2
              ? "Recall what you learned"
              : "I’m ready for the next exchange"}
          </Button>
        </Card>
      ) : mode === "reading" ? (
        <ReadingSteps
          onDone={() => {
            setReadingDone(true);
            setMode("conversation");
            setIndex(0);
          }}
        />
      ) : (
        <DrawingRecall
          onDone={() => {
            setMode("reading");
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
    </View>
  );
}

function DrawingRecall({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const item = storyBeats[step];
  return (
    <Card style={{ gap: 16 }}>
      <Tag>
        DRAW FROM MEMORY · {step + 1} / {storyBeats.length}
      </Tag>
      <Text style={s.h2}>Draw the letter for {item.title.split(" · ")[0].toLowerCase()}.</Text>
      <Text style={s.body}>
        Remember its shape and sound. No picture or tracing guide this time.
      </Text>
      <TracePad key={step} paths={[]} recall />
      {checked && (
        <>
          <Text style={{ fontSize: 64, textAlign: "center" }}>
            {item.recall}
          </Text>
          <Text style={s.body}>
            {item.action} Compare the shape with your drawing.
          </Text>
        </>
      )}
      <Button
        onPress={() => {
          if (!checked) setChecked(true);
          else if (step === storyBeats.length - 1) onDone();
          else {
            setStep(step + 1);
            setChecked(false);
          }
        }}
      >
        {!checked
          ? "Check my drawing"
          : step === storyBeats.length - 1
            ? "Build words from these letters"
            : "Next recall"}
      </Button>
    </Card>
  );
}
function ReadingSteps({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [round, setRound] = useState(0);
  const [hint, setHint] = useState(false);
  const q = readingPractice[step],
    correct = answer === q.answer;
  return (
    <Card style={{ gap: 16, backgroundColor: C.sage }}>
      <Text style={s.body}>A quick reading key: ㅏ sounds like “ah”, ㅓ is eo, and ㅣ sounds like “ee”. Put a consonant beside a vowel: ㄴ + ㅏ = 나. An initial ㅇ is silent, so 아 starts with the vowel sound. Listen before choosing.</Text>
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
            setHint(false);
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

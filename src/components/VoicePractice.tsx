import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Speech from "expo-speech";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
} from "expo-audio";
import { Button, C, s, Text } from "./ui";
import { koreanAudio } from "../data/koreanAudio";

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

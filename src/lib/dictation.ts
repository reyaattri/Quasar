import { Platform } from "react-native";

const recognizer = (): any =>
  Platform.OS === "web" && typeof window !== "undefined"
    ? ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition)
    : undefined;

export const dictationSupported = () => !!recognizer();

export function startDictation(onText: (text: string) => void, onEnd: () => void) {
  const Recognition = recognizer();
  const rec = new Recognition();
  rec.lang = typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-US";
  rec.continuous = true;
  rec.interimResults = false;
  rec.onresult = (e: any) => {
    for (let i = e.resultIndex; i < e.results.length; i++)
      if (e.results[i].isFinal) onText(e.results[i][0].transcript.trim());
  };
  rec.onend = onEnd;
  rec.onerror = onEnd;
  rec.start();
  return () => rec.stop();
}

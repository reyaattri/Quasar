import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, View } from "react-native";
import { Button, C, Card, s, Text } from "../components/ui";
import { ToolkitArt } from "../components/ToolkitIcon";

import { toolkitConversations } from "../data/toolkitConversations";

export function ToolkitConversation({ index }: { index: number }) {
  const lesson = toolkitConversations[index];
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [peek, setPeek] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!active || reduce) return;
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
    return () => { active = false; fade.stopAnimation(); };
  }, [stage, fade]);
  const correct = answer === lesson.answer;
  return (
    <View style={{ gap: 18, minWidth: 0 }}>
      <Text style={s.h2}>{lesson.title}</Text>
      <Animated.View style={{ opacity: fade, gap: 16 }}>
        {(stage < 2 || peek || correct) && (
          <View accessibilityLabel={`${lesson.title} illustration`}>
            <ToolkitArt index={index} />
          </View>
        )}
        <View style={{ borderLeftWidth: 3, borderLeftColor: "#B8C8A7", paddingLeft: 17, gap: 9 }}>
          <Text style={[s.small, { color: C.green }]}>{lesson.host}</Text>
          <Text style={[s.body, { color: C.ink, fontSize: 18, lineHeight: 28 }]}>
            {stage === 0 ? lesson.hello : stage === 1 ? lesson.reveal : lesson.question}
          </Text>
        </View>
        {stage < 2 ? (
          <Button onPress={() => setStage(stage + 1)}>{stage === 0 ? "Show me how" : "Let me try without the picture"}</Button>
        ) : (
          <View style={{ gap: 10 }}>
            {lesson.choices.map((choice, i) => <Button key={choice} secondary disabled={correct} onPress={() => setAnswer(i)}>{choice}</Button>)}
            {answer !== null && <Card style={{ backgroundColor: correct ? C.sage : C.paper, gap: 10 }}>
              <Text accessibilityLiveRegion="polite" style={s.body}>{correct ? lesson.why : lesson.retry}</Text>
              {correct && <Text style={s.body}>{lesson.transfer}</Text>}
            </Card>}
            {!correct && <Button secondary onPress={() => setPeek(!peek)}>{peek ? "Hide the picture" : "Give me a glimpse"}</Button>}
            {correct && <Button secondary onPress={() => { setStage(0); setAnswer(null); setPeek(false); }}>Replay our conversation</Button>}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

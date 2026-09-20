import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { C, Text, s, Button } from "./ui";

type Day = { label: string; date: string; count: number; correct: number };
export function ProgressMobile({
  mastered,
  total,
  accuracy,
  streak,
  days,
  due,
  onReview,
}: {
  mastered: number;
  total: number;
  accuracy: number | null;
  streak: number;
  days: Day[];
  due: number;
  onReview: () => void;
}) {
  const [selected, setSelected] = useState(6);
  const fraction = total ? Math.min(1, mastered / total) : 0;
  const circumference = 2 * Math.PI * 79;
  const peak = Math.max(1, ...days.map((d) => d.count));
  const selectedDay = days[selected];
  const weekCount = days.reduce((sum, d) => sum + d.count, 0);
  return (
    <View style={{ gap: 24 }}>
      <View style={styles.cover}>
        <View style={[s.between, { marginBottom: 20 }]}>
          <Text style={styles.eyebrow}>QUASAR / FIELD JOURNAL</Text>
          <Text style={styles.eyebrow}>01</Text>
        </View>
        <Text style={styles.coverTitle}>
          Little by little,{"\n"}it stays with you.
        </Text>
        <View
          style={{ alignItems: "center", marginVertical: 22 }}
          accessibilityLabel={`${mastered} of ${total} vocabulary memories mastered`}
        >
          <Svg width={220} height={220} viewBox="0 0 220 220">
            <Circle
              cx={110}
              cy={110}
              r={102}
              fill="none"
              stroke="#63806B"
              strokeDasharray="1 9"
              strokeWidth={2}
            />
            <Circle
              cx={110}
              cy={110}
              r={79}
              fill="none"
              stroke="#45614F"
              strokeWidth={10}
            />
            <Circle
              cx={110}
              cy={110}
              r={79}
              fill="none"
              stroke={C.yellow}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={`${circumference * fraction} ${circumference}`}
              rotation={-90}
              origin="110,110"
            />
            <Path d="M191 36v14M184 43h14" stroke={C.yellow} strokeWidth={2} />
          </Svg>
          <View
            pointerEvents="none"
            style={{ position: "absolute", top: 56, alignItems: "center" }}
          >
            <Text style={{ fontSize: 60, lineHeight: 68, color: C.paper }}>
              {mastered}
            </Text>
            <Text style={{ fontSize: 13, color: "#DCE6D7" }}>
              of {total} memories
            </Text>
            <Text style={{ fontSize: 11, color: "#BBCBB8", marginTop: 5 }}>
              VOCABULARY MASTERED
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "#57715F",
            paddingTop: 18,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.metric}>
              {accuracy === null ? "—" : accuracy + "%"}
            </Text>
            <Text style={styles.metricLabel}>Recall accuracy</Text>
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 22,
              borderLeftWidth: 1,
              borderLeftColor: "#57715F",
            }}
          >
            <Text style={styles.metric}>
              {streak} <Text style={{ fontSize: 17 }}>days</Text>
            </Text>
            <Text style={styles.metricLabel}>Current streak</Text>
          </View>
        </View>
      </View>
      <View style={styles.paper}>
        <View style={s.between}>
          <View>
            <Text style={s.label}>YOUR PRACTICE RHYTHM</Text>
            <Text style={[s.h2, { marginTop: 6 }]}>A week in memory.</Text>
          </View>
          <Text style={{ fontSize: 38, color: C.green }}>{weekCount}</Text>
        </View>
        <Text style={s.small}>
          Vocabulary reviews in the last seven days. Tap a day.
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 7,
            marginTop: 20,
            alignItems: "flex-end",
          }}
        >
          {days.map((day, i) => (
            <Pressable
              key={day.date}
              accessibilityRole="button"
              accessibilityLabel={`${day.date}: ${day.count} reviews`}
              accessibilityState={{ selected: selected === i }}
              onPress={() => setSelected(i)}
              style={{ flex: 1, alignItems: "center", gap: 9 }}
            >
              <View
                style={{
                  height: 108,
                  width: "100%",
                  justifyContent: "flex-end",
                  backgroundColor: selected === i ? "#F6E8BE" : "#F0F1E8",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {day.count > 0 && (
                  <View
                    style={{
                      height: Math.max(14, (day.count / peak) * 108),
                      backgroundColor: selected === i ? C.green : "#9BB293",
                      borderRadius: 12,
                    }}
                  />
                )}
                {day.count === 0 && (
                  <View
                    style={{
                      height: 2,
                      marginHorizontal: 10,
                      marginBottom: 8,
                      backgroundColor: "#B4BDAC",
                    }}
                  />
                )}
              </View>
              <Text
                style={[s.small, { color: selected === i ? C.ink : C.muted }]}
              >
                {day.label}
              </Text>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: selected === i ? C.green : "transparent",
                }}
              />
            </Pressable>
          ))}
        </View>
        <View
          style={{
            marginTop: 16,
            borderTopWidth: 1,
            borderTopColor: C.line,
            paddingTop: 14,
            gap: 4,
          }}
          accessibilityLiveRegion="polite"
        >
          <Text style={s.label}>{selectedDay?.date}</Text>
          <Text style={s.body}>
            {selectedDay?.count
              ? `${selectedDay.correct} correct out of ${selectedDay.count} reviews.`
              : "No reviews recorded. Your next session starts a new mark."}
          </Text>
        </View>
      </View>
      <View style={styles.ticket}>
        <View
          style={{
            position: "absolute",
            top: -9,
            left: 22,
            width: 68,
            height: 18,
            backgroundColor: "#E3DAC5",
            transform: [{ rotate: "-6deg" }],
            opacity: 0.8,
          }}
        />
        <Text style={s.label}>YOUR NEXT SMALL STEP</Text>
        <Text style={[s.h2, { marginTop: 8 }]}>
          {due ? `${due} memories are ready.` : "Room for something new."}
        </Text>
        <Text style={[s.body, { marginTop: 8, marginBottom: 18 }]}>
          {due
            ? "Bring these pictures back before they fade."
            : "Your review queue is clear. Explore a lesson or revisit a favourite."}
        </Text>
        <Button onPress={onReview}>
          {due ? "Start my review" : "Explore a lesson"}
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  cover: {
    backgroundColor: "#254633",
    borderRadius: 28,
    borderBottomRightRadius: 70,
    padding: 24,
  },
  eyebrow: { color: "#D1DFC9", fontSize: 10, letterSpacing: 1.2 },
  coverTitle: {
    color: C.paper,
    fontSize: 29,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  metric: { color: C.paper, fontSize: 28, lineHeight: 34 },
  metricLabel: { color: "#D1DFC9", fontSize: 12, marginTop: 3 },
  paper: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: C.line,
  },
  ticket: {
    backgroundColor: "#F4DE9B",
    borderRadius: 20,
    padding: 24,
    borderBottomWidth: 3,
    borderBottomColor: "#D9BE75",
  },
});

import React from "react";
import { Image, View } from "react-native";

export type ActivityArtKind =
  | "today"
  | "recall"
  | "repair"
  | "teach"
  | "why"
  | "case"
  | "learn"
  | "notes";

const pictures: Record<ActivityArtKind, number> = {
  today: require("../../assets/learning-today-cartoon.png"),
  recall: require("../../assets/learning-review-cartoon.png"),
  repair: require("../../assets/learning-repair-cartoon.png"),
  teach: require("../../assets/learning-teachback-cartoon.png"),
  why: require("../../assets/learning-why-cartoon.png"),
  case: require("../../assets/learning-case-cartoon.png"),
  learn: require("../../assets/learning-new-cartoon.png"),
  notes: require("../../assets/learning-notes-cartoon.png"),
};

const labels: Record<ActivityArtKind, string> = {
  today: "A student races a clock along today's study route",
  recall: "An elephant librarian catches runaway memory cards",
  repair: "A raccoon mechanic repairs a cracked thought",
  teach: "A teacher explains a cell to a confused potato student",
  why: "A detective cat climbs a ladder made of questions",
  case: "An animal detective investigates a runaway test tube",
  learn: "A living cell city springs from an open book",
  notes: "A mouse runs a machine that turns notes into cards",
};

/** Generated editorial cartoons for Quasar's learning loop. */
export function LearningActivityArt({
  kind,
  height = 112,
}: {
  kind: ActivityArtKind;
  height?: number;
}) {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={labels[kind]}
      style={{ width: "100%", height, overflow: "hidden" }}
    >
      <Image
        source={pictures[kind]}
        resizeMode="contain"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}

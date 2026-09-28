import React from "react";
import { View } from "react-native";
import { Text, s } from "./ui";
import { QuasarMark } from "./QuasarMark";
export function PlusSignature({ compact = false }: { compact?: boolean }) {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
        <View
          style={{
            padding: 8,
            borderWidth: 1,
            borderColor: "#BC9659",
            borderRadius: compact ? 18 : 30,
            backgroundColor: "#F5E8CB",
          }}
        >
          <QuasarMark size={compact ? 56 : 100} />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ color: "#E5C58B", fontSize: 11, letterSpacing: 3 }}>
            QUASAR PLUS
          </Text>
          <Text
            style={[s.h2, { color: "#FFF5DF", fontSize: compact ? 23 : 30 }]}
          >
            {compact
              ? "A little more wonder."
              : "A universe of ways to remember."}
          </Text>
        </View>
      </View>
      {!compact && (
        <View style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}>
          {[
            ["NEON", "#95D8D2", 3],
            ["STORYBOOK", "#DBD9B1", 20],
            ["PIXEL", "#E9BE72", 0],
            ["INK & WIT", "#DFC4D6", 8],
          ].map(([label, color, radius]) => (
            <View
              key={String(label)}
              style={{
                paddingVertical: 9,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: String(color),
                borderRadius: Number(radius),
                backgroundColor: "#263C3D",
              }}
            >
              <Text
                style={{ fontSize: 10, letterSpacing: 1, color: String(color) }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

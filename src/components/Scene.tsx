import { Text } from "./ui";
import { art } from "../data/art";
import React, { useState } from "react";
import { View, Image, Pressable, StyleSheet } from "react-native";
import { type SceneData, type ArtStyle, type Fact } from "../data/content";
import { C, Icon, s } from "./ui";
export function Scene({
  scene,
  style,
  mastered,
  onSelect,
}: {
  scene: SceneData;
  style: ArtStyle;
  mastered: Record<string, boolean>;
  onSelect: (f: Fact) => void;
}) {
  return (
    <View style={{ gap: 16 }}>
      <View style={styles.canvas}>
        <Image
          source={art[scene.id as keyof typeof art][style]}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
          accessibilityLabel={scene.title + " illustrated memory route"}
        />
        {scene.facts.map((f, i) => (
          <Pressable
            key={f.id}
            accessibilityRole="button"
            accessibilityLabel={
              "Explore " + f.word + (mastered[f.id] ? ", mastered" : "")
            }
            onPress={() => onSelect(f)}
            style={[
              styles.hotspot,
              { left: (f.x + "%") as any, top: (f.y + 10 + "%") as any },
              mastered[f.id] && styles.done,
            ]}
          >
            {mastered[f.id] ? (
              <Icon name="check" size={17} color={C.white} />
            ) : (
              <Text style={{ fontWeight: "800", color: C.ink, fontSize: 14 }}>
                {i + 1}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
      <View style={styles.legend}>
        {scene.facts.map((f, i) => (
          <Pressable
            key={f.id}
            accessibilityRole="button"
            onPress={() => onSelect(f)}
            style={styles.legendItem}
          >
            <View
              style={[
                styles.mini,
                mastered[f.id] && { backgroundColor: C.green },
              ]}
            >
              {mastered[f.id] ? (
                <Icon name="check" size={12} color={C.white} />
              ) : (
                <Text style={s.small}>{i + 1}</Text>
              )}
            </View>
            <Text style={s.label}>{f.word}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function FactImage({ fact, style }: { fact: Fact; style: ArtStyle }) {
  const [w, setW] = useState(340);
  const imageWidth = w * 3;
  const imageHeight = imageWidth / 1.5;
  return (
    <View
      style={{
        height: 190,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: C.paper,
      }}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      <Image
        source={art[fact.sceneId as keyof typeof art][style]}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: imageWidth,
          height: imageHeight,
          left: w / 2 - (fact.x / 100) * imageWidth,
          top: 95 - (fact.y / 100) * imageHeight,
        }}
        accessibilityLabel={fact.cue}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F5F1E4",
    borderColor: C.line,
    borderWidth: 1,
  },
  hotspot: {
    position: "absolute",
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: C.white,
    backgroundColor: C.yellow,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px #293B3033",
  },
  done: { backgroundColor: C.green, opacity: 0.8 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  legendItem: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: C.white,
    minHeight: 44,
  },
  mini: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.sage,
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { useState } from "react";
import { Image, ImageSourcePropType, Pressable, View } from "react-native";
import { C, Icon, s, Tag, Text } from "./ui";
export function AtlasArt({
  source,
  columns,
  rows,
  index,
  height = 210,
  inset = 1,
}: {
  source: ImageSourcePropType;
  columns: number;
  rows: number;
  index: number;
  height?: number;
  inset?: number;
}) {
  const [width, setWidth] = useState(250),
    cw = 1536 / columns,
    ch = 1024 / rows,
    scale = Math.min(width / cw, height / ch) * inset;
  return (
    <View
      testID="atlas-art"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height, overflow: "hidden", width: "100%" }}
    >
      <View
        style={{
          position: "absolute",
          width: cw * scale,
          height: ch * scale,
          left: (width - cw * scale) / 2,
          top: (height - ch * scale) / 2,
          overflow: "hidden",
        }}
      >
        <Image
          accessible={false}
          resizeMode="stretch"
          source={source}
          style={{
            position: "absolute",
            width: 1536 * scale,
            height: 1024 * scale,
            left: -(index % columns) * cw * scale,
            top: -Math.floor(index / columns) * ch * scale,
          }}
        />
      </View>
    </View>
  );
}
export function StudyShelf({
  onSat,
  onWorlds,
  onMedical,
}: {
  onSat: () => void;
  onWorlds: () => void;
  onMedical: () => void;
}) {
  const entries = [
    {
      tag: "WORDS WITH PERSONALITY",
      title: "A loose lid. A lucid idea.",
      body: "Ridiculous cartoons → recall → a question in context.",
      note: "10 words · two five-word sessions",
      color: C.yellow,
      source: require("../../assets/sat-cartoons-user-selected.png"),
      columns: 5,
      rows: 2,
      index: 0,
      onPress: onSat,
      label: "Start a five-word session",
    },
    {
      tag: "MEMORY WORLDS",
      title: "Your next thought lives here.",
      body: "Walk inside. Give pi or your shopping list a place to stay.",
      note: "3 worlds · your own memory hooks",
      color: C.sage,
      source: require("../../assets/palace-interiors.png"),
      columns: 3,
      rows: 1,
      index: 0,
      onPress: onWorlds,
      label: "Explore memory worlds",
    },
    {
      tag: "BIOLOGY FOUNDATIONS",
      title: "A whole world fits inside a cell.",
      body: "Meet open-workshop bacteria, solar-bark trees and DNA packed like an impossible suitcase.",
      note: "3 lessons · mini labs · real structures",
      color: C.peach,
      source: require("../../assets/bio-cells-world.png"),
      columns: 3,
      rows: 2,
      index: 0,
      onPress: onMedical,
      label: "Explore biology foundations",
    },
  ];
  return (
    <View style={{ gap: 18 }}>
      {entries.map((e, i) => (
        <Pressable
          key={e.tag}
          accessibilityRole="button"
          accessibilityLabel={e.label}
          onPress={e.onPress}
          style={({ pressed }) => ({
            backgroundColor: e.color,
            borderRadius: i === 1 ? 36 : 18,
            borderBottomRightRadius: i === 0 ? 52 : 24,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: C.ink,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          })}
        >
          <View style={{ padding: 20, gap: 10 }}>
            <Tag>{e.tag}</Tag>
            <Text style={[s.h2, { fontSize: 29, lineHeight: 33 }]}>
              {e.title}
            </Text>
          </View>
          <AtlasArt
            source={e.source}
            columns={e.columns}
            rows={e.rows}
            index={e.index}
            height={i === 1 ? 260 : 220}
          />
          <View style={{ padding: 20, gap: 12 }}>
            <Text style={s.body}>{e.body}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text style={[s.small, { flex: 1 }]}>{e.note}</Text>
              <View
                style={{
                  backgroundColor: C.paper,
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <Icon name="arrow" />
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

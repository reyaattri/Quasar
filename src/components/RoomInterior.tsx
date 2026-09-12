import React, { useState } from "react";
import { Image, Text, View } from "react-native";

const roomSheets = [
  require("../../assets/rooms-dojo.png"),
  require("../../assets/rooms-egypt.png"),
  require("../../assets/rooms-neon.png"),
];
const objectSheets = [
  require("../../assets/objects-dojo.png"),
  require("../../assets/objects-egypt.png"),
  require("../../assets/objects-neon.png"),
];

export function RoomInterior({
  world,
  stop,
  width,
  height,
}: {
  world: number;
  stop: number;
  width: number;
  height: number;
}) {
  const safeWorld = Math.max(0, Math.min(roomSheets.length - 1, world));
  const safeStop = Math.max(0, Math.min(5, stop));
  const panel = Math.max(width, height);
  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <Image
        source={roomSheets[safeWorld]}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: panel * 3,
          height: panel * 2,
          left: -(safeStop % 3) * panel + (width - panel) / 2,
          top: -Math.floor(safeStop / 3) * panel + (height - panel) / 2,
        }}
      />
    </View>
  );
}

export function RoomMemoryPicture({
  world,
  journeyId,
  itemIndex,
  symbol,
  label,
}: {
  world: number;
  stop: number;
  anchor: number;
  journeyId: string;
  itemIndex: number;
  symbol: string;
  label: string;
}) {
  const [width, setWidth] = useState(286);
  const source = objectSheets[Math.max(0, Math.min(2, world))];
  // Dojo/Egypt sheets are 1536×1024; the neon sheet is square.
  const ratio = world === 2 ? 2 / 3 : 1;
  const height = Math.min(300, width / ratio);
  const pictureWidth = height * ratio;
  return (
    <View
      accessibilityLabel={`Memory picture: ${label}`}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{
        width: "100%",
        height,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#29483C",
        backgroundColor: "#F8EEDC",
      }}
    >
      {journeyId === "pi" ? (
        <Image
          source={source}
          resizeMode="stretch"
          style={{
            position: "absolute",
            width: pictureWidth * 3,
            height: height * 2,
            left: -(itemIndex % 3) * pictureWidth + (width - pictureWidth) / 2,
            top: -Math.floor(itemIndex / 3) * height,
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: itemIndex % 2 ? "#DCE8CA" : "#F5DCA8",
          }}
        >
          <Text style={{ fontSize: 78 }}>{symbol}</Text>
          <Text style={{ fontSize: 15, fontWeight: "800", color: "#29483C" }}>
            MAKE IT MOVE · HEAR IT · FEEL IT
          </Text>
        </View>
      )}
      <View
        style={{
          position: "absolute",
          left: 9,
          right: 9,
          bottom: 8,
          paddingVertical: 7,
          paddingHorizontal: 10,
          borderRadius: 14,
          backgroundColor: "#FFFCEDD9",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "800",
            color: "#203C32",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

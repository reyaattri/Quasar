import React, { useState } from "react";
import { Image, Text, View } from "react-native";

const roomSheets = [
  require("../../assets/rooms-dojo.png"),
  require("../../assets/rooms-egypt.png"),
  require("../../assets/rooms-neon.png"),
];
const objectSheets = [
  require("../../assets/objects-dojo-human.png"),
  require("../../assets/objects-egypt-approved.png"),
  require("../../assets/objects-neon-human.png"),
];
const landmarkSheets = [
  require("../../assets/landmarks-dojo-distinct.png"),
  require("../../assets/landmarks-egypt-distinct.png"),
  require("../../assets/landmarks-neon-distinct.png"),
];

// Bounds follow the actual panel dividers, which are not perfectly equal in generated sheets.
export function roomBounds(world: number, stop: number) {
  const col = Math.max(0, Math.min(5, stop)) % 3;
  const row = stop < 3 ? 0 : 1;
  const xs =
    world === 2
      ? [
          [0, 505],
          [515, 1017],
          [1027, 1536],
        ]
      : [
          [0, 512],
          [512, 1024],
          [1024, 1536],
        ];
  const ys =
    world === 2
      ? [
          [0, 485],
          [495, 1024],
        ]
      : [
          [0, 512],
          [512, 1024],
        ];
  return {
    x: xs[col][0],
    y: ys[row][0],
    w: xs[col][1] - xs[col][0],
    h: ys[row][1] - ys[row][0],
  };
}
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
  const bounds = roomBounds(world, stop);
  const scale = Math.min(width / bounds.w, height / bounds.h);
  return (
    <View testID="room-art" style={{ width, height, overflow: "hidden" }}>
      <Image
        source={roomSheets[Math.max(0, Math.min(2, world))]}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: 1536 * scale,
          height: 1024 * scale,
          left: -bounds.x * scale,
          top: -bounds.y * scale,
        }}
      />
    </View>
  );
}
export function RoomAtmosphere({
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
  const bounds = roomBounds(world, stop),
    scale = Math.max(width / bounds.w, height / bounds.h);
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: 0.24,
      }}
    >
      <Image
        accessible={false}
        blurRadius={24}
        source={roomSheets[world]}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: 1536 * scale,
          height: 1024 * scale,
          left: (width - bounds.w * scale) / 2 - bounds.x * scale,
          top: (height - bounds.h * scale) / 2 - bounds.y * scale,
        }}
      />
    </View>
  );
}

export function RoomMemoryPicture({
  world,
  anchor,
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
  const extra = anchor > 0;
  const source = (extra ? landmarkSheets : objectSheets)[
    Math.max(0, Math.min(2, world))
  ];
  const col = itemIndex % 3,
    row = Math.floor(itemIndex / 3);
  const xs = [
    [0, 512],
    [512, 1024],
    [1024, 1536],
  ];
  const ys = [
    [0, 512],
    [512, 1024],
  ];
  let bounds = {
    x: xs[col][0],
    y: ys[row][0],
    w: xs[col][1] - xs[col][0],
    h: ys[row][1] - ys[row][0],
  };
  if (extra) {
    const panel = itemIndex * 2 + anchor - 1,
      extraRow = Math.floor(panel / 4);
    const edges =
      world === 0
        ? [0, 338, 678, 1024]
        : world === 1
          ? [0, 344, 677, 1024]
          : [0, 341, 683, 1024];
    bounds = {
      x: (panel % 4) * 384,
      y: edges[extraRow],
      w: 384,
      h: edges[extraRow + 1] - edges[extraRow],
    };
  }
  const ratio = bounds.w / bounds.h;
  const height = Math.min(360, Math.max(1, width - 4) / ratio);
  const pictureWidth = height * ratio;
  return (
    <View
      testID="memory-art"
      accessibilityLabel={`Memory picture: ${label}`}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{
        width: "100%",
        height: height + 4,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#29483C",
        backgroundColor: "#F8EEDC",
      }}
    >
      {journeyId === "pi" ? (
        <View style={{ width: pictureWidth, height, overflow: "hidden" }}>
          <Image
            source={source}
            resizeMode="stretch"
            style={{
              position: "absolute",
              width: (1536 * pictureWidth) / bounds.w,
              height: (1024 * height) / bounds.h,
              left: (-bounds.x * pictureWidth) / bounds.w,
              top: (-bounds.y * height) / bounds.h,
            }}
          />
        </View>
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
    </View>
  );
}

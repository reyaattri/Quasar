import { RoomInterior, RoomAtmosphere, roomBounds } from "./RoomInterior";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  AppState,
  Image,
  Platform,
  Pressable,
  View,
} from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { C, s, Text } from "./ui";
import { PixelButton } from "./PixelButton";
import { EncounterMotion } from "./EncounterMotion";
type Point = { x: number; y: number };
export function Walker({
  frame = 0,
  moving = false,
}: {
  frame?: number;
  moving?: boolean;
}) {
  const step = moving ? Math.sin(frame / 4) * 4 : 0;
  return (
    <Svg width={42} height={58} viewBox="0 0 42 58">
      <Ellipse cx={21} cy={54} rx={15} ry={3} fill="#17352A" opacity={0.25} />
      <Path
        d={`M16 35 L${15 + step} 50 M26 35 L${27 - step} 50`}
        stroke="#594D40"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <Path
        d={`M${15 + step} 51h-5 M${27 - step} 51h5`}
        stroke="#28382E"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Rect
        x={10}
        y={22}
        width={22}
        height={19}
        rx={6}
        fill="#568C6C"
        stroke="#253B2C"
        strokeWidth={2}
      />
      <Path
        d={`M10 25L${7 - step} 36 M32 25L${35 + step} 35`}
        stroke="#E4B489"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Circle
        cx={21}
        cy={15}
        r={11}
        fill="#EDC59C"
        stroke="#483C32"
        strokeWidth={1.5}
      />
      <Path
        d="M9 14Q6 1 18 3Q28 -2 33 10L29 14 26 9 21 14 16 10 12 16Z"
        fill="#453B30"
      />
      <Circle cx={17} cy={16} r={1.3} fill="#302B25" />
      <Circle cx={25} cy={16} r={1.3} fill="#302B25" />
      <Path d="M18 21q3 3 6 0" stroke="#795140" fill="none" />
      <Path d="M29 23 13 39" stroke="#C18750" strokeWidth={3} />
      <Rect x={7} y={32} width={10} height={9} rx={2} fill="#C18750" />
    </Svg>
  );
}
export function PalaceGame({
  world,
  points,
  stop,
  recalled,
  onArrive,
  onTravel,
  onInspect,
  onEnterRoom,
  paused = false,
  room = false,
  labels,
  roomIndex = 0,
  memoryLabel,
  concealed = false,
}: {
  world: number;
  points: Point[];
  stop: number;
  recalled: number[];
  onArrive: (stop: number) => void;
  onTravel: () => void;
  onInspect: () => void;
  onEnterRoom: () => void;
  paused?: boolean;
  room?: boolean;
  labels?: string[];
  roomIndex?: number;
  memoryLabel?: string;
  concealed?: boolean;
}) {
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(700);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const [pos, setPos] = useState<Point>(room ? { x: 50, y: 86 } : points[stop]);
  const [frame, setFrame] = useState(0);
  const [walking, setWalking] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const state = useRef({
    pos: room ? { x: 50, y: 86 } : points[stop],
    direction: { x: 0, y: 0 },
    target: null as number | null,
    near: stop,
    frame: 0,
    reduced: false,
  });
  const callbacks = useRef({ onArrive, onTravel, points });
  callbacks.current = { onArrive, onTravel, points };
  useEffect(() => {
    if (paused) {
      state.current.target = null;
      state.current.direction = { x: 0, y: 0 };
      setTargetIndex(null);
    }
  }, [paused]);
  useEffect(() => {
    state.current.pos = room ? { x: 50, y: 86 } : points[stop];
    state.current.target = null;
    state.current.near = room ? -1 : stop;
    setPos(state.current.pos);
    setTargetIndex(null);
  }, [world, points.length]);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      state.current.reduced = v;
    });
    const motion = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (v) => {
        state.current.reduced = v;
      },
    );
    const release = () => {
      state.current.direction = { x: 0, y: 0 };
      state.current.target = null;
      setTargetIndex(null);
    };
    const app = AppState.addEventListener("change", (status) => {
      if (status !== "active") release();
    });
    let previous = Date.now();
    const timer = setInterval(() => {
      const now = Date.now(),
        dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const current = state.current;
      if (pausedRef.current) {
        current.direction = { x: 0, y: 0 };
        current.target = null;
        setWalking(false);
        return;
      }
      let dx = current.direction.x,
        dy = current.direction.y;
      if (current.target !== null) {
        const destination = callbacks.current.points[current.target];
        const dist = Math.hypot(
          destination.x - current.pos.x,
          destination.y - current.pos.y,
        );
        if (dist < 0.9) {
          current.pos = { ...destination };
          current.near = current.target;
          callbacks.current.onArrive(current.target);
          current.target = null;
          setTargetIndex(null);
          setPos({ ...current.pos });
          setWalking(false);
          return;
        }
        dx = (destination.x - current.pos.x) / dist;
        dy = (destination.y - current.pos.y) / dist;
      }
      const moving = dx !== 0 || dy !== 0;
      setWalking(moving);
      if (!moving) return;
      current.pos = {
        x: Math.max(4, Math.min(96, current.pos.x + dx * dt * 16)),
        y: Math.max(5, Math.min(94, current.pos.y + dy * dt * 16)),
      };
      const nearest = callbacks.current.points.findIndex(
        (p) => Math.hypot(p.x - current.pos.x, p.y - current.pos.y) < 4,
      );
      if (nearest !== current.near) {
        current.near = nearest;
        if (nearest >= 0 && current.target === null)
          callbacks.current.onArrive(nearest);
        else callbacks.current.onTravel();
      }
      current.frame++;
      setPos({ ...current.pos });
      setFrame(current.reduced ? 0 : current.frame);
    }, 33);
    const keys: Record<string, Point> = {
      ArrowUp: { x: 0, y: -1 },
      w: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      s: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      a: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      d: { x: 1, y: 0 },
    };
    const down = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches?.(
          'input,textarea,button,[role="button"]',
        )
      )
        return;
      if (keys[e.key]) {
        e.preventDefault();
        currentDirection(keys[e.key]);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (keys[e.key]) state.current.direction = { x: 0, y: 0 };
    };
    function currentDirection(direction: Point) {
      state.current.target = null;
      setTargetIndex(null);
      state.current.direction = direction;
    }
    if (Platform.OS === "web") {
      window.addEventListener("keydown", down);
      window.addEventListener("keyup", up);
      window.addEventListener("blur", release);
    }
    return () => {
      clearInterval(timer);
      motion.remove();
      app.remove();
      if (Platform.OS === "web") {
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
        window.removeEventListener("blur", release);
      }
    };
  }, []);
  // Artwork and interaction share one aspect-preserving scene rectangle.
  const bounds = roomBounds(world, roomIndex);
  const sceneRatio = room ? bounds.w / bounds.h : 0.5;
  // Controls float over the lower scene, so the illustration can use the whole game surface.
  const availableHeight = Math.max(100, height);
  // World maps use a cover fit: a narrow phone crops a sliver from the top and
  // bottom instead of exposing side gutters. Room panels keep their square
  // proportions and extend their own blurred atmosphere below the artwork.
  const mapW = room ? Math.min(width, availableHeight * sceneRatio) : width;
  const mapH = mapW / sceneRatio;
  const sceneLeft = (width - mapW) / 2;
  const sceneTop = room ? 18 : (availableHeight - mapH) / 2;
  const walkTo = (index: number) => {
    state.current.target = index;
    state.current.direction = { x: 0, y: 0 };
    setTargetIndex(index);
    onTravel();
  };
  const direction = (x: number, y: number) => {
    state.current.target = null;
    setTargetIndex(null);
    state.current.direction = { x, y };
  };
  return (
    <View
      aria-hidden={concealed}
      pointerEvents={concealed ? "none" : "auto"}
      style={{ flex: 1, opacity: concealed ? 0 : 1 }}
    >
      <View
        onLayout={(e) => {
          setWidth(e.nativeEvent.layout.width);
          setHeight(e.nativeEvent.layout.height);
        }}
        style={{
          flex: 1,
          overflow: "hidden",
          borderRadius: 0,
          backgroundColor: ["#DCE8CA", "#F4D59E", "#242039"][world],
        }}
      >
        <RoomAtmosphere
          world={world}
          stop={room ? roomIndex : 0}
          width={width}
          height={height}
        />
        <View
          testID="palace-scene"
          style={{
            position: "absolute",
            width: mapW,
            height: mapH,
            left: sceneLeft,
            top: sceneTop,
            borderRadius: room ? 14 : 6,
            overflow: "hidden",
          }}
        >
          <View style={{ width: mapW, height: mapH, overflow: "hidden" }}>
            {room ? (
              <RoomInterior
                world={world}
                stop={roomIndex}
                width={mapW}
                height={mapH}
              />
            ) : (
              <Image
                resizeMode="stretch"
                accessible={false}
                source={require("../../assets/palace-worlds.png")}
                style={{
                  position: "absolute",
                  width: mapW * 3,
                  height: mapH,
                  left: -world * mapW,
                }}
              />
            )}
          </View>
          {points.map((point, i) => (
            <View
              key={`motion-${i}`}
              pointerEvents="none"
              style={{
                position: "absolute",
                left: (point.x / 100) * mapW - 14,
                top: (point.y / 100) * mapH - 48,
              }}
            >
              <EncounterMotion variant={i}>
                <Svg width={28} height={25} viewBox="0 0 28 25">
                  {room && roomIndex === 2 ? (
                    <Path
                      d="M14 23Q3 18 5 7Q17 6 14 23M14 23Q14 5 26 3Q29 18 14 23"
                      fill={world === 2 ? "#8DE3DE" : "#578B57"}
                    />
                  ) : (
                    <Path
                      d="M14 2L17 10L25 13L17 16L14 24L11 16L3 13L11 10Z"
                      fill="#F8DC90"
                    />
                  )}
                </Svg>
              </EncounterMotion>
            </View>
          ))}
          {points.map((point, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={
                room && i === (recalled[0] ?? 0)
                  ? `Open memory on ${labels?.[i]}`
                  : labels
                    ? `Walk to ${labels[i]}`
                    : `Walk to stop ${i + 1}`
              }
              onPress={() => {
                if (state.current.near === i && !walking) onArrive(i);
                else walkTo(i);
              }}
              style={{
                position: "absolute",
                left: (point.x / 100) * mapW - 22,
                top: (point.y / 100) * mapH - 22,
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 3,
                borderColor: "#F3CC69",
                backgroundColor: recalled.includes(i) ? C.green : C.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: recalled.includes(i) ? "white" : C.ink,
                  fontWeight: "700",
                }}
              >
                {room ? (recalled.includes(i) ? "★" : "＋") : i + 1}
              </Text>
            </Pressable>
          ))}
          <View
            accessible={false}
            style={{
              position: "absolute",
              left: (pos.x / 100) * mapW - 21,
              top: (pos.y / 100) * mapH - 53,
            }}
          >
            <Walker moving={walking && !state.current.reduced} frame={frame} />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            width: 138,
            height: 138,
          }}
        >
          {[
            [0, -1, "↑", 46, 0],
            [-1, 0, "←", 0, 46],
            [1, 0, "→", 92, 46],
            [0, 1, "↓", 46, 92],
          ].map(([x, y, label, left, top]) => (
            <Pressable
              key={String(label)}
              accessibilityRole="button"
              accessibilityLabel={`Walk ${label === "↑" ? "up" : label === "↓" ? "down" : label === "←" ? "left" : "right"}`}
              onPressIn={() => direction(Number(x), Number(y))}
              onPressOut={() => direction(0, 0)}
              onPress={() => {
                state.current.pos = {
                  x: Math.max(
                    4,
                    Math.min(96, state.current.pos.x + Number(x) * 1.5),
                  ),
                  y: Math.max(
                    5,
                    Math.min(94, state.current.pos.y + Number(y) * 1.5),
                  ),
                };
                setPos({ ...state.current.pos });
              }}
              style={{
                position: "absolute",
                left: Number(left),
                top: Number(top),
                width: 46,
                height: 46,
                backgroundColor: "#F8E6A9",
                borderWidth: 3,
                borderColor: "#392F37",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, color: "#392F37" }}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ position: "absolute", right: 8, bottom: 12, gap: 2 }}>
          {!walking &&
            Math.hypot(pos.x - points[stop].x, pos.y - points[stop].y) < 4 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={room ? "Inspect object" : "Inspect memory"}
                onPress={onInspect}
                style={{
                  padding: 12,
                  backgroundColor: C.paper,
                  borderRadius: 20,
                }}
              >
                <Text style={s.label}>
                  {room ? "Inspect object" : "Inspect memory"}
                </Text>
              </Pressable>
            )}
          {!room && !walking && stop === 2 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enter room"
              onPress={onEnterRoom}
              style={{
                padding: 12,
                backgroundColor: C.yellow,
                borderRadius: 20,
              }}
            >
              <Text style={s.label}>Enter conservatory</Text>
            </Pressable>
          )}
          <PixelButton
            kind="back"
            label="Walk to previous stop"
            width={112}
            disabled={stop === 0 || targetIndex !== null}
            onPress={() => walkTo(stop - 1)}
          />
          <PixelButton
            kind="next"
            label="Walk to next stop"
            width={112}
            disabled={stop === points.length - 1 || targetIndex !== null}
            onPress={() => walkTo(stop + 1)}
          />
        </View>
      </View>
    </View>
  );
}

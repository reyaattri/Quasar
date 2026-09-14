import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Path, Line, Rect, Text as Label } from "react-native-svg";
import { Button, Card, C, s, Tag, Text } from "./ui";

export function EquationSteps({ lines }: { lines: string[] }) {
  return (
    <View
      style={{
        gap: 10,
        padding: 16,
        backgroundColor: "#F3F0E4",
        borderRadius: 16,
      }}
    >
      {lines.map((line, i) => (
        <Text
          key={i}
          style={{
            fontSize: 18,
            lineHeight: 28,
            color: C.ink,
            fontVariant: ["tabular-nums"],
          }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

export function PowerLab({ integral = false }: { integral?: boolean }) {
  const [n, setN] = useState(3),
    [stage, setStage] = useState(0),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setStage((old) => {
          if (old >= 2) {
            setPlaying(false);
            return 2;
          }
          return old + 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const next = integral ? n + 1 : n - 1;
  return (
    <Card style={{ gap: 14, backgroundColor: C.sage }}>
      <Tag>{integral ? "BUILD, THEN CHECK" : "THE POWER MACHINE"}</Tag>
      <Text style={s.h2}>
        {integral ? "Why do we divide?" : "Where does the power go?"}
      </Text>
      <Text style={s.body}>
        {integral
          ? "Raise the power, then cancel the multiplier that differentiation would create."
          : "Follow the exponent: it becomes a multiplier, and the remaining power drops by one."}
      </Text>
      <Svg
        width="100%"
        height={140}
        viewBox="0 0 300 140"
        accessibilityLabel={`Power transformation stage ${stage + 1}`}
      >
        <Rect x={12} y={20} width={276} height={105} rx={16} fill="#FFFDF5" />
        <Label x={28} y={85} fontSize={24} fill={C.ink}>
          {integral ? "∫" : "d/dx"}
        </Label>
        <Label x={105} y={85} fontSize={38} fill={C.green}>
          x
        </Label>
        <Label
          x={stage === 0 ? 126 : integral ? 126 : 75}
          y={stage === 0 ? 53 : integral ? 53 : 85}
          fontSize={stage === 0 ? 23 : integral ? 23 : 32}
          fill={C.red}
        >
          {stage === 0 ? n : integral ? next : n}
        </Label>
        {stage > 0 && !integral && (
          <Label x={126} y={53} fontSize={23} fill={C.green}>
            {next}
          </Label>
        )}
        {stage === 2 && integral && (
          <>
            <Line x1={98} y1={91} x2={155} y2={91} stroke={C.ink} />
            <Label x={117} y={118} fontSize={23} fill={C.red}>
              {next}
            </Label>
            <Label x={183} y={85} fontSize={25} fill={C.ink}>
              + C
            </Label>
          </>
        )}
        {stage === 0 && integral && (
          <Label x={170} y={85} fontSize={24}>
            dx
          </Label>
        )}
      </Svg>
      <Text accessibilityLiveRegion="polite" style={s.body}>
        {stage === 0
          ? "Start with the original power."
          : stage === 1
            ? integral
              ? `Raise ${n} to ${next}.`
              : `Multiply by ${n}, then lower the power to ${next}.`
            : integral
              ? `Divide by ${next}. Differentiating multiplies by ${next}, so those factors cancel.`
              : "The transformation is complete. Now change the power and predict the result."}
      </Text>
      <Button
        onPress={() => {
          setStage(0);
          setPlaying(true);
        }}
      >
        Animate the rule
      </Button>
      <Button
        secondary
        onPress={() => {
          setPlaying(false);
          setStage((stage + 1) % 3);
        }}
      >
        One transformation step
      </Button>
      <Button
        secondary
        onPress={() => {
          setN(n === 5 ? 2 : n + 1);
          setStage(0);
          setPlaying(false);
        }}
      >
        Change power: {n}
      </Button>
      {stage === 2 && (
        <EquationSteps
          lines={
            integral
              ? [
                  `∫ x${sup(n)} dx`,
                  `= x${sup(next)} / ${next} + C`,
                  `Check: (${next}/${next}) x${sup(n)} = x${sup(n)}`,
                ]
              : [`d(x${sup(n)})/dx`, `= ${n}x${sup(next)}`]
          }
        />
      )}
    </Card>
  );
}
const sup = (n: number) =>
  String(n)
    .split("")
    .map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c])
    .join("");

export function AreaLab() {
  const [n, setN] = useState(4),
    [side, setSide] = useState<"left" | "right">("left"),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setN((old) => {
          if (old >= 32) {
            setPlaying(false);
            return 32;
          }
          return old * 2;
        }),
      850,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const dt = 2 / n,
    estimate = 8 + (side === "left" ? -4 : 4) / n;
  return (
    <Card style={{ gap: 14, backgroundColor: C.sage }}>
      <Tag>MAKE THE ESTIMATE SETTLE</Tag>
      <Text style={s.h2}>How much water actually arrived?</Text>
      <Text style={s.body}>
        The tap speeds up: r(t) = 2t. Each rectangle is one bucket of rate ×
        time, between minute 1 and minute 3.
      </Text>
      <Svg
        width="100%"
        height={245}
        viewBox="0 0 310 245"
        accessibilityLabel={`${n} ${side} rectangles estimate ${estimate} litres; exact total 8 litres`}
      >
        {Array.from({ length: n }, (_, i) => {
          const t = 1 + (i + (side === "right" ? 1 : 0)) * dt;
          return (
            <Rect
              key={i}
              x={50 + (i * 220) / n}
              y={210 - 2 * t * 28}
              width={220 / n}
              height={2 * t * 28}
              fill="#A9CDAA"
              stroke="#FFFDF5"
              strokeWidth={1}
            />
          );
        })}
        <Path d="M50 154 L270 42" stroke={C.red} strokeWidth={3} />
        <Line x1={40} y1={210} x2={285} y2={210} stroke={C.ink} />
        <Line x1={40} y1={25} x2={40} y2={210} stroke={C.ink} />
        {[1, 2, 3].map((t) => (
          <Label key={t} x={50 + (t - 1) * 110} y={230} fontSize={14}>
            {t}
          </Label>
        ))}
        {[2, 4, 6].map((v) => (
          <Label key={v} x={18} y={215 - v * 28} fontSize={14}>
            {v}
          </Label>
        ))}
        <Label x={115} y={18} fontSize={13}>
          rate (litres/minute)
        </Label>
      </Svg>
      <EquationSteps
        lines={[
          `Δt = 2 / ${n} minute`,
          `Rectangle total = ${estimate.toFixed(3)} L`,
          `Exact total = 3² − 1² = 8 L`,
          `Error = ${Math.abs(estimate - 8).toFixed(3)} L`,
        ]}
      />
      <Text style={s.body}>
        {side === "left"
          ? "Left edges miss some water because the rate is increasing."
          : "Right edges add too much because they use each interval’s fastest rate."}{" "}
        Smaller intervals reduce the error.
      </Text>
      <Button
        onPress={() => {
          setN(2);
          setPlaying(true);
        }}
      >
        Animate thinner slices
      </Button>
      <Button
        secondary
        onPress={() => {
          setPlaying(false);
          setN(n === 32 ? 2 : n * 2);
        }}
      >
        Double the rectangles
      </Button>
      <Button
        secondary
        onPress={() => setSide(side === "left" ? "right" : "left")}
      >
        Use {side === "left" ? "right" : "left"} edges
      </Button>
    </Card>
  );
}

import React, { useState } from "react";
import { View } from "react-native";
import Svg, { Path, Line, Rect, Circle, Text as Label } from "react-native-svg";
import { Button, Card, C, s, Tag, Text } from "./ui";

export function LogExceptionLab() {
  const [n, setN] = useState(-1);
  return (
    <Card style={{ gap: 14, backgroundColor: "#F0F4F6" }}>
      <Tag>TEST THE RULE’S BOUNDARY</Tag>
      <Text style={s.h2}>What happens at n = −1?</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {[-2, -1, 0, 1].map((power) => (
          <Button key={power} secondary onPress={() => setN(power)}>
            n = {power}
          </Button>
        ))}
      </View>
      <Text style={s.h2}>
        New power: {n} + 1 = {n + 1}
      </Text>
      {n === -1 ? (
        <>
          <Text style={s.body}>
            The usual recipe would divide by zero. Stop: this power needs a
            different antiderivative.
          </Text>
          <Text style={s.h2}>∫ (1/x) dx = ln|x| + C</Text>
          <Text style={s.body}>
            Check: the derivative of ln|x| is 1/x for x ≠ 0. Stay on an interval
            that does not cross zero.
          </Text>
        </>
      ) : (
        <>
          <Text style={s.body}>
            Division by {n + 1} is defined. Raise the power, then divide by
            {n + 1}.
          </Text>
          <Text style={s.h2}>
            x^({n + 1}) / ({n + 1}) + C
          </Text>
        </>
      )}
    </Card>
  );
}

export function MechanismLab({
  kind,
}: {
  kind: "chain" | "constant" | "signed" | "substitution" | "terms";
}) {
  const [v, setV] = useState(1),
    [answer, setAnswer] = useState<number | null>(null);
  const chain = kind === "chain",
    constant = kind === "constant",
    signed = kind === "signed",
    sub = kind === "substitution";
  const title = chain
    ? "Two changes multiply"
    : constant
      ? "Same slope. Different heights."
      : signed
        ? "Area can cancel"
        : sub
          ? "Change the input, change its label"
          : "Every term has a job";
  const point = (x: number, y: number) => `${40 + x * 70},${185 - y * 18}`;
  return (
    <Card style={{ gap: 14, backgroundColor: "#F0F4F6" }}>
      <Tag>TOUCH · NOTICE · EXPLAIN</Tag>
      <Text style={s.h2}>{title}</Text>
      {chain || sub ? (
        <>
          <View style={{ gap: 10 }}>
            {(chain
              ? [
                  ["INPUT x", v],
                  ["INNER u = 3x + 1", 3 * v + 1],
                  ["OUTPUT y = u²", (3 * v + 1) ** 2],
                ]
              : [
                  ["INPUT x", v],
                  ["NEW VARIABLE u = x² + 1", v * v + 1],
                  ["MATCHING FACTOR du/dx", 2 * v],
                ]
            ).map(([name, value]) => (
              <View
                key={name}
                style={{
                  backgroundColor: "white",
                  padding: 14,
                  borderRadius: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <Text style={[s.small, { flex: 1 }]}>{name}</Text>
                <Text style={s.h2}>{value}</Text>
              </View>
            ))}
          </View>
          <Text style={s.body}>
            {chain
              ? `At x = ${v}, the inner rate is 3. The outer rate is 2u = ${2 * (3 * v + 1)}. Together: ${2 * (3 * v + 1)} × 3 = ${6 * (3 * v + 1)}.`
              : `At x = ${v}, u = ${v * v + 1}. A tiny input change dx becomes approximately ${2 * v} dx in u. That is why 2x dx travels together as du.`}
          </Text>
        </>
      ) : kind === "terms" ? (
        <>
          {["3x⁴ → 12x³", "−2x → −2", "7 → 0"].map((term, i) => (
            <View
              key={term}
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: i === v - 1 ? C.yellow : "white",
              }}
            >
              <Text style={s.h2}>{term}</Text>
            </View>
          ))}
          <Text style={s.body}>
            {
              [
                "Keep 3, multiply by 4, then lower the power to 3.",
                "The slope of a straight line −2x is −2 everywhere.",
                "The height 7 never changes. Its rate of change is zero.",
              ][v - 1]
            }
          </Text>
        </>
      ) : (
        <>
          <Svg
            width="100%"
            height={225}
            viewBox="0 0 300 225"
            accessibilityLabel={
              constant
                ? `x squared plus ${v - 1}, shifted vertically; slope at x 1 remains 2`
                : `Signed area from minus 1 to ${v - 1}: ${(((v - 1) ** 2 - 1) / 2).toFixed(1)}`
            }
          >
            <Line
              x1={25}
              y1={signed ? 120 : 185}
              x2={285}
              y2={signed ? 120 : 185}
              stroke={C.ink}
            />
            {constant ? (
              <>
                {[0, v - 1].map((offset, i) => (
                  <Path
                    key={i}
                    d={Array.from(
                      { length: 31 },
                      (_, j) =>
                        `${j ? "L" : "M"}${point(j / 12, (j / 12) ** 2 + offset)}`,
                    ).join(" ")}
                    fill="none"
                    stroke={i ? C.green : "#ACB3B9"}
                    strokeWidth={3}
                  />
                ))}
                <Circle
                  cx={110}
                  cy={185 - (1 + v - 1) * 18}
                  r={6}
                  fill={C.red}
                />
                <Line
                  x1={75}
                  y1={185 - (v - 1) * 18}
                  x2={145}
                  y2={185 - (2 + v - 1) * 18}
                  stroke={C.red}
                  strokeWidth={3}
                />
                <Label x={35} y={25} fontSize={17}>
                  F(x) = x² + {v - 1}
                </Label>
                <Label x={35} y={210}>
                  Move C; the tangent stays parallel.
                </Label>
              </>
            ) : (
              <>
                <Path d="M40 120 L40 155 L110 120 Z" fill="#EBC1AD" />
                {v > 1 && (
                  <Path
                    d={`M110 120 L${110 + (v - 1) * 70} ${120 - (v - 1) * 35} L${110 + (v - 1) * 70} 120 Z`}
                    fill="#98CBB1"
                  />
                )}
                <Path d="M40 155 L250 50" stroke={C.green} strokeWidth={3} />
                <Label x={35} y={180}>
                  −1
                </Label>
                <Label x={105} y={142}>
                  0
                </Label>
                <Label x={175} y={142}>
                  1
                </Label>
                <Label x={245} y={142}>
                  2
                </Label>
                <Label x={33} y={24} fontSize={17}>
                  f(x) = x
                </Label>
              </>
            )}
          </Svg>
          <Text style={s.body}>
            {constant
              ? `C = ${v - 1}. The curve moves up, but its slope at x = 1 stays 2. Differentiation loses the vertical offset.`
              : `Lower triangle: −0.5. Upper region: ${((v - 1) ** 2 / 2).toFixed(1)}. Net integral: ${(((v - 1) ** 2 - 1) / 2).toFixed(1)}. Geometric area: ${(((v - 1) ** 2 + 1) / 2).toFixed(1)}.`}
          </Text>
        </>
      )}
      <Button
        onPress={() => {
          setV(v === 3 ? 1 : v + 1);
          setAnswer(null);
        }}
      >
        {constant
          ? "Raise the constant"
          : signed
            ? "Move the upper bound"
            : kind === "terms"
              ? "Inspect the next term"
              : "Change the input"}
      </Button>
      <Text style={s.h3}>
        {chain
          ? "Why multiply by 3?"
          : constant
            ? "Does changing C change the derivative?"
            : signed
              ? "When the signed integral is zero, can area still exist?"
              : sub
                ? "What must replace 2x dx?"
                : "Why does the final 7 vanish?"}
      </Text>
      {(chain
        ? ["The inside changes three times as fast", "Every square needs a 3"]
        : constant
          ? [
              "No: the local steepness stays the same",
              "Yes: a taller curve has a larger slope",
            ]
          : signed
            ? [
                "Yes: positive and negative parts can cancel",
                "No: zero means nothing was there",
              ]
            : sub
              ? ["du", "u"]
              : ["Its rate of change is zero", "We always ignore the last term"]
      ).map((a, i) => (
        <Button key={a} secondary onPress={() => setAnswer(i)}>
          {a}
        </Button>
      ))}
      {answer !== null && (
        <Text accessibilityLiveRegion="polite" style={s.body}>
          {answer === 0
            ? "Exactly. Use the changing diagram to explain that in your own words."
            : "Try another input and watch what changes. Then try again."}
        </Text>
      )}
    </Card>
  );
}

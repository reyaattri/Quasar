import { ActivityStoryArt } from "../components/ActivityStoryArt";
import { mathsCoaching } from "../data/lessonCoaching";
import { GeneratedMemoryArt } from "../components/MemoryActivityArt";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg";
import { Button, C, Card, s, Tag, Text } from "../components/ui";
import { SuccessBurst } from "../components/SuccessBurst";
import { AtlasArt } from "../components/StudyShelf";
import { AreaLab, PowerLab, EquationSteps } from "../components/CalculusLabs";
import { LogExceptionLab, MechanismLab } from "../components/CalculusExplorers";

import { calculusLessons } from "../data/calculusLessons";
function SlopeLab() {
  const [x, setX] = useState(1),
    [h, setH] = useState(1);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () =>
        setH((old) => {
          if (old <= 0.015) {
            setRunning(false);
            return 0.01;
          }
          return Math.max(0.01, old * 0.91);
        }),
      60,
    );
    return () => clearInterval(timer);
  }, [running]);
  const px = (v: number) => 30 + v * 70,
    py = (v: number) => 205 - v * 20;
  const curve = Array.from(
    { length: 31 },
    (_, i) => `${i ? "L" : "M"}${px(i / 10)} ${py((i / 10) ** 2)}`,
  ).join(" ");
  return (
    <Card style={{ backgroundColor: C.sage, gap: 12 }}>
      <Tag>MOVE THE FOOTPRINTS</Tag>
      <Svg
        width="100%"
        height={235}
        viewBox="0 0 280 235"
        accessibilityLabel={`Graph of x squared. Average slope ${2 * x + h}; derivative ${2 * x}.`}
      >
        <Line x1={30} y1={205} x2={260} y2={205} stroke={C.ink} />
        <Line x1={30} y1={20} x2={30} y2={205} stroke={C.ink} />
        <Path d={curve} stroke={C.green} strokeWidth={3} fill="none" />
        <Line
          x1={px(x - 0.4)}
          y1={py(x * x - 2 * x * 0.4)}
          x2={px(x + 0.4)}
          y2={py(x * x + 2 * x * 0.4)}
          stroke="#718096"
          strokeDasharray="5 4"
          strokeWidth={2}
        />
        <Line
          x1={px(x)}
          y1={py(x * x)}
          x2={px(x + h)}
          y2={py(x * x)}
          stroke={C.red}
          strokeDasharray="3 3"
        />
        <Line
          x1={px(x + h)}
          y1={py(x * x)}
          x2={px(x + h)}
          y2={py((x + h) ** 2)}
          stroke={C.red}
          strokeDasharray="3 3"
        />
        {[0, 1, 2, 3].map((t) => (
          <SvgText key={t} x={px(t) - 3} y={222} fontSize={12}>
            {t}
          </SvgText>
        ))}
        <Line
          x1={px(x)}
          y1={py(x * x)}
          x2={px(x + h)}
          y2={py((x + h) ** 2)}
          stroke={C.red}
          strokeWidth={3}
        />
        {[x, x + h].map((v, i) => (
          <Circle key={i} cx={px(v)} cy={py(v * v)} r={5} fill={C.red} />
        ))}
        <SvgText x={180} y={30} fill={C.ink}>
          f(x) = x²
        </SvgText>
        <SvgText x={248} y={225}>
          x
        </SvgText>
      </Svg>
      <Text style={s.body}>
        x = {x} · h = {Number(h.toFixed(3))}
        {"\n"}Average slope: {(2 * x + h).toFixed(2)}
        {"\n"}Slope as h → 0: {2 * x}
      </Text>
      <Text style={s.small}>
        Red joins two points. Grey is the tangent at the first point. As the gap
        shrinks, the red slope approaches the grey slope.
      </Text>
      <Button
        onPress={() => {
          setH(1);
          setRunning(true);
        }}
      >
        Animate secant into tangent
      </Button>
      <Button
        secondary
        onPress={() => {
          setRunning(false);
          setH(h === 1 ? 0.5 : h === 0.5 ? 0.1 : h === 0.1 ? 0.01 : 1);
        }}
      >
        Bring footprints closer
      </Button>
      <Button secondary onPress={() => setX(x === 1 ? 2 : 1)}>
        Move to x = {x === 1 ? 2 : 1}
      </Button>
    </Card>
  );
}
export function CalculusCourse() {
  const [details, setDetails] = useState(false),
    [hook, setHook] = useState(false);
  const [lesson, setLesson] = useState<number | null>(null),
    [step, setStep] = useState(0),
    [quiz, setQuiz] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  if (lesson === null)
    return (
      <View style={{ gap: 20 }}>
        <Tag>THE CALCULUS WORKSHOP</Tag>
        <Text style={s.title}>Understand the move. Then remember it.</Text>
        <Text style={s.body}>
          Change a value. Predict what happens. Watch the maths respond. Three
          visual journeys from local change to accumulated totals.
        </Text>
        {calculusLessons.map((l, i) => (
          <Card
            key={l.title}
            style={{ backgroundColor: [C.sage, C.peach, C.yellow][i], gap: 14 }}
          >
            <Tag>LESSON {i + 1}</Tag>
            <Text style={s.h2}>{l.title}</Text>
            <Text style={s.body}>{l.subtitle}</Text>
            <Button
              onPress={() => {
                setLesson(i);
                setStep(0);
                setQuiz(false);
                setAnswer(null);
              }}
            >
              Start {l.title.toLowerCase()}
            </Button>
          </Card>
        ))}
      </View>
    );
  const l = calculusLessons[lesson],
    current = l.steps[step];
  return (
    <View style={{ gap: 18 }}>
      <Button secondary onPress={() => setLesson(null)}>
        All calculus lessons
      </Button>
      <Tag>
        LESSON {lesson + 1} ·{" "}
        {quiz ? "PUT IT TO WORK" : `STEP ${step + 1} OF ${l.steps.length}`}
      </Tag>
      <Text style={s.title}>{l.title}</Text>
      {!quiz ? (
        <>
          <Card style={{ gap: 16 }}>
            <Text style={s.h2}>{current[0]}</Text>
            <ActivityStoryArt
              kind="calculus"
              index={lesson * 5 + step}
              label={current[0] + " memory illustration"}
              height={245}
            />
            <Text style={s.small}>EXPLORE FIRST · EXPLAIN · APPLY</Text>
          </Card>
          {lesson === 0 && step < 2 && <SlopeLab />}
          {lesson === 0 && step === 2 && <PowerLab />}
          {lesson === 0 && step === 3 && (
            <MechanismLab key="terms" kind="terms" />
          )}
          {lesson === 0 && step === 4 && (
            <MechanismLab key="chain" kind="chain" />
          )}
          {lesson === 1 && step === 1 && (
            <MechanismLab key="constant" kind="constant" />
          )}
          {lesson === 1 && (step === 0 || step === 2) && <PowerLab integral />}
          {lesson === 1 && step === 3 && <LogExceptionLab />}
          {lesson === 1 && step === 4 && (
            <MechanismLab key="sub" kind="substitution" />
          )}
          {lesson === 2 && step <= 2 && <AreaLab />}
          {lesson === 2 && step === 3 && (
            <MechanismLab key="signed" kind="signed" />
          )}
          {lesson === 2 && step === 4 && (
            <MechanismLab key="bounds" kind="substitution" />
          )}
          <Card style={{ gap: 14 }}>
            <Tag>UNDERSTAND THE IDEA</Tag>
            <Text style={s.body}>{current[1]}</Text>
            <Text style={s.h3}>{mathsCoaching[lesson][step][0]}</Text>
            <Text style={s.body}>{mathsCoaching[lesson][step][1]}</Text>
            <Tag>THE WORKED STEPS</Tag>
            <EquationSteps lines={workedEquations[lesson][step]} />
            <Button secondary onPress={() => setDetails(!details)}>
              {details ? "Close explanation" : "Why does this work?"}
            </Button>
            {details && (
              <View style={{ gap: 12 }}>
                <Text style={s.body}>{mathsCoaching[lesson][step][2]}</Text>
                <Text style={s.h3}>Watch out for this</Text>
                <Text style={s.body}>{mathsCoaching[lesson][step][3]}</Text>
              </View>
            )}
            <Button secondary onPress={() => setHook(!hook)}>
              {hook ? "Close memory hook" : "Give me a memory hook"}
            </Button>
            {hook && (
              <>
                <Tag color={C.yellow}>YOUR MEMORY HOOK</Tag>
                <Text style={s.body}>{current[2]}</Text>
              </>
            )}
          </Card>
          <Button
            onPress={() => {
              setDetails(false);
              setHook(false);
              step === l.steps.length - 1 ? setQuiz(true) : setStep(step + 1);
            }}
          >
            {step === l.steps.length - 1 ? "Try the application" : "Next step"}
          </Button>
          {step > 0 && (
            <Button secondary onPress={() => setStep(step - 1)}>
              Previous step
            </Button>
          )}
        </>
      ) : (
        <Card style={{ gap: 16 }}>
          <Text style={s.h2}>{l.question}</Text>
          {l.choices.map((c, i) => (
            <Button
              key={c}
              secondary
              onPress={() => setAnswer(i)}
              disabled={answer === l.answer}
            >
              {c}
            </Button>
          ))}
          {answer !== null && (
            <>
              <Text accessibilityLiveRegion="polite" style={s.body}>
                {answer === l.answer ? "Exactly. " : "Try again. "}
                {l.explanation}
              </Text>
              {answer === l.answer && (
                <SuccessBurst label="You connected the idea!" />
              )}
              <Button
                secondary
                onPress={() => {
                  setQuiz(false);
                  setStep(0);
                  setAnswer(null);
                }}
              >
                Revisit the worked example
              </Button>
            </>
          )}
        </Card>
      )}
    </View>
  );
}

const workedEquations = [
  [
    ["f(x) = x²", "f(2) = 4", "f′(2) = 4 units per unit"],
    [
      "rise = (x + h)² − x²",
      "run = h ≠ 0",
      "rise / run = 2x + h",
      "as h → 0, slope → 2x",
    ],
    ["d(xⁿ)/dx = n · xⁿ⁻¹", "d(x³)/dx = 3x²"],
    [
      "f(x) = 3x⁴ − 2x + 7",
      "f′(x) = 3 · 4x³ − 2 + 0",
      "= 12x³ − 2",
      "f′(1) = 10",
    ],
    [
      "u = 3x + 1",
      "outer derivative = 2u",
      "inner derivative = 3",
      "f′(x) = 2(3x + 1) · 3",
      "= 6(3x + 1)",
    ],
  ],
  [
    ["d(x³)/dx = 3x²", "∫ 3x² dx = x³ + C"],
    ["d(x³ + 4)/dx = 3x²", "d(x³ − 100)/dx = 3x²", "∫ 3x² dx = x³ + C"],
    ["∫ 6x² dx", "= 6x³ / 3 + C", "= 2x³ + C"],
    [
      "n = −1: n + 1 = 0",
      "∫ (1/x) dx = ln|x| + C",
      "x ≠ 0; stay on one interval",
    ],
    ["u = x² + 1", "du = 2x dx", "∫ u³ du = u⁴/4 + C", "= (x² + 1)⁴/4 + C"],
  ],
  [
    [
      "rate at t = 3: 6 L/min",
      "small amount ≈ rate × Δt",
      "total = add small amounts",
    ],
    [
      "one rectangle = r(tᵢ) Δt",
      "estimate = Σ r(tᵢ) Δt",
      "limit as Δt → 0: ∫ r(t) dt",
    ],
    ["F(t) = t²; F′(t) = 2t", "total = F(3) − F(1)", "= 9 − 1 = 8 litres"],
    [
      "below-axis contribution = −½",
      "above-axis contribution = +½",
      "signed total = 0",
      "geometric area = ½ + ½ = 1",
    ],
    [
      "u = x² + 1; du = 2x dx",
      "x: 0 → 1 becomes u: 1 → 2",
      "F(u) = u²/2",
      "F(2) − F(1) = 2 − ½ = 3/2",
    ],
  ],
];

import React from "react";
import { View } from "react-native";
import Svg, { G, Path, Circle, Rect, Text as T } from "react-native-svg";
import { deck, ranks, anchors } from "../data/funGames";

const ink = "#283B38";
const shapes = [
  "M91 130V64h24v66zM103 59q-22-20 0-36q20 18 0 36",
  "M63 116q10-24 40-16V63q-7-28 17-27q25 0 11 21l-10 4v45q-5 44-58 10z",
  "M104 133V49M78 39v30q26 24 52 0V39M104 25l-10 21h20z",
  "M54 114h104l-23 28H79zM103 112V30M103 33L67 100h36M111 51l35 49h-35z",
  "M83 137l-24-44q-7-16 5-16l20 19V49q0-14 11-7v41-49q8-15 15 0v49-43q10-10 15 2v43-31q13-9 13 5v54q-9 29-55 24z",
  "M58 60q35-42 81 1l-8 47q-1 38-30 34q-17-3-8-17q15 9 15-10V73z",
  "M63 40l49 42-11 57-22-5 3-41-34-33z",
  "M102 32a20 20 0 1 0 0 40a20 20 0 1 0 0-40M102 71a33 33 0 1 0 0 66a33 33 0 1 0 0-66",
  "M102 30c-52 0-40 66 0 75c40-9 52-75 0-75M102 105q-26 19 0 35",
  "M72 31l25 9-27 91-21-7zM131 100a21 21 0 1 0 0 42a21 21 0 1 0 0-42",
  "M103 65a18 18 0 1 0 0-36a18 18 0 1 0 0 36M84 75h38l12 62H73zM84 85L60 65M121 85l24-24",
  "M79 62l-9-31 24 12 10-24 11 24 24-12-10 31zM104 65a19 19 0 1 0 0 38a19 19 0 1 0 0-38M86 104h35l15 34H70z",
  "M77 56l-5-30 20 10 11-23 12 23 21-10-7 30zM103 61a22 22 0 1 0 0 44a22 22 0 1 0 0-44M78 105h51l9 35H68z",
];
export function CardMemoryArt({
  card,
  step = 0,
  height = 220,
}: {
  card: (typeof deck)[number];
  step?: number;
  height?: number;
}) {
  const ri = ranks.indexOf(card.rank),
    space = card.suit === "♠",
    garden = card.suit === "♣",
    crystal = card.suit === "♦";
  const color = space
    ? "#596780"
    : garden
      ? "#8BBF72"
      : crystal
        ? "#8FD0DC"
        : "#DE7180";
  return (
    <View
      accessibilityLabel={`${card.object} in ${card.costume} collides with ${anchors[step % 4]}`}
      style={{ flex: 1, minWidth: 140, height }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 270 175">
        <G
          stroke={ink}
          strokeWidth={3.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {step % 4 === 0 ? (
            <>
              <Rect
                x={211}
                y={24}
                width={41}
                height={132}
                rx={5}
                fill="#DFA36D"
              />
              <Path d="M221 83h-29q-12 0-12 13q0 10 12 10h19" fill="#E9BE51" />
              <Circle cx={229} cy={47} r={2} />
              <Path d="M227 57l11 5" />
            </>
          ) : step % 4 === 1 ? (
            <>
              <Path
                d="M177 106h79v13h-79zM190 120v36m51-36v36"
                fill="#DFA36D"
              />
            </>
          ) : step % 4 === 2 ? (
            <>
              <Rect x={188} y={34} width={65} height={101} fill="#B5DEDE" />
              <Path d="M220 34v101m-32-51h65" />
            </>
          ) : (
            <>
              <Path
                d="M200 41h39v72h-39zM183 113h64v12h-64zM189 125v33m50-33v33"
                fill="#DFA36D"
              />
            </>
          )}
          {space && (
            <>
              <Rect
                x={46}
                y={59}
                width={26}
                height={65}
                rx={10}
                fill="#343A51"
              />
              <Circle
                cx={104}
                cy={79}
                r={68}
                fill="#CDE8EF"
                fillOpacity={0.28}
                stroke="#8BBECD"
              />
            </>
          )}
          <Path d={shapes[ri]} fill={color} />
          <Circle cx={95} cy={90} r={4} fill={ink} />
          <Circle cx={115} cy={90} r={4} fill={ink} />
          <Path d="M96 103q8 10 17 0" fill="none" />
          {garden && (
            <Path
              d="M117 44q-4-27 24-25q-2 24-24 25M111 40Q88 41 90 20q22 1 21 20"
              fill="#51945B"
            />
          )}
          {crystal && (
            <Path
              d="M141 49l9-18 11 18-11 17zM54 90l8-16 9 16-9 15z"
              fill="#F9FCFF"
            />
          )}
          {!space && !garden && !crystal && (
            <Path d="M109 112q35 11 41 34l-43-9z" fill="#B93E64" />
          )}
          <Path
            d="M159 79l14-10m-10 22 13 2m-18 10 12 13"
            fill="none"
            stroke="#E8A233"
          />
        </G>
        <T
          x={104}
          y={159}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill={ink}
        >
          {card.rank} {card.suit}
        </T>
      </Svg>
    </View>
  );
}

export function ExploreMemoryArt({
  kind,
}: {
  kind: "cards" | "pairs" | "phrase" | "calculus";
}) {
  if (kind === "cards")
    return (
      <CardMemoryArt card={deck.find((c) => c.id === "4♠")!} height={190} />
    );
  return (
    <View
      accessibilityLabel={
        kind === "pairs"
          ? "Clara plays a clarinet while Cara drives a tiny car"
          : kind === "phrase"
            ? "An otter in a velvet cape rides a rocket into a pancake"
            : "A skier follows a curve while a tangent marks its slope"
      }
      style={{ height: 190 }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 320 190">
        <G
          stroke={ink}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {kind === "pairs" ? (
            <>
              <Path d="M45 157l12-54h28l17 54z" fill="#E69664" />
              <Circle cx={70} cy={73} r={23} fill="#E7B993" />
              <Path d="M48 69q3-39 43-10" fill="#63453C" />
              <Circle cx={76} cy={72} r={3} />
              <Path d="M82 84l52 39-9 13-47-48z" fill="#525371" />
              <Path d="M132 126l15 1-9 14-13-5" fill="#E8BC4E" />
              <Path
                d="M149 60v-22l14-4v21m-14 6q-11-9-13 1t13-1"
                fill="#8464AA"
              />
              <Path d="M186 121l17-34h47l19 34h19v30H168v-26z" fill="#78B8B0" />
              <Circle cx={190} cy={151} r={14} fill="#48475B" />
              <Circle cx={266} cy={151} r={14} fill="#48475B" />
              <Circle cx={229} cy={86} r={19} fill="#E7B993" />
              <Path d="M209 79q18-31 39 0" fill="#B76342" />
              <Path d="M226 111l18 13" />
              <Circle cx={234} cy={86} r={3} />
            </>
          ) : kind === "phrase" ? (
            <>
              <Path d="M81 91q-31 11-47 61l78-19" fill="#86529F" />
              <Path
                d="M89 70q-34 15-18 55q43 29 58-15q-1-36-40-40z"
                fill="#B57E54"
              />
              <Circle cx={85} cy={73} r={12} fill="#B57E54" />
              <Circle cx={115} cy={75} r={12} fill="#B57E54" />
              <Circle cx={101} cy={86} r={4} />
              <Path d="M104 101q13 7 20-3" fill="none" />
              <Path d="M112 121l66-75q32 5 42 36l-77 65z" fill="#82BFC6" />
              <Circle cx={176} cy={88} r={15} fill="#FFF4CE" />
              <Path d="M130 140l-18 31 35-19" fill="#E58A4E" />
              <Path
                d="M213 153q33-28 66 0v12q-34 23-66 0zM213 143q33-26 66 0v10q-34 24-66 0z"
                fill="#EAC078"
              />
              <Path d="M232 134q15-12 29 0l-9 10z" fill="#F6D969" />
            </>
          ) : (
            <>
              <Path
                d="M37 25v133h258M47 149Q133 151 164 101T275 30"
                fill="none"
                stroke="#649E98"
              />
              <Path d="M94 156L242 49" stroke="#D77C5F" />
              <Circle cx={165} cy={105} r={6} fill="#D77C5F" />
              <Circle cx={142} cy={56} r={17} fill="#E7B993" />
              <Path d="M126 52q10-31 35-5" fill="#826AB0" />
              <Path
                d="M142 75l22 17-5 22m-16-39-17 22m34-11 24-14M149 111l31-22"
                fill="none"
                strokeWidth={8}
              />
              <Path d="M153 125l52-37" stroke="#E6B953" />
              <Path d="M201 102h35V76" fill="none" strokeDasharray="5 5" />
            </>
          )}
        </G>
      </Svg>
    </View>
  );
}

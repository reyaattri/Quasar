import React from "react";
import Svg, { Path, Circle, Rect, Text as T, G } from "react-native-svg";
export function ToolkitIcon({ index }: { index: number }) {
  return (
    <Svg
      width={84}
      height={84}
      viewBox="0 0 100 100"
      accessibilityLabel={
        [
          "An octopus hangs ideas on numbered hooks",
          "A number tin shouts through a megaphone",
          "A shoe kicks a lemon onto a kite string",
          "A compass conducts a parade of initials",
          "A rose pops from a friendly name badge",
          "A tiny house walks its own memory route",
        ][index]
      }
    >
      <G
        stroke="#294D3B"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {index === 0 ? (
          <>
            <Path d="M30 55q-6-38 22-37q29 0 20 37" fill="#D997B1" />
            <Path
              d="M31 49Q7 91 20 85l12-12m7-17q-9 39 7 23m10-23q7 40 16 22m-6-27q23 28 20 7"
              fill="none"
            />
            <Circle cx={44} cy={37} r={2} />
            <Circle cx={61} cy={37} r={2} />
            <Rect x={4} y={67} width={17} height={18} rx={3} fill="#EDC550" />
            <Path d="M78 70l14 8-13 10z" fill="#77B9C0" />
          </>
        ) : index === 1 ? (
          <>
            <Path d="M24 30h39v49H24z" fill="#8CB8C4" />
            <Path d="M24 31q19-14 39 0q-20 11-39 0" fill="#D6E9EB" />
            <Path d="M62 43l24-14v42L62 57z" fill="#E6AE68" />
            <Path d="M87 40l8-4m-7 16h8m-8 8 6 7" fill="none" />
            <Path d="M30 79l-9 10m34-10 10 9" />
            <T x={29} y={63} stroke="none" fontSize={19} fill="#294D3B">
              12
            </T>
          </>
        ) : index === 2 ? (
          <>
            <Path d="M12 61l22-5 7 15 20 5v13H13z" fill="#E99569" />
            <Path d="M31 63l9-12m3 18 9-11" />
            <Circle cx={64} cy={49} r={12} fill="#F1CD4E" />
            <Path d="M71 14l20 13-14 21-15-17z" fill="#9D8CCA" />
            <Path d="M75 48q-3 23-16 19" fill="none" />
            <Path d="M44 39l9-4m-11-4 6-5" />
          </>
        ) : index === 3 ? (
          <>
            <Circle cx={50} cy={50} r={29} fill="#F6DC83" />
            <Path d="M49 28l-8 29 19 12-3-24z" fill="#D58174" />
            <Path d="M18 44l-9-9m70 12 12-8M36 79l-6 12m29-12 9 12" />
            <T x={44} y={15} stroke="none" fontSize={13}>
              N
            </T>
            <T x={85} y={61} stroke="none" fontSize={13}>
              E
            </T>
            <T x={46} y={97} stroke="none" fontSize={13}>
              S
            </T>
            <T x={0} y={60} stroke="none" fontSize={13}>
              W
            </T>
          </>
        ) : index === 4 ? (
          <>
            <Rect x={12} y={31} width={76} height={52} rx={10} fill="#F5DDC3" />
            <Circle cx={36} cy={57} r={14} fill="#E1B190" />
            <Path d="M25 49q7-14 22 0" fill="#80523F" />
            <Path d="M35 81q32-4 34-43" fill="none" />
            <Path
              d="M65 49q-23 0-9-17q-1-17 14-10q17-7 17 9q14 15-4 20z"
              fill="#D8768D"
            />
            <Path d="M64 34q17-12 16 6q-13 11-16-6" fill="none" />
          </>
        ) : (
          <>
            <Path d="M22 41l29-22 28 22v38H22z" fill="#DDA670" />
            <Path d="M13 42l38-29 37 29" fill="none" />
            <Rect x={39} y={51} width={17} height={28} fill="#7A9AAB" />
            <Path
              d="M28 80l-12 10m53-10 11 9M10 64q-11-50 44-59q42 3 39 56"
              strokeDasharray="3 7"
              fill="none"
            />
          </>
        )}
      </G>
    </Svg>
  );
}

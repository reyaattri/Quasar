import React from "react";
import { View } from "react-native";
import Svg, { Defs, ClipPath, Rect, Image } from "react-native-svg";
export function ToolkitArt({ index, height = 245 }: { index: number; height?: number }) {
  const frames = [[0,0,551,503],[552,0,458,503],[1011,0,525,503],[0,504,513,520],[514,504,496,520],[1011,504,525,520]];
  const [x,y,w,h] = frames[index];
  return <View style={{ width: "100%", padding: 6 }}>
    <Svg width="100%" height={height} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <Defs><ClipPath id={`toolkit-${index}`}><Rect x={x} y={y} width={w} height={h} /></ClipPath></Defs>
      <Image href={require("../../assets/toolkit-conversations.png")} width={1536} height={1024} clipPath={`url(#toolkit-${index})`} />
    </Svg>
  </View>;
}
export function ToolkitIcon({ index }: { index: number }) {
  return (
    <View style={{ width: 92, borderRadius: 18, overflow: "hidden" }}>
      <ToolkitArt index={index} height={96} />
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export function QuasarMark({ size = 36 }: { size?: number }) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Quasar logo" style={{ width: size, height: size }}>
    <Svg width={size} height={size} viewBox="160 150 704 724">
      <Path d="M224 415C273 272 407 187 548 201C665 212 757 283 802 385" fill="none" stroke="#294D3B" strokeWidth={45} strokeLinecap="round" />
      <Path d="M799 610C746 752 615 834 475 819C357 806 265 735 220 634" fill="none" stroke="#B9684C" strokeWidth={45} strokeLinecap="round" />
      <Path d="M512 253C545 390 601 451 780 512C601 573 545 634 512 771C479 634 423 573 244 512C423 451 479 390 512 253Z" fill="#F2CB6C" stroke="#294D3B" strokeWidth={23} strokeLinejoin="round" />
      <Path d="M512 388C527 460 551 485 623 512C551 539 527 564 512 636C497 564 473 539 401 512C473 485 497 460 512 388Z" fill="#FBF8EF" />
    </Svg>
    </View>
  );
}

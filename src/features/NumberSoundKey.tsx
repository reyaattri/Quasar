import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Button, C, s, Text } from "../components/ui";
const sounds = [
  "s, z",
  "t, d",
  "n",
  "m",
  "r",
  "l",
  "sh, ch, j, soft g",
  "k, hard g",
  "f, v",
  "p, b",
];
export function NumberSoundKey() {
  const [open, setOpen] = useState(false),
    [pick, setPick] = useState<number | null>(null);
  return (
    <View style={{ gap: 12 }}>
      <Button secondary color="#E5D8B6" onPress={() => setOpen(!open)}>
        {open ? "Close the number-sound key" : "Open the number-sound key"}
      </Button>
      {open && (
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            backgroundColor: "#EDF1E7",
            gap: 12,
          }}
        >
          <Text style={s.h3}>Numbers become sounds.</Text>
          <Text style={s.body}>
            Use the sound, not the spelling. Vowels and w, h, y are fillers. A
            silent letter adds nothing. A repeated letter with one sound counts
            once.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {sounds.map((sound, i) => (
              <View
                key={i}
                style={{
                  width: "46%",
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: C.white,
                }}
              >
                <Text style={[s.h3, { fontSize: 20 }]}>{i}</Text>
                <Text style={s.body}>{sound}</Text>
              </View>
            ))}
          </View>
          <Text style={s.body}>
            12 becomes tin: t is 1, n is 2. Picture the oversized tin in the
            workshop below. 32 becomes moon: m is 3, n is 2. Turn the picture
            back into sounds to recover the number.
          </Text>
          <Text style={s.h3}>Which number is leaf?</Text>
          {["58", "85", "51"].map((v, i) => (
            <Button key={v} secondary onPress={() => setPick(i)}>
              {v}
            </Button>
          ))}
          {pick !== null && (
            <Text accessibilityLiveRegion="polite" style={s.body}>
              {pick === 0
                ? "Yes. L is 5 and f is 8. The vowel sound carries no digit."
                : "Say leaf slowly. L comes before f. Use the key and try again."}
            </Text>
          )}
          <Text style={s.small}>
            A=1, B=2 through Z=26 is a different system called alphabet
            numbering. This lesson uses sound-based mnemonics so numbers can
            become pictures.
          </Text>
        </View>
      )}
    </View>
  );
}

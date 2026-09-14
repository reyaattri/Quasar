import React, { useState } from "react";
import { Linking, Platform, View } from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";

import { Button, C, Card, s, Tag, Text } from "../components/ui";

const acts = [
  {
    title: "Meet RNA polymerase II",
    say: "I am The enzyme, the copying enzyme. I make an RNA copy from DNA. I do not turn DNA into RNA, and I do not make a protein.",
    explain:
      "For a human protein-coding gene, RNA polymerase II builds a pre-mRNA transcript. DNA remains available for more copies. Ribosomes will later translate the processed mRNA into protein.",
    hook: "The enzyme wears two enormous roller skates: polymerase TWO. She carries a copy ribbon, not a protein necklace.",
  },
  {
    title: "Read the template from 3′ to 5′",
    say: "My template is the strand I actually read. I move along it from its three-prime side toward its five-prime side.",
    explain:
      "The two DNA strands run in opposite directions. In this diagram, the template is shown 3′ to 5′ from left to right. That orientation determines the complementary RNA we can build. A diagram could be flipped; follow the end labels, not just left and right.",
    hook: "The enzyme enters through door THREE and reads toward door FIVE. Her reading glasses belong on the TEMPLATE track.",
  },
  {
    title: "Build RNA from 5′ to 3′",
    say: "My new ribbon starts at its five-prime end. Each new nucleotide attaches to the growing three-prime end.",
    explain:
      "Polymerase adds an incoming ribonucleotide to the RNA’s free 3′ hydroxyl end. The RNA therefore lengthens in the 5′→3′ direction while the opposite template is read 3′→5′. Reading direction and building direction are related, but they describe different strands.",
    hook: "An enormous three-fingered hand at the ribbon’s growing end grabs every new bead: ADD AT THREE. The finished ribbon reads FIVE TO THREE.",
  },
  {
    title: "Uracil is a building block",
    say: "When my DNA template shows A, I choose an RNA U. When it shows T, I choose A. C pairs with G, and G with C.",
    explain:
      "Uracil is the base U in RNA; it is not an enzyme or a worker that reads DNA. RNA normally uses U where DNA uses T. Complementary pairing chooses the next RNA nucleotide. The small sequence below is a teaching example, not a complete gene.",
    hook: "At the RNA wardrobe, U wears the uniform and T is turned away. Template A gets a U partner; template T gets A.",
  },
  {
    title: "Why the coding strand looks familiar",
    say: "Compare my RNA with the coding strand in the same five-prime to three-prime direction. The letters match, except DNA T becomes RNA U.",
    explain:
      "The coding strand is the DNA strand complementary to the template. The RNA is also complementary to that template, so RNA and coding DNA match in sequence when both are read 5′→3′, apart from U/T. The coding strand is a useful reference; it is not the strand this polymerase is copying.",
    hook: "Coding DNA is the display copy in the window. The enzyme reads the opposite template behind the counter.",
  },
];

export function TranscriptionAct({ compact = false }: { compact?: boolean }) {
  const [act, setAct] = useState(0),
    [bases, setBases] = useState(0),
    [feedback, setFeedback] = useState("");
  const a = acts[act],
    template = "TACGGA",
    rna = "AUGCCU",
    coding = "ATGCCT";
  const change = (n: number) => {
    setAct(n);
    setFeedback("");
  };
  return (
    <Card style={{ gap: 16, backgroundColor: "#F0E4EC", borderRadius: 28 }}>
      <Tag>TRANSCRIPTION · FOLLOW THE STRANDS</Tag>
      <Text style={compact ? s.h2 : s.title}>{a.title}</Text>
      <Svg
        width="100%"
        height={290}
        viewBox="0 0 330 290"
        accessibilityLabel={`Coding DNA 5′ ATGCCT 3′. Template DNA 3′ TACGGA 5′. RNA 5′ ${rna.slice(0, bases)} 3′.`}
      >
        <Rect width={330} height={290} rx={20} fill="#FFFDF5" />
        <SvgText x={15} y={24} fill={C.ink} fontSize={13}>
          Coding DNA · display copy
        </SvgText>
        <SvgText x={15} y={55} fontSize={15}>
          5′
        </SvgText>
        <SvgText x={301} y={55} fontSize={15}>
          3′
        </SvgText>
        <SvgText x={15} y={94} fill={C.ink} fontSize={13}>
          Template DNA · read 3′ → 5′
        </SvgText>
        <SvgText x={15} y={125} fontSize={15}>
          3′
        </SvgText>
        <SvgText x={301} y={125} fontSize={15}>
          5′
        </SvgText>
        {template.split("").map((b, i) => (
          <React.Fragment key={i}>
            <Rect
              x={46 + i * 41}
              y={103}
              width={32}
              height={30}
              rx={5}
              fill={i === bases ? C.yellow : C.sage}
            />
            <SvgText x={56 + i * 41} y={125} fontSize={18}>
              {b}
            </SvgText>
            <SvgText x={56 + i * 41} y={55} fontSize={18}>
              {coding[i]}
            </SvgText>
          </React.Fragment>
        ))}
        <Path
          d={`M${62 + Math.min(bases, 5) * 41} 140V158`}
          stroke={C.red}
          strokeWidth={3}
        />
        <Circle
          cx={62 + Math.min(bases, 5) * 41}
          cy={184}
          r={24}
          fill={C.peach}
        />
        <Path
          d={`M${40 + Math.min(bases, 5) * 41} 178q22 -35 44 0`}
          fill={C.ink}
        />
        <Circle cx={55 + Math.min(bases, 5) * 41} cy={182} r={3} />
        <Circle cx={70 + Math.min(bases, 5) * 41} cy={182} r={3} />
        <Path
          d={`M${54 + Math.min(bases, 5) * 41} 194q9 8 18 0`}
          fill="none"
          stroke={C.ink}
        />
        <SvgText x={15} y={232} fontSize={13}>
          RNA · add at the growing 3′ end
        </SvgText>
        <SvgText x={15} y={268} fontSize={15}>
          5′
        </SvgText>
        {rna
          .slice(0, bases)
          .split("")
          .map((b, i) => (
            <React.Fragment key={i}>
              <Rect
                x={46 + i * 41}
                y={244}
                width={32}
                height={30}
                rx={5}
                fill="#DAD4EC"
              />
              <SvgText x={56 + i * 41} y={266} fontSize={18}>
                {b}
              </SvgText>
            </React.Fragment>
          ))}
        <SvgText
          x={Math.min(300, 48 + bases * 41)}
          y={268}
          fill={C.red}
          fontSize={15}
        >
          3′
        </SvgText>
      </Svg>
      <Text style={s.h3}>What that means</Text>
      <Text style={s.body}>{a.explain}</Text>
      <Tag color={C.yellow}>LOCK IN THE DETAIL</Tag>
      <Text style={s.body}>{a.hook}</Text>
      <Text style={s.h3}>
        {bases < 6
          ? `Template shows ${template[bases]}. Which RNA base comes next?`
          : "Your RNA reads 5′-AUGCCU-3′."}
      </Text>
      {bases < 6 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["A", "U", "C", "G"].map((b) => (
            <Button
              key={b}
              small
              secondary
              onPress={() => {
                if (b === rna[bases]) {
                  setBases(bases + 1);
                  setFeedback(
                    `${template[bases]} pairs with ${b}. The new nucleotide joins the RNA’s 3′ end.`,
                  );
                } else
                  setFeedback(
                    `Try the complementary RNA base: A–U, T–A, C–G, G–C.`,
                  );
              }}
            >
              {b}
            </Button>
          ))}
        </View>
      ) : (
        <Button
          secondary
          onPress={() => {
            setBases(0);
            setFeedback("");
          }}
        >
          Rebuild RNA from memory
        </Button>
      )}
      {!!feedback && (
        <Text accessibilityLiveRegion="polite" style={s.body}>
          {feedback}
        </Text>
      )}
      <View style={{ gap: 10 }}>
        {act > 0 && (
          <Button secondary onPress={() => change(act - 1)}>
            Previous detail
          </Button>
        )}
        <Button onPress={() => change((act + 1) % acts.length)}>
          {act === acts.length - 1 ? "Review the steps" : "Next detail"}
        </Button>
      </View>
      <Text style={s.h3}>Now look at the real structure</Text>
      <Text style={s.body}>
        PDB 1Y1W is an experimental yeast RNA polymerase II complex with DNA and
        RNA. It helps connect the cartoon to molecular structure; it is not a
        human-cell simulation.
      </Text>
      {Platform.OS === "web" &&
        React.createElement("iframe", {
          src: "/molecular-room.html?pdb=1Y1W",
          title: "Experimental RNA polymerase structure",
          style: { width: "100%", height: 430, border: 0, borderRadius: 16 },
        })}{" "}
      <Button
        secondary
        onPress={() => Linking.openURL("https://www.rcsb.org/structure/1Y1W")}
      >
        Structure and scientific source ↗
      </Button>
    </Card>
  );
}

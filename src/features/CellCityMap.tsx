import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Button, C, s, Text, Tag } from "../components/ui";
import { sceneStills } from "../data/cellCityScenes";
import { CityCharacter } from "../components/CityCharacter";
import { cellCity, hostOf } from "../data/cellCity";

const districts = [
  {
    name: "The Archive",
    place: "Blueprint quarter",
    clue: "DNA stays safe here. Carry a copy to Rho & Bo’s workshop.",
    x: 20,
    y: 22,
  },
  {
    name: "Sugar Street",
    place: "Cytoplasm",
    clue: "One six-carbon delivery becomes two three-carbon parcels. Two ATP remain after the investment.",
    x: 72,
    y: 30,
  },
  {
    name: "Power Works",
    place: "Mitochondrion",
    clue: "Electron carriers deliver energy. A proton gradient drives the ATP turbine.",
    x: 40,
    y: 48,
  },
  {
    name: "Blackout Alley",
    place: "Fault district",
    clue: "A blocked chain, a leaking gradient and a jammed turbine leave different evidence.",
    x: 76,
    y: 63,
  },
  {
    name: "Control Room",
    place: "Evidence desk",
    clue: "Compare oxygen use, proton gradient and ATP. Find the fault that explains all three.",
    x: 22,
    y: 73,
  },
  {
    name: "Dawn Harbour",
    place: "Final investigation",
    clue: "Restore the city by explaining how its systems depend on each other.",
    x: 55,
    y: 88,
  },
];

export function CellCityMap({
  done,
  onEnter,
}: {
  done: number[];
  onEnter: (index: number) => void;
}) {
  const [selected, setSelected] = useState(
    Math.max(
      0,
      cellCity.findIndex((e) => !done.includes(e.n)),
    ),
  );
  const d = districts[selected];
  const unlocked =
    selected === 0 || done.includes(selected) || done.includes(selected + 1);
  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          backgroundColor: "#E5EFF5",
          padding: 12,
          borderRadius: 28,
          gap: 12,
        }}
      >
        <View
          style={{
            padding: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={[s.label, { color: "#46677D" }]}>CELL CITY ATLAS</Text>
          <Text style={[s.small, { color: C.ink }]}>
            {done.length} / 6 restored
          </Text>
        </View>
        <View style={{ aspectRatio: 16 / 9, borderRadius: 20, overflow: "hidden" }}>
          <Image
            source={sceneStills[done.length === 6 ? 6 : 1]}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
          {districts.map((district, i) => (
            <Pressable
              key={district.name}
              accessibilityRole="button"
              accessibilityLabel={`Inspect ${district.name}`}
              accessibilityState={{ selected: selected === i }}
              onPress={() => setSelected(i)}
              style={{
                position: "absolute",
                left: `${district.x - 6}%`,
                top: `${district.y - 12}%`,
                width: 44, height: 44, justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selected === i ? C.yellow : C.paper,
                  backgroundColor: done.includes(i + 1) ? "#CDE0CF" : "#F5FAFD",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={[s.small, { color: C.ink, fontWeight: "700" }]}>
                  {done.includes(i + 1) ? "✓" : i + 1}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{districts.map((d,i)=><Pressable key={d.name} accessibilityRole="button" accessibilityState={{selected:selected===i}} onPress={()=>setSelected(i)} style={{paddingHorizontal:10,paddingVertical:10,borderRadius:12,backgroundColor:selected===i ? '#BDD5E4' : '#F5FAFD'}}><Text style={s.small}>{i+1} · {d.name}</Text></Pressable>)}</View>
        <Text style={[s.small, { color: C.muted, textAlign: "center" }]}>
          Choose a district to meet its resident and inspect the clue.
        </Text>
      </View>
      <View
        style={[
          s.paper,
          { gap: 12, borderTopWidth: 4, borderTopColor: C.yellow },
        ]}
      >
        <Tag>{d.place}</Tag>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <CityCharacter id={hostOf[selected + 1]} size={132} still />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={s.h2}>{d.name}</Text>
            <Text style={s.small}>{d.clue}</Text>
          </View>
        </View>
        <Text style={s.body}>
          Explore the scene, rebuild its process, then solve the evidence trail.
        </Text>
        <Button disabled={!unlocked} onPress={() => onEnter(selected)}>
          {unlocked
            ? done.includes(selected + 1)
              ? "Revisit this district"
              : "Enter this district"
            : `Restore district ${selected} to enter`}
        </Button>
      </View>
    </View>
  );
}

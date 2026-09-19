import React, { useMemo, useState } from "react";
import { Linking, Modal, Platform, SafeAreaView, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { Button, C, Card, s, Tag, Text } from "./ui";

const structures = [
  {
    id: "1RWT",
    title: "Photosystem II",
    copy: "A real experimental structure of the light-capturing reaction-centre complex. Rotate it, then connect the many protein and pigment parts to the chloroplast chef.",
    source: "https://www.rcsb.org/structure/1RWT",
  },
  {
    id: "1KX5",
    title: "DNA wrapped around a nucleosome",
    copy: "A real nucleosome structure: DNA bends around a histone core. Find the spool and the wrapped DNA before returning to the packing lab.",
    source: "https://www.rcsb.org/structure/1KX5",
  },
  {
    id: "1Y1W",
    title: "RNA polymerase II on DNA and RNA",
    copy: "A deposited polymerase elongation complex. Use the 3D geometry to locate the DNA–RNA path; it is molecular evidence, not a cartoon cell.",
    source: "https://www.rcsb.org/structure/1Y1W",
  },
];

function publicOrigin() {
  const configured = process.env.EXPO_PUBLIC_SITE_URL;
  const origin =
    configured || (Platform.OS === "web" ? window.location.origin : "");
  try {
    const url = new URL(origin);
    if (
      url.protocol !== "https:" ||
      /^(localhost|127\.|\[::1\])/.test(url.hostname)
    )
      return "";
    return url.origin;
  } catch {
    return "";
  }
}

function LessonQR({ value }: { value: string }) {
  const { path, size } = useMemo(() => {
    const qr = require("qrcode/lib/core/qrcode").create(value, {
      errorCorrectionLevel: "M",
    });
    const size = qr.modules.size;
    let path = "";
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (qr.modules.get(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
    return { path, size: size + 8 };
  }, [value]);
  return (
    <Svg
      width={210}
      height={210}
      viewBox={`0 0 ${size} ${size}`}
      accessibilityLabel="Scan to open this biology structure on your phone"
    >
      <Rect width={size} height={size} fill="white" />
      <Path d={path} fill="black" />
    </Svg>
  );
}

export function MedicalStudio({ concept }: { concept: number }) {
  const [chosen, setChosen] = useState(Math.max(0, Math.min(2, concept))),
    [open, setOpen] = useState(false),
    [reveal, setReveal] = useState(false),
    [error, setError] = useState("");
  const item = structures[chosen];
  const route = `/molecular-room.html?pdb=${item.id}`;
  const origin = publicOrigin();
  const url = origin + route;
  return (
    <>
      <Card style={{ backgroundColor: C.sage, borderRadius: 30, gap: 14 }}>
        <Tag>REAL STRUCTURE · RCSB PDB</Tag>
        <Text style={s.h2}>From memory picture to molecule.</Text>
        <Text style={s.body}>{item.copy}</Text>
        <View style={{ gap: 8 }}>
          {structures.map((structure, index) => (
            <Button
              key={structure.id}
              small
              secondary={chosen !== index}
              onPress={() => setChosen(index)}
            >
              {structure.title}
            </Button>
          ))}
        </View>
        <Button
          onPress={() => {
            setError("");
            if (Platform.OS === "web") setOpen(true);
            else if (origin)
              Linking.openURL(url).catch(() =>
                setError("The molecular viewer could not open."),
              );
          }}
          disabled={Platform.OS !== "web" && !origin}
        >
          Open {item.title} in 3D
        </Button>
        <Button secondary onPress={() => Linking.openURL(item.source)}>
          Read the experimental record ↗
        </Button>
        {!!origin && (
          <>
            <Button secondary onPress={() => setReveal(!reveal)}>
              {reveal ? "Fold away phone pass" : "Open on another device"}
            </Button>
            {reveal && (
              <View style={{ alignItems: "center", gap: 8 }}>
                <LessonQR value={url} />
                <Text style={s.small}>Scan to open the same structure.</Text>
              </View>
            )}
          </>
        )}
        {!!error && <Text style={s.small}>{error}</Text>}
        <Text style={s.small}>
          These are deposited molecular coordinates. They show molecules, not a
          whole living cell, and colors are viewer choices.
        </Text>
      </Card>
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: C.sage }}>
          <View style={{ padding: 12 }}>
            <Button secondary onPress={() => setOpen(false)}>
              Back to biology lesson
            </Button>
          </View>
          {Platform.OS === "web" &&
            React.createElement("iframe", {
              title: `${item.title} molecular explorer`,
              src: route,
              allowFullScreen: true,
              style: { width: "100%", flex: 1, border: 0, background: C.sage },
            })}
        </SafeAreaView>
      </Modal>
    </>
  );
}

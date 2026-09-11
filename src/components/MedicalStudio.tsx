import React, { useMemo, useState } from "react";
import { Linking, Modal, Platform, SafeAreaView, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { Button, C, Card, Icon, s, Tag, Text } from "./ui";

function publicOrigin() {
  const configured = process.env.EXPO_PUBLIC_SITE_URL;
  const origin = configured || (Platform.OS === "web" ? window.location.origin : "");
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" || /^(localhost|127\.|\[::1\])/.test(url.hostname)) return "";
    return url.origin;
  } catch { return ""; }
}
function LessonQR({ value }: { value: string }) {
  const { path, size } = useMemo(() => {
    const qr = require("qrcode/lib/core/qrcode").create(value, { errorCorrectionLevel: "M" });
    const size = qr.modules.size;
    let path = "";
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (qr.modules.get(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
    }
    return { path, size: size + 8 };
  }, [value]);
  return <Svg width={220} height={220} viewBox={`0 0 ${size} ${size}`} accessibilityLabel="Scan to open this medical model on your phone">
    <Rect width={size} height={size} fill="white" /><Path d={path} fill="black" />
  </Svg>;
}
export function MedicalStudio({ concept }: { concept: number }) {
  const [open, setOpen] = useState(false), [reveal, setReveal] = useState(false);
  const origin = publicOrigin();
  const route = `/medical-room.html?concept=${concept}`;
  const url = origin + route;
  const [error, setError] = useState("");
  return <>
    <Card style={{ backgroundColor: C.sage, borderRadius: 32, gap: 14 }}>
      <Tag>THE MEDICAL STUDIO</Tag>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Icon name="leaf" size={42} /><Text style={[s.h2, { flex: 1 }]}>A little closer to the biology.</Text>
      </View>
      <Text style={s.body}>Turn the model around. Explore its shape. Then hide it and explain what you remember.</Text>
      <Button disabled={Platform.OS !== "web" && !origin} onPress={() => {
        setError("");
        if (Platform.OS === "web") setOpen(true);
        else Linking.openURL(url).catch(() => setError("The studio could not open. Please try again."));
      }}>Explore in 3D</Button>
      <Text style={s.small}>{Platform.OS !== "web" && !origin ? "The 3D studio is not available in this native preview yet." : "On compatible phones, choose “Place in my room” inside the viewer."}</Text>
      {!!error && <Text accessibilityLiveRegion="polite" style={s.small}>{error}</Text>}
      {!!origin && <>
        <Button secondary onPress={() => setReveal(!reveal)}>{reveal ? "Fold away the phone pass" : "Unfold my phone pass"}</Button>
        {reveal && <View style={{ alignItems: "center", gap: 10 }}><LessonQR value={url} /><Text style={s.small}>Scan on another device to open this model.</Text><Button secondary onPress={() => Linking.openURL(url).catch(() => setError("The link could not open."))}>Open lesson link</Button></View>}
      </>}
    </Card>
    <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.sage }}>
        <View style={{ padding: 12 }}><Button secondary onPress={() => setOpen(false)}>Back to medical cards</Button></View>
        {Platform.OS === "web" && React.createElement("iframe", {
          title: "Quasar medical 3D studio", src: route,
          allow: "xr-spatial-tracking; fullscreen", allowFullScreen: true,
          style: { width: "100%", flex: 1, border: 0, background: C.sage },
        })}
      </SafeAreaView>
    </Modal>
  </>;
}

import { ProgressMobile } from "./src/components/ProgressMobile";
import { WelcomeScene } from "./src/components/WelcomeScene";
import { ToolkitIcon } from "./src/components/ToolkitIcon";
import { ExploreMemoryArt } from "./src/components/MemoryActivityArt";
import { vocabularyCues } from "./src/data/vocabularyCues";
import { FunFlex } from "./src/features/FunFlex";
import { StudyShelf, AtlasArt } from "./src/components/StudyShelf";
import { MedicineLesson } from "./src/features/MedicineLesson";
import { CalculusCourse } from "./src/features/CalculusCourse";
import { KoreanCourse } from "./src/features/KoreanCourse";
import { PiCourse } from "./src/features/PiCourse";
import { Walker } from "./src/components/PalaceGame";
import { EncounterMotion } from "./src/components/EncounterMotion";
import { Text } from "./src/components/ui";
import { art } from "./src/data/art";
import { useFonts } from "expo-font";
import { MemoryPalace, WorldPicture } from "./src/features/MemoryPalace";
import { SatCourse } from "./src/features/SatCourse";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Switch,
  Linking,
  AppState,
  Platform,
  BackHandler,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PurchasesPackage } from "react-native-purchases";
import {
  C,
  s,
  Icon,
  Button,
  Card,
  Tag,
  Field,
  Dots,
  serif,
} from "./src/components/ui";
import { Scene, FactImage } from "./src/components/Scene";
import {
  scenes,
  allFacts,
  extraFacts,
  lessons,
  type Fact,
  type ArtStyle,
} from "./src/data/content";
import {
  initialProgress,
  recordReview,
  reviveProgress,
  dueIds,
  streak,
  applicationHints,
  localDay,
  type Progress,
} from "./src/lib/progress";
import {
  storageKey,
  saveProgress,
  supabase,
  syncProgress,
  loadCloud,
  purchaseReady,
  getOfferings,
  customerInfo,
  buy,
  restore,
  hasPro,
  identifyPurchases,
  track,
  generatePersonalized,
} from "./src/lib/services";
type Page =
  | "home"
  | "library"
  | "review"
  | "progress"
  | "settings"
  | "scene"
  | "course"
  | "flex"
  | "sat"
  | "medicine"
  | "math"
  | "korean"
  | "pi"
  | "paywall";
const tabs = [
  ["home", "home", "Today"],
  ["library", "book", "Explore"],
  ["review", "cards", "Review"],
  ["progress", "chart", "Progress"],
] as const;
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    QuasarGrotesk: require("./assets/fonts/SpaceGrotesk.ttf"),
  });
  if (!fontsLoaded && !fontError)
    return <ActivityIndicator accessibilityLabel="Loading Quasar" />;
  return (
    <SafeAreaProvider>
      <Quasar />
    </SafeAreaProvider>
  );
}
function Quasar() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [p, setP] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [sceneId, setSceneId] = useState("market");
  const [notice, setNotice] = useState("");
  const [fact, setFact] = useState<Fact | null>(null);
  const [quiz, setQuiz] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [onboarding, setOnboarding] = useState(0);
  const [lesson, setLesson] = useState(0);
  const [application, setApplication] = useState(false);
  const [applicationText, setApplicationText] = useState("");
  const [applicationFeedback, setApplicationFeedback] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewStarted, setReviewStarted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [pro, setPro] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [personalStory, setPersonalStory] = useState("");
  const [personalImage, setPersonalImage] = useState<string | undefined>();
  const [, setClock] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const currentRef = useRef(p);
  currentRef.current = p;
  const userRef = useRef<string | null>(null);
  const storageReady = useRef(false);
  const scene = scenes.find((x) => x.id === sceneId)!;
  const due = dueIds(p).filter((id) => allFacts.some((f) => f.id === id));
  const mastered = allFacts.filter((f) => p.mastered[f.id]).length;
  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((raw) => {
        if (raw) setP(reviveProgress(raw));
      })
      .then(() => {
        storageReady.current = true;
      })
      .catch(() => {
        storageReady.current = false;
        setNotice(
          "Saved progress could not be read. Reset learning progress in Settings to start fresh.",
        );
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);
  useEffect(() => {
    if (loaded && storageReady.current)
      saveProgress(p, userId ?? undefined).catch(() =>
        setNotice(
          "Could not save on this device. Please keep the app open and free some storage.",
        ),
      );
  }, [p, loaded, userId]);
  useEffect(() => {
    if (!supabase || !loaded) return;
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      const nextId = session?.user.id ?? null;
      if (nextId === userRef.current) return;
      userRef.current = nextId;
      storageReady.current = false;
      setUserId(nextId);
      setAccountEmail(session?.user.email ?? "");
      setTimeout(async () => {
        try {
          if (nextId) {
            const local = await AsyncStorage.getItem(storageKey + "." + nextId);
            const cloud = await loadCloud(nextId);
            setP(
              local
                ? reviveProgress(local)
                : cloud
                  ? reviveProgress(JSON.stringify(cloud))
                  : { ...currentRef.current },
            );
          } else {
            const guest = await AsyncStorage.getItem(storageKey);
            setP(guest ? reviveProgress(guest) : initialProgress());
          }
          await identifyPurchases(nextId);
          if (purchaseReady) setPro(hasPro(await customerInfo()));
        } catch (e) {
          setNotice(message(e));
        } finally {
          storageReady.current = true;
        }
      }, 0);
    });
    const refresh = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase?.auth.startAutoRefresh();
        if (purchaseReady)
          customerInfo()
            .then((i) => setPro(hasPro(i)))
            .catch(() => {});
      } else supabase?.auth.stopAutoRefresh();
    });
    return () => {
      sub.data.subscription.unsubscribe();
      refresh.remove();
    };
  }, [loaded]);
  useEffect(() => {
    if (purchaseReady)
      customerInfo()
        .then((i) => setPro(hasPro(i)))
        .catch(() => {});
  }, []);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [page, onboarding, lesson]);
  useEffect(() => {
    const timer = setInterval(() => setClock((v) => v + 1), 60000);
    return () => clearInterval(timer);
  }, []);
  const updateProfile = (key: string, value: any) =>
    setP((v) => ({ ...v, profile: { ...v.profile, [key]: value } }));
  const nav = (next: Page) => {
    setPage(next);
    setNotice("");
    if (next === "review") setReviewStarted(false);
    if (next === "paywall" && purchaseReady)
      getOfferings()
        .then(setPackages)
        .catch((e) => setNotice(message(e)));
  };
  useEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (fact) {
        setFact(null);
        return true;
      }
      if (page !== "home") {
        nav("home");
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [page, fact]);
  const openScene = (id: string) => {
    if (id === "market") {
      nav("sat");
      return;
    }
    setSceneId(id);
    setP((v) => ({ ...v, lastScene: id }));
    setApplicationText("");
    setApplicationFeedback(false);
    nav("scene");
    track("scene_opened", p.analytics, { scene: id });
  };
  const selectFact = (f: Fact) => {
    setFact(f);
    setQuiz(false);
    setAnswer(null);
    setSelected(null);
    setPersonalStory("");
    setPersonalImage(undefined);
  };
  const submitAnswer = () => {
    if (!fact || selected === null || answer !== null) return;
    setAnswer(selected);
    setP((v) => recordReview(v, fact.id, selected === fact.answer));
    track("recall_answered", p.analytics, {
      fact: fact.id,
      correct: selected === fact.answer,
    });
  };
  const startReview = (ids: string[]) => {
    setReviewQueue(ids);
    setReviewIndex(0);
    setFlipped(false);
    setReviewStarted(true);
  };
  const rateReview = (correct: boolean) => {
    const id = reviewQueue[reviewIndex];
    setP((v) => recordReview(v, id, correct));
    setReviewIndex((i) => i + 1);
    setFlipped(false);
  };
  const auth = async (signup: boolean) => {
    if (!supabase) {
      setNotice(
        "Account sync is not configured yet. You can keep learning on this device.",
      );
      return;
    }
    if (!email.trim() || password.length < 8) {
      setNotice("Enter an email and a password of at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const result = signup
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
      if (result.error) throw result.error;
      setNotice(
        signup && !result.data.session
          ? "Check your email to confirm your account."
          : "You’re signed in.",
      );
      setPassword("");
    } catch (e) {
      setNotice(message(e));
    } finally {
      setBusy(false);
    }
  };
  const pay = async (pack?: PurchasesPackage) => {
    setBusy(true);
    try {
      const info = pack ? await buy(pack) : await restore();
      setPro(hasPro(info));
      setNotice(
        hasPro(info)
          ? "Quasar Plus is active. Thank you!"
          : "No active Quasar Plus subscription was found.",
      );
    } catch (e: any) {
      setNotice(
        e.userCancelled
          ? "Purchase cancelled. No access changes were made."
          : message(e),
      );
    } finally {
      setBusy(false);
    }
  };
  if (!loaded)
    return (
      <SafeAreaView style={a.loading}>
        <Icon name="spark" size={45} />
        <Text style={s.h2}>Quasar</Text>
        <ActivityIndicator color={C.green} />
      </SafeAreaView>
    );
  const heading = (eyebrow: string, title: string, body?: string) => (
    <View style={{ gap: 9 }}>
      <Text style={a.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {body && <Text style={s.body}>{body}</Text>}
    </View>
  );
  const courseBody = () => {
    const l = lessons[lesson];
    return (
      <View style={{ gap: 22 }}>
        <View style={s.between}>
          <Tag>Lesson {lesson + 1} of 6</Tag>
          <Text style={s.small}>THE MEMORY TOOLKIT</Text>
        </View>
        <View style={s.progress}>
          <View
            style={{
              width: (((lesson + 1) / 6) * 100 + "%") as any,
              height: 6,
              backgroundColor: C.green,
            }}
          />
        </View>
        <View style={a.lessonIcon}>
          <Icon name={l.icon} size={55} />
        </View>
        {heading(l.type, l.title, l.body)}
        <Card style={{ backgroundColor: C.sage, borderWidth: 0 }}>
          <Text style={s.label}>Picture this</Text>
          <Text style={[s.body, { color: C.ink }]}>{l.example}</Text>
        </Card>
        <Text style={s.body}>{l.challenge}</Text>
        <View style={s.row}>
          {lesson > 0 && (
            <Button secondary onPress={() => setLesson(lesson - 1)}>
              Back
            </Button>
          )}
          <View style={{ flex: 1 }}>
            <Button
              icon="arrow"
              onPress={() => {
                if (lesson < 5) {
                  setLesson(lesson + 1);
                  setP((v) => ({
                    ...v,
                    lesson: Math.max(v.lesson, lesson + 1),
                  }));
                } else {
                  setP((v) => ({ ...v, onboarded: true, lesson: 6 }));
                  nav("home");
                }
              }}
            >
              {lesson === 5 ? "Let’s make it stick" : "Next lesson"}
            </Button>
          </View>
        </View>
      </View>
    );
  };
  const sceneCard = (sc: (typeof scenes)[number]) => (
    <Pressable
      key={sc.id}
      accessibilityRole="button"
      onPress={() => openScene(sc.id)}
      style={({ pressed }) => [a.sceneCard, pressed && { opacity: 0.9 }]}
    >
      <View style={{ backgroundColor: C.yellow }}>
        <AtlasArt
          source={require("./assets/sat-latest-selected.png")}
          columns={5}
          rows={2}
          index={7}
          height={112}
        />
      </View>
      <View style={{ padding: 18, gap: 9 }}>
        <Tag color={sc.color}>{sc.subject}</Tag>
        <Text style={s.h3}>
          {sc.id === "market" ? "SAT words in pictures" : sc.title}
        </Text>
        <View style={s.between}>
          <Text style={s.small}>
            {sc.id === "market"
              ? "10 words · two five-word sessions"
              : `${sc.facts.length} memory cues · ${sc.duration}`}
          </Text>
          <Icon name="arrow" size={20} />
        </View>
      </View>
    </Pressable>
  );
  const home = () => {
    const cont = scenes.find((x) => x.id === p.lastScene) ?? scenes[0];
    const deck = allFacts.filter((f) => f.sceneId === cont.id);
    const n = deck.filter((f) => p.mastered[f.id]).length;
    return (
      <View style={{ gap: 30 }}>
        <View style={s.between}>
          <View style={{ flex: 1 }}>
            {heading(
              "YOUR STUDY SPACE",
              p.profile.name
                ? "Hello, " + p.profile.name.split(" ")[0] + "."
                : "Hello, curious mind.",
              "Choose a lesson or review what you’ve learned.",
            )}
          </View>
        </View>
        <View style={[a.hero, wide && { flexDirection: "row" }]}>
          <View style={{ flex: 1, gap: 15, padding: 24 }}>
            <Tag color="#D4DFB9">CONTINUE LEARNING</Tag>
            <Text style={[s.h2, { fontSize: 30, lineHeight: 35 }]}>
              {cont.id === "market" ? "Your vocabulary sketchbook" : cont.title}
            </Text>
            <Text style={[s.body, { color: C.ink }]}>
              {n
                ? n +
                  ` of ${deck.length} words recalled. Pick up where you left off.`
                : "Learn five illustrated words, then use them in context."}
            </Text>
            <Button icon="arrow" onPress={() => openScene(cont.id)}>
              {n ? "Continue learning" : "Start exploring"}
            </Button>
          </View>
          <Image
            source={
              cont.id === "market"
                ? require("./assets/vocabulary-sketchbook-transparent.png")
                : art[cont.id as keyof typeof art][p.profile.style]
            }
            style={
              wide
                ? { width: "45%", height: "100%", minHeight: 255 }
                : { width: "100%", height: 205 }
            }
            resizeMode={cont.id === "market" ? "contain" : "cover"}
          />
        </View>
        <View style={a.statsRow}>
          {[
            [String(due.length), "ready to review", "cards"],
            [
              String(streak(p)) + " day" + (streak(p) === 1 ? "" : "s"),
              "learning streak",
              "flame",
            ],
            [String(mastered), "concepts recalled", "leaf"],
          ].map(([num, label, icon]) => (
            <View key={label} style={a.stat}>
              <Icon name={icon} size={20} />
              <Text style={a.statNumber}>{num}</Text>
              <Text style={s.small}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={s.section}>
          <Tag color={C.yellow}>A FRESH WAY TO LEARN</Tag>
          <Text style={s.h2}>Small sessions. Big imagination.</Text>
          <Card style={{ backgroundColor: C.peach }}>
            <EncounterMotion variant={1}>
              <View
                style={{
                  alignSelf: "center",
                  width: 90,
                  height: 110,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: C.yellow,
                  borderRadius: 50,
                }}
              >
                <View style={{ transform: [{ scale: 1.5 }] }}>
                  <Walker />
                </View>
              </View>
            </EncounterMotion>
            <Text style={s.h3}>Big words. Ridiculous situations.</Text>
            <Text style={s.body}>
              Sound hooks and unexpected cartoons, then a vocabulary-in-context
              challenge. Make the meaning stick.
            </Text>
            <Button onPress={() => nav("sat")}>
              Start a five-word session
            </Button>
          </Card>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore memory worlds"
            onPress={() => nav("flex")}
          >
            <Card style={{ backgroundColor: C.sage }}>
              <WorldPicture world={p.palace?.world ?? 0} />
              <Text style={s.h3}>Your next memory lives here.</Text>
              <Text style={s.body}>
                Walk through a dojo, ancient ruins or neon rooftops. Learn pi
                with objects that are hard to forget.
              </Text>
              <Text style={s.link}>Explore memory worlds →</Text>
            </Card>
          </Pressable>
          <Card
            style={{
              backgroundColor: "#ECE4F4",
              borderRadius: 8,
              borderColor: C.ink,
              borderWidth: 2,
            }}
          >
            <Tag>THE BIOLOGY STUDIO</Tag>
            <AtlasArt
              source={require("./assets/bio-cells-world.png")}
              columns={3}
              rows={2}
              index={2}
              height={165}
              inset={0.92}
            />
            <Text style={s.h3}>Start tiny. Build the whole living story.</Text>
            <Text style={s.body}>
              Explore cells, photosynthesis, DNA structure, replication and gene
              expression through evidence, memory scenes and mini labs.
            </Text>
            <Button onPress={() => nav("medicine")}>
              Explore biology foundations
            </Button>
          </Card>
          <Text style={s.h2}>Your memory toolkit</Text>
          {lessons.map((item, index) => (
            <Pressable
              key={index}
              accessibilityRole="button"
              onPress={() => {
                setLesson(index);
                nav("course");
              }}
              style={a.tip}
            >
              <View style={{ width: 92 }}>
                <ToolkitIcon index={index} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.h3}>{item.title}</Text>
                <Text style={s.small}>
                  Lesson {index + 1} · Learn & practise →
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text style={[s.small, { textAlign: "center" }]}>
          Learn the story. Recall the idea. Apply what you know.
        </Text>
      </View>
    );
  };
  const library = () => (
    <View style={{ gap: 24 }}>
      <Card style={{ backgroundColor: C.yellow, gap: 14, borderRadius: 28 }}>
        <Tag>π · THE RIDICULOUS ROUTE</Tag>
        <Image
          source={require("./assets/pi-pie-transparent.png")}
          resizeMode="contain"
          style={{ width: "100%", height: 210 }}
          accessibilityLabel="A runaway apple pie pulls an endless ribbon of digits"
        />
        <Text style={s.h2}>100 digits. 50 impossible things.</Text>
        <Text style={s.body}>
          Ten strange rooms, sound-coded objects, and recall without peeking.
          Build your first hundred decimal digits in order.
        </Text>
        <Button onPress={() => nav("pi")}>Open the π memory course</Button>
      </Card>
      <FunFlex onWorlds={() => nav("flex")} />
      <Card style={{ backgroundColor: C.peach, gap: 14, borderRadius: 28 }}>
        <Tag>NEW · THE CALCULUS WORKSHOP</Tag>
        <ExploreMemoryArt kind="calculus" />
        <Text style={s.h2}>Slopes, crumbs, and the bigger picture.</Text>
        <Text style={s.body}>
          Three lessons: derivatives, integration and accumulation. Work through
          each move before trying it yourself.
        </Text>
        <Button onPress={() => nav("math")}>Open calculus lessons</Button>
      </Card>
      <Card style={{ backgroundColor: C.sage, gap: 14, borderRadius: 28 }}>
        <Tag>NEW · KOREAN NEIGHBOURHOOD</Tag>
        <Image
          source={require("./assets/korean-explore-transparent.png")}
          resizeMode="contain"
          style={{ width: "100%", height: 210 }}
          accessibilityLabel="Two Korean learners trace a sound in the air"
        />
        <Text style={s.h2}>Your first letters. Your first hello.</Text>
        <Text style={s.body}>
          See the shape, trace it with your finger, listen, and practise a small
          conversation at your pace.
        </Text>
        <Button onPress={() => nav("korean")}>Open Korean practice</Button>
      </Card>
      <Card
        style={{
          backgroundColor: C.paper,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: C.green,
        }}
      >
        <Tag>START WITH THE HOW</Tag>
        <Text style={s.h2}>Six ways to make a memory.</Text>
        <AtlasArt
          source={require("./assets/lesson-stories.png")}
          columns={3}
          rows={2}
          index={5}
          height={190}
        />
        <Text style={s.body}>
          Meet the peg baker, the moon astronomer and a traveler who gives every
          idea an address.
        </Text>
        <Button
          onPress={() => {
            setLesson(0);
            nav("course");
          }}
        >
          Open the memory toolkit
        </Button>
      </Card>
      <Button secondary onPress={() => openScene("market")}>
        Open your vocabulary deck
      </Button>
    </View>
  );
  const scenePage = () => {
    const attempted = scene.facts.filter((f) => p.attempted[f.id]).length;
    const n = scene.facts.filter((f) => p.mastered[f.id]).length;
    return (
      <View style={{ gap: 20 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => nav("library")}
          style={s.row}
        >
          <Icon name="back" size={18} />
          <Text style={s.link}>All scenes</Text>
        </Pressable>
        {heading(
          scene.subject,
          scene.title,
          "Tap a numbered object. Give the idea a picture, then try recalling it.",
        )}

        <Scene
          scene={scene}
          style={p.profile.style}
          mastered={p.mastered}
          onSelect={selectFact}
        />
        <Card style={{ backgroundColor: C.sage }}>
          <View style={s.between}>
            <Text style={s.label}>{n} / 6 concepts recalled</Text>
            <Icon name="leaf" />
          </View>
          <View style={s.progress}>
            <View
              style={{
                width: ((n / 6) * 100 + "%") as any,
                height: 6,
                backgroundColor: C.green,
              }}
            />
          </View>
          <Text style={s.small}>
            {attempted}/6 cues attempted. Missed answers are scheduled for
            another look.
          </Text>
        </Card>
        {attempted === 6 ? (
          <Card>
            <Tag color={C.yellow}>PUT IT TO WORK</Tag>
            <Text style={s.h3}>Remembering is just the start.</Text>
            <Text style={s.body}>
              Try using these ideas in a new situation.
            </Text>
            <Button
              onPress={() => {
                setApplication(true);
                setApplicationFeedback(false);
              }}
            >
              {p.applications[scene.id]
                ? "Revisit application"
                : "Try the application question"}
            </Button>
          </Card>
        ) : (
          <Text style={s.small}>
            An application challenge opens after you’ve attempted all six cues.
          </Text>
        )}
      </View>
    );
  };
  const review = () => {
    const f = allFacts.find((f) => f.id === reviewQueue[reviewIndex]);
    return (
      <View style={{ gap: 24 }}>
        {heading(
          "RECALL PRACTICE",
          "Make it last.",
          "Bring a memory back just before it fades.",
        )}
        {!reviewStarted ? (
          <>
            <Card style={{ backgroundColor: C.sage }}>
              <Icon name="cards" size={36} />
              <Text style={s.h2}>
                {due.length
                  ? due.length + " memories are ready."
                  : "You’re all caught up."}
              </Text>
              <Text style={s.body}>
                {due.length
                  ? "Your review timing is personalized with spaced repetition."
                  : "Practise the vocabulary deck or try a memory challenge while your next review grows."}
              </Text>
              <Button disabled={!due.length} onPress={() => startReview(due)}>
                Start due reviews
              </Button>
            </Card>
            <Button
              secondary
              onPress={() => startReview(allFacts.map((f) => f.id))}
            >
              Practice all 10 cards
            </Button>
            <Button secondary onPress={() => nav("library")}>
              Discover a new memory challenge
            </Button>
          </>
        ) : !f ? (
          <Card style={{ alignItems: "center", padding: 35 }}>
            <Icon name="check" size={50} />
            <Text style={s.h2}>Review complete.</Text>
            <Text style={s.body}>
              You reviewed {reviewQueue.length} cards. Your next reviews are
              scheduled.
            </Text>
            <Button onPress={() => setReviewStarted(false)}>
              Back to review
            </Button>
          </Card>
        ) : (
          <>
            <View style={s.between}>
              <Tag>
                {reviewIndex + 1} / {reviewQueue.length}
              </Tag>
              <Pressable
                accessibilityRole="button"
                onPress={() => setReviewStarted(false)}
              >
                <Text style={s.link}>End session</Text>
              </Pressable>
            </View>
            <Card style={{ minHeight: 360, justifyContent: "center" }}>
              <Text style={a.eyebrow}>RECALL BEFORE REVEALING</Text>
              <Text style={[s.title, { textAlign: "center" }]}>{f.word}</Text>
              <Text style={[s.body, { textAlign: "center" }]}>
                What does it mean? Picture its memory cue.
              </Text>
              {flipped ? (
                <>
                  <FactImage fact={f} style={p.profile.style} />
                  <Text style={s.h3}>{f.definition}</Text>
                  <Text style={s.body}>
                    {f.sceneId === "market"
                      ? vocabularyCues[
                          allFacts
                            .filter((f) => f.sceneId === "market")
                            .findIndex((item) => item.id === f.id)
                        ].story
                      : f.story}
                  </Text>
                  <View style={s.row}>
                    <View style={{ flex: 1 }}>
                      <Button secondary onPress={() => rateReview(false)}>
                        Need another look
                      </Button>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button onPress={() => rateReview(true)}>Got it</Button>
                    </View>
                  </View>
                </>
              ) : (
                <Button onPress={() => setFlipped(true)}>
                  Reveal the memory
                </Button>
              )}
            </Card>
            <Text style={s.small}>
              Be honest with yourself. “Need another look” brings this card back
              sooner.
            </Text>
          </>
        )}
      </View>
    );
  };
  const progress = () => {
    const accuracy = p.reviews.length
      ? Math.round(
          (p.reviews.filter((r) => r.correct).length / p.reviews.length) * 100,
        )
      : 0;
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 6 + i);
      return d;
    });
    return (
      <View style={{ gap: 25 }}>
        {heading(
          "YOUR PROGRESS",
          "Your growing collection.",
          "Every return makes a memory a little easier to find.",
        )}
        <ProgressMobile
          mastered={mastered}
          accuracy={p.reviews.length ? accuracy : null}
          streak={streak(p)}
        />
        <Card>
          <Tag>THE LAST SEVEN DAYS</Tag>
          <Text style={s.h3}>A little rhythm goes a long way.</Text>
          <View style={[s.between, { paddingVertical: 10 }]}>
            {days.map((d) => {
              const active = p.reviews.some(
                (r) => localDay(new Date(r.at)) === localDay(d),
              );
              return (
                <View
                  key={d.toISOString()}
                  style={{ gap: 9, alignItems: "center" }}
                >
                  <View style={[a.day, active && { backgroundColor: C.green }]}>
                    <Icon
                      name={active ? "check" : "leaf"}
                      size={20}
                      color={active ? C.white : C.muted}
                    />
                  </View>
                  <Text style={s.small}>
                    {d.toLocaleDateString(undefined, { weekday: "narrow" })}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
        {scenes.map((sc) => (
          <Card key={sc.id}>
            <View style={s.between}>
              <Text style={[s.h3, { flex: 1 }]}>{sc.title}</Text>
              <Text style={s.label}>
                {sc.facts.filter((f) => p.mastered[f.id]).length}/
                {sc.facts.length}
              </Text>
            </View>
            <Text style={s.small}>
              {p.applications[sc.id]
                ? "Application reflection completed"
                : "Application reflection still to come"}
            </Text>
            <Button secondary onPress={() => openScene(sc.id)}>
              Open vocabulary deck
            </Button>
          </Card>
        ))}
        <Text style={s.h2}>Next to revisit</Text>
        {due.length === 0 ? (
          <Text style={s.body}>Nothing is due right now. Nice work.</Text>
        ) : (
          due.map((id) => (
            <View key={id} style={s.between}>
              <Text style={s.label}>
                {allFacts.find((f) => f.id === id)?.word}
              </Text>
              <Tag>Ready now</Tag>
            </View>
          ))
        )}
        {Object.entries(p.cards)
          .filter(([, c]) => new Date(c.due) > new Date())
          .slice(0, 6)
          .map(([id, c]) => (
            <View key={id} style={s.between}>
              <Text style={s.label}>
                {allFacts.find((f) => f.id === id)?.word}
              </Text>
              <Text style={s.small}>
                {new Date(c.due).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
      </View>
    );
  };
  const settings = () => (
    <View style={{ gap: 23 }}>
      {heading("MAKE YOURSELF AT HOME", "Settings")}
      <Card>
        <Text style={s.h3}>Your study profile</Text>

        <Field
          label="What should we call you?"
          value={p.profile.name}
          onChangeText={(v) => updateProfile("name", v)}
        />
        <Field
          label="Your interests"
          value={p.profile.interests}
          onChangeText={(v) => updateProfile("interests", v)}
        />
        <Field
          label="A familiar place"
          value={p.profile.familiarPlace}
          onChangeText={(v) => updateProfile("familiarPlace", v)}
        />
      </Card>
      <Card>
        <View style={s.between}>
          <Text style={s.h3}>Your account</Text>
          <Tag>{userId ? "Connected" : "On this device"}</Tag>
        </View>
        {userId ? (
          <>
            <Text style={s.body}>{accountEmail}</Text>
            <Button
              disabled={busy}
              onPress={async () => {
                setBusy(true);
                try {
                  await syncProgress(p, userId);
                  setNotice("Progress backed up to your account.");
                } catch (e) {
                  setNotice(message(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              Back up progress
            </Button>
            <Button
              secondary
              onPress={() =>
                supabase?.auth.signOut().then(({ error }) => {
                  if (error) setNotice(error.message);
                })
              }
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Text style={s.body}>
              {supabase
                ? "Sign in to back up your memories."
                : "Your memories save automatically on this device. Cloud accounts will be available when the service is connected."}
            </Text>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button disabled={busy || !supabase} onPress={() => auth(false)}>
              Sign in
            </Button>
            <Button
              secondary
              disabled={busy || !supabase}
              onPress={() => auth(true)}
            >
              Create account
            </Button>
          </>
        )}
      </Card>
      <Card>
        <View style={s.between}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={s.label}>Share anonymous learning events</Text>
            <Text style={s.small}>
              Optional. Your personal answers and stories are never included.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Share anonymous learning events"
            value={p.analytics}
            onValueChange={(v) => setP((x) => ({ ...x, analytics: v }))}
            trackColor={{ true: C.green, false: C.line }}
          />
        </View>
      </Card>
      <Button
        secondary
        onPress={() => {
          setLesson(0);
          nav("course");
        }}
      >
        Revisit the memory toolkit
      </Button>
      <Button secondary onPress={() => nav("paywall")}>
        {pro ? "Manage Quasar Plus" : "Explore Quasar Plus"}
      </Button>
      <Card>
        <Text style={s.h3}>A fresh start</Text>
        <Text style={s.body}>
          Reset this profile’s local learning progress. Cloud backups are
          unaffected until you back up again.
        </Text>
        {confirmReset ? (
          <>
            <Button
              onPress={() => {
                storageReady.current = true;
                setP(initialProgress());
                setOnboarding(0);
                setLesson(0);
                setConfirmReset(false);
                nav("home");
              }}
            >
              Confirm reset
            </Button>
            <Button secondary onPress={() => setConfirmReset(false)}>
              Keep my memories
            </Button>
          </>
        ) : (
          <Button secondary onPress={() => setConfirmReset(true)}>
            Reset learning progress
          </Button>
        )}
      </Card>
      <Text style={s.small}>
        Quasar 1.0 · Original illustrations and educational content.
      </Text>
    </View>
  );
  const paywall = () => (
    <View style={{ gap: 24 }}>
      {heading(
        "QUASAR PLUS",
        "Make learning personal.",
        "Support Quasar and unlock personalized mnemonic generation.",
      )}
      <Card style={{ backgroundColor: C.sage }}>
        <Icon name="spark" size={48} />
        <Text style={s.h2}>
          {pro ? "Your Plus membership is active." : "Make the story yours."}
        </Text>
        {[
          "Personalized stories built around your interests",
          "Optional illustrations for personalized stories",
          "Core scenes, reviews, and progress always available",
        ].map((x) => (
          <View key={x} style={s.row}>
            <Icon name="check" size={18} />
            <Text style={[s.body, { flex: 1, color: C.ink }]}>{x}</Text>
          </View>
        ))}
      </Card>
      {!purchaseReady ? (
        <Card>
          <Text style={s.h3}>Subscriptions are not available here yet.</Text>
          <Text style={s.body}>
            Keep exploring the complete learning demo. Purchases will open once
            Quasar is connected to the app store.
          </Text>
        </Card>
      ) : packages.length ? (
        packages.map((pack) => (
          <Card key={pack.identifier}>
            <Text style={s.h3}>{pack.product.title}</Text>
            <Text style={s.body}>{pack.product.description}</Text>
            <Button
              disabled={
                busy ||
                !process.env.EXPO_PUBLIC_PRIVACY_URL ||
                !process.env.EXPO_PUBLIC_TERMS_URL
              }
              onPress={() => pay(pack)}
            >
              {pack.product.priceString} · {pack.packageType.toLowerCase()}
            </Button>
          </Card>
        ))
      ) : (
        <Text style={s.body}>
          No subscription offers are available. Please try again later.
        </Text>
      )}
      <Button secondary disabled={busy || !purchaseReady} onPress={() => pay()}>
        Restore purchases
      </Button>
      {pro && (
        <Button
          secondary
          onPress={() =>
            customerInfo()
              .then((i) => {
                if (i.managementURL) Linking.openURL(i.managementURL);
                else
                  setNotice(
                    "Manage your subscription in your device’s app store settings.",
                  );
              })
              .catch((e) => setNotice(message(e)))
          }
        >
          Manage subscription
        </Button>
      )}
      <Text style={s.small}>
        Subscriptions renew automatically unless cancelled through your app
        store. Price and billing period are shown by the store before payment.
      </Text>
      <View style={s.row}>
        {[
          ["Privacy", process.env.EXPO_PUBLIC_PRIVACY_URL],
          ["Terms", process.env.EXPO_PUBLIC_TERMS_URL],
        ].map(([label, url]) =>
          url ? (
            <Pressable
              accessibilityRole="link"
              key={label}
              onPress={() => Linking.openURL(url)}
            >
              <Text style={s.link}>{label}</Text>
            </Pressable>
          ) : null,
        )}
      </View>
      <Button secondary onPress={() => nav("home")}>
        Keep learning
      </Button>
    </View>
  );
  return (
    <SafeAreaView style={a.safe}>
      <StatusBar style="dark" />
      <View style={a.layout}>
        {wide && p.onboarded && (
          <View style={a.sidebar}>
            <Brand />
            <View style={{ gap: 8, marginTop: 38 }}>
              {tabs.map(([id, icon, label]) => (
                <Pressable
                  accessibilityRole="button"
                  key={id}
                  onPress={() => nav(id)}
                  style={[
                    a.sideItem,
                    page === id && { backgroundColor: C.sage },
                  ]}
                >
                  <Icon name={icon} size={22} />
                  <Text style={s.label}>{label}</Text>
                  {id === "review" && due.length > 0 && <Tag>{due.length}</Tag>}
                </Pressable>
              ))}
            </View>
            <View style={{ flex: 1 }} />
            <Card
              style={{ backgroundColor: C.sage, padding: 17, borderWidth: 0 }}
            >
              <Icon name="spark" />
              <Text style={s.h3}>Personalized learning</Text>
              <Text style={s.small}>Meet Quasar Plus.</Text>
              <Button small onPress={() => nav("paywall")}>
                Take a look
              </Button>
            </Card>
            <Pressable
              accessibilityRole="button"
              onPress={() => nav("settings")}
              style={a.sideItem}
            >
              <Icon name="settings" />
              <Text style={s.label}>Your corner</Text>
            </Pressable>
            <Text style={s.small}>LITTLE STORIES. LASTING MEMORIES.</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={a.topbar}>
            {!wide || !p.onboarded ? (
              <Brand />
            ) : (
              <Text style={s.small}>Your daily dose of discovery</Text>
            )}
            <View style={s.row}>
              <View style={[s.row, { gap: 5 }]}>
                <Icon name="flame" size={18} />
                <Text style={s.label}>{streak(p)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                onPress={() => nav("settings")}
                style={a.avatar}
              >
                <Text style={s.label}>
                  {p.profile.name ? p.profile.name[0].toUpperCase() : "Q"}
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Dots />
            <ScrollView
              ref={scroll}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                a.content,
                { maxWidth: p.onboarded ? 1050 : 620 },
                !wide && { padding: 20, paddingBottom: 35 },
              ]}
            >
              {notice ? (
                <View accessibilityRole="alert" style={a.notice}>
                  <Text style={[s.body, { color: C.ink, flex: 1 }]}>
                    {notice}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Dismiss message"
                    onPress={() => setNotice("")}
                  >
                    <Icon name="close" size={18} />
                  </Pressable>
                </View>
              ) : null}
              {!p.onboarded && page !== "settings" ? (
                onboarding === 0 ? (
                  <View style={{ gap: 24 }}>
                    <WelcomeScene />
                    {heading(
                      "WELCOME TO QUASAR",
                      "Learn it once. Remember it longer.",
                      "Turn what you need to know into something you can picture. Learn through illustrated stories, then practice recalling and applying the ideas.",
                    )}
                    <Text style={s.label}>What are you curious about?</Text>
                    <View style={s.row}>
                      {[
                        "SAT vocabulary",
                        "Memory skills",
                        "Biology foundations",
                      ].map((sub) => (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{
                            selected: p.profile.subjects.includes(sub),
                          }}
                          key={sub}
                          onPress={() =>
                            updateProfile(
                              "subjects",
                              p.profile.subjects.includes(sub)
                                ? p.profile.subjects.filter((x) => x !== sub)
                                : [...p.profile.subjects, sub],
                            )
                          }
                          style={[
                            a.styleChoice,
                            p.profile.subjects.includes(sub) && {
                              backgroundColor: C.sage,
                              borderColor: C.green,
                            },
                          ]}
                        >
                          <Text style={s.label}>{sub}</Text>
                        </Pressable>
                      ))}
                    </View>
                    <Button
                      icon="arrow"
                      disabled={!p.profile.subjects.length}
                      onPress={() => setOnboarding(1)}
                    >
                      Let’s get curious
                    </Button>
                    <Text style={[s.small, { textAlign: "center" }]}>
                      No account needed. Start with six tiny memory lessons.
                    </Text>
                  </View>
                ) : onboarding === 1 ? (
                  <View style={{ gap: 20 }}>
                    {heading(
                      "MAKE IT PERSONAL",
                      "Familiar things stick.",
                      "These optional details can help personalize your stories later. Make-believe answers work too.",
                    )}
                    <Field
                      label="What should we call you?"
                      value={p.profile.name}
                      onChangeText={(v) => updateProfile("name", v)}
                      placeholder="Your first name"
                    />
                    <Field
                      label="What do you love doing?"
                      value={p.profile.interests}
                      onChangeText={(v) => updateProfile("interests", v)}
                      placeholder="Gardening, games, music…"
                    />
                    <Field
                      label="A town you know well"
                      value={p.profile.hometown}
                      onChangeText={(v) => updateProfile("hometown", v)}
                    />
                    <Field
                      label="A favorite movie, show, or book"
                      value={p.profile.favoriteStory}
                      onChangeText={(v) => updateProfile("favoriteStory", v)}
                    />
                    <Field
                      label="A familiar place"
                      value={p.profile.familiarPlace}
                      onChangeText={(v) => updateProfile("familiarPlace", v)}
                      placeholder="A kitchen, a park, a library…"
                    />
                    <Field
                      label="A friendly name for your stories"
                      value={p.profile.friend}
                      onChangeText={(v) => updateProfile("friend", v)}
                    />

                    <Button
                      icon="arrow"
                      onPress={() => {
                        setOnboarding(2);
                        setLesson(p.lesson < 6 ? p.lesson : 0);
                      }}
                    >
                      Build my memory toolkit
                    </Button>
                    <Button secondary onPress={() => setOnboarding(0)}>
                      Back
                    </Button>
                  </View>
                ) : (
                  courseBody()
                )
              ) : page === "home" ? (
                home()
              ) : page === "library" ? (
                library()
              ) : page === "scene" ? (
                scenePage()
              ) : page === "review" ? (
                review()
              ) : page === "progress" ? (
                progress()
              ) : page === "course" ? (
                courseBody()
              ) : page === "flex" ? (
                <MemoryPalace
                  saved={p.palace}
                  onSave={(palace) => setP((old) => ({ ...old, palace }))}
                />
              ) : page === "math" ? (
                <CalculusCourse />
              ) : page === "pi" ? (
                <PiCourse
                  progress={p}
                  onChange={setP}
                  onWorlds={() => nav("flex")}
                />
              ) : page === "korean" ? (
                <KoreanCourse />
              ) : page === "medicine" ? (
                <MedicineLesson
                  recalled={p.medicalRecalled ?? []}
                  onRecall={(index, correct) =>
                    setP((old) => ({
                      ...old,
                      medicalRecalled: correct
                        ? Array.from(
                            new Set([...(old.medicalRecalled ?? []), index]),
                          )
                        : (old.medicalRecalled ?? []).filter(
                            (i) => i !== index,
                          ),
                    }))
                  }
                />
              ) : page === "sat" ? (
                <SatCourse progress={p} onChange={setP} />
              ) : page === "paywall" ? (
                paywall()
              ) : (
                settings()
              )}
            </ScrollView>
          </View>
          {!wide && p.onboarded && (
            <View style={a.bottom}>
              {tabs.map(([id, icon, label]) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: page === id }}
                  key={id}
                  onPress={() => nav(id)}
                  style={a.tab}
                >
                  <View
                    style={[
                      a.tabIcon,
                      page === id && { backgroundColor: C.sage },
                    ]}
                  >
                    <Icon name={icon} size={23} />
                  </View>
                  <Text
                    style={[
                      s.small,
                      page === id && { color: C.green, fontWeight: "700" },
                    ]}
                  >
                    {label}
                    {id === "review" && due.length ? " · " + due.length : ""}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
      <Modal
        visible={!!fact}
        transparent
        animationType="slide"
        onRequestClose={() => setFact(null)}
      >
        <View style={a.scrim}>
          <SafeAreaView style={a.modal}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 24, gap: 19 }}
            >
              {fact && (
                <>
                  <View style={s.between}>
                    <Tag color={C.yellow}>
                      {quiz ? "RECALL PRACTICE" : "MEET YOUR MEMORY"}
                    </Tag>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Close mnemonic"
                      onPress={() => setFact(null)}
                      style={a.close}
                    >
                      <Icon name="close" />
                    </Pressable>
                  </View>
                  <Text style={s.title}>{fact.word}</Text>
                  {!quiz ? (
                    <>
                      {personalImage ? (
                        <Image
                          source={{ uri: personalImage }}
                          style={{ height: 220, borderRadius: 18 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <FactImage fact={fact} style={p.profile.style} />
                      )}
                      <Text style={s.h3}>{fact.definition}</Text>
                      <Tag>{fact.technique}</Tag>
                      <Text style={[s.body, { color: C.ink }]}>
                        {personalStory || fact.story}
                      </Text>
                      <Text style={s.small}>
                        Close your eyes for a moment. Picture{" "}
                        {fact.cue.toLowerCase()}.
                      </Text>
                      <Button icon="arrow" onPress={() => setQuiz(true)}>
                        Try recalling it
                      </Button>
                      {pro && (
                        <Button
                          secondary
                          disabled={busy}
                          onPress={async () => {
                            setBusy(true);
                            try {
                              const result = await generatePersonalized(
                                fact.id,
                                p,
                              );
                              setPersonalStory(result.story);
                              setPersonalImage(result.imageUrl);
                            } catch (e) {
                              setNotice(message(e));
                              setFact(null);
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          Make this story personal
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={s.h3}>{fact.question}</Text>
                      {fact.choices.map((choice, i) => (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{
                            selected: selected === i,
                            disabled: answer !== null,
                          }}
                          key={choice}
                          disabled={answer !== null}
                          onPress={() => setSelected(i)}
                          style={[
                            a.answer,
                            selected === i && {
                              borderColor: C.green,
                              backgroundColor: C.sage,
                            },
                            answer !== null &&
                              i === fact.answer && {
                                borderColor: C.green,
                                backgroundColor: "#DCEBD9",
                              },
                            answer === i &&
                              i !== fact.answer && {
                                borderColor: C.red,
                                backgroundColor: "#F7E0D7",
                              },
                          ]}
                        >
                          <Text style={[s.body, { color: C.ink, flex: 1 }]}>
                            {choice}
                          </Text>
                          {answer !== null && i === fact.answer && (
                            <Icon name="check" size={20} />
                          )}
                        </Pressable>
                      ))}
                      {answer === null ? (
                        <Button
                          disabled={selected === null}
                          onPress={submitAnswer}
                        >
                          Check my answer
                        </Button>
                      ) : (
                        <>
                          <Card
                            style={{
                              backgroundColor:
                                answer === fact.answer ? C.sage : C.peach,
                            }}
                          >
                            <Text style={s.h3}>
                              {answer === fact.answer
                                ? "Correct."
                                : "Let’s review this one."}
                            </Text>
                            <Text style={[s.body, { color: C.ink }]}>
                              {fact.explanation}
                            </Text>
                            <Text style={s.small}>
                              {answer === fact.answer
                                ? "We’ll bring it back when it’s time."
                                : "This cue will return sooner for another try."}
                            </Text>
                          </Card>
                          <Button onPress={() => setFact(null)}>
                            Back to the scene
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
      <Modal
        visible={application}
        transparent
        animationType="slide"
        onRequestClose={() => setApplication(false)}
      >
        <View style={a.scrim}>
          <SafeAreaView style={a.modal}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 24, gap: 20 }}
            >
              <View style={s.between}>
                <Tag color={C.yellow}>APPLY YOUR MEMORY</Tag>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close application"
                  onPress={() => setApplication(false)}
                  style={a.close}
                >
                  <Icon name="close" />
                </Pressable>
              </View>
              <Text style={s.h2}>Use it in the real world.</Text>
              <Text style={[s.body, { color: C.ink }]}>
                {scene.application.question}
              </Text>
              <Field
                label="Your explanation"
                value={applicationText}
                onChangeText={setApplicationText}
                multiline
                placeholder="Put it in your own words…"
              />
              {!applicationFeedback ? (
                <Button
                  disabled={applicationText.trim().length < 20}
                  onPress={() => setApplicationFeedback(true)}
                >
                  Compare with an example
                </Button>
              ) : (
                <>
                  <Card style={{ backgroundColor: C.sage }}>
                    <Text style={s.label}>One possible explanation</Text>
                    <Text style={[s.body, { color: C.ink }]}>
                      {scene.application.sample}
                    </Text>
                    <Text style={s.small}>
                      {applicationHints(
                        applicationText,
                        scene.application.keywords,
                      ).every(Boolean)
                        ? "You included the key vocabulary. Check that your explanation connects the ideas correctly."
                        : "Check your explanation against the example. " +
                          scene.application.hint}
                    </Text>
                  </Card>
                  <Text style={s.body}>
                    This is a reflection, not an automatic grade. Does your
                    answer explain the reasoning?
                  </Text>
                  <Button
                    onPress={() => {
                      setP((v) => ({
                        ...v,
                        applications: { ...v.applications, [scene.id]: true },
                      }));
                      setApplication(false);
                      setNotice(
                        "Application reflection complete. Keep those ideas growing.",
                      );
                    }}
                  >
                    I’ve checked my explanation
                  </Button>
                  <Button
                    secondary
                    onPress={() => setApplicationFeedback(false)}
                  >
                    Revise my answer
                  </Button>
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
function Brand() {
  return (
    <View style={[s.row, { gap: 8 }]}>
      <View style={{ transform: [{ rotate: "12deg" }] }}>
        <Icon name="spark" size={33} />
      </View>
      <Text
        style={{
          fontFamily: serif,
          fontWeight: "700",
          fontSize: 31,
          letterSpacing: -1.5,
          color: C.ink,
        }}
      >
        quasar
      </Text>
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: C.ink,
          marginLeft: -5,
          marginTop: 12,
        }}
      />
    </View>
  );
}
function message(e: unknown) {
  return e instanceof Error
    ? e.message
    : typeof e === "object" && e && "message" in e
      ? String(e.message)
      : "Something went wrong. Please try again.";
}
const a = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  loading: {
    flex: 1,
    backgroundColor: C.paper,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  layout: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 228,
    padding: 24,
    borderRightWidth: 1,
    borderColor: C.line,
    gap: 22,
    backgroundColor: C.paper,
  },
  sideItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 13,
    borderRadius: 12,
    minHeight: 48,
  },
  topbar: {
    height: 76,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: C.line,
    backgroundColor: C.paper,
  },
  avatar: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: C.peach,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 38,
    paddingBottom: 60,
    gap: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.7,
    color: C.green,
  },
  hero: {
    backgroundColor: "#E4EACF",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D8DFC4",
  },
  sun: {
    backgroundColor: C.yellow,
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-10deg" }],
  },
  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 19,
    backgroundColor: C.white,
    paddingVertical: 18,
  },
  stat: { flex: 1, alignItems: "center", gap: 5, paddingHorizontal: 5 },
  statNumber: { fontFamily: serif, fontSize: 26, color: C.ink },
  grid: { gap: 18 },
  sceneCard: {
    flex: 1,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    overflow: "hidden",
  },
  comingRow: { flexDirection: "row", gap: 10 },
  coming: {
    flex: 1,
    padding: 13,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    gap: 8,
    backgroundColor: "#F0F0E7",
    opacity: 0.72,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    backgroundColor: C.white,
  },
  tipIcon: {
    width: 55,
    height: 65,
    borderRadius: 22,
    backgroundColor: C.peach,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-8deg" }],
  },
  piCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    padding: 22,
    borderRadius: 20,
    backgroundColor: "#F6E9C6",
  },
  piSymbol: { fontFamily: serif, fontSize: 57, color: C.ink },
  styleChoice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    backgroundColor: C.white,
    minHeight: 44,
  },
  lessonIcon: {
    height: 140,
    backgroundColor: C.sage,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeArt: {
    borderRadius: 25,
    backgroundColor: "#F1EFDF",
    overflow: "hidden",
  },
  welcomeStamp: {
    position: "absolute",
    right: 15,
    bottom: 14,
    backgroundColor: C.yellow,
    padding: 12,
    borderRadius: 12,
    gap: 4,
    transform: [{ rotate: "7deg" }],
    alignItems: "center",
  },
  bottom: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: C.line,
    backgroundColor: C.paper,
  },
  tab: { flex: 1, alignItems: "center", gap: 2 },
  tabIcon: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 15 },
  notice: {
    backgroundColor: "#F4E8C6",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  day: {
    width: 34,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  scrim: {
    flex: 1,
    backgroundColor: "#152B2466",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal: {
    width: "100%",
    maxWidth: 600,
    maxHeight: "93%",
    backgroundColor: C.paper,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },
  close: { padding: 10 },
  answer: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    padding: 17,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 55,
  },
});

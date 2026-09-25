import React, { useState } from "react";
import { Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button, C, Card, Field, Icon, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import { buildStudy, noteConceptId, quickQuiz, studyFor, type NoteDeck } from "../lib/noteQuiz";
import { dueIds, type Attempt, type Progress } from "../lib/progress";

type AiQuiz = (input: { title: string; text?: string; pdfBase64?: string }) => Promise<NoteDeck>;

const MAX_PDF = 5 * 1024 * 1024;

async function readAsBase64(uri: string) {
  const blob = await (await fetch(uri)).blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(blob);
  });
}

export function NotesQuiz({
  progress,
  onSave,
  onDelete,
  onAttempt,
  aiQuiz,
  onUpgrade,
}: {
  progress: Progress;
  onSave: (deck: NoteDeck) => void;
  onDelete: (id: string) => void;
  onAttempt: (a: Omit<Attempt, "at">) => void;
  aiQuiz?: AiQuiz;
  onUpgrade?: () => void;
}) {
  const decks = progress.notes ?? [];
  const [open, setOpen] = useState<{ deck: NoteDeck; dueOnly: boolean; study?: boolean } | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [pdf, setPdf] = useState<{ name: string; base64: string } | null>(null);
  const [busy, setBusy] = useState<"" | "file" | "ai">("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const due = new Set(dueIds(progress).filter((id) => id.startsWith("note-")));
  const dueIn = (d: NoteDeck) => d.questions.filter((q) => due.has(noteConceptId(d.id, q.id))).length;

  if (open?.study)
    return (
      <StudyRun
        key={open.deck.id}
        deck={open.deck}
        onQuiz={() => setOpen({ deck: open.deck, dueOnly: false })}
        onDone={() => setOpen(null)}
      />
    );
  if (open)
    return (
      <QuizRun
        key={open.deck.id + String(open.dueOnly)}
        deck={open.deck}
        only={open.dueOnly ? due : null}
        onAttempt={onAttempt}
        onDone={() => setOpen(null)}
      />
    );

  const pick = async () => {
    setError("");
    const res = await DocumentPicker.getDocumentAsync({
      type: ["text/plain", "text/markdown", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const f = res.assets[0];
    const name = f.name.replace(/\.[^.]+$/, "");
    setBusy("file");
    try {
      if (f.mimeType === "application/pdf" || /\.pdf$/i.test(f.name)) {
        if ((f.size ?? 0) > MAX_PDF) throw new Error("That PDF is over 5 MB. Try the key pages, or paste the text.");
        setPdf({ name: f.name, base64: await readAsBase64(f.uri) });
      } else {
        setText((await (await fetch(f.uri)).text()).slice(0, 40000));
        setPdf(null);
      }
      if (!title) setTitle(name);
    } catch (e) {
      setError(e instanceof Error && e.message.includes("5 MB") ? e.message : "That file couldn't be read. Paste the text instead.");
    } finally {
      setBusy("");
    }
  };

  const makeQuick = () => {
    const result = quickQuiz(title, text);
    if ("error" in result) return setError(result.error);
    onSave(result);
    setOpen({ deck: result, dueOnly: false, study: true });
  };

  const makeAi = () => {
    if (!aiQuiz) return;
    setBusy("ai");
    setError("");
    aiQuiz({ title: title || pdf?.name || "My notes", text: text || undefined, pdfBase64: pdf?.base64 })
      .then((made) => {
        // Pasted notes also get on-device study notes; a PDF studies from the AI's own questions.
        const deck = text.trim() ? { ...made, study: buildStudy(text) } : made;
        onSave(deck);
        setOpen({ deck, dueOnly: false, study: true });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "The AI quiz is unavailable right now. Try the quick quiz instead."))
      .finally(() => setBusy(""));
  };

  return (
    <View style={{ gap: 22 }}>
      <Reveal>
        <View style={{ gap: 9 }}>
          <Tag color={C.yellow}>NOTES → QUIZ</Tag>
          <Text accessibilityRole="header" style={s.title}>
            Read your notes. Then prove you know them.
          </Text>
          <Text style={s.body}>
            Paste your notes or choose a file. Quasar lays them out to study,
            with flashcards for the key terms, then quizzes you. Every question
            comes back for spaced review.
          </Text>
        </View>
      </Reveal>

      <Reveal delay={80}>
        <View style={[s.paper, { gap: 14 }]}>
          <Field label="Deck title" value={title} onChangeText={setTitle} placeholder="Cell biology · week 3" />
          <Field
            label="Your notes"
            value={text}
            onChangeText={(v) => setText(v.slice(0, 40000))}
            multiline
            placeholder={"Mitochondria: transfer energy from sugar into ATP\nRibosome: builds proteins from mRNA\n…or paste a few paragraphs"}
          />
          <Button small secondary icon="book" disabled={busy !== ""} onPress={pick}>
            {busy === "file" ? "Reading the file…" : "Choose a file (.txt, .md or .pdf)"}
          </Button>
          {pdf && (
            <View style={[s.row, { justifyContent: "space-between" }]}>
              <Text style={[s.small, { flex: 1 }]}>PDF attached: {pdf.name}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Remove the PDF" onPress={() => setPdf(null)}>
                <Icon name="close" size={16} />
              </Pressable>
            </View>
          )}
          <Text style={s.small}>{text.length.toLocaleString()} / 40,000 characters</Text>
          <Button icon="arrow" disabled={busy !== "" || text.trim().length < 40} onPress={makeQuick}>
            Study these notes
          </Button>
          <Text style={s.small}>
            Built on your device, so your notes aren't uploaded. It reads
            headings, bullet points, numbered steps, “Term: definition” lines
            and sentences like “Glycolysis takes place in the cytoplasm.”
          </Text>
          {aiQuiz ? (
            <>
              <Button
                secondary
                icon="spark"
                disabled={busy !== "" || (!pdf && text.trim().length < 80)}
                onPress={makeAi}
              >
                {busy === "ai" ? "Writing your quiz…" : "Study with an AI quiz"}
              </Button>
              <Text style={s.small}>
                Sends these notes to the AI to write deeper questions. Each one
                quotes the line from your notes it's based on.
              </Text>
            </>
          ) : onUpgrade ? (
            <Pressable accessibilityRole="button" onPress={onUpgrade}>
              <Text style={s.link}>
                Want deeper questions, or a quiz from a PDF? AI quizzes come with Quasar Plus →
              </Text>
            </Pressable>
          ) : null}
          {error ? (
            <Text accessibilityRole="alert" style={[s.small, { color: C.red }]}>
              {error}
            </Text>
          ) : null}
        </View>
      </Reveal>

      {decks.length > 0 && (
        <View style={{ gap: 10 }}>
          <Text style={s.label}>YOUR DECKS</Text>
          {[...decks].reverse().map((d, i) => {
            const n = dueIn(d);
            return (
              <Reveal key={d.id} delay={60 + i * 50}>
                <Card style={{ gap: 10 }}>
                  <View style={s.between}>
                    <Text style={[s.h3, { flex: 1 }]}>{d.title}</Text>
                    <Tag color={d.origin === "ai" ? "#E9DEF0" : C.sage}>{d.origin === "ai" ? "AI quiz" : "Quick quiz"}</Tag>
                  </View>
                  <Text style={s.small}>
                    {d.questions.length} questions{n ? ` · ${n} due for review` : ""}
                  </Text>
                  <View style={[s.row, { flexWrap: "wrap" }]}>
                    <View style={{ flex: 1, minWidth: 110 }}>
                      <Button small secondary icon="book" onPress={() => setOpen({ deck: d, dueOnly: false, study: true })}>
                        Study
                      </Button>
                    </View>
                    <View style={{ flex: 1, minWidth: 110 }}>
                      <Button small onPress={() => setOpen({ deck: d, dueOnly: n > 0 })}>
                        {n ? `Review ${n} due` : "Quiz me"}
                      </Button>
                    </View>
                    <View style={{ flex: 1, minWidth: 110 }}>
                      {confirmDelete === d.id ? (
                        <Button
                          small
                          secondary
                          onPress={() => {
                            onDelete(d.id);
                            setConfirmDelete(null);
                          }}
                        >
                          Yes, delete this deck
                        </Button>
                      ) : (
                        <Button small secondary onPress={() => setConfirmDelete(d.id)}>
                          Delete
                        </Button>
                      )}
                    </View>
                  </View>
                </Card>
              </Reveal>
            );
          })}
        </View>
      )}
    </View>
  );
}

function QuizRun({
  deck,
  only,
  onAttempt,
  onDone,
}: {
  deck: NoteDeck;
  only: Set<string> | null;
  onAttempt: (a: Omit<Attempt, "at">) => void;
  onDone: () => void;
}) {
  const [queue] = useState(() =>
    deck.questions.filter((q) => !only || only.has(noteConceptId(deck.id, q.id))),
  );
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = queue[index];

  if (!q)
    return (
      <Reveal>
        <View style={{ gap: 18 }}>
          <Tag color={C.yellow}>{deck.title.toUpperCase()}</Tag>
          <Card style={{ backgroundColor: C.sage, alignItems: "flex-start" }}>
            <Icon name="check" size={30} color={C.green} />
            <Text style={s.h2}>
              {score} of {queue.length} right.
            </Text>
            <Text style={s.body}>
              Every question is now scheduled. The ones you missed come back
              sooner.
            </Text>
            <Button onPress={onDone}>Back to my notes</Button>
          </Card>
        </View>
      </Reveal>
    );

  return (
    <View style={{ gap: 18 }}>
      <View style={s.between}>
        <Tag color={C.yellow}>
          {index + 1} / {queue.length}
        </Tag>
        <Pressable accessibilityRole="button" onPress={onDone}>
          <Text style={s.link}>End quiz</Text>
        </Pressable>
      </View>
      <Text style={s.label}>{deck.title.toUpperCase()}</Text>
      <Reveal key={q.id}>
        <Card style={{ gap: 12 }}>
          <Text style={s.h3}>{q.prompt}</Text>
          {q.choices.map((c, i) => (
            <PressableScale
              key={c + i}
              accessibilityRole="button"
              accessibilityState={{ disabled: choice !== null }}
              disabled={choice !== null}
              onPress={() => {
                setChoice(i);
                const correct = i === q.answer;
                if (correct) setScore((n) => n + 1);
                onAttempt({
                  conceptId: noteConceptId(deck.id, q.id),
                  mode: "recall",
                  correct,
                  hinted: false,
                  chose: correct ? undefined : c,
                  truth: q.choices[q.answer],
                });
              }}
              style={[
                s.input,
                { justifyContent: "center" },
                choice !== null && i === q.answer && { backgroundColor: C.sage, borderColor: C.green },
                choice === i && i !== q.answer && { backgroundColor: "#FBEFE3", borderColor: C.red },
              ]}
            >
              <Text style={[s.body, { color: C.ink }]}>{c}</Text>
            </PressableScale>
          ))}
          {choice !== null && (
            <View style={{ gap: 8 }}>
              <Text accessibilityLiveRegion="polite" style={s.h3}>
                {choice === q.answer ? "Right." : "Not quite."}
              </Text>
              {q.explanation ? <Text style={s.body}>{q.explanation}</Text> : null}
              {q.source ? (
                <View style={{ borderLeftWidth: 3, borderLeftColor: C.yellow, paddingLeft: 10 }}>
                  <Text style={s.small}>From your notes: “{q.source}”</Text>
                </View>
              ) : null}
              <Button
                icon="arrow"
                onPress={() => {
                  setChoice(null);
                  setIndex(index + 1);
                }}
              >
                {index === queue.length - 1 ? "See my score" : "Next question"}
              </Button>
            </View>
          )}
        </Card>
      </Reveal>
    </View>
  );
}

const escapeTerm = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Highlights key terms inside a point so the eye lands on what the quiz will ask about.
function Marked({ text, terms }: { text: string; terms: string[] }) {
  const list = terms.filter((t) => t.length >= 3).sort((a, b) => b.length - a.length);
  if (!list.length) return <Text style={[s.body, { color: C.ink }]}>{text}</Text>;
  const re = new RegExp(`(${list.map(escapeTerm).join("|")})`, "gi");
  return (
    <Text style={[s.body, { color: C.ink }]}>
      {text.split(re).map((part, i) =>
        i % 2 ? (
          <Text key={i} style={{ fontWeight: "700", backgroundColor: "#F6E7AE" }}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

function StudyRun({ deck, onQuiz, onDone }: { deck: NoteDeck; onQuiz: () => void; onDone: () => void }) {
  const study = studyFor(deck);
  const [step, setStep] = useState<"read" | "cards">(study.sections.length ? "read" : "cards");
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [unsure, setUnsure] = useState<number[]>([]);
  const c = study.cards[card];
  const quizButton = (
    <Button icon="arrow" onPress={onQuiz}>
      {`I'm ready. Quiz me (${deck.questions.length})`}
    </Button>
  );

  return (
    <View style={{ gap: 18 }}>
      <View style={s.between}>
        <Tag color={C.yellow}>{step === "read" ? "1 · READ" : "2 · FLASHCARDS"}</Tag>
        <Pressable accessibilityRole="button" onPress={onDone}>
          <Text style={s.link}>Back to my notes</Text>
        </Pressable>
      </View>
      <Text accessibilityRole="header" style={s.title}>
        {deck.title}
      </Text>

      {step === "read" ? (
        <>
          <Text style={s.body}>
            Read it through once, slowly. The highlighted words are the ones
            you'll be asked about.
          </Text>
          {study.sections.map((sec, i) => (
            <Reveal key={sec.heading + i} delay={Math.min(i, 6) * 60}>
              <View style={[s.paper, { gap: 10 }]}>
                <Text style={s.h3}>{sec.heading}</Text>
                {sec.points.map((pt, j) => (
                  <View key={j} style={[s.row, { alignItems: "flex-start", gap: 10 }]}>
                    <Text style={[s.body, { color: C.green }]}>•</Text>
                    <View style={{ flex: 1 }}>
                      <Marked text={pt} terms={study.terms} />
                    </View>
                  </View>
                ))}
              </View>
            </Reveal>
          ))}
          {study.cards.length ? (
            <Button icon="cards" onPress={() => setStep("cards")}>
              {`Next: ${study.cards.length} flashcards`}
            </Button>
          ) : (
            quizButton
          )}
        </>
      ) : c ? (
        <>
          <Text style={s.body}>
            Say the answer out loud before you turn the card. Anything you're
            unsure of is listed again at the end.
          </Text>
          <Text style={s.label}>
            CARD {card + 1} / {study.cards.length}
          </Text>
          <Reveal key={card + String(flipped)}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={flipped ? "Answer: " + c.back : "Card: " + c.front + ". Tap to turn it over."}
              onPress={() => setFlipped(!flipped)}
              style={[
                s.card,
                {
                  minHeight: 190,
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: flipped ? C.sage : "#FFFDF6",
                  borderColor: C.ink,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text style={s.label}>{flipped ? "ANSWER" : "WHAT DO YOU REMEMBER?"}</Text>
              <Text style={flipped ? s.body : s.h2}>{flipped ? c.back : c.front}</Text>
              {!flipped && <Text style={s.small}>Tap to turn over</Text>}
            </PressableScale>
          </Reveal>
          {flipped && (
            <View style={[s.row, { flexWrap: "wrap" }]}>
              {(
                [
                  ["Not sure yet", true],
                  ["I knew it", false],
                ] as const
              ).map(([label, again]) => (
                <View key={label} style={{ flex: 1, minWidth: 130 }}>
                  <Button
                    small
                    secondary={again}
                    onPress={() => {
                      if (again && !unsure.includes(card)) setUnsure([...unsure, card]);
                      setFlipped(false);
                      setCard(card + 1);
                    }}
                  >
                    {label}
                  </Button>
                </View>
              ))}
            </View>
          )}
          {study.sections.length > 0 && (
            <Pressable accessibilityRole="button" onPress={() => setStep("read")}>
              <Text style={s.link}>Read the notes again</Text>
            </Pressable>
          )}
        </>
      ) : (
        <Reveal>
          <Card style={{ backgroundColor: C.sage, gap: 12 }}>
            <Icon name="check" size={28} color={C.green} />
            <Text style={s.h2}>
              {unsure.length ? `${unsure.length} to look at once more.` : "You've been through every card."}
            </Text>
            {unsure.map((i) => (
              <View key={i} style={{ borderLeftWidth: 3, borderLeftColor: C.yellow, paddingLeft: 10, gap: 2 }}>
                <Text style={s.h3}>{study.cards[i].front}</Text>
                <Text style={s.body}>{study.cards[i].back}</Text>
              </View>
            ))}
            {quizButton}
            <Button
              small
              secondary
              onPress={() => {
                setCard(0);
                setUnsure([]);
              }}
            >
              Go through the cards again
            </Button>
          </Card>
        </Reveal>
      )}
      {step === "read" || c ? (
        <Pressable accessibilityRole="button" onPress={onQuiz}>
          <Text style={s.link}>Skip to the quiz →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

import React, { useState } from "react";
import { Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button, C, Card, Field, Icon, s, Tag, Text } from "../components/ui";
import { PressableScale, Reveal } from "../components/Reveal";
import { noteConceptId, quickQuiz, type NoteDeck } from "../lib/noteQuiz";
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
  const [open, setOpen] = useState<{ deck: NoteDeck; dueOnly: boolean } | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [pdf, setPdf] = useState<{ name: string; base64: string } | null>(null);
  const [busy, setBusy] = useState<"" | "file" | "ai">("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const due = new Set(dueIds(progress).filter((id) => id.startsWith("note-")));
  const dueIn = (d: NoteDeck) => d.questions.filter((q) => due.has(noteConceptId(d.id, q.id))).length;

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
    setOpen({ deck: result, dueOnly: false });
  };

  const makeAi = () => {
    if (!aiQuiz) return;
    setBusy("ai");
    setError("");
    aiQuiz({ title: title || pdf?.name || "My notes", text: text || undefined, pdfBase64: pdf?.base64 })
      .then((deck) => {
        onSave(deck);
        setOpen({ deck, dueOnly: false });
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
            Turn your notes into questions.
          </Text>
          <Text style={s.body}>
            Paste your notes or choose a file. Quasar builds a quiz, and every
            question comes back for spaced review.
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
            Make a quick quiz
          </Button>
          <Text style={s.small}>
            The quick quiz is built on your device from “Term: definition” lines
            and key sentences. Your notes aren't uploaded.
          </Text>
          {aiQuiz ? (
            <>
              <Button
                secondary
                icon="spark"
                disabled={busy !== "" || (!pdf && text.trim().length < 80)}
                onPress={makeAi}
              >
                {busy === "ai" ? "Writing your quiz…" : "Make an AI quiz"}
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
                    <View style={{ flex: 1, minWidth: 130 }}>
                      <Button small onPress={() => setOpen({ deck: d, dueOnly: n > 0 })}>
                        {n ? `Review ${n} due` : "Practice"}
                      </Button>
                    </View>
                    <View style={{ flex: 1, minWidth: 130 }}>
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

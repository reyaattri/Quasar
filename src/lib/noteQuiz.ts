export type NoteQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation?: string;
  source?: string;
};

export type NoteDeck = {
  id: string;
  title: string;
  createdAt: string;
  origin: "device" | "ai";
  questions: NoteQuestion[];
};

export const noteConceptId = (deckId: string, questionId: string) =>
  `note-${deckId}-${questionId}`;

function seeded(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const clip = (t: string, n = 160) => (t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t);

const STOP = new Set(
  "about above after again against because before being below between cannot could during other their there these those through under until which while would should within without where whose".split(" "),
);

export function extractPairs(text: string) {
  const pairs: { term: string; definition: string; line: string }[] = [];
  const seen = new Set<string>();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim().replace(/^([-*•]|\d+[.)])\s+/, "");
    if (!line || /https?:\/\//i.test(line)) continue;
    const m = /^(.{2,60}?)\s*(?::|—|–|\s-\s|=)\s*(.{8,})$/.exec(line);
    if (!m) continue;
    const term = m[1].trim();
    const definition = m[2].trim();
    if (term.split(/\s+/).length > 6 || seen.has(term.toLowerCase())) continue;
    seen.add(term.toLowerCase());
    pairs.push({ term, definition, line: raw.trim() });
  }
  return pairs;
}

function keyword(sentence: string) {
  const words = sentence.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]{5,}/g) ?? [];
  return words
    .filter((w) => !STOP.has(w.toLowerCase()))
    .sort((a, b) => b.length - a.length)[0];
}

export function quickQuiz(
  title: string,
  text: string,
  now = new Date(),
): NoteDeck | { error: string } {
  const rand = seeded(title + "\n" + text);
  const questions: NoteQuestion[] = [];
  const pairs = extractPairs(text);

  if (pairs.length >= 2) {
    const terms = pairs.map((p) => p.term);
    const defs = pairs.map((p) => p.definition);
    shuffle(pairs, rand)
      .slice(0, 8)
      .forEach((p, i) => {
        const reverse = i % 2 === 1 && pairs.length >= 3;
        const pool = reverse ? defs : terms;
        const right = reverse ? p.definition : p.term;
        const wrong = shuffle(pool.filter((x) => x !== right), rand).slice(0, 3);
        const choices = shuffle([right, ...wrong], rand).map((c) => clip(c));
        questions.push({
          id: "p" + i,
          prompt: reverse
            ? `What does “${p.term}” mean?`
            : `Which term matches: “${clip(p.definition, 200)}”?`,
          choices,
          answer: choices.indexOf(clip(right)),
          source: p.line,
        });
      });
  }

  if (questions.length < 8) {
    const sentences = (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) ?? [])
      .map((x) => x.trim())
      .filter((x) => x.length >= 40 && x.length <= 240 && !pairs.some((p) => x.includes(p.definition)));
    const keyed = sentences
      .map((sentence) => ({ sentence, word: keyword(sentence) }))
      .filter((k): k is { sentence: string; word: string } => !!k.word);
    const words = [...new Set(keyed.map((k) => k.word))];
    if (words.length >= 4)
      shuffle(keyed, rand)
        .slice(0, 8 - questions.length)
        .forEach((k, i) => {
          const wrong = shuffle(words.filter((w) => w.toLowerCase() !== k.word.toLowerCase()), rand).slice(0, 3);
          const choices = shuffle([k.word, ...wrong], rand);
          questions.push({
            id: "c" + i,
            prompt: `Fill the gap: “${k.sentence.replace(k.word, "_____")}”`,
            choices,
            answer: choices.indexOf(k.word),
            source: k.sentence,
          });
        });
  }

  if (questions.length < 3)
    return {
      error:
        "There isn't enough here to build a quiz yet. Try lines like “Mitochondria: transfer energy into ATP”, or a few full sentences.",
    };
  return {
    id: now.getTime().toString(36),
    title: title.trim() || "My notes",
    createdAt: now.toISOString(),
    origin: "device",
    questions,
  };
}

export function isValidDeck(d: unknown): d is NoteDeck {
  const deck = d as NoteDeck;
  return (
    !!deck &&
    typeof deck.title === "string" &&
    Array.isArray(deck.questions) &&
    deck.questions.length > 0 &&
    deck.questions.every(
      (q) =>
        typeof q.prompt === "string" &&
        Array.isArray(q.choices) &&
        q.choices.length >= 2 &&
        Number.isInteger(q.answer) &&
        q.answer >= 0 &&
        q.answer < q.choices.length,
    )
  );
}

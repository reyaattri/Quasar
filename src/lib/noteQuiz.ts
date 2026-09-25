export type QuestionKind = "define" | "term" | "fact" | "group" | "order" | "number" | "cloze";

export type NoteQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation?: string;
  source?: string;
  kind?: QuestionKind;
};

export type StudyCard = { front: string; back: string };
export type StudySection = { heading: string; points: string[] };
export type NoteStudy = { sections: StudySection[]; cards: StudyCard[]; terms: string[] };

export type NoteDeck = {
  id: string;
  title: string;
  createdAt: string;
  origin: "device" | "ai";
  questions: NoteQuestion[];
  study?: NoteStudy;
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
const low = (t: string) => t.toLowerCase();
const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const has = (text: string, phrase: string) =>
  new RegExp(`(^|[^A-Za-z0-9])${escape(phrase)}(?=$|[^A-Za-z0-9])`, "i").test(text);

const STOP = new Set(
  "about above after again against because before being below between cannot could during other their there these those through under until which while would should within without where whose always usually often important different another something example called another".split(" "),
);
const PRONOUN = /^(it|this|that|these|those|they|there|he|she|we|you|i|one|each|some|most|many|all|both|here|what|which|who|when|why|how)\b/i;
const PASSIVE = /^(located|found|made|used|stored|produced|released|formed|converted|split|broken|carried|needed|required|involved|called|known|defined|important|necessary)\b/i;
const WEAK_START = /^(that|this|it|them|because|when|why|how|very|also|not|often|usually|just|only|important|necessary|possible)\b/i;

// ——— Reading the notes: headings, bullets, numbered lists ———

type Line = { text: string; raw: string; bullet: boolean; numbered: boolean };
type Block = { heading: string; lines: Line[] };

const BULLET = /^(?:[-*•▪◦‣]|\d{1,2}[.)]|[a-h][.)]|\([a-z0-9]\))\s+/;
const NUMBERED = /^\d{1,2}[.)]\s+/;
const RULE = /^(=+|-{3,}|\*{3,}|_{3,})$/;
const PAIR = /^(.{2,60}?)\s*(?::|—|–|\s-\s|=)\s*(.{8,})$/;
const tidy = (t: string) =>
  t.replace(/\*\*|__|`/g, "").replace(/^>\s*/, "").replace(/\s+/g, " ").trim();
const url = (t: string) => /https?:\/\/|www\./i.test(t);

const SMALL = new Set("a an and at by for in of on or the to with key".split(" "));
function sentenceCase(t: string) {
  const out = t
    .split(" ")
    .map((w) => (w.length <= 4 && !SMALL.has(w.toLowerCase()) ? w : w.toLowerCase()))
    .join(" ");
  return out.charAt(0).toUpperCase() + out.slice(1);
}

function headingOf(line: string, next?: string): string | null {
  let m = /^#{1,6}\s+(.+?)\s*#*$/.exec(line);
  if (m) return tidy(m[1]).replace(/:$/, "");
  m = /^(?:\*\*|__)(.{2,80}?)(?:\*\*|__):?$/.exec(line);
  if (m) return tidy(m[1]).replace(/:$/, "");
  if (next && /^(=+|-{3,})$/.test(next.trim()) && line.length <= 80) return tidy(line);
  if (BULLET.test(line)) return null;
  const plain = tidy(line);
  const words = plain.split(" ").length;
  if (plain.endsWith(":") && words <= 8 && !plain.slice(0, -1).includes(":"))
    return plain.slice(0, -1).trim();
  if (
    plain.length >= 4 &&
    plain.length <= 60 &&
    /[A-Z]{3}/.test(plain) &&
    plain === plain.toUpperCase() &&
    !/[.!?]$/.test(plain)
  )
    return sentenceCase(plain);
  if (
    next &&
    BULLET.test(next.trim()) &&
    plain.length <= 50 &&
    words <= 7 &&
    !/[.!?;,]$/.test(plain) &&
    !PAIR.test(plain)
  )
    return plain;
  return null;
}

function parseNotes(text: string): Block[] {
  const raws = text.split(/\r?\n/);
  const blocks: Block[] = [{ heading: "", lines: [] }];
  for (let i = 0; i < raws.length; i++) {
    const line = raws[i].trim();
    if (!line || RULE.test(line)) continue;
    let j = i + 1;
    while (j < raws.length && !raws[j].trim()) j++;
    const heading = headingOf(line, raws[j]);
    if (heading) {
      blocks.push({ heading, lines: [] });
      continue;
    }
    blocks[blocks.length - 1].lines.push({
      raw: line,
      text: tidy(line.replace(BULLET, "")),
      bullet: BULLET.test(line),
      numbered: NUMBERED.test(line),
    });
  }
  return blocks.filter((b) => b.lines.length > 0);
}

// ——— Facts found in the notes ———

type Pair = { term: string; definition: string; line: string; heading: string };
type Fact = { subject: string; relation: string; object: string; rest: string; group: string; line: string };
type List = { heading: string; items: string[]; lines: string[] };

const DEF =
  /^(?:the |an? )?([A-Za-z][\w'()/ -]{1,48}?)\s+(is called|are called|is known as|are known as|is defined as|are defined as|refers to|refer to|means|is|are)\s+(.{8,}?)[.!]?$/i;
const RELATIONS: Record<string, string[]> = {
  place: ["takes place in", "take place in", "occurs in", "occur in", "happens in", "is found in", "are found in", "is located in", "are located in"],
  make: ["produces", "produce", "releases", "release", "converts", "convert", "breaks down", "break down", "makes", "make", "forms", "form"],
  parts: ["contains", "contain", "consists of", "consist of", "is made of", "are made of", "carries", "carry", "stores", "store"],
  needs: ["requires", "require", "uses", "use", "needs", "need", "depends on", "depend on"],
  does: ["controls", "control", "regulates", "regulate", "transports", "transport", "protects", "protect"],
};
const REL = new RegExp(
  `^(?:the |an? )?([A-Za-z][\\w'()/ -]{1,40}?)\\s+(${Object.values(RELATIONS).flat().sort((a, b) => b.length - a.length).map(escape).join("|")})\\s+(.+?)[.!]?$`,
  "i",
);
const groupOf = (relation: string) =>
  Object.entries(RELATIONS).find(([, list]) => list.includes(low(relation)))?.[0] ?? "does";

function definitionIn(sentence: string): { term: string; definition: string } | null {
  const m = DEF.exec(sentence);
  if (!m) return null;
  const [, subject, rel, rest] = m;
  if (PRONOUN.test(subject) || WEAK_START.test(rest)) return null;
  if (/called|known as/i.test(rel)) {
    const term = rest.replace(/[.!]$/, "").trim();
    if (term.split(" ").length > 5 || subject.split(" ").length < 2 || subject.split(" ").length > 14) return null;
    return { term: cap(term), definition: subject.trim() };
  }
  if (subject.split(" ").length > 5 || PASSIVE.test(rest) || rest.split(" ").length < 3) return null;
  return { term: subject.trim(), definition: rest.trim() };
}

function factIn(sentence: string): Omit<Fact, "line"> | null {
  const m = REL.exec(sentence);
  if (!m) return null;
  const [, subject, relation, tail] = m;
  if (PRONOUN.test(subject) || subject.split(" ").length > 4) return null;
  const cut = /,|;|\s(?:and|which|that|where|while|because|so|to form|to make|by|into|from|during|when)\s/i.exec(tail);
  const object = (cut ? tail.slice(0, cut.index) : tail).trim();
  const rest = cut ? tail.slice(cut.index) : "";
  if (!object || WEAK_START.test(object) || object.split(" ").length > 6 || object.length < 3) return null;
  return { subject: subject.trim(), relation, object, rest, group: groupOf(relation) };
}

const GENERIC = /\b(in order|terms?|notes?|summary|overview|introduction|key|review|chapter|unit|week|lecture|definitions?|vocabulary|examples?|questions?|misc|other)\b/i;

function analyse(text: string) {
  const blocks = parseNotes(text);
  const pairs: Pair[] = [];
  const facts: Fact[] = [];
  const statements: { sentence: string; heading: string }[] = [];
  const lists: List[] = [];
  const seen = new Set<string>();
  const addPair = (p: Pair) => {
    if (seen.has(low(p.term)) || PRONOUN.test(p.term)) return false;
    seen.add(low(p.term));
    pairs.push(p);
    return true;
  };

  for (const b of blocks) {
    for (const line of b.lines) {
      if (url(line.text)) continue;
      const m = PAIR.exec(line.text);
      if (m && m[1].trim().split(/\s+/).length <= 6 && !/[.!?]$/.test(m[1])) {
        if (addPair({ term: m[1].trim(), definition: m[2].trim(), line: line.raw, heading: b.heading })) continue;
      }
      for (const s of line.text.match(/[^.!?]+(?:[.!?]+|$)/g) ?? []) {
        const sentence = s.trim();
        const words = sentence.split(" ").length;
        if (sentence.length < 20 || words < 4 || sentence.length > 260) continue;
        const def = definitionIn(sentence);
        if (def && addPair({ ...def, line: sentence, heading: b.heading })) continue;
        const fact = factIn(sentence);
        if (fact) facts.push({ ...fact, line: sentence });
        statements.push({ sentence, heading: b.heading });
      }
    }
    // A run of three or more numbered lines, or bullets under a "steps"-style heading, is an ordered list.
    const ordered = /\b(steps?|stages?|phases?|order|sequence|timeline|procedure|how to)\b/i.test(b.heading);
    let run: Line[] = [];
    const flush = () => {
      if (run.length >= 3)
        lists.push({
          heading: b.heading,
          items: run.map((l) => clip(pairs.find((p) => p.line === l.raw)?.term ?? l.text, 70)),
          lines: run.map((l) => l.raw),
        });
      run = [];
    };
    for (const line of b.lines) {
      if (line.numbered || (ordered && line.bullet && line.text.length <= 80)) run.push(line);
      else flush();
    }
    flush();
  }

  const keyTerms = [
    ...new Set(
      [
        ...pairs.map((p) => p.term),
        ...facts.map((f) => f.subject),
        ...blocks.map((b) => b.heading).filter((h) => !GENERIC.test(h)),
      ]
        .filter((t) => t && t.split(" ").length <= 3 && t.length <= 40),
    ),
  ];
  return { blocks, pairs, facts, statements, lists, keyTerms };
}

export function extractPairs(text: string) {
  return analyse(text).pairs.map(({ term, definition, line }) => ({ term, definition, line }));
}

// ——— Choosing what to blank, and believable wrong answers ———

const TECH =
  /^(?:[A-Z]{2,}[a-z0-9+-]*|[A-Za-z]+-[A-Za-z0-9-]+|[A-Za-z]*(?:ase|ose|osis|esis|ysis|cyte|plast|some|somes|gen|phyll|lipid|protein|tion|tions|sion|ism|ide|ides|ine|ines|ium|ia|ae)s?)$/;

function techWords(sentence: string) {
  return (sentence.match(/[A-Za-z][A-Za-z0-9+-]{3,}/g) ?? []).filter(
    (w) => w.length >= 4 && TECH.test(w) && !STOP.has(low(w)),
  );
}

function longWords(sentence: string) {
  return (sentence.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]{5,}/g) ?? []).filter((w) => !STOP.has(low(w)));
}

function pickWrong(answer: string, pools: string[][], rand: () => number, avoid = "", n = 3) {
  const out: string[] = [];
  const taken = new Set([low(answer)]);
  for (const pool of pools)
    for (const c of shuffle(pool, rand)) {
      if (out.length >= n) return out;
      const k = low(c);
      if (taken.has(k) || (avoid && has(avoid, c)) || low(answer).includes(k) || k.includes(low(answer))) continue;
      taken.add(k);
      out.push(c);
    }
  return out;
}

function numberWrong(n: string, rand: () => number) {
  const v = Number(n);
  const year = /^\d{4}$/.test(n) && v > 1000 && v < 2100;
  const options = year
    ? [v - 10, v + 7, v - 3, v + 20]
    : Number.isInteger(v)
      ? [v + 1, v - 1, v * 2, v + 2, Math.round(v / 2), v + 10, v * 3]
      : [v * 2, v / 2, v + 1, v - 0.5].map((x) => Math.round(x * 100) / 100);
  return shuffle(
    [...new Set(options.filter((x) => x > 0 && x !== v).map(String))],
    rand,
  ).slice(0, 5);
}

const similar = (a: string, b: string) => a.length <= b.length * 2 && b.length <= a.length * 2;
const cap = (t: string) => (/^[a-z][a-z]/.test(t) ? t.charAt(0).toUpperCase() + t.slice(1) : t);
const lowerFirst = (t: string) => (/^[A-Z]{2}|^[A-Z][a-z]*[A-Z]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));

function blank(sentence: string, phrase: string, every = true) {
  return sentence.replace(
    new RegExp(`(^|[^A-Za-z0-9])${escape(phrase)}(?=$|[^A-Za-z0-9])`, every ? "gi" : "i"),
    "$1_____",
  );
}

function mcq(
  kind: QuestionKind,
  prompt: string,
  right: string,
  wrong: string[],
  rand: () => number,
  source: string,
  explanation?: string,
): Omit<NoteQuestion, "id"> | null {
  const choices = shuffle([right, ...wrong], rand).map((c) => clip(c));
  if (choices.length < 3 || new Set(choices.map(low)).size !== choices.length) return null;
  return { kind, prompt, choices, answer: choices.indexOf(clip(right)), source, explanation };
}

// ——— The quiz ———

export function quickQuiz(
  title: string,
  text: string,
  now = new Date(),
): NoteDeck | { error: string } {
  const rand = seeded(title + "\n" + text);
  const { pairs, facts, statements, lists, keyTerms, blocks } = analyse(text);
  const tech = [...new Set(statements.flatMap((s) => techWords(s.sentence)))];
  const long = [...new Set(statements.flatMap((s) => longWords(s.sentence)))];

  type Q = Omit<NoteQuestion, "id">;
  const byKind: Record<string, Q[]> = { pair: [], fact: [], group: [], order: [], number: [], cloze: [] };

  // Term ⇄ meaning, preferring wrong answers from the same section, which are harder to rule out.
  shuffle(pairs, rand).forEach((p, i) => {
    const reverse = i % 2 === 1 && pairs.length >= 3;
    const near = pairs.filter((x) => x !== p && x.heading === p.heading);
    const far = pairs.filter((x) => x !== p && x.heading !== p.heading);
    const q = reverse
      ? mcq("define", `What does “${p.term}” mean?`, p.definition, pickWrong(p.definition, [near.map((x) => x.definition), far.map((x) => x.definition)], rand), rand, p.line)
      : mcq("term", `Which term matches: “${clip(p.definition, 200)}”?`, p.term, pickWrong(p.term, [near.map((x) => x.term), far.map((x) => x.term), keyTerms], rand), rand, p.line);
    if (q) byKind.pair.push(q);
  });

  // “Glycolysis takes place in _____”, with wrong answers of the same kind (places for places).
  for (const f of facts) {
    const same = facts.filter((x) => x !== f && x.group === f.group).map((x) => x.object);
    const other = facts.filter((x) => x !== f).map((x) => x.object);
    const q = mcq(
      "fact",
      `Complete from your notes: “${cap(f.subject)} ${f.relation} _____${f.rest}”`,
      f.object,
      pickWrong(f.object, [same, other, keyTerms], rand, f.line),
      rand,
      f.line,
    );
    if (q) byKind.fact.push(q);
  }

  // Which section does an idea belong to?
  const sections = blocks.filter((b) => b.heading && b.lines.length >= 2);
  const label = (l: Line) => clip(pairs.find((p) => p.line === l.raw)?.term ?? l.text, 90);
  if (sections.length >= 2)
    for (const b of shuffle(sections, rand)) {
      // The answer must not simply repeat the heading.
      const pickable = b.lines.filter((l) => l.text.length <= 140 && !url(l.text) && !has(label(l), b.heading));
      if (!pickable.length) continue;
      const line = pickable[Math.floor(rand() * pickable.length)];
      const right = label(line);
      const others = sections.filter((x) => x !== b).flatMap((x) => x.lines.map(label));
      const q = mcq(
        "group",
        `Which of these is in your “${b.heading}” notes?`,
        right,
        pickWrong(right, [others.filter((o) => similar(o, right)), others], rand, b.heading),
        rand,
        line.raw,
        `It sits under “${b.heading}”.`,
      );
      if (q) byKind.group.push(q);
    }

  // Ordered lists: what comes first, and what comes next.
  for (const l of lists) {
    const name = l.heading || "your list";
    const order = `The order in your notes: ${l.items.join(" → ")}.`;
    const first = mcq("order", `In “${name}”, what comes first?`, l.items[0], pickWrong(l.items[0], [l.items.slice(1)], rand), rand, l.lines[0], order);
    if (first) byKind.order.push(first);
    const k = 1 + Math.floor(rand() * (l.items.length - 2));
    const next = mcq(
      "order",
      `In “${name}”, what comes right after “${l.items[k]}”?`,
      l.items[k + 1],
      pickWrong(l.items[k + 1], [l.items.filter((_, j) => j !== k && j !== k + 1), keyTerms], rand),
      rand,
      l.lines[k + 1],
      order,
    );
    if (next) byKind.order.push(next);
  }

  // Sentences: blank a number, a key term, a technical word, or failing that the longest word.
  for (const { sentence, heading } of statements) {
    // “It does not need oxygen” means little without its section, so say which section.
    const ask = (verb: string) =>
      PRONOUN.test(sentence) && heading ? `From “${heading}”, ${verb.toLowerCase()}` : verb;
    const num = /(?:^|[\s(~≈])(\d{1,4}(?:\.\d+)?)(?=[\s%),.]|$)/.exec(sentence);
    if (num) {
      const shown = new Set(sentence.match(/\d+(?:\.\d+)?/g) ?? []);
      const q = mcq("number", `${ask("Fill the number")}: “${blank(sentence, num[1], false)}”`, num[1], numberWrong(num[1], rand).filter((n) => !shown.has(n)).slice(0, 3), rand, sentence);
      if (q) byKind.number.push(q);
    }
    const key = keyTerms.filter((t) => has(sentence, t)).sort((a, b) => b.length - a.length)[0];
    const techHere = techWords(sentence).sort((a, b) => b.length - a.length)[0];
    const word = key ?? techHere ?? longWords(sentence).sort((a, b) => b.length - a.length)[0];
    if (!word) continue;
    const atStart = new RegExp(`^${escape(word)}`, "i").test(sentence);
    const named = /^[A-Z]/.test(new RegExp(escape(word), "i").exec(sentence)![0]);
    const fit = (w: string) => (atStart || named ? cap(w) : lowerFirst(w));
    const pools = key ? [keyTerms, tech, long] : techHere ? [tech, keyTerms, long] : [long, tech];
    const wrong = pickWrong(word, pools, rand, sentence);
    if (wrong.length < 3) continue;
    const found = new RegExp(escape(word), "i").exec(sentence)![0];
    const q = mcq("cloze", `${ask("Fill the gap")}: “${blank(sentence, word)}”`, fit(found), wrong.map(fit), rand, sentence);
    if (q) byKind.cloze.push(q);
  }

  // Mix the kinds, one question per source line, at most twelve.
  const caps: Record<string, number> = { pair: 6, fact: 3, group: 2, order: 3, number: 2, cloze: 12 };
  const used = new Set<string>();
  const picked: Q[] = [];
  const queues = Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, k === "pair" ? v : shuffle(v, rand)]));
  let progress = true;
  while (picked.length < 12 && progress) {
    progress = false;
    for (const k of Object.keys(caps)) {
      const count = picked.filter((q) => (k === "pair" ? q.kind === "define" || q.kind === "term" : q.kind === k)).length;
      if (count >= caps[k]) continue;
      const q = queues[k].shift();
      if (!q) continue;
      progress = true;
      if (q.source && used.has(q.source)) continue;
      if (q.source) used.add(q.source);
      picked.push(q);
      if (picked.length >= 12) break;
    }
  }

  if (picked.length < 3)
    return {
      error:
        "There isn't enough here to build a quiz yet. Try headings with bullet points, lines like “Mitochondria: make ATP”, or a few full sentences such as “Glycolysis takes place in the cytoplasm.”",
    };
  const letter: Record<QuestionKind, string> = { define: "p", term: "p", fact: "f", group: "g", order: "o", number: "n", cloze: "c" };
  return {
    id: now.getTime().toString(36),
    title: title.trim() || "My notes",
    createdAt: now.toISOString(),
    origin: "device",
    questions: shuffle(picked, rand).map((q, i) => ({ ...q, id: letter[q.kind ?? "cloze"] + i })),
    study: buildStudy(text),
  };
}

// ——— Study first: sections to read, then flashcards ———

export function buildStudy(text: string): NoteStudy {
  const { blocks, pairs, facts, lists, keyTerms } = analyse(text);
  const sections = blocks.slice(0, 12).map((b, i) => ({
    heading: b.heading || (i === 0 && blocks.length > 1 ? "Before the first heading" : "Key ideas"),
    points: b.lines
      .filter((l) => !url(l.text))
      .flatMap((l) =>
        l.text.length > 240 ? (l.text.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [l.text]).map((x) => x.trim()) : [l.text],
      )
      .filter(Boolean)
      .slice(0, 14)
      .map((x) => clip(x, 260)),
  }));
  const cards: StudyCard[] = [
    ...pairs.map((p) => ({ front: p.term, back: p.definition })),
    ...facts.map((f) => ({ front: `${cap(f.subject)} ${f.relation} …`, back: f.object })),
    ...lists.map((l) => ({
      front: `${l.heading || "The steps"}, in order`,
      back: l.items.map((x, i) => `${i + 1}. ${x}`).join("\n"),
    })),
  ].slice(0, 30);
  return { sections, cards, terms: keyTerms.slice(0, 40) };
}

// Decks made before study notes existed, and AI decks from a PDF, study from their own questions.
export function studyFor(deck: NoteDeck): NoteStudy {
  if (deck.study && (deck.study.sections.length || deck.study.cards.length)) return deck.study;
  const sources = [...new Set(deck.questions.map((q) => q.source).filter((s): s is string => !!s))];
  return {
    sections: sources.length ? [{ heading: "What this quiz covers", points: sources.slice(0, 20) }] : [],
    cards: deck.questions.map((q) => ({
      front: q.prompt,
      back: q.choices[q.answer] + (q.explanation ? `\n\n${q.explanation}` : ""),
    })),
    terms: [],
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

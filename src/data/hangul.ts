// Unicode Hangul syllables are composed as 0xAC00 + (initial × 21 + vowel) × 28 + final.
export const INITIALS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const INITIAL_RR = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
export const VOWELS = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const VOWEL_RR = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
export const FINALS = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
// A final consonant said on its own collapses to one of seven sounds.
const FINAL_RR = ["", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "p", "l", "l", "p", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"];

export function compose(initial: string, vowel: string, final = "") {
  const i = INITIALS.indexOf(initial), v = VOWELS.indexOf(vowel), f = FINALS.indexOf(final);
  if (i < 0 || v < 0 || f < 0) throw new Error("Not a Hangul jamo");
  return String.fromCharCode(0xac00 + (i * 21 + v) * 28 + f);
}

export function decompose(block: string) {
  const code = block.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return {
    initial: INITIALS[Math.floor(code / 588)],
    vowel: VOWELS[Math.floor((code % 588) / 28)],
    final: FINALS[code % 28],
  };
}

export function romanize(block: string) {
  const parts = decompose(block);
  if (!parts) return block;
  return (
    INITIAL_RR[INITIALS.indexOf(parts.initial)] +
    VOWEL_RR[VOWELS.indexOf(parts.vowel)] +
    FINAL_RR[FINALS.indexOf(parts.final)]
  );
}

// Vowels that sit to the right of the consonant are built on ㅣ (vertical);
// the rest are built on ㅡ (horizontal) and sit underneath it.
export const isVerticalVowel = (v: string) => ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅣ"].includes(v);

export const builderInitials = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"];
export const builderVowels = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ", "ㅐ", "ㅔ"];
export const builderFinals = ["", "ㄱ", "ㄴ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"];

export const vowelLessons: { vowel: string; sound: string; built: string; cue: string }[] = [
  { vowel: "ㅣ", sound: "i", built: "One upright stroke: a person standing.", cue: "The person stands alone and says “ee”." },
  { vowel: "ㅡ", sound: "eu", built: "One flat stroke: the flat earth.", cue: "Lips stretched flat like the ground: a short “eu”." },
  { vowel: "ㅏ", sound: "a", built: "Person + a short stroke on the right.", cue: "The stroke reaches out toward the sunrise: an open, bright “a”." },
  { vowel: "ㅓ", sound: "eo", built: "Person + a short stroke on the left.", cue: "Stroke points back toward the person: a darker “eo”, as in “uh”." },
  { vowel: "ㅗ", sound: "o", built: "Earth + a short stroke above it (in the original script, a dot for heaven).", cue: "The sun rising over the ground: round lips, “o”." },
  { vowel: "ㅜ", sound: "u", built: "Earth + a short stroke below it.", cue: "A root under the ground: lips pushed out, “u”." },
  { vowel: "ㅑ", sound: "ya", built: "ㅏ with a second short stroke.", cue: "Two strokes add a “y” glide: ya." },
  { vowel: "ㅕ", sound: "yeo", built: "ㅓ with a second short stroke.", cue: "Two strokes: yeo." },
  { vowel: "ㅛ", sound: "yo", built: "ㅗ with a second short stroke.", cue: "Two strokes: yo." },
  { vowel: "ㅠ", sound: "yu", built: "ㅜ with a second short stroke.", cue: "Two strokes: yu." },
  { vowel: "ㅐ", sound: "ae", built: "ㅏ joined to ㅣ.", cue: "In everyday Seoul Korean, ㅐ and ㅔ sound almost the same, like the “e” in “bed”." },
  { vowel: "ㅔ", sound: "e", built: "ㅓ joined to ㅣ.", cue: "Most speakers don't distinguish it from ㅐ; spelling tells them apart." },
];

// Plain, aspirated (puff of air) and tense (tight, no puff) consonants, plus vowels that are easy to mix up.
export const soundTwins: { title: string; note: string; set: string[] }[] = [
  { title: "ㄱ · ㅋ · ㄲ", note: "Plain, with a puff of air, and tight with no puff.", set: ["가", "카", "까"] },
  { title: "ㄷ · ㅌ · ㄸ", note: "The extra line in ㅌ adds the puff; the double ㄸ is tense.", set: ["다", "타", "따"] },
  { title: "ㅂ · ㅍ · ㅃ", note: "ㅍ is aspirated; ㅃ is tense.", set: ["바", "파", "빠"] },
  { title: "ㅈ · ㅊ · ㅉ", note: "The little hat on ㅊ is the puff of air.", set: ["자", "차", "짜"] },
  { title: "ㅅ · ㅆ", note: "ㅆ is a tense, sharper s.", set: ["사", "싸"] },
  { title: "ㅓ · ㅗ", note: "Stroke to the left of the person, or above the ground.", set: ["서", "소"] },
  { title: "ㅜ · ㅡ", note: "Stroke below the ground, or no stroke at all.", set: ["구", "그"] },
  { title: "ㅏ · ㅓ", note: "Stroke out to the right, or back to the left.", set: ["나", "너"] },
];

export const hangulWords: { word: string; meaning: string }[] = [
  { word: "나무", meaning: "tree" },
  { word: "바다", meaning: "sea" },
  { word: "우유", meaning: "milk" },
  { word: "고기", meaning: "meat" },
  { word: "가수", meaning: "singer" },
  { word: "모자", meaning: "hat" },
  { word: "지도", meaning: "map" },
  { word: "오이", meaning: "cucumber" },
  { word: "두부", meaning: "tofu" },
  { word: "커피", meaning: "coffee" },
  { word: "버스", meaning: "bus" },
  { word: "사과", meaning: "apple" },
  { word: "한국", meaning: "Korea" },
  { word: "사랑", meaning: "love" },
  { word: "김치", meaning: "kimchi" },
  { word: "친구", meaning: "friend" },
  { word: "물", meaning: "water" },
  { word: "밥", meaning: "rice, a meal" },
  { word: "책", meaning: "book" },
  { word: "강", meaning: "river" },
];

export const romanizeWord = (w: string) => [...w].map(romanize).join("");

# Quasar product vision

**Learn it once. Remember it longer.**

Quasar turns what a student is learning into a connected, personal memory universe. Learners explore it through illustrated stories and walkable worlds, teach the ideas back, apply them to unfamiliar problems, and come back at exactly the points where their understanding breaks.

Quasar shouldn't become a generic AI study planner with a few memory games attached. Every creative experience in the app has to lead somewhere: to recalling, explaining or applying the idea without help.

## The six pillars

| Pillar | The student's question | Status in this repository |
| --- | --- | --- |
| **Today** | What should I study, and why? | **Built for biology** (on the Review tab). A rule-based planner ranks tasks with the priority formula below, fits them to 5, 15 or 30 minutes, respects prerequisites, takes an optional exam date into account, explains every pick and lets the student swap any task. **Recovery Mode** takes over after three days away or a backlog of reviews more than a day overdue: a small review-first plan that says how many items it set aside. |
| **Memory Worlds** | How do I make this unforgettable? | **Built.** *The Secrets of Cell City*, a six-episode story world (cell structures and cellular respiration) with six recurring characters, rebuild-from-memory games, evidence-based reasoning and fading cues. Walkable dojo, ruins and neon palaces with stable room anchors; illustrated biology, SAT, calculus, Korean and π courses. *Planned:* more story worlds, worlds generated from uploaded material, and characters shared across subjects. |
| **Teach-Back** | Can I explain it without help? | **Built.** The lesson is hidden and the student writes or, in supporting browsers, speaks an explanation. Quasar checks it on the device against three authored key ideas, asks a *why* question about the first missing one instead of revealing it, allows one retry, then asks a follow-up question to defend it. **AI tutor feedback** (Quasar Plus) reviews how the idea was explained, flags wrong claims and asks one more question, through a server function that needs Supabase, RevenueCat and Anthropic keys. *Planned:* voice on native builds, and diagram reconstruction. |
| **Case Lab** | Can I use it to solve a problem? | **Built (first set).** Six original two-attempt field cases, two per biology lesson, on their own page; every attempt is logged and Today schedules the unsolved ones. The Why Ladder's final rung is also an unfamiliar application question. *Planned:* multi-step simulations. |
| **Memory Debugger** | Why do I keep getting this wrong? | **Built.** Error Memory surfaces any concept missed twice, names the exact wrong answer the student keeps choosing next to what's true, offers alternative explanations (saving the one that helped) and schedules a re-check. It only resolves after a later correct answer given without help. With Quasar Plus, the AI writes a **self-repairing mnemonic**: a new hook aimed at that exact misconception, saved beside the old cue until the learner chooses it. |
| **Ready** | What can I genuinely remember and use? | **Built.** Separate meters for factual recall, conceptual understanding and unfamiliar problem-solving, computed only from the learner's own answers, alongside open and repaired mistakes. No score prediction. The **Memory Garden** shows every concept as a plant that grows only from unaided success and blooms after recall on two different days. |

The Why Ladder (the "Why Engine") runs across all three biology lessons: *What happens → Why → How it works → What if it fails → Use it somewhere new.* Quasar records the rung where understanding breaks.

## The learning journey

1. **Start without friction.** No account needed: pick a subject and begin.
2. **Make it memorable.** Illustrated scenes, memory palaces and strange, specific cues.
3. **Explain it yourself.** Teach-Back and the Why Ladder.
4. **Apply it.** Field cases and new-situation questions.
5. **Repair, recall, retain.** Error Memory, FSRS-scheduled review, and a Today plan that brings back what's slipping.

## How Today decides

Each concept gets a priority score:

```
P = 100 × (0.25·K + 0.25·R + 0.20·E + 0.20·I + 0.10·U)
```

| Factor | Meaning | How it's measured today |
| --- | --- | --- |
| K: knowledge gap | Recent evidence the concept isn't mastered | 1 when there's an unresolved recurring error; otherwise 1 minus the share of the last three attempts answered correctly without help; 0.5 when the concept hasn't been tried yet |
| R: review urgency | Due for retrieval practice | FSRS due date; grows as it becomes overdue |
| E: exam proximity | Time left before the exam | `1 − days/30` once an exam is set |
| I: importance | Course relevance | Authored per concept |
| U: prerequisite value | Unlocks later topics | Higher for earlier lessons |

These weights are starting assumptions, not tuned parameters. On top of the score:
- One slot is reserved for a due review.
- A plan holds at most two tasks of the same type.
- No Case or Why task appears before the lesson's concepts have been tested.
- Every task shows why it was chosen.

Implementation: `src/lib/planner.ts`, tested in `tests/learning.test.ts`.

## Design principles

- **Accuracy before memorability.** An inaccurate mnemonic makes misinformation memorable. The real explanation always sits next to the cue.
- **Honest measurement.** Answers given with a hint don't count as mastered. Keyword checks are labelled as keyword checks, not AI grading. Empty states say "not tested yet" instead of inventing numbers.
- **Independence over dependence.** Hints come as questions first. Asking for the full answer is always possible, but it's recorded as help.
- **Welcoming, not punishing.** A missed day doesn't erase progress; Today simply rebuilds a plan that fits the time available.
- **Speed.** Reviews and plans are computed on the device and are ready instantly; nothing blocks a study session while waiting on a network.

## Roadmap

**Phase 1: prove the core loop (in this repository).** Frictionless onboarding, memory worlds, biology lessons, the Cell City story world, Notes → Quiz (study your notes and flashcards first, then a free on-device quiz, plus Plus AI quizzes from text or PDF with source quotes), the Hangul Lab, Teach-Back (with voice and the Plus AI tutor), the Why Ladder, Case Lab, Error Memory, Today with Recovery Mode, Ready and the Memory Garden.

**Phase 2: adaptive learning.**
- Deeper import: slides and lecture recordings, and turning notes into full concepts with key ideas, not just quiz questions.
- Alternative mnemonics compared over delayed tests.
- More field cases.

**Phase 3: depth and exam preparation.**
- Foundation, exam-depth and advanced-reasoning modes.
- Syllabus-aligned tracks.
- A fuller Ready dashboard with delayed-retention results.

**Phase 4: the wider universe.**
- Connected worlds across subjects and personal memory palaces.
- Art Style Studio: storybook and doodle styles exist today; pixel, animated and 3D are planned.
- A wider Memory Garden across subjects, plus optional social sharing.
- *Quasar Originals*: more illustrated story worlds like *The Secrets of Cell City* (built), with animated characters (see `docs/ART-PIPELINE.md`).

## How we'll know it works

Planned validation:
1. Student interviews.
2. A small pilot.
3. A comparison between an ordinary study method, Quasar without memory worlds, and full Quasar.

Measures:
- unaided recall after 7 and 30 days
- performance on unfamiliar questions
- recurring-mistake rates
- study time
- retention
- willingness to pay

The goal is to learn whether each part improves learning, not just whether it looks appealing.

## Business model

- **Free:** the core lessons, memory worlds, reviews, Teach-Back, the Why Ladder, Error Memory and Ready. Learning is never paywalled.
- **Quasar Plus:** personalized mnemonic stories and illustrations generated from the learner's own interests, AI tutor feedback on Teach-Back explanations, and AI quizzes from uploaded notes, all verified server-side through RevenueCat's `quasar_pro` entitlement. Prices come from the store, and willingness to pay is something to test, not assume.

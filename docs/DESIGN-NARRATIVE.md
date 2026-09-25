# Design narrative

Quasar is designed around one idea: **a memory needs somewhere to live, and a learner needs to find it again without help.** Every screen is meant to either give an idea a vivid place or make the learner retrieve it unaided. Here are the choices judges should look at, and the reasons behind them.

## Visual language

- **Warm paper, forest green, sage and one yellow accent.** It should read like a well-made notebook rather than a dashboard: calm enough for long sessions, and warm enough that coming back feels inviting. Tokens live in `src/components/ui.tsx`, with one type scale (Space Grotesk, 36/26/22/16/12) used everywhere.
- **Original illustration, not decoration.** Each picture shows the specific object or relationship the learner needs to remember. There are no generic mascots or emoji. Different subjects get different styles: ink cartoons for SAT, gouache for biology, pixel worlds for memory palaces.
- **Hand-drawn SVG icons** in a single stroke weight, so the interface feels drawn rather than assembled.

## Screens worth a closer look

### 1. Landing: the worlds introduce themselves
`src/components/WelcomeScene.tsx` · `docs/landing-worlds-mobile.png`

The first screen shows no feature list. The hero glides from world to world (a quiet dojo, ancient ruins, neon rooftops) while a caption and progress dots follow along. Each world fills the frame exactly, so the image never shows a seam. The heading follows immediately: *Learn it once. Remember it longer.* Subject chips have spring-scaled press feedback, and no account is needed to start.

### 2. Today: a plan with its reasons shown
`src/features/TodayPlan.tsx` · `docs/today-plan-mobile.png`

Home stays calm: a greeting, the lesson to continue, and one slim *Today's session* row. The plan itself lives on the Review tab, where studying happens. There, a dark hero card asks one question: how much time do you have? Choosing 5, 15 or 30 minutes rebuilds the plan instantly. Each task shows its type, its length and one plain sentence explaining why it was chosen. Swap sits outside the task's tap target, so a learner never starts a task by accident. After a break, the card changes its headline to *Welcome back. Let's start small.*, says how long it's been and that nothing is lost, and names how many reviews it set aside, instead of dumping a backlog. The planner's formula is written up in `docs/PRODUCT-VISION.md`.

### 3. Teach-Back: a question before the answer
`src/features/TeachBack.tsx` · `docs/teach-back-mobile.png`

The lesson disappears, and a dark "The lesson is hidden" card holds the prompt. After a check, the ideas the learner covered are ticked. The missing ideas stay hidden. Instead, a yellow card asks a guiding question about the first one ("What does oxygen do at the very end of the electron transport chain?"). The design never makes the answer the easy path: revealing it is always possible, but it's recorded as help. The label says plainly that this is a keyword check, not AI grading.

### 4. Error Memory: naming the misconception
`src/features/ErrorMemory.tsx` · `docs/error-memory-mobile.png`

When a concept slips twice, a peach card appears showing the learner's own wrong answer in red quotation marks ("To manufacture sunlight"), directly above *What's true*. Seeing their own words is more specific, and more motivating, than a generic "review this". *Try a different angle* cycles through alternative explanations, and the learner can keep the one that helped. The card only disappears after a later answer that's correct and unaided.

### 5. Why Ladder: where understanding breaks
`src/features/WhyLadder.tsx`

Five segments across the top fill green or red as the learner climbs (*what, why, how, what if it fails, use it somewhere new*), and the current rung gently springs larger. The result doesn't say "3/5". It says **where** understanding broke ("breaks at: why does it happen"), because that's what the next lesson needs to know.

### 6. Ready: three kinds of knowing
`src/features/Ready.tsx` · `docs/ready-mobile.png`

Factual recall, conceptual understanding and unfamiliar problem-solving each get their own animated meter and colour. They're separate because knowing a fact isn't the same as explaining it. Untested areas say "Not tested yet" rather than showing a zero that looks like failure. The card states outright that this isn't a score prediction.

### 7. Memory Garden: progress that never wilts
`src/features/MemoryGarden.tsx` · `docs/memory-garden-mobile.png`

Eighteen hand-drawn SVG plants in three beds, one bed per lesson and a petal colour per bed. A seed becomes a sprout when a concept is tried, grows leaves after a correct unaided recall, sets a bud once it's been explained, and blooms only after recall on two different days, which is spaced retention made visible. Nothing ever withers. A concept in Error Memory gets a small blue drop, a request for care rather than a penalty. Tapping a plant says exactly what would help it grow next.

### 8. Case Lab and the AI tutor
`src/features/CaseLab.tsx` · `src/features/TeachBack.tsx`

Case Lab lists original field cases by lesson with honest status tags (*New*, *Solved*, *Solved with a hint*, *Try again*). In Teach-Back, a Quasar Plus member can ask the AI tutor for feedback. It arrives in a separate cool-blue card: evidence quoted from the learner's own words, any wrong claims flagged in red, one more question, and a reminder that AI feedback can be wrong. Everyone else sees a single quiet line about Plus rather than a locked button.

### 9. Quasar Plus: a paywall that respects the learner
The hero matches the onboarding's dark green, with a pulsing spark icon and three feature tiles (personalized stories, AI tutor feedback, and *core content stays free*). An annual package gets a *Best value* tag. If the store isn't connected, a dashed "coming soon" card explains that plainly instead of showing a broken or disabled buy button.

## Motion

Motion is built on **Reanimated + Moti**, so it runs natively on iOS and Android and still works on web.
- **Entrances** (`Reveal`): a 480 ms fade-and-lift, staggered 60–90 ms between items, so each screen reads top to bottom.
- **Press feedback** (`PressableScale`): a spring to 97%, fast enough to feel physical.
- **Progress** (`Meter`, ladder rungs): 700 ms fills and springs, so a result feels earned.
- **Reduced motion:** every component checks `useReducedMotion()` and renders at rest when it's on.

## Accessibility

- Every interactive element has a role and a label; task rows describe their length and reason.
- Progress bars expose `progressbar` values.
- Results are announced through polite live regions.
- There are no nested buttons. Buttons and choice chips are at least 44 pt tall; small text links like Swap get an extended hit area.

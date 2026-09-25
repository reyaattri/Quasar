# Demo

## Two-minute script (for the Shipaton video)

Record on a phone or an Android build if you can. If you record the web build at phone size, say so in the description.

| Time | Show | Say |
| --- | --- | --- |
| 0:00–0:12 | Landing: the hero glides dojo → ruins → neon | "Most study apps show you the same explanation again. Quasar gives an idea somewhere to live." |
| 0:12–0:25 | Home → *Today's session* → the plan on Review; switch 15 → 30 min; read the task reasons | "Today picks what needs me and tells me why: knowledge gaps, what's due, my exam date." |
| 0:25–0:45 | Lesson card → hide card → choose a wrong answer | "I learn with a picture, then answer with the picture hidden." |
| 0:45–1:05 | Back on Review: Repair task + Error Memory card ("You keep choosing…") | "Miss it twice and Quasar names the exact misconception, then offers a different angle." |
| 1:05–1:25 | Explain it back → check → the guiding question → check again → Defend | "I teach it back. Quasar asks a question about what I left out instead of handing me the answer." |
| 1:25–1:40 | Why Ladder: climb, slip on one rung, see "breaks at…" | "It finds where my understanding breaks, not just a score." |
| 1:40–1:52 | Ready: three meters, then the Memory Garden | "Recall, understanding and application, measured separately. And every idea I really know grows in my garden." |
| 1:52–2:00 | Quasar Plus screen | "The core lessons are free. Quasar Plus adds personalized stories and an AI tutor, through RevenueCat." Only show a purchase if it has actually been completed with a sandbox account. |

## Screenshots

`node scripts/capture-screens.cjs` (with Metro serving on port 8081) regenerates:
- `docs/landing-worlds-mobile.png`
- `docs/today-plan-mobile.png`
- `docs/error-memory-mobile.png`
- `docs/teach-back-mobile.png`
- `docs/ready-mobile.png`
- `docs/memory-garden-mobile.png`
- `docs/notes-quiz-mobile.png`
- `docs/hangul-lab-mobile.png`

## Earlier recording

`quasar-demo.webm` is a silent recording of the web build at phone size, made before the learning loop existed. It shows the vocabulary deck, the dojo, a custom shopping list and biology recall. It is not an emulator recording. To regenerate it, set `PLAYWRIGHT_BROWSERS_PATH` for Playwright's FFmpeg, then run `node scripts/record-demo.cjs` while Metro serves on port 8081.

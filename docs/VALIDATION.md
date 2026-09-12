# Validation record — September 12, 2026

Passed locally:

- TypeScript typecheck.
- Expo production web export. The output includes the active SAT, medical and memory-world assets and excludes the removed computer-science curriculum and artwork.
- Eleven logic/database tests: all three worlds have six distinct rooms and stable anchors; pi reconstructs 12 decimal digits in order; custom shopping lists; curriculum consistency; FSRS behavior; date revival; streaks; immutable profile updates; Supabase schema, RLS and quota behavior.
- Thirteen Chrome phone-viewport flows. Coverage includes onboarding, SAT’s two five-word batches and context gates, the selected Resilient and Ambiguous artwork, six enterable neon rooms, hidden and ordered pi recall, custom eight-item shopping routes, all four Fun & Flex activities, medical recall, the three schematic models, the sourced heart and unavailable-AR feedback, persistence and small-screen overflow.
- Production screenshots were inspected for the world map, arcade room, floating pi cue, card trainer, face trainer, sourced heart, Resilient and Ambiguous cards.

The six-room route test confirms the room names in order: Entrance steps, Arcade, Greenhouse, Ramen diner, Antenna workshop and Moon observatory. It opens the supplied cue inside every room, recalls every digit pair, returns to the world between rooms and reconstructs `3.141592653589`.

The browser tests exercise the React Native Web build. Android/iOS binaries, real phone AR placement, camera QR scanning, live Supabase, RevenueCat purchases and external generation services still require account configuration and device testing. The heart model is a sourced educational geometry with nine labels; Quasar has not clinically validated it.

No current official 2026 SAT questions are reproduced. The app’s context questions are original SAT-style practice and say so in the interface.

GitHub synchronization remains pending explicit approval for the public upload. Local Git commits and the source archive are maintained independently.

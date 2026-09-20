# September 20 artwork update

Built-in image generation produced `assets/korean-story-complete.png`, a 4 × 4 atlas with 14 story scenes. The app uses scenes 0–13 in story order. Mouth and split door now have their own artwork; the old fallback and reused door were removed. Deterministic red letter outlines remain alongside the artwork for precise shape study. Generated pictures are new interpretations of the supplied recording, not identical copies of its frames.

Prompt: transparent, hand-inked cartoon atlas, same blond martial-arts learner; toy gun, nose, door, rattlesnake, shocked square mouth, bucket, summit, nothing, jump, champion, water shot, door split into two, pillars, mysterious hat. Keep all scenes framed separately and leave final two cells empty.

Toolkit generation was attempted three times, including a targeted background-removal edit. The results retained opaque backgrounds and were not wired into the app, because transparent illustrations were requested. Existing toolkit artwork remains until a suitable replacement is available.

Validation: TypeScript passed; Korean browser test passed through all 14 story beats, recorded audio, tracing, six blank recall drawings, word-building and conversation. GitHub push was attempted; authentication is unavailable and Windows Credential Manager could not persist credentials.

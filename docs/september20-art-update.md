# September 20 artwork update

Built-in image generation produced `assets/korean-story-complete.png`, a 4 × 4 atlas with 14 story scenes. The app uses scenes 0–13 in story order. Mouth and split door now have their own artwork; the old fallback and reused door were removed. Deterministic red letter outlines remain alongside the artwork for precise shape study. Generated pictures are new interpretations of the supplied recording, not identical copies of its frames.

Prompt: transparent, hand-inked cartoon atlas, same blond martial-arts learner; toy gun, nose, door, rattlesnake, shocked square mouth, bucket, summit, nothing, jump, champion, water shot, door split into two, pillars, mysterious hat. Keep all scenes framed separately and leave final two cells empty.

Toolkit generation produced `assets/toolkit-cutouts-v2.png`. The image preview displayed background RGB values, but inspection of the actual PNG alpha channel confirmed transparent background pixels. The six new cutouts replace the previous toolkit thumbnails. Prompt: transparent 3 × 2 editorial atlas of bun hanging lemon pegs, moon with tin telescope, boot linking kite and book, compass route, girl with rose, and explorer memory dollhouse. No backgrounds or captions.

Validation: TypeScript passed; Korean browser test passed through all 14 story beats, recorded audio, tracing, six blank recall drawings, word-building and conversation. GitHub push was attempted; authentication is unavailable and Windows Credential Manager could not persist credentials.

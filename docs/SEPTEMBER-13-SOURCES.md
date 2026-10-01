# Learning update: sources and asset provenance

Original Quasar teaching text, quizzes, characters and mnemonic interactions. The pictures are memory metaphors; the labelled mechanisms explain their scientific limits.

## Final implementation notes

- The RNA lesson opens its interactive molecular viewer directly. The exported static rendering is only a reference asset; Polly narration and the static-image gate are removed.
- Active room atlases are `landmarks-dojo-distinct.png`, `landmarks-egypt-distinct.png` and `landmarks-neon-distinct.png`. Each of the three landmarks has a distinct object. Alternate landmarks encode the same room's pi pair, not extra digits. Earlier atlas prompts below describe superseded assets.
- `objects-egypt-approved.png` is the exact Egyptian reference supplied by the user. The latest SAT selection retains meticulous and ambiguous and uses the supplied sheet for the other eight words.
- Five original Korean speaker recordings are bundled unchanged: 나, 아, 어, 이, 아이. Individual author, original-file links and CC BY-SA 4.0 terms remain in `assets/korean/credits.json`; the lesson UI uses simple listening instructions without source jargon. Remaining examples require a Korean device TTS voice. Speech recognition and handwriting grading are not claimed.
- Calculus uses original interactive graphs, animated rule transformations and a convergent Riemann-sum activity. Worked equations are split into readable steps. Reference for the interaction direction: https://brilliant.org/topics/calculus/ (no copied lessons or artwork).
- The dedicated pi course covers the first 100 decimal digits, with 50 fixed landmarks, phonetic Major System pegs, original humorous stories and hidden-cue recall. It does not promise an infinite digit course or a universally best memory method. Technique references: https://artofmemory.com/blog/major-system/ and https://artofmemory.com/blog/how-to-memorize-pi/ . The digit sequence is independently checked with Machin's formula in the test suite.
- Five genuine official practice items: College Board SAT Practice Test 9, Reading and Writing Module 1, questions 1–5. The app opens the publisher's original PDF and grades answer letters on return, with original short coaching. It does not reproduce the passages or claim the items appeared on a 2026 exam. Question source: https://satsuite.collegeboard.org/media/pdf/sat-practice-test-9-digital.pdf. Verified answer source: https://satsuite.collegeboard.org/media/pdf/sat-practice-test-9-answers-digital.pdf (A, D, C, C, B).

## Biology

- The three active modules now begin with cells, continue through DNA evidence and packing, and finish with replication, transcription and translation. The explanations and questions are original; the protected passage supplied as a reference was not copied.
- OpenStax Biology 2e, DNA structure and sequencing: https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing
- OpenStax Biology 2e, prokaryotic cell division and chromosome organization: https://openstax.org/books/biology-2e/pages/10-5-prokaryotic-cell-division
- HHMI BioInteractive, DNA replication animation: https://www.biointeractive.org/classroom-resources/dna-replication-basic-detail
- ASU Ask A Biologist, visible DNA extraction activity: https://askabiologist.asu.edu/listen-and-watch/see-DNA
- Photosystem II: https://www.rcsb.org/structure/1RWT — experimental photosynthetic reaction-centre structure.
- Nucleosome core: https://www.rcsb.org/structure/1KX5 — experimental DNA–histone complex.
- RNA polymerase structure: https://www.rcsb.org/structure/1Y1W — experimental yeast polymerase II elongation complex, 4.00 Å, Kettenberger, Armache and Cramer.
- The three static molecular images were rendered with the bundled Mol* viewer from deposited coordinates using scripts/render-molecular-reference.cjs. They are orientation previews; the lesson opens the interactive structures directly.
- PDB coordinates: CC0, https://www.rcsb.org/pages/usage-policy. Mol* 5.9.0 is bundled with its MIT license in public/medical/MOLSTAR-LICENSE.
- The case source and each biology lesson's reference are linked in src/data/medicalLessons.ts. The immunity case is adapted from a published case report; other cases are explicitly original educational vignettes.
- The barrier and phagocyte GLBs remain schematic, not microscopy-derived cell models. Repeated barrier labels are consolidated into one epithelial layer label. Whole-cell microscopy and clinical blood-flow simulation are not implemented.

## Korean and teaching references

- King Sejong Institute: https://www.iksi.or.kr/lms/main/about.do
- Alphabet introduction curriculum: https://www.iksi.or.kr/lms/crse/crseApply.do?crseNo=119352
- National Institute of Korean Language romanization: https://www.korean.go.kr/front_eng/roman/roman_01.do
- The requested Instagram reel was accessible in the browser; its shape-association approach informed the original letter hooks. Its creator artwork is not copied. https://www.instagram.com/reel/DS-F9zCkhzg/
- The user-supplied September 19 recording was reviewed locally. Quasar follows its useful learning order—picture story, sound pass, vowel pass, immediate decoding—using a new night-market story, original characters, original drawings and original wording.
- Teuida's conversational practice informed user-paced exchanges: https://play.google.com/store/apps/details?id=net.teuida.teuida&hl=en_US
- Sketchy's story/symbol/recall/case approach informed lesson sequencing: https://www.sketchy.com/
- Names and faces use a salient facial feature, a concrete substitute-word picture, exaggeration, immediate spoken repetition, and later retrieval: https://artofmemory.com/wiki/Memorizing_Names_and_Faces/
- Playing-card practice uses a fixed image system and ordered loci: https://artofmemory.com/wiki/Card_Memorization_Techniques/
- Korean voice uses installed device TTS. Recordings are for listening back, not automated pronunciation scoring. No voice transcription service or automatic advance is used. Handwriting is a free practice canvas, not a handwriting classifier.

## Artwork

New room-landmark atlases generated with the built-in image-generation tool and inspected before integration. 12 panels per atlas, covering two additional landmarks per room. Existing six main cue panels per world are retained. All project assets copied into assets/.

### Dojo prompt

Create one game asset atlas, landscape 1536x1024, exactly 4 columns and 3 rows, 12 equally sized isolated comic panels with thin straight dividers. Each panel is a close-up funny mnemonic object interaction with one expressive adult human; no text, no letters, no captions. Keep full objects and people within each panel with margins, plain background, no scenery/landscapes. Exaggerated physical comedy, intentional hand-drawn lines, readable small. Japanese dojo: brush-ink woodblock-inspired editorial caricatures on warm washi paper, muted vermilion, indigo and moss. Reading order panels: 1 a dojo keeper rings a giant welcome bell using a rubber tyre; 2 a barefoot master stuffs a tyre into a tiny wooden shoe rack; 3 a toy maker opens a toy chest and an enormous kimono doll pops out; 4 a folded paper crane carries a shocked doll maker and a doll; 5 a gardener balances a steaming bun on a miniature bonsai; 6 a bamboo stalk springs a bun at a surprised gardener; 7 a tea host warms a huge sea shell above a hearth and shell sneezes steam; 8 shell on cup shelf slurps tea from every cup while host gawps; 9 chef finds a small stubborn mule blocking kitchen stove; 10 mule wears a stack of lacquer bowls as a hat beside chef; 11 student uses key fob to make training rack bow; 12 wall scroll rolls up around giant key fob and startled calligrapher.

### Egypt prompt

Create one game asset atlas, landscape 1536x1024, exactly 4 columns and 3 rows, 12 equally sized isolated comic panels with thin straight dividers. Each panel is a close-up funny mnemonic object interaction with one expressive adult human; no text, no letters, no captions. Keep full objects and people within each panel with margins, plain background, no scenery/landscapes. Exaggerated physical comedy, intentional hand-drawn lines, readable small. Ancient Egyptian palace: flat papyrus collage, bold uneven ink, ochre lapis turquoise, expressive original caricatures. Reading order: 1 guard weighs tyre on gold scales and is lifted by other pan; 2 tyre hoops itself around a flaming torch and guard blows it cool; 3 dancing turquoise tile on tile table makes mason leap; 4 turquoise tile rattles chisel rack as artisan covers ears; 5 scribe uses comically large bone to flatten papyrus sheet; 6 gardener shakes date palm and crowned bones fall instead of dates; 7 noble with flying royal shawl sees shawl wave back in gold mirror; 8 shawl blows perfume jars like trumpet with startled attendant; 9 scribe buried by mail scrolls on writing desk; 10 mail unrolls from high scroll shelf wrapping librarian; 11 gold-robed important guest with blank VIP badge (no text) sitting on tiny throne held by an ibis; 12 important guest opens treasure chest containing giant blank gold admission badge while ibis attendant applauds.

### Neon prompt

Create one game asset atlas, landscape 1536x1024, exactly 4 columns and 3 rows, 12 equally sized isolated comic panels with thin straight dividers. Each panel is a close-up funny mnemonic object interaction with one expressive adult human; no text, no letters, no captions. Keep full objects and people within each panel with margins, plain background, no scenery/landscapes. Exaggerated physical comedy, intentional hand-drawn lines, readable small. Cyberpunk night market: vivid risograph manga pop comic, cyan magenta violet halftone chunky black outlines on pale lilac, human characters not all robots. Reading order: 1 courier robot door bonks a glowing security console; 2 door sneezes huge parcels off shelf onto courier; 3 ramen chef tangled in a mechanical tail that stirs noodle cooker; 4 mechanical tail opens drink fridge and balances drinks above shocked chef; 5 arcade gamer sees giant safety pin steering racing cabinet; 6 giant safety pin plays pinball while gamer cheers; 7 neon gardener sees wobbling jelly on neon fern; 8 giant strawberry planter with jelly wearing strawberry hat and surprised gardener; 9 mechanic watches mole curled inside antenna coil; 10 mole wears tool rack as a backpack beside mechanic; 11 astronomer waves key fob to open moon-shaped gate; 12 key fob makes star globe spin around surprised astronomer.

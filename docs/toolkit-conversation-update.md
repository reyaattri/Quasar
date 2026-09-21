# Guided memory toolkit

Six short conversations replace the static toolkit explanations. Each includes an illustrated introduction, a worked mnemonic, picture-free recall, retry feedback, an optional glimpse, and a transfer exercise. The artwork fades in on conversation changes and respects reduced-motion settings. Learners can still move between lessons without being forced to pass a quiz.

Removed the Korean explanatory caption and duplicate letter badge, the standalone weekly practice count, the home slogan, and redundant scene instructions. Kept instructions that explain how to answer or decode a mnemonic.

## Artwork

Built-in image generation produced `assets/toolkit-conversations.png` (1536 × 1024, transparent alpha). Six individually framed illustrations are used in the toolkit lessons and their home entry thumbnails. The source image is preserved; SVG viewport clipping prevents adjacent artwork from appearing in the frames.

## Prompt

Use case: illustration-story. Create a transparent PNG illustration sheet, exactly 3 columns and 2 rows, SIX separate educational story vignettes each centered inside its own equal cell with 12 percent clear margins and zero overlapping neighbouring cells. Landscape 1536x1024. Hand-painted Japanese animation storybook aesthetic, gentle watercolor and gouache, delicate pencil outlines, warm woodland colours, expressive original human characters, handmade asymmetry, charming quiet humour, NOT glossy 3D, NOT stock vector icons. No lettering or symbols or numbers, no scenery backgrounds; only characters and essential props, actual transparent background. Reading order six distinct scenes: 1 an elderly baker with flour on her nose amazed by a bread bun sprouting three huge lemons beside a shoe overflowing strawberries; 2 a tiny bespectacled moon-shaped watchmaker polishing an enormous silver tin can, wonderfully odd but friendly; 3 a raincoat child watches a boot kick a kite that is lifting an open book, connected action all within its own cell; 4 a young explorer at a simple wooden four-way signpost holding a folded map, tiny curious bird perched on head; 5 a friendly Korean woman with bob haircut holding one comically huge pink rose that bends her backwards, smiling; 6 a little gardener carrying a watering can steps through a miniature dollhouse front door, a giant apple at door, milk bottle on chair, loaf on windowsill. Consistent artisan storybook quality, different silhouettes, all body parts and objects fully visible. Distinct illustrations designed to read at 100px thumbnails and 300px lesson images. No labels borders text watermark, no filled backdrops.

## Verification

Mobile end-to-end coverage checks all six conversations, hidden images during recall, incorrect-answer hints, optional glimpses, successful answers, lesson navigation, and horizontal overflow. The Korean learning flow is checked separately.

# Medical studio and phone pass

The medical cards open an embedded full-screen web studio. Two advanced story lessons cover the complement cascade and B-cell maturation. Three original schematic GLBs remain available alongside a sourced cardiovascular model. Models can be rotated, zoomed and hidden for retrieval practice.

`public/medical-room.html?concept=0` is also a standalone entry point. Concept indices 0–4 are validated; concept 3 is detailed cardiovascular anatomy and concept 4 is the interactive PPG lab. Malformed values fall back to the barrier. Model assets and the pinned model-viewer runtime are bundled locally, with its Apache licence.

## Room placement

Google's model-viewer enables WebXR, Android Scene Viewer and iOS Quick Look where available. The room button is always visible; actual placement is available on capable devices. Camera access is initiated by the user's AR action. The ordinary 3D view remains available without a camera. WebXR requires HTTPS. The phone pass acts as the flashcard entry: scan it, open the selected anatomy, then place the model on a detected surface. Persistent printed-card image tracking varies by platform and is not claimed here.

On native builds, set `EXPO_PUBLIC_SITE_URL` to the deployed HTTPS origin containing the exported public assets. The native entry opens the studio in the device browser. Without a deployment it is explicitly unavailable in the native preview. No publishing or phone AR verification has occurred.

The phone pass unfolds a real QR encoding the selected model's URL with a four-module quiet zone. It appears only when a non-local HTTPS origin is available, avoiding unusable localhost codes. The link offers an accessible alternative to scanning. It shares the public model route, not personal progress or shopping lists. The present reveal is a simple expand/collapse, not the reference's animated 3D tree.

## References

- User's anatomy AR reference: https://www.instagram.com/reel/DaVKc8Ox1DF/
- User's miniature-world QR reveal reference: https://www.instagram.com/reel/Dclq421sKcD/
- https://modelviewer.dev/examples/augmentedreality/
- https://developers.google.com/ar/develop/scene-viewer
- Biology: https://nigms.nih.gov/biobeat/2023/12/what-is-the-immune-system

Browser tests verify model loading, cue hiding, selection, viewport fit and return to the cards. Real camera placement, printed-card tracking, headset VR and QR camera scanning remain unverified; do not describe those as tested or complete.

## Detailed anatomy, circulation and physiology

Concept 3 opens a sourced cardiovascular model with 23 selectable structures: chambers, venae cavae, pulmonary vessels, aorta, coronary arteries and cardiac veins. The animated pulse tour moves through source-mesh label positions and changes from blue to red after the lung step. It teaches route order and does not run computational fluid dynamics. View in your room is always visible and explains device requirements when AR is unavailable. Attribution, source URL, selection changes and CC BY-SA licence are recorded in public/medical/ANATOMY-CREDITS.txt.

Concept 4 follows the supplied Plethscape reference with an interactive learning simulation. The learner can change sensing site, age, heart rate, green/red/infrared wavelength and motion state and watch a qualitative PPG waveform respond. It explicitly distinguishes physiological rate change from measurement artifact and is not presented as a calibrated or clinical signal.

For research-grade flow simulation, the studio links to SimVascular and the NIH-funded Vascular Model Repository. SimVascular supplies the image-to-model-to-hemodynamics pipeline; those numerical solvers are outside the phone lesson.

To regenerate the selection, obtain cardiovascular.glb from the credited source and run `node scripts/prepare-heart.cjs <path-to-cardiovascular.glb>` from the repository root. Browser tests verify all 23 labels, pulse-route start/pause, physiology controls, model loading without Google's decoder CDN, recall hiding and unsupported-device feedback. Real phone AR remains unverified.

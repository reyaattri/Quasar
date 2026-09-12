# Medical studio and phone pass

The medical cards open an embedded full-screen web studio. Three original GLB teaching models cover a physical barrier, phagocytosis and antibody specificity. These are schematic learning aids, not anatomical scans. The model can be rotated, zoomed and hidden for retrieval practice. The original drawing-based lesson remains available.

`public/medical-room.html?concept=0` is also a standalone entry point. Concept indices 0–3 are validated; malformed values fall back to the barrier. Model assets and the pinned model-viewer runtime are bundled locally, with its Apache licence. Regenerate original models with `node scripts/create-medical-models.cjs`.

## Room placement

Google's model-viewer enables WebXR, Android Scene Viewer and iOS Quick Look where available. The room button is always visible; actual placement is available on capable devices. Camera access is initiated by the user's AR action. The ordinary 3D view remains available without a camera. WebXR requires HTTPS. This is surface-placement AR, not headset VR or printed-card image tracking. The Instagram reference describes image-triggered anatomy AR; that tracking mode is not yet implemented.

On native builds, set `EXPO_PUBLIC_SITE_URL` to the deployed HTTPS origin containing the exported public assets. The native entry opens the studio in the device browser. Without a deployment it is explicitly unavailable in the native preview. No publishing or phone AR verification has occurred.

The phone pass unfolds a real QR encoding the selected model's URL with a four-module quiet zone. It appears only when a non-local HTTPS origin is available, avoiding unusable localhost codes. The link offers an accessible alternative to scanning. It shares the public model route, not personal progress or shopping lists. The present reveal is a simple expand/collapse, not the reference's animated 3D tree.

## References

- User's anatomy AR reference: https://www.instagram.com/reel/DaVKc8Ox1DF/
- User's miniature-world QR reveal reference: https://www.instagram.com/reel/Dclq421sKcD/
- https://modelviewer.dev/examples/augmentedreality/
- https://developers.google.com/ar/develop/scene-viewer
- Biology: https://nigms.nih.gov/biobeat/2023/12/what-is-the-immune-system

Browser tests verify model loading, cue hiding, selection, viewport fit and return to the cards. Real camera placement, printed-card tracking, headset VR and QR camera scanning remain unverified; do not describe those as tested or complete.

## Labelled heart addition

Concept 3 opens a sourced heart model with nine selectable structure labels. View in your room is always visible and explains device requirements when AR is unavailable. Label selection places a hotspot; it does not isolate a mesh. The source geometry has not been clinically validated by this project. Attribution, source URL, selection changes and CC BY-SA licence are recorded in public/medical/ANATOMY-CREDITS.txt. Draco decoders are bundled locally.

To regenerate the selection, obtain cardiovascular.glb from the credited source and run `node scripts/prepare-heart.cjs <path-to-cardiovascular.glb>` from the repository root. The script uses the installed model-viewer dependency's Three.js package. Browser tests verify all nine labels, model loading without Google's decoder CDN, recall hiding and unsupported-device feedback. Real phone AR remains unverified.

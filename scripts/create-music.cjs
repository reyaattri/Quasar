// Original procedural melodies. No sampled or third-party audio.
const fs = require("node:fs");
const rate = 22050,
  seconds = 32;
const tunes = {
  dojo: [62, 69, 74, 76, 69, 67, 64, 62],
  egypt: [57, 58, 61, 64, 65, 64, 61, 58],
  neon: [57, 64, 67, 71, 69, 67, 64, 59],
};
for (const [name, notes] of Object.entries(tunes)) {
  const data = Buffer.alloc(rate * seconds * 2 + 44);
  data.write("RIFF");
  data.writeUInt32LE(data.length - 8, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(rate, 24);
  data.writeUInt32LE(rate * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(data.length - 44, 40);
  for (let i = 0; i < rate * seconds; i++) {
    const t = i / rate,
      beat = Math.floor(t / 2),
      local = t % 2;
    const hz = 440 * 2 ** ((notes[beat % notes.length] - 69) / 12);
    const fade = Math.min(1, t / 1.2, (seconds - t) / 1.2);
    const envelope =
      Math.min(1, local / (name === "neon" ? 0.35 : 0.012)) *
      Math.exp(-local * (name === "dojo" ? 2.4 : 1.2));
    let tone = 0;
    for (let h = 1; h <= 5; h++)
      tone +=
        (Math.sin(2 * Math.PI * hz * h * t) * Math.exp(-local * h * 0.7)) /
        (h * h);
    const drone =
      Math.sin(
        2 *
          Math.PI *
          (name === "dojo" ? 146.83 : name === "egypt" ? 110 : 130.81) *
          t,
      ) * 0.12;
    const chorus =
      name === "neon"
        ? Math.sin(2 * Math.PI * hz * 1.003 * t) *
          0.18 *
          Math.min(1, local / 0.5)
        : 0;
    const signal = (tone * envelope + drone + chorus) * fade;
    data.writeInt16LE(Math.round(signal * 6500), 44 + i * 2);
  }
  fs.writeFileSync(`assets/${name}.wav`, data);
}

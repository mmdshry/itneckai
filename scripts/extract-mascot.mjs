import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCE =
  process.argv[2] ??
  "C:/Users/MSHF/AppData/Roaming/Cursor/User/workspaceStorage/f6c7f678f2ddaa781004bad5f1dac5b5/images/itneckai-24225cda-eaf5-4e06-9dea-7f94ca302f73.png";
const OUT = "public/brand/mascot.png";

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixels = Buffer.from(data);

function isBackdrop(offset) {
  const r = pixels[offset];
  const g = pixels[offset + 1];
  const b = pixels[offset + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // Neutral near-black only. Cyan rim light and the dark pupils stay.
  return max < 28 && max - min < 12;
}

const seen = new Uint8Array(width * height);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push(x, 0, x, height - 1);
}
for (let y = 0; y < height; y++) {
  stack.push(0, y, width - 1, y);
}

while (stack.length) {
  const y = stack.pop();
  const x = stack.pop();
  if (x < 0 || y < 0 || x >= width || y >= height) continue;
  const p = y * width + x;
  if (seen[p]) continue;
  const offset = p * channels;
  if (!isBackdrop(offset)) continue;
  seen[p] = 1;
  pixels[offset + 3] = 0;
  stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}

await mkdir("public/brand", { recursive: true });
await sharp(pixels, { raw: { width, height, channels } })
  .trim({ threshold: 1 })
  .png()
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log("wrote", OUT, meta.width, "x", meta.height);

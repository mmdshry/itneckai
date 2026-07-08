import { readFile, writeFile, rm } from "node:fs/promises";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const svg = await readFile("public/icon.svg");

async function png(size, file) {
  await sharp(svg, { density: 300 }).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}

await png(192, "public/icon-192.png");
await png(512, "public/icon-512.png");
await png(180, "public/apple-touch-icon.png");

const png32 = await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer();
const png16 = await sharp(svg, { density: 300 }).resize(16, 16).png().toBuffer();
await writeFile("public/favicon.ico", await pngToIco([png16, png32]));
console.log("wrote public/favicon.ico");

// Remove create-next-app's default favicon so ours in /public is served.
await rm("src/app/favicon.ico", { force: true });

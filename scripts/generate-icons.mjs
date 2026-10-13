import {rm, writeFile} from "node:fs/promises";
import sharp from "sharp";
import pngToIco from "png-to-ico";

/** White elephant mark. A white canvas hides it, so icons sit on brand navy. */
const SOURCE = "public/brand/mascot.png";
const NAVY = { r: 2, g: 55, b: 107, alpha: 1 };

/**
 * Square-canvas padding (contain, never crop/stretch).
 * Tiny favicons need less inset so the face stays readable;
 * larger icons get more breathing room.
 */
function padRatio(size) {
    if (size <= 16) return 0.06;
    if (size <= 32) return 0.08;
    return 0.12;
}

async function squareBuffer(size, background = {r: 0, g: 0, b: 0, alpha: 0}) {
    const pad = padRatio(size);
    const content = Math.max(1, Math.round(size * (1 - pad * 2)));
    const logo = await sharp(SOURCE)
        .resize(content, content, {
            fit: "contain",
            background,
            kernel: sharp.kernel.lanczos3,
        })
        .png()
        .toBuffer();

    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background,
        },
    })
        .composite([{input: logo, gravity: "centre"}])
        .png()
        .toBuffer();
}

async function squarePng(size, file, background = {r: 0, g: 0, b: 0, alpha: 0}) {
    await writeFile(file, await squareBuffer(size, background));
    console.log("wrote", file, `(pad ${Math.round(padRatio(size) * 100)}%)`);
}

await squarePng(192, "public/icon-192.png", NAVY);
await squarePng(512, "public/icon-512.png", NAVY);
await squarePng(180, "public/apple-touch-icon.png", NAVY);

// Navy canvas keeps the white elephant visible at 16×16.
const png32 = await squareBuffer(32, NAVY);
const png16 = await squareBuffer(16, NAVY);
await writeFile("public/favicon.ico", await pngToIco([png16, png32]));
console.log("wrote public/favicon.ico");

// Drop legacy abstract SVG and any create-next-app default under app/.
await rm("public/icon.svg", {force: true});
await rm("src/app/favicon.ico", { force: true });
console.log("removed public/icon.svg (if present)");

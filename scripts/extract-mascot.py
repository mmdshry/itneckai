"""Cut the itneck.ai elephant off its black backdrop and build app icons.

Sharp cannot load under the current Node/pnpm layout, so icon files are
produced here. scripts/generate-icons.mjs stays the documented sharp path.
"""

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(
    r"C:\Users\MSHF\AppData\Roaming\Cursor\User\workspaceStorage"
    r"\f6c7f678f2ddaa781004bad5f1dac5b5\images"
    r"\itneckai-24225cda-eaf5-4e06-9dea-7f94ca302f73.png"
)
POSTERS = Path(
    r"C:\Users\MSHF\AppData\Roaming\Cursor\User\workspaceStorage"
    r"\f6c7f678f2ddaa781004bad5f1dac5b5\images"
)
NAVY = (2, 55, 107, 255)
WHITE = (255, 255, 255, 255)


def is_backdrop(r: int, g: int, b: int) -> bool:
    peak = max(r, g, b)
    # Neutral near-black only. The cyan rim and the dark pupils stay.
    return peak < 28 and peak - min(r, g, b) < 12


def knock_out(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    width, height = image.size
    pixels = image.load()
    seen = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= width or y >= height:
            continue
        index = y * width + x
        if seen[index]:
            continue
        r, g, b, _a = pixels[x, y]
        if not is_backdrop(r, g, b):
            continue
        seen[index] = 1
        pixels[x, y] = (r, g, b, 0)
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    return image


def contain(mascot: Image.Image, size: int, background: tuple[int, int, int, int]) -> Image.Image:
    pad = 0.06 if size <= 16 else 0.08 if size <= 32 else 0.12
    content = max(1, round(size * (1 - pad * 2)))
    fitted = mascot.copy()
    fitted.thumbnail((content, content), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), background)
    left = (size - fitted.width) // 2
    top = (size - fitted.height) // 2
    canvas.alpha_composite(fitted, (left, top))
    return canvas


def main() -> None:
    brand = ROOT / "public" / "brand"
    brand.mkdir(parents=True, exist_ok=True)
    mascot = knock_out(Image.open(SOURCE))
    mascot_path = brand / "mascot.png"
    mascot.save(mascot_path, "PNG")
    print(f"wrote {mascot_path} {mascot.size[0]}x{mascot.size[1]}")

    public = ROOT / "public"
    contain(mascot, 192, NAVY).save(public / "icon-192.png", "PNG")
    contain(mascot, 512, NAVY).save(public / "icon-512.png", "PNG")
    contain(mascot, 180, NAVY).save(public / "apple-touch-icon.png", "PNG")
    icon16 = contain(mascot, 16, NAVY)
    icon32 = contain(mascot, 32, NAVY)
    icon32.save(
        public / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32)],
        append_images=[icon16],
    )
    print("wrote favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png")

    education = public / "education"
    education.mkdir(parents=True, exist_ok=True)
    posters = {
        "IMG_7107-2517c8ef-505b-4210-bcd6-6d9bd00630ff.png": "types-of-ai.png",
        "IMG_7108-07ce8fa8-f0d3-47ea-bd5a-91a351a396ae.png": "machine-learning.png",
        "IMG_7109-ed0b5754-3e44-413f-b714-02e1ea82b3dd.png": "deep-learning.png",
        "IMG_7110-b7af124a-d9d0-4952-899b-fa1905c75d97.png": "algorithms.png",
        "IMG_7111-013a8e4a-9608-48d3-8db3-c23923e1b0d1.png": "generative-ai.png",
        "IMG_7112-74baf78d-e115-4f40-8313-b06076a07811.png": "ai-agents.png",
    }
    for source_name, dest_name in posters.items():
        image = Image.open(POSTERS / source_name).convert("RGB")
        dest = education / dest_name
        image.save(dest, "PNG", optimize=True)
        print(f"wrote {dest} {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    main()

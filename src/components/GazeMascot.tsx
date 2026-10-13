"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const IDLE_AFTER_MS = 2200;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const BLINK_MS = 170;

/** One close-and-open. 0 when the blink has not started or has finished. */
function blinkAmount(elapsed: number) {
  if (elapsed < 0 || elapsed > BLINK_MS) return 0;
  return Math.sin((elapsed / BLINK_MS) * Math.PI);
}

function blinkGap() {
  return 3000 + Math.random() * 4000;
}

const MOODS = ["playful", "happy", "play"] as const;
type Mood = (typeof MOODS)[number];

function nextMood(current: Mood): Mood {
  const pool = MOODS.filter((mood) => mood !== current);
  return pool[Math.floor(Math.random() * pool.length)];
}

function moodGap() {
  return 6000 + Math.random() * 3000;
}

function moodMotion(mood: Mood, now: number) {
  if (mood === "playful") return { y: Math.sin(now / 260) * 7, roll: 0 };
  if (mood === "happy") return { y: Math.sin(now / 980) * 2.5, roll: 0 };
  if (mood === "play") return { y: -Math.abs(Math.sin(now / 210)) * 9, roll: 0 };
  return { y: 0, roll: 0 };
}

const STAR_SPOTS = [
  { left: "6%", top: "6%", delay: "0s" },
  { left: "84%", top: "8%", delay: "0.35s" },
  { left: "4%", top: "72%", delay: "0.7s" },
  { left: "82%", top: "70%", delay: "1.05s" },
  { left: "46%", top: "2%", delay: "0.2s" },
];

const HAPPY_SPOTS = [
  { left: "8%", delay: "0s" },
  { left: "28%", delay: "0.6s" },
  { left: "68%", delay: "1.1s" },
  { left: "86%", delay: "1.7s" },
];

const PLAY_SPOTS = [
  { left: "4%", size: "12px", delay: "0s", color: "#f9690e" },
  { left: "82%", size: "14px", delay: "0.2s", color: "#f9690e" },
];

export function GazeMascot({
  className = "",
  maxDeg = 14,
  priority = false,
  decorative = false,
  track = true,
  moods = false,
}: {
  className?: string;
  maxDeg?: number;
  priority?: boolean;
  decorative?: boolean;
  track?: boolean;
  moods?: boolean;
}) {
  const moodRef = useRef<Mood>("playful");
  const moodsRef = useRef(moods);
  moodsRef.current = moods;
  const rootRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const moodPoseRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const lidLeftRef = useRef<HTMLSpanElement>(null);
  const lidRightRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const animRef = useRef({
    rx: 0,
    ry: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    lastMove: 0,
    last: 0,
    blinkStart: 0,
    nextBlink: 0,
    moodY: 0,
    moodRoll: 0,
    ready: false,
  });

  useEffect(() => {
    const root = rootRef.current;
    const face = faceRef.current;
    const shadow = shadowRef.current;
    const lidLeft = lidLeftRef.current;
    const lidRight = lidRightRef.current;
    if (!root || !face || !shadow || !lidLeft || !lidRight) return;

    const anim = animRef.current;
    if (!anim.ready) {
      anim.lastMove = performance.now();
      anim.last = anim.lastMove;
      anim.nextBlink = anim.lastMove + blinkGap();
      anim.ready = true;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reduce.matches;
    const stopMotion = () => {
      const currentFace = faceRef.current;
      const currentShadow = shadowRef.current;
      if (currentFace) currentFace.style.transform = "none";
      if (currentShadow) currentShadow.style.transform = "none";
    };

    let frame = 0;
    let running = true;

    const stiffness = 0.1;
    const damping = 0.76;

    const aim = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (clientX - cx) / (window.innerWidth * 0.38);
      const dy = (clientY - cy) / (window.innerHeight * 0.38);
      anim.targetY = clamp(dx, -1, 1) * maxDeg;
      anim.targetX = clamp(-dy, -1, 1) * maxDeg * 0.68;
      anim.lastMove = performance.now();
    };

    const onPointer = (event: PointerEvent) => {
      aim(event.clientX, event.clientY);
    };

    const tick = (now: number) => {
      if (!running) return;
      const currentFace = faceRef.current;
      const currentShadow = shadowRef.current;
      const currentLeft = lidLeftRef.current;
      const currentRight = lidRightRef.current;
      if (!currentFace || !currentShadow || !currentLeft || !currentRight) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const dt = clamp((now - anim.last) / 16.67, 0.25, 2.2);
      anim.last = now;

      if (track && !reduced) {
        const idle = now - anim.lastMove > IDLE_AFTER_MS;
        const drift = idle ? 1 : 0;
        const goalX = anim.targetX + Math.sin(now / 1700) * 0.45 * drift;
        const goalY = anim.targetY + Math.sin(now / 2300) * 0.6 * drift;

        anim.vx += (goalX - anim.rx) * stiffness * dt;
        anim.vy += (goalY - anim.ry) * stiffness * dt;
        anim.vx *= Math.pow(damping, dt);
        anim.vy *= Math.pow(damping, dt);
        anim.rx += anim.vx * dt;
        anim.ry += anim.vy * dt;

        const bob = idle ? Math.sin(now / 1400) * 0.8 : 0;
        const breathe = 1 + Math.sin(now / 1400) * 0.012;
        const roll = -anim.ry * 0.16;
        currentFace.style.transform = `translateY(${bob.toFixed(2)}px) rotateX(${anim.rx.toFixed(2)}deg) rotateY(${anim.ry.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg) scale(${breathe.toFixed(4)})`;
        currentShadow.style.transform = `translate(${(-anim.ry * 0.35).toFixed(2)}px, ${(2 + anim.rx * 0.15).toFixed(2)}px) scaleX(${(1 + Math.abs(anim.ry) / 90).toFixed(3)})`;
      }

      const moodPose = moodPoseRef.current;
      if (moodPose) {
        if (moodsRef.current && !reduced) {
          const desired = moodMotion(moodRef.current, now);
          const blend = Math.min(1, 0.06 * dt);
          anim.moodY += (desired.y - anim.moodY) * blend;
          anim.moodRoll += (desired.roll - anim.moodRoll) * blend;
          moodPose.style.transform = `translateY(${anim.moodY.toFixed(2)}px) rotateZ(${anim.moodRoll.toFixed(2)}deg)`;
        } else {
          moodPose.style.transform = "none";
        }
      }

      if (!anim.blinkStart && now >= anim.nextBlink) anim.blinkStart = now;
      const lid = anim.blinkStart ? blinkAmount(now - anim.blinkStart) : 0;
      const lidTransform = `scaleY(${lid.toFixed(3)})`;
      currentLeft.style.transform = lidTransform;
      currentRight.style.transform = lidTransform;
      if (anim.blinkStart && now - anim.blinkStart > BLINK_MS) {
        anim.blinkStart = 0;
        anim.nextBlink = now + blinkGap();
      }

      frame = requestAnimationFrame(tick);
    };

    if (track && !reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
    }
    frame = requestAnimationFrame(tick);

    const onReduce = () => {
      reduced = reduce.matches;
      if (reduced) {
        stopMotion();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerdown", onPointer);
      } else if (track) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });
      }
    };
    reduce.addEventListener("change", onReduce);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      if (track) {
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerdown", onPointer);
      }
      reduce.removeEventListener("change", onReduce);
    };
  }, [maxDeg, track]);

  useEffect(() => {
    if (!moods) return;
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        const mood = nextMood(moodRef.current);
        moodRef.current = mood;
        stage.dataset.mood = mood;
        schedule();
      }, moodGap());
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [moods]);

  return (
    <div
      ref={rootRef}
      className={`relative aspect-[682/445] [perspective:880px] ${className}`}
      aria-hidden={decorative ? true : undefined}
    >
      {moods && (
        <div ref={stageRef} className="mood-stage" data-mood="playful" aria-hidden="true">
          <div data-layer="playful">
            {STAR_SPOTS.map((star) => (
              <span
                key={star.left}
                className="mood-star"
                style={{ left: star.left, top: star.top, animationDelay: star.delay }}
              />
            ))}
          </div>
          <div data-layer="happy">
            {HAPPY_SPOTS.map((dot) => (
              <span
                key={dot.left}
                className="mood-rise"
                style={{ left: dot.left, animationDelay: dot.delay }}
              />
            ))}
          </div>
          <div data-layer="play">
            {PLAY_SPOTS.map((ball) => (
              <span
                key={ball.left}
                className="mood-ball"
                style={{
                  left: ball.left,
                  width: ball.size,
                  height: ball.size,
                  background: ball.color,
                  animationDelay: ball.delay,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={moodPoseRef} className="relative z-[1] h-full w-full">
        <div
          ref={shadowRef}
          className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-[8%] w-[34%] -translate-x-1/2 rounded-[50%] bg-[#02376b]/10 blur-md"
        />
        <div className="relative z-[1] h-full w-full [perspective:900px]">
          <div
            ref={faceRef}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
        <Image
          src="/brand/mascot.png"
          alt={decorative ? "" : "itneck.ai guide"}
          width={682}
          height={445}
          priority={priority}
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-contain"
        />
        <span className="pointer-events-none absolute left-[28.5%] top-[26.5%] h-[19.5%] w-[13.4%] overflow-hidden rounded-[50%]">
          <span
            ref={lidLeftRef}
            className="gaze-lid absolute inset-0 bg-[linear-gradient(180deg,#c5cecd_0%,#b4bebd_55%,#667372_100%)]"
          />
        </span>
        <span className="pointer-events-none absolute left-[57.7%] top-[26.4%] h-[19.6%] w-[13.5%] overflow-hidden rounded-[50%]">
          <span
            ref={lidRightRef}
            className="gaze-lid absolute inset-0 bg-[linear-gradient(180deg,#c5cecd_0%,#b4bebd_55%,#667372_100%)]"
          />
        </span>
          </div>
        </div>
      </div>
    </div>
  );
}

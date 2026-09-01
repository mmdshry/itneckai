"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      theme?: "auto" | "light" | "dark";
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function loadTurnstile(): Promise<TurnstileApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("no window"));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SRC}"]`,
    );
    const onReady = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile missing"));
    };
    if (existing) {
      if (window.turnstile) onReady();
      else existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
}

export type TurnstileFieldHandle = {
  reset: () => void;
};

export const TurnstileField = forwardRef<
  TurnstileFieldHandle,
  {
    siteKey: string;
    onToken: (token: string) => void;
    onLoadError?: () => void;
  }
>(function TurnstileField({ siteKey, onToken, onLoadError }, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onLoadErrorRef = useRef(onLoadError);
  onTokenRef.current = onToken;
  onLoadErrorRef.current = onLoadError;

  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current("");
      const id = widgetId.current;
      if (id && window.turnstile) window.turnstile.reset(id);
    },
  }));

  useEffect(() => {
    if (!siteKey) return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    loadTurnstile()
      .then((api) => {
        if (cancelled || widgetId.current) return;
        widgetId.current = api.render(host, {
          sitekey: siteKey,
          theme: "auto",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch(() => {
        if (!cancelled) onLoadErrorRef.current?.();
      });

    return () => {
      cancelled = true;
      const id = widgetId.current;
      widgetId.current = null;
      onTokenRef.current("");
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [siteKey]);

  return (
    <div
      ref={hostRef}
      className="min-h-[65px]"
      aria-label="Cloudflare verification"
    />
  );
});

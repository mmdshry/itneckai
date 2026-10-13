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
  ready?: (callback: () => void) => void;
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: (errorCode?: string) => void;
      "expired-callback"?: () => void;
      "timeout-callback"?: () => void;
      "unsupported-callback"?: () => void;
      theme?: "auto" | "light" | "dark";
    },
  ) => string;
  getResponse?: (widgetId: string) => string | undefined;
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
  getToken: () => string;
};

export const TurnstileField = forwardRef<
  TurnstileFieldHandle,
  {
    siteKey: string;
    onToken: (token: string) => void;
    onError?: (errorCode?: string) => void;
    onLoadError?: () => void;
  }
>(function TurnstileField({ siteKey, onToken, onError, onLoadError }, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const onLoadErrorRef = useRef(onLoadError);
  onTokenRef.current = onToken;
  onErrorRef.current = onError;
  onLoadErrorRef.current = onLoadError;

  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current("");
      const id = widgetId.current;
      if (id && window.turnstile) window.turnstile.reset(id);
    },
    getToken() {
      const id = widgetId.current;
      if (!id || !window.turnstile?.getResponse) return "";
      return window.turnstile.getResponse(id) ?? "";
    },
  }));

  useEffect(() => {
    if (!siteKey) return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let localId: string | null = null;
    let poll = 0;

    const fail = (errorCode?: string) => {
      if (cancelled) return;
      onTokenRef.current("");
      onErrorRef.current?.(errorCode);
    };

    // Wait one tick so React Strict Mode can cancel the first mount before
    // Turnstile starts a challenge it will immediately tear down.
    const start = window.setTimeout(() => {
      loadTurnstile()
        .then((api) => {
          if (cancelled || !host.isConnected || localId) return;
          const render = () => {
            if (cancelled || localId || !host.isConnected) return;
            localId = api.render(host, {
              sitekey: siteKey,
              theme: "auto",
              callback: (token) => {
                if (!cancelled) onTokenRef.current(token);
              },
              "expired-callback": () => {
                if (!cancelled) onTokenRef.current("");
              },
              "timeout-callback": () => fail(),
              "unsupported-callback": () => fail(),
              "error-callback": (errorCode) => fail(errorCode),
            });
            widgetId.current = localId;
            const existing = api.getResponse?.(localId);
            if (existing && !cancelled) onTokenRef.current(existing);
            poll = window.setInterval(() => {
              if (cancelled || !localId) return;
              const token = window.turnstile?.getResponse?.(localId);
              if (!token) return;
              onTokenRef.current(token);
              window.clearInterval(poll);
            }, 400);
          };
          if (typeof api.ready === "function") api.ready(render);
          else render();
        })
        .catch(() => {
          if (!cancelled) onLoadErrorRef.current?.();
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(poll);
      const id = localId ?? widgetId.current;
      if (widgetId.current === id) widgetId.current = null;
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

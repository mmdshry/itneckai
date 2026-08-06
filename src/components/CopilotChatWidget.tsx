"use client";

import {useCallback, useEffect, useId, useRef, useState} from "react";
import {AgentIcon, CloseIcon} from "@/components/icons";

const COPILOT_SRC =
    "https://copilotstudio.microsoft.com/environments/Default-c4e3e0c2-a607-4731-853e-f406ad3fc598/bots/cr2cd_ITNeckAssistant/webchat?__version__=2";

const IDLE_WARMUP_MS = 2000;

export function CopilotChatWidget() {
    const panelId = useId();
    const [open, setOpen] = useState(false);
    const [booted, setBooted] = useState(false);
    const [frameReady, setFrameReady] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    // Warm-start the heavy Copilot shell after the page is idle so the first
    // open is often already loaded; keep the iframe mounted thereafter.
    useEffect(() => {
        let cancelled = false;
        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const boot = () => {
            if (!cancelled) setBooted(true);
        };

        const ric = window.requestIdleCallback;
        if (typeof ric === "function") {
            idleId = ric(boot, {timeout: IDLE_WARMUP_MS});
        } else {
            timeoutId = setTimeout(boot, IDLE_WARMUP_MS);
        }

        return () => {
            cancelled = true;
            if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
    }, []);

    const openChat = useCallback(() => {
        setBooted(true);
        setOpen(true);
    }, []);

    const closeChat = useCallback(() => {
        setOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeChat();
        };
        document.addEventListener("keydown", onKeyDown);
        requestAnimationFrame(() => closeRef.current?.focus());

        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeChat]);

    const showPanel = booted;
    const panelVisible = open;

    return (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
            {showPanel && (
                <div
                    id={panelId}
                    role="dialog"
                    aria-modal="false"
                    aria-label="Chat"
                    aria-hidden={!panelVisible}
                    className={`flex h-[min(560px,calc(100dvh-6.5rem))] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-md border border-line bg-page shadow-lg transition-opacity ${
                        panelVisible
                            ? "opacity-100"
                            : "pointer-events-none invisible absolute opacity-0"
                    }`}
                >
                    <div
                        className="flex items-center justify-between gap-3 border-b border-line bg-surface px-3 py-2.5">
                        <p className="font-display text-sm font-semibold text-navy">
                            Chat
                        </p>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={closeChat}
                            tabIndex={panelVisible ? 0 : -1}
                            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-line text-navy transition-colors hover:border-navy/30"
                            aria-label="Close chat"
                        >
                            <CloseIcon width={18} height={18}/>
                        </button>
                    </div>
                    <div className="relative min-h-0 flex-1 bg-page">
                        {!frameReady && (
                            <div
                                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-page px-6"
                                aria-live="polite"
                            >
                <span
                    className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-amber"
                    aria-hidden="true"
                />
                                <p className="text-center text-sm font-medium text-navy">
                                    Starting assistant…
                                </p>
                                <p className="text-center text-xs text-graphite">
                                    First load can take a moment
                                </p>
                            </div>
                        )}
                        <iframe
                            src={COPILOT_SRC}
                            title="IT Neck Assistant"
                            className="h-full w-full border-0"
                            allow="clipboard-write; unload"
                            referrerPolicy="strict-origin-when-cross-origin"
                            onLoad={() => setFrameReady(true)}
                        />
                    </div>
                </div>
            )}

            <button
                ref={toggleRef}
                type="button"
                onClick={open ? closeChat : openChat}
                aria-expanded={open}
                aria-controls={panelId}
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-amber px-4 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
            >
                {open ? (
                    <>
                        <CloseIcon width={18} height={18}/>
                        <span>Close</span>
                    </>
                ) : (
                    <>
                        <AgentIcon width={18} height={18}/>
                        <span>Chat with us</span>
                    </>
                )}
            </button>
        </div>
    );
}

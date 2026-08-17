"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CopilotChatWidget } from "@/components/CopilotChatWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function AiChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const busywork = pathname.toLowerCase().startsWith("/endyourbusywork");

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      {!busywork && <Footer />}
      {!busywork && <CopilotChatWidget />}
    </>
  );
}

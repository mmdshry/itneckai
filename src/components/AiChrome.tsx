"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CopilotChatWidget } from "@/components/CopilotChatWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function AiChrome({
  children,
  marketingOrigin,
}: {
  children: ReactNode;
  marketingOrigin?: string;
}) {
  const pathname = usePathname();
  const busywork = pathname.toLowerCase().startsWith("/endyourbusywork");
  const home = pathname === "/";

  return (
    <>
      <Header marketingOrigin={marketingOrigin} />
      <main id="main">{children}</main>
      {!busywork && !home && <Footer marketingOrigin={marketingOrigin} />}
      {!busywork && <CopilotChatWidget />}
    </>
  );
}

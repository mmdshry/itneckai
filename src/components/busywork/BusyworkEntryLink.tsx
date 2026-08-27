"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SiteLink } from "@/components/SiteLink";
import { withOrigin } from "@/lib/hosts";

export function BusyworkEntryLink({
  from,
  className,
  children,
  origin,
}: {
  from: string;
  className?: string;
  children: ReactNode;
  origin?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const href = withOrigin(`/EndYourBusywork?from=${from}`, origin);

  return (
    <SiteLink
      href={href}
      className={className}
      onClick={(event) => {
        if (origin) return;
        if (pathname.toLowerCase() !== "/endyourbusywork") return;
        event.preventDefault();
        router.replace(
          `/EndYourBusywork?from=${from}&start=value&t=${Date.now()}`,
        );
      }}
    >
      {children}
    </SiteLink>
  );
}

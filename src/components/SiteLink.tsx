import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { isAbsoluteHttpUrl } from "@/lib/hosts";

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

export function SiteLink({ href, children, ...props }: SiteLinkProps) {
  if (isAbsoluteHttpUrl(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

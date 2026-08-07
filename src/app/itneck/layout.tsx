import type { Metadata } from "next";
import { ItneckHeader } from "@/components/itneck/Header";
import { ItneckFooter } from "@/components/itneck/Footer";
import { TechTalk } from "@/components/itneck/TechTalk";
import { itneckSite } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: {
    default: "Managed IT Services - Managed IT for Business | ITneck",
    template: "%s | ITneck",
  },
  description: itneckSite.description,
};

export default function ItneckLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ItneckHeader />
      <main id="main">{children}</main>
      <TechTalk />
      <ItneckFooter />
    </>
  );
}

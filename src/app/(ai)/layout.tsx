import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {CopilotChatWidget} from "@/components/CopilotChatWidget";
import {JsonLd} from "@/components/JsonLd";
import {organizationSchema} from "@/lib/schema";

export default function AiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CopilotChatWidget />
      <JsonLd data={organizationSchema} />
    </>
  );
}

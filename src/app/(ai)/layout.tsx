import {AiChrome} from "@/components/AiChrome";
import {JsonLd} from "@/components/JsonLd";
import {organizationSchema} from "@/lib/schema";

export default function AiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AiChrome>{children}</AiChrome>
      <JsonLd data={organizationSchema} />
    </>
  );
}

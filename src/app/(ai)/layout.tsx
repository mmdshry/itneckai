import { headers } from "next/headers";
import {AiChrome} from "@/components/AiChrome";
import {JsonLd} from "@/components/JsonLd";
import { marketingOriginForHost } from "@/lib/hosts";
import {organizationSchema} from "@/lib/schema";

export default async function AiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host");
  const marketingOrigin = marketingOriginForHost(host);
  return (
    <>
      <AiChrome marketingOrigin={marketingOrigin}>{children}</AiChrome>
      <JsonLd data={organizationSchema} />
    </>
  );
}

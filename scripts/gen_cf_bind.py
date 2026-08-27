#!/usr/bin/env python3
"""Generate a Cloudflare-ready BIND import from the live itneck.ai cPanel zone."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ZONE = "itneck.ai."
OUT = Path("/root/cloudflare/itneck.ai.bind")
README = Path("/root/cloudflare/README.txt")

PROXIED_HOSTS = {
    "itneck.ai.",
    "www.itneck.ai.",
}

SKIP_TYPES = {":RAW", "SOA", "NS"}


def in_zone(name: str) -> bool:
    n = name.rstrip(".")
    return n == "itneck.ai" or n.endswith(".itneck.ai")


def fmt_txt(val: str) -> str:
    if val.startswith('"'):
        return val
    return json.dumps(val)


def rdata_of(r: dict) -> str | None:
    t = r.get("type")
    if t == "A" or t == "AAAA":
        return r.get("address")
    if t == "MX":
        exch = r.get("exchange") or ""
        if exch and not exch.endswith("."):
            exch += "."
        return f"{r.get('preference', '0')} {exch}"
    if t == "CNAME":
        c = r.get("cname") or ""
        if c and not c.endswith("."):
            c += "."
        return c
    if t == "TXT":
        tx = r.get("txtdata") or r.get("record") or ""
        return fmt_txt(tx) if tx else None
    if t == "SRV":
        target = r.get("target") or r.get("record") or ""
        if target and not str(target).endswith("."):
            target = str(target) + "."
        prio = r.get("priority", r.get("preference", "0"))
        weight = r.get("weight", "0")
        port = r.get("port", "0")
        return f"{prio} {weight} {port} {target}"
    return r.get("record") or r.get("address") or r.get("cname")


def main() -> None:
    out = subprocess.check_output(
        ["whmapi1", "--output=json", "dumpzone", "domain=itneck.ai"],
        text=True,
    )
    recs = json.loads(out)["data"]["zone"][0]["record"]
    seen: set[tuple[str, str, str]] = set()
    lines = [
        "; BIND import for Cloudflare zone itneck.ai",
        "; Cloudflare assigns SOA/NS. After import:",
        ";   Proxied (orange): itneck.ai A/AAAA, www.itneck.ai",
        ";   DNS-only (grey): mail, ftp, cpanel, webmail, server, panel, kelarpacific, all SRV/TXT/MX",
        "$TTL 14400",
        "",
    ]
    for r in recs:
        t = r.get("type")
        name = r.get("name") or ""
        if t in SKIP_TYPES or not t or not in_zone(name):
            continue
        rdata = rdata_of(r)
        if not rdata:
            continue
        key = (name, t, str(rdata))
        if key in seen:
            continue
        seen.add(key)
        ttl = r.get("ttl") or 14400
        proxy = (
            "PROXIED"
            if name in PROXIED_HOSTS and t in {"A", "AAAA", "CNAME"}
            else "DNS_ONLY"
        )
        lines.append(f"{name} {ttl} IN {t} {rdata}  ; {proxy}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    README.write_text(
        """Cloudflare DNS cutover for itneck.ai
====================================

Origin is ready:
- Apache already has mod_remoteip + Cloudflare IP list
  (/etc/apache2/conf.d/includes/cloudflare.conf)
- Let's Encrypt cert covers itneck.ai and www.itneck.ai (Full Strict)
- MX now points at mail.itneck.ai (A/AAAA to 15.204.81.140), NOT the proxied apex
- /.well-known is no longer proxied to Next.js (AutoSSL DCV)

Dashboard steps (needs a Cloudflare account; no API token was on this server):
1. Add site itneck.ai (Free plan is enough).
2. DNS -> Import itneck.ai.bind from this directory.
3. Set proxy status:
     Orange cloud:  itneck.ai  (A and AAAA)
                    www        (CNAME or A)
     Grey cloud:    everything else, especially mail, ftp, cpanel, webmail,
                    autodiscover, server, panel, kelarpacific, ns1, ns2
4. SSL/TLS -> Overview: Full (strict)
   Edge Certificates: always HTTPS on; HTTP/3 optional
5. Copy the two Cloudflare nameservers.
6. At the .ai registrar, replace ns1.itneck.ai / ns2.itneck.ai with those NS.
7. Wait for NS to propagate. Confirm:
     dig NS itneck.ai
     curl -I https://itneck.ai   (cf-ray header present)
     check-host.net HTTP from ir1-ir8
8. After Iran + rest-of-world look good, optionally restrict origin 80/443
   to Cloudflare IP ranges only. Do NOT do this before NS cutover.

Do not orange-cloud mail or MX targets. Do not proxy panel.itneck.ai.
""",
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({len(seen)} records)")
    print(f"wrote {README}")


if __name__ == "__main__":
    main()

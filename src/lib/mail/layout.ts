import { site } from "@/lib/site";

export const MAIL = {
  navy: "#02376b",
  orange: "#f9690e",
  graphite: "#5c6678",
  muted: "#8a94a6",
  line: "rgba(2,55,107,0.12)",
  white: "#ffffff",
} as const;

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function mailHeading(text: string): string {
  return `<h2 style="margin:28px 0 10px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${MAIL.orange};">${escapeHtml(text)}</h2>`;
}

export function mailList(items: string[]): string {
  if (items.length === 0) {
    return `<p style="margin:0;color:${MAIL.muted};">None captured yet.</p>`;
  }
  return `<ul style="margin:0;padding-left:18px;color:${MAIL.navy};">${items
    .map(
      (item) =>
        `<li style="margin:0 0 8px;line-height:1.5;">${escapeHtml(item)}</li>`,
    )
    .join("")}</ul>`;
}

export function mailButton(href: string, label: string): string {
  return `<p style="margin:24px 0 0;">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:${MAIL.orange};color:${MAIL.white};text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:6px;">${escapeHtml(label)}</a>
  </p>`;
}

export function mailLayout(opts: {
  eyebrow?: string;
  title: string;
  body: string;
  footer?: string;
  origin?: string;
}): string {
  const origin = opts.origin?.replace(/\/$/, "");
  const footer = opts.footer ?? "ai.neck · San Diego, CA";
  const logoHref = origin ?? site.url;
  const logoSrc = `${site.url}/brand/ai-neck-logo.png`;
  const header =
    opts.eyebrow == null
      ? `<a href="${escapeHtml(logoHref)}" style="text-decoration:none;">
              <img src="${escapeHtml(logoSrc)}" alt="ai.neck" width="196" height="44" style="display:block;height:44px;width:auto;border:0;" />
            </a>`
      : `<p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${MAIL.orange};">${escapeHtml(opts.eyebrow)}</p>`;
  const originLine = origin
    ? `<p style="margin:0 0 8px;font-size:12px;">
                <a href="${escapeHtml(origin)}" style="color:${MAIL.muted};text-decoration:underline;">${escapeHtml(origin)}</a>
              </p>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:${MAIL.white};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:${MAIL.navy};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MAIL.white};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:28px;border-bottom:1px solid ${MAIL.line};">
              ${header}
            </td>
          </tr>
          <tr>
            <td style="padding-top:28px;">
              <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;font-weight:700;color:${MAIL.navy};">${escapeHtml(opts.title)}</h1>
              <div style="font-size:15px;line-height:1.6;color:${MAIL.graphite};">
                ${opts.body}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top:36px;border-top:1px solid ${MAIL.line};">
              ${originLine}
              <p style="margin:0;font-size:12px;color:${MAIL.muted};">${escapeHtml(footer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

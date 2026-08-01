import { site } from "@/lib/site";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";

/**
 * Single source of truth for NAP (name/address/phone) info.
 * Rendered identically on the footer, About page, and Contact page —
 * consistency matters for local SEO.
 */
export function NapBlock({ className = "" }: { className?: string }) {
  return (
    <address className={`not-italic ${className}`}>
      <ul className="space-y-3 text-sm text-graphite">
        <li className="flex items-start gap-3">
          <PinIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Postal Address</span>
            {site.address}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <ClockIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Work Hours</span>
            {site.hours[0]}
            <br />
            {site.hours[1]}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <PhoneIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Phone</span>
            <a
              href={`tel:${site.phoneIntl}`}
              className="underline decoration-line underline-offset-4 hover:text-cyan"
            >
              {site.phone}
            </a>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <MailIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Email</span>
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-line underline-offset-4 hover:text-cyan"
            >
              {site.email}
            </a>
          </span>
        </li>
      </ul>
    </address>
  );
}

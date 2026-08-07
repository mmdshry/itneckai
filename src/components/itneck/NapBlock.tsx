import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { itneckSite } from "@/lib/itneck/site";

export function ItneckNapBlock({ className = "" }: { className?: string }) {
  return (
    <address className={`not-italic ${className}`}>
      <ul className="space-y-3 text-sm text-graphite">
        <li className="flex items-start gap-3">
          <PinIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Postal Address</span>
            {itneckSite.address}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <ClockIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Work Hours</span>
            {itneckSite.hours[0]}
            <br />
            {itneckSite.hours[1]}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <PhoneIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Phone</span>
            <a
              href={`tel:${itneckSite.phoneIntl}`}
              className="underline decoration-line underline-offset-4 hover:text-cyan"
            >
              {itneckSite.phone}
            </a>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <MailIcon className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="block font-medium text-navy">Email</span>
            <a
              href={`mailto:${itneckSite.email}`}
              className="underline decoration-line underline-offset-4 hover:text-cyan"
            >
              {itneckSite.email}
            </a>
          </span>
        </li>
      </ul>
    </address>
  );
}

import { GhostCta, PrimaryCta } from "@/components/ui";
import { itneckContactHref, type SolutionCta } from "@/lib/itneck/cta";

export function DualCtas({
  primary,
  secondary,
  onDark = false,
}: {
  primary: SolutionCta;
  secondary: SolutionCta;
  onDark?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <PrimaryCta href={itneckContactHref(primary.query)}>
        {primary.label}
      </PrimaryCta>
      <GhostCta
        href={itneckContactHref(secondary.query)}
        variant={onDark ? "onDark" : "default"}
      >
        {secondary.label}
      </GhostCta>
    </div>
  );
}

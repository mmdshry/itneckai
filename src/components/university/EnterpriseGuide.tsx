import Image from "next/image";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import {
  AmplifyIcon,
  ArrowRightIcon,
  BoundaryIcon,
  CheckIcon,
  ClockIcon,
  FileIcon,
  HireIcon,
  IdeasIcon,
  M365Icon,
} from "@/components/icons";
import { ChapterNav } from "@/components/university/ChapterNav";
import { Eyebrow, Section } from "@/components/ui";
import {
  guidePdf,
  guideTools,
  hookCards,
  matrixColumns,
  matrixRows,
  mediaLessons,
  priceNote,
  roiSteps,
  securityNote,
  tagline,
  type MediaLesson,
} from "@/lib/education/enterprise-guide";

const toolIcons = {
  chatgpt: AmplifyIcon,
  copilot: M365Icon,
  claude: IdeasIcon,
} as const;

const stepIcons = [HireIcon, ClockIcon, AmplifyIcon] as const;

function ToolMark({ id }: { id: keyof typeof toolIcons }) {
  const Icon = toolIcons[id];
  return (
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#02376b] text-white">
      <Icon width={28} height={28} />
    </span>
  );
}

export function EnterpriseGuide() {
  return (
    <>
      <ChapterNav />

      <Section id="hook" className="scroll-mt-36">
        <Eyebrow>Microsoft + AI</Eyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          They look the same.{" "}
          <span className="text-cyan">They solve different problems.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          <span className="font-medium text-navy">
            Buy the workflow, not the logo.
          </span>
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {hookCards.map((card) => (
            <li key={card.id}>
              <a
                href={`#${card.id}`}
                className="flex h-full flex-col rounded-lg border border-line bg-page p-6 transition-colors hover:border-navy/30 hover:bg-surface"
              >
                <ToolMark id={card.id} />
                <p className="mt-6 font-display text-2xl font-semibold text-navy">
                  {card.name}
                </p>
                <p className="mt-1 text-sm font-medium text-graphite">
                  {card.detail}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {guideTools.map((tool) => (
        <Section
          key={tool.id}
          id={tool.id}
          className="scroll-mt-36 pt-0"
          aria-labelledby={`${tool.id}-title`}
        >
          <article className="rounded-lg border border-line bg-page p-6 md:p-8">
            <div className="flex items-center gap-4">
              <ToolMark id={tool.id} />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {tool.kicker}
                </p>
                <h2
                  id={`${tool.id}-title`}
                  className="mt-1 font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl"
                >
                  {tool.title}
                </h2>
              </div>
            </div>
            <p className="mt-6 inline-flex items-center rounded-full bg-amber px-4 py-2 text-sm font-semibold text-white">
              {tool.badge}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {tool.points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-4 text-base font-medium text-navy"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/15 text-cyan">
                    <CheckIcon />
                  </span>
                  {point}
                </li>
              ))}
              <li className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-4 text-base font-medium text-navy">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber text-white">
                  <span className="text-sm font-semibold">$</span>
                </span>
                <span>
                  <span className="text-cyan">Pricing: </span>
                  {tool.price}
                </span>
              </li>
            </ul>
          </article>
        </Section>
      ))}

      <Section id="matrix" className="scroll-mt-36 pt-0" aria-labelledby="matrix-title">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-amber text-white">
            <BoundaryIcon width={28} height={28} />
          </span>
          <h2
            id="matrix-title"
            className="font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl"
          >
            The <span className="text-cyan">ITneck</span> Matrix
          </h2>
        </div>
        <div className="mt-8 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              ChatGPT Enterprise, Microsoft Copilot, and Claude Team compared
            </caption>
            <thead>
              <tr className="bg-[#02376b] text-white">
                <th scope="col" className="px-4 py-4 font-semibold text-amber">
                  <span className="sr-only">Feature</span>
                </th>
                {matrixColumns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-4 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th
                    scope="row"
                    className="bg-surface px-4 py-4 font-medium text-graphite"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell) => (
                    <td
                      key={cell}
                      className={`px-4 py-4 text-navy ${
                        "emphasize" in row && row.emphasize
                          ? "font-semibold text-cyan"
                          : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-graphite">{priceNote}</p>
        <div className="mt-6 flex items-start gap-4 rounded-lg border border-amber bg-amber/10 p-5">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-page text-cyan">
            <BoundaryIcon width={26} height={26} />
          </span>
          <p className="text-base font-semibold leading-snug text-navy">
            {securityNote.lead}{" "}
            <span className="font-display text-2xl text-cyan">
              {securityNote.answer}
            </span>
            <span className="mt-1 block text-sm font-medium text-graphite">
              {securityNote.detail}
            </span>
          </p>
        </div>
      </Section>

      <Section id="roi" className="scroll-mt-36 pt-0" aria-labelledby="roi-title">
        <div className="rounded-lg border-2 border-amber bg-amber/10 px-6 py-8 text-center">
          <h2
            id="roi-title"
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan"
          >
            ROI &amp; Shelfware Math
          </h2>
          <p className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-navy md:text-4xl">
            <span className="text-cyan">(</span>
            Hours Saved × Hourly Rate × Adoption
            <span className="text-cyan">)</span>
            <span className="mt-3 block">
              <span className="inline-block rounded-md bg-[#02376b] px-3 py-1 text-white">
                − License Cost
              </span>
            </span>
          </p>
        </div>
        <div className="mt-6 rounded-lg border border-line bg-page px-6 py-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            <span className="text-cyan">Pilot with 10-15 power users,</span>{" "}
            measure, then scale.
          </p>
          <ol className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {roiSteps.map((step, index) => {
              const Icon = stepIcons[index];
              const last = index === roiSteps.length - 1;
              return (
                <li key={step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-lg text-white ${
                        last ? "bg-amber" : "bg-[#02376b]"
                      }`}
                    >
                      <Icon width={26} height={26} />
                    </span>
                    <span className="text-sm font-semibold text-navy">{step}</span>
                  </div>
                  {index < roiSteps.length - 1 ? (
                    <ArrowRightIcon className="text-cyan" aria-hidden />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      <Section id="verdict" className="scroll-mt-36 pt-0" aria-labelledby="verdict-title">
        <div className="rounded-lg border border-line bg-page px-6 py-10 text-center">
          <Image
            src="/brand/mascot.png"
            alt=""
            width={220}
            height={220}
            className="mx-auto h-36 w-36 object-contain"
          />
          <h2
            id="verdict-title"
            className="mt-6 font-display text-3xl font-semibold tracking-tight text-navy md:text-5xl"
          >
            The AI Enterprise Guide
          </h2>
          <p className="mt-2 text-lg font-semibold text-cyan">
            by ITneck University
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={guidePdf.href}
              download={guidePdf.filename}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <FileIcon width={18} height={18} />
              Download the guide
            </a>
            <BusyworkEntryLink
              from="university-guide"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-navy/20 px-6 text-base font-medium text-navy transition-colors hover:border-navy/40 hover:bg-surface"
            >
              End Your Busy Work
            </BusyworkEntryLink>
          </div>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-display text-2xl font-semibold tracking-tight text-navy md:text-4xl">
            {tagline.map((word, index) => (
              <span key={word} className={index === 1 ? "text-cyan" : undefined}>
                {word}
              </span>
            ))}
          </p>
        </div>
      </Section>
    </>
  );
}

function MediaPlayer({ lesson }: { lesson: MediaLesson }) {
  if (lesson.kind === "pdf") {
    return (
      <a
        href={lesson.href}
        download={lesson.downloadName}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        <FileIcon width={18} height={18} />
        Download PDF
      </a>
    );
  }

  if (lesson.kind === "audio") {
    return (
      <audio controls preload="none" className="w-full" src={lesson.href}>
        <a href={lesson.href}>Download audio</a>
      </audio>
    );
  }

  return (
    <video
      controls
      preload="none"
      playsInline
      className={
        lesson.portrait
          ? "mx-auto max-h-[32rem] w-auto max-w-full rounded-md bg-surface"
          : "aspect-video w-full rounded-md bg-surface"
      }
      src={lesson.href}
    >
      <a href={lesson.href}>Download video</a>
    </video>
  );
}

export function MediaLessons() {
  return (
    <Section className="pt-0" aria-labelledby="lessons-title">
      <Eyebrow>Lessons</Eyebrow>
      <h2
        id="lessons-title"
        className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl"
      >
        Watch, listen, and keep the guide.
      </h2>
      <ul className="mt-10 grid gap-6">
        {mediaLessons.map((lesson) => (
          <li
            key={lesson.id}
            className="rounded-lg border border-line bg-page p-5 md:p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
              {lesson.kind} · {lesson.length}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-navy">
              {lesson.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
              {lesson.summary}
            </p>
            <div className="mt-5">
              <MediaPlayer lesson={lesson} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

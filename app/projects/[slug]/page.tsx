import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/data/projects";
import ImageBlock from "@/components/projects/ImageBlock";
import ProjectGallery from "@/components/projects/ProjectGallery";
import PlayableVideo from "@/components/projects/PlayableVideo";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import Sparkles from "@/components/ui/Sparkles";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import { TOOL_LOGOS } from "@/components/ui/ToolLogos";
import CTA from "@/components/ui/CTA";
import ScrollFX from "@/components/effects/ScrollFX";

/** Projects with a bespoke route of their own, those static segments
 *  win over this dynamic one, so they must not be generated here too. */
const BESPOKE = new Set([
  "cms-editor-revamp",
  "myntra-crm",
  "product-animations",
  "other-animations",
  "rain-mazha",
]);

export function generateStaticParams() {
  return PROJECTS.filter((p) => !BESPOKE.has(p.slug) && !p.externalUrl).map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} - ${p.client}`, description: p.summary };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  // Externally-hosted projects have no page here, the list links straight out.
  if (!project || project.externalUrl) notFound();

  const internal = PROJECTS.filter((p) => !p.externalUrl);
  const idx = internal.findIndex((p) => p.slug === project.slug);
  const next = internal[(idx + 1) % internal.length];

  return (
    <article className="px-5 pt-32">
      <ScrollFX />
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <header className="mb-14">
          <div className="mb-5 flex flex-wrap gap-2">
            {project.categories.map((c) => {
              const CatIcon = CATEGORY_ICONS[c];
              return (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/70"
                  style={{ background: "var(--brand-sheen)" }}
                >
                  {CatIcon ? <CatIcon size={13} /> : <Sparkles size={13} />}
                  {c}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <BlurReveal
              as="h1"
              text={project.title}
              className="font-display max-w-3xl text-[clamp(34px,6vw,64px)] leading-[1.05] text-white"
            />
            {project.prototypeUrl && (
              <CTA
                label={project.prototypeLabel ?? "View Prototype"}
                href={project.prototypeUrl}
                external
                size="md"
              />
            )}
          </div>

          {/* Meta row */}
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 text-sm sm:grid-cols-4">
            <Meta term="Client" value={project.client} />
            <Meta term="Role" value={project.role} />
            <Meta term="When" value={project.period} />
            <div>
              <dt className="text-white/35">Tools</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {project.tools.map((t) => {
                  const ToolLogo = TOOL_LOGOS[t];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 py-1 pl-1 pr-3 text-[13px] text-white/80"
                      style={{ background: "var(--brand-sheen)" }}
                    >
                      {ToolLogo && (
                        <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
                          <ToolLogo size={20} />
                        </span>
                      )}
                      {t}
                    </span>
                  );
                })}
              </dd>
            </div>
          </dl>

          {project.deliverables && project.deliverables.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.deliverables.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/60"
                  style={{ background: "var(--brand-sheen-soft)" }}
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Intro */}
        <div className="mb-16 max-w-3xl space-y-5 text-[18px] leading-relaxed text-white/70">
          {project.intro.map((para, i) => (
            <p key={i} data-reveal>
              {para}
            </p>
          ))}
        </div>

        {/* Case-study beats (Challenge / Approach / Outcome, etc.) */}
        {project.caseSections && project.caseSections.length > 0 && (
          <div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {project.caseSections.map((s) => (
              <div key={s.label} data-reveal className="border-t border-white/10 pt-5">
                <div
                  className="mb-3 text-[12px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--brand-purple)" }}
                >
                  {s.label}
                </div>
                <h3 className="font-display mb-3 text-[22px] text-white">{s.heading}</h3>
                <p className="text-[15px] leading-relaxed text-white/45">{s.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Gallery, rich lightboxed masonry when `gallery` is set, else the simple block grid */}
        {project.gallery && project.gallery.length > 0 ? (
          <ProjectGallery images={project.gallery} title={project.title} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {project.blocks.map((b, i) => (
              <div key={i} data-reveal className={b.span === "full" ? "md:col-span-2" : ""}>
                <ImageBlock
                  src={b.src}
                  caption={b.caption}
                  ratio={b.ratio ?? (b.span === "full" ? 16 / 8 : 4 / 3)}
                  priority={i === 0}
                  sizes={
                    b.span === "full"
                      ? "(max-width: 900px) 100vw, 1000px"
                      : "(max-width: 768px) 100vw, 500px"
                  }
                />
              </div>
            ))}
          </div>
        )}

        {project.video && (
          <div className="mt-8">
            <PlayableVideo
              src={project.video.src}
              poster={project.video.poster}
              caption={project.video.caption}
            />
          </div>
        )}

        {project.youtube && (
          <div className="mt-8">
            <div
              className="overflow-hidden rounded-[22px] border border-white/10"
              style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}
            >
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${project.youtube.id}`}
                  title={`${project.title}, YouTube video player`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <CTA
                label={project.youtube.label ?? "Watch on YouTube"}
                href={`https://youtu.be/${project.youtube.id}`}
                external
                size="md"
              />
            </div>
          </div>
        )}
      </div>

      <FooterBlob
        label="Check out Other Projects !"
        href={`/projects/${next.slug}`}
      />

      <div className="pb-16 text-center">
        <Link href="/projects" className="text-sm text-white/40 hover:text-white/70">
          ← All projects
        </Link>
      </div>
    </article>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-white/35">{term}</dt>
      <dd className="mt-1 text-white/80">{value}</dd>
    </div>
  );
}

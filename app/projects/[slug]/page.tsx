import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/data/projects";
import ImageBlock from "@/components/projects/ImageBlock";
import Reveal from "@/components/ui/Reveal";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import Sparkles from "@/components/ui/Sparkles";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import CTA from "@/components/ui/CTA";

/** Projects with a bespoke route of their own — those static segments
 *  win over this dynamic one, so they must not be generated here too. */
const BESPOKE = new Set(["cms-editor-revamp"]);

export function generateStaticParams() {
  return PROJECTS.filter((p) => !BESPOKE.has(p.slug)).map((p) => ({
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
  return { title: `${p.title} — ${p.client}`, description: p.summary };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <article className="px-5 pt-32">
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
              <CTA label="View Prototype" href={project.prototypeUrl} external size="md" />
            )}
          </div>

          {/* Meta row */}
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 text-sm sm:grid-cols-4">
            <Meta term="Client" value={project.client} />
            <Meta term="Role" value={project.role} />
            <Meta term="When" value={project.period} />
            <Meta term="Tools" value={project.tools.join(", ")} />
          </dl>
        </header>

        {/* Intro */}
        <div className="mb-16 max-w-3xl space-y-5 text-[18px] leading-relaxed text-white/70">
          {project.intro.map((para, i) => (
            <Reveal key={i} delay={i * 60}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {project.blocks.map((b, i) => (
            <Reveal
              key={i}
              delay={(i % 2) * 80}
              className={b.span === "full" ? "md:col-span-2" : ""}
            >
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
            </Reveal>
          ))}
        </div>
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

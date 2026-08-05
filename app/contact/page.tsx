import type { Metadata } from "next";
import AxdBlob from "@/components/blob/AxdBlob";
import SocialAvatars from "@/components/ui/SocialAvatars";
import BlurReveal from "@/components/ui/BlurReveal";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Akshad Prashanth.",
};

const links = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "LinkedIn", value: "in/akshadprashanth", href: SITE.linkedin },
  { label: "Instagram", value: `@${SITE.instagramHandle}`, href: SITE.instagram },
];

export default function ContactPage() {
  return (
    <section className="mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
      <AxdBlob size={200} />
      <BlurReveal
        as="h1"
        text="Let's talk."
        className="font-display mt-4 text-[clamp(30px,5vw,52px)] text-white"
      />
      <Reveal>
        <p className="mt-4 max-w-md text-white/55">
          Hiring, collaborating, or just curious about the work, the fastest way
          to reach me is below. Based in {SITE.operatedFrom}.
        </p>
      </Reveal>

      <div className="mt-10">
        <SocialAvatars />
      </div>

      <ul className="mt-12 w-full max-w-md space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/12 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30"
              style={{ background: "var(--brand-sheen)" }}
            >
              <span className="text-sm uppercase tracking-wide text-white/40">
                {l.label}
              </span>
              <span className="text-white/85">{l.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { Metadata } from "next";
import ProjectsBrowser from "@/components/projects/ProjectsBrowser";
import FooterBlob from "@/components/FooterBlob";
import BlurReveal from "@/components/ui/BlurReveal";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work — campaigns, product design, brand and motion experiments.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-8">
      <BlurReveal
        as="h1"
        text="Check out the Projects !"
        className="font-display block text-center text-[clamp(30px,5vw,52px)] text-white"
      />
      <Reveal>
        <p className="mx-auto mt-4 max-w-lg text-center text-white/45">
          A mix of shipped work and self-initiated experiments. Filter by what you
          care about.
        </p>
      </Reveal>
      <div className="mt-14">
        <ProjectsBrowser />
      </div>
      <FooterBlob label="Curious who made these?" href="/about" />
    </div>
  );
}

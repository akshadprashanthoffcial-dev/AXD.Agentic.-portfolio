import Link from "next/link";
import AxdBlob from "@/components/blob/AxdBlob";

export default function FooterBlob({
  label = "Check out Other Projects !",
  href = "/projects",
}: {
  label?: string;
  href?: string;
}) {
  return (
    <section className="flex flex-col items-center gap-6 px-4 py-28 text-center">
      <h2 className="font-display text-[clamp(24px,4vw,40px)] text-white">{label}</h2>
      <Link
        href={href}
        aria-label={label}
        className="transition-transform duration-500 hover:scale-105"
      >
        <AxdBlob size={220} mode="footer" />
      </Link>
    </section>
  );
}

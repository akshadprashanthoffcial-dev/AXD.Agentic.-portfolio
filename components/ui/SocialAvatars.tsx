import { SITE } from "@/data/site";

function Linkedin({ s = 22 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2.01 0-2.32 1.57-2.32 3.2V21H9z" />
    </svg>
  );
}
function Instagram({ s = 22 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Mail({ s = 22 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

const ITEMS = [
  { label: "LinkedIn", href: SITE.linkedin, icon: Linkedin },
  { label: "Instagram", href: SITE.instagram, icon: Instagram },
  { label: "Email", href: `mailto:${SITE.email}`, icon: Mail },
];

/**
 * Animated avatar-group of social links: circular chips overlap, then
 * spread apart on group hover; each lifts and reveals a tooltip on hover.
 */
export default function SocialAvatars() {
  return (
    <div className="group/av flex items-center">
      {ITEMS.map(({ label, href, icon: Icon }, i) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="group/item relative -ml-3 first:ml-0 transition-[margin] duration-300 ease-out group-hover/av:ml-1.5 first:group-hover/av:ml-0"
          style={{ zIndex: ITEMS.length - i }}
        >
          <span
            className="relative flex h-14 w-14 items-center justify-center rounded-full p-px transition-transform duration-300 hover:-translate-y-1.5 hover:scale-105"
            style={{ background: "var(--brand-gradient)" }}
          >
            <span className="flex h-full w-full items-center justify-center rounded-full bg-black text-white/85">
              <Icon />
            </span>
            {/* Tooltip */}
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/80 px-3 py-1 text-xs text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover/item:opacity-100">
              {label}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

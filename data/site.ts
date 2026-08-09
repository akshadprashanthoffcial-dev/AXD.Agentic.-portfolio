// Site-level metadata + contact. Ported from axd-labs-site, plain voice.
export const SITE = {
  name: "AXD",
  fullName: "axd.labs",
  operator: "Akshad Prashanth",
  tagline: "Visual & motion design, built with AI.",
  domain: "https://axd-labs.vercel.app", // TODO: replace once a custom domain is connected
  email: "akshadprashanthoffcial@gmail.com",
  linkedin: "https://www.linkedin.com/in/akshadprashanth",
  instagram:
    "https://www.instagram.com/axd.labs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  instagramHandle: "axd.labs",
  operatedFrom: "Kerala",
};

// Rotating headline phrases for the home hero typewriter, a mix of intro,
// what I do, fun facts and the (not-so-subtle) "are you hiring?" nudge.
export const HERO_PHRASES = [
  "Hello, I am AXD !",
  "I design brands, campaigns & websites.",
  "Are you hiring? Let's talk.",
  "I turn questions into design.",
  "Fun fact: I think in gradients.",
  "Ask me about the work below.",
  "Powered by curiosity & caffeine.",
];

// The three headline suggestion prompts shown under the home search bar.
export const HOME_SUGGESTIONS = [
  { label: "Who is Akshad?", href: "/about", icon: "user" as const },
  { label: "Show me the projects", href: "/projects", icon: "grid" as const },
  { label: "How do I get in touch?", href: "/contact", icon: "mail" as const },
];

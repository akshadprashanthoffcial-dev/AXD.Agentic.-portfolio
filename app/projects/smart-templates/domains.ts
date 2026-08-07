export type Domain = {
  id: string;
  num: string;
  name: string;
  client: string;
  tagline: string;
  accent: string;
  dark: string;
  paper: string;
  url: string;
  body: string;
  notes: string[];
};

export const DOMAINS: Domain[] = [
  {
    id: "healthcare",
    num: "01",
    name: "Healthcare",
    client: "Health Plus",
    tagline: "care & clinical hiring",
    accent: "#3fcb6b",
    dark: "#194b32",
    paper: "#c9edf7",
    url: "healthplus.careers",
    body: "Healthcare recruiting leans on trust, so the template avoids the cold institutional blue every hospital site defaults to. Green does reassurance without the clinic smell, and the layout stays soft-cornered and airy so long compliance-heavy copy never feels heavy.",
    notes: [
      "Stacked value cards, because mission statements are always three of the same thing.",
      "People in the photography, never equipment.",
      "Job cards sit above the fold-and-a-half. Clinical hiring is urgent.",
    ],
  },
  {
    id: "technology",
    num: "02",
    name: "Technology",
    client: "TechCore",
    tagline: "engineering & product hiring",
    accent: "#3d7dff",
    dark: "#05070f",
    paper: "#eef2f7",
    url: "techcore.careers",
    body: "Blue is the least surprising choice in tech, so rather than avoid it I pushed it, saturated electric blue bleeding into near-black, with a faint engineering grid holding everything on axis. The page goes dark early and stays there. Screens are where this audience already lives.",
    notes: [
      "Numbered list navigation. Engineers scan, they don't browse.",
      "Team portraits scattered off-grid to break the rigidity on purpose.",
      "Discipline rows in caps, sized like a directory rather than marketing.",
    ],
  },
  {
    id: "construction",
    num: "03",
    name: "Construction",
    client: "Iron & Ember",
    tagline: "trades & field hiring",
    accent: "#f2711c",
    dark: "#141414",
    paper: "#fdf1e7",
    url: "ironember.careers",
    body: "This one didn't need inventing. Safety orange on concrete grey is what the industry already wears, so the palette was lifted straight off site. Everything else is weight: heavy caps, square corners, hard contrast between a black spec-sheet middle and a warm sand close.",
    notes: [
      "Staggered card heights in “why join us”, a skyline, not a row.",
      "Asterisk mark repeated as a structural bolt through the page.",
      "Job cards kept plain text. Field roles get read on a phone at lunch.",
    ],
  },
  {
    id: "retail",
    num: "04",
    name: "Retail",
    client: "RetailX",
    tagline: "store & distribution hiring",
    accent: "#6b4eff",
    dark: "#1a1330",
    paper: "#f3f1ec",
    url: "retailx.careers",
    body: "Retail hires at volume and at speed, usually from people scrolling on a break. So this is the loud one: violet against acid green on off-white, tilted photo decks, type that fills the width. Nothing on the page asks to be studied.",
    notes: [
      "Fanned card deck for roles, a rack of options, read in one glance.",
      "A wall-height wordmark at the end so the brand is the last thing left.",
      "Store locator on dark, because maps need somewhere quiet to sit.",
    ],
  },
  {
    id: "banking",
    num: "05",
    name: "Banking",
    client: "Apexus",
    tagline: "finance & global markets hiring",
    accent: "#3b2cf5",
    dark: "#0c1030",
    paper: "#f4f6ff",
    url: "apexus.careers",
    body: "Finance has to look institutional without looking like 2009. The template holds a conservative structure, grid, small caps labels, tidy stat rows, and then puts a single violet-to-blue gradient behind the domain picker. Tradition in the layout, ambition in the colour.",
    notes: [
      "A domain picker up top. Banking candidates arrive knowing their function.",
      "Vertical rotated labels in the values band, borrowed from print finance.",
      "Search built into the hero. This is the only template where it belongs there.",
    ],
  },
];

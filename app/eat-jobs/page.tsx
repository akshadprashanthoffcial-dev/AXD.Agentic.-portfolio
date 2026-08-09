import type { Metadata } from "next";
import EatJobs from "@/components/game/EatJobs";

// It's an Easter egg. Findable by anyone who pokes the blob, not by search.
export const metadata: Metadata = {
  title: "EAT.JOBS",
  description: "An AI-first solution for headcount reduction.",
  robots: { index: false, follow: false },
};

export default function EatJobsPage() {
  return <EatJobs />;
}

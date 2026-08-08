import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/projects", "/contact"].map((path) => ({
    url: `${SITE.domain}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = PROJECTS.filter((p) => !p.externalUrl).map((p) => ({
    url: `${SITE.domain}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}

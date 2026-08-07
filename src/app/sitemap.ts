import type { MetadataRoute } from "next";
import { copilotProducts } from "@/lib/copilot-agents";
import { industries } from "@/lib/industries";
import { absoluteUrl } from "@/lib/site";
import { blogPosts } from "@/lib/itneck/blog";
import { allSolutionPaths } from "@/lib/itneck/solutions";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/solutions", priority: 0.9 },
    { path: "/solutions/microsoft-copilot-agents", priority: 0.9 },
    { path: "/industries", priority: 0.7 },
    { path: "/case-studies", priority: 0.6 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
  ];

  const productRoutes = copilotProducts.map((p) => ({
    path: `/solutions/microsoft-copilot-agents/${p.slug}`,
    priority: 0.8,
  }));

  const industryRoutes = industries.map((i) => ({
    path: `/industries/${i.slug}`,
    priority: 0.7,
  }));

  const aiEntries = [...staticRoutes, ...productRoutes, ...industryRoutes].map(
    (route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    }),
  );

  const itneckStatic = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/support", priority: 0.6 },
    { path: "/privacy", priority: 0.3 },
    { path: "/blog", priority: 0.7 },
    { path: "/solutions", priority: 0.9 },
  ].map((route) => ({
    url: itneckAbsoluteUrl(route.path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  const itneckSolutions = allSolutionPaths().map(({ hub, leaf }) => ({
    url: itneckAbsoluteUrl(
      leaf ? `/solutions/${hub}/${leaf}` : `/solutions/${hub}`,
    ),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: leaf ? 0.7 : 0.8,
  }));

  const itneckBlog = blogPosts.map((p) => ({
    url: itneckAbsoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...aiEntries, ...itneckStatic, ...itneckSolutions, ...itneckBlog];
}

import type {MetadataRoute} from "next";
import {copilotProducts} from "@/lib/copilot-agents";
import {industries} from "@/lib/industries";
import {absoluteUrl} from "@/lib/site";

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

    return [...staticRoutes, ...productRoutes, ...industryRoutes].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));
}

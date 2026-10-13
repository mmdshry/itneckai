import type { MetadataRoute } from "next";
import { topics } from "@/lib/education";
import { articles } from "@/lib/university/articles";
import { categories } from "@/lib/university/categories";
import { chapters } from "@/lib/method";
import { absoluteUrl } from "@/lib/site";
import { blogPosts } from "@/lib/itneck/blog";
import { allSolutionPaths } from "@/lib/itneck/solutions";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/EndYourBusywork", priority: 0.8 },
    { path: "/how-it-works", priority: 0.9 },
    { path: "/team", priority: 0.6 },
    { path: "/university", priority: 0.8 },
    { path: "/contact", priority: 0.5 },
    { path: "/privacy", priority: 0.2 },
  ];

  const chapterRoutes = chapters.map((chapter) => ({
    path: `/how-it-works/${chapter.slug}`,
    priority: 0.8,
  }));

  const universityRoutes = [
    ...topics.map((topic) => ({
      path: `/university/${topic.slug}`,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      path: `/university/articles/${article.slug}`,
      priority: 0.6,
    })),
    ...categories.map((category) => ({
      path: `/university/category/${category.slug}`,
      priority: 0.5,
    })),
  ];

  const aiEntries = [...staticRoutes, ...chapterRoutes, ...universityRoutes].map(
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
    { path: "/about-itneck", priority: 0.8 },
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

  const itneckSolutions = allSolutionPaths().map(({ hub }) => ({
    url: itneckAbsoluteUrl(`/solutions/${hub}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const itneckBlog = blogPosts.map((p) => ({
    url: itneckAbsoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...aiEntries, ...itneckStatic, ...itneckSolutions, ...itneckBlog];
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://royaltree.ge";
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          ka: `${baseUrl}`,
          en: `${baseUrl}`,
        },
      },
    },
    {
      url: `${baseUrl}#overview`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}#advantages`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}#configurator`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}#sanctuary`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}#gallery`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}#contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

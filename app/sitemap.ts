import { getAllVideos, getAllMakes } from "@/lib/videos";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.viktorgautomotive.com";
  const videos = getAllVideos();
  const makes = getAllMakes();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const makePages: MetadataRoute.Sitemap = makes.map((make) => ({
    url: `${baseUrl}/${make}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/${video.make}/${video.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...makePages, ...videoPages];
}
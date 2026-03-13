import Fuse from "fuse.js";
import { getAllVideos } from "@/lib/videos";
import { Video } from "@/types/video";

export type SearchResult = {
  title: string;
  slug: string;
  make: string;
  youtubeId: string;
  years: string;
  models: string[];
  expandedYears: string[];
};

function expandYearRange(years: string): string[] {
  const match = years.match(/(\d{4})-(\d{4})/);
  if (!match) return years ? [years] : [];
  const start = parseInt(match[1]);
  const end = parseInt(match[2]);
  const expanded = [];
  for (let y = start; y <= end; y++) {
    expanded.push(String(y));
  }
  return expanded;
}

export function buildSearchIndex(): SearchResult[] {
  const videos = getAllVideos();
  return videos.map((video: Video) => ({
    title: video.title,
    slug: video.slug,
    make: video.make,
    youtubeId: video.youtubeId,
    years: video.years,
    models: video.models,
    expandedYears: expandYearRange(video.years),
  }));
}

export function createFuseInstance(index: SearchResult[]) {
  return new Fuse(index, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "models", weight: 0.2 },
      { name: "expandedYears", weight: 0.25 },
      { name: "make", weight: 0.05 },
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}
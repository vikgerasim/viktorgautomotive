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
  searchText: string;
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
  return videos.map((video: Video) => {
    const expandedYears = expandYearRange(video.years);
    return {
      title: video.title,
      slug: video.slug,
      make: video.make,
      youtubeId: video.youtubeId,
      years: video.years,
      models: video.models,
      expandedYears,
      // searchText combines everything into one searchable string
      searchText: [
        video.title,
        video.make,
        ...expandedYears,
        ...(video.models || []),
      ].join(" "),
    };
  });
}

export function createFuseInstance(index: SearchResult[]) {
  return new Fuse(index, {
    keys: [
      { name: "searchText", weight: 0.7 },
      { name: "title", weight: 0.2 },
      { name: "expandedYears", weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    useExtendedSearch: true,
  });
}
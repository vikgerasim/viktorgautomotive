import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data/videos");

function expandYearRange(years) {
  const match = years?.match(/(\d{4})-(\d{4})/);
  if (!match) return years ? [years] : [];
  const start = parseInt(match[1]);
  const end = parseInt(match[2]);
  const expanded = [];
  for (let y = start; y <= end; y++) {
    expanded.push(String(y));
  }
  return expanded;
}

function getAllVideos() {
  const makes = fs.readdirSync(dataDirectory);
  return makes.flatMap((make) => {
    const makeDir = path.join(dataDirectory, make);
    if (!fs.statSync(makeDir).isDirectory()) return [];
    return fs.readdirSync(makeDir)
      .filter(f => f.endsWith(".json"))
      .map(f => JSON.parse(fs.readFileSync(path.join(makeDir, f), "utf8")));
  });
}

const videos = getAllVideos();
const index = videos.map(video => {
  const expandedYears = expandYearRange(video.years);
  return {
    title: video.title,
    slug: video.slug,
    make: video.make,
    youtubeId: video.youtubeId,
    years: video.years,
    models: video.models,
    expandedYears,
    searchText: [
      video.title,
      video.make,
      ...expandedYears,
      ...(video.models || []),
    ].join(" "),
  };
});

const outputPath = path.join(process.cwd(), "public/search-index.json");
fs.writeFileSync(outputPath, JSON.stringify(index));
console.log(`Generated search index with ${index.length} videos`);
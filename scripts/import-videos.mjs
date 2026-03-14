import fs from "fs";
import path from "path";
import https from "https";

const API_KEY = process.env.YOUTUBE_API_KEY;
const EXCLUDE_PLAYLIST = process.env.YOUTUBE_EXCLUDE_PLAYLIST;
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE;

// ─── Helpers ────────────────────────────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
      res.on("error", reject);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractMake(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("lexus")) return "lexus";
  if (titleLower.includes("toyota")) return "toyota";
  if (titleLower.includes("acura")) return "acura";
  if (titleLower.includes("honda")) return "honda";
  return "other";
}

function extractItems(description) {
  const lines = description.split("\n");
  const items = [];
  const amazonRegex = /https:\/\/amzn\.to\/\S+/;
  const ebayRegex = /https:\/\/ebay\.us\/\S+/;

  for (const line of lines) {
    const amazonMatch = line.match(amazonRegex);
    const ebayMatch = line.match(ebayRegex);
    const urlMatch = amazonMatch || ebayMatch;
    if (!urlMatch) continue;

    const name = line
      .replace(amazonRegex, "")
      .replace(ebayRegex, "")
      .replace(/[:：]/g, "")
      .trim();
    if (!name) continue;

    const nameLower = name.toLowerCase();

    const toolKeywords = [
      "tool",
      "wrench",
      "driver",
      "socket",
      "pliers",
      "ratchet",
      "screwdriver",
      "hammer",
      "puller",
      "installer",
      "remover",
      "kit",
      "light",
      "multimeter",
      "scanner",
      "gauge",
      "jack",
      "stand",
    ];
    const partKeywords = [
      "sensor",
      "filter",
      "fluid",
      "pad",
      "rotor",
      "bulb",
      "battery",
      "resistor",
      "washer",
      "belt",
      "gasket",
      "seal",
      "bearing",
      "shock",
      "strut",
      "spring",
      "valve",
      "pump",
      "hose",
      "cap",
      "cover",
      "o-ring",
      "plug",
      "tube",
      "insert",
      "blade",
    ];

    const isTool = toolKeywords.some((k) => nameLower.includes(k));
    const isPart = partKeywords.some((k) => nameLower.includes(k));
    const type = isTool ? "tool" : isPart ? "part" : "tool";

    items.push({ name, amazonUrl: urlMatch[0], type });
  }

  return items;
}

// ─── YouTube API calls ───────────────────────────────────────────────────────

async function getChannelId() {
  const handle = CHANNEL_HANDLE.replace("@", "");
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${API_KEY}`;
  const data = await httpsGet(url);
  return data.items?.[0]?.id;
}

async function getExcludedVideoIds() {
  const ids = new Set();
  const playlists = EXCLUDE_PLAYLIST.split(",");

  for (const playlistId of playlists) {
    let pageToken = "";
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId.trim()}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`;
      const data = await httpsGet(url);
      for (const item of data.items || []) {
        ids.add(item.contentDetails.videoId);
      }
      pageToken = data.nextPageToken || "";
    } while (pageToken);
  }

  console.log(`Found ${ids.size} videos to exclude across all playlists`);
  return ids;
}

async function getUploadPlaylistId(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
  const data = await httpsGet(url);
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
}

async function getAllVideoIds(uploadPlaylistId, excludedIds) {
  const videoIds = [];
  let pageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadPlaylistId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`;
    const data = await httpsGet(url);
    for (const item of data.items || []) {
      const id = item.contentDetails.videoId;
      if (!excludedIds.has(id)) videoIds.push(id);
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return videoIds;
}

async function getVideoDetails(videoIds) {
  const videos = [];
  const chunkSize = 50;

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${chunk.join(",")}&key=${API_KEY}`;
    const data = await httpsGet(url);
    videos.push(...(data.items || []));
  }

  return videos;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting import...");

  const channelId = await getChannelId();
  console.log(`Channel ID: ${channelId}`);

  const excludedIds = await getExcludedVideoIds();
  const uploadPlaylistId = await getUploadPlaylistId(channelId);
  console.log(`Upload playlist ID: ${uploadPlaylistId}`);

  const videoIds = await getAllVideoIds(uploadPlaylistId, excludedIds);
  console.log(`Found ${videoIds.length} videos to import`);

  const videos = await getVideoDetails(videoIds);

  let imported = 0;
  let skipped = 0;

  for (const video of videos) {
    const title = video.snippet.title;
    const description = video.snippet.description;
    const youtubeId = video.id;
    const make = extractMake(title);
    const slug = slugify(title);
    const items = extractItems(description);

    const videoData = {
      slug,
      make,
      title,
      youtubeId,
      publishedAt: video.snippet.publishedAt,
      description: description.split("\n")[0].trim(),
      models: [],
      years: "",
      items,
      timestamps: [],
      transcript: "",
    };

    const dir = path.join(process.cwd(), "data", "videos", make);
    fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    fs.writeFileSync(filePath, JSON.stringify(videoData, null, 2));
    imported++;
    console.log(`Imported: ${title}`);
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}`);
}

main().catch(console.error);

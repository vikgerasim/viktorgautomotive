import fs from "fs";
import path from "path";
import https from "https";

const API_KEY = process.env.YOUTUBE_API_KEY;

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
      "tool", "wrench", "driver", "socket", "pliers", "ratchet",
      "screwdriver", "hammer", "puller", "installer", "remover",
      "kit", "light", "multimeter", "scanner", "gauge", "jack", "stand"
    ];
    const partKeywords = [
      "sensor", "filter", "fluid", "pad", "rotor", "bulb", "battery",
      "resistor", "washer", "belt", "gasket", "seal", "bearing", "shock",
      "strut", "spring", "valve", "pump", "hose", "cap", "cover",
      "o-ring", "plug", "tube", "insert", "blade"
    ];

    const isTool = toolKeywords.some((k) => nameLower.includes(k));
    const isPart = partKeywords.some((k) => nameLower.includes(k));
    const type = isTool ? "tool" : isPart ? "part" : "tool";

    items.push({ name, amazonUrl: urlMatch[0], type });
  }

  return items;
}

function extractVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error("Usage: npm run import-single -- https://www.youtube.com/watch?v=VIDEO_ID");
    process.exit(1);
  }

  const youtubeId = extractVideoId(url);
  if (!youtubeId) {
    console.error("Could not extract video ID from URL");
    process.exit(1);
  }

  console.log(`Fetching video ${youtubeId}...`);

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${API_KEY}`;
  const data = await httpsGet(apiUrl);

  if (!data.items?.length) {
    console.error("Video not found");
    process.exit(1);
  }

  const video = data.items[0];
  const title = video.snippet.title;
  const description = video.snippet.description;
  const make = extractMake(title);
  const slug = slugify(title);
  const items = extractItems(description);

  const videoData = {
    slug,
    make,
    title,
    youtubeId,
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
    console.log(`Already exists: ${filePath}`);
    process.exit(0);
  }

  fs.writeFileSync(filePath, JSON.stringify(videoData, null, 2));
  console.log(`\nCreated: ${filePath}`);
  console.log(`Title: ${title}`);
  console.log(`Make: ${make}`);
  console.log(`Items found: ${items.length}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the file and adjust make/models/years if needed`);
  console.log(`2. git add . && git commit -m "add ${slug}" && git push`);
}

main().catch(console.error);
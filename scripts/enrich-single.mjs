import fs from "fs";
import path from "path";
import readline from "readline";

async function readJsonFromStdin() {
  const rl = readline.createInterface({ input: process.stdin });
  console.log("\nPaste the JSON from Claude and press Enter twice when done:\n");

  return new Promise((resolve) => {
    const lines = [];
    let emptyLineCount = 0;

    rl.on("line", (line) => {
      if (line.trim() === "") {
        emptyLineCount++;
        if (emptyLineCount >= 2) {
          rl.close();
          resolve(lines.join("\n"));
        }
      } else {
        emptyLineCount = 0;
        lines.push(line);
      }
    });

    rl.on("close", () => {
      resolve(lines.join("\n"));
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith("--slug="));

  if (!slugArg) {
    console.error("Usage: npm run enrich-single -- --slug=toyota/your-video-slug");
    process.exit(1);
  }

  const slug = slugArg.split("=")[1];
  const [make, ...rest] = slug.split("/");
  const videoSlug = rest.join("/");
  const filePath = path.join(process.cwd(), "data/videos", make, `${videoSlug}.json`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const video = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log(`\nUpdating: ${video.title}`);

  const rawJson = await readJsonFromStdin();

  let extracted;
  try {
    extracted = JSON.parse(rawJson.trim());
  } catch (err) {
    console.error("\nFailed to parse JSON. Make sure you pasted valid JSON.");
    console.error(err.message);
    process.exit(1);
  }

  // Store name and type only — no amazonUrl
  // Links are resolved at build time from master lists
  const items = [
    ...(extracted.parts || []).map((p) => ({
      name: p.name,
      type: "part",
    })),
    ...(extracted.tools || []).map((t) => ({
      name: t.name,
      type: "tool",
      ...(t.sizes?.length > 0 && { sizes: t.sizes }),
    })),
  ];

  // Report any items not in master lists
  const toolsMaster = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/tools-master.json"), "utf8"));
  const partsMaster = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/parts-master.json"), "utf8"));

  const unmatched = [];
  for (const tool of extracted.tools || []) {
    const found = Object.keys(toolsMaster).some(k => k.toLowerCase() === tool.name.toLowerCase());
    if (!found) unmatched.push({ name: tool.name, type: "tool" });
  }
  for (const part of extracted.parts || []) {
    const found = Object.keys(partsMaster).some(k => k.toLowerCase() === part.name.toLowerCase());
    if (!found) unmatched.push({ name: part.name, type: "part" });
  }

  video.description = extracted.description;
  video.difficulty = extracted.difficulty;
  video.tips = extracted.tips;
  video.torque_specs = extracted.torque_specs;
  video.items = items;
  video.enriched = true;

  fs.writeFileSync(filePath, JSON.stringify(video, null, 2));

  console.log(`\n✓ Updated successfully`);
  console.log(`  Description: ${video.description}`);
  console.log(`  Difficulty: ${video.difficulty}`);
  console.log(`  Tips: ${video.tips?.length || 0}`);
  console.log(`  Torque specs: ${video.torque_specs?.length || 0}`);
  console.log(`  Items: ${items.length}`);

  if (unmatched.length > 0) {
    console.log(`\nUnmatched items — add these to your master lists:`);
    for (const item of unmatched) {
      console.log(`  [${item.type}] ${item.name}`);
    }
  } else {
    console.log(`\n✓ All items matched in master lists`);
  }

  console.log(`\nRun 'git add . && git commit -m "enrich ${make}/${videoSlug}" && git push' to deploy.`);
}

main().catch(console.error);
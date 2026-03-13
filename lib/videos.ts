import fs from "fs";
import path from "path";
import { Video } from "@/types/video";

const dataDirectory = path.join(process.cwd(), "data/videos");

export function getVideoBySlug(make: string, slug: string): Video | null {
  try {
    const filePath = path.join(dataDirectory, make, `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents) as Video;
  } catch {
    return null;
  }
}

export function getVideosByMake(make: string): Video[] {
  try {
    const makeDirectory = path.join(dataDirectory, make);
    const filenames = fs.readdirSync(makeDirectory);
    return filenames
      .filter((filename) => filename.endsWith(".json"))
      .map((filename) => {
        const filePath = path.join(makeDirectory, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContents) as Video;
      });
  } catch {
    return [];
  }
}

export function getAllVideos(): Video[] {
  try {
    const makes = fs.readdirSync(dataDirectory);
    return makes.flatMap((make) => getVideosByMake(make));
  } catch {
    return [];
  }
}

export function getAllMakes(): string[] {
  try {
    return fs.readdirSync(dataDirectory).filter((item) => {
      const itemPath = path.join(dataDirectory, item);
      return fs.statSync(itemPath).isDirectory();
    });
  } catch {
    return [];
  }
}
export type AmazonItem = {
  name: string;
  amazonUrl: string;
  type: "part" | "tool";
}

export type Timestamp = {
  time: string;
  label: string;
}

export type Video = {
  // Core identity
  slug: string;
  make: string;
  title: string;
  youtubeId: string;

  // SEO
  description: string;

  // Vehicle info
  models: string[];
  years: string;

  // Page content
  items: AmazonItem[];
  timestamps: Timestamp[];
  transcript: string;
}
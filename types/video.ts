export type AmazonItem = {
  name: string;
  type: "part" | "tool";
  amazonUrl?: string;
  sizes?: string[];
}

export type Timestamp = {
  time: string;
  label: string;
}

export type TorqueSpec = {
  fastener: string;
  spec: string;
  unit: "ft-lbs" | "in-lbs";
}

export type Video = {
  slug: string;
  make: string;
  title: string;
  youtubeId: string;
  publishedAt: string;
  description: string;
  models: string[];
  years: string;
  items: AmazonItem[];
  timestamps: Timestamp[];
  transcript: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  tips?: string[];
  torque_specs?: TorqueSpec[];
  enriched?: boolean;
}
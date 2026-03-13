import { getVideoBySlug, getAllVideos } from "@/lib/videos";
import { notFound } from "next/navigation";
import { AmazonItem } from "@/types/video";

interface PageProps {
  params: Promise<{
    make: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const videos = getAllVideos();
  return videos.map((video) => ({
    make: video.make,
    slug: video.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { make, slug } = await params;
  const video = getVideoBySlug(make, slug);
  if (!video) return {};
  return {
    title: `${video.title} | Viktor G Automotive`,
    description: video.description,
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { make, slug } = await params;
  const video = getVideoBySlug(make, slug);
  if (!video) notFound();

  const parts = video.items.filter((item: AmazonItem) => item.type === "part");
  const tools = video.items.filter((item: AmazonItem) => item.type === "tool");

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <p className="text-gray-600 mb-6">{video.description}</p>

      <div className="relative w-full mb-8" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {parts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Parts Needed</h2>
          <ul className="space-y-2">
            {parts.map((item: AmazonItem) => (
              <li key={item.amazonUrl}>
                <a href={item.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Tools Needed</h2>
          <ul className="space-y-2">
            {tools.map((item: AmazonItem) => (
              <li key={item.amazonUrl}>
                <a href={item.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {video.timestamps.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Video Chapters</h2>
          <ul className="space-y-1">
            {video.timestamps.map((ts) => (
              <li key={ts.time} className="text-gray-700">
                <span className="font-mono text-sm mr-3">{ts.time}</span>
                {ts.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {video.transcript && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Transcript</h2>
          <p className="text-gray-700 leading-relaxed">{video.transcript}</p>
        </section>
      )}

    </main>
  );
}
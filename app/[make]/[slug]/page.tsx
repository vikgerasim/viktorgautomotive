import { getVideoBySlug, getAllVideos } from "@/lib/videos";
import { notFound } from "next/navigation";
import { AmazonItem } from "@/types/video";

interface PageProps {
  params: Promise<{ make: string; slug: string }>;
}

export async function generateStaticParams() {
  const videos = getAllVideos();
  return videos.map((video) => ({ make: video.make, slug: video.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { make, slug } = await params;
  const video = getVideoBySlug(make, slug);
  if (!video) return {};
  return {
    title: `${video.title} | Viktor G Automotive`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      url: `https://www.viktorgautomotive.com/${video.make}/${video.slug}`,
      siteName: "Viktor G Automotive",
      images: [
        {
          url: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`],
    },
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { make, slug } = await params;
  const video = getVideoBySlug(make, slug);
  if (!video) notFound();

  const parts = video.items.filter((item: AmazonItem) => item.type === "part");
  const tools = video.items.filter((item: AmazonItem) => item.type === "tool");

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      {/* Title section - full width */}
      <div className="mb-4">
        <span className="inline-block text-xs font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-1 rounded mb-2 capitalize">
          {video.make}
        </span>
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-600">{video.description}</p>
      </div>

      {/* Video - full width */}
      <div className="relative w-full mb-8" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Two column layout below video */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Left column - content */}
        <div>
          {(parts.length > 0 || tools.length > 0) && (
            <p className="text-[11.9px] text-gray-400 italic border-t border-gray-200 pt-3 mb-4">
              As an Amazon Associate I earn from qualifying purchases. Product
              links below are affiliate links at no extra cost to you.
            </p>
          )}

          {parts.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3">Parts Needed</h2>
              <ul className="space-y-2">
                {parts.map((item: AmazonItem) => (
                  <li key={item.amazonUrl}>
                    <a
                      href={item.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tools.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3">Tools Needed</h2>
              <ul className="space-y-2">
                {tools.map((item: AmazonItem) => (
                  <li key={item.amazonUrl}>
                    <a
                      href={item.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {video.timestamps.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3">Video Chapters</h2>
              <ul className="space-y-1">
                {video.timestamps.map((ts) => (
                  <li key={ts.time} className="text-gray-700">
                    <span className="font-mono text-sm mr-3 text-red-600">
                      {ts.time}
                    </span>
                    {ts.label}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {video.transcript && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3">Transcript</h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {video.transcript}
              </p>
            </section>
          )}
        </div>

        {/* Right column - sidebar */}
        <aside className="hidden md:block sticky top-24">
          <div className="h-64"></div>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "VideoObject",
                name: video.title,
                description: video.description,
                thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
                uploadDate: video.publishedAt,
                embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
                url: `https://www.viktorgautomotive.com/${video.make}/${video.slug}`,
              },
              {
                "@type": "HowTo",
                name: video.title,
                description: video.description,
                url: `https://www.viktorgautomotive.com/${video.make}/${video.slug}`,
                supply: parts.map((item: AmazonItem) => ({
                  "@type": "HowToSupply",
                  name: item.name,
                })),
                tool: tools.map((item: AmazonItem) => ({
                  "@type": "HowToTool",
                  name: item.name,
                })),
              },
            ],
          }),
        }}
      />
    </main>
  );
}

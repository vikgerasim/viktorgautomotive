import { getVideoBySlug, getAllVideos, lookupLink } from "@/lib/videos";
import { notFound } from "next/navigation";
import { AmazonItem, TorqueSpec } from "@/types/video";

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

      <div className="mb-4">
        <span className="inline-block text-xs font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-1 rounded mb-2 capitalize">
          {video.make}
        </span>
        <h1 className="text-2xl font-bold mb-1">{video.title}</h1>
        <p className="text-xs text-gray-400 mb-0">By Viktor G · Certified Master Technician</p>
      </div>

      <div className="relative w-full mb-4" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-gray-600 mb-4">{video.description}</p>

      {video.difficulty && (
        <div className="mb-6">
          <span className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded ${
            video.difficulty === "Beginner"
              ? "bg-green-100 text-green-800"
              : video.difficulty === "Intermediate"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {video.difficulty}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">

        <div>
          {(parts.length > 0 || tools.length > 0) && (
            <p className="text-[11.9px] text-gray-400 italic border-t border-gray-200 pt-3 mb-4">
              As an Amazon Associate I earn from qualifying purchases. Product links below are affiliate links at no extra cost to you.
            </p>
          )}

          {parts.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-red-600">Parts Needed</h2>
              <ul className="space-y-2">
                {parts.map((item: AmazonItem) => {
                  const link = item.amazonUrl || lookupLink(item.name, "part");
                  return (
                    <li key={item.name} className="flex items-baseline gap-2">
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{item.name}</a>
                      ) : (
                        <span className="text-gray-700">{item.name}</span>
                      )}
                      {item.sizes && item.sizes.length > 0 && (
                        <span className="text-xs text-gray-400">({item.sizes.join(", ")})</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {tools.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-red-600">Tools Needed</h2>
              <ul className="space-y-2">
                {tools.map((item: AmazonItem) => {
                  const link = item.amazonUrl || lookupLink(item.name, "tool");
                  return (
                    <li key={item.name} className="flex items-baseline gap-2">
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{item.name}</a>
                      ) : (
                        <span className="text-gray-700">{item.name}</span>
                      )}
                      {item.sizes && item.sizes.length > 0 && (
                        <span className="text-xs text-gray.400">({item.sizes.join(", ")})</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {video.tips && video.tips.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-red-600">Tips & Tricks</h2>
              <ul className="space-y-3">
                {video.tips.map((tip, index) => (
                  <li key={index} className="flex items-baseline gap-2 text-gray-700">
                    <span className="text-red-600 font-bold flex-shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {video.torque_specs && video.torque_specs.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-red-600">Torque Specs</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Fastener</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Spec</th>
                  </tr>
                </thead>
                <tbody>
                  {video.torque_specs.map((spec: TorqueSpec, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{spec.fastener}</td>
                      <td className="py-2 text-right font-mono text-gray-900 whitespace-nowrap">{spec.spec} {spec.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {video.timestamps.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-red-600">Video Chapters</h2>
              <ul className="space-y-1">
                {video.timestamps.map((ts) => (
                  <li key={ts.time} className="text-gray-700">
                    <span className="font-mono text-sm mr-3 text-red-600">{ts.time}</span>
                    {ts.label}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

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
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `https://www.viktorgautomotive.com/${video.make}/${video.slug}`,
                },
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
import { getAllMakes, getAllVideos } from "@/lib/videos";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types/video";

export default function Home() {
  const makes = getAllMakes();
  const recentVideos = getAllVideos().slice(0, 6);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Viktor G Automotive</h1>
        <p className="text-gray-600 text-lg">
          Expert car repair and maintenance guides from a Master Automotive
          Technician with 20+ years of experience.
        </p>
      </section>

      {/* Browse by Make */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Browse by Make</h2>
        <div className="flex gap-4">
          {makes.map((make) => (
            <Link
              key={make}
              href={`/${make}`}
              className="px-6 py-3 border rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition-all capitalize"
            >
              {make}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Videos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Guides</h2>
        <div className="grid gap-4">
          {recentVideos.map((video: Video) => (
            <Link
              key={video.slug}
              href={`/${video.make}/${video.slug}`}
              className="block p-4 border rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
            >
              <div className="flex gap-4 items-start">
                <Image
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  width={160}
                  height={90}
                  className="rounded flex-shrink-0"
                />
                <div>
                  <span className="text-xs font-medium uppercase text-blue-600 mb-1 block capitalize">
                    {video.make}
                  </span>
                  <h3 className="font-semibold text-gray-900">{video.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{video.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
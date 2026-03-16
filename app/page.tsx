import { getAllVideos } from "@/lib/videos";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types/video";

export default function Home() {
  const makes = ["lexus", "toyota", "acura"];
  const recentVideos = getAllVideos()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2 pb-2 border-b-2 border-red-600">Viktor G Automotive</h1>
        <p className="text-gray-600 mt-3 leading-relaxed">
          Expert car repair and maintenance guides from a certified Master Technician with 20+ years of professional automotive experience, specializing in Lexus and Toyota vehicles.
        </p>
        <p className="text-gray-600 mt-2 leading-relaxed">
          Every guide on this site is produced by Viktor G personally — a former Lexus dealership shop foreman and holder of Lexus/Toyota Master Technician and Hybrid Technician certifications.{" "}
          <Link href="/about" className="text-red-600 hover:underline font-medium">
            Learn more about Viktor →
          </Link>
        </p>
      </section>

      {/* Browse by Make */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-red-600">Browse by Make</h2>
        <div className="flex gap-4">
          {makes.map((make) => (
            <Link
              key={make}
              href={`/${make}`}
              className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:border-red-500 hover:text-red-600 transition-all capitalize"
            >
              {make}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Videos */}
      <section>
        <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-red-600">Recent Guides</h2>
        <div className="grid gap-4">
          {recentVideos.map((video: Video) => (
            <Link
              key={video.slug}
              href={`/${video.make}/${video.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg border-l-4 border-l-transparent hover:border-l-red-500 hover:bg-red-50 transition-all shadow-sm"
            >
              <div className="flex gap-4 items-start">
                <Image
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  width={160}
                  height={90}
                  className="rounded shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    <span className="inline-block text-xs font-bold tracking-widest capitalize bg-red-600 text-white px-2 py-0.5 rounded mr-2 capitalize align-middle">
                      {video.make}
                    </span>
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
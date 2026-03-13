import { getVideosByMake, getAllMakes } from "@/lib/videos";
import { notFound } from "next/navigation";
import { Video } from "@/types/video";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    make: string;
  }>;
}

export async function generateStaticParams() {
  const makes = getAllMakes();
  return makes.map((make) => ({ make }));
}

export async function generateMetadata({ params }: PageProps) {
  const { make } = await params;
  const makeName = make.charAt(0).toUpperCase() + make.slice(1);
  return {
    title: `${makeName} Repair Guides | Viktor G Automotive`,
    description: `Expert ${makeName} repair and maintenance guides from Master Technician Viktor G.`,
  };
}

export default async function MakePage({ params }: PageProps) {
  const { make } = await params;
  const videos = getVideosByMake(make);
  if (!videos.length) notFound();

  const makeName = make.charAt(0).toUpperCase() + make.slice(1);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{makeName} Repair Guides</h1>
      <p className="text-gray-600 mb-8">
        Expert {makeName} repair and maintenance guides from Master Technician Viktor G.
      </p>

      <div className="grid gap-4">
        {videos.map((video: Video) => (
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
                <h2 className="font-semibold text-gray-900">{video.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{video.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
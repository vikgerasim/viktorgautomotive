import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Viktor G | Master Automotive Technician",
  description: "Viktor Gerasimenko is a certified Master Automotive Technician with 17+ years of professional experience specializing in Lexus and Toyota vehicles.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-2 pb-2 border-b-2 border-red-600">
        About Viktor G
      </h1>
      <p className="text-gray-500 text-sm mb-8">Master Automotive Technician · 20+ Years Experience</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">A Lifelong Passion for Mechanical Systems</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          I grew up in a family of engineers, tinkering with bicycle gears, bearings, and mechanical systems from an early age. My father introduced me to computers and mechanical problem-solving before I was a teenager, and that foundation never left me. I graduated high school with honors, earning top marks in Math and Physics across my entire school.
        </p>
        <p className="text-gray-700 leading-relaxed">
          I initially pursued Software Engineering at the University of Calgary, but after two years I realized my true passion was hands-on mechanical work — not sitting behind a desk. That realization led me to the Southern Alberta Institute of Technology (SAIT) in 2004, where I completed a two-year Automotive Service Technology program, graduating top of my class with a 3.99 GPA.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">17 Years at a Lexus Dealership</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          I began my professional career at a Lexus dealership in Calgary immediately after graduating in 2006. Over the next 17 years I worked my way from first-year apprentice to shop foreman, running a 14-bay shop at just 27 years old — one of the youngest foremen in the dealership's history.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Throughout my time in the industry I completed every level of manufacturer training available, earning both my Hybrid Technician and Master Technician certifications. These certifications represent the highest level of technical qualification in the Lexus and Toyota ecosystem, covering everything from advanced diagnostics to hybrid powertrain systems.
        </p>
        <p className="text-gray-700 leading-relaxed">
          I left the dealership in 2023 to focus full time on producing automotive repair content and pursuing my software startup — bringing the same precision and thoroughness from the shop floor to everything I do.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Why I Make These Videos</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Dealership labor rates are high and not every repair requires a trip to the shop. Many Lexus and Toyota owners are perfectly capable of doing their own maintenance and repairs with the right guidance. As a certified Master Technician with 20+ years of professional experience, my goal is to give you the knowledge and confidence to complete the job to dealership-level quality — right in your own garage.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Every video on this site is produced by me personally. I do not outsource content or rely on manufacturer documentation alone — every procedure shown is one I have performed professionally, often hundreds of times.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Beyond the Shop</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Outside of automotive repair I have a deep passion for Toyota Tundra performance and off-road builds. My personal 2008 Tundra started life as a daily driver and eventually became a supercharged, 12-inch lifted, 37-inch tired off-road machine. A separate performance-focused 2010 Tundra I built ran 10.8 seconds in the quarter mile, making it the quickest supercharged Tundra in the world at the time — documented on dragtimes.com and tundras.com.
        </p>
        <p className="text-gray-700 leading-relaxed">
          That obsession with building and problem-solving is what drives everything I do — whether it's a routine oil change video or a complex hybrid system repair.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Certifications and Qualifications</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-red-600 font-bold">→</span>
            Lexus/Toyota Master Technician Certification
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-600 font-bold">→</span>
            Lexus/Toyota Hybrid Technician Certification
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-600 font-bold">→</span>
            SAIT Automotive Service Technology Diploma — 3.99 GPA, Top of Class
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-600 font-bold">→</span>
            20+ Years Professional Automotive Experience
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-600 font-bold">→</span>
            Former Shop Foreman, 14-Bay Lexus Dealership
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Browse Repair Guides</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All repair guides on this site are organized by vehicle make. Use the search bar above to find a specific repair, or browse by make below.
        </p>
        <div className="flex gap-4">
          {["lexus", "toyota", "acura"].map((make) => (
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

    </main>
  );
}
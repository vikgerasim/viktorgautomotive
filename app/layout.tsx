import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { buildSearchIndex } from "@/lib/search";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Viktor G Automotive | Expert Car Repair Guides",
  description: "Expert car repair and maintenance guides from a Master Automotive Technician with 20+ years of experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = buildSearchIndex();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-bold text-gray-900 whitespace-nowrap">
              Viktor G Automotive
            </Link>
            <SearchBar index={searchIndex} />
            <nav className="hidden md:flex items-center gap-4 text-sm whitespace-nowrap">
              <Link href="/lexus" className="text-gray-600 hover:text-blue-600 transition-colors">Lexus</Link>
              <Link href="/toyota" className="text-gray-600 hover:text-blue-600 transition-colors">Toyota</Link>
              <Link href="/acura" className="text-gray-600 hover:text-blue-600 transition-colors">Acura</Link>
            </nav>
          </div>
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { buildSearchIndex } from "@/lib/search";
import Footer from "@/components/Footer";
import Script from "next/script";

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
        <header className="bg-black border-b-4 border-red-600 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
            <Link href="/" className="font-bold text-xl tracking-widest uppercase text-white whitespace-nowrap">
              Viktor<span className="text-red-500"> G</span> Automotive
            </Link>
            <div className="flex-1 max-w-md">
              <SearchBar index={searchIndex} />
            </div>
            <nav className="flex items-center gap-6 ml-auto">
              {["lexus", "toyota", "acura"].map((make) => (
                <Link key={make} href={`/${make}`} className="text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white transition-colors">
                  {make}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        <Footer />
      </body>
    </html>
  );
}
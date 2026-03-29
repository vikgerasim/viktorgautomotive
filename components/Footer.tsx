import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-500 text-xs py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <p>As an Amazon Associate, I earn from qualifying purchases.</p>
        <p>
          This site is not affiliated with or endorsed by Lexus, Toyota, or any automotive manufacturer. All trademarks are property of their respective owners and are referenced for descriptive purposes only.
        </p>
        <p>
          Content on this site is for informational purposes only. Automotive repair involves risk — always work safely and consult a qualified technician if you are unsure of any step. Viktor G Automotive assumes no liability for any vehicle damage, personal injury, or consequential loss resulting from use of this content.        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Viktor G Automotive. All rights reserved.</p>
      </div>
    </footer>
  );
}
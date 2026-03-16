export default function Footer() {
  return (
    <footer className="bg-black text-gray-500 text-xs py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <p>As an Amazon Associate, I earn from qualifying purchases.</p>
        <p>
          This site is not affiliated with or endorsed by Lexus, Toyota, or any automotive manufacturer. All trademarks are property of their respective owners and are referenced for descriptive purposes only.
        </p>
        <p>
          &copy; {new Date().getFullYear()} Viktor G Automotive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-12 py-8 text-sm text-gray-500">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p>
          As an Amazon Associate, I earn from qualifying purchases.
        </p>
        <p>
          &copy; {new Date().getFullYear()} Viktor G Automotive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
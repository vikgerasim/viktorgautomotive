"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fuse from "fuse.js";

type SearchResult = {
  title: string;
  slug: string;
  make: string;
  youtubeId: string;
  years: string;
  models: string[];
  expandedYears: string[];
  searchText: string;
};

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fuseRef = useRef<Fuse<SearchResult> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/search-index.json")
      .then(res => res.json())
      .then(index => {
        fuseRef.current = new Fuse(index, {
          keys: [
            { name: "searchText", weight: 0.7 },
            { name: "title", weight: 0.2 },
            { name: "expandedYears", weight: 0.1 },
          ],
          threshold: 0.4,
          includeScore: true,
          ignoreLocation: true,
          minMatchCharLength: 2,
          useExtendedSearch: true,
        });
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim() || !fuseRef.current) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const fuseResults = fuseRef.current.search(value).slice(0, 6);
    setResults(fuseResults.map(r => r.item));
    setIsOpen(true);
  }

  function handleSelect(result: SearchResult) {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    router.push(`/${result.make}/${result.slug}`);
  }

  const searchBox = (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search repairs... e.g. 2024 Prius wiper"
        className="w-full px-4 py-1.5 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400 text-base focus:outline-none focus:border-red-500"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.slug}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 hover:shadow-[inset_4px_0_0_#ef4444] transition-all text-left border-b border-gray-100 last:border-0"
            >
              <Image
                src={`https://img.youtube.com/vi/${result.youtubeId}/mqdefault.jpg`}
                alt={result.title}
                width={64}
                height={36}
                className="rounded flex-shrink-0"
              />
              <p className="text-sm font-medium text-gray-900 leading-snug">
                {result.title}
              </p>
            </button>
          ))}
        </div>
      )}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-sm text-gray-500">
          No results found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-black border-b-4 border-red-600 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl tracking-widest uppercase text-white whitespace-nowrap">
          Viktor <span className="text-red-500">G</span> Automotive
        </Link>
        <div className="hidden md:flex flex-1 max-w-sm">
          {searchBox}
        </div>
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {["lexus", "toyota", "acura"].map((make) => (
            <Link key={make} href={`/${make}`} className="text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white transition-colors">
              {make}
            </Link>
          ))}
          <Link href="/about" className="text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white transition-colors">
            About
          </Link>
        </nav>
        <button
          className="md:hidden ml-auto text-white p-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div className="md:hidden px-6 pb-3 -mt-2">
        {searchBox}
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          {["lexus", "toyota", "acura"].map((make) => (
            <Link
              key={make}
              href={`/${make}`}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-gray-900 transition-colors border-b border-gray-800"
            >
              {make}
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
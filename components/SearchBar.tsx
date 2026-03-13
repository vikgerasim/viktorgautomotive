"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { SearchResult } from "@/lib/search";
import Image from "next/image";

interface SearchBarProps {
  index: SearchResult[];
}

export default function SearchBar({ index }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<Fuse<SearchResult> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(index, {
    keys: [
        { name: "title", weight: 0.5 },
        { name: "models", weight: 0.2 },
        { name: "expandedYears", weight: 0.25 },
        { name: "make", weight: 0.05 },
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    });
  }, [index]);

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
    setResults(fuseResults.map((r) => r.item));
    setIsOpen(true);
  }

  function handleSelect(result: SearchResult) {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    router.push(`/${result.make}/${result.slug}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search repairs... e.g. 2024 Prius wiper"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm text-gray-900"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((result) => (
            <button
              key={result.slug}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Image
                src={`https://img.youtube.com/vi/${result.youtubeId}/mqdefault.jpg`}
                alt={result.title}
                width={80}
                height={45}
                className="rounded flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                <p className="text-xs text-gray-500 capitalize">{result.make} {result.years}</p>
              </div>
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
}
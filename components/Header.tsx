"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { SearchResult } from "@/lib/search";

interface HeaderProps {
  searchIndex: SearchResult[];
}

export default function Header({ searchIndex }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-black border-b-4 border-red-600 sticky top-0 z-50">
      {/* Main row */}
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
        <Link
          href="/"
          className="font-bold text-xl tracking-widest uppercase text-white whitespace-nowrap"
        >
          Viktor <span className="text-red-500">G</span> Automotive
        </Link>

        {/* Search bar — hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <SearchBar index={searchIndex} />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {["lexus", "toyota", "acura"].map((make) => (
            <Link
              key={make}
              href={`/${make}`}
              className="text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
            >
              {make}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden ml-auto text-white p-1"
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

      {/* Mobile search bar */}
      <div className="md:hidden px-6 pb-3">
        <SearchBar index={searchIndex} />
      </div>

      {/* Mobile menu dropdown */}
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
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github, Twitter } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/40 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg w-[90%] md:w-[720px] lg:w-[960px] flex justify-between items-center
    before:absolute before:inset-0 before:rounded-full before:border before:border-white/10 before:animate-pulse
    after:absolute after:inset-0 after:rounded-full after:border after:border-white/10 after:animate-pulse after:animation-delay-500">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <span className="text-xl font-bold">LOGO</span> {/* Replace with your logo component/image */}
      </Link>

      {/* Social Links - Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          href="https://twitter.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-muted hover:text-primary transition-colors"
        >
          <Twitter className="h-5 w-5" />
        </Link>
        <Link
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-muted hover:text-primary transition-colors"
        >
          <Github className="h-5 w-5" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md rounded-lg py-2 shadow-lg">
          <div className="flex justify-center space-x-4 p-4">
            <Link
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}


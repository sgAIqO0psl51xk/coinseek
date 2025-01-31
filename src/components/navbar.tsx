"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/40 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg w-[90%] md:w-[720px] lg:w-[960px] flex justify-end md:justify-center items-center">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center space-x-4">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-base font-medium px-4 py-2 rounded-md hover:bg-muted hover:text-primary hover:ring-1 hover:ring-primary/20 transition-all duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="md:hidden absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md rounded-lg py-2 shadow-lg">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 text-base font-medium hover:bg-muted hover:text-primary hover:ring-1 hover:ring-primary/20 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

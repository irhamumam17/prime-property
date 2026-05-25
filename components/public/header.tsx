"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Prime Property
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary hover:text-gold transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="gold-outline"
              className="text-sm"
              onClick={() => {
                window.location.href = "/agent/login";
              }}
            >
              Login Agent
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="w-6 h-0.5 bg-primary transition-all"></span>
            <span className="w-6 h-0.5 bg-primary transition-all"></span>
            <span className="w-6 h-0.5 bg-primary transition-all"></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-primary hover:text-gold transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="gold-outline"
                className="w-full text-sm"
                onClick={() => {
                  window.location.href = "/agent/login";
                  setMobileMenuOpen(false);
                }}
              >
                Login Agent
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

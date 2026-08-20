"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "./Logo";

const NAV_LINKS = [
  { href: "#products", label: "Products" },
  { href: "#amc", label: "AMC Plans" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md transition-shadow ${
        scrolled ? "border-neutral-200 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/">
          <LogoLockup size={28} />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 sm:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="group relative py-1">
              {link.label}
              <motion.span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-red-600 transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/bill">Check Bill</Link>
        </Button>
      </div>
    </header>
  );
}

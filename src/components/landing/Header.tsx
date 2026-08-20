import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/">
          <LogoLockup size={28} />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 sm:flex">
          <a href="#products" className="hover:text-red-600">
            Products
          </a>
          <a href="#amc" className="hover:text-red-600">
            AMC Plans
          </a>
          <a href="#faq" className="hover:text-red-600">
            FAQ
          </a>
        </nav>
        <Button asChild size="sm">
          <Link href="/bill">Check Bill</Link>
        </Button>
      </div>
    </header>
  );
}

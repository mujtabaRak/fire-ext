import Link from "next/link";
import { FlameKindling } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900">
          <FlameKindling className="h-6 w-6 text-orange-600" />
          <span>FireGuard</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 sm:flex">
          <a href="#products" className="hover:text-orange-600">
            Products
          </a>
          <a href="#amc" className="hover:text-orange-600">
            AMC Plans
          </a>
          <a href="#faq" className="hover:text-orange-600">
            FAQ
          </a>
        </nav>
        <Button asChild size="sm">
          <Link href="/bill">Generate Bill</Link>
        </Button>
      </div>
    </header>
  );
}

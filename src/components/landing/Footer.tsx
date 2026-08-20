import Link from "next/link";
import { FlameKindling, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              <FlameKindling className="h-5 w-5 text-orange-500" />
              FireGuard Extinguishers
            </div>
            <p className="mt-3 text-sm">
              Fire safety equipment, installation, and maintenance for homes and businesses across
              India.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> 12 Industrial Estate Road, Pune, MH 411001
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@fireguard.example
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#products" className="hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="#amc" className="hover:text-white">
                  AMC Plans
                </a>
              </li>
              <li>
                <Link href="/bill" className="hover:text-white">
                  Generate / Check Bill
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} FireGuard Extinguishers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

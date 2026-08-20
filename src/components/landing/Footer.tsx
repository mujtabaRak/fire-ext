import Link from "next/link";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              <LogoMark size={24} />
              Diners Fire Engineers
            </div>
            <p className="mt-3 max-w-sm text-sm">
              Fire extinguishers, installation, and annual maintenance for homes and businesses
              across India. Free collection and delivery within 72 hours.
            </p>
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
                  Check Bill
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} Diners Fire Engineers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

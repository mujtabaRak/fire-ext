import Link from "next/link";
import { CheckBillPanel } from "@/components/bill/CheckBillPanel";
import { LogoLockup } from "@/components/landing/Logo";

export default function BillPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/">
            <LogoLockup size={26} />
          </Link>
          <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-red-600">
            &larr; Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <h1 className="text-3xl font-bold text-neutral-900">Check Your Bill</h1>
        <p className="mt-2 text-neutral-500">
          Enter your invoice number to view the status and download your bill.
        </p>

        <div className="mt-8">
          <CheckBillPanel />
        </div>
      </div>
    </main>
  );
}

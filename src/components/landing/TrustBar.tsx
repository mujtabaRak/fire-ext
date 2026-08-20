import { Truck, ShieldCheck, Wallet, FileCheck } from "lucide-react";

const items = [
  { icon: Truck, label: "Free collection & delivery in 72 hrs" },
  { icon: ShieldCheck, label: "Covers Fire Classes A, B, C & K" },
  { icon: Wallet, label: "All payment modes accepted" },
  { icon: FileCheck, label: "Instant digital billing" },
];

export function TrustBar() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <item.icon className="h-6 w-6 text-red-600" />
            <div className="text-xs font-medium text-neutral-600 sm:text-sm">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

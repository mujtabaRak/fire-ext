import { Truck, ShieldCheck, Wallet, FileCheck } from "lucide-react";
import { Reveal } from "./Reveal";

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
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <div className="group flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-100">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-medium text-neutral-600 sm:text-sm">{item.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

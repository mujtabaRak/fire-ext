import { Search, Truck, Wrench } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose",
    description: "Use the size guide or risk wizard above to pick the right extinguisher type.",
  },
  {
    icon: Truck,
    title: "Install / Deliver",
    description: "We deliver and mount it at your site, with placement guidance included.",
  },
  {
    icon: Wrench,
    title: "Maintain / Refill",
    description: "Scheduled refills, pressure checks, and certification renewals via AMC.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
          How It Works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="mx-auto mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-3 font-semibold text-neutral-900">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

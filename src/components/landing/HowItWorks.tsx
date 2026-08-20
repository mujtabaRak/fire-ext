import { Search, Truck, Wrench } from "lucide-react";
import { Reveal } from "./Reveal";

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
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            How It Works
          </h2>
        </Reveal>
        <div className="relative mt-12 grid gap-8 sm:grid-cols-3">
          <div className="absolute top-8 right-[16.5%] left-[16.5%] hidden h-px bg-neutral-200 sm:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="group relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700 transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="mx-auto mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-semibold text-neutral-900">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

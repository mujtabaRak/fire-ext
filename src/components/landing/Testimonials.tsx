import { Truck, ClipboardCheck, Headset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "./Reveal";

const reasons = [
  {
    icon: Truck,
    title: "Fast, Free Delivery",
    description:
      "Free collection and delivery within 72 hours, straight to your home, office, or site.",
  },
  {
    icon: ClipboardCheck,
    title: "Right Extinguisher, Every Time",
    description:
      "We match the type and size to your actual fire risk — Dry Chemical, CO2, HCFC-123, Foam, or Class K.",
  },
  {
    icon: Headset,
    title: "Payment On Your Terms",
    description: "Pay immediately after delivery, in any mode — UPI, cash, or card.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            Why Diners Fire Engineers
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.1}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700 transition-transform duration-300 group-hover:scale-110">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-neutral-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{r.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Facility Manager, Textile Unit",
    quote:
      "Their AMC team never misses a refill deadline. Compliance audits have been stress-free since we switched.",
  },
  {
    name: "Anita Sharma",
    role: "Restaurant Owner",
    quote:
      "The wet chemical extinguisher for our kitchen was the right call — the team explained exactly why over ABC.",
  },
  {
    name: "Suresh Iyer",
    role: "IT Admin, Data Center",
    quote: "CO2 units installed same week, with proper signage and staff training included.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
          Trusted by Businesses Like Yours
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <div className="flex gap-0.5 text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-neutral-600">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

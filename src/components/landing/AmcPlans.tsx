import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "₹999/yr",
    features: ["Annual inspection", "Pressure check", "Compliance certificate"],
  },
  {
    name: "Standard",
    price: "₹1,999/yr",
    features: ["Everything in Basic", "1 free refill", "Priority support"],
    highlighted: true,
  },
  {
    name: "Industrial",
    price: "Custom",
    features: ["Multi-site coverage", "Quarterly inspections", "Dedicated account manager"],
  },
];

export function AmcPlans() {
  return (
    <section id="amc" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Annual Maintenance Plans
          </h2>
          <p className="mt-3 text-neutral-500">
            Keep every extinguisher compliant and ready, year-round. Indicative pricing — talk to
            sales for an exact quote.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? "border-red-400 shadow-md ring-1 ring-red-200" : ""}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-2xl font-bold text-neutral-900">{plan.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={plan.highlighted ? "default" : "outline"}>
                  Talk to Sales
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

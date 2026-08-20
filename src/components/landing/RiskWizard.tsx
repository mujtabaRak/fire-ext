"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import type { ProductDto } from "@/lib/types";
import { EXTINGUISHER_TYPE_LABELS } from "@/lib/types";
import { formatInr } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Place = "home" | "office" | "kitchen" | "industrial" | "vehicle";
type SqFt = "small" | "medium" | "large" | "xlarge";
type Hazard = "electrical" | "cooking" | "combustibles" | "flammable_liquids";

const PLACE_OPTIONS: { value: Place; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "kitchen", label: "Kitchen / Restaurant" },
  { value: "industrial", label: "Industrial / Warehouse" },
  { value: "vehicle", label: "Vehicle" },
];

const SQFT_OPTIONS: { value: SqFt; label: string; estimate: number }[] = [
  { value: "small", label: "Under 150 sq ft", estimate: 100 },
  { value: "medium", label: "150 - 400 sq ft", estimate: 300 },
  { value: "large", label: "400 - 800 sq ft", estimate: 600 },
  { value: "xlarge", label: "800+ sq ft", estimate: 950 },
];

const HAZARD_OPTIONS: { value: Hazard; label: string; fireClass: string }[] = [
  { value: "electrical", label: "Electrical equipment", fireClass: "C" },
  { value: "cooking", label: "Cooking oil / grease", fireClass: "K" },
  { value: "combustibles", label: "Wood, paper, fabric", fireClass: "A" },
  { value: "flammable_liquids", label: "Flammable liquids / gas", fireClass: "B" },
];

function recommend(products: ProductDto[], sqftEstimate: number, fireClass: string) {
  const matching = products.filter((p) => p.fireClasses.includes(fireClass));
  const pool = matching.length > 0 ? matching : products;

  const sufficient = pool
    .filter((p) => p.coverageAreaSqFt >= sqftEstimate)
    .sort((a, b) => a.coverageAreaSqFt - b.coverageAreaSqFt);

  if (sufficient.length > 0) return sufficient[0];

  return [...pool].sort((a, b) => b.coverageAreaSqFt - a.coverageAreaSqFt)[0];
}

export function RiskWizard({ products }: { products: ProductDto[] }) {
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState<Place | null>(null);
  const [sqft, setSqft] = useState<SqFt | null>(null);
  const [hazard, setHazard] = useState<Hazard | null>(null);

  const result =
    step === 3 && sqft && hazard
      ? recommend(
          products,
          SQFT_OPTIONS.find((o) => o.value === sqft)!.estimate,
          HAZARD_OPTIONS.find((o) => o.value === hazard)!.fireClass
        )
      : null;

  function reset() {
    setStep(0);
    setPlace(null);
    setSqft(null);
    setHazard(null);
  }

  return (
    <Card className="border-orange-200 bg-orange-50/40">
      <CardContent className="p-8">
        <div className="mb-6 flex items-center gap-2 text-orange-700">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-semibold">Fire Risk Wizard</h3>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <p className="mb-4 text-sm font-medium text-neutral-700">Where is this for?</p>
              <div className="grid grid-cols-2 gap-2">
                {PLACE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setPlace(o.value);
                      setStep(1);
                    }}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-3 text-sm font-medium text-neutral-700 hover:border-orange-400 hover:text-orange-700"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <p className="mb-4 text-sm font-medium text-neutral-700">What&apos;s the approximate area?</p>
              <div className="grid grid-cols-2 gap-2">
                {SQFT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setSqft(o.value);
                      setStep(2);
                    }}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-3 text-sm font-medium text-neutral-700 hover:border-orange-400 hover:text-orange-700"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <p className="mb-4 text-sm font-medium text-neutral-700">Main hazard present?</p>
              <div className="grid grid-cols-1 gap-2">
                {HAZARD_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setHazard(o.value);
                      setStep(3);
                    }}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-3 text-left text-sm font-medium text-neutral-700 hover:border-orange-400 hover:text-orange-700"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
                Recommended for {PLACE_OPTIONS.find((p) => p.value === place)?.label}
              </p>
              <h4 className="mt-2 text-xl font-bold text-neutral-900">{result.name}</h4>
              <div className="mt-2 flex items-center gap-2">
                <Badge>{EXTINGUISHER_TYPE_LABELS[result.type]}</Badge>
                <Badge variant="secondary">{result.sizeKg}kg</Badge>
              </div>
              <p className="mt-3 text-sm text-neutral-600">
                Covers up to {result.coverageAreaSqFt} sq ft &middot; Fire class{" "}
                {result.fireClasses.join(", ")}
              </p>
              <p className="mt-3 text-2xl font-bold text-neutral-900">{formatInr(result.price)}</p>
              <div className="mt-6 flex gap-2">
                <Button asChild>
                  <a href="/bill">Generate Bill</a>
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  Retake
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

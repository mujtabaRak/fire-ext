"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Tag, Flame } from "lucide-react";
import type { ProductDto } from "@/lib/types";
import { EXTINGUISHER_TYPE_LABELS, EXTINGUISHER_TYPE_SHORT_LABELS } from "@/lib/types";
import { formatInr } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExtinguisherIllustration, HumanSilhouette } from "./ExtinguisherIllustration";
import { RiskWizard } from "./RiskWizard";
import { Reveal } from "./Reveal";

const REFERENCE_HEIGHT_PX = 220;

export function ProductShowcase({ products }: { products: ProductDto[] }) {
  const sorted = useMemo(() => [...products].sort((a, b) => a.sizeKg - b.sizeKg), [products]);
  const [selectedId, setSelectedId] = useState(sorted[Math.floor(sorted.length / 2)]?.id);
  const selected = sorted.find((p) => p.id === selectedId) ?? sorted[0];

  const maxSize = Math.max(...sorted.map((p) => p.sizeKg));
  const minSize = Math.min(...sorted.map((p) => p.sizeKg));

  function heightFor(sizeKg: number) {
    const ratio = maxSize === minSize ? 1 : (sizeKg - minSize) / (maxSize - minSize);
    return 60 + ratio * 130;
  }

  if (!selected) return null;

  return (
    <section id="products" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Find the Right Size, Visually
            </h2>
            <p className="mt-3 text-neutral-500">
              Tap a size below to compare it against an average adult for scale, and see exactly
              what it&apos;s rated to handle.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Visual comparison panel */}
          <Reveal delay={0.1}>
          <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-8">
              <div
                className="flex items-end justify-center gap-10 rounded-xl border-b border-dashed border-neutral-200 pb-6"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                <HumanSilhouette heightPx={REFERENCE_HEIGHT_PX} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ExtinguisherIllustration
                      type={selected.type}
                      heightPx={heightFor(selected.sizeKg)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Size selector */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {sorted.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95 ${
                      p.id === selected.id
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    {p.sizeKg}kg <span className="opacity-70">&middot; {EXTINGUISHER_TYPE_SHORT_LABELS[p.type]}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 rounded-xl bg-neutral-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900">{selected.name}</h3>
                    <Badge>{EXTINGUISHER_TYPE_LABELS[selected.type]}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Ruler className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-neutral-900">
                        {selected.coverageAreaSqFt} sq ft
                      </span>
                      <span className="text-neutral-500">coverage</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Flame className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-neutral-900">
                        Class {selected.fireClasses.join(", ")}
                      </span>
                      <span className="text-neutral-500">fire rating</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Tag className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-neutral-900">
                        {formatInr(selected.price)}
                      </span>
                      <span className="text-neutral-500">price</span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-neutral-500">
                    Best for: {selected.useCase}
                  </p>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
          </Reveal>

          {/* Risk wizard */}
          <Reveal delay={0.2}>
            <RiskWizard products={sorted} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

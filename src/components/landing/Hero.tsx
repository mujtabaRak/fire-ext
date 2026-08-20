"use client";

import { motion } from "framer-motion";
import { Check, Flame, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HAZARDS = ["Dry Chemical", "CO2", "HCFC-123", "Foam", "Class K"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-red-600 blur-3xl"
            style={{
              width: 200 + i * 40,
              height: 200 + i * 40,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.1, 1] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-300"
        >
          <Flame className="h-4 w-4" />
          Fire Extinguishers &middot; Installation &middot; AMC
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          Fire Safety That
          <span className="relative mx-2 inline-flex items-center bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            <Flame className="mr-1 h-9 w-9 text-red-500 sm:h-12 sm:w-12" />
            Never Waits
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-neutral-300"
        >
          Fire extinguishers, installation, and AMC for homes, offices, and industrial sites —
          matched to your space in under a minute.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Tackles fire caused by
          </span>
          {HAZARDS.map((h) => (
            <span
              key={h}
              className="inline-flex items-center gap-1.5 text-sm text-neutral-200 transition-colors hover:text-white"
            >
              <Check className="h-4 w-4 text-red-500" />
              {h}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <a href="#products">Explore Extinguishers</a>
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" asChild>
            <Link href="/bill">Check Bill</Link>
          </Button>
        </motion.div>

        <motion.a
          href="#products"
          aria-label="Scroll to products"
          className="mt-14 text-neutral-500 hover:text-neutral-300"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.a>
      </div>
    </section>
  );
}

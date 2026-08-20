import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "email", label: "Email" },
  { key: "otp", label: "Verify" },
  { key: "form", label: "Details" },
  { key: "done", label: "Bill Ready" },
] as const;

export function BillStepper({ current }: { current: (typeof STEPS)[number]["key"] }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isDone && "bg-red-600 text-white",
                  isCurrent && "bg-red-600 text-white ring-4 ring-red-100",
                  !isDone && !isCurrent && "bg-neutral-100 text-neutral-400"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-medium",
                  isCurrent ? "text-red-700" : "text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-2 h-px flex-1", isDone ? "bg-red-600" : "bg-neutral-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/lib/bill-types";

export function UpiPayBlock({
  invoiceNumber,
  upiLink,
  paymentStatus,
  onSubmitted,
}: {
  invoiceNumber: string;
  upiLink: string | null;
  paymentStatus: PaymentStatus;
  onSubmitted?: () => void;
}) {
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(paymentStatus !== "unpaid");

  if (paymentStatus === "paid") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        <CheckCircle2 className="h-4 w-4" />
        Payment received — this bill is marked paid.
      </div>
    );
  }

  async function submitUtr() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bills/${invoiceNumber}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not submit reference. Try again.");
        return;
      }
      setSubmitted(true);
      onSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-neutral-900">
          <Smartphone className="h-4 w-4 text-orange-600" />
          Pay via UPI
        </h4>
        {paymentStatus === "payment_pending" && (
          <Badge variant="warning">
            <Clock className="mr-1 h-3 w-3" />
            Pending verification
          </Badge>
        )}
      </div>

      {upiLink && (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamically generated PNG from our own API, not a next/image candidate */}
          <img
            src={`/api/bills/${invoiceNumber}/qr`}
            alt="UPI QR code"
            width={160}
            height={160}
            className="rounded-lg border border-neutral-200"
          />
          <div className="flex-1">
            <p className="text-sm text-neutral-600">
              Scan this QR code with any UPI app, or tap the button below on your phone.
            </p>
            <Button asChild className="mt-3" size="sm">
              <a href={upiLink}>Pay via UPI app</a>
            </Button>
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-neutral-100 pt-4">
        {submitted ? (
          <p className="text-sm text-neutral-600">
            Reference submitted. We&apos;ll verify and mark this bill as paid shortly.
          </p>
        ) : (
          <>
            <Label htmlFor="utr">I&apos;ve paid — submit UPI transaction reference (UTR)</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="utr"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 402812345678"
              />
              <Button onClick={submitUtr} disabled={submitting || utr.trim().length < 6}>
                {submitting ? "Submitting…" : "Submit"}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

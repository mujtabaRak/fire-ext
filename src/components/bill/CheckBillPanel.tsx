"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatInr } from "@/lib/utils";
import type { BillDetailsDto } from "@/lib/bill-types";
import { UpiPayBlock } from "./UpiPayBlock";

const STATUS_BADGE: Record<BillDetailsDto["paymentStatus"], { label: string; variant: "success" | "warning" | "destructive" }> = {
  paid: { label: "Paid", variant: "success" },
  payment_pending: { label: "Payment Pending", variant: "warning" },
  unpaid: { label: "Unpaid", variant: "destructive" },
};

export function CheckBillPanel() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bill, setBill] = useState<BillDetailsDto | null>(null);

  async function lookup() {
    setError(null);
    setBill(null);
    if (!invoiceNumber.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bills/${encodeURIComponent(invoiceNumber.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No bill found.");
        return;
      }
      setBill(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Label htmlFor="invoice-lookup">Bill / Invoice Number</Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="invoice-lookup"
              placeholder="e.g. INV-2026-0001"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
            />
            <Button onClick={lookup} disabled={loading}>
              <Search className="h-4 w-4" />
              {loading ? "Checking…" : "Check"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {bill && (
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Invoice</p>
                <p className="text-lg font-bold text-neutral-900">{bill.invoiceNumber}</p>
              </div>
              <Badge variant={STATUS_BADGE[bill.paymentStatus].variant}>
                {STATUS_BADGE[bill.paymentStatus].label}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-400">Billed To</p>
                <p className="text-sm text-neutral-800">{bill.customerName}</p>
                <p className="text-sm text-neutral-500">{bill.billingAddress}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-400">Date</p>
                <p className="text-sm text-neutral-800">
                  {format(new Date(bill.invoiceDate), "dd MMM yyyy")}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-100">
              {bill.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-neutral-100 px-4 py-2 text-sm last:border-b-0"
                >
                  <span>
                    {item.productName} ({item.sizeKg}kg) × {item.quantity}
                  </span>
                  <span className="font-medium">{formatInr(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end text-lg font-bold text-neutral-900">
              Total: {formatInr(bill.total)}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a href={`/api/bills/${bill.invoiceNumber}/pdf`} target="_blank" rel="noreferrer">
                  Download PDF
                </a>
              </Button>
            </div>

            {bill.paymentStatus !== "paid" && (
              <UpiPayBlock
                invoiceNumber={bill.invoiceNumber}
                upiLink={bill.upiLink}
                paymentStatus={bill.paymentStatus}
                onSubmitted={lookup}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Plus, Trash2, ShieldCheck, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ProductDto } from "@/lib/types";
import { EXTINGUISHER_TYPE_LABELS } from "@/lib/types";
import { formatInr } from "@/lib/utils";
import { UpiPayBlock } from "./UpiPayBlock";
import { BillStepper } from "./BillStepper";

type Step = "email" | "otp" | "form" | "done";

type LineItemDraft = { productId: string; quantity: number };

export function GenerateBillPanel({ products }: { products: ProductDto[] }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [items, setItems] = useState<LineItemDraft[]>([
    { productId: products[0]?.id ?? "", quantity: 1 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [result, setResult] = useState<{ invoiceNumber: string; total: number; upiLink: string | null } | null>(
    null
  );

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const productsByType = useMemo(() => {
    const groups = new Map<string, ProductDto[]>();
    for (const p of products) {
      const list = groups.get(p.type) ?? [];
      list.push(p);
      groups.set(p.type, list);
    }
    return groups;
  }, [products]);

  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = Math.max(0, subtotal - discount + taxAmount);

  async function requestOtp() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        return;
      }
      setStep("otp");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Invalid code.");
        return;
      }
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  function updateItem(index: number, patch: Partial<LineItemDraft>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { productId: products[0]?.id ?? "", quantity: 1 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitBill() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          billingAddress,
          shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
          items,
          taxRate,
          discount,
          dueDate: dueDate || undefined,
          notes: notes || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not generate bill.");
        return;
      }

      const billRes = await fetch(`/api/bills/${json.invoiceNumber}`);
      const billJson = await billRes.json();
      setResult({
        invoiceNumber: json.invoiceNumber,
        total: billJson.total,
        upiLink: billJson.upiLink,
      });
      setStep("done");
    } finally {
      setLoading(false);
    }
  }

  let content: ReactNode = null;

  if (step === "email") {
    content = (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-neutral-900">
            <Mail className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Verify your email to generate a bill</h3>
          </div>
          <p className="text-sm text-neutral-500">
            Only authorized business emails can generate bills. We&apos;ll send a one-time code.
          </p>
          <div>
            <Label htmlFor="gen-email">Email</Label>
            <Input
              id="gen-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={requestOtp} disabled={loading || !email}>
            {loading ? "Sending…" : "Send Code"}
          </Button>
        </CardContent>
      </Card>
    );
  } else if (step === "otp") {
    content = (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-neutral-900">
            <ShieldCheck className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Enter the 6-digit code</h3>
          </div>
          <p className="text-sm text-neutral-500">Sent to {email}. It expires in 10 minutes.</p>
          <div>
            <Label htmlFor="gen-otp">Code</Label>
            <Input
              id="gen-otp"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              className="mt-2 tracking-widest"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={verifyOtp} disabled={loading || code.length !== 6}>
              {loading ? "Verifying…" : "Verify"}
            </Button>
            <Button variant="ghost" onClick={() => setStep("email")}>
              Change email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else if (step === "form") {
    content = (
      <Card>
        <CardContent className="space-y-6 p-6">
          <h3 className="font-semibold text-neutral-900">Bill Details</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" className="mt-2" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input id="customerPhone" className="mt-2" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Textarea id="billingAddress" className="mt-2" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="sameAsBilling"
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => setSameAsBilling(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <Label htmlFor="sameAsBilling">Shipping address same as billing</Label>
          </div>

          {!sameAsBilling && (
            <div>
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Textarea id="shippingAddress" className="mt-2" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
            </div>
          )}

          <div className="space-y-3">
            <Label>Line Items</Label>
            {items.map((item, i) => {
              const product = productMap.get(item.productId);
              return (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="h-10 flex-1 rounded-lg border border-neutral-300 bg-white px-3 text-sm"
                    value={item.productId}
                    onChange={(e) => updateItem(i, { productId: e.target.value })}
                  >
                    {[...productsByType.entries()].map(([type, typeProducts]) => (
                      <optgroup key={type} label={EXTINGUISHER_TYPE_LABELS[type as ProductDto["type"]]}>
                        {typeProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {formatInr(p.price)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    className="w-20"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, { quantity: Number(e.target.value) || 1 })}
                  />
                  <span className="w-24 text-right text-sm font-medium text-neutral-700">
                    {product ? formatInr(product.price * item.quantity) : "-"}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i)} disabled={items.length === 1}>
                    <Trash2 className="h-4 w-4 text-neutral-400" />
                  </Button>
                </div>
              );
            })}
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" min={0} max={100} className="mt-2" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input id="discount" type="number" min={0} className="mt-2" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" className="mt-2" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" className="mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="rounded-lg bg-neutral-50 p-4 text-right">
            <p className="text-sm text-neutral-500">Subtotal: {formatInr(subtotal)}</p>
            {discount > 0 && <p className="text-sm text-neutral-500">Discount: -{formatInr(discount)}</p>}
            {taxRate > 0 && <p className="text-sm text-neutral-500">Tax: {formatInr(taxAmount)}</p>}
            <p className="mt-1 text-xl font-bold text-neutral-900">Total: {formatInr(total)}</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            onClick={submitBill}
            disabled={loading || !customerName || !customerPhone || !billingAddress || (!sameAsBilling && !shippingAddress)}
          >
            {loading ? "Generating…" : "Generate Bill"}
          </Button>
        </CardContent>
      </Card>
    );
  } else if (step === "done" && result) {
    content = (
      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <p className="text-sm text-neutral-500">Bill generated</p>
            <h3 className="text-xl font-bold text-neutral-900">{result.invoiceNumber}</h3>
            <p className="mt-1 text-lg font-semibold text-neutral-700">{formatInr(result.total)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={`/api/bills/${result.invoiceNumber}/pdf`} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            </Button>
          </div>
          <UpiPayBlock invoiceNumber={result.invoiceNumber} upiLink={result.upiLink} paymentStatus="unpaid" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <BillStepper current={step} />
      {content}
    </div>
  );
}

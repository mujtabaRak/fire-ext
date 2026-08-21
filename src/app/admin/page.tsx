"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInr } from "@/lib/utils";
import { LogoLockup } from "@/components/landing/Logo";
import { AdminGenerateBillPanel } from "@/components/admin/AdminGenerateBillPanel";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";
import { AdminCertificatesPanel } from "@/components/admin/AdminCertificatesPanel";

type AdminBill = {
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentStatus: "unpaid" | "payment_pending" | "paid";
  upiUtr: string | null;
  createdAt: string;
};

const STATUS_VARIANT = {
  paid: "success",
  payment_pending: "warning",
  unpaid: "destructive",
} as const;

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [bills, setBills] = useState<AdminBill[]>([]);
  const [busyInvoice, setBusyInvoice] = useState<string | null>(null);
  const [tab, setTab] = useState("bills");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((j) => setAuthenticated(j.authenticated));
  }, []);

  async function loadBills() {
    const res = await fetch("/api/admin/bills");
    if (res.ok) setBills(await res.json());
  }

  useEffect(() => {
    if (authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loadBills also serves as a manual refresh after mark-paid / new bill
      loadBills();
    }
  }, [authenticated]);

  async function login() {
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Login failed.");
      return;
    }
    setAuthenticated(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  }

  async function markPaid(invoiceNumber: string) {
    setBusyInvoice(invoiceNumber);
    try {
      await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber }),
      });
      await loadBills();
    } finally {
      setBusyInvoice(null);
    }
  }

  if (authenticated === null) {
    return null;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="space-y-4 p-6">
            <LogoLockup size={26} />
            <h1 className="text-lg font-semibold text-neutral-900">Admin Login</h1>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                className="mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full" onClick={login}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Link href="/">
            <LogoLockup size={26} />
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900">Admin Panel</h1>

        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="new">New Bill</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="bills">
            <p className="mb-4 text-sm text-neutral-500">
              Verify UPI transaction references against your bank/UPI app, then mark bills paid.
            </p>
            <div className="space-y-3">
              {bills.map((b) => (
                <Card key={b.invoiceNumber}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-semibold text-neutral-900">{b.invoiceNumber}</p>
                      <p className="text-sm text-neutral-500">
                        {b.customerName} &middot; {b.customerPhone}
                      </p>
                      {b.upiUtr && <p className="text-xs text-neutral-400">UTR: {b.upiUtr}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-neutral-900">{formatInr(b.total)}</span>
                      <Badge variant={STATUS_VARIANT[b.paymentStatus]}>
                        {b.paymentStatus.replace("_", " ")}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/api/bills/${b.invoiceNumber}/pdf`} target="_blank" rel="noreferrer">
                          PDF
                        </a>
                      </Button>
                      {b.paymentStatus !== "paid" && (
                        <Button
                          size="sm"
                          onClick={() => markPaid(b.invoiceNumber)}
                          disabled={busyInvoice === b.invoiceNumber}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {bills.length === 0 && <p className="text-sm text-neutral-500">No bills yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <AdminGenerateBillPanel
              onCreated={() => {
                loadBills();
              }}
            />
          </TabsContent>

          <TabsContent value="certificates">
            <AdminCertificatesPanel />
          </TabsContent>

          <TabsContent value="products">
            <AdminProductsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

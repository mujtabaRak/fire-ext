"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Power, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  EXTINGUISHER_TYPE_LABELS,
  EXTINGUISHER_TYPE_VALUES,
  FIRE_CLASS_VALUES,
} from "@/lib/types";
import type { AdminProductDto, ExtinguisherType, FireClassValue } from "@/lib/types";
import { formatInr } from "@/lib/utils";

type ProductFormState = {
  name: string;
  type: ExtinguisherType;
  sizeKg: string;
  price: string;
  coverageAreaSqFt: string;
  fireClasses: FireClassValue[];
  useCase: string;
};

const emptyForm: ProductFormState = {
  name: "",
  type: "ABC",
  sizeKg: "",
  price: "",
  coverageAreaSqFt: "",
  fireClasses: [],
  useCase: "",
};

function toFormState(p: AdminProductDto): ProductFormState {
  return {
    name: p.name,
    type: p.type,
    sizeKg: String(p.sizeKg),
    price: String(p.price),
    coverageAreaSqFt: String(p.coverageAreaSqFt),
    fireClasses: p.fireClasses as FireClassValue[],
    useCase: p.useCase,
  };
}

export function AdminProductsPanel() {
  const [products, setProducts] = useState<AdminProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) setProducts(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load on mount, also reused as a manual refresh
    loadProducts();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setView("form");
  }

  function startEdit(p: AdminProductDto) {
    setEditingId(p.id);
    setForm(toFormState(p));
    setError(null);
    setView("form");
  }

  function toggleFireClass(fc: FireClassValue) {
    setForm((prev) => ({
      ...prev,
      fireClasses: prev.fireClasses.includes(fc)
        ? prev.fireClasses.filter((c) => c !== fc)
        : [...prev.fireClasses, fc],
    }));
  }

  async function submitForm() {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        sizeKg: Number(form.sizeKg),
        price: Number(form.price),
        coverageAreaSqFt: Number(form.coverageAreaSqFt),
        fireClasses: form.fireClasses,
        useCase: form.useCase,
      };

      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not save product.");
        return;
      }
      await loadProducts();
      setView("list");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p: AdminProductDto) {
    setBusyId(p.id);
    try {
      await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      await loadProducts();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProduct(p: AdminProductDto) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusyId(p.id);
    try {
      await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
      await loadProducts();
    } finally {
      setBusyId(null);
    }
  }

  const formValid =
    form.name.trim().length >= 2 &&
    Number(form.sizeKg) > 0 &&
    Number(form.price) >= 0 &&
    Number(form.coverageAreaSqFt) > 0 &&
    form.fireClasses.length > 0 &&
    form.useCase.trim().length >= 2;

  if (view === "form") {
    return (
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setView("list")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-neutral-900">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                className="mt-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. ABC 9KG NEW FIRE EXTINGUISHER"
              />
            </div>
            <div>
              <Label htmlFor="p-type">Type</Label>
              <select
                id="p-type"
                className="mt-2 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as ExtinguisherType }))
                }
              >
                {EXTINGUISHER_TYPE_VALUES.map((t) => (
                  <option key={t} value={t}>
                    {EXTINGUISHER_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="p-size">Size (kg)</Label>
              <Input
                id="p-size"
                type="number"
                min={0}
                step="0.1"
                className="mt-2"
                value={form.sizeKg}
                onChange={(e) => setForm((f) => ({ ...f, sizeKg: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="p-price">Price (₹)</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                className="mt-2"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="p-coverage">Coverage (sq ft)</Label>
              <Input
                id="p-coverage"
                type="number"
                min={0}
                className="mt-2"
                value={form.coverageAreaSqFt}
                onChange={(e) => setForm((f) => ({ ...f, coverageAreaSqFt: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Fire Classes</Label>
            <div className="mt-2 flex gap-3">
              {FIRE_CLASS_VALUES.map((fc) => (
                <label key={fc} className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300"
                    checked={form.fireClasses.includes(fc)}
                    onChange={() => toggleFireClass(fc)}
                  />
                  Class {fc}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="p-usecase">Best For / Use Case</Label>
            <Textarea
              id="p-usecase"
              className="mt-2"
              value={form.useCase}
              onChange={(e) => setForm((f) => ({ ...f, useCase: e.target.value }))}
              placeholder="e.g. Warehouses, industrial units, godowns"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <Button onClick={submitForm} disabled={saving || !formValid}>
              {saving ? "Saving…" : editingId ? "Save Changes" : "Add Product"}
            </Button>
            <Button variant="outline" onClick={() => setView("list")} disabled={saving}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Products that are disabled won&apos;t show on the public site or in the New Bill
          dropdown.
        </p>
        <Button size="sm" onClick={startCreate}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {loading && <p className="text-sm text-neutral-500">Loading…</p>}

      <div className="space-y-2">
        {products.map((p) => (
          <Card key={p.id} className={!p.active ? "opacity-60" : ""}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-neutral-900">{p.name}</p>
                  <Badge variant={p.active ? "success" : "secondary"}>
                    {p.active ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500">
                  {EXTINGUISHER_TYPE_LABELS[p.type]} &middot; {p.sizeKg}kg &middot;{" "}
                  {formatInr(p.price)} &middot; Class {p.fireClasses.join(", ")} &middot;{" "}
                  {p.coverageAreaSqFt} sq ft
                </p>
                <p className="text-xs text-neutral-400">{p.useCase}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(p)}
                  disabled={busyId === p.id}
                >
                  <Power className="h-4 w-4" />
                  {p.active ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProduct(p)}
                  disabled={busyId === p.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && products.length === 0 && (
          <p className="text-sm text-neutral-500">No products yet. Add your first one above.</p>
        )}
      </div>
    </div>
  );
}

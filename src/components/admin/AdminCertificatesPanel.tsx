"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, ArrowLeft, RotateCcw, FileCheck, Eye, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ProductDto } from "@/lib/types";

type CertificateSummary = {
  certificateNumber: string;
  clientName: string;
  saleDate: string;
  itemCount: number;
  createdAt: string;
};

type ItemDraft = {
  description: string;
  yearOfManufacturing: string;
  qty: string;
  refillingDueDate: string;
  cylinderSerialNo: string;
};

function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function oneYearFrom(dateIso: string): string {
  const d = dateIso ? new Date(dateIso) : new Date();
  d.setFullYear(d.getFullYear() + 1);
  return format(d, "yyyy-MM-dd");
}

function emptyItem(saleDate: string): ItemDraft {
  return {
    description: "",
    yearOfManufacturing: String(new Date().getFullYear()),
    qty: "1",
    refillingDueDate: oneYearFrom(saleDate),
    cylinderSerialNo: "",
  };
}

function openPdfBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function AdminCertificatesPanel() {
  const [certificates, setCertificates] = useState<CertificateSummary[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingCertificateNumber, setEditingCertificateNumber] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [busyCertNumber, setBusyCertNumber] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [saleDate, setSaleDate] = useState(todayIso());
  const [warrantyPeriod, setWarrantyPeriod] = useState("One year");
  const [testingNote, setTestingNote] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([emptyItem(todayIso())]);

  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const isEditing = Boolean(editingCertificateNumber);
  const productNames = useMemo(() => products.map((p) => p.name), [products]);

  async function loadCertificates() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      if (res.ok) setCertificates(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load on mount
    loadCertificates();
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  function resetForm() {
    setClientName("");
    setClientAddress("");
    setSaleDate(todayIso());
    setWarrantyPeriod("One year");
    setTestingNote("");
    setItems([emptyItem(todayIso())]);
    setError(null);
    setResult(null);
  }

  function startCreate() {
    resetForm();
    setEditingCertificateNumber(null);
    setView("form");
  }

  function startEdit(certificateNumber: string) {
    resetForm();
    setEditingCertificateNumber(certificateNumber);
    setView("form");
    setLoadingExisting(true);
    fetch(`/api/admin/certificates/${certificateNumber}`)
      .then((r) => r.json())
      .then((cert) => {
        setClientName(cert.clientName ?? "");
        setClientAddress(cert.clientAddress ?? "");
        setSaleDate(cert.saleDate ? format(new Date(cert.saleDate), "yyyy-MM-dd") : todayIso());
        setWarrantyPeriod(cert.warrantyPeriod ?? "One year");
        setTestingNote(cert.testingNote ?? "");
        setItems(
          (cert.items ?? []).map(
            (it: {
              description: string;
              yearOfManufacturing: number;
              qty: number;
              refillingDueDate: string;
              cylinderSerialNo: string;
            }) => ({
              description: it.description,
              yearOfManufacturing: String(it.yearOfManufacturing),
              qty: String(it.qty),
              refillingDueDate: format(new Date(it.refillingDueDate), "yyyy-MM-dd"),
              cylinderSerialNo: it.cylinderSerialNo,
            })
          )
        );
      })
      .finally(() => setLoadingExisting(false));
  }

  async function deleteCertificate(certificateNumber: string) {
    if (!window.confirm(`Delete certificate ${certificateNumber}? This cannot be undone.`)) return;
    setBusyCertNumber(certificateNumber);
    try {
      await fetch(`/api/admin/certificates/${certificateNumber}`, { method: "DELETE" });
      await loadCertificates();
    } finally {
      setBusyCertNumber(null);
    }
  }

  function updateItem(index: number, patch: Partial<ItemDraft>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem(saleDate)]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function findValidationError(): string | null {
    if (clientName.trim().length < 2) return "Enter the client name.";
    if (clientAddress.trim().length < 5) return "Enter the client address.";
    if (!saleDate) return "Enter the sale/supply date.";
    if (items.length === 0) return "Add at least one item.";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const label = items.length > 1 ? `Item ${i + 1}: ` : "";
      if (it.description.trim().length < 2) return `${label}enter a description.`;
      if (!Number.isFinite(Number(it.yearOfManufacturing)) || Number(it.yearOfManufacturing) < 2000)
        return `${label}enter a valid year of manufacturing.`;
      if (!Number.isFinite(Number(it.qty)) || Number(it.qty) < 1)
        return `${label}enter a valid quantity.`;
      if (!it.refillingDueDate) return `${label}enter the refilling due date.`;
      if (it.cylinderSerialNo.trim().length < 1) return `${label}enter the cylinder serial number.`;
    }
    return null;
  }

  function buildPayload() {
    return {
      clientName,
      clientAddress,
      saleDate,
      warrantyPeriod,
      testingNote: testingNote || undefined,
      items: items.map((it) => ({
        description: it.description,
        yearOfManufacturing: Number(it.yearOfManufacturing),
        qty: Number(it.qty),
        refillingDueDate: it.refillingDueDate,
        cylinderSerialNo: it.cylinderSerialNo,
      })),
    };
  }

  async function previewPdf() {
    const validationError = findValidationError();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/admin/certificates/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Could not build preview.");
        return;
      }
      openPdfBlob(await res.blob());
    } finally {
      setPreviewLoading(false);
    }
  }

  async function submit() {
    const validationError = findValidationError();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const res = await fetch(
        isEditing ? `/api/admin/certificates/${editingCertificateNumber}` : "/api/admin/certificates",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not save certificate.");
        return;
      }

      if (isEditing) {
        await loadCertificates();
        setView("list");
        return;
      }

      setResult(json.certificateNumber);
      await loadCertificates();
    } finally {
      setSaving(false);
    }
  }

  if (view === "form" && result) {
    return (
      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <p className="text-sm text-neutral-500">Certificate generated</p>
            <h3 className="text-xl font-bold text-neutral-900">{result}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={`/api/certificates/${result}/pdf`} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            </Button>
            <Button variant="outline" onClick={startCreate}>
              <RotateCcw className="h-4 w-4" />
              Create Another
            </Button>
            <Button variant="ghost" onClick={() => setView("list")}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === "form") {
    return (
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setView("list")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-neutral-900">
              {isEditing ? `Edit Certificate: ${editingCertificateNumber}` : "New Certificate"}
            </h3>
          </div>

          {loadingExisting && <p className="text-sm text-neutral-500">Loading certificate…</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="c-client">Client Name</Label>
              <Input
                id="c-client"
                className="mt-2"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="c-saledate">Sale / Supply Date</Label>
              <Input
                id="c-saledate"
                type="date"
                className="mt-2"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="c-address">Client Address</Label>
            <Textarea
              id="c-address"
              className="mt-2"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="c-warranty">Warranty Period</Label>
            <Input
              id="c-warranty"
              className="mt-2 max-w-xs"
              value={warrantyPeriod}
              onChange={(e) => setWarrantyPeriod(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Items</Label>
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor={`c-desc-${i}`} className="text-xs">
                        Description
                      </Label>
                      <Input
                        id={`c-desc-${i}`}
                        className="mt-1"
                        list={`c-desc-options-${i}`}
                        value={item.description}
                        onChange={(e) => updateItem(i, { description: e.target.value })}
                        placeholder="e.g. 6.0KG ABC TYPE F/EXT. COMPLETE ALL"
                      />
                      <datalist id={`c-desc-options-${i}`}>
                        {productNames.map((name) => (
                          <option key={name} value={name} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <Label htmlFor={`c-year-${i}`} className="text-xs">
                        Year of Manufacturing
                      </Label>
                      <Input
                        id={`c-year-${i}`}
                        type="number"
                        className="mt-1"
                        value={item.yearOfManufacturing}
                        onChange={(e) => updateItem(i, { yearOfManufacturing: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`c-qty-${i}`} className="text-xs">
                        Qty
                      </Label>
                      <Input
                        id={`c-qty-${i}`}
                        type="number"
                        min={1}
                        className="mt-1"
                        value={item.qty}
                        onChange={(e) => updateItem(i, { qty: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`c-refill-${i}`} className="text-xs">
                        Refilling Due Date
                      </Label>
                      <Input
                        id={`c-refill-${i}`}
                        type="date"
                        className="mt-1"
                        value={item.refillingDueDate}
                        onChange={(e) => updateItem(i, { refillingDueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`c-serial-${i}`} className="text-xs">
                        Cylinder Sr. No.
                      </Label>
                      <Input
                        id={`c-serial-${i}`}
                        className="mt-1"
                        value={item.cylinderSerialNo}
                        onChange={(e) => updateItem(i, { cylinderSerialNo: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(i)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-neutral-400" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          </div>

          <div>
            <Label htmlFor="c-testing">Testing / Compliance Note (optional)</Label>
            <Textarea
              id="c-testing"
              className="mt-2"
              value={testingNote}
              onChange={(e) => setTestingNote(e.target.value)}
              placeholder="e.g. Hydraulically tested and found satisfactory."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button onClick={submit} disabled={saving}>
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Generate Certificate"}
            </Button>
            <Button variant="outline" onClick={previewPdf} disabled={previewLoading}>
              <Eye className="h-4 w-4" />
              {previewLoading ? "Building preview…" : "Preview PDF"}
            </Button>
            {isEditing && (
              <Button variant="ghost" onClick={() => setView("list")} disabled={saving}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Generate a supply/warranty certificate for a customer&apos;s fire extinguisher(s).
        </p>
        <Button size="sm" onClick={startCreate}>
          <Plus className="h-4 w-4" />
          New Certificate
        </Button>
      </div>

      {loading && <p className="text-sm text-neutral-500">Loading…</p>}

      <div className="space-y-2">
        {certificates.map((c) => (
          <Card key={c.certificateNumber}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-neutral-900">{c.certificateNumber}</p>
                <p className="text-sm text-neutral-500">
                  {c.clientName} &middot; {c.itemCount} item{c.itemCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`/api/certificates/${c.certificateNumber}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileCheck className="h-4 w-4" />
                    PDF
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(c.certificateNumber)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCertificate(c.certificateNumber)}
                  disabled={busyCertNumber === c.certificateNumber}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && certificates.length === 0 && (
          <p className="text-sm text-neutral-500">No certificates yet.</p>
        )}
      </div>
    </div>
  );
}

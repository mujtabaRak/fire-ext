import Link from "next/link";
import { FlameKindling } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { ProductDto } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckBillPanel } from "@/components/bill/CheckBillPanel";
import { GenerateBillPanel } from "@/components/bill/GenerateBillPanel";

export const dynamic = "force-dynamic";

export default async function BillPage() {
  const products = await prisma.product.findMany({ orderBy: { sizeKg: "asc" } });
  const productDtos: ProductDto[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    sizeKg: p.sizeKg,
    type: p.type,
    coverageAreaSqFt: p.coverageAreaSqFt,
    fireClasses: p.fireClasses.split(","),
    price: p.price,
    useCase: p.useCase,
  }));

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900">
            <FlameKindling className="h-6 w-6 text-orange-600" />
            FireGuard
          </Link>
          <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-orange-600">
            &larr; Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <h1 className="text-3xl font-bold text-neutral-900">Billing</h1>
        <p className="mt-2 text-neutral-500">Check an existing bill, or generate a new one.</p>

        <Tabs defaultValue="check" className="mt-8">
          <TabsList>
            <TabsTrigger value="check">Check Bill</TabsTrigger>
            <TabsTrigger value="generate">Generate Bill</TabsTrigger>
          </TabsList>
          <TabsContent value="check">
            <CheckBillPanel />
          </TabsContent>
          <TabsContent value="generate">
            <GenerateBillPanel products={productDtos} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

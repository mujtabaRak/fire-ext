import { prisma } from "@/lib/prisma";
import type { ProductDto } from "@/lib/types";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AmcPlans } from "@/components/landing/AmcPlans";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sizeKg: "asc" },
  });
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
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <ProductShowcase products={productDtos} />
      <HowItWorks />
      <AmcPlans />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}

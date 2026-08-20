-- CreateEnum
CREATE TYPE "FireClass" AS ENUM ('A', 'B', 'C', 'K');

-- CreateEnum
CREATE TYPE "ExtinguisherType" AS ENUM ('ABC', 'CO2', 'HCFC_123', 'FOAM', 'WET_CHEMICAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('unpaid', 'payment_pending', 'paid');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('upi_manual');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sizeKg" DOUBLE PRECISION NOT NULL,
    "type" "ExtinguisherType" NOT NULL,
    "coverageAreaSqFt" INTEGER NOT NULL,
    "fireClasses" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "useCase" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'upi_manual',
    "upiUtr" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_invoiceNumber_key" ON "Bill"("invoiceNumber");

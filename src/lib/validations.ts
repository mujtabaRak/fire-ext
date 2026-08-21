import { z } from "zod";

export const billItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(1000),
});

export const generateBillSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  billingAddress: z.string().trim().min(5).max(500),
  shippingAddress: z.string().trim().min(5).max(500),
  items: z.array(billItemSchema).min(1, "Add at least one line item"),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const checkBillSchema = z.object({
  invoiceNumber: z.string().trim().min(3).max(40),
});

export const submitUtrSchema = z.object({
  invoiceNumber: z.string().trim().min(3).max(40),
  utr: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,25}$/, "Enter a valid UPI transaction reference (UTR)"),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1),
});

export const adminMarkPaidSchema = z.object({
  invoiceNumber: z.string().trim().min(3).max(40),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  type: z.enum(["ABC", "CO2", "HCFC_123", "FOAM", "WET_CHEMICAL"]),
  sizeKg: z.coerce.number().positive().max(1000),
  price: z.coerce.number().min(0),
  coverageAreaSqFt: z.coerce.number().int().positive().max(1000000),
  fireClasses: z.array(z.enum(["A", "B", "C", "K"])).min(1, "Select at least one fire class"),
  useCase: z.string().trim().min(2).max(300),
  active: z.boolean().optional(),
});

export const productUpdateSchema = productSchema.partial();

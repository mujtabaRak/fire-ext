export type PaymentStatus = "unpaid" | "payment_pending" | "paid";

export type BillLineItemDto = {
  productId: string;
  productName: string;
  sizeKg: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type BillDetailsDto = {
  invoiceNumber: string;
  customerName: string;
  billingAddress: string;
  shippingAddress: string;
  items: BillLineItemDto[];
  taxRate: number;
  discount: number;
  subtotal: number;
  total: number;
  notes: string | null;
  invoiceDate: string;
  dueDate: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: "upi_manual";
  upiUtr: string | null;
  paidAt: string | null;
  upiLink: string | null;
};

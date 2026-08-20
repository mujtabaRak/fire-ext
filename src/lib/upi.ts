export function buildUpiLink(params: { amount: number; invoiceNumber: string }): string {
  const vpa = process.env.UPI_VPA;
  const payeeName = process.env.UPI_PAYEE_NAME ?? "Business";
  if (!vpa) {
    throw new Error("UPI_VPA env var is required");
  }

  const query = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: params.amount.toFixed(2),
    tn: params.invoiceNumber,
    cu: "INR",
  });

  return `upi://pay?${query.toString()}`;
}

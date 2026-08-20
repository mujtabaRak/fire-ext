import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type PdfLineItem = {
  productName: string;
  sizeKg: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type PdfBillData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  customerName: string;
  customerPhone: string;
  billingAddress: string;
  shippingAddress: string;
  items: PdfLineItem[];
  taxRate: number;
  discount: number;
  subtotal: number;
  total: number;
  notes: string | null;
  paymentStatus: string;
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#171717" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  companyName: { fontSize: 18, fontWeight: 700, color: "#c2410c" },
  companyMeta: { fontSize: 9, color: "#525252", marginTop: 4 },
  invoiceTitle: { fontSize: 16, fontWeight: 700, textAlign: "right" },
  invoiceMeta: { fontSize: 9, color: "#525252", textAlign: "right", marginTop: 4 },
  addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  addressBlock: { width: "48%" },
  addressLabel: { fontSize: 9, fontWeight: 700, color: "#737373", marginBottom: 4 },
  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #e5e5e5",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #f0f0f0",
    paddingVertical: 6,
  },
  colProduct: { width: "40%" },
  colSize: { width: "15%", textAlign: "right" },
  colQty: { width: "15%", textAlign: "right" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "15%", textAlign: "right" },
  headerCell: { fontWeight: 700, color: "#525252" },
  totalsBlock: { marginTop: 16, alignSelf: "flex-end", width: "45%" },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsLabel: { color: "#525252" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTop: "1px solid #e5e5e5",
    marginTop: 4,
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 700 },
  grandTotalValue: { fontSize: 12, fontWeight: 700, color: "#c2410c" },
  paymentBadge: {
    marginTop: 24,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: 9,
    fontWeight: 700,
  },
  notes: { marginTop: 20, fontSize: 9, color: "#525252" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#a3a3a3",
  },
});

function formatInr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function paymentLabel(status: string): string {
  if (status === "paid") return "PAID";
  if (status === "payment_pending") return "PAYMENT PENDING VERIFICATION";
  return "UNPAID";
}

export function BillDocument({ bill }: { bill: PdfBillData }) {
  const taxAmount = (bill.subtotal - bill.discount) * (bill.taxRate / 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.companyName}>FireGuard Extinguishers</Text>
            <Text style={styles.companyMeta}>12 Industrial Estate Road, Pune, MH 411001</Text>
            <Text style={styles.companyMeta}>support@fireguard.example · +91 98765 43210</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>{bill.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {bill.invoiceDate}</Text>
            {bill.dueDate ? <Text style={styles.invoiceMeta}>Due: {bill.dueDate}</Text> : null}
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>BILLED TO</Text>
            <Text>{bill.customerName}</Text>
            <Text>{bill.customerPhone}</Text>
            <Text>{bill.billingAddress}</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>SHIP TO</Text>
            <Text>{bill.shippingAddress}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colProduct, styles.headerCell]}>Product</Text>
            <Text style={[styles.colSize, styles.headerCell]}>Size</Text>
            <Text style={[styles.colQty, styles.headerCell]}>Qty</Text>
            <Text style={[styles.colPrice, styles.headerCell]}>Unit Price</Text>
            <Text style={[styles.colTotal, styles.headerCell]}>Total</Text>
          </View>
          {bill.items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.colProduct}>{item.productName}</Text>
              <Text style={styles.colSize}>{item.sizeKg}kg</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatInr(item.unitPrice)}</Text>
              <Text style={styles.colTotal}>{formatInr(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text>{formatInr(bill.subtotal)}</Text>
          </View>
          {bill.discount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Discount</Text>
              <Text>-{formatInr(bill.discount)}</Text>
            </View>
          )}
          {bill.taxRate > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax ({bill.taxRate}%)</Text>
              <Text>{formatInr(taxAmount)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatInr(bill.total)}</Text>
          </View>
        </View>

        <Text style={styles.paymentBadge}>{paymentLabel(bill.paymentStatus)}</Text>

        {bill.notes ? <Text style={styles.notes}>Notes: {bill.notes}</Text> : null}

        <Text style={styles.footer}>
          Thank you for your business. For queries, contact support@fireguard.example.
        </Text>
      </Page>
    </Document>
  );
}

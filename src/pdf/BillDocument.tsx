import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";

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

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  invoiceMeta: { fontSize: 8, color: "#a3a3a3", textAlign: "right" },
  statusBadge: {
    marginTop: 4,
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 700,
  },

  headerCenter: { alignItems: "center", marginTop: -8, marginBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  companyName: { fontSize: 20, fontWeight: 700, color: "#dc2626" },
  billInvoiceTitle: { fontSize: 12, color: "#404040", marginTop: 2 },

  dateRow: { marginBottom: 14 },
  label: { fontWeight: 700 },

  billToBlock: { marginBottom: 20 },
  addressLabel: { fontWeight: 700, marginBottom: 4 },

  table: { marginTop: 4, borderTop: "1px solid #171717" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #d4d4d4",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e5e5",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  colSNo: { width: "8%" },
  colItems: { width: "44%" },
  colQty: { width: "12%", textAlign: "center" },
  colPrice: { width: "18%", textAlign: "right" },
  colAmount: { width: "18%", textAlign: "right" },
  headerCell: { fontWeight: 700 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTop: "1px solid #171717",
  },
  totalsBlock: { alignSelf: "flex-end", width: "60%", marginTop: -1 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsLabel: { color: "#525252" },
  grandTotalLabel: { fontSize: 12, fontWeight: 700 },
  grandTotalValue: { fontSize: 12, fontWeight: 700 },

  bottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 36 },
  termsBlock: { width: "58%" },
  termsHeading: { fontWeight: 700, marginBottom: 6 },
  termsLine: { marginBottom: 3, color: "#404040" },
  notesLine: { marginTop: 6, color: "#404040" },

  signatureBlock: { width: "36%", alignItems: "flex-end" },
  signatureLine: { borderTop: "1px solid #a3a3a3", width: "100%", marginTop: 28, marginBottom: 4 },
  signatureCaption: { fontSize: 8, color: "#737373", textAlign: "right" },
  signatureCompany: { marginTop: 10, fontWeight: 700, textAlign: "right" },
  signatureRole: { fontSize: 9, color: "#525252", textAlign: "right" },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
  },
});

function formatInr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function paymentBadgeStyle(status: string) {
  if (status === "paid") return { backgroundColor: "#dcfce7", color: "#166534" };
  if (status === "payment_pending") return { backgroundColor: "#fef9c3", color: "#854d0e" };
  return { backgroundColor: "#fee2e2", color: "#991b1b" };
}

function paymentLabel(status: string): string {
  if (status === "paid") return "PAID";
  if (status === "payment_pending") return "PAYMENT PENDING VERIFICATION";
  return "UNPAID";
}

function PdfLogo() {
  return (
    <Svg width={28} height={28} viewBox="0 0 40 40">
      <Circle cx={20} cy={20} r={19} fill="#ffffff" stroke="#dc2626" strokeWidth={1.5} />
      <Path
        d="M20 8c-1.5 3-5 5.5-5 10a5 5 0 0 0 10 0c0-1.3-.5-2.2-1-3.1c-.2 1.6-1 2.5-1.8 3.1c.3-2.6-1-4.2-2.2-6.5c.3 1.7-.2 2.8-1.3 4c-1.1 1.2-1.7 2.3-1.7 3.5"
        fill="#dc2626"
      />
    </Svg>
  );
}

export function BillDocument({ bill }: { bill: PdfBillData }) {
  const taxAmount = (bill.subtotal - bill.discount) * (bill.taxRate / 100);
  const showShipping = bill.shippingAddress && bill.shippingAddress !== bill.billingAddress;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <View />
          <View>
            <Text style={styles.invoiceMeta}>Invoice No: {bill.invoiceNumber}</Text>
            <Text style={[styles.statusBadge, paymentBadgeStyle(bill.paymentStatus)]}>
              {paymentLabel(bill.paymentStatus)}
            </Text>
          </View>
        </View>

        <View style={styles.headerCenter}>
          <View style={styles.headerRow}>
            <PdfLogo />
            <Text style={styles.companyName}>DINERS FIRE ENGINEERS</Text>
          </View>
          <Text style={styles.billInvoiceTitle}>BILL / INVOICE</Text>
        </View>

        <View style={styles.dateRow}>
          <Text>
            <Text style={styles.label}>Date: </Text>
            {bill.invoiceDate}
            {bill.dueDate ? `      Due: ${bill.dueDate}` : ""}
          </Text>
        </View>

        <View style={styles.billToBlock}>
          <Text style={styles.addressLabel}>Bill To:</Text>
          <Text>{bill.customerName}</Text>
          <Text>{bill.customerPhone}</Text>
          <Text>{bill.billingAddress}</Text>
        </View>

        {showShipping && (
          <View style={styles.billToBlock}>
            <Text style={styles.addressLabel}>Ship To:</Text>
            <Text>{bill.shippingAddress}</Text>
          </View>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colSNo, styles.headerCell]}>S.No.</Text>
            <Text style={[styles.colItems, styles.headerCell]}>ITEMS</Text>
            <Text style={[styles.colQty, styles.headerCell]}>QTY</Text>
            <Text style={[styles.colPrice, styles.headerCell]}>Price/unit</Text>
            <Text style={[styles.colAmount, styles.headerCell]}>AMOUNT</Text>
          </View>
          {bill.items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.colSNo}>{i + 1}</Text>
              <Text style={styles.colItems}>{item.productName}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatInr(item.unitPrice)}</Text>
              <Text style={styles.colAmount}>{formatInr(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {(bill.discount > 0 || bill.taxRate > 0) && (
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
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>TOTAL</Text>
          <Text style={styles.grandTotalValue}>{formatInr(bill.total)}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.termsBlock}>
            <Text style={styles.termsHeading}>Terms & Conditions</Text>
            <Text style={styles.termsLine}>
              Delivery period and point: Free collection and delivery within 3 days [72hrs]
            </Text>
            <Text style={styles.termsLine}>
              Payment: Immediate after delivery [All modes accepted]
            </Text>
            {bill.notes && <Text style={styles.notesLine}>Notes: {bill.notes}</Text>}
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Author&apos;s Signature</Text>
            <Text style={styles.signatureCompany}>For DINERS FIRE ENGINEERS</Text>
            <Text style={styles.signatureRole}>Sales Manager</Text>
          </View>
        </View>

        <Text style={styles.footer}>Thanks for business with us!!!</Text>
      </Page>
    </Document>
  );
}

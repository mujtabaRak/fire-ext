import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PdfLogo } from "./PdfLogo";

export type PdfCertificateItem = {
  description: string;
  yearOfManufacturing: number;
  qty: number;
  refillingDueDate: string;
  cylinderSerialNo: string;
};

export type PdfCertificateData = {
  certificateNumber: string;
  certificateDate: string;
  clientName: string;
  clientAddress: string;
  saleDate: string;
  warrantyPeriod: string;
  testingNote: string | null;
  items: PdfCertificateItem[];
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#171717" },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  meta: { fontSize: 8, color: "#a3a3a3", textAlign: "right" },

  headerCenter: { alignItems: "center", marginTop: -8, marginBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  companyName: { fontSize: 20, fontWeight: 700, color: "#dc2626" },
  docTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 10,
    textDecoration: "underline",
  },
  reportNo: { fontSize: 9, color: "#525252", marginTop: 4, textDecoration: "underline" },

  dateRow: { marginTop: 14, marginBottom: 14, textAlign: "right" },
  label: { fontWeight: 700 },

  clientBlock: { marginBottom: 10 },
  clientLabel: { fontWeight: 700, marginBottom: 4 },

  statement: { marginBottom: 12, color: "#262626", lineHeight: 1.4 },

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
  colSNo: { width: "7%" },
  colDesc: { width: "31%" },
  colYear: { width: "16%", textAlign: "center" },
  colQty: { width: "10%", textAlign: "center" },
  colRefill: { width: "18%", textAlign: "center" },
  colSerial: { width: "18%", textAlign: "center" },
  headerCell: { fontWeight: 700, fontSize: 8.5 },

  bottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 36 },
  signatureBlock: { width: "45%", alignItems: "flex-start" },
  signatureFor: { marginBottom: 40, fontWeight: 700 },
  signatureLine: { borderTop: "1px solid #a3a3a3", width: "100%", marginBottom: 4 },
  signatureCaption: { fontSize: 8, color: "#737373" },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#a3a3a3",
  },
});

export function CertificateDocument({ cert }: { cert: PdfCertificateData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <View />
          <Text style={styles.meta}>Certificate No: {cert.certificateNumber}</Text>
        </View>

        <View style={styles.headerCenter}>
          <View style={styles.headerRow}>
            <PdfLogo />
            <Text style={styles.companyName}>DINERS FIRE ENGINEERS</Text>
          </View>
          <Text style={styles.docTitle}>CERTIFICATE</Text>
          <Text style={styles.reportNo}>Report No. {cert.certificateNumber}</Text>
        </View>

        <View style={styles.dateRow}>
          <Text>
            <Text style={styles.label}>Date: </Text>
            {cert.certificateDate}
          </Text>
        </View>

        <View style={styles.clientBlock}>
          <Text style={styles.clientLabel}>Client Name: {cert.clientName}</Text>
          <Text>Address: {cert.clientAddress}</Text>
        </View>

        <Text style={styles.statement}>
          This is certified that the under-noted fire extinguisher(s) have been supplied by us
          and are warranted for a period of {cert.warrantyPeriod} from the date of sale.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colSNo, styles.headerCell]}>SR.NO.</Text>
            <Text style={[styles.colDesc, styles.headerCell]}>DESCRIPTION</Text>
            <Text style={[styles.colYear, styles.headerCell]}>YEAR OF MANUFACTURING</Text>
            <Text style={[styles.colQty, styles.headerCell]}>QTY</Text>
            <Text style={[styles.colRefill, styles.headerCell]}>REFILLING DUE DATE</Text>
            <Text style={[styles.colSerial, styles.headerCell]}>CYLINDER SR. NO.</Text>
          </View>
          {cert.items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.colSNo}>{i + 1}</Text>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colYear}>{item.yearOfManufacturing}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colRefill}>{item.refillingDueDate}</Text>
              <Text style={styles.colSerial}>{item.cylinderSerialNo}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.statement}>
          The above said fire extinguisher(s) have been supplied to the client on dated:{" "}
          {cert.saleDate}.
        </Text>

        {cert.testingNote && <Text style={styles.statement}>{cert.testingNote}</Text>}

        <View style={styles.bottomRow}>
          <View />
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureFor}>For: DINERS FIRE ENGINEERS</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Authorised Signature</Text>
          </View>
        </View>

        <Text style={styles.footer}>Diners Fire Engineers - Fire Safety Certificate</Text>
      </Page>
    </Document>
  );
}

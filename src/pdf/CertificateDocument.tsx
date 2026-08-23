import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  BRAND,
  PAGE_BORDER,
  PdfLetterheadHeader,
  PdfWatermark,
  PdfFooterBar,
  PdfCornerRibbonTop,
} from "./PdfBranding";

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
  page: { fontSize: 10, fontFamily: "Helvetica", color: "#171717", ...PAGE_BORDER },
  content: { padding: 32, paddingBottom: 90 },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  meta: { fontSize: 8, color: "#a3a3a3" },
  dateBold: { fontSize: 11, fontWeight: 700 },

  certTitleBlock: { alignItems: "center", marginBottom: 4 },
  certTitle: {
    fontFamily: "Times-Bold",
    fontSize: 32,
    color: BRAND.black,
    textAlign: "center",
    textDecoration: "underline",
  },
  reportNo: { fontSize: 9, color: "#737373", marginTop: 4, textAlign: "center" },

  clientBlock: { marginTop: 18, marginBottom: 14 },
  clientName: {
    fontFamily: "Poppins-Bold",
    fontSize: 26,
    color: "#171717",
  },
  address: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: "#171717",
    textAlign: "center",
    marginTop: 8,
  },

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
});

export function CertificateDocument({ cert }: { cert: PdfCertificateData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfWatermark />
        <PdfCornerRibbonTop />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.meta}>Certificate No: {cert.certificateNumber}</Text>
          </View>

          <PdfLetterheadHeader />

          <View style={styles.certTitleBlock}>
            <Text style={styles.certTitle}>CERTIFICATE</Text>
            <Text style={styles.reportNo}>Report No. {cert.certificateNumber}</Text>
          </View>

          <View style={styles.topRow}>
            <View />
            <Text style={styles.dateBold}>Date: {cert.certificateDate}</Text>
          </View>

          <View style={styles.clientBlock}>
            <Text style={styles.clientName}>CLIENT NAME: {cert.clientName}</Text>
            <Text style={styles.address}>ADDRESS: {cert.clientAddress}</Text>
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
        </View>

        <PdfFooterBar />
      </Page>
    </Document>
  );
}

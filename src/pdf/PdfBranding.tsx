import { Svg, Path, Polygon, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

export const BRAND = {
  red: "#dc2626",
  green: "#3f4a33",
  pink: "#e0356b",
  pinkDark: "#c22456",
  black: "#171717",
};

export const COMPANY_ADDRESS = "C/6/5, 4:3, Sector 6, CBD Belapur, Navi Mumbai - 400614";
export const COMPANY_PHONE = "9833569520 (WhatsApp) · 9820560737";
export const COMPANY_EMAIL = "dinersfire@gmail.com";
export const COMPANY_TAGLINE = "SUPPLIER OF FIRE FIGHTING EQUIPMENTS";

export const PAGE_BORDER: Style = {
  borderWidth: 3,
  borderColor: BRAND.red,
  borderStyle: "solid",
};

const FLAME_PATH =
  "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";

export function FlameMark({
  size = 40,
  color = BRAND.red,
  opacity = 1,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={FLAME_PATH} fill={color} fillOpacity={opacity} />
    </Svg>
  );
}

function CornerRibbon({ corner }: { corner: "top" | "bottom" }) {
  const top = corner === "top";
  return (
    <Svg
      fixed
      width={140}
      height={40}
      viewBox="0 0 140 40"
      style={{
        position: "absolute",
        [top ? "top" : "bottom"]: 0,
        right: 0,
      }}
    >
      <Polygon points="60,0 100,0 70,40 30,40" fill={BRAND.pink} />
      <Polygon points="100,0 140,0 110,40 70,40" fill={BRAND.pinkDark} />
      <Polygon points="140,0 140,40 110,40" fill={BRAND.black} />
    </Svg>
  );
}

const watermarkStyles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 90,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  group: { alignItems: "center" },
  dfe: {
    marginTop: 6,
    fontSize: 60,
    fontWeight: 700,
    color: BRAND.green,
    opacity: 0.07,
    letterSpacing: 4,
  },
});

export function PdfWatermark() {
  return (
    <View style={watermarkStyles.wrap} fixed>
      <View style={watermarkStyles.group}>
        <FlameMark size={90} color={BRAND.red} opacity={0.07} />
        <Text style={watermarkStyles.dfe}>DFE</Text>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  wrap: { alignItems: "center", marginBottom: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  nameBlock: { alignItems: "flex-start" },
  companyName: {
    fontSize: 19,
    fontWeight: 700,
    fontFamily: "Times-Bold",
    color: BRAND.green,
    lineHeight: 1.05,
  },
  tagline: {
    fontSize: 8,
    color: BRAND.pink,
    letterSpacing: 2,
    marginTop: 3,
    fontWeight: 700,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: BRAND.black,
    marginTop: 12,
    textDecoration: "underline",
  },
  docSubtitle: {
    fontSize: 9,
    color: "#525252",
    marginTop: 3,
    textDecoration: "underline",
  },
});

export function PdfLetterheadHeader({
  docTitle,
  docSubtitle,
}: {
  docTitle: string;
  docSubtitle?: string;
}) {
  return (
    <View style={headerStyles.wrap}>
      <View style={headerStyles.row}>
        <FlameMark size={38} />
        <View style={headerStyles.nameBlock}>
          <Text style={headerStyles.companyName}>DINERS FIRE</Text>
          <Text style={headerStyles.companyName}>ENGINEERS</Text>
          <Text style={headerStyles.tagline}>{COMPANY_TAGLINE}</Text>
        </View>
      </View>
      <Text style={headerStyles.docTitle}>{docTitle}</Text>
      {docSubtitle && <Text style={headerStyles.docSubtitle}>{docSubtitle}</Text>}
    </View>
  );
}

const footerStyles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND.black,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 150,
  },
  line: { color: "#ffffff", fontSize: 8.5, marginBottom: 2 },
});

export function PdfFooterBar() {
  return (
    <View style={footerStyles.bar} fixed>
      <Text style={footerStyles.line}>Add. {COMPANY_ADDRESS}</Text>
      <Text style={footerStyles.line}>Contact No. {COMPANY_PHONE}</Text>
      <Text style={footerStyles.line}>E-mail: {COMPANY_EMAIL}</Text>
      <CornerRibbon corner="bottom" />
    </View>
  );
}

export function PdfCornerRibbonTop() {
  return <CornerRibbon corner="top" />;
}

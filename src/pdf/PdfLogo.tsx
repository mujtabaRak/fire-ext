import { Svg, Path, Circle } from "@react-pdf/renderer";

export function PdfLogo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx={20} cy={20} r={19} fill="#ffffff" stroke="#dc2626" strokeWidth={1.5} />
      <Path
        d="M20 8c-1.5 3-5 5.5-5 10a5 5 0 0 0 10 0c0-1.3-.5-2.2-1-3.1c-.2 1.6-1 2.5-1.8 3.1c.3-2.6-1-4.2-2.2-6.5c.3 1.7-.2 2.8-1.3 4c-1.1 1.2-1.7 2.3-1.7 3.5"
        fill="#dc2626"
      />
    </Svg>
  );
}

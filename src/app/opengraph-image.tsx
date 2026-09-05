import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Daksh Adhikari — Mechanical engineering and research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#17191c", color: "#f4f0e8", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#f5a623", fontSize: 25, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, border: "2px solid #f5a623", borderRadius: 8, fontSize: 21, fontWeight: 700 }}>DA</span>
        <span>Mechanical engineering · Georgia Tech</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.04em" }}>Daksh Adhikari</div>
        <div style={{ maxWidth: 820, fontSize: 30, lineHeight: 1.35, color: "#b8b5ae" }}>Research, projects, and publications on thermal systems and machine learning.</div>
      </div>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", borderTop: "1px solid #3b3d3e", paddingTop: 20, fontSize: 20, color: "#96938c" }}><span>portfolio.dakshhomelab.com</span><span style={{ color: "#f5a623" }}>DA / 01</span></div>
    </div>,
    size,
  );
}

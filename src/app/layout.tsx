import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.dakshhomelab.com"),
  title: "Daksh Adhikari",
  description: "Mechanical engineering PhD student at Georgia Tech working on flow-boiling instabilities and active control.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

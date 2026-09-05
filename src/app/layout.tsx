import SidebarNav from "@/components/sidebar-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "600", "700"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: { default: DATA.name, template: `%s | ${DATA.name}` },
  description: DATA.description,
  openGraph: { title: DATA.name, description: DATA.description, url: DATA.url, siteName: DATA.name, locale: "en_US", type: "website" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  twitter: { title: DATA.name, card: "summary_large_image" },
};

const socialLinks = Object.values(DATA.contact.social)
  .filter((social) => social.navbar && social.url !== "#")
  .map((social) => ({ name: social.name, url: social.url, mark: social.name === "LinkedIn" ? "in" : social.name === "Google Scholar" ? "GS" : "GH" }));
const projectCategories = Object.fromEntries(
  [...DATA.academicProjects, ...DATA.personalProjects].map((project) => [project.slug, String("category" in project && project.category ? project.category : "personal")]),
);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={cn("min-h-screen bg-background font-sans antialiased", geist.variable, geistMono.variable, bricolage.variable)}>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark"><TooltipProvider delayDuration={0}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div id="main-content" tabIndex={-1} className="relative min-h-dvh px-5 pb-16 pt-24 outline-none sm:px-8 sm:pb-24 sm:pt-28 lg:ml-64 lg:px-12 lg:pt-16">
        <div className="mx-auto w-full max-w-4xl xl:max-w-5xl">{children}</div>
      </div>
      <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground sm:px-8 lg:ml-64">© {new Date().getFullYear()} {DATA.name}</footer>
      <SidebarNav name={DATA.name} initials={DATA.initials} socialLinks={socialLinks} projectCategories={projectCategories} />
    </TooltipProvider></ThemeProvider>
  </body></html>;
}

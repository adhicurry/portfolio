"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SocialLink = { name: string; url: string; mark: string };
type SidebarNavProps = {
  name: string;
  initials: string;
  socialLinks: SocialLink[];
  projectCategories: Record<string, string>;
};

const tabs = [
  { href: "/", label: "Home", match: (pathname: string) => pathname === "/" },
  {
    href: "/research",
    label: "Research",
    match: (pathname: string, categories: Record<string, string>) => {
      if (pathname === "/research") return true;
      const slug = pathname.match(/^\/projects\/([^/]+)/)?.[1];
      return Boolean(slug && ["phd", "industry", "undergraduate"].includes(categories[slug]));
    },
  },
  {
    href: "/projects",
    label: "Projects",
    match: (pathname: string, categories: Record<string, string>) => {
      if (pathname === "/projects" || pathname.startsWith("/projects/")) {
        const slug = pathname.match(/^\/projects\/([^/]+)/)?.[1];
        return !slug || ["independent", "personal"].includes(categories[slug]);
      }
      return false;
    },
  },
  { href: "/publications", label: "Publications", match: (pathname: string) => pathname.startsWith("/publications") || pathname.startsWith("/research/publications/") },
  { href: "/contact", label: "Contact", match: (pathname: string) => pathname.startsWith("/contact") },
] as const;

function NavLinks({ pathname, categories, onNavigate }: { pathname: string; categories: Record<string, string>; onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="grid gap-1">
      {tabs.map((tab) => {
        const active = tab.match(pathname, categories);
        return (
          <Link key={tab.href} href={tab.href} onClick={onNavigate} aria-current={active ? "page" : undefined}
            className={cn("group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground")}>
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full transition-colors", active ? "bg-primary-foreground" : "bg-border group-hover:bg-primary")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SocialLinks({ links }: { links: SocialLink[] }) {
  return <div className="flex items-center gap-2" aria-label="Social links">
    {links.map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}
      className="inline-flex size-9 items-center justify-center rounded-md border border-sidebar-border text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:border-primary/60 hover:bg-sidebar-accent hover:text-primary">{social.mark}</a>)}
  </div>;
}

function SidebarContent({ name, initials, socialLinks, pathname, projectCategories: categories, onNavigate }: SidebarNavProps & { pathname: string; onNavigate?: () => void }) {
  return <div className="flex h-full flex-col">
    <Link href="/" onClick={onNavigate} className="mb-10 flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/50 bg-primary/10 font-heading text-sm font-semibold text-primary">{initials}</span>
      <span className="min-w-0"><span className="block truncate font-heading text-base font-semibold">{name}</span><span className="block text-xs text-muted-foreground">Georgia Tech / Mechanical engineering</span></span>
    </Link>
    <NavLinks pathname={pathname} categories={categories} onNavigate={onNavigate} />
    <div className="mt-auto border-t border-sidebar-border pt-5"><p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Elsewhere</p><SocialLinks links={socialLinks} /></div>
  </div>;
}

export default function SidebarNav(props: SidebarNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Route changes (including browser back/forward) must dismiss the mobile sheet.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) { document.body.style.overflow = ""; return; }
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = [...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const next = event.shiftKey ? focusable[0] : focusable[focusable.length - 1];
      if (document.activeElement === next || !menuRef.current.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; previousFocus.current?.focus(); };
  }, [open]);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  return <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar px-6 py-8 lg:block"><SidebarContent {...props} pathname={pathname} /></aside>
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur-xl lg:hidden">
      <Link href="/" className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={close}><span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/50 bg-primary/10 font-heading text-xs font-semibold text-primary">{props.initials}</span><span className="truncate font-heading text-sm font-semibold">{props.name}</span></Link>
      <button ref={triggerRef} type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-sidebar-border text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </header>
    {open && <><button type="button" aria-label="Close navigation menu" onClick={close} className="fixed inset-x-0 bottom-0 top-16 z-40 bg-background/75 lg:hidden" /><aside ref={menuRef} id="mobile-navigation" aria-label="Mobile navigation" className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-sidebar-border bg-sidebar px-5 py-6 shadow-xl lg:hidden"><SidebarContent {...props} pathname={pathname} onNavigate={close} /></aside></>}
  </>;
}

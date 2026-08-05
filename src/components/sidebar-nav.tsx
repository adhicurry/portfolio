"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const tabs = [
  { href: "/", label: "Overview", match: (pathname: string) => pathname === "/" },
  { href: "/research", label: "Research", match: (pathname: string) => pathname.startsWith("/research") },
  { href: "/projects", label: "Projects", match: (pathname: string) => pathname.startsWith("/projects") },
  { href: "/contact", label: "Contact", match: (pathname: string) => pathname.startsWith("/contact") },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="grid gap-1">
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-primary-foreground" : "bg-border")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SocialLinks() {
  return (
    <div className="flex items-center gap-2" aria-label="Social links">
      {Object.entries(DATA.contact.social)
        .filter(([, social]) => social.navbar)
        .map(([name, social]) => {
          const Icon = social.icon;
          return (
            <a
              key={name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-sidebar-accent hover:text-primary"
            >
              <Icon className="size-4" />
            </a>
          );
        })}
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/" onClick={onNavigate} className="mb-10 flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-11 border border-primary/30 ring-2 ring-border">
          <AvatarImage src={DATA.avatarUrl} alt={DATA.name} />
          <AvatarFallback>{DATA.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold">{DATA.name}</p>
          <p className="text-xs text-muted-foreground">PhD candidate · builder</p>
        </div>
      </Link>
      <NavLinks pathname={pathname} onNavigate={onNavigate} />
      <div className="mt-auto border-t border-sidebar-border pt-5">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Elsewhere</p>
        <SocialLinks />
      </div>
    </div>
  );
}

export default function SidebarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar/95 px-6 py-8 backdrop-blur-xl lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Avatar className="size-9 border border-primary/30">
            <AvatarImage src={DATA.avatarUrl} alt={DATA.name} />
            <AvatarFallback>{DATA.initials}</AvatarFallback>
          </Avatar>
          <span className="font-heading text-sm font-semibold">{DATA.name}</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-sidebar-border text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <>
          <button type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-background/70 lg:hidden" />
          <aside id="mobile-navigation" className="fixed inset-x-0 top-16 z-50 border-b border-sidebar-border bg-sidebar px-5 py-6 shadow-xl lg:hidden">
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}

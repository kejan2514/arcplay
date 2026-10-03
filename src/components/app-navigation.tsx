"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/automations", label: "Automations" },
  { href: "/bridge", label: "Bridge" },
  { href: "/activity", label: "Activity" },
];

export default function AppNavigation() {
  const pathname = usePathname();
  return (
    <header className="border-b border-slate-800 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-slate-950">A</span>ArcPlay
        </Link>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">Arc Testnet · Demo</span>
        <nav aria-label="Main navigation" className="flex w-full flex-wrap gap-1 sm:w-auto">
          {links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${pathname === href ? "bg-cyan-400/10 text-cyan-200" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}

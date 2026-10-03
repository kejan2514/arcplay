import Link from "next/link";
export default function Footer() {
  return <footer className="mx-auto mt-10 w-full max-w-7xl border-t border-slate-800 px-5 py-8 text-sm text-slate-500"><div className="flex flex-wrap justify-between gap-5"><p>ArcPlay · Payments powered by ArcPay</p><nav aria-label="Resources" className="flex flex-wrap gap-5"><Link href="/developers" className="hover:text-cyan-200">Infrastructure</Link><Link href="/ecosystem" className="hover:text-cyan-200">Ecosystem</Link><a href="https://github.com/kejan2514/arcplay" target="_blank" rel="noreferrer" className="hover:text-cyan-200">GitHub ↗</a></nav></div><p className="mt-4 text-xs">Testnet only · No real funds or product delivery · MIT License</p></footer>;
}

"use client";

type ArcSuccessModalProps = {
  open: boolean;
  title: string;
  description: string;
  detail?: string;
  explorerUrl?: string;
  onClose: () => void;
};

export default function ArcSuccessModal({ open, title, description, detail, explorerUrl, onClose }: ArcSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-slate-950/90 px-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="arc-success-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_50%_60%,_rgba(217,70,239,0.14),_transparent_40%)]" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.25rem] border border-cyan-300/25 bg-slate-950/90 p-7 text-center shadow-[0_0_120px_rgba(34,211,238,0.2)] sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(34,211,238,0.08),transparent_80%)]" />
        <button type="button" onClick={onClose} className="absolute right-5 top-5 z-10 rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-400 transition hover:border-cyan-300 hover:text-white">Close</button>

        <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full border border-cyan-300/20 [animation-duration:2.4s]" />
          <span className="absolute h-32 w-32 animate-spin rounded-full border border-transparent border-r-fuchsia-400/70 border-t-cyan-300/80 [animation-duration:4s]" />
          <span className="absolute h-24 w-24 rounded-full bg-cyan-300/10 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/35 bg-slate-900 shadow-[0_0_45px_rgba(34,211,238,0.35)]">
            <span className="bg-gradient-to-br from-white via-cyan-200 to-fuchsia-300 bg-clip-text text-6xl font-black leading-none text-transparent">A</span>
          </div>
          <span className="absolute bottom-1 right-3 flex h-9 w-9 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-400 text-lg font-black text-slate-950">✓</span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">Completed on Arc</p>
        <h2 id="arc-success-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-300">{description}</p>
        {detail ? <p className="mt-3 text-sm font-semibold text-emerald-300">{detail}</p> : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {explorerUrl ? <a href={explorerUrl} target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110">View on ArcScan ↗</a> : null}
          <button type="button" onClick={onClose} className={`rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20 ${explorerUrl ? "" : "sm:col-span-2"}`}>Continue with ArcPay</button>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-slate-600">Fast · Programmable · Onchain</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { GAMES } from "@/lib/game-catalog";
import { parseDrafts, validateDraft, WORKFLOW_STORAGE_KEY, type WorkflowDraft } from "@/lib/workflow-drafts";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const field = "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white";

export default function WorkflowBuilder({ initialGameId = "pubg", initialProductId = "60-uc", initialCadence = "weekly", initialDay = 5 }: { initialGameId?: string; initialProductId?: string; initialCadence?: "weekly" | "monthly"; initialDay?: number }) {
  const initialGame = GAMES.find((game) => game.id === initialGameId) ?? GAMES[0];
  const initialProduct = initialGame.products.find((product) => product.id === initialProductId) ?? initialGame.products[0];
  const [draft, setDraft] = useState<WorkflowDraft>({ id: "", gameId: initialGame.id, productId: initialProduct.id, playerId: "", recipient: "", cadence: initialCadence, day: initialDay, perPaymentLimit: initialProduct.price, monthlyLimit: (Number(initialProduct.price) * 5).toFixed(2), state: "draft", updatedAt: "" });
  const [saved, setSaved] = useState<WorkflowDraft[]>([]);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const game = GAMES.find((item) => item.id === draft.gameId) ?? GAMES[0];
  const product = game.products.find((item) => item.id === draft.productId) ?? game.products[0];

  useEffect(() => {
    function load() {
      try { setSaved(parseDrafts(localStorage.getItem(WORKFLOW_STORAGE_KEY))); }
      catch { setMessage("Browser storage is unavailable. Drafts cannot be saved in this browser."); }
      setReady(true);
    }
    const timer = window.setTimeout(load, 0);
    window.addEventListener("storage", load);
    return () => { window.clearTimeout(timer); window.removeEventListener("storage", load); };
  }, []);

  function update(values: Partial<WorkflowDraft>) { setDraft((current) => ({ ...current, ...values })); setMessage(""); }
  function persist(next: WorkflowDraft[]) {
    try { localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(next)); setSaved(next); return true; }
    catch { setMessage("Draft could not be saved. Browser storage is unavailable or full."); return false; }
  }
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateDraft(draft);
    if (error) { setMessage(error); return; }
    const next = { ...draft, id: draft.id || crypto.randomUUID(), updatedAt: new Date().toISOString() };
    if (!draft.id && saved.length >= 50) { setMessage("You have 50 saved drafts. Edit an existing draft to continue."); return; }
    if (persist([next, ...saved.filter((item) => item.id !== next.id)])) { setDraft(next); setMessage("Draft saved in this browser. No schedule is running and no payment will be sent."); }
  }
  function toggle(item: WorkflowDraft) {
    const next: WorkflowDraft = { ...item, state: item.state === "paused" ? "draft" : "paused", updatedAt: new Date().toISOString() };
    if (persist(saved.map((value) => value.id === item.id ? next : value))) {
      if (draft.id === next.id) setDraft(next);
      setMessage(next.state === "paused" ? "Draft marked as paused. No payments are running." : "Draft restored for review. No payments are running.");
    }
  }

  return <section id="workflow-builder" className="mx-auto max-w-7xl scroll-mt-8">
    <div className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">Build your payment draft</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">Set your game, recipient and spending rules. This builder saves a local draft; a scheduler and merchant delivery are not connected.</p></div><span className="rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-200">Draft only</span></div>
      <form onSubmit={save} className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid content-start gap-5 sm:grid-cols-2">
          <label className="text-sm text-slate-300">Game<select className={field} value={draft.gameId} onChange={(event) => { const g = GAMES.find((value) => value.id === event.target.value)!; update({ gameId: g.id, productId: g.products[0].id, perPaymentLimit: g.products[0].price, monthlyLimit: (Number(g.products[0].price) * 5).toFixed(2) }); }}>{GAMES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="text-sm text-slate-300">Package<select className={field} value={product.id} onChange={(event) => update({ productId: event.target.value })}>{game.products.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.price} USDC</option>)}</select></label>
          <label className="text-sm text-slate-300 sm:col-span-2">Demo {game.accountLabel}<input className={field} maxLength={200} required value={draft.playerId} onChange={(event) => update({ playerId: event.target.value })} placeholder="Use a sample identifier; no product is delivered" /></label>
          <label className="text-sm text-slate-300 sm:col-span-2">Allowed recipient wallet<input className={field} required value={draft.recipient} maxLength={42} onChange={(event) => update({ recipient: event.target.value.trim() })} placeholder="0x…" /><span className="mt-2 block text-xs leading-5 text-slate-500">Only this address belongs in the draft. It will not receive a transfer.</span></label>
          <label className="text-sm text-slate-300">Repeat<select className={field} value={draft.cadence} onChange={(event) => update({ cadence: event.target.value as "weekly" | "monthly", day: event.target.value === "weekly" ? 5 : 1 })}><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>
          <label className="text-sm text-slate-300">Schedule day<select className={field} value={draft.day} onChange={(event) => update({ day: Number(event.target.value) })}>{draft.cadence === "weekly" ? days.map((day, i) => <option key={day} value={i}>{day}</option>) : Array.from({ length: 28 }, (_, i) => <option key={i} value={i + 1}>Day {i + 1}</option>)}</select></label>
          <label className="text-sm text-slate-300">Per-payment limit (test USDC)<input className={field} inputMode="decimal" required value={draft.perPaymentLimit} onChange={(event) => update({ perPaymentLimit: event.target.value })} /></label>
          <label className="text-sm text-slate-300">Monthly limit (test USDC)<input className={field} inputMode="decimal" required value={draft.monthlyLimit} onChange={(event) => update({ monthlyLimit: event.target.value })} /></label>
        </div>
        <aside className="rounded-2xl border border-fuchsia-400/20 bg-slate-900/60 p-5">
          <h3 className="font-semibold text-white">Review before saving</h3>
          <dl className="mt-5 space-y-4 text-sm"><div><dt className="text-slate-500">Selection</dt><dd className="mt-1 text-white">{game.name} · {product.label}</dd></div><div><dt className="text-slate-500">Planned schedule</dt><dd className="mt-1 text-white">{draft.cadence === "weekly" ? `Every ${days[draft.day]}` : `Day ${draft.day} of each month`}</dd></div><div><dt className="text-slate-500">Budget policy</dt><dd className="mt-1 text-white">Up to {draft.perPaymentLimit || "—"} per payment · {draft.monthlyLimit || "—"} per month</dd></div><div><dt className="text-slate-500">Recipient</dt><dd className="mt-1 break-all font-mono text-xs text-white">{draft.recipient || "Choose a wallet address"}</dd></div><div><dt className="text-slate-500">Approval rule</dt><dd className="mt-1 text-cyan-200">Explicit wallet approval for every transaction</dd></div><div><dt className="text-slate-500">Execution</dt><dd className="mt-1 text-amber-200">Not connected · no next run scheduled</dd></div></dl>
          <button disabled={!ready} className="mt-6 w-full rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-50">{draft.id ? "Save changes to draft" : "Save workflow draft"}</button>
          {draft.id && <button type="button" className="mt-3 w-full text-sm text-slate-400 hover:text-white" onClick={() => update({ id: "", state: "draft", updatedAt: "" })}>Use as a new draft</button>}
          <p className="mt-4 text-xs leading-6 text-slate-500">Budgets and recipients describe the intended policy. They are not enforced by a smart contract. No autonomous signing or live subscription is enabled.</p>
        </aside>
      </form>
      {message && <p role="status" className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-cyan-200">{message}</p>}
    </div>
    <div className="mt-8"><h2 className="text-xl font-semibold">Saved workflow drafts</h2><p className="mt-2 text-sm text-slate-500">Stored in this browser only. Clearing browser data removes your drafts.</p>
      {!saved.length ? <p className="mt-5 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">{ready ? "Save your first draft above to review it here." : "Loading saved drafts…"}</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{saved.map((item) => { const g = GAMES.find((value) => value.id === item.gameId)!; return <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{g.name} · {g.products.find((value) => value.id === item.productId)?.label}</h3><span className="text-xs text-amber-200">{item.state === "paused" ? "Paused draft" : "Draft · not running"}</span></div><p className="mt-3 text-sm text-slate-400">{item.cadence === "weekly" ? `Every ${days[item.day]}` : `Monthly on day ${item.day}`} · Monthly limit {item.monthlyLimit} test USDC</p><div className="mt-4 flex gap-5"><button type="button" onClick={() => { setDraft(item); setMessage("Draft loaded for editing."); document.getElementById("workflow-builder")?.scrollIntoView(); }} className="text-sm font-semibold text-cyan-300">Edit draft</button><button type="button" onClick={() => toggle(item)} className="text-sm text-slate-400">{item.state === "paused" ? "Restore draft" : "Pause draft"}</button></div></article>; })}</div>}
    </div>
  </section>;
}

"use client";

import { useEffect, useState } from "react";
import { ARC_NETWORK } from "@/lib/arc-network";

type WalletStatus = "idle" | "connecting" | "connected" | "error";

const DISCONNECTED_KEY = "arcplay:wallet-disconnected";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = Number(error.code);
    if (code === 4001) return "Request cancelled in wallet.";
    if (code === -32002) return "A wallet request is already waiting for approval.";
  }

  return "Could not complete the wallet request. Please try again.";
}

function networkLabel(chainId: string) {
  if (!chainId) return "Not detected";
  if (chainId.toLowerCase() === ARC_NETWORK.chainIdHex.toLowerCase()) {
    return ARC_NETWORK.chainName;
  }
  return `Chain ${Number.parseInt(chainId, 16) || "unknown"}`;
}

export default function WalletConnect() {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [hasProvider, setHasProvider] = useState(false);
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [message, setMessage] = useState("");

  const isArc = chainId.toLowerCase() === ARC_NETWORK.chainIdHex.toLowerCase();
  const isReady = Boolean(address) && isArc;

  useEffect(() => {
    const provider = window.ethereum;
    const providerCheck = window.setTimeout(() => setHasProvider(Boolean(provider)), 0);
    if (!provider) return;

    let active = true;
    const manuallyDisconnected = sessionStorage.getItem(DISCONNECTED_KEY) === "true";

    Promise.all([
      provider.request<string[]>({ method: "eth_accounts" }),
      provider.request<string>({ method: "eth_chainId" }),
    ])
      .then(([accounts, currentChainId]) => {
        if (!active) return;
        setChainId(currentChainId);
        if (!manuallyDisconnected) {
          setAddress(accounts[0] ?? "");
          setStatus(accounts[0] ? "connected" : "idle");
        }
      })
      .catch(() => {
        // Locked wallets can block silent reads; explicit connection stays available.
      });

    const handleAccountsChanged = (accounts: string[]) => {
      const nextAddress = accounts[0] ?? "";
      if (nextAddress) sessionStorage.removeItem(DISCONNECTED_KEY);
      setAddress(nextAddress);
      setStatus(nextAddress ? "connected" : "idle");
      setMessage("");
    };
    const handleChainChanged = (nextChainId: string) => {
      setChainId(nextChainId);
      setMessage("");
    };
    const handleDisconnect = () => {
      setAddress("");
      setChainId("");
      setStatus("idle");
      setMessage("Wallet disconnected.");
    };

    provider.on?.("accountsChanged", handleAccountsChanged);
    provider.on?.("chainChanged", handleChainChanged);
    provider.on?.("disconnect", handleDisconnect);

    return () => {
      active = false;
      window.clearTimeout(providerCheck);
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
      provider.removeListener?.("chainChanged", handleChainChanged);
      provider.removeListener?.("disconnect", handleDisconnect);
    };
  }, []);

  async function connectWallet() {
    const provider = window.ethereum;
    if (!provider) {
      setStatus("error");
      setMessage("No browser wallet found. Install MetaMask or another EIP-1193 wallet.");
      return;
    }

    setStatus("connecting");
    setMessage("");
    try {
      const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
      const currentChainId = await provider.request<string>({ method: "eth_chainId" });
      sessionStorage.removeItem(DISCONNECTED_KEY);
      setAddress(accounts[0] ?? "");
      setChainId(currentChainId);
      setStatus(accounts[0] ? "connected" : "idle");
    } catch (error) {
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  }

  async function disconnectWallet() {
    const provider = window.ethereum;
    sessionStorage.setItem(DISCONNECTED_KEY, "true");
    setAddress("");
    setStatus("idle");
    setMessage("Disconnected from ArcPlay.");

    if (!provider) return;
    try {
      await provider.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch {
      // Permission revocation is wallet-specific. The ArcPlay session is still cleared.
    }
  }

  async function switchToArc() {
    const provider = window.ethereum;
    if (!provider) return;

    setStatus("connecting");
    setMessage("");
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_NETWORK.chainIdHex }],
      });
      setChainId(ARC_NETWORK.chainIdHex);
      setStatus("connected");
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error
          ? Number(error.code)
          : undefined;

      if (code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: ARC_NETWORK.chainIdHex,
              chainName: ARC_NETWORK.chainName,
              nativeCurrency: ARC_NETWORK.nativeCurrency,
              rpcUrls: [ARC_NETWORK.rpcUrl],
              blockExplorerUrls: [ARC_NETWORK.explorerUrl],
            }],
          });
          setChainId(ARC_NETWORK.chainIdHex);
          setStatus("connected");
          return;
        } catch (addError) {
          setStatus("error");
          setMessage(getErrorMessage(addError));
          return;
        }
      }

      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  }

  const checks = [
    { label: "Browser wallet", detail: hasProvider ? "Detected" : "Not installed", pass: hasProvider },
    { label: "Account", detail: address ? shortenAddress(address) : "Not connected", pass: Boolean(address) },
    { label: "Network", detail: networkLabel(chainId), pass: isArc },
  ];

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-wrap items-center gap-3">
        {address ? (
          <>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${isArc ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" : "bg-amber-400"}`} />
              <span className="font-mono text-sm font-semibold text-white">{shortenAddress(address)}</span>
              <span className={`text-xs ${isArc ? "text-emerald-300" : "text-amber-300"}`}>
                {networkLabel(chainId)}
              </span>
            </div>
            <button type="button" onClick={disconnectWallet} className="text-xs font-semibold text-slate-400 transition hover:text-white">
              Disconnect
            </button>
          </>
        ) : (
          <button type="button" onClick={connectWallet} disabled={status === "connecting"} className="inline-flex min-w-40 items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70">
            {status === "connecting" ? "Check wallet…" : "Connect Wallet"}
          </button>
        )}
        {address && !isArc && (
          <button type="button" onClick={switchToArc} disabled={status === "connecting"} className="rounded-full border border-cyan-400/40 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-60">
            {status === "connecting" ? "Open wallet…" : "Switch to Arc"}
          </button>
        )}
      </div>

      {message && (
        <p className={`mt-3 max-w-md text-xs leading-5 ${status === "error" ? "text-rose-300" : "text-slate-400"}`} role="status">
          {message}{" "}
          {!hasProvider && (
            <a className="underline underline-offset-2 hover:text-rose-200" href="https://metamask.io/download/" target="_blank" rel="noreferrer">Get MetaMask</a>
          )}
        </p>
      )}

      <section aria-label="Arc network readiness" className="mt-5 rounded-2xl border border-cyan-400/15 bg-slate-950/55 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Arc readiness</p>
            <p className="mt-1 text-sm text-slate-400">Wallet and network checks for testnet payments.</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isReady ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-amber-400/30 bg-amber-400/10 text-amber-200"}`}>
            {isReady ? "Ready" : `${checks.filter((check) => check.pass).length}/3 ready`}
          </span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {checks.map((check) => (
            <div key={check.label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${check.pass ? "bg-emerald-400" : "bg-slate-600"}`} />
                <span className="text-xs text-slate-500">{check.label}</span>
              </div>
              <p className={`mt-2 truncate text-sm font-medium ${check.pass ? "text-slate-100" : "text-slate-400"}`} title={check.detail}>{check.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

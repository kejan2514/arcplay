"use client";

import { useEffect, useState } from "react";
import { ARC_NETWORK } from "@/lib/arc-network";

type WalletStatus = "idle" | "connecting" | "connected" | "error";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = Number(error.code);
    if (code === 4001) return "Request cancelled in wallet.";
    if (code === -32002) return "A wallet request is already waiting for approval.";
  }

  return "Could not connect to the wallet. Please try again.";
}

export default function WalletConnect() {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [message, setMessage] = useState("");

  const isArc = chainId.toLowerCase() === ARC_NETWORK.chainIdHex.toLowerCase();

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    let active = true;
    Promise.all([
      provider.request<string[]>({ method: "eth_accounts" }),
      provider.request<string>({ method: "eth_chainId" }),
    ])
      .then(([accounts, currentChainId]) => {
        if (!active) return;
        setAddress(accounts[0] ?? "");
        setChainId(currentChainId);
        setStatus(accounts[0] ? "connected" : "idle");
      })
      .catch(() => {
        // Some wallets block silent reads while locked. The connect button remains available.
      });

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0] ?? "");
      setStatus(accounts[0] ? "connected" : "idle");
      setMessage("");
    };
    const handleChainChanged = (nextChainId: string) => {
      setChainId(nextChainId);
      setMessage("");
    };

    provider.on?.("accountsChanged", handleAccountsChanged);
    provider.on?.("chainChanged", handleChainChanged);

    return () => {
      active = false;
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
      provider.removeListener?.("chainChanged", handleChainChanged);
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
      const accounts = await provider.request<string[]>({
        method: "eth_requestAccounts",
      });
      const currentChainId = await provider.request<string>({
        method: "eth_chainId",
      });
      setAddress(accounts[0] ?? "");
      setChainId(currentChainId);
      setStatus(accounts[0] ? "connected" : "idle");
    } catch (error) {
      setStatus("error");
      setMessage(getErrorMessage(error));
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
            params: [
              {
                chainId: ARC_NETWORK.chainIdHex,
                chainName: ARC_NETWORK.chainName,
                nativeCurrency: ARC_NETWORK.nativeCurrency,
                rpcUrls: [ARC_NETWORK.rpcUrl],
                blockExplorerUrls: [ARC_NETWORK.explorerUrl],
              },
            ],
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

  if (!address) {
    return (
      <div className="flex flex-col gap-2 sm:items-start">
        <button
          type="button"
          onClick={connectWallet}
          disabled={status === "connecting"}
          className="inline-flex min-w-40 items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
        >
          {status === "connecting" ? "Check wallet…" : "Connect Wallet"}
        </button>
        {message && (
          <p className="max-w-sm text-xs leading-5 text-rose-300" role="alert">
            {message}{" "}
            {!window.ethereum && (
              <a
                className="underline underline-offset-2 hover:text-rose-200"
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
              >
                Get MetaMask
              </a>
            )}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:items-start">
      <div className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${isArc ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" : "bg-amber-400"}`}
        />
        <span className="font-mono text-sm font-semibold text-white">
          {shortenAddress(address)}
        </span>
        <span className={`text-xs ${isArc ? "text-emerald-300" : "text-amber-300"}`}>
          {isArc ? "Arc connected" : `Chain ${parseInt(chainId, 16) || "unknown"}`}
        </span>
      </div>
      {!isArc && (
        <button
          type="button"
          onClick={switchToArc}
          disabled={status === "connecting"}
          className="text-left text-xs font-semibold text-cyan-300 transition hover:text-cyan-200 disabled:opacity-60"
        >
          {status === "connecting" ? "Open wallet to continue…" : `Switch to ${ARC_NETWORK.chainName} →`}
        </button>
      )}
      {message && (
        <p className="max-w-sm text-xs leading-5 text-rose-300" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}

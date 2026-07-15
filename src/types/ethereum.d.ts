type EthereumRequest = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

interface EthereumProvider {
  request<T = unknown>(request: EthereumRequest): Promise<T>;
  on?(event: "accountsChanged", listener: (accounts: string[]) => void): void;
  on?(event: "chainChanged", listener: (chainId: string) => void): void;
  removeListener?(
    event: "accountsChanged",
    listener: (accounts: string[]) => void,
  ): void;
  removeListener?(
    event: "chainChanged",
    listener: (chainId: string) => void,
  ): void;
}

interface Window {
  ethereum?: EthereumProvider;
}

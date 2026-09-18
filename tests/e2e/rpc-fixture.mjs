import { createServer } from "node:http";
const sender = `0x${"1".repeat(40)}`;
const blockHash = `0x${"b".repeat(64)}`;
const quantity = (value) => `0x${BigInt(value).toString(16)}`;
createServer(async (req, res) => {
  if (req.method === "GET") { res.end("ready"); return; }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  try {
    const { id, method, params = [] } = JSON.parse(raw);
    let result;
    if (method === "eth_chainId") result = "0x4cef52";
    else if (method === "eth_blockNumber") result = "0x64";
    else if (method === "eth_getBlockByNumber") result = { hash: blockHash, number: "0x64", timestamp: quantity(Math.floor(Date.now() / 1000)), gasLimit: "0x1c9c380", gasUsed: "0x5208", difficulty: "0x0", transactions: [] };
    else if (method === "eth_getTransactionReceipt") result = params[0].startsWith("0xcccc") ? null : {
      transactionHash: params[0], status: params[0].startsWith("0xdddd") ? "0x0" : "0x1",
      blockHash, blockNumber: "0x64", gasUsed: "0x5208", effectiveGasPrice: "0x3b9aca00", logs: [],
    };
    else if (method === "eth_getTransactionByHash") result = { hash: params[0], from: sender, to: sender, value: "0x0", input: "0x", blockHash };
    else throw new Error(`Unexpected method ${method}`);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ jsonrpc: "2.0", id, result }));
  } catch { res.statusCode = 400; res.end("bad fixture request"); }
}).listen(4319, "127.0.0.1");

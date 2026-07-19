import { NextResponse } from "next/server";
import { CIRCLE_BLOCKCHAIN, getCircleClient, getCircleConfiguration, isCircleConfigured } from "@/lib/circle-wallets";

export const runtime = "nodejs";

function safeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "Circle developer-controlled wallets are not configured.") {
    return error.message;
  }

  return "Circle could not create the Arc Testnet wallet. Check the server configuration and Circle Console.";
}

export async function GET() {
  const { walletId, walletAddress } = getCircleConfiguration();

  if (!isCircleConfigured() || !walletId || !walletAddress) {
    return NextResponse.json({ error: "Circle wallet is not provisioned." }, { status: 503 });
  }

  try {
    const response = await getCircleClient().getWalletTokenBalance({ id: walletId, includeAll: true });
    const balances = response.data?.tokenBalances ?? [];

    return NextResponse.json({
      wallet: { id: walletId, address: walletAddress, blockchain: CIRCLE_BLOCKCHAIN, accountType: "EOA" },
      balances: balances.map((balance) => ({
        amount: balance.amount,
        symbol: balance.token?.symbol,
        tokenId: balance.token?.id,
      })),
    });
  } catch (error) {
    console.error("Circle wallet lookup failed", error);
    return NextResponse.json({ error: "Circle wallet balance could not be loaded." }, { status: 502 });
  }
}

export async function POST() {
  if (!isCircleConfigured()) {
    return NextResponse.json(
      { error: "Add CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET to .env.local first." },
      { status: 503 },
    );
  }

  try {
    const client = getCircleClient();
    const configuredWalletSetId = getCircleConfiguration().walletSetId;
    let walletSetId = configuredWalletSetId;

    if (!walletSetId) {
      const walletSetResponse = await client.createWalletSet({
        name: `ArcPay Testnet ${new Date().toISOString()}`,
      });
      walletSetId = walletSetResponse.data?.walletSet?.id;
    }

    if (!walletSetId) {
      throw new Error("Circle did not return a wallet set ID.");
    }

    const walletResponse = await client.createWallets({
      walletSetId,
      blockchains: [CIRCLE_BLOCKCHAIN],
      count: 1,
      accountType: "EOA",
    });
    const wallet = walletResponse.data?.wallets?.[0];

    if (!wallet?.id || !wallet.address) {
      throw new Error("Circle did not return a wallet.");
    }

    return NextResponse.json({
      wallet: {
        id: wallet.id,
        address: wallet.address,
        blockchain: wallet.blockchain,
        accountType: wallet.accountType,
      },
      walletSetId,
      createdWalletSet: !configuredWalletSetId,
    });
  } catch (error) {
    console.error("Circle wallet creation failed", error);
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 502 });
  }
}

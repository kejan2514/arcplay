import { NextRequest, NextResponse } from "next/server";
import { buildArcPayAgentRegistration } from "@/lib/erc8004";

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const registration = buildArcPayAgentRegistration(baseUrl);

  return NextResponse.json(registration, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}

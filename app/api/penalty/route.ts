import { NextResponse } from "next/server";
import { applyLatePenalty } from "@/lib/simulation";

export async function POST(request: Request) {
  const payload = await request.json();
  const { item, lateFeeDaily, asOf } = payload ?? {};

  if (!item || typeof lateFeeDaily !== "number") {
    return NextResponse.json(
      { error: "Payload denda tidak valid." },
      { status: 400 }
    );
  }

  const result = applyLatePenalty(
    item,
    lateFeeDaily,
    asOf ? new Date(asOf) : new Date()
  );
  return NextResponse.json({ data: result });
}

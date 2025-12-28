import { NextResponse } from "next/server";
import { simulationSchema } from "@/lib/validation";
import { calculateSimulation } from "@/lib/simulation";
import { getSettings } from "@/lib/db";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = simulationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input simulasi tidak valid." },
      { status: 400 }
    );
  }

  const settings = await getSettings();
  if (!settings) {
    return NextResponse.json(
      { error: "Pengaturan cicilan belum tersedia." },
      { status: 400 }
    );
  }

  const dpPercent =
    parsed.data.price > 0 ? (parsed.data.dpAmount / parsed.data.price) * 100 : 0;
  if (dpPercent < settings.dpMin || dpPercent > settings.dpMax) {
    return NextResponse.json(
      { error: "DP di luar batas ketentuan." },
      { status: 400 }
    );
  }

  if (!settings.tenorOptions.includes(parsed.data.tenor)) {
    return NextResponse.json(
      { error: "Tenor tidak tersedia." },
      { status: 400 }
    );
  }

  const row = calculateSimulation({
    ...parsed.data,
    marginAnnual: settings.marginAnnual,
    adminFeeRate: settings.adminFeeRate,
    stampDuty: settings.stampDuty
  });
  return NextResponse.json({ rows: [row] });
}

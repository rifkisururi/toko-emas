import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { data, error } = await supabaseServer
    .from("settings")
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({
    data: {
      marginAnnual: data.margin_annual,
      adminFeeRate: data.admin_fee,
      stampDuty: data.stamp_duty,
      dpMin: data.dp_min,
      dpMax: data.dp_max,
      tenorOptions: data.tenor_options,
      lateFeeDaily: data.late_fee_daily
    }
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const mapped = {
    margin_annual: payload.marginAnnual,
    admin_fee: payload.adminFeeRate,
    stamp_duty: payload.stampDuty,
    dp_min: payload.dpMin,
    dp_max: payload.dpMax,
    tenor_options: payload.tenorOptions,
    late_fee_daily: payload.lateFeeDaily
  };
  const { data, error } = await supabaseServer
    .from("settings")
    .upsert(mapped)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

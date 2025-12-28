import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/validation";
import { generateSchedule } from "@/lib/simulation";
import { getSettings } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = applicationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data pengajuan tidak lengkap." },
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

  const { dpAmount, tenor, price, productId } = parsed.data;
  const dpPercent = price > 0 ? (dpAmount / price) * 100 : 0;
  if (dpPercent < settings.dpMin || dpPercent > settings.dpMax) {
    return NextResponse.json(
      { error: "DP di luar batas ketentuan." },
      { status: 400 }
    );
  }

  if (!settings.tenorOptions.includes(tenor)) {
    return NextResponse.json(
      { error: "Tenor tidak tersedia." },
      { status: 400 }
    );
  }

  const schedule = generateSchedule(
    {
      productId,
      price,
      dpAmount,
      tenor,
      marginAnnual: settings.marginAnnual,
      adminFeeRate: settings.adminFeeRate,
      stampDuty: settings.stampDuty
    },
    new Date()
  );

  const { data: application, error: appError } = await supabaseServer
    .from("applications")
    .insert({
      user_name: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      product_id: productId,
      price,
      dp_amount: dpAmount,
      tenor,
      status: "Menunggu Pembayaran"
    })
    .select("id")
    .single();

  if (appError || !application) {
    return NextResponse.json(
      { error: appError?.message ?? "Gagal menyimpan pengajuan." },
      { status: 400 }
    );
  }

  const scheduleRows = schedule.map((item) => ({
    application_id: application.id,
    month_index: item.monthIndex,
    due_date: item.dueDate.split("T")[0],
    installment: item.installment,
    principal: item.principal,
    margin: item.margin,
    status: item.status,
    late_days: item.lateDays,
    penalty: item.penalty,
    total_due: item.totalDue
  }));

  const { error: scheduleError } = await supabaseServer
    .from("installment_schedule")
    .insert(scheduleRows);

  if (scheduleError) {
    return NextResponse.json(
      { error: scheduleError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "Pending",
    schedule,
    applicationId: application.id
  });
}

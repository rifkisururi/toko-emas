import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Params = {
  params: { id: string };
};

export async function POST(request: Request, { params }: Params) {
  const { error } = await supabaseServer
    .from("applications")
    .update({ status: "Approved" })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

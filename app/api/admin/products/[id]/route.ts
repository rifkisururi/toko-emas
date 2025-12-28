import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const { stock, ...productData } = payload ?? {};
  const { data, error } = await supabaseServer
    .from("products")
    .update(productData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (typeof stock === "number") {
    const { error: stockError } = await supabaseServer.from("stocks").insert({
      product_id: id,
      available: stock,
      mutation_note: "Manual update"
    });
    if (stockError) {
      return NextResponse.json({ error: stockError.message }, { status: 400 });
    }
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { error } = await supabaseServer
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

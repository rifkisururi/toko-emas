import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const data = await getProducts();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const { stock, ...productData } = payload ?? {};
  const { data, error } = await supabaseServer
    .from("products")
    .insert(productData)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (typeof stock === "number") {
    const { error: stockError } = await supabaseServer.from("stocks").insert({
      product_id: data.id,
      available: stock,
      mutation_note: "Initial stock"
    });
    if (stockError) {
      return NextResponse.json({ error: stockError.message }, { status: 400 });
    }
  }

  return NextResponse.json({ data });
}

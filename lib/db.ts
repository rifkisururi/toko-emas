import { supabaseServer } from "./supabase/server";
import { CicilanSettings, Product } from "./types";

type SettingsRow = {
  margin_annual: number;
  admin_fee: number;
  stamp_duty: number;
  dp_min: number;
  dp_max: number;
  tenor_options: number[];
  late_fee_daily: number;
};

type ProductRow = {
  id: string;
  code: string;
  name: string;
  brand: string;
  weight: number;
  price: number;
  image_url: string | null;
  certificate: string | null;
};

type StockRow = {
  product_id: string;
  available: number;
  created_at: string;
};

export const getSettings = async (): Promise<CicilanSettings | null> => {
  const { data, error } = await supabaseServer
    .from("settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<SettingsRow>();

  if (error || !data) return null;

  return {
    marginAnnual: data.margin_annual,
    adminFeeRate: data.admin_fee,
    stampDuty: data.stamp_duty,
    dpMin: data.dp_min,
    dpMax: data.dp_max,
    tenorOptions: data.tenor_options,
    lateFeeDaily: data.late_fee_daily
  };
};

const mapStock = (stocks: StockRow[]) => {
  const latestByProduct = new Map<string, StockRow>();
  for (const stock of stocks) {
    const existing = latestByProduct.get(stock.product_id);
    if (!existing || existing.created_at < stock.created_at) {
      latestByProduct.set(stock.product_id, stock);
    }
  }
  return latestByProduct;
};

export const getProducts = async (): Promise<Product[]> => {
  const { data: products, error: productError } = await supabaseServer
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (productError || !products) return [];

  const { data: stocks } = await supabaseServer
    .from("stocks")
    .select("product_id, available, created_at");

  const stockMap = mapStock((stocks ?? []) as StockRow[]);

  return (products as ProductRow[]).map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    brand: item.brand === "UBS" ? "UBS" : "Antam",
    weight: Number(item.weight),
    price: Number(item.price),
    imageUrl: item.image_url ?? undefined,
    certificate: item.certificate ?? undefined,
    stock: stockMap.get(item.id)?.available ?? 0
  }));
};

export const getProductById = async (
  id: string
): Promise<Product | null> => {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle<ProductRow>();

  if (error || !data) return null;

  const { data: stocks } = await supabaseServer
    .from("stocks")
    .select("product_id, available, created_at")
    .eq("product_id", id);

  const stockMap = mapStock((stocks ?? []) as StockRow[]);

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    brand: data.brand === "UBS" ? "UBS" : "Antam",
    weight: Number(data.weight),
    price: Number(data.price),
    imageUrl: data.image_url ?? undefined,
    certificate: data.certificate ?? undefined,
    stock: stockMap.get(id)?.available ?? 0
  };
};

type ApplicationRow = {
  id: string;
  user_name: string;
  phone: string;
  email: string;
  product_id: string;
  price: number;
  dp_amount: number;
  tenor: number;
  status: string;
};

export const getApplicationById = async (id: string) => {
  const { data, error } = await supabaseServer
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle<ApplicationRow>();

  if (error || !data) return null;
  return data;
};

import { getApplicationById, getProductById, getSettings } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import PaymentClient from "./PaymentClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PembayaranPage({ params }: Props) {
  const { id } = await params;
  const [application, settings] = await Promise.all([
    getApplicationById(id),
    getSettings()
  ]);

  if (!application || !settings) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink">
          Data pembayaran tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Pastikan kode pengajuan benar atau hubungi admin.
        </p>
      </section>
    );
  }

  const product = await getProductById(application.product_id);
  const principal = Math.max(application.price - application.dp_amount, 0);
  const marginTotal = principal * settings.marginAnnual * (application.tenor / 12);
  const adminFeeAmount =
    principal * settings.adminFeeRate * (application.tenor / 12);
  const totalInitialCost = application.dp_amount + adminFeeAmount + settings.stampDuty;

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 pb-24">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">Pembayaran DP</h1>
        <p className="mt-2 text-sm text-ink/60">
          Selesaikan pembayaran DP untuk melanjutkan proses cicilan.
        </p>

        <div className="mt-6 rounded-2xl border border-emerald/10 bg-emerald/5 p-4 text-sm text-ink/70">
          <p>Produk: {product?.name ?? "Emas Batangan"}</p>
          <p>Status: {application.status}</p>
          <p className="mt-2 text-lg font-semibold text-emerald">
            Total DP + Biaya Awal: {formatRupiah(totalInitialCost)}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            Termasuk DP, biaya admin, dan materai.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-ink/70">
          <p className="text-sm font-semibold text-ink">Rekening Tujuan</p>
          <div className="mt-3 space-y-2">
            <p>Bank Syariah Indonesia (BSI)</p>
            <p>No. Rek: 1234567890</p>
            <p>Atas Nama: Toko Emas [Nama Toko]</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 p-4 text-xs text-ink/60">
          <p>Margin total: {formatRupiah(marginTotal)}</p>
          <p>Biaya admin: {formatRupiah(adminFeeAmount)}</p>
          <p>Materai: {formatRupiah(settings.stampDuty)}</p>
        </div>

        <PaymentClient applicationId={application.id} />
      </div>
    </section>
  );
}

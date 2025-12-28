export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/60 px-6 py-10 text-sm text-ink/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-ink">
            Toko Emas <span className="text-gold">[Nama Toko]</span>
          </p>
          <p className="mt-2 max-w-sm">
            Cicil emas 24K aman syariah dengan pengelolaan stok terpercaya.
          </p>
        </div>
        <div className="space-y-2">
          <p>Jam operasional: 09.00 - 18.00 WIB</p>
          <p>WhatsApp: 08xx-xxxx-xxxx</p>
          <p>Email: halo@tokoemas.id</p>
        </div>
      </div>
    </footer>
  );
}

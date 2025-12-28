import Link from "next/link";

const links = [
  { href: "/catalog", label: "Katalog" },
  { href: "/simulasi", label: "Simulasi" },
  { href: "/ajukan", label: "Ajukan" },
  { href: "/admin", label: "Admin" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-semibold text-ink">
          Toko Emas <span className="text-gold">[Nama Toko]</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/70 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-emerald"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

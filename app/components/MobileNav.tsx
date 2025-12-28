import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/catalog", label: "Katalog" },
  { href: "/simulasi", label: "Simulasi" },
  { href: "/ajukan", label: "Ajukan" }
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/70 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between text-xs font-semibold text-ink/70">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-3 py-2 transition hover:bg-emerald/10 hover:text-emerald"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

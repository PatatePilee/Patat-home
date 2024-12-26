import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-foreground/10">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Acceuil
        </Link>
        <div className="space-x-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Accueil
          </Link>
          <Link
            href="/products"
            className="hover:text-blue-600 transition-colors"
          >
            Nos Comptes
          </Link>
        </div>
      </nav>
    </header>
  );
}

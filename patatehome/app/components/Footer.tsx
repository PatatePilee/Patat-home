import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground/5 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="font-bold text-xl mb-4">Patate Clash of Clans</h3>
            <p className="text-foreground/80 mb-4">
              Votre partenaire de confiance pour l'achat et la vente de comptes
              Clash of Clans, Brawl Stars et Clans premium depuis 2022.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://discord.gg/patate"
                className="text-blue-600 hover:underline"
              >
                Discord
              </Link>
              <Link
                href="https://telegram.me/JadeOrlaBeat"
                className="text-blue-600 hover:underline"
              >
                Telegram
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-blue-600 transition-colors"
                >
                  Nos Comptes
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="hover:text-blue-600 transition-colors"
                >
                  Nous Rejoindre
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>Recherche sur mesure</li>
              <li>Rachat de comptes</li>
              <li>Garantie satisfaction</li>
              <li>Support 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-foreground/10 mt-8 pt-8 text-center text-sm text-foreground/60">
          <p>
            © {new Date().getFullYear()} Patate Clash of Clans. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

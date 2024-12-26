import Image from "next/image";
import { getFeaturedAccounts } from "./types/account";
import Link from "next/link";

export default function Home() {
  const featuredAccounts = getFeaturedAccounts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40 z-10" />
        <Image
          src="/hero-clash.jpg"
          alt="Clash of Clans Background"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
          priority
        />
        <div className="relative z-20 text-center text-white max-w-4xl px-4 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            Patate Clash of Clans
          </h1>
          <p className="text-2xl mb-8 text-white/90">
            Votre marketplace de confiance pour l'achat de comptes Clash of
            Clans premium et sécurisés
          </p>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
          >
            Voir nos comptes
          </Link>
        </div>
      </section>

      {/* Comptes en vedette */}
      <section className="max-w-7xl mx-auto py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 hover:text-blue-500 transition-colors duration-300">
          Comptes en vedette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredAccounts.map((account) => (
            <div
              key={account.id}
              className="group border border-foreground/10 rounded-xl p-8 hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/10 transform hover:scale-105 bg-white/5"
            >
              <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                <Image
                  src={account.imageUrl}
                  alt={`HDV ${account.hdv}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-500 transition-colors">
                HDV {account.hdv} - Niveau {account.level}
              </h3>
              <ul className="mb-6 space-y-2">
                {account.features.map((feature, index) => (
                  <li key={index} className="text-white/80">
                    • {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-500">
                  {account.price} €
                </span>
                <Link
                  href={`/products/${account.id}`}
                  className="text-blue-500 hover:text-blue-400 transition-colors group-hover:translate-x-2 transform transition-transform duration-300"
                >
                  Voir les détails →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center hover:text-blue-500 transition-colors duration-300">
            Notre Expertise
          </h2>
          <div className="space-y-16">
            <div className="group p-12 rounded-2xl bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-default">
              <p className="text-3xl leading-relaxed mb-8 text-white/60 group-hover:text-white transition-colors">
                Bienvenue sur{" "}
                <span className="text-blue-500 font-semibold">
                  Patate Clash of Clans
                </span>
                , votre destination de confiance pour les comptes Clash of Clans
                !
              </p>
            </div>

            <div className="group p-12 rounded-2xl bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-default">
              <p className="text-3xl leading-relaxed text-white/60 group-hover:text-white transition-colors">
                Joueur passionné depuis 2018, mon engagement envers Clash of
                Clans s'est particulièrement intensifié pendant la période du
                Covid. Face au constat de comptes vendus à des prix excessifs et
                sans véritable garantie après-vente, j'ai décidé de créer cette
                plateforme avec une vision différente.
              </p>
            </div>

            <div className="group p-12 rounded-2xl bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-default">
              <p className="text-3xl leading-relaxed text-white/60 group-hover:text-white transition-colors">
                Ma mission est simple : vous offrir des comptes premium
                soigneusement sélectionnés, à des prix justes et transparents,
                accompagnés d'un service après-vente irréprochable. Chaque
                compte est vérifié et sécurisé, vous garantissant une expérience
                d'achat en toute sérénité.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {[
                { value: "70+", label: "HDV 15/16 vendus" },
                { value: "100%", label: "Satisfaction client" },
                { value: "24/7", label: "Support client" },
                { value: "2", label: "Années d'expérience" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group p-8 bg-black/40 hover:bg-white/5 rounded-xl transition-all duration-300 cursor-default"
                >
                  <div className="text-6xl font-bold text-white/60 group-hover:text-blue-500 transition-colors mb-4">
                    {stat.value}
                  </div>
                  <div className="text-xl text-white/60 group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

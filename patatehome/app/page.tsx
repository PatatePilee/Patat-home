import Image from "next/image";
import Link from "next/link";
import { db } from "../src/db";
import { accounts } from "../src/db/schema";
import AccountImage from "./components/AccountImage";
import FeaturedCarousel from "./components/FeaturedCarousel";
import { desc } from "drizzle-orm";

async function getAccounts() {
  try {
    const allAccounts = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.id));

    return allAccounts.map((account) => ({
      ...account,
      features: JSON.parse(account.features),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes:", error);
    return [];
  }
}

export default async function Home() {
  const accounts = await getAccounts();

  const featuredAccounts = accounts
    .filter(
      (account) => account?.status === "available" && account?.imageFilename
    )
    .slice(0, 3)
    .map((account) => ({
      ...account,
      features: Array.isArray(account.features)
        ? account.features
        : JSON.parse(account.features),
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a1818] to-black">
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Comptes en Vedette
          </h2>
          {featuredAccounts.length > 0 && (
            <FeaturedCarousel accounts={featuredAccounts} />
          )}
        </div>
      </section>

      {/* Section À propos */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center hover:text-blue-500 transition-colors duration-300">
            Notre Expertise
          </h2>
          <div className="space-y-4">
            <div className="group p-6 rounded-2xl bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-default">
              <p className="text-2xl leading-relaxed text-white/60 group-hover:text-white transition-colors">
                Bienvenue sur{" "}
                <span className="text-blue-500 font-semibold">
                  Patate Clash of Clans
                </span>
                , votre destination de confiance pour les comptes Clash of Clans
                !
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-default">
              <p className="text-2xl leading-relaxed text-white/60 group-hover:text-white transition-colors">
                Joueur passionné depuis 2018, mon engagement envers Clash of
                Clans s'est particulièrement intensifié pendant la période du
                Covid. Face au constat de comptes vendus à des prix excessifs et
                sans véritable garantie après-vente, j'ai décidé de créer cette
                plateforme avec une vision différente.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-default">
              <p className="text-2xl leading-relaxed text-white/60 group-hover:text-white transition-colors">
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

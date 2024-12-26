"use client";
import Image from "next/image";
import Link from "next/link";

export default function JoinPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40 z-10" />
        <Image
          src="/discord-banner.jpg"
          alt="Discord Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Rejoignez notre communauté
          </h1>
          <p className="text-2xl text-white/90 mb-8">
            Entrez dans l'univers de Patat'home'
          </p>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group p-8 rounded-xl bg-black/40 hover:bg-white/5 transition-all">
              <h3 className="text-2xl font-bold mb-4 text-blue-500">
                Support Premium
              </h3>
              <p className="text-white/80">
                Accès à notre équipe de support 24/7 pour toutes vos questions
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-black/40 hover:bg-white/5 transition-all">
              <h3 className="text-2xl font-bold mb-4 text-blue-500">
                Offres Exclusives
              </h3>
              <p className="text-white/80">
                Soyez les premiers informés des nouvelles offres et promotions
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-black/40 hover:bg-white/5 transition-all">
              <h3 className="text-2xl font-bold mb-4 text-blue-500">
                Communauté Active
              </h3>
              <p className="text-white/80">
                Échangez avec d'autres joueurs passionnés et partagez vos
                expériences
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="https://discord.gg/patate"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold text-xl transition-colors"
            >
              Rejoindre le Discord →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

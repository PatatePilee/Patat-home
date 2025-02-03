"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SponsorPage() {
  const [selectedBank, setSelectedBank] = useState<"bourso" | "revolut">(
    "bourso"
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Parrainage Bancaire</h1>

        {/* Switch entre les banques */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedBank("bourso")}
            className={`p-6 rounded-lg border ${
              selectedBank === "bourso"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Boursorama</h3>
            <p className="text-sm opacity-80">130€ + 150€ possibles</p>
          </button>

          <button
            onClick={() => setSelectedBank("revolut")}
            className={`p-6 rounded-lg border ${
              selectedBank === "revolut"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Revolut</h3>
            <p className="text-sm opacity-80">50€ après 3 achats</p>
          </button>
        </div>

        {/* Contenu Boursorama */}
        {selectedBank === "bourso" && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Parrainage Boursorama</h2>
              <div className="space-y-4">
                <div className="bg-blue-600/20 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Offre de base : 130€</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Prime immédiate de 130€ à l'ouverture</li>
                    <li>
                      Engagement d'utilisation : 1 fois par mois pendant 24 mois
                    </li>
                    <li>Carte bancaire incluse</li>
                  </ul>
                </div>

                <div className="bg-green-600/20 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Bonus parrainage : +150€</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Prime additionnelle de 150€</li>
                    <li>Cumulable avec l'offre de base</li>
                    <li>Total possible : 280€</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Obtenir mon parrainage
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Conditions importantes</h3>
              <ul className="space-y-3 text-white/80">
                <li>
                  • Utilisation obligatoire de la carte 1 fois par mois pendant
                  24 mois
                </li>
                <li>
                  • Compte à maintenir actif pendant la période d'engagement
                </li>
                <li>
                  • Possibilité de cumuler les deux offres pour un total de 280€
                </li>
                <li>• Carte bancaire gratuite sous conditions d'utilisation</li>
              </ul>
            </div>
          </div>
        )}

        {/* Contenu Revolut */}
        {selectedBank === "revolut" && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Parrainage Revolut</h2>
              <div className="space-y-4">
                <div className="bg-blue-600/20 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Offre simple : 50€</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Prime de 50€ après validation des conditions</li>
                    <li>Carte physique à 5€ seulement</li>
                    <li>Aucun engagement de durée</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Obtenir mon parrainage
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Conditions simples</h3>
              <ul className="space-y-3 text-white/80">
                <li>• Commander la carte physique (5€)</li>
                <li>• Effectuer 3 paiements avec la carte</li>
                <li>• Aucun engagement de durée</li>
                <li>• Prime versée directement sur le compte</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

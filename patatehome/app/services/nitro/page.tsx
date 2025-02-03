"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NitroPage() {
  const [selectedType, setSelectedType] = useState<"server" | "nitro">(
    "server"
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Discord Boost & Nitro</h1>

        {/* Switch entre Server Boost et Nitro */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedType("server")}
            className={`p-6 rounded-lg border ${
              selectedType === "server"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Server Boost</h3>
            <p className="text-sm opacity-80">14 boosts disponibles</p>
          </button>

          <button
            onClick={() => setSelectedType("nitro")}
            className={`p-6 rounded-lg border ${
              selectedType === "nitro"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Nitro</h3>
            <p className="text-sm opacity-80">Boost personnel</p>
          </button>
        </div>

        {/* Contenu Server Boost */}
        {selectedType === "server" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pack 1 mois */}
              <div className="bg-[#1a1a1a] rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">1 Mois</h3>
                  <p className="text-3xl font-bold text-blue-500 mt-2">4€</p>
                  <p className="text-sm text-white/60">par boost</p>
                </div>
                <ul className="space-y-2 mb-6 text-white/80">
                  <li>• 14 boosts disponibles</li>
                  <li>• Niveau 3 instantané</li>
                  <li>• Livraison immédiate</li>
                </ul>
                <Link
                  href="/contact"
                  className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Commander
                </Link>
              </div>

              {/* Pack 3 mois */}
              <div className="bg-[#1a1a1a] rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">3 Mois</h3>
                  <p className="text-3xl font-bold text-blue-500 mt-2">10€</p>
                  <p className="text-sm text-white/60">par boost</p>
                </div>
                <ul className="space-y-2 mb-6 text-white/80">
                  <li>• 14 boosts disponibles</li>
                  <li>• Niveau 3 instantané</li>
                  <li>• Durée prolongée</li>
                </ul>
                <Link
                  href="/contact"
                  className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Commander
                </Link>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">
                Informations importantes
              </h3>
              <ul className="space-y-2 text-white/80">
                <li>• 14 boosts = Niveau 3 instantané</li>
                <li>• Livraison dans l'heure</li>
                <li>• Support Discord 24/7</li>
                <li>• Garantie de durée</li>
              </ul>
            </div>
          </div>
        )}

        {/* Contenu Nitro */}
        {selectedType === "nitro" && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md mx-auto">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">Nitro Basic</h3>
                <p className="text-3xl font-bold text-blue-500 mt-2">5€</p>
                <p className="text-sm text-white/60">1 mois</p>
              </div>
              <ul className="space-y-2 mb-6 text-white/80">
                <li>• Emojis personnalisés</li>
                <li>• Badges exclusifs</li>
                <li>• Livraison immédiate</li>
                <li>• Support 24/7</li>
              </ul>
              <Link
                href="/contact"
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

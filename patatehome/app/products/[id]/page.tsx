"use client";
import { accounts } from "@/app/types/account";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AccountDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const account = accounts.find((a) => a.id === params.id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Compte non trouvé</h1>
          <Link href="/products" className="text-blue-500 hover:underline">
            Retour aux comptes
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [account.imageUrl, ...(account.additionalImages || [])];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={allImages[selectedImage]}
                alt={`HDV ${account.hdv}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-transparent hover:border-blue-500/50"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Informations du compte */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                HDV {account.hdv} - Niveau {account.level}
              </h1>
              <div className="text-3xl font-bold text-blue-500">
                {account.price} €
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Caractéristiques</h2>
              <ul className="space-y-2">
                {account.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Processus d'achat sécurisé
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-xl">
                  <div className="text-xl font-semibold mb-2">1. Contact</div>
                  <p className="text-sm text-white/80">
                    Contactez-nous via Discord ou Telegram pour confirmer la
                    disponibilité et organiser la transaction.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl">
                  <div className="text-xl font-semibold mb-2">2. Paiement</div>
                  <p className="text-sm text-white/80">
                    Effectuez le paiement via une méthode sécurisée de votre
                    choix (PayPal, virement bancaire).
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl">
                  <div className="text-xl font-semibold mb-2">3. Transfert</div>
                  <p className="text-sm text-white/80">
                    Réception des identifiants et changement immédiat des accès
                    pour sécuriser votre compte.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link
                href="https://discord.gg/patate"
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors"
              >
                Contacter sur Discord
              </Link>
              <Link
                href="https://telegram.me/JadeOrlaBeat"
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors"
              >
                Contacter sur Telegram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

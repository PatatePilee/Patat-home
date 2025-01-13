"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageUrl: string;
  features: string[];
  additionalImages?: string[];
  status: string;
};

export default function AccountDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [account, setAccount] = useState<Account | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const response = await fetch(`/api/accounts/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAccount({
            ...data,
            features: Array.isArray(data.features)
              ? data.features
              : JSON.parse(data.features),
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du compte:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccount();
  }, [params.id]);

  if (isLoading) return <div>Chargement...</div>;
  if (!account) return <div>Compte non trouvé</div>;

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

            {/* Miniatures */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent hover:border-blue-500/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 16vw, 8vw"
                    />
                  </button>
                ))}
              </div>
            )}
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

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Caractéristiques
                </h2>
                <ul className="space-y-2">
                  {account.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Livraison</h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500">✓</span>
                    <span>Livraison immédiate après paiement</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500">✓</span>
                    <span>Changement des accès inclus</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500">✓</span>
                    <span>Support après-vente 24/7</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Garanties</h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500">✓</span>
                    <span>Compte vérifié et sécurisé</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500">✓</span>
                    <span>Garantie de remboursement 30 jours</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/delivery"
                className="block w-full text-center py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-8"
              >
                Voir les modalités de livraison
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DarkLayout from "@/app/layouts/DarkLayout";
import AccountImage from "@/app/components/AccountImage";

type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageFilename: string;
  features: string[];
  additionalImages?: string[];
  status: string;
};

export default function AccountDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
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

  const handleAddToCart = async (accountId: number) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (
        response.status === 400 &&
        data.error === "Ce produit est déjà dans votre panier"
      ) {
        router.push("/products");
        return;
      }

      if (response.ok && data.redirect) {
        router.push(data.redirect);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  if (isLoading)
    return (
      <DarkLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Chargement...</div>
        </div>
      </DarkLayout>
    );

  if (!account)
    return (
      <DarkLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Compte non trouvé</div>
        </div>
      </DarkLayout>
    );

  const allImages = [
    account.imageFilename,
    ...(account.additionalImages || []),
  ];

  return (
    <DarkLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galerie d'images */}
            <div className="space-y-6">
              <AccountImage
                src={`/accounts/${account.imageFilename}`}
                alt={`HDV ${account.hdv}`}
                className="object-cover"
              />
              {allImages.length > 1 && (
                <>
                  {/* Indicateur de défilement */}
                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? allImages.length - 1 : prev - 1
                        )
                      }
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === allImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      →
                    </button>
                  </div>
                  {/* Indicateur de position */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {selectedImage + 1} / {allImages.length}
                  </div>
                </>
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

                <div className="flex gap-4 mb-4">
                  <button
                    onClick={async () => {
                      await handleAddToCart(account.id);
                      router.push("/products");
                    }}
                    className="flex-1 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ajouter et voir les produits
                  </button>
                  <button
                    onClick={async () => {
                      await handleAddToCart(account.id);
                      router.push("/cart");
                    }}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter et voir le panier
                  </button>
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
    </DarkLayout>
  );
}

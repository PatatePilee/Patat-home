"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DarkLayout from "@/app/layouts/DarkLayout";
import AccountImage from "@/app/components/AccountImage";
import { debug, addDebugElement } from "@/app/debug";

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
  searchParams,
}: {
  params: { id: string };
  searchParams?: { id?: string };
}) {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'ID depuis params ou searchParams si nécessaire
  const id = params.id === "[id]" ? searchParams?.id || "" : params.id;

  console.log(`Page produit - ID utilisé: ${id}, Type: ${typeof id}`);
  console.log(
    `Page produit - params.id: ${params.id}, Type: ${typeof params.id}`
  );
  console.log(`Page produit - searchParams:`, searchParams);

  useEffect(() => {
    // Extraire l'ID directement de l'URL plutôt que des props
    const urlParts = window.location.pathname.split("/");
    const urlId = urlParts[urlParts.length - 1];

    // Vérifier si l'ID extrait de l'URL est un nombre
    const numericId = !isNaN(parseInt(urlId)) ? urlId : "";

    // Si nous n'avons pas pu extraire un ID numérique de l'URL, essayons les searchParams
    const searchParamsId = new URLSearchParams(window.location.search).get(
      "id"
    );

    // ID final à utiliser (préférer l'ID de l'URL, puis searchParams)
    const finalId =
      numericId ||
      (searchParamsId && !isNaN(parseInt(searchParamsId))
        ? searchParamsId
        : "");

    console.log(
      `Extraction d'ID: URL=${urlId}, Numérique=${numericId}, SearchParams=${searchParamsId}, Final=${finalId}`
    );

    if (!finalId) {
      setError("ID de produit manquant ou invalide");
      setIsLoading(false);
      return;
    }

    async function fetchAccount() {
      setIsLoading(true);
      setError(null);

      try {
        // Utiliser l'ID extrait de toutes les sources possibles
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/api/accounts/${finalId}`;

        // addDebugElement("Chargement avec ID de l'URL", { numericId, url });

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        debug.log(`Statut de la réponse: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.error || `Erreur serveur: ${response.status}`;
          debug.error(`Erreur API:`, errorMessage);
          setError(errorMessage);
          // addDebugElement("Erreur API", errorData);
          return;
        }

        const data = await response.json();
        // debug.log(`Données reçues:`, {
        //   id: data.id,
        //   hdv: data.hdv,
        //   level: data.level,
        //   hasFeatures: !!data.features,
        //   featuresType: typeof data.features,
        //   hasAdditionalImages: !!data.additionalImages,
        //   additionalImagesCount: data.additionalImages?.length,
        // });

        // Si tout est OK, ajouter les données à l'interface visuelle en mode debug
        //addDebugElement("Données reçues", data);

        // Si features est déjà un tableau (grâce aux changements dans l'API), on l'utilise tel quel
        // Sinon on essaie de le parser
        const features = Array.isArray(data.features)
          ? data.features
          : typeof data.features === "string"
          ? JSON.parse(data.features)
          : [];

        setAccount({
          ...data,
          features,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du compte:", error);
        setError(
          `Erreur: ${
            error instanceof Error ? error.message : "Une erreur est survenue"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccount();
  }, []);

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

  if (error)
    return (
      <DarkLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-red-500 text-xl mb-4">Erreur</div>
          <div className="text-white mb-8">{error}</div>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retour aux produits
          </button>
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

  const allImages = account.additionalImages
    ? [
        `/api/images/${account.imageFilename}?v=${timestamp}`,
        ...account.additionalImages.map(
          (img) => `/api/images/${img}?v=${timestamp}`
        ),
      ]
    : [`/api/images/${account.imageFilename}?v=${timestamp}`];

  return (
    <DarkLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="relative group h-[400px]">
                <AccountImage
                  src={allImages[selectedImage]}
                  alt={`HDV ${account.hdv}`}
                  className="rounded-lg"
                  priority={true}
                />
                {allImages.length > 1 && (
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
                )}
              </div>

              <div className="flex space-x-2 mt-4">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 cursor-pointer overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <AccountImage
                      src={image}
                      alt={`Miniature ${index + 1}`}
                      className={`transition-opacity duration-200 ${
                        selectedImage === index
                          ? "opacity-100"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  </div>
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

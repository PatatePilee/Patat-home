"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DarkLayout from "@/app/layouts/DarkLayout";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log l'erreur au chargement de la page
    console.error("Erreur détaillée de la page produit:", error);
  }, [error]);

  return (
    <DarkLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-white mb-8">
          {error?.message || "Impossible de charger les détails du produit"}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Réessayer
          </button>
          <button
            onClick={() => router.push("/products")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    </DarkLayout>
  );
}

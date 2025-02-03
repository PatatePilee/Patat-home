"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CapitalePage() {
  const [currentUpgrade, setCurrentUpgrade] = useState(0);
  const [targetUpgrade, setTargetUpgrade] = useState(0);
  const router = useRouter();

  // Fonction pour calculer le prix et les joyaux
  const calculateDetails = (current: number, target: number) => {
    const difference = target - current;
    if (difference <= 0) return { price: 0, gems: 0 };

    // Prix approximatifs basés sur les paliers donnés
    let price = 0;
    let gems = 0;

    if (target <= 1200) {
      price = Math.ceil((difference / 1200) * 20);
      gems = Math.ceil((difference / 1200) * 20000000);
    } else if (target <= 2000) {
      price = Math.ceil((difference / 2000) * 50);
      gems = Math.ceil((difference / 2000) * 50000000);
    } else {
      price = Math.ceil((difference / 3331) * 135);
      gems = Math.ceil((difference / 3331) * 135000000);
    }

    return { price, gems };
  };

  const { price, gems } = calculateDetails(currentUpgrade, targetUpgrade);

  const handleAddToCart = async () => {
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
          userId: user.id,
          serviceType: "capitale",
          price: price,
          details: {
            currentUpgrade,
            targetUpgrade,
            gemsAmount: gems,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/cart");
      } else {
        alert(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Joyaux de Capitale</h1>
          <p className="text-xl text-white/80 mb-6">
            Boostez votre capitale de clan avec nos packs de joyaux sur mesure
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Niveau actuel d'amélioration
              </label>
              <input
                type="range"
                min="0"
                max="3331"
                value={currentUpgrade}
                onChange={(e) => setCurrentUpgrade(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm mt-1">
                <span>0</span>
                <span>{currentUpgrade} améliorations</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Niveau souhaité d'amélioration
              </label>
              <input
                type="range"
                min="0"
                max="3331"
                value={targetUpgrade}
                onChange={(e) => setTargetUpgrade(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm mt-1">
                <span>0</span>
                <span>{targetUpgrade} améliorations</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-black/40 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-white/60">Prix estimé</p>
                <p className="text-3xl font-bold">{price}€</p>
                <p className="text-sm text-white/60 mt-2">
                  Environ {(gems / 1000000).toFixed(1)} millions de joyaux
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={price === 0}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Informations importantes</h2>
            <ul className="space-y-2 text-white/80">
              <li>• Distribution instantanée entre 8h et 18h</li>
              <li>
                • Prérequis : clan HDV6, 0 trophées et 20 places disponibles
              </li>
              <li>
                • Pour un meilleur rendement, mettez des petits bâtiments en
                amélioration/favoris
              </li>
            </ul>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Packs populaires</h2>
            <ul className="space-y-2 text-white/80">
              <li>• 10 millions ➡️ Capital 1 (0 up) à 7 (900 up) - 8€</li>
              <li>• 20 millions ➡️ Capital 1 à 8 (1400 up) - 14€</li>
              <li>• 50 millions ➡️ Capital 1 à 9 (2000 up) - 25€</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

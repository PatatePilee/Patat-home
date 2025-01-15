"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: number;
  accountId: number;
  account: {
    id: number;
    hdv: number;
    level: number;
    price: number;
    imageUrl: string;
    features: string[];
  };
};

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/cart")}`);
      return;
    }

    const user = JSON.parse(userStr);

    async function fetchCart() {
      try {
        const response = await fetch(`/api/cart?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
  }, [router]);

  const handleRemoveFromCart = async (cartItemId: number) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  const total = cartItems.reduce((sum, item) => sum + item.account.price, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              Votre panier est vide
            </h2>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir les comptes disponibles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 p-4 rounded-xl flex gap-4 items-center"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.account.imageUrl}
                      alt={`HDV ${item.account.hdv}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold">
                      HDV {item.account.hdv} - Niveau {item.account.level}
                    </h3>
                    <p className="text-lg font-bold text-blue-500">
                      {item.account.price} €
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white/5 p-6 rounded-xl h-fit">
              <h2 className="text-2xl font-semibold mb-4">Récapitulatif</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="font-bold">{total} €</span>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Procéder au paiement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

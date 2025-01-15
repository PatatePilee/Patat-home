"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
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

  const total = cartItems.reduce((sum, item) => sum + item.account.price, 0);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Paiement</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Récapitulatif de la commande */}
          <div className="bg-white/5 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">Récapitulatif</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-white/10 pb-4"
                >
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.account.imageUrl}
                      alt={`HDV ${item.account.hdv}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      HDV {item.account.hdv} - Niveau {item.account.level}
                    </h3>
                    <p className="text-blue-500 font-bold">
                      {item.account.price} €
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{total} €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions de paiement */}
          <div className="bg-white/5 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">
              Instructions de paiement
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">PayPal</h3>
                <p className="text-white/80 mb-4">
                  Veuillez suivre ces étapes pour effectuer votre paiement :
                </p>
                <ol className="list-decimal list-inside space-y-2 text-white/80">
                  <li>Cliquez sur le bouton PayPal ci-dessous</li>
                  <li>Connectez-vous à votre compte PayPal</li>
                  <li>
                    Sélectionnez{" "}
                    <span className="font-semibold">"Envoyer à un proche"</span>
                  </li>
                  <li>
                    Important :{" "}
                    <span className="font-semibold">
                      Ne pas ajouter de message lors de l'envoi
                    </span>
                  </li>
                  <li>Montant à envoyer : {total} €</li>
                </ol>
              </div>

              <a
                href="https://www.paypal.com/paypalme/antoz19"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#0070BA] text-white text-center rounded-lg font-semibold hover:bg-[#003087] transition-colors"
              >
                Payer avec PayPal
              </a>

              <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
                <h4 className="text-yellow-500 font-semibold mb-2">
                  Important
                </h4>
                <p className="text-white/80">
                  Après votre paiement, veuillez nous contacter sur Discord ou
                  Telegram avec votre preuve de paiement pour recevoir votre
                  compte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

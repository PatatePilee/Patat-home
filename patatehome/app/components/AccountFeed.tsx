"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageUrl: string;
  features: string[];
  status: string;
};

export default function AccountFeed() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      if (!response.ok) throw new Error("Erreur lors de la récupération");
      const data = await response.json();
      const formattedAccounts = data
        .filter((account: Account) => account.status === "available")
        .map((account: any) => ({
          ...account,
          features: JSON.parse(account.features),
        }));
      setAccounts(formattedAccounts);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  if (accounts.length === 0) return null;

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {accounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={account.imageUrl}
                alt={`HDV ${account.hdv}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-4 text-white">
              <h2 className="text-lg font-bold mb-2">
                HDV {account.hdv} - Niveau {account.level}
              </h2>
              <div className="mb-2 text-xl font-semibold text-blue-400">
                {account.price}€
              </div>
              <div className="space-y-1 text-sm mb-3">
                {account.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <span className="text-blue-400">•</span>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/products/${account.id}`}
                className="inline-block w-full bg-blue-600 text-center py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors"
              >
                Voir les détails
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

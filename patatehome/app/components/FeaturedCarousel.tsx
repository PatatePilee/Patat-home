"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AccountImage from "@/app/components/AccountImage";

type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageFilename: string;
  features: string[];
};

export default function FeaturedCarousel({
  accounts,
}: {
  accounts: Account[];
}) {
  if (!accounts || accounts.length < 3) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === accounts.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const getPrevIndex = () => {
    return currentIndex === 0 ? accounts.length - 1 : currentIndex - 1;
  };

  const getNextIndex = () => {
    return currentIndex === accounts.length - 1 ? 0 : currentIndex + 1;
  };

  const prevAccount = accounts[getPrevIndex()];
  const currentAccount = accounts[currentIndex];
  const nextAccount = accounts[getNextIndex()];

  if (
    !prevAccount?.imageFilename ||
    !currentAccount?.imageFilename ||
    !nextAccount?.imageFilename
  ) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[400px] overflow-hidden">
      {/* Flèches de navigation */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
        <button
          onClick={() => setCurrentIndex(getPrevIndex())}
          className="bg-white hover:bg-white/90 text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Image précédente"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentIndex(getNextIndex())}
          className="bg-white hover:bg-white/90 text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Image suivante"
        >
          →
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Compte précédent (gauche) */}
        <div
          className="absolute left-0 w-1/3 h-[250px] transform -translate-x-1/3 opacity-50 transition-all duration-500 cursor-pointer hover:opacity-75"
          onClick={() => setCurrentIndex(getPrevIndex())}
        >
          <div className="relative w-full h-full">
            <AccountImage
              src={`/accounts/${prevAccount.imageFilename}`}
              alt={`HDV ${prevAccount.hdv}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>

        {/* Compte principal (centre) */}
        <div className="relative w-1/2 h-[300px] z-10 transform scale-110 transition-all duration-500">
          <AccountImage
            src={`/accounts/${currentAccount.imageFilename}`}
            alt={`HDV ${currentAccount.hdv}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">
              HDV {currentAccount.hdv} - Niveau {currentAccount.level}
            </h3>
            <ul className="mb-4 space-y-1 text-sm">
              {currentAccount.features.slice(0, 2).map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-500">
                {currentAccount.price} €
              </span>
              <Link href={`/products/${currentAccount.id}`}>
                Voir le produit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

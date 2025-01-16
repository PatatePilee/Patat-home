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
};

export default function FeaturedCarousel({
  accounts,
}: {
  accounts: Account[];
}) {
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
            <Image
              src={accounts[getPrevIndex()].imageUrl}
              alt={`HDV ${accounts[getPrevIndex()].hdv}`}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>

        {/* Compte principal (centre) */}
        <div className="relative w-1/2 h-[300px] z-10 transform scale-110 transition-all duration-500">
          <Image
            src={accounts[currentIndex].imageUrl}
            alt={`HDV ${accounts[currentIndex].hdv}`}
            fill
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">
              HDV {accounts[currentIndex].hdv} - Niveau{" "}
              {accounts[currentIndex].level}
            </h3>
            <ul className="mb-4 space-y-1 text-sm">
              {accounts[currentIndex].features.slice(0, 2).map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-500">
                {accounts[currentIndex].price} €
              </span>
              <Link
                href={`/products/${accounts[currentIndex].id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Voir les détails →
              </Link>
            </div>
          </div>
        </div>

        {/* Compte suivant (droite) */}
        <div
          className="absolute right-0 w-1/3 h-[250px] transform translate-x-1/3 opacity-50 transition-all duration-500 cursor-pointer hover:opacity-75"
          onClick={() => setCurrentIndex(getNextIndex())}
        >
          <div className="relative w-full h-full">
            <Image
              src={accounts[getNextIndex()].imageUrl}
              alt={`HDV ${accounts[getNextIndex()].hdv}`}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {accounts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-blue-950">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Avis de nos clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Exemple de témoignage */}
          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                T
              </div>
              <div className="ml-4">
                <h3 className="font-bold">Thomas</h3>
                <p className="text-sm text-white/60">HDV 16 acheté</p>
              </div>
            </div>
            <p className="text-white/80">
              "Service impeccable, transaction rapide et sécurisée. Je
              recommande !"
            </p>
          </div>
          {/* Ajoutez d'autres témoignages similaires */}
        </div>
      </div>
    </section>
  );
}

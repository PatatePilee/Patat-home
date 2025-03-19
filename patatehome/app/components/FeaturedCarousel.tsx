"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  //console.log("FeaturedCarousel - Comptes reçus:", accounts.length);

  // Vérifier que les comptes ont bien le format attendu
  accounts.forEach((account, index) => {
    // console.log(`Compte carrousel ${index}:`, {
    //   id: account.id,
    //   hdv: account.hdv,
    //   imageFilename: account.imageFilename,
    //   features: Array.isArray(account.features)
    //     ? `Array(${account.features.length})`
    //     : typeof account.features,
    // });
  });

  // Accepter 2 comptes minimum au lieu de 3
  if (!accounts || accounts.length < 2) {
    //console.log("Pas assez de comptes pour le carrousel (minimum 2)");
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  // Générer un seul timestamp au chargement initial du composant
  const initialTimestamp = useMemo(() => Date.now(), []);

  // Créer un objet pour stocker les timestamps de rechargement par image
  const [reloadTimestamps, setReloadTimestamps] = useState<
    Record<string, number>
  >({});

  // Fonction pour recharger une image spécifique
  const handleImageError = useCallback((imageFilename: string) => {
    setReloadTimestamps((prev) => ({
      ...prev,
      [imageFilename]: Date.now(),
    }));
  }, []);

  // Construire l'URL de l'image avec le bon timestamp
  const getImageUrl = useCallback(
    (imageFilename: string) => {
      const timestamp = reloadTimestamps[imageFilename] || initialTimestamp;
      return `/api/images/${imageFilename}?t=${timestamp}`;
    },
    [initialTimestamp, reloadTimestamps]
  );

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

  // console.log("Indices du carrousel:", {
  //   prev: getPrevIndex(),
  //   current: currentIndex,
  //   next: getNextIndex(),
  // });

  if (!currentAccount?.imageFilename) {
    //console.error("Le compte actuel n'a pas d'image");
    return null;
  }

  // Si nous n'avons que 2 comptes, le compte précédent et suivant sont le même
  const hasTwoAccounts = accounts.length === 2;

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[450px] overflow-hidden">
      {/* Titre de la section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Comptes Vedettes
        </h2>
        <div className="w-24 h-1 mx-auto mt-2 bg-blue-500"></div>
      </div>

      {/* Fl  tion */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
        <button
          onClick={() => setCurrentIndex(getPrevIndex())}
          className="bg-white/90 hover:bg-white text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Image précédente"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentIndex(getNextIndex())}
          className="bg-white/90 hover:bg-white text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Image suivante"
        >
          →
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Compte précédent (gauche) */}
        {prevAccount?.imageFilename && (
          <div
            className="absolute left-0 w-1/3 h-[250px] transform -translate-x-1/3 opacity-50 transition-all duration-500 cursor-pointer hover:opacity-75"
            onClick={() => setCurrentIndex(getPrevIndex())}
          >
            <div className="relative w-full h-full">
              <AccountImage
                src={getImageUrl(prevAccount.imageFilename)}
                alt={`HDV ${prevAccount.hdv}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(prevAccount.imageFilename)}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </div>
        )}

        {/* Compte principal (centre) */}
        <div className="relative w-1/2 h-[320px] z-10 transform scale-110 transition-all duration-500 rounded-lg overflow-hidden shadow-2xl">
          <AccountImage
            src={getImageUrl(currentAccount.imageFilename)}
            alt={`HDV ${currentAccount.hdv}`}
            className="w-full h-full object-cover"
            onError={() => handleImageError(currentAccount.imageFilename)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">
              HDV {currentAccount.hdv} - Niveau {currentAccount.level}
            </h3>
            <ul className="mb-4 space-y-1 text-sm">
              {Array.isArray(currentAccount.features) &&
                currentAccount.features.slice(0, 2).map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              {Array.isArray(currentAccount.features) &&
                currentAccount.features.length > 2 && (
                  <li className="flex items-center space-x-2 text-blue-400">
                    <span>+</span>
                    <span>
                      {currentAccount.features.length - 2} autres
                      caractéristiques
                    </span>
                  </li>
                )}
            </ul>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-500">
                {currentAccount.price} €
              </span>
              <Link
                href={`/products/${currentAccount.id}`}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Voir le produit
              </Link>
            </div>
          </div>
        </div>

        {/* Compte suivant (droite) */}
        {nextAccount?.imageFilename && (
          <div
            className="absolute right-0 w-1/3 h-[250px] transform translate-x-1/3 opacity-50 transition-all duration-500 cursor-pointer hover:opacity-75"
            onClick={() => setCurrentIndex(getNextIndex())}
          >
            <div className="relative w-full h-full">
              <AccountImage
                src={getImageUrl(nextAccount.imageFilename)}
                alt={`HDV ${nextAccount.hdv}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(nextAccount.imageFilename)}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs de slide */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {accounts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

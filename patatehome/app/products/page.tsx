"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageUrl: string;
  features: string[];
  status: string;
  category?: string;
  tags?: string[];
};

export default function ProductsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/api/accounts");
        if (response.ok) {
          const data = await response.json();
          const formattedAccounts = data.map((account: any) => ({
            ...account,
            imageUrl: account.imageUrl.startsWith("/")
              ? account.imageUrl
              : `/accounts/${account.imageUrl}`,
            features: JSON.parse(account.features),
            tags: [],
            category: `hdv${account.hdv}`,
          }));
          setAccounts(formattedAccounts);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des comptes:", error);
      }
    }

    fetchAccounts();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    hdv: null as number | null,
    priceRange: {
      min: 0,
      max: 1000,
    },
    tag: null as string | null,
  });
  const [selectedCategory, setSelectedCategory] = useState<
    "accounts" | "clans" | "brawlstars"
  >("accounts");

  const filteredAccounts = accounts.filter((account) => {
    // Filtre par catégorie principale
    const categoryTypeMatch =
      (selectedCategory === "accounts" && account.category.startsWith("hdv")) ||
      (selectedCategory === "clans" && account.category === "clans") ||
      (selectedCategory === "brawlstars" && account.category === "brawlstars");

    if (!categoryTypeMatch) return false;

    const searchMatch =
      searchQuery === "" ||
      account.features.some((f) =>
        f.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      account.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const hdvMatch = !filters.hdv || account.hdv === filters.hdv;

    const priceMatch =
      account.price >= filters.priceRange.min &&
      account.price <= filters.priceRange.max;

    const tagMatch = !filters.tag || account.tags.includes(filters.tag);

    return searchMatch && hdvMatch && priceMatch && tagMatch;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Sélection de catégorie */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory("accounts")}
            className={`p-6 rounded-lg border ${
              selectedCategory === "accounts"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Comptes Clash of Clans</h3>
            <p className="text-sm opacity-80">HDV 17, 16, 15 et moins</p>
          </button>
          <button
            onClick={() => setSelectedCategory("clans")}
            className={`p-6 rounded-lg border ${
              selectedCategory === "clans"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Clans</h3>
            <p className="text-sm opacity-80">Clans de niveau 15+</p>
          </button>
          <button
            onClick={() => setSelectedCategory("brawlstars")}
            className={`p-6 rounded-lg border ${
              selectedCategory === "brawlstars"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-foreground/10 hover:border-blue-600"
            } transition-colors`}
          >
            <h3 className="text-lg font-bold mb-2">Brawl Stars</h3>
            <p className="text-sm opacity-80">Comptes maxés</p>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher un compte..."
            className="w-full p-4 rounded-lg border border-foreground/10 bg-black/40 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres */}
          <div className="lg:col-span-1">
            <div className="bg-foreground/5 p-6 rounded-lg space-y-8">
              <h3 className="text-xl font-bold">Filtres</h3>

              {selectedCategory === "accounts" && (
                <div>
                  <h4 className="font-semibold mb-4">Niveau HDV</h4>
                  <div className="space-y-2">
                    {[17, 16, 15].map((hdv) => (
                      <button
                        key={hdv}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            hdv: prev.hdv === hdv ? null : hdv,
                          }))
                        }
                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
                          filters.hdv === hdv
                            ? "bg-blue-600 text-white"
                            : "bg-background hover:bg-blue-50"
                        }`}
                      >
                        HDV {hdv}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-4">Prix maximum</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange,
                          max: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-sm">
                    <span>0€</span>
                    <span>{filters.priceRange.max}€</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Type de compte</h4>
                <div className="space-y-2">
                  {["max", "premium", "presque-max"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          tag: prev.tag === tag ? null : tag,
                        }))
                      }
                      className={`w-full py-2 px-4 rounded-lg transition-colors capitalize ${
                        filters.tag === tag
                          ? "bg-blue-600 text-white"
                          : "bg-background hover:bg-blue-50"
                      }`}
                    >
                      {tag.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAccounts.length > 0
                ? filteredAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="border border-foreground/10 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={account.imageUrl}
                          alt={`HDV ${account.hdv}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        HDV {account.hdv} - Niveau {account.level}
                      </h3>
                      <ul className="mb-4 space-y-1">
                        {account.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                          {account.price} €
                        </span>
                        <Link
                          href={`/products/${account.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Voir les détails →
                        </Link>
                      </div>
                    </div>
                  ))
                : (filters.hdv ||
                    filters.tag ||
                    searchQuery ||
                    filters.priceRange.max !== 1000) && (
                    <div className="md:col-span-2 text-center py-12">
                      <h3 className="text-xl font-bold mb-4 text-white">
                        Aucun compte disponible
                      </h3>
                      <p className="text-white/80 mb-8">
                        Nous n'avons pas de compte correspondant à vos critères
                        actuellement, mais nous pouvons en chercher un pour vous
                        !
                      </p>
                      <Link
                        href="/request"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Demander un compte personnalisé →
                      </Link>
                    </div>
                  )}

              {filteredAccounts.length > 0 && filteredAccounts.length < 4 && (
                <div className="md:col-span-2 mt-8 p-6 border border-foreground/10 rounded-xl text-center bg-white/5">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Vous ne trouvez pas ce que vous cherchez ?
                  </h3>
                  <p className="mb-4 text-white/80">
                    Nous pouvons chercher un compte qui correspond exactement à
                    vos besoins !
                  </p>
                  <Link
                    href="/request"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Faire une demande personnalisée →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

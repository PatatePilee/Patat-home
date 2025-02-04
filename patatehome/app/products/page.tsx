"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DarkLayout from '../layouts/DarkLayout';

type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageUrl: string;
  features: string[];
  status: string;
  category?: string;
  tags: string[];
  cartCount: number;
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
            cartCount: account.cartCount,
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
    "accounts" | "clans" | "brawlstars" | "services"
  >("accounts");

  const filteredAccounts = accounts.filter((account) => {
    // Filtre par catégorie principale
    const categoryTypeMatch =
      (selectedCategory === "accounts" &&
        account.category?.startsWith("hdv")) ||
      (selectedCategory === "clans" && account.category === "clans") ||
      (selectedCategory === "brawlstars" &&
        account.category === "brawlstars") ||
      (selectedCategory === "services" && account.category === "services");

    if (!categoryTypeMatch) return false;

    const searchMatch =
      (searchQuery === "" ||
        account.features.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        account.tags?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        )) ??
      false;

    const hdvMatch = !filters.hdv || account.hdv === filters.hdv;

    const priceMatch =
      account.price >= filters.priceRange.min &&
      account.price <= filters.priceRange.max;

    const tagMatch = !filters.tag || account.tags.includes(filters.tag);

    return searchMatch && hdvMatch && priceMatch && tagMatch;
  });

  return (
    <DarkLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Sélection de catégorie */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              onClick={() => setSelectedCategory("services")}
              className={`p-6 rounded-lg border ${
                selectedCategory === "services"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-foreground/10 hover:border-blue-600"
              } transition-colors`}
            >
              <h3 className="text-lg font-bold mb-2">Services</h3>
              <p className="text-sm opacity-80">Joyaux, Farm, Boost...</p>
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

          {/* Affichage des services si sélectionné */}
          {selectedCategory === "services" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Joyaux de Capitale",
                  description:
                    "Boost de votre capitale de clan avec des joyaux supplémentaires",
                  price: "10€",
                  image: "/services/capitale.jpg",
                  link: "/services/capitale",
                },
                {
                  title: "Jeux de Clans",
                  description:
                    "Participation aux jeux de clans pour maximiser vos récompenses",
                  price: "15€",
                  image: "/services/clan-games.jpg",
                  link: "/services/clan-games",
                },
                {
                  title: "Farm Compte",
                  description:
                    "Service de farm pour développer votre compte rapidement",
                  price: "20€/semaine",
                  image: "/services/farming.jpg",
                  link: "/services/farming",
                },
                {
                  title: "Parrainage Bancaire",
                  description: "Parrainage pour vos achats de packs en jeu",
                  price: "Sur devis",
                  image: "/services/sponsor.jpg",
                  link: "/services/sponsor",
                },
                {
                  title: "Nitro Boost",
                  description:
                    "Boost Discord Nitro pour accéder aux avantages premium",
                  price: "8€",
                  image: "/services/nitro.jpg",
                  link: "/services/nitro",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-500">
                        {service.price}
                      </span>
                      <Link
                        href={service.link}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Commander
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCategory !== "services" && (
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
                            {account.cartCount > 0 && (
                              <div className="absolute top-2 right-2 bg-blue-600/90 px-2 py-1 rounded text-sm">
                                <span className="font-semibold">
                                  {account.cartCount}
                                </span>{" "}
                                dans les paniers
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            HDV {account.hdv} - Niveau {account.level}
                          </h3>
                          <div className="mb-4 truncate text-white/80">
                            • {account.features[0]}
                            {account.features.length > 1 && (
                              <span className="text-sm text-white/60">
                                {" "}
                                (+{account.features.length - 1} autres)
                              </span>
                            )}
                          </div>
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
                            Nous n'avons pas de compte correspondant à vos
                            critères actuellement, mais nous pouvons en chercher
                            un pour vous !
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
                        Nous pouvons chercher un compte qui correspond exactement
                        à vos besoins !
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
          )}
        </div>
      </div>
    </DarkLayout>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Account } from "@/app/types/account";

type EditingAccount = {
  id: number;
  hdv: string;
  level: string;
  price: string;
  imageFilename: string;
  features: string;
  status: string;
};
//test
export default function AccountsTable() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(
    null
  );
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Récupération des comptes...");
      const cacheKey = `accounts_cache_${Date.now()}`;

      const response = await fetch(`/api/admin/accounts?cache=${cacheKey}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      console.log("Statut de la réponse:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", response.status, errorText);
        setError(
          `Erreur ${response.status}: ${errorText || "Erreur inconnue"}`
        );
        return;
      }

      const data = await response.json();
      console.log(`${data.length} comptes récupérés`);

      // Mettre en cache les comptes chargés avec un timestamp
      localStorage.setItem(
        "accounts_data",
        JSON.stringify({
          timestamp: Date.now(),
          accounts: data,
        })
      );

      setAccounts(
        data.map((account: Account) => ({
          ...account,
          features: Array.isArray(account.features)
            ? account.features
            : typeof account.features === "string" &&
              account.features.startsWith("[")
            ? JSON.parse(account.features)
            : account.features.split("\n"),
        }))
      );

      // Update timestamp only when data is successfully fetched
      setTimestamp(Date.now()); // Crée un nouveau timestamp pour forcer le rechargement des images
    } catch (error) {
      console.error("Erreur lors de la récupération des comptes:", error);
      setError(
        `Erreur lors de la récupération des comptes: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier s'il y a des données en cache et les charger
    const cachedData = localStorage.getItem("accounts_data");
    if (cachedData) {
      try {
        const { timestamp, accounts: cachedAccounts } = JSON.parse(cachedData);
        const now = Date.now();
        // Utiliser le cache seulement s'il est frais (moins de 5 minutes)
        if (now - timestamp < 5 * 60 * 1000) {
          console.log("Utilisation des données en cache");
          setAccounts(
            cachedAccounts.map((account: Account) => ({
              ...account,
              features: Array.isArray(account.features)
                ? account.features
                : typeof account.features === "string" &&
                  account.features.startsWith("[")
                ? JSON.parse(account.features)
                : account.features.split("\n"),
            }))
          );
          setTimestamp(timestamp);
        } else {
          console.log("Cache expiré, chargement des données fraîches");
          fetchAccounts();
        }
      } catch (e) {
        console.error("Erreur lors de la lecture du cache:", e);
        fetchAccounts();
      }
    } else {
      fetchAccounts();
    }
  }, []);

  const handleStartEdit = (account: Account) => {
    setEditingAccount({
      id: account.id,
      hdv: account.hdv.toString(),
      level: account.level.toString(),
      price: account.price.toString(),
      imageFilename: account.imageFilename,
      features: Array.isArray(account.features)
        ? account.features.join("\n")
        : account.features,
      status: account.status,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      try {
        const response = await fetch(`/api/admin/accounts/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setAccounts(accounts.filter((account) => account.id !== id));
          fetchAccounts(); // Refresh after delete
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (!editingAccount) return;

    try {
      const response = await fetch(`/api/admin/accounts/${editingAccount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hdv: parseInt(editingAccount.hdv),
          level: parseInt(editingAccount.level),
          price: parseInt(editingAccount.price),
          imageFilename: editingAccount.imageFilename,
          features: editingAccount.features.split("\n"),
          status: editingAccount.status,
        }),
      });

      if (response.ok) {
        const updatedAccount = await response.json();
        setAccounts(
          accounts.map((account) =>
            account.id === editingAccount.id ? updatedAccount : account
          )
        );
        setEditingAccount(null);
        fetchAccounts(); // Refresh after edit
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between">
        <div>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-2">
              {error}
              <button
                className="ml-2 bg-red-700 px-2 py-1 rounded"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <button
          className={`px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={fetchAccounts}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Rafraîchir les comptes et les images"}
        </button>
      </div>

      <table className="min-w-full bg-white/5 rounded-lg">
        <thead>
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">HDV</th>
            <th className="p-4">Niveau</th>
            <th className="p-4">Prix</th>
            <th className="p-4">Image</th>
            <th className="p-4">Caractéristiques</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-t border-white/10">
              <td className="p-4">{account.id}</td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <input
                    type="number"
                    value={editingAccount.hdv}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        hdv: e.target.value,
                      })
                    }
                    className="w-20 p-1 bg-white/10 rounded"
                  />
                ) : (
                  account.hdv
                )}
              </td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <input
                    type="number"
                    value={editingAccount.level}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        level: e.target.value,
                      })
                    }
                    className="w-20 p-1 bg-white/10 rounded"
                  />
                ) : (
                  account.level
                )}
              </td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <input
                    type="number"
                    value={editingAccount.price}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        price: e.target.value,
                      })
                    }
                    className="w-20 p-1 bg-white/10 rounded"
                  />
                ) : (
                  `${account.price}€`
                )}
              </td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <input
                    type="text"
                    value={editingAccount.imageFilename}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        imageFilename: e.target.value,
                      })
                    }
                    className="w-full p-1 bg-white/10 rounded"
                  />
                ) : (
                  <img
                    src={`/api/images/${account.imageFilename}?v=${timestamp}`}
                    alt={`HDV ${account.hdv}`}
                    className="w-20 h-20 object-cover rounded"
                    loading="lazy"
                    onError={(e) => {
                      console.error(
                        `Erreur de chargement de l'image: ${account.imageFilename}`
                      );
                      // Utiliser une URL data pour une image minimaliste au lieu de /placeholder.png
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M20 20 L80 80 M80 20 L20 80' stroke='%23999999' stroke-width='3'/%3E%3C/svg%3E";
                      // Prévenir une autre erreur en désactivant l'événement
                      e.currentTarget.onerror = null;
                    }}
                  />
                )}
              </td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <textarea
                    value={editingAccount.features}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        features: e.target.value,
                      })
                    }
                    className="w-full p-1 bg-white/10 rounded"
                  />
                ) : (
                  <ul>
                    {(typeof account.features === "string"
                      ? JSON.parse(account.features)
                      : account.features
                    ).map((feature: string, index: number) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <select
                    value={editingAccount.status}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        status: e.target.value,
                      })
                    }
                    className="p-1 bg-white/10 rounded"
                  >
                    <option value="available">Disponible</option>
                    <option value="sold">Vendu</option>
                  </select>
                ) : (
                  account.status
                )}
              </td>
              <td className="p-4">
                {editingAccount?.id === account.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingAccount(null)}
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStartEdit(account)}
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Account } from "@/app/types/account";
import Image from "next/image";

type EditingAccount = {
  id: number;
  hdv: string;
  level: string;
  price: string;
  imageUrl: string;
  features: string;
  status: string;
};

export default function AccountsTable() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(
    null
  );

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/admin/accounts");
        if (response.ok) {
          const data = await response.json();
          setAccounts(
            data.map((account: Account) => ({
              ...account,
              features: Array.isArray(account.features)
                ? account.features
                : account.features.split("\n"),
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des comptes:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleStartEdit = (account: Account) => {
    setEditingAccount({
      id: account.id,
      hdv: account.hdv.toString(),
      level: account.level.toString(),
      price: account.price.toString(),
      imageUrl: account.imageUrl,
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
          imageUrl: editingAccount.imageUrl,
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
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
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
                    value={editingAccount.imageUrl}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        imageUrl: e.target.value,
                      })
                    }
                    className="w-full p-1 bg-white/10 rounded"
                  />
                ) : (
                  <img
                    src={account.imageUrl}
                    alt={`HDV ${account.hdv}`}
                    className="w-20 h-20 object-cover rounded"
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

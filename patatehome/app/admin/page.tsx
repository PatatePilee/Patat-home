"use client";
import { useState } from "react";
import AccountsTable from "./components/AccountsTable";

export default function AdminPage() {
  const [accountForm, setAccountForm] = useState({
    hdv: "",
    level: "",
    price: "",
    imageUrl: "",
    features: "",
    status: "available",
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...accountForm,
          features: accountForm.features.split("\n"),
        }),
      });

      if (response.ok) {
        setAccountForm({
          hdv: "",
          level: "",
          price: "",
          imageUrl: "",
          features: "",
          status: "available",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">Administration</h1>
        
        {/* Section création de compte */}
        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Créer un compte</h2>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="HDV"
                value={accountForm.hdv}
                onChange={(e) => setAccountForm({ ...accountForm, hdv: e.target.value })}
                className="p-2 rounded bg-white/10 text-white"
              />
              <input
                type="number"
                placeholder="Niveau"
                value={accountForm.level}
                onChange={(e) => setAccountForm({ ...accountForm, level: e.target.value })}
                className="p-2 rounded bg-white/10 text-white"
              />
              <input
                type="number"
                placeholder="Prix"
                value={accountForm.price}
                onChange={(e) => setAccountForm({ ...accountForm, price: e.target.value })}
                className="p-2 rounded bg-white/10 text-white"
              />
              <input
                type="text"
                placeholder="URL de l'image"
                value={accountForm.imageUrl}
                onChange={(e) => setAccountForm({ ...accountForm, imageUrl: e.target.value })}
                className="p-2 rounded bg-white/10 text-white"
              />
              <textarea
                placeholder="Caractéristiques (une par ligne)"
                value={accountForm.features}
                onChange={(e) => setAccountForm({ ...accountForm, features: e.target.value })}
                className="p-2 rounded bg-white/10 text-white md:col-span-2"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Créer le compte
            </button>
          </form>
        </div>

        {/* Section liste des comptes */}
        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Liste des comptes</h2>
          <AccountsTable initialAccounts={[]} />
        </div>
      </div>
    </div>
  );
}

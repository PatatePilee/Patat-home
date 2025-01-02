"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== "admin") {
        router.push("/");
      }
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [accountForm, setAccountForm] = useState({
    hdv: "",
    level: "",
    price: "",
    imageUrl: "",
    features: "",
    status: "available",
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        alert("Utilisateur créé avec succès");
        setUserForm({ username: "", email: "", password: "", role: "user" });
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      alert("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hdv = parseInt(accountForm.hdv);
      const level = parseInt(accountForm.level);
      const price = parseInt(accountForm.price);

      if (isNaN(hdv) || isNaN(level) || isNaN(price)) {
        alert("Les champs HDV, niveau et prix doivent être des nombres");
        return;
      }

      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hdv,
          level,
          price,
          imageUrl: accountForm.imageUrl,
          features: accountForm.features.split("\n"),
          status: accountForm.status,
        }),
      });

      if (response.ok) {
        alert("Compte créé avec succès");
        setAccountForm({
          hdv: "",
          level: "",
          price: "",
          imageUrl: "",
          features: "",
          status: "available",
        });
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création du compte");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">Administration</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Création d'utilisateur */}
        <div className="bg-black/40 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Créer un utilisateur</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
            >
              Créer l'utilisateur
            </button>
          </form>
        </div>

        {/* Création de compte */}
        <div className="bg-black/40 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Créer un compte Clash</h2>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <input
              type="number"
              placeholder="HDV"
              value={accountForm.hdv}
              onChange={(e) =>
                setAccountForm({ ...accountForm, hdv: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <input
              type="number"
              placeholder="Niveau"
              value={accountForm.level}
              onChange={(e) =>
                setAccountForm({ ...accountForm, level: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <input
              type="number"
              placeholder="Prix"
              value={accountForm.price}
              onChange={(e) =>
                setAccountForm({ ...accountForm, price: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <input
              type="text"
              placeholder="URL de l'image"
              value={accountForm.imageUrl}
              onChange={(e) =>
                setAccountForm({ ...accountForm, imageUrl: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
            <textarea
              placeholder="Caractéristiques (une par ligne)"
              value={accountForm.features}
              onChange={(e) =>
                setAccountForm({ ...accountForm, features: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 h-32"
            />
            <select
              value={accountForm.status}
              onChange={(e) =>
                setAccountForm({ ...accountForm, status: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            >
              <option value="available">Disponible</option>
              <option value="sold">Vendu</option>
              <option value="reserved">Réservé</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
            >
              Créer le compte
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

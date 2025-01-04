"use client";
import { useState, useEffect } from "react";
import AccountsTable from "./components/AccountsTable";
import UsersTable from "./components/UsersTable";
import ReviewsTable from "./components/ReviewsTable";
import GiveawayTable from "./components/GiveawayTable";
import PageSettings from "./components/PageSettings";
import PagesManager from "./components/PagesManager";
import { Switch } from "@headlessui/react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "accounts" | "users" | "reviews" | "giveaway"
  >("accounts");

  const [accountForm, setAccountForm] = useState({
    hdv: "",
    level: "",
    price: "",
    imageUrl: "",
    features: "",
    status: "available",
  });

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [reviewForm, setReviewForm] = useState({
    username: "",
    avatarUrl: "",
    message: "",
  });

  const [giveawayForm, setGiveawayForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    prizes: "",
    requirements: "",
    startDate: "",
    endDate: "",
    isActive: false,
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        setUserForm({
          username: "",
          email: "",
          password: "",
          role: "user",
        });
        const usersTableElement = document.querySelector(
          '[data-component="users-table"]'
        );
        if (usersTableElement) {
          const event = new Event("reload");
          usersTableElement.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewForm,
          date: Date.now(),
        }),
      });

      if (response.ok) {
        setReviewForm({
          username: "",
          avatarUrl: "",
          message: "",
        });
        const reviewsTableElement = document.querySelector(
          '[data-component="reviews-table"]'
        );
        if (reviewsTableElement) {
          const event = new Event("reload");
          reviewsTableElement.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleCreateGiveaway = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields before submission
    if (
      !giveawayForm.title ||
      !giveawayForm.description ||
      !giveawayForm.imageUrl ||
      !giveawayForm.prizes ||
      !giveawayForm.requirements ||
      !giveawayForm.startDate ||
      !giveawayForm.endDate
    ) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/admin/giveaways", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: giveawayForm.title,
          description: giveawayForm.description,
          imageUrl: giveawayForm.imageUrl,
          prizes: giveawayForm.prizes.split("\n"),
          requirements: giveawayForm.requirements.split("\n"),
          startDate: giveawayForm.startDate,
          endDate: giveawayForm.endDate,
          isActive: giveawayForm.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Une erreur est survenue");
      }

      setGiveawayForm({
        title: "",
        description: "",
        imageUrl: "",
        prizes: "",
        requirements: "",
        startDate: "",
        endDate: "",
        isActive: false,
      });

      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la création du giveaway:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">Administration</h1>

        {/* Onglets */}
        <div className="flex space-x-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`px-4 py-2 ${
              activeTab === "accounts"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white/60 hover:text-white"
            }`}
          >
            Comptes
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 ${
              activeTab === "users"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white/60 hover:text-white"
            }`}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 ${
              activeTab === "reviews"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white/60 hover:text-white"
            }`}
          >
            Avis
          </button>
          <button
            onClick={() => setActiveTab("giveaway")}
            className={`px-4 py-2 ${
              activeTab === "giveaway"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white/60 hover:text-white"
            }`}
          >
            Giveaway
          </button>
        </div>

        {activeTab === "giveaway" ? (
          <>
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Créer un giveaway
              </h2>
              <form onSubmit={handleCreateGiveaway} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Titre"
                    value={giveawayForm.title}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        title: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="text"
                    placeholder="URL de l'image"
                    value={giveawayForm.imageUrl}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <textarea
                    placeholder="Description"
                    value={giveawayForm.description}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        description: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white md:col-span-2"
                    rows={4}
                  />
                  <textarea
                    placeholder="Lots à gagner (un par ligne)"
                    value={giveawayForm.prizes}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        prizes: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                    rows={4}
                  />
                  <textarea
                    placeholder="Conditions de participation (une par ligne)"
                    value={giveawayForm.requirements}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        requirements: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                    rows={4}
                  />
                  <input
                    type="datetime-local"
                    value={giveawayForm.startDate}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        startDate: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="datetime-local"
                    value={giveawayForm.endDate}
                    onChange={(e) =>
                      setGiveawayForm({
                        ...giveawayForm,
                        endDate: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={giveawayForm.isActive}
                      onChange={(e) =>
                        setGiveawayForm({
                          ...giveawayForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded bg-white/10"
                    />
                    <label className="text-white">Activer le giveaway</label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Créer le giveaway
                </button>
              </form>
            </div>

            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Liste des giveaways
              </h2>
              <GiveawayTable />
            </div>
          </>
        ) : activeTab === "reviews" ? (
          <>
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Créer un avis
              </h2>
              <form onSubmit={handleCreateReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={reviewForm.username}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, username: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="text"
                    placeholder="URL de l'avatar"
                    value={reviewForm.avatarUrl}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        avatarUrl: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <textarea
                    placeholder="Message"
                    value={reviewForm.message}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, message: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white md:col-span-2"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Créer l'avis
                </button>
              </form>
            </div>

            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Liste des avis
              </h2>
              <ReviewsTable />
            </div>
          </>
        ) : activeTab === "accounts" ? (
          <>
            {/* Section création de compte */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Créer un compte
              </h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="HDV"
                    value={accountForm.hdv}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, hdv: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Niveau"
                    value={accountForm.level}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, level: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Prix"
                    value={accountForm.price}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, price: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="text"
                    placeholder="URL de l'image"
                    value={accountForm.imageUrl}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <textarea
                    placeholder="Caractéristiques (une par ligne)"
                    value={accountForm.features}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        features: e.target.value,
                      })
                    }
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
              <h2 className="text-2xl font-bold mb-4 text-white">
                Liste des comptes
              </h2>
              <AccountsTable />
            </div>
          </>
        ) : (
          <>
            {/* Section création d'utilisateur */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Créer un utilisateur
              </h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={userForm.username}
                    onChange={(e) =>
                      setUserForm({ ...userForm, username: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  />
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({ ...userForm, role: e.target.value })
                    }
                    className="p-2 rounded bg-white/10 text-white"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Créer l'utilisateur
                </button>
              </form>
            </div>

            {/* Section liste des utilisateurs */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Liste des utilisateurs
              </h2>
              <UsersTable />
            </div>
          </>
        )}

        {activeTab === "pages" ? (
          <>
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Paramètres des pages
              </h2>
              <div className="space-y-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-400">{page.path}</p>
                    </div>
                    <Switch
                      checked={page.isActive === 1}
                      onChange={() => handleTogglePage(page.id, page.isActive)}
                      className={`${
                        page.isActive === 1 ? "bg-blue-600" : "bg-gray-600"
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          page.isActive === 1
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

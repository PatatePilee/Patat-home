"use client";
import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import AccountsTable from "./components/AccountsTable";
import UsersTable from "./components/UsersTable";
import ReviewsTable from "./components/ReviewsTable";
import GiveawayTable from "./components/GiveawayTable";
import PageSettings from "./components/PageSettings";
import PagesManager from "./components/PagesManager";
import { Switch } from "@headlessui/react";

type Page = {
  id: number;
  title: string;
  path: string;
  isActive: number;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "accounts" | "users" | "reviews" | "giveaway" | "pages"
  >("accounts");

  const [isLoading, setIsLoading] = useState(false);

  const [accountForm, setAccountForm] = useState({
    hdv: "",
    level: "",
    price: "",
    imageFile: null as File | null,
    additionalImageFiles: [] as (File | null)[],
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

  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  async function handleTogglePage(
    id: Key | null | undefined,
    isActive: number
  ) {
    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: isActive === 1 ? 0 : 1 }),
      });

      if (response.ok) {
        fetchPages(); // Refresh pages after toggle
      }
    } catch (error) {
      console.error("Error toggling page:", error);
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Préparation des données du formulaire
      const formData = new FormData();
      formData.append("hdv", accountForm.hdv);
      formData.append("level", accountForm.level);
      formData.append("price", accountForm.price);
      formData.append(
        "features",
        JSON.stringify(accountForm.features.split("\n"))
      );
      formData.append("status", accountForm.status);

      if (accountForm.imageFile) {
        formData.append("image", accountForm.imageFile);
      }

      // Ajout des images additionnelles avec une clé qui indique le traitement en parallèle
      accountForm.additionalImageFiles?.forEach((file, index) => {
        if (file) {
          formData.append(`additionalImages[${index}]`, file);
        }
      });

      // Ajout d'un indicateur pour le traitement optimisé
      formData.append("optimizeImages", "true");

      // Envoi de la requête avec un timeout plus long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 secondes de timeout

      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Réinitialisation du formulaire
        setAccountForm({
          hdv: "",
          level: "",
          price: "",
          imageFile: null,
          additionalImageFiles: [],
          features: "",
          status: "available",
        });

        // Afficher un message de succès avant de recharger la page
        alert("Compte créé avec succès!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      if (error instanceof DOMException && error.name === "AbortError") {
        alert(
          "La création du compte prend plus de temps que prévu. Veuillez vérifier dans quelques instants si le compte a été créé."
        );
      } else {
        alert(
          "Erreur lors de la création du compte. Vérifiez la console pour plus de détails."
        );
      }
    } finally {
      setIsLoading(false);
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
    }
  };

  const handleAddImageField = () => {
    setAccountForm((prev) => ({
      ...prev,
      additionalImageFiles: [
        ...prev.additionalImageFiles,
        null,
      ] as (File | null)[],
    }));
  };

  const handleImageChange = (index: number, file: File) => {
    const newAdditionalImages = [...accountForm.additionalImageFiles];
    newAdditionalImages[index] = file;
    setAccountForm((prev) => ({
      ...prev,
      additionalImageFiles: newAdditionalImages,
    }));
  };

  const handleRemoveImageField = (index: number) => {
    setAccountForm((prev) => ({
      ...prev,
      additionalImageFiles: prev.additionalImageFiles.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      // Si aucune image principale n'est définie, utiliser la première image comme principale
      if (!accountForm.imageFile && droppedFiles.length > 0) {
        const restFiles = droppedFiles.slice(1);
        setAccountForm((prev) => ({
          ...prev,
          imageFile: droppedFiles[0],
          additionalImageFiles: [
            ...prev.additionalImageFiles,
            ...restFiles,
          ].filter((file) => file !== null) as (File | null)[],
        }));
      } else {
        // Sinon, ajouter toutes les images comme images additionnelles
        setAccountForm((prev) => ({
          ...prev,
          additionalImageFiles: [
            ...prev.additionalImageFiles,
            ...droppedFiles,
          ].filter((file) => file !== null) as (File | null)[],
        }));
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#3a1818] to-black text-white p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#3a1818] p-8 rounded-lg shadow-xl flex flex-col items-center max-w-md">
            <svg
              className="animate-spin h-12 w-12 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Création du compte en cours...
            </h3>
            <p className="text-gray-300 text-center">
              Veuillez patienter pendant que nous importons les images et créons
              le compte.
              <br />
              Cette opération peut prendre quelques instants.
            </p>
          </div>
        </div>
      )}

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
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-col">
                      <div
                        className="w-full p-6 border-2 border-dashed border-white/30 rounded-lg mb-4 bg-white/5 flex flex-col items-center justify-center text-white/60 cursor-pointer hover:bg-white/10 transition-all"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("mainImageInput")?.click()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-center">
                          Glissez-déposez vos images ici
                          <br />
                          <span className="text-sm">
                            ou cliquez pour sélectionner des fichiers
                          </span>
                        </p>
                        {accountForm.imageFile && (
                          <div className="mt-3 text-green-500">
                            Image principale : {accountForm.imageFile.name}
                          </div>
                        )}
                        {accountForm.additionalImageFiles.length > 0 && (
                          <div className="mt-1 text-blue-400">
                            {
                              accountForm.additionalImageFiles.filter(
                                (f) => f !== null
                              ).length
                            }{" "}
                            image(s) additionnelle(s)
                          </div>
                        )}
                      </div>

                      <input
                        id="mainImageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const selectedFiles = Array.from(e.target.files);
                            // Si aucune image principale n'est définie, utiliser la première image comme principale
                            if (
                              !accountForm.imageFile &&
                              selectedFiles.length > 0
                            ) {
                              const restFiles = selectedFiles.slice(1);
                              setAccountForm((prev) => ({
                                ...prev,
                                imageFile: selectedFiles[0],
                                additionalImageFiles: [
                                  ...prev.additionalImageFiles,
                                  ...restFiles,
                                ].filter(
                                  (file) => file !== null
                                ) as (File | null)[],
                              }));
                            } else {
                              // Sinon, ajouter toutes les images comme images additionnelles
                              setAccountForm((prev) => ({
                                ...prev,
                                additionalImageFiles: [
                                  ...prev.additionalImageFiles,
                                  ...selectedFiles,
                                ].filter(
                                  (file) => file !== null
                                ) as (File | null)[],
                              }));
                            }
                          }
                        }}
                        className="hidden"
                      />

                      <div className="text-white mt-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            Images sélectionnées :
                          </span>
                          <button
                            type="button"
                            onClick={handleAddImageField}
                            className="px-2 py-1 bg-white/10 text-white text-sm rounded hover:bg-white/20"
                          >
                            + Ajouter une image
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image principale affichée si elle existe */}
                    {accountForm.imageFile && (
                      <div className="flex items-center space-x-4 bg-white/5 p-3 rounded-lg">
                        <div className="w-16 h-16 overflow-hidden flex-shrink-0">
                          <img
                            src={URL.createObjectURL(accountForm.imageFile)}
                            alt="Aperçu"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="text-white font-medium truncate">
                            {accountForm.imageFile.name}
                          </div>
                          <div className="text-white/60 text-sm">
                            {Math.round(accountForm.imageFile.size / 1024)} KB •
                            Image principale
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAccountForm({ ...accountForm, imageFile: null })
                          }
                          className="p-2 text-red-500 hover:text-red-400"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}

                    {/* Images additionnelles */}
                    {accountForm.additionalImageFiles.map(
                      (file, index) =>
                        file && (
                          <div
                            key={index}
                            className="flex items-center space-x-4 bg-white/5 p-3 rounded-lg"
                          >
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Aperçu ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="text-white font-medium truncate">
                                {file.name}
                              </div>
                              <div className="text-white/60 text-sm">
                                {Math.round(file.size / 1024)} KB • Image
                                additionnelle {index + 1}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImageField(index)}
                              className="p-2 text-red-500 hover:text-red-400"
                            >
                              Supprimer
                            </button>
                          </div>
                        )
                    )}

                    {/* Afficher le message si aucune image n'est sélectionnée */}
                    {!accountForm.imageFile &&
                      accountForm.additionalImageFiles.filter((f) => f !== null)
                        .length === 0 && (
                        <div className="text-white/60 italic text-center py-2">
                          Aucune image sélectionnée
                        </div>
                      )}
                  </div>
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
                  className={`w-full p-2 ${
                    isLoading
                      ? "bg-blue-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded transition-colors`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Création en cours...
                    </div>
                  ) : (
                    "Créer le compte"
                  )}
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
                {pages.map(
                  (page: {
                    id: Key | null | undefined;
                    title:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    path:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    isActive: number;
                  }) => (
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
                        onChange={() =>
                          handleTogglePage(page.id, page.isActive)
                        }
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
                  )
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

type Giveaway = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  prizes: string;
  requirements: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
};

type EditingGiveaway = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  prizes: string;
  requirements: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function GiveawayTable() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [editingGiveaway, setEditingGiveaway] =
    useState<EditingGiveaway | null>(null);

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      const response = await fetch("/api/admin/giveaways");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des giveaways");
      }
      const data = await response.json();
      setGiveaways(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleStartEdit = (giveaway: Giveaway) => {
    setEditingGiveaway({
      id: giveaway.id,
      title: giveaway.title,
      description: giveaway.description,
      imageUrl: giveaway.imageUrl,
      prizes: JSON.parse(giveaway.prizes).join("\n"),
      requirements: JSON.parse(giveaway.requirements).join("\n"),
      startDate: new Date(giveaway.startDate).toISOString().slice(0, 16),
      endDate: new Date(giveaway.endDate).toISOString().slice(0, 16),
      isActive: giveaway.isActive,
    });
  };

  const handleEdit = async () => {
    if (!editingGiveaway) return;

    try {
      const response = await fetch(
        `/api/admin/giveaways/${editingGiveaway.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingGiveaway,
            prizes: editingGiveaway.prizes.split("\n"),
            requirements: editingGiveaway.requirements.split("\n"),
          }),
        }
      );

      if (response.ok) {
        const updatedGiveaway = await response.json();
        setGiveaways(
          giveaways.map((giveaway) =>
            giveaway.id === editingGiveaway.id ? updatedGiveaway : giveaway
          )
        );
        setEditingGiveaway(null);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce giveaway ?")) {
      try {
        const response = await fetch(`/api/admin/giveaways/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setGiveaways(giveaways.filter((giveaway) => giveaway.id !== id));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white/5 rounded-lg">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-left">Titre</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-left">Dates</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {giveaways.map((giveaway) => (
            <tr key={giveaway.id} className="border-t border-white/10">
              <td className="p-4">
                {editingGiveaway?.id === giveaway.id ? (
                  <input
                    type="text"
                    value={editingGiveaway.title}
                    onChange={(e) =>
                      setEditingGiveaway({
                        ...editingGiveaway,
                        title: e.target.value,
                      })
                    }
                    className="p-2 bg-white/10 rounded w-full text-white"
                  />
                ) : (
                  giveaway.title
                )}
              </td>
              <td className="p-4">
                {editingGiveaway?.id === giveaway.id ? (
                  <textarea
                    value={editingGiveaway.description}
                    onChange={(e) =>
                      setEditingGiveaway({
                        ...editingGiveaway,
                        description: e.target.value,
                      })
                    }
                    className="p-2 bg-white/10 rounded w-full text-white"
                    rows={2}
                  />
                ) : (
                  giveaway.description
                )}
              </td>
              <td className="p-4">
                {editingGiveaway?.id === giveaway.id ? (
                  <input
                    type="checkbox"
                    checked={editingGiveaway.isActive}
                    onChange={(e) =>
                      setEditingGiveaway({
                        ...editingGiveaway,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded bg-white/10"
                  />
                ) : (
                  <span
                    className={`px-2 py-1 rounded ${
                      giveaway.isActive
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {giveaway.isActive ? "Actif" : "Inactif"}
                  </span>
                )}
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div>
                    Début: {new Date(giveaway.startDate).toLocaleString()}
                  </div>
                  <div>Fin: {new Date(giveaway.endDate).toLocaleString()}</div>
                </div>
              </td>
              <td className="p-4">
                {editingGiveaway?.id === giveaway.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingGiveaway(null)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartEdit(giveaway)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(giveaway.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

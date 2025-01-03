"use client";
import { useState, useEffect } from "react";

type Review = {
  id: number;
  username: string;
  avatarUrl: string;
  message: string;
  date: number;
};

type EditingReview = {
  id: number;
  username: string;
  avatarUrl: string;
  message: string;
};

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<EditingReview | null>(
    null
  );

  useEffect(() => {
    fetchReviews();

    const handleReload = () => {
      fetchReviews();
    };

    const element = document.querySelector('[data-component="reviews-table"]');
    if (element) {
      element.addEventListener("reload", handleReload);
    }

    return () => {
      if (element) {
        element.removeEventListener("reload", handleReload);
      }
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur serveur:", errorData);
        return;
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la récupération des avis:",
        error
      );
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingReview({
      id: review.id,
      username: review.username,
      avatarUrl: review.avatarUrl,
      message: review.message,
    });
  };

  const handleEdit = async () => {
    if (!editingReview) return;

    try {
      const response = await fetch(`/api/admin/reviews/${editingReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReview),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(
          reviews.map((review) =>
            review.id === editingReview.id ? updatedReview : review
          )
        );
        setEditingReview(null);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        const response = await fetch(`/api/admin/reviews/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setReviews(reviews.filter((review) => review.id !== id));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div data-component="reviews-table" className="overflow-x-auto">
      <table className="min-w-full bg-white/5 rounded-lg">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-left">Utilisateur</th>
            <th className="p-4 text-left">Avatar</th>
            <th className="p-4 text-left">Message</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-t border-white/10">
              <td className="p-4">
                {editingReview?.id === review.id ? (
                  <input
                    type="text"
                    value={editingReview.username}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        username: e.target.value,
                      })
                    }
                    className="p-2 bg-white/10 rounded w-full"
                  />
                ) : (
                  review.username
                )}
              </td>
              <td className="p-4">
                {editingReview?.id === review.id ? (
                  <input
                    type="text"
                    value={editingReview.avatarUrl}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        avatarUrl: e.target.value,
                      })
                    }
                    className="p-2 bg-white/10 rounded w-full"
                  />
                ) : (
                  <img
                    src={review.avatarUrl}
                    alt={review.username}
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </td>
              <td className="p-4">
                {editingReview?.id === review.id ? (
                  <textarea
                    value={editingReview.message}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        message: e.target.value,
                      })
                    }
                    className="p-2 bg-white/10 rounded w-full"
                    rows={3}
                  />
                ) : (
                  review.message
                )}
              </td>
              <td className="p-4">
                {editingReview?.id === review.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStartEdit(review)}
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
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

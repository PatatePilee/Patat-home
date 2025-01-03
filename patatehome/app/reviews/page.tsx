"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type Review = {
  id: number;
  username: string;
  avatarUrl: string;
  message: string;
  date: number;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageError = (reviewId: number) => {
    setImageErrors((prev) => ({ ...prev, [reviewId]: true }));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Avis des clients</h1>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/5 p-6 rounded-xl">
              <div className="flex items-center space-x-4 mb-4">
                {imageErrors[review.id] ? (
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white">
                    {review.username.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <Image
                    src={review.avatarUrl}
                    alt={review.username}
                    width={48}
                    height={48}
                    className="rounded-full"
                    onError={() => handleImageError(review.id)}
                  />
                )}
                <div>
                  <div className="font-bold">{review.username}</div>
                  <div className="text-sm text-white/60">
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>
              <p className="text-white/90">{review.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

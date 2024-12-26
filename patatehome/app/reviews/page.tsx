"use client";
import Image from "next/image";
import { useState } from "react";

type Review = {
  username: string;
  avatarUrl: string;
  message: string;
  date: string;
};

const reviews: Review[] = [
  {
    username: "Alex_Clash",
    avatarUrl: "/avatars/user1.png",
    message:
      "Super vendeur, transaction rapide et sécurisée ! HDV 15 max acheté, tout est conforme 👌",
    date: "Aujourd'hui à 14:23",
  },
  {
    username: "ClashKing",
    avatarUrl: "/avatars/user2.png",
    message:
      "Meilleur vendeur que j'ai pu voir, prix correct et après-vente au top",
    date: "Hier à 18:30",
  },
];

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Avis de nos clients
        </h1>

        {/* Liste des avis */}
        <div className="space-y-6 mb-12">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#36393f] rounded-lg p-4 hover:bg-[#32353b] transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={review.avatarUrl}
                    alt={review.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-white">
                      {review.username}
                    </span>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-gray-300 mt-1">{review.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Format copiable */}
        <div className="bg-[#2f3136] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Format d'avis Discord</h2>
          <div className="bg-[#36393f] p-4 rounded-md">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {`**Nom d'utilisateur**: [Votre pseudo]
**Date**: [Date et heure]
**Message**: [Votre avis]

Exemple:
**Nom d'utilisateur**: Alex_Clash
**Date**: Aujourd'hui à 14:23
**Message**: Super vendeur, transaction rapide et sécurisée ! HDV 15 max acheté, tout est conforme 👌`}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(reviews[0].message)}
            className="mt-4 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded text-white transition-colors"
          >
            Copier le format
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GiveawayPage() {
  const [giveaway, setGiveaway] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadGiveaway = async () => {
      try {
        const response = await fetch("/api/giveaways/active");
        if (!response.ok) throw new Error("Erreur serveur");
        const data = await response.json();
        if (data) {
          data.prizes = JSON.parse(data.prizes);
          data.requirements = JSON.parse(data.requirements);
        }
        setGiveaway(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    loadGiveaway();
  }, []);

  if (!giveaway?.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Aucun giveaway en cours</h1>
          <p className="text-xl text-white/80 mb-8">
            Rejoignez notre Discord pour être informé du prochain giveaway !
          </p>
          <Link
            href="/join"
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Rejoindre la communauté →
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/giveaways/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giveawayId: giveaway.id,
          email,
          discord,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'inscription");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Inscription confirmée !</h1>
          <p className="text-xl text-white/80 mb-8">
            Merci de votre participation. Le gagnant sera annoncé sur Discord.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
          <div className="aspect-video relative mb-8">
            <img
              src={giveaway.imageUrl}
              alt={giveaway.title}
              className="rounded-xl w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{giveaway.title}</h1>
          <p className="text-white/80 mb-8">{giveaway.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">À gagner :</h2>
              <ul className="list-disc list-inside space-y-2">
                {giveaway.prizes.map((prize: string, index: number) => (
                  <li key={index}>{prize}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Conditions :</h2>
              <ul className="list-disc list-inside space-y-2">
                {giveaway.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded bg-white/10 text-white"
            />
            <input
              type="text"
              placeholder="Votre pseudo Discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              required
              className="w-full p-3 rounded bg-white/10 text-white"
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Participer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

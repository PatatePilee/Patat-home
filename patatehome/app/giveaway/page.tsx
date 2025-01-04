"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGiveaway } from "@/app/actions/getGiveaway";

export default function GiveawayPage() {
  const [giveaway, setGiveaway] = useState(null);
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");

  useEffect(() => {
    const loadGiveaway = async () => {
      const data = await getGiveaway();
      setGiveaway(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique d'inscription au giveaway
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
            <Image
              src={giveaway.imageUrl}
              alt="Giveaway"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">{giveaway.title}</h1>
          <p className="text-xl text-white/80 mb-8">{giveaway.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">À gagner</h2>
              <ul className="space-y-2">
                {giveaway.prizes.map((prize, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{prize}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Comment participer</h2>
              <ul className="space-y-2">
                {giveaway.requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{req}</span>
                  </li>
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
              className="w-full p-4 rounded-lg bg-white/10 border border-white/20"
              required
            />
            <input
              type="text"
              placeholder="Votre Discord (exemple: username#0000)"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/10 border border-white/20"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Participer au giveaway
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

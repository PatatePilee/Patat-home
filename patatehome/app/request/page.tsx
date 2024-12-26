"use client";
import { useState } from "react";

export default function RequestPage() {
  const [request, setRequest] = useState({
    hdv: "",
    maxage: "",
    budget: "",
    features: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(request);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Demande de compte personnalisé
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-white">
              Niveau HDV souhaité
            </label>
            <input
              type="number"
              min="1"
              max="17"
              className="w-full p-3 rounded-lg border border-foreground/10 bg-white/10 text-white placeholder-white/50"
              value={request.hdv}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, hdv: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white">
              Niveau de maxage souhaité
            </label>
            <select
              className="w-full p-3 rounded-lg border border-foreground/10 bg-white/10 text-white"
              value={request.maxage}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, maxage: e.target.value }))
              }
              required
            >
              <option value="" className="bg-gray-900">
                Sélectionnez un niveau
              </option>
              <option value="70" className="bg-gray-900">
                70%
              </option>
              <option value="80" className="bg-gray-900">
                80%
              </option>
              <option value="90" className="bg-gray-900">
                90%
              </option>
              <option value="100" className="bg-gray-900">
                100%
              </option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white">
              Budget maximum (en €)
            </label>
            <input
              type="number"
              className="w-full p-3 rounded-lg border border-foreground/10 bg-white/10 text-white placeholder-white/50"
              value={request.budget}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, budget: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white">
              Caractéristiques primordiales
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-foreground/10 bg-white/10 text-white placeholder-white/50"
              value={request.features}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, features: e.target.value }))
              }
              placeholder="Ex: Héros niveau 80+, Murs niveau 14..."
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-white">
              Email de contact
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-lg border border-foreground/10 bg-white/10 text-white placeholder-white/50"
              value={request.email}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Envoyer ma demande
          </button>
        </form>
      </div>
    </div>
  );
}

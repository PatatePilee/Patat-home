"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pourrez ajouter la logique d'envoi du formulaire
    console.log(formData);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12">Contactez-nous</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-xl hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6">Nos réseaux</h2>
              <div className="space-y-4">
                <Link
                  href="https://discord.gg/votre-serveur"
                  className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors"
                >
                  <Image
                    src="/discordlogo.png"
                    alt="Discord"
                    width={24}
                    height={24}
                  />
                  <span>Rejoignez notre serveur Discord</span>
                </Link>
                <Link
                  href="https://t.me/votre-compte"
                  className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors"
                >
                  <Image
                    src="/telegramlogo.png"
                    alt="Telegram"
                    width={24}
                    height={24}
                  />
                  <span>Contactez-nous sur Telegram</span>
                </Link>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-xl hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6">Horaires</h2>
              <p className="text-white/80">
                Nous sommes disponibles 7j/7 de 10h à 22h pour répondre à vos
                questions et traiter vos commandes.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-xl hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6">Service client</h2>
              <p className="text-white/80">
                Notre équipe s'engage à vous répondre dans un délai maximum de 2
                heures pendant nos horaires d'ouverture.
              </p>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white/5 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sujet</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={6}
                  className="w-full p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

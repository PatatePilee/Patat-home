"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setIsAdmin(user.role === "admin");
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold hover:text-blue-500 transition-colors"
          >
            Patate Clash
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              href="/products"
              className="hover:text-blue-500 transition-colors"
            >
              Comptes
            </Link>
            <Link
              href="/delivery"
              className="hover:text-blue-500 transition-colors"
            >
              Livraison
            </Link>
            <Link
              href="/join"
              className="hover:text-blue-500 transition-colors"
            >
              Discord
            </Link>
            <Link
              href="/giveaway"
              className="hover:text-blue-500 transition-colors"
            >
              Giveaway
            </Link>
            <Link
              href="/reviews"
              className="hover:text-blue-500 transition-colors"
            >
              Avis
            </Link>
            <Link
              href="/feed"
              className="hover:text-blue-500 transition-colors"
            >
              Feed
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-500 transition-colors"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Administration
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

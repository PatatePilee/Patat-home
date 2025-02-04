"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(JSON.parse(user).role === "admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl">
            Patate Clash
          </Link>

          {/* Burger Menu Button - Visible on mobile only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-blue-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-white/90 hover:text-white transition-colors"
            >
              Comptes
            </Link>
            <Link
              href="/delivery"
              className="text-white/90 hover:text-white transition-colors"
            >
              Livraison
            </Link>
            <Link
              href="/join"
              className="text-white/90 hover:text-white transition-colors"
            >
              Discord
            </Link>
            <Link
              href="/giveaway"
              className="text-white/90 hover:text-white transition-colors"
            >
              Giveaway
            </Link>
            <Link
              href="/reviews"
              className="text-white/90 hover:text-white transition-colors"
            >
              Avis
            </Link>
            <Link
              href="/feed"
              className="text-white/90 hover:text-white transition-colors"
            >
              Feed
            </Link>
            <Link
              href="/contact"
              className="text-white/90 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/cart"
              className="text-white/90 hover:text-white transition-colors"
            >
              Panier
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

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden ${
            isMenuOpen ? "block" : "hidden"
          } pb-4 space-y-2`}
        >
          <Link
            href="/products"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Comptes
          </Link>
          <Link
            href="/delivery"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Livraison
          </Link>
          <Link
            href="/join"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Discord
          </Link>
          <Link
            href="/giveaway"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Giveaway
          </Link>
          <Link
            href="/reviews"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Avis
          </Link>
          <Link
            href="/feed"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Feed
          </Link>
          <Link
            href="/contact"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/cart"
            className="block py-2 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Panier
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="block py-2 text-blue-500 hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Administration
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left py-2 text-red-500 hover:text-red-400 transition-colors"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="block py-2 text-blue-500 hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

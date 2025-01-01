import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (vous pouvez utiliser localStorage ou une session)
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();
    // Écouter les changements de connexion
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  return (
    <nav className="bg-black/40 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Patate Clash
          </Link>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="text-green-500">Connecté</div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

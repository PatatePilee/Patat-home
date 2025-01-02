import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userStr = localStorage.getItem("user");
      console.log("User data:", userStr);
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("Parsed user:", user);
        console.log("Is admin?", user.role === "admin");
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
    window.location.href = "/";
  };

  return (
    <nav className="bg-black/40 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Patate Clash
          </Link>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Administration
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </>
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

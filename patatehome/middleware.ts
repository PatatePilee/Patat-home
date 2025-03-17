import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const user = request.cookies.get("user");
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const userData = JSON.parse(user.value);
      if (userData.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Récupère le pathname de l'URL actuelle
  const { pathname, searchParams } = request.nextUrl;

  console.log(
    `Middleware intercepting: ${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`
  );

  // Laisser passer toutes les requêtes sans réécriture pour éviter les problèmes
  return NextResponse.next();
}

// Ce middleware s'exécute uniquement sur les chemins suivants
export const config = {
  matcher: ["/admin/:path*", "/products/:path*", "/api/accounts/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ne traiter que les routes admin
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

  // Pour les autres routes, laisser passer
  return NextResponse.next();
}

// Ce middleware s'exécute uniquement sur les chemins admin
export const config = {
  matcher: ["/admin/:path*"],
};

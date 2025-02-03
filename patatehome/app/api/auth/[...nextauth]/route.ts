import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export const runtime = "nodejs";

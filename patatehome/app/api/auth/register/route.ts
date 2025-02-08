import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { hash } from "bcrypt";
import { eq, or } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Vérification si l'utilisateur existe déjà
    const [existingUser] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email ou nom d'utilisateur est déjà utilisé" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Créer l'utilisateur
    await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: Date.now(),
      });

    // Récupérer l'utilisateur nouvellement créé
    const [newUser] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: newUser,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}

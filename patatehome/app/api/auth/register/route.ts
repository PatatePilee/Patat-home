import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Vérification si l'utilisateur existe déjà
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, or }) =>
        or(eq(users.email, email), eq(users.username, username)),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email ou nom d'utilisateur est déjà utilisé" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role: "user",
      })
      .returning();

    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
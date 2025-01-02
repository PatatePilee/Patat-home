import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, email, password, role } = await request.json();
    const hashedPassword = await hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role,
        createdAt: Date.now(),
      })
      .returning();

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: newUser[0],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}

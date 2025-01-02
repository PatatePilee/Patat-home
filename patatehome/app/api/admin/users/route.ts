import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { hash } from "bcrypt";

export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

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

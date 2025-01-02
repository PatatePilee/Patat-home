import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();

    console.log("Email reçu:", email);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log("Utilisateur trouvé:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const passwordMatch = await compare(password, user.password);
    console.log("Mot de passe correspond:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    const responseData = {
      message: "Connexion réussie",
      user: {
        ...userWithoutPassword,
        role: user.role,
      },
    };

    console.log("Données de réponse:", responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
};

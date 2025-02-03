import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(users).where(eq(users.id, parseInt(params.id)));
    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await request.json();
    let updateData: any = {
      username: userData.username,
      email: userData.email,
      role: userData.role,
    };

    if (userData.password) {
      updateData.password = await hash(userData.password, 10);
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(params.id)))
      .returning();

    const { password: _, ...userWithoutPassword } = updatedUser[0];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'utilisateur" },
      { status: 500 }
    );
  }
}

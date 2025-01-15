import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../../src/db";
import { cartItems } from "../../../../src/db/schema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, parseInt(params.id)),
          eq(cartItems.userId, session.user.id)
        )
      );

    return NextResponse.json({ message: "Article supprimé du panier" });
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}

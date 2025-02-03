import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { cartItems, accounts } from "@/src/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Récupérer l'élément du panier pour obtenir l'accountId
    const cartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.id, parseInt(params.id)),
          eq(cartItems.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (cartItem.length > 0) {
      await db.transaction(async (tx) => {
        // Supprimer l'élément du panier
        await tx
          .delete(cartItems)
          .where(
            and(
              eq(cartItems.id, parseInt(params.id)),
              eq(cartItems.userId, parseInt(userId))
            )
          );

        // Décrémenter le compteur du compte
        await tx
          .update(accounts)
          .set({
            cartCount: sql`cart_count - 1`,
          })
          .where(eq(accounts.id, cartItem[0].accountId));
      });
    }

    return NextResponse.json({ message: "Article supprimé du panier" });
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}

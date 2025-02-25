import { NextResponse } from "next/server";
import { db } from "../../../src/db";
import { cartItems, accounts } from "../../../src/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { accountId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Vérifier si l'article est déjà dans le panier
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, parseInt(userId)),
          eq(cartItems.accountId, accountId)
        )
      );

    if (existingItem.length > 0) {
      return NextResponse.json(
        { error: "Ce produit est déjà dans votre panier" },
        { status: 400 }
      );
    }

    // Récupérer le compte actuel pour obtenir le cartCount
    const currentAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!currentAccount.length) {
      return NextResponse.json({ error: "Compte non trouvé" }, { status: 404 });
    }

    // Ajouter l'article au panier et incrémenter le compteur
    await db.transaction(async (tx) => {
      await tx.insert(cartItems).values({
        userId: parseInt(userId),
        accountId: accountId,
        createdAt: Math.floor(Date.now() / 1000),
      });

      await tx
        .update(accounts)
        .set({
          cartCount: (currentAccount[0].cartCount || 0) + 1,
        })
        .where(eq(accounts.id, accountId));
    });

    return NextResponse.json({
      message: "Ajouté au panier avec succès",
      redirect: "/products",
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout au panier" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const items = await db
      .select({
        id: cartItems.id,
        accountId: cartItems.accountId,
        account: {
          id: accounts.id,
          hdv: accounts.hdv,
          level: accounts.level,
          price: accounts.price,
          imageFilename: accounts.imageFilename,
          features: accounts.features,
        },
      })
      .from(cartItems)
      .leftJoin(accounts, eq(cartItems.accountId, accounts.id))
      .where(eq(cartItems.userId, parseInt(userId)));

    // Transformer les données pour inclure l'URL de l'image
    const itemsWithImageUrls = items.map((item) => ({
      ...item,
      account: item.account
        ? {
            ...item.account,
          }
        : null,
    }));

    return NextResponse.json(itemsWithImageUrls);
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du panier" },
      { status: 500 }
    );
  }
}

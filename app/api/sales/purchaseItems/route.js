// app/api/sales/purchaseItems/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  try {
    const purchaseItems = await prisma.purchaseItem.findMany({
      where: {
        product: {
          quantity: {
            gt: 0, // Only include products with available stock
          },
        },
      },
      include: {
        product: true, // Include product details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the expected format for the frontend
    const products = purchaseItems.map((item) => ({
      id: item.productId, // Use productId as the identifier (matches existing frontend logic)
      name: item.product.name,
      price: item.sellRate, // Use sellRate as the price
      stock: item.product.quantity, // Available stock from Product.quantity
      unit: item.product.unit,
      category: item.product.category,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching purchase items:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch purchase items" },
      { status: 500 }
    );
  }
}
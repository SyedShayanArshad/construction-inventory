import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request) {
  try {
    const products = await prisma.product.findMany();
    if (!products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching Products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch Products" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, unit, quantity, lowStockThreshold, category } = body;

    if (!name || !unit || !quantity || !category||!lowStockThreshold) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name:name,
        unit:unit,
        quantity:parseInt(quantity),
        lowStockThreshold:parseInt(lowStockThreshold),
        category:category,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating Product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Product" },
      { status: 500 }
    );
  }
}

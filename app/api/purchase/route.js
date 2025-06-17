// app/api/purchases/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: true,
        purchaseItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return NextResponse.json(purchases, { status: 200 });
  } catch (error) {
    console.error('[GET_PURCHASES_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      date,
      vendorId,
      productId,
      quantity,
      rate,
      sellingRate,
      totalAmount,
      amountPaid,
    } = body;

    // Validate input
    if (!vendorId || !productId || !quantity || !rate || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const numericQuantity = Number(quantity);
    const numericRate = Number(rate);
    const numericSellingRate = Number(sellingRate || rate); // Fallback to rate if sellingRate not provided
    const numericTotal = Number(totalAmount);
    const numericPaid = Number(amountPaid || 0);

    // Verify vendor and product exist
    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(vendorId) },
    });
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create purchase and purchase item in a transaction
    const purchase = await prisma.$transaction(async (tx) => {
      const newPurchase = await tx.purchase.create({
        data: {
          date: new Date(date || Date.now()),
          vendorId: Number(vendorId),
          totalAmount: numericTotal,
          amountPaid: numericPaid,
          purchaseItems: {
            create: {
              productId: Number(productId),
              quantity: numericQuantity,
              rate: numericRate,
              sellRate: numericSellingRate,
              total: numericQuantity * numericRate,
            },
          },
        },
      });

      // Update vendor metrics
      await tx.vendor.update({
        where: { id: Number(vendorId) },
        data: {
          totalPurchases: { increment: numericTotal },
          amountPaid: { increment: numericPaid },
          balance: { increment: numericTotal - numericPaid },
        },
      });

      return newPurchase;
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("[PURCHASE_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}
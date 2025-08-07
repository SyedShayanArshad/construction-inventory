import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

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
    if (
      !date ||
      !vendorId ||
      !productId ||
      !quantity ||
      !rate ||
      !sellingRate ||
      !totalAmount ||
      amountPaid === undefined // Allow 0 for amountPaid
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const numericQuantity = Number(quantity);
    const numericRate = Number(rate);
    const numericSellingRate = Number(sellingRate);
    const numericTotal = Number(totalAmount);
    const numericPaid = Number(amountPaid);

    // Validate numeric values
    if (
      isNaN(numericQuantity) ||
      isNaN(numericRate) ||
      isNaN(numericSellingRate) ||
      isNaN(numericTotal) ||
      isNaN(numericPaid) ||
      numericQuantity <= 0 ||
      numericRate <= 0 ||
      numericSellingRate <= 0 ||
      numericTotal <= 0 ||
      numericPaid < 0
    ) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    // Verify vendor and product exist
    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(vendorId) },
    });
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify totalAmount matches quantity * rate
    if (numericTotal !== numericQuantity * numericRate) {
      return NextResponse.json(
        { error: "Total amount does not match quantity * rate" },
        { status: 400 }
      );
    }

    // Create purchase, update vendor, update product, and log payment history in a transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Create purchase and purchaseItem
      const newPurchase = await tx.purchase.create({
        data: {
          date: new Date(date),
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
        include: {
          purchaseItems: true, // Include for VendorPaymentHistory link
        },
      });

      // Update vendor's totals
      await tx.vendor.update({
        where: { id: Number(vendorId) },
        data: {
          totalPurchases: {
            increment: numericTotal,
          },
          amountPaid: {
            increment: numericPaid,
          },
          balance: {
            increment: numericTotal - numericPaid, // balance = totalPurchases - amountPaid
          },
        },
      });

      // Update product's quantity
      await tx.product.update({
        where: { id: Number(productId) },
        data: {
          quantity: {
            increment: numericQuantity,
          },
        },
      });

      // Create VendorPaymentHistory entry
      await tx.vendorPaymentHistory.create({
        data: {
          vendorId: Number(vendorId),
          purchaseId: newPurchase.id,
          date: new Date(date),
          total: numericTotal,
          amountPaid: numericPaid,
          duesStatus:
            numericPaid >= numericTotal ? "CLEARED" : "PENDING",
          paymentHistoryLinks: {
            create: {
              purchaseItemId: newPurchase.purchaseItems[0].id, // Link to the created purchaseItem
            },
          },
        },
      });

      return newPurchase;
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("[PURCHASE_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create purchase" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
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
    console.error("[GET_PURCHASES_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
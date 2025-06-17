// app/api/purchases/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params; // this is vendorId
    const purchases = await prisma.purchase.findMany({
      where: {
        vendorId: Number(id),
      },
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
    console.error('[GET_VENDOR_PURCHASES_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor purchases' },
      { status: 500 }
    );
  }
}
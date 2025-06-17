// app/api/vendor-payments/[vendorId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { vendorId } = params;

  try {
    const payments = await prisma.vendorPaymentHistory.findMany({
      where: { vendorId: Number(vendorId) },
      include: {
        vendorPaymentPurchaseItems: {
          include: {
            purchaseItem: {
              select: { purchaseId: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('[VENDOR_PAYMENTS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
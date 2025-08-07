import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  const { id } = params;
  const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  try {
    const payments = await prisma.vendorPaymentHistory.findMany({
      where: { vendorId: Number(id) },
      include: {
        vendor: {
          select: { name: true },
        },
        purchase: {
          select: {
            id: true,
            date: true,
            totalAmount: true,
          },
        },
        paymentHistoryLinks: {
          include: {
            purchaseItem: {
              select: {
                purchaseId: true,
                quantity: true,
                rate: true,
                total: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error('[VENDOR_PAYMENTS_GET_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

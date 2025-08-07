import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  try {
    const { customerId } = params;
    const sales = await prisma.sale.findMany({
      where: { customerId: Number(customerId) },
      include: {
        saleItems: {
          include: { product: { select: { id: true, name: true, price: true } } },
        },
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching customer sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
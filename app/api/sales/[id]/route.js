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
    const { id } = params;
    const sale = await prisma.sale.findUnique({
      where: { id: Number(id) },
      include: {
        customer: { select: { id: true, name: true, phoneNumber: true, address: true } },
        saleItems: {
          include: { product: { select: { id: true, name: true, price: true } } },
        },
        paymentHistory: true,
      },
    });

    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: Number(id) },
        include: { saleItems: true, paymentHistory: true },
      });

      if (!sale) {
        throw new Error('Sale not found');
      }

      if (sale.paymentHistory.length > 0) {
        throw new Error('Cannot delete sale with payment history');
      }

      await tx.saleItem.deleteMany({ where: { saleId: sale.id } });
      await tx.sale.delete({ where: { id: sale.id } });

      await tx.customer.update({
        where: { id: sale.customerId },
        data: {
          totalSales: { decrement: sale.totalAmount },
          amountPaid: { decrement: sale.amountPaid },
          balance: { decrement: sale.totalAmount - sale.amountPaid },
        },
      });
    });

    return NextResponse.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete sale' }, { status: 400 });
  }
}
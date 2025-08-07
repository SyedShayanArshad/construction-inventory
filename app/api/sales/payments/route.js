import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { saleId, customerId, amountPaid, paymentMethod, date } = data;

    if (!saleId || !customerId || !amountPaid || amountPaid <= 0) {
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }

    const payment = await prisma.$transaction(async (tx) => {
      // Fetch the sale with customer details
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { customer: true },
      });

      if (!sale) {
        throw new Error('Sale not found');
      }
      if (sale.customerId !== customerId) {
        throw new Error('Customer mismatch');
      }
      if (amountPaid > sale.subTotal - sale.amountPaid) {
        throw new Error('Payment exceeds remaining balance');
      }

      // Calculate values for PaymentHistory
      const dueBeforePayment = sale.subTotal - sale.amountPaid;
      const balanceAfterPayment = sale.subTotal - (sale.amountPaid + Number(amountPaid));
      const newStatus = balanceAfterPayment <= 0 ? 'COMPLETED' : sale.amountPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING';

      // Create payment history record
      const newPayment = await tx.paymentHistory.create({
        data: {
          saleId,
          date: new Date(date),
          amountPaid: Number(amountPaid),
          paymentMethod,
          dueBeforePayment,
          balanceAfterPayment,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update sale with new amountPaid and status
      await tx.sale.update({
        where: { id: saleId },
        data: {
          amountPaid: { increment: Number(amountPaid) },
          dueAmount: { decrement: Number(amountPaid) },
          status: newStatus,
          updatedAt: new Date(),
        },
      });

      // Update customer balance
      await tx.customer.update({
        where: { id: customerId },
        data: {
          balance: { decrement: Number(amountPaid) },
          updatedAt: new Date(),
        },
      });

      return newPayment;
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 500 });
  }
}
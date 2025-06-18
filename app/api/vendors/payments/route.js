import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { vendorId, date, amountPaid, notes, purchaseIds } = body;

    // Validation
    if (!vendorId || !date || amountPaid === undefined || amountPaid <= 0) {
      return NextResponse.json(
        { error: 'Vendor ID, date, and valid amount paid are required' },
        { status: 400 }
      );
    }

    const numericAmountPaid = Number(amountPaid);
    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(vendorId) },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (numericAmountPaid > vendor.balance) {
      return NextResponse.json(
        { error: 'Payment exceeds vendor balance' },
        { status: 400 }
      );
    }

    let purchaseItems = [];
    if (purchaseIds && purchaseIds.length > 0) {
      const purchases = await prisma.purchase.findMany({
        where: {
          id: { in: purchaseIds.map(Number) },
          vendorId: Number(vendorId),
        },
        include: { purchaseItems: true },
      });

      if (purchases.length !== purchaseIds.length) {
        return NextResponse.json(
          { error: 'Invalid or unauthorized purchase IDs' },
          { status: 400 }
        );
      }

      const totalDues = purchases.reduce(
        (sum, p) => sum + (p.totalAmount - p.amountPaid),
        0
      );
      if (numericAmountPaid > totalDues) {
        return NextResponse.json(
          { error: 'Payment exceeds selected purchases’ dues' },
          { status: 400 }
        );
      }

      purchaseItems = purchases.flatMap((p) => p.purchaseItems);
    }

    // Create payment and update vendor in a transaction
    const payment = await prisma.$transaction(async (tx) => {
      // Update vendor
      await tx.vendor.update({
        where: { id: Number(vendorId) },
        data: {
          amountPaid: { increment: numericAmountPaid },
          balance: { decrement: numericAmountPaid },
        },
      });

      // Create payment history
      const newPayment = await tx.vendorPaymentHistory.create({
        data: {
          vendorId: Number(vendorId),
          date: new Date(date),
          total: purchaseIds?.length > 0 ? numericAmountPaid : 0,
          amountPaid: numericAmountPaid,
          duesStatus: purchaseIds?.length > 0 && numericAmountPaid >= purchaseItems.reduce((sum, item) => sum + item.total, 0) ? 'CLEARED' : 'PENDING',
          paymentHistoryLinks: purchaseItems.length > 0
            ? {
                create: purchaseItems.map((item) => ({
                  purchaseItemId: item.id,
                })),
              }
            : undefined,
        },
      });

      // Update purchases if linked
      if (purchaseIds?.length > 0) {
        let remainingPayment = numericAmountPaid;
        for (const purchaseId of purchaseIds) {
          const purchase = await tx.purchase.findUnique({
            where: { id: Number(purchaseId) },
          });
          const due = purchase.totalAmount - purchase.amountPaid;
          const paymentToApply = Math.min(remainingPayment, due);
          if (paymentToApply > 0) {
            await tx.purchase.update({
              where: { id: Number(purchaseId) },
              data: {
                amountPaid: { increment: paymentToApply },
              },
            });
            remainingPayment -= paymentToApply;
          }
        }
      }

      return newPayment;
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('[VENDOR_PAYMENT_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record payment' },
      { status: 500 }
    );
  }
}
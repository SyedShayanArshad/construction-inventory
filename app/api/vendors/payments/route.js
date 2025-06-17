// app/api/vendor/payments/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { vendorId, date, amountPaid, notes, purchaseIds } = body;

    // Validate input
    if (!vendorId || !amountPaid || !date) {
      return NextResponse.json(
        { error: 'Vendor ID, date, and amount paid are required' },
        { status: 400 }
      );
    }

    const numericAmountPaid = Number(amountPaid);
    if (numericAmountPaid <= 0) {
      return NextResponse.json(
        { error: 'Amount paid must be greater than zero' },
        { status: 400 }
      );
    }

    // Verify vendor exists and check balance
    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(vendorId) },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (numericAmountPaid > vendor.balance) {
      return NextResponse.json(
        { error: `Amount paid exceeds vendor balance (${vendor.balance})` },
        { status: 400 }
      );
    }

    // Fetch selected purchases if provided
    let selectedPurchases = [];
    if (purchaseIds && purchaseIds.length > 0) {
      selectedPurchases = await prisma.purchase.findMany({
        where: {
          id: { in: purchaseIds.map(Number) },
          vendorId: Number(vendorId),
        },
        include: { purchaseItems: true },
      });

      const totalDues = selectedPurchases.reduce(
        (sum, purchase) => sum + (purchase.totalAmount - purchase.amountPaid),
        0
      );

      if (numericAmountPaid > totalDues) {
        return NextResponse.json(
          { error: `Amount paid exceeds selected purchases' dues (${totalDues})` },
          { status: 400 }
        );
      }
    }

    // Distribute payment across selected purchases
    let remainingPayment = numericAmountPaid;
    const payment = await prisma.$transaction(async (tx) => {
      // Create VendorPaymentHistory record
      const newPayment = await tx.vendorPaymentHistory.create({
        data: {
          vendorId: Number(vendorId),
          date: new Date(date),
          total: numericAmountPaid,
          amountPaid: numericAmountPaid,
          duesStatus: 'PENDING', // Will update based on purchase status
          notes: notes || null,
        },
      });

      // Update purchases and create VendorPaymentPurchaseItem records
      const paymentPurchaseItems = [];
      for (const purchase of selectedPurchases) {
        if (remainingPayment <= 0) break;

        const purchaseDue = purchase.totalAmount - purchase.amountPaid;
        const paymentForPurchase = Math.min(remainingPayment, purchaseDue);

        if (paymentForPurchase > 0) {
          // Update purchase
          await tx.purchase.update({
            where: { id: purchase.id },
            data: {
              amountPaid: { increment: paymentForPurchase },
            },
          });

          // Create VendorPaymentPurchaseItem for each purchase item
          for (const item of purchase.purchaseItems) {
            paymentPurchaseItems.push({
              vendorPaymentId: newPayment.id,
              purchaseItemId: item.id,
            });
          }

          remainingPayment -= paymentForPurchase;
        }
      }

      if (paymentPurchaseItems.length > 0) {
        await tx.vendorPaymentPurchaseItem.createMany({
          data: paymentPurchaseItems,
        });
      }

      // Update vendor metrics
      await tx.vendor.update({
        where: { id: Number(vendorId) },
        data: {
          amountPaid: { increment: numericAmountPaid },
          balance: { decrement: numericAmountPaid },
        },
      });

      // Check if all selected purchases are cleared
      const updatedPurchases = await tx.purchase.findMany({
        where: { id: { in: purchaseIds.map(Number) } },
      });

      const allCleared = updatedPurchases.every(
        (purchase) => purchase.totalAmount <= purchase.amountPaid
      );

      if (allCleared && purchaseIds.length > 0) {
        await tx.vendorPaymentHistory.update({
          where: { id: newPayment.id },
          data: { duesStatus: 'CLEARED' },
        });
        newPayment.duesStatus = 'CLEARED';
      } else if (vendor.balance - numericAmountPaid <= 0) {
        await tx.vendorPaymentHistory.update({
          where: { id: newPayment.id },
          data: { duesStatus: 'CLEARED' },
        });
        newPayment.duesStatus = 'CLEARED';
      }

      return newPayment;
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('[VENDOR_PAYMENT_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record vendor payment' },
      { status: 500 }
    );
  }
}
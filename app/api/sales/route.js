import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerPhone,
      date,
      items,
      paid,
      paymentMethod,
    } = body;

    // Validate input
    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }
    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one valid item is required" },
        { status: 400 }
      );
    }
    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(Number(item.productId)) ||
        Number(item.productId) <= 0 ||
        !item.quantity ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !item.unitPrice ||
        isNaN(Number(item.unitPrice)) ||
        Number(item.unitPrice) <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid item: productId, quantity, and unitPrice must be valid positive numbers" },
          { status: 400 }
        );
      }
    }
    if (isNaN(Number(paid)) || Number(paid) < 0) {
      return NextResponse.json(
        { error: "Paid amount must be a valid non-negative number" },
        { status: 400 }
      );
    }
    if (!["CASH", "BANK_TRANSFER", "ONLINE"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Generate a unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Calculate subtotal
    const subTotal = items.reduce(
      (total, item) => total + Number(item.quantity) * Number(item.unitPrice) - (Number(item.discount) || 0),
      0
    );
    const amountPaid = Number(paid) || 0;
    const dueAmount = subTotal - amountPaid;

    // Determine sale status
    const status =
      dueAmount === 0 ? "COMPLETED" : amountPaid > 0 ? "PARTIALLY_PAID" : "PENDING";

    // Create sale and update related entities in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Validate products and check stock
      const productIds = items.map((item) => Number(item.productId));
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, quantity: true },
      });

      for (const item of items) {
        const product = products.find((p) => p.id === Number(item.productId));
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (product.quantity < Number(item.quantity)) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.quantity}`
          );
        }
      }

      // Handle customer: connect existing or create new
      let customer;
      if (customerId) {
        customer = await tx.customer.findUnique({
          where: { id: Number(customerId) },
        });
        if (!customer) {
          throw new Error(`Customer with ID ${customerId} not found`);
        }
      } else {
        // Check for existing customer with same name and phone to avoid duplicates
        customer = await tx.customer.findFirst({
          where: {
            name: customerName,
            phoneNumber: customerPhone || null,
          },
        });
        if (!customer) {
          customer = await tx.customer.create({
            data: {
              name: customerName,
              phoneNumber: customerPhone || null,
              balance: dueAmount, // Initialize balance with due amount
            },
          });
        }
      }

      // Create the sale
      const newSale = await tx.sale.create({
        data: {
          invoiceNumber,
          customer: { connect: { id: customer.id } },
          date: new Date(date),
          subTotal,
          amountPaid,
          paymentMethod,
          dueAmount,
          status,
          saleItems: {
            create: items.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              discount: Number(item.discount) || 0,
              total: Number(item.quantity) * Number(item.unitPrice) - (Number(item.discount) || 0),
            })),
          },
        },
        include: {
          saleItems: {
            include: {
              product: true,
            },
          },
          customer: true,
          paymentHistory: true, // Added to include payment history
        },
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: Number(item.productId) },
          data: {
            quantity: {
              decrement: Number(item.quantity),
            },
            updatedAt: new Date(),
          },
        });
      }

      // Update customer balance (only for existing customers)
      if (customerId) {
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            balance: {
              increment: dueAmount,
            },
            updatedAt: new Date(),
          },
        });
      }

      // Create payment history if amountPaid > 0
      if (amountPaid > 0) {
        await tx.paymentHistory.create({
          data: {
            saleId: newSale.id,
            date: new Date(date),
            amountPaid,
            dueBeforePayment: subTotal,
            balanceAfterPayment: dueAmount,
            paymentMethod, // Added to store payment method
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create sale" },
      { status: error.status || 500 }
    );
  }
}

export async function GET(request) {
  const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        saleItems: {
          include: {
            product: true,
          },
        },
        paymentHistory: true, // Added to fetch payment history
      },
    });
    return NextResponse.json(sales, { status: 200 });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
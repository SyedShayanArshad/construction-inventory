import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    const vendors = await prisma.vendor.findMany({
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        address: true,
        notes: true,
        totalPurchases: true,
        amountPaid: true,
        balance: true,
        _count: {
          select: { purchases: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    console.error('[VENDORS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phoneNumber, address, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Vendor name is required' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        phoneNumber: phoneNumber || null,
        address: address || null,
        notes: notes || null,
        totalPurchases: 0,
        amountPaid: 0,
        balance: 0,
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error('[VENDOR_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}
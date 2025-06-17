// app/api/vendors/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(id) },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
    console.error('[VENDOR_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { name, phoneNumber, address, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Vendor name is required' },
        { status: 400 }
      );
    }

    const existingVendor = await prisma.vendor.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: Number(id) },
      data: {
        name,
        phoneNumber: phoneNumber || null,
        address: address || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(updatedVendor, { status: 200 });
  } catch (error) {
    console.error('[VENDOR_UPDATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const existingVendor = await prisma.vendor.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Check if vendor has associated purchases
    const purchases = await prisma.purchase.findMany({
      where: { vendorId: Number(id) },
    });

    if (purchases.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vendor with associated purchases' },
        { status: 400 }
      );
    }

    await prisma.vendor.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: 'Vendor deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[VENDOR_DELETE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}
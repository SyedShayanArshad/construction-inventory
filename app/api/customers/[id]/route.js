import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { name, phoneNumber, address } = data;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        name,
        phoneNumber: phoneNumber || null,
        address: address || null,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
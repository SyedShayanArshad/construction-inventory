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
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, phoneNumber } = data; // Removed address as it’s not in the schema

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phoneNumber: phoneNumber || null,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer', details: error.message }, { status: 500 });
  }
}
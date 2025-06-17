// app/api/vendors/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (!vendors || vendors.length === 0) {
      return NextResponse.json({ error: "No vendors found" }, { status: 404 });
    }
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name) {
      return NextResponse.json(
        { error: "Vendor name is required" },
        { status: 400 }
      );
    }
    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber || null, // Changed to phoneNumber
        address: data.address || null,
        notes: data.notes || null,
        totalPurchases: 0,
        amountPaid: 0,
        balance: 0,
      },
    });
    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create vendor" },
      { status: 500 }
    );
  }
}
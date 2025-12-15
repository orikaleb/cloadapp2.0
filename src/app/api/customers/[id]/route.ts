import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error: unknown) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await request.json()
    const updated = await prisma.customer.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await prisma.customer.delete({ where: { id } })
    return NextResponse.json(deleted)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}



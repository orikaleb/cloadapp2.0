import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany()
    return NextResponse.json(customers)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const created = await prisma.customer.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}



import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const shipments = await prisma.shipment.findMany()
    return NextResponse.json(shipments)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const created = await prisma.shipment.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 })
  }
}



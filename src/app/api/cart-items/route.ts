import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.cartItem.findMany()
    return NextResponse.json(items)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const created = await prisma.cartItem.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create cart item' }, { status: 500 })
  }
}



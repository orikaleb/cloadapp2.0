import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const images = await prisma.productImage.findMany()
    return NextResponse.json(images)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch product images' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const created = await prisma.productImage.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create product image' }, { status: 500 })
  }
}



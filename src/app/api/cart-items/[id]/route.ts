import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function PUT(request: Request, { params }: Params) {
  try {
    const data = await request.json()
    const updated = await prisma.cartItem.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const deleted = await prisma.cartItem.delete({ where: { id: params.id } })
    return NextResponse.json(deleted)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 })
  }
}



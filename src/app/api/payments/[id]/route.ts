import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await request.json()
    const updated = await prisma.payment.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await prisma.payment.delete({ where: { id } })
    return NextResponse.json(deleted)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 })
  }
}



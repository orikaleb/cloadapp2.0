import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function PUT(request: Request, { params }: Params) {
  try {
    const data = await request.json()
    const updated = await prisma.customer.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const deleted = await prisma.customer.delete({ where: { id: params.id } })
    return NextResponse.json(deleted)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}



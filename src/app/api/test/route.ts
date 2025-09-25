import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Get collection counts
    const customerCount = await prisma.customer.count()
    const categoryCount = await prisma.category.count()
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()
    
    return NextResponse.json({ 
      message: 'E-commerce database connected successfully!',
      collections: {
        customers: customerCount,
        categories: categoryCount,
        products: productCount,
        orders: orderCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        productImages: true
      },
      take: 10
    })
    
    return NextResponse.json({ 
      products,
      count: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sku, productName, brand, description, price, stockQuantity, categoryId } = body
    
    const product = await prisma.product.create({
      data: {
        sku,
        productName,
        brand,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        categoryId
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json({ 
      product,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

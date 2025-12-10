import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.findMany()
    if (existingCategories.length > 0) {
      return NextResponse.json({ 
        message: 'Categories already exist',
        categories: existingCategories 
      })
    }

    // Create default categories
    const categories = [
      {
        categoryName: 'Electronics',
        description: 'Electronic devices and accessories including headphones, watches, tablets, and more',
      },
      {
        categoryName: 'Fashion',
        description: 'Clothing, shoes, and fashion accessories for all styles',
      },
      {
        categoryName: 'Home & Garden',
        description: 'Home improvement, furniture, and garden essentials',
      },
      {
        categoryName: 'Gaming',
        description: 'Gaming consoles, accessories, and equipment for gamers',
      },
    ]

    const createdCategories = await prisma.category.createMany({
      data: categories,
    })

    return NextResponse.json({ 
      message: 'Categories seeded successfully',
      count: createdCategories.count 
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error seeding categories:', error)
    return NextResponse.json({ 
      error: 'Failed to seed categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



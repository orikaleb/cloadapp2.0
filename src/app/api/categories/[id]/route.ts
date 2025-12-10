// Import NextResponse from Next.js server utilities for handling HTTP responses
import { NextResponse } from 'next/server'
// Import the Prisma client instance to interact with the database
import { prisma } from '@/lib/prisma'

// Define the type for route parameters - expects an object with params containing an id string
type Params = { params: { id: string } }

// GET handler: Fetches a single category by its ID
export async function GET(_request: Request, { params }: Params) {
  try {
    // Query the database to find a unique category matching the provided ID
    const category = await prisma.category.findUnique({
      // Specify the search condition: find category where id matches the route parameter
      where: { id: params.id },
    })
    // Check if the category was found in the database
    if (!category) {
      // Return a 404 Not Found response if category doesn't exist
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    // Return the found category as JSON with 200 OK status (default)
    return NextResponse.json(category)
  } catch (error: unknown) {
    // Catch any errors during database query and return 500 Internal Server Error
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// PUT handler: Updates an existing category by its ID
export async function PUT(request: Request, { params }: Params) {
  try {
    // Parse the JSON body from the request to get the update data
    const data = await request.json()
    // Update the category in the database with the new data
    const updated = await prisma.category.update({ 
      // Find the category by ID from the route parameter
      where: { id: params.id }, 
      // Apply the new data to update the category fields
      data 
    })
    // Return the updated category as JSON with 200 OK status (default)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    // Catch any errors during update operation and return 500 Internal Server Error
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE handler: Removes a category from the database by its ID
export async function DELETE(_request: Request, { params }: Params) {
  try {
    // Delete the category from the database matching the provided ID
    const deleted = await prisma.category.delete({ 
      // Specify which category to delete using the route parameter ID
      where: { id: params.id } 
    })
    // Return the deleted category data as JSON with 200 OK status (default)
    return NextResponse.json(deleted)
  } catch (error: unknown) {
    // Catch any errors during deletion (e.g., category not found, foreign key constraints) and return 500
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}



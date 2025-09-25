# E-Commerce Cloud App - Next.js with Prisma

A modern e-commerce Next.js application with Prisma ORM and MongoDB Atlas database.

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 🗄️ Prisma ORM with MongoDB Atlas
- 📝 TypeScript support
- 🔧 ESLint configuration
- 🛒 Complete e-commerce functionality

## Database Models

The application includes a comprehensive e-commerce database with 11 models:

### Core Models
- **Customer**: User accounts with authentication and profile information
- **Category**: Hierarchical product categories with parent-child relationships
- **Product**: Product catalog with SKU, pricing, and inventory management
- **ProductImage**: Multiple images per product with primary image designation

### Order Management
- **Order**: Customer orders with status tracking and financial details
- **OrderItem**: Individual products within orders with quantities and pricing
- **Payment**: Payment transactions with multiple payment methods
- **Sale**: Completed sales linking orders and payments
- **Shipment**: Shipping and delivery tracking

### Shopping Experience
- **ShoppingCart**: Customer shopping carts with session management
- **CartItem**: Products in shopping carts with quantities

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The application is already configured with your MongoDB Atlas connection:

```bash
# MongoDB Atlas connection string (already configured)
DATABASE_URL="mongodb+srv://calebotchere014_db_user:odoKFYzz3rhOvnN5@cluster0.sorewns.mongodb.net/cloudapp_db?retryWrites=true&w=majority"
```

### 3. Database Setup

The MongoDB database is already set up and connected! The e-commerce collections have been created:

```bash
# Database is already configured and collections created
# Collections: customers, categories, products, product_images, orders, order_items, shopping_carts, cart_items, payments, sales, shipments
# Indexes: customers_email_key, products_sku_key, shopping_carts_customerId_key
```

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Test Database Connection

Visit [http://localhost:3000/api/test](http://localhost:3000/api/test) to test the database connection.

## Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to MongoDB
npx prisma db push

# Open Prisma Studio
npx prisma studio

# View database in MongoDB Atlas
# Visit: https://cloud.mongodb.com/
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   └── page.tsx        # Home page
├── lib/                # Utility functions
│   └── prisma.ts       # Prisma client configuration
prisma/
└── schema.prisma       # Database schema
```

## Next Steps

1. Set up your PostgreSQL database
2. Update the `DATABASE_URL` in `.env.local`
3. Run `npx prisma migrate dev --name init` to create the database tables
4. Start building your application features!
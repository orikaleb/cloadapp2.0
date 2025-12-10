// Mark this component as a client component (required for React hooks and browser APIs)
'use client';

// Import useState hook to manage component state
import { useState, useEffect } from 'react';
// Import useRouter hook from Next.js for programmatic navigation
import { useRouter } from 'next/navigation';

// Define TypeScript type for Category object structure
type Category = {
  // Unique identifier for the category
  id: string;
  // Display name of the category
  categoryName: string;
};

// Main component function for creating a new product
export default function NewProductPage() {
  // Initialize router instance for navigation after form submission
  const router = useRouter();
  // State to store list of available categories fetched from API
  const [categories, setCategories] = useState<Category[]>([]);
  // State to track if the form submission is in progress (prevents double submission)
  const [loading, setLoading] = useState(false);
  // State to store all form field values as user types
  const [formData, setFormData] = useState({
    // Stock Keeping Unit - unique product identifier
    sku: '',
    // The name/title of the product
    productName: '',
    // Brand name (optional field)
    brand: '',
    // Product description (optional field)
    description: '',
    // Product price in Cedis (stored as string for input, converted to number on submit)
    price: '',
    // Number of items available in stock
    stockQuantity: '',
    // ID of the category this product belongs to
    categoryId: '',
  });

  // useEffect hook runs once when component mounts (empty dependency array)
  useEffect(() => {
    // Call function to fetch categories from the API
    fetchCategories();
  }, []); // Empty array means this effect runs only once on mount

  // Async function to fetch categories from the API
  const fetchCategories = async () => {
    try {
      // Make HTTP GET request to categories API endpoint
      const res = await fetch('/api/categories');
      // Check if the response was successful (status 200-299)
      if (res.ok) {
        // Parse the JSON response body into JavaScript object
        const data = await res.json();
        // Update categories state with fetched data
        setCategories(data);
        // Check if any categories were returned
        if (data.length > 0) {
          // Pre-select the first category in the dropdown by updating formData
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      }
    } catch (error) {
      // Log any errors to console for debugging
      console.error('Failed to fetch categories:', error);
    }
  };

  // Event handler function for all form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Extract the name attribute (field name) from the input element
    const { name, value } = e.target;
    // Update formData state, preserving existing values and updating only the changed field
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Event handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();
    // Set loading state to true to show loading indicator and disable form
    setLoading(true);

    try {
      // Prepare product data object with proper types for API
      const productData = {
        // SKU from form (string)
        sku: formData.sku,
        // Product name from form (string)
        productName: formData.productName,
        // Brand - convert empty string to null for optional field
        brand: formData.brand || null,
        // Description - convert empty string to null for optional field
        description: formData.description || null,
        // Convert price string to floating point number
        price: parseFloat(formData.price),
        // Convert stock quantity string to integer
        stockQuantity: parseInt(formData.stockQuantity),
        // Category ID from form (string)
        categoryId: formData.categoryId,
      };

      // Make HTTP POST request to create new product
      const res = await fetch('/api/products', {
        // Specify HTTP method as POST
        method: 'POST',
        // Set request headers to indicate JSON content
        headers: { 'Content-Type': 'application/json' },
        // Convert productData object to JSON string for request body
        body: JSON.stringify(productData),
      });

      // Check if the API request was successful
      if (res.ok) {
        // Navigate to products list page after successful creation
        router.push('/admin/products');
      } else {
        // Parse error response from API
        const error = await res.json();
        // Display error message to user in alert dialog
        alert(error.error || 'Failed to create product');
      }
    } catch (error) {
      // Catch any network or parsing errors
      console.error('Error creating product:', error);
      // Show generic error message to user
      alert('Failed to create product');
    } finally {
      // Always set loading to false, even if request fails (enables form again)
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <a
          href="/admin/products"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
        >
          ← Back to Products
        </a>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">Create a new product listing</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="PROD-001"
              />
            </div>

            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                required
                value={formData.productName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₵) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <a
              href="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import CategoryFilter from "../components/category-filter";
import ProductSort from "../components/category-sort";
import ProductSearch from "../components/product-search";
import ProductModal from "../components/ProductModal";
import { useCartStore } from "../store/cart-store";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function ProductsPage() {
  const addToCart = useCartStore((state) => state.addItem);
  const removeFromCart = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("https://fakestoreapi.com/products");
        const data = response.data as Product[];
        console.log("Fetched products:", data);
        setProducts(data);
        setFilteredProducts(data);
        
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Our Products</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <ProductSearch onSearch={handleSearch} />
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter 
            categories={categories} 
            onCategoryChange={handleCategoryChange} 
          />
          <ProductSort onSortChange={handleSortChange} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => {
                  console.log("Clicked product ID:", product.id);
                  setSelectedProductId(product.id);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-800">
                    {product.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {product.category}
                  </p>
                  <p className="mb-2 line-clamp-2 text-sm text-gray-500">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {cartItems.some(item => item.id === product.id) ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(product.id);
                        }}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-red-700"
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                          });
                        }}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No products found matching your criteria
            </div>
          )}
        </div>
      </div>

      {selectedProductId && (
        <ProductModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
} 
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductSearch from "../components/product-search";
import ProductCard from "../components/product-card";
import CategoryFilter from '../components/category-filter';
import ProductSort from '../components/category-sort';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json() as Product[];
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories with proper type assertion
        const uniqueCategories = Array.from(new Set(data.map((p) => p.category))) as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Apply sorting
    switch (sort) {
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
      default:
        // Default sorting (by ID)
        filtered.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(filtered);
  }, [searchParams, products]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">All Products</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <ProductSearch />
      </div>

      <div className="flex items-center justify-between mb-8">
        <CategoryFilter categories={categories} />
        <ProductSort />
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length} products
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            No products found
          </h2>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
} 
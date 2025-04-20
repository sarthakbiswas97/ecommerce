"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
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

interface ProductModalProps {
  productId: number;
  onClose: () => void;
}

export default function ProductModal({ productId, onClose }: ProductModalProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Modal mounted with productId:", productId); // Debug log
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all products first
        console.log("Fetching all products..."); // Debug log
        const allProductsResponse = await axios.get("https://fakestoreapi.com/products");
        console.log("All products fetched:", allProductsResponse.data); // Debug log
        
        // Find the specific product
        const foundProduct = allProductsResponse.data.find((p: Product) => p.id === productId);
        console.log("Found product:", foundProduct); // Debug log
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error(`Product with ID ${productId} not found`);
        }
      } catch (error) {
        console.error("Error in fetchProduct:", error); // Debug log
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-8">
          <div className="text-xl font-semibold text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-8">
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <button 
              onClick={onClose} 
              className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-8">
          <div className="text-xl font-semibold text-gray-600">Product not found</div>
          <button 
            onClick={onClose} 
            className="mt-4 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="mt-2 text-sm text-gray-500">{product.category}</p>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating.rate)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.rating.count} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">${product.price}</p>

            <p className="text-gray-600">{product.description}</p>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (product) {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image,
                    });
                  }
                }}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <button className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
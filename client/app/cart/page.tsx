"use client";

import { useCartStore } from "../store/cart-store";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
          <p className="mb-6 text-gray-600">Looks like you haven't added any products to your cart yet.</p>
          <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Empty cart</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding some products to your cart.</p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-xl font-bold text-gray-900">
                    ${item.price}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded-full bg-gray-200 p-1 text-gray-600 transition-colors duration-300 hover:bg-gray-300 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full bg-gray-200 p-1 text-gray-600 transition-colors duration-300 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 transition-colors duration-300 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-900">Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="w-full rounded-full bg-blue-600 py-3 text-white transition-colors duration-300 hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
              <Link
                href="/products"
                className="block w-full rounded-full border border-gray-300 py-3 text-center text-gray-700 transition-colors duration-300 hover:bg-gray-100"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
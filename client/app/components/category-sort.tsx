"use client";
import { useState } from "react";

interface ProductSortProps {
  onSortChange: (sortOption: string) => void;
}

export default function ProductSort({ onSortChange }: ProductSortProps) {
  const [sortOption, setSortOption] = useState("default");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    onSortChange(value);
  };

  return (
    <div className="mb-4">
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="default" className="text-gray-700">Default</option>
        <option value="price-low-high" className="text-gray-700">Price: Low to High</option>
        <option value="price-high-low" className="text-gray-700">Price: High to Low</option>
        <option value="name-a-z" className="text-gray-700">Name: A to Z</option>
        <option value="name-z-a" className="text-gray-700">Name: Z to A</option>
      </select>
    </div>
  );
}
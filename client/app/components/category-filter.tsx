"use client";
import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, onCategoryChange }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCategoryChange = (category: string) => {
    console.log("Category button clicked:", category); // Debug log
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  // Debug log for categories prop
  console.log("Categories received in filter:", categories);

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange("all")}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          selectedCategory === "all"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}
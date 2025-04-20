"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortOption = searchParams.get('sort') || 'default';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="w-48">
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="default">Default</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="name-a-z">Name: A to Z</option>
        <option value="name-z-a">Name: Z to A</option>
      </select>
    </div>
  );
}
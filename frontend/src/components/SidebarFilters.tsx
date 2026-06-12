import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
interface Category {
  id: string;
  name: string;
}
interface SidebarFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
}

export default function SidebarFilters({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice
}: SidebarFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const MAX = 100000;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error('Error fetching categories side panel:', err);
      }
    };
    getCategories();
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxPrice - 1);
    setMinPrice(val);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minPrice + 1);
    setMaxPrice(val);
  };

  const minPercent = (minPrice / MAX) * 100;
  const maxPercent = (maxPrice / MAX) * 100;
  
  return (
    <aside className="w-full lg:w-56 space-y-8 select-none font-sans">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">Search</h3>
        <input
          type="text"
          placeholder="Search for a product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors rounded-none"
        />
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Price</h3>
        <div className="relative h-1 bg-gray-200 rounded-full mb-4">
          <div
            className="absolute h-1 bg-blue-600 rounded-full"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />
          <input
            type="range"
            min={1}
            max={MAX}
            step={1}
            value={minPrice}
            onChange={handleMinChange}
            className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer price-range-thumb pointer-events-none"
          />
          <input
            type="range"
            min={1}
            max={MAX}
            step={1}
            value={maxPrice}
            onChange={handleMaxChange}
            className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer price-range-thumb pointer-enents-none"
          />
        </div>
        <p className="text-sm text-gray-700 mt-3">
          Price: ${minPrice.toLocaleString()} — ${maxPrice.toLocaleString()}
        </p>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">Categories</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <button
              onClick={() => setSelectedCategory('')}
              className={`w-full text-left py-0.5 transition-colors ${selectedCategory === '' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left py-0.5 transition-colors cursor-pointer truncate ${selectedCategory === cat.id ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                  }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

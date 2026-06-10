import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import SidebarFilters from '../components/SidebarFilters';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: string | number;
  description: string;
  images: string[];
  category?: { name: string };
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();

        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);
        if (minPrice) params.append('minPrice', minPrice.toString());
        if (maxPrice) params.append('maxPrice', maxPrice.toString());

        params.append('page', currentPage.toString());
        params.append('limit', ITEMS_PER_PAGE.toString());

        const response = await api.get(`/products?${params}`);

        if (response.data.success) {
          const productArray = response.data.data.data;
          const metadata = response.data.data.meta;
          setProducts(Array.isArray(productArray) ? productArray : []);
          setPaginationMeta(metadata || null);
        }
      } catch (err) {
        setError('Failed to refresh product catalog.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchQuery, currentPage, minPrice, maxPrice]);

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col-reverse lg:flex-row gap-12 font-sans">

      <div className="flex-1 space-y-12">
        {error && (
          <div className="p-4 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="space-y-4">
                <div className="bg-gray-100 aspect-[3/4] w-full rounded-none" />
                <div className="h-4 bg-gray-100 rounded-none w-2/3" />
                <div className="h-4 bg-gray-100 rounded-none w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-xs uppercase tracking-widest font-bold text-gray-400 border border-dashed border-gray-200">
            No items match the active catalog filters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  images={product?.images || []}
                  category={product.category?.name || 'Catalog'}
                  price={Number(product.price)}
                  description={product.description}
                />
              ))}
            </div>

            {paginationMeta && paginationMeta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-8 text-xs font-bold uppercase tracking-widest select-none">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 text-gray-400 text-white bg-primary-blue  disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  Previous
                </button>

                <div className="text-gray-400 font-medium normal-case tracking-normal">
                  Page <span className="font-bold text-black">{currentPage}</span> of {paginationMeta.totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))}
                  disabled={currentPage === paginationMeta.totalPages}
                  className="px-4 py-2 border border-gray-200 text-gray-400 bg-primary-blue text-white  disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SidebarFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />
    </main>
  );
}
import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category?: { name: string };
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const ITEMS_PER_PAGE = 10;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      
      if (res.data.success) {
        const nestedData = res.data.data;
        const verifiedArray = Array.isArray(nestedData) ? nestedData : nestedData?.data || [];
        const metadata = nestedData?.meta || null;

        setProducts(verifiedArray);
        setPaginationMeta(metadata);
      }
    } catch (err) {
      console.error('Error fetching inventory array:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openDeleteConfirmation = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.delete(`/products/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        showToast('success', res.data.message || 'Product removed from catalog.');
        
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          getProducts();
        }
      }
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Could not delete requested product.');
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };


  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setEditPrice(product.price.toString());
    setEditStock(product.stock_quantity.toString());
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleUpdateProduct = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productToEdit) return;
    setEditLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await api.patch(`/products/${productToEdit.id}`, {
        price: Number(editPrice),
        stock_quantity: Number(editStock),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        showToast('success', 'Product updated successfully.');
        getProducts();
        closeEditModal();
      }
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to update product variants.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 border text-xs font-bold uppercase tracking-wider ${
          toast.type === 'success' ? 'bg-black text-white border-black' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>{toast.message}</div>
      )}

      <div>
        <h1 className="text-xl font-bold uppercase tracking-tight">Inventory</h1>
        <p className="text-xs text-gray-400 mt-0.5">Dashboard for tracking all compiled platform items.</p>
      </div>

      {loading ? (
        <div className="text-xs text-gray-400 animate-pulse uppercase tracking-widest">Querying live data states...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 text-xs text-gray-400 uppercase tracking-wider font-semibold">
          Database inventory currently empty.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-gray-100 overflow-x-auto rounded-sm w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-widest">
                  <th className="p-4 font-bold">Product Name</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Available Stock</th>
                  <th className="p-4 font-bold text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 font-bold text-black">{prod.name}</td>
                    <td className="p-4 text-gray-500">{prod.category?.name || 'Unassigned'}</td>
                    <td className="p-4 text-black font-semibold">${Number(prod.price).toFixed(2)}</td>
                    <td className="p-4 text-gray-600">{prod.stock_quantity} units</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="text-gray-300 hover:text-black hover:cursor-pointer p-1 transition-colors inline-flex items-center justify-center"
                        title="Edit Product"
                      >
                        <svg className="w-4 h-4 edit-icon"  strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => openDeleteConfirmation(prod)}
                        className="text-gray-300 hover:text-rose-600 hover:cursor-pointer p-1 transition-colors inline-flex items-center justify-center"
                        title="Remove Product"
                      >
                        <svg className="w-4 h-4 delete-icon" viewBox="0 0 24 24">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginationMeta && paginationMeta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs font-bold uppercase tracking-widest select-none">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                Prev
              </button>

              <div className="text-gray-400 font-medium normal-case tracking-normal">
                Page <span className="font-bold text-black">{currentPage}</span> of {paginationMeta.totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))}
                disabled={currentPage === paginationMeta.totalPages}
                className="px-3 py-1.5 border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeDeleteModal} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="bg-white border border-black max-w-sm w-full p-6 space-y-6 relative z-10 rounded-none shadow-sm">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-black">Confirm Deletion</h3>
              <p className="text-[11px] text-gray-400 font-medium normal-case leading-relaxed mt-2">
                Are you sure you want to permanently delete <span className="font-bold text-black uppercase">"{productToDelete?.name}"</span>? 
              </p>
            </div>
            <div className="flex justify-end space-x-3 text-xs font-bold uppercase tracking-wider">
              <button onClick={closeDeleteModal} disabled={deleteLoading} className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-black transition-colors hover:cursor-pointer disabled:opacity-50">Cancel</button>
              <button onClick={handleDeleteProduct} disabled={deleteLoading} className="px-4 py-2 bg-black text-white hover:bg-rose-700 hover:cursor-pointer transition-colors disabled:bg-gray-300">
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeEditModal} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <form onSubmit={handleUpdateProduct} className="bg-white border border-black max-w-sm w-full p-6 space-y-5 relative z-10 rounded-none shadow-sm">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-black">Edit Product</h3>
              <p className="text-[10px] text-gray-400 uppercase mt-0.5">Modifying: {productToEdit?.name}</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Present Stock</label>
                <input
                  type="number"
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 text-xs font-bold uppercase tracking-wider pt-2">
              <button type="button" onClick={closeEditModal} disabled={editLoading} className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-black transition-colors hover:cursor-pointer">Cancel</button>
              <button type="submit" disabled={editLoading} className="px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors hover:cursor-pointer">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
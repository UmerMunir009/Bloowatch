import { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import detele_icon from '../assets/delete.svg'

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      await api.post('/categories', { name, slug }, { headers: { Authorization: `Bearer ${token}` } });

      showToast('success', 'Category added.');
      setName(''); setSlug('');

      fetchCategories();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Error processing category logic.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (category: Category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await api.delete(`/categories/${categoryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        showToast('success', res.data.message || 'Category deleted successfully.');
        fetchCategories();
      }

    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Could not delete target category entry.');
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
      {toast &&
        (<div className={`fixed top-6 right-6 z-50 p-4 border text-xs font-bold uppercase tracking-wider ${toast.type === 'success' ? 'bg-black text-white border-black' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{toast.message}</div>
        )}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">Create Category</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Name</label>
            <input type="text" required placeholder="Gear Rental" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Slug</label>
            <input type="text" required placeholder="gear-rental" value={slug} onChange={(e) => setSlug(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black" />
          </div>
          <button type="submit" disabled={loading} className="w-full hover:cursor-pointer bg-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
            {loading ? 'Processing...' : 'Add Category'}
          </button>
        </form>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Existing Categories</h2>
        <div className="border border-gray-100 divide-y divide-gray-100 rounded-sm">
          {categories.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 uppercase font-medium">No categories found.</div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="p-4 flex justify-between items-center text-xs font-bold uppercase group hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col space-y-0.5">
                  <span className="text-black tracking-wide">{cat.name}</span>
                </div>
                <button
                  onClick={() => openDeleteConfirmation(cat)}
                  className="text-gray-300 hover:text-black hover:cursor-pointer p-1 transition-colors flex items-center justify-center"
                  title="Remove Node"
                >
                  <img className='h-4 w-4' src={detele_icon} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeDeleteModal} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="bg-white border border-black max-w-sm w-full p-6 space-y-6 relative z-10 rounded-none shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-black">Confirm Deletion</h3>
              <p className="text-[11px] text-gray-400 font-medium normal-case leading-relaxed mt-2">
                Are you sure you want to permanently delete <span className="font-bold text-black uppercase">"{categoryToDelete?.name}"</span>?
              </p>
            </div>
            <div className="flex justify-end space-x-3 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-black hover:border-black transition-colors hover:cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={deleteLoading}
                className="px-4 py-2 bg-black text-white hover:bg-rose-700 hover:cursor-pointer transition-colors disabled:bg-gray-300"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

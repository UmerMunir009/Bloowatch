import { useState, useEffect, useRef } from 'react';
import api from '../api/axiosClient';

interface Category {
  id: string;
  name: string;
}
export default function AddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/categories')
      .then(res => { if (res.data.success) setCategories(res.data.data); })
      .catch(err => console.error(err));
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'));
  };
  const toggleCategory = (id: string) => {
    setCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    categoryIds.forEach(id => formData.append('categoryIds[]', id));
    formData.append('price', price);
    formData.append('stock_quantity', stock);
    formData.append('description', description);

    if (fileInputRef.current?.files) {
      Array.from(fileInputRef.current.files).forEach(file => formData.append('files', file));
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });

      showToast('success', 'Product uploaded successfully.');
      setName(''); setSlug(''); setCategoryIds([]); setPrice(''); setStock(''); setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Transaction compilation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 border shadow-sm text-xs font-bold uppercase tracking-wider rounded-none ${toast.type === 'success' ? 'bg-black text-white border-black' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Categories</label>
            <div className="border border-gray-200 px-3 py-2 space-y-2 max-h-40 overflow-y-auto">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="cursor-pointer"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Title</label>
            <input type="text" required placeholder="Enter product title" value={name} onChange={handleNameChange} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Slug </label>
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Base Price ($ USD)</label>
            <input type="number" step="0.01" required placeholder="149.99" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Availability</label>
            <input type="number" required placeholder="12" value={stock} onChange={(e) => setStock(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none" />
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Upload Image Assets (Max 5)</label>
          <input type="file" multiple accept="image/*" ref={fileInputRef} className="border border-gray-200 px-3 py-2 text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-black file:text-white cursor-pointer rounded-none" />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description Copy</label>
          <textarea rows={4} required placeholder="Technical data summary..." value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black resize-none rounded-none" />
        </div>

        <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:bg-gray-200 rounded-none cursor-pointer">
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/useToast';


interface RouterLocationState {
    id: string;
    title: string;
    images: string[];   
    category: string;
    price: number;
    description?: string;
}

export default function ProductDetailPage() {
    const location = useLocation();
    const { addToCart, loading } = useCart();
    const { showToast } = useToast();

    const productData = location.state as RouterLocationState | null;
    const title = productData?.title || 'Unknown Product';
    const price = productData?.price || 0;
    const category = productData?.category || 'Uncategorized';
    const imgSrc = productData?.images?.[0] || '';
    const description = productData?.description || 'No description';

    const [selectedImage, setSelectedImage] = useState(imgSrc);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'reviews'>('desc');

    const thumbnails = productData?.images?.length ? productData.images : [imgSrc];

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const addToCartHandler = async () => {
        if (!productData?.id) return;

        const result = await addToCart(productData.id, quantity);
        if (!result.success) {
            showToast(result.message || 'Failed to add item to cart', 'error');
        } else {
            showToast('Item added to cart successfully!', 'success');
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 font-sans text-text-dark">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">

                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 w-20 shrink-0">
                        {thumbnails.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`aspect-square bg-[#F5F5F5] p-2 border rounded-sm transition-all overflow-hidden flex items-center justify-center cursor-pointer
                  ${selectedImage === img ? 'border-brand-blue' : 'border-gray-200'}`}
                            >
                                {img && <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-auto object-contain" />}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 aspect-[4/5] bg-[#F5F5F5] rounded-sm flex items-center justify-center p-8 border border-gray-100">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt={title}
                                className="h-full w-auto object-contain"
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold uppercase tracking-wide mb-4">
                        {title}
                    </h1>

                    <div className="inline-block px-4 py-1.5 bg-primary-blue rounded-btn text-white font-bold text-sm  w-fit mb-6">
                        $ {price}
                    </div>

                    <p className="text-[14px] text-gray-600 leading-relaxed mb-8 max-w-xl">
                        {description}
                    </p>

                    <div className="flex items-center gap-6 mb-10 select-none">
                        <div className="flex items-center gap-4 h-12">
                            <input
                                type="number"
                                value={quantity}
                                readOnly
                                className="w-14 h-12 text-center text-[15px] font-bold text-black border border-gray-300 rounded-sm bg-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-spin-button]:appearance-none"
                            />

                            <div className="flex flex-col h-full w-7 justify-between items-center py-1">
                                <button
                                    onClick={increment}
                                    className="w-full flex items-center justify-center text-black hover:text-brand-blue cursor-pointer transition-colors"
                                >
                                    <svg
                                        className="w-3 h-3 arrow-icon"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>
                                </button>

                                <div className="w-full h-[2px] bg-black" />

                                <button
                                    onClick={decrement}
                                    className="w-full flex items-center justify-center text-black hover:text-brand-blue cursor-pointer transition-colors"
                                >
                                    <svg
                                        className="w-3 h-3 arrow-icon"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button onClick={addToCartHandler} className="h-12 px-8 border border-gray-300 hover:border-primary-blue hover:bg-primary-blue hover:text-white text-black text-xs font-bold tracking-wider uppercase rounded-sm transition-all duration-200 cursor-pointer bg-transparent">
                            {loading ? 'Adding...' : 'ADD TO CART'}
                        </button>
                    </div>

                    <div className="space-y-3 text-xs uppercase font-bold tracking-wide border-t border-gray-100 pt-6">
                        <div>
                            <span className="text-text-dark">SKU:</span>
                            <span className="text-gray-500 font-normal ml-1">{productData?.id || '123'}</span>
                        </div>
                        <div>
                            <span className="text-text-dark">CATEGORIES:</span>
                            <span className="text-gray-500 font-normal ml-1">{category} </span>
                        </div>
                        <div>
                            <span className="text-text-dark">TAGS:</span>
                            <span className="text-gray-500 font-normal ml-1">{category}w</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center gap-8 border-b border-gray-100 pb-3 mb-6 text-xs uppercase font-bold tracking-wider">
                    <button
                        onClick={() => setActiveTab('desc')}
                        className={`pb-3 relative cursor-pointer transition-colors ${activeTab === 'desc' ? 'text-text-dark border-b-2 border-text-dark' : 'text-gray-400 hover:text-text-dark'
                            }`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 relative cursor-pointer transition-colors ${activeTab === 'info' ? 'text-text-dark border-b-2 border-text-dark' : 'text-gray-400 hover:text-text-dark'
                            }`}
                    >
                        Additional Information
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-3 relative cursor-pointer transition-colors ${activeTab === 'reviews' ? 'text-text-dark border-b-2 border-text-dark' : 'text-gray-400 hover:text-text-dark'
                            }`}
                    >
                        Reviews (2)
                    </button>
                </div>

                <div className="text-[14px] leading-relaxed text-gray-500 max-w-5xl min-h-[100px]">
                    {activeTab === 'desc' && <p>{description}</p>}
                    {activeTab === 'info' && (
                        <p className="italic">
                            Additional specifications regarding dimensions, payload weight allowances, and accessory fins are included here.
                        </p>
                    )}
                    {activeTab === 'reviews' && (
                        <p className="font-medium text-brand-blue">
                            Showing 2 verified buyer reviews for this specific model configuration.
                        </p>
                    )}
                </div>

            </div>
        </main>
    );
}
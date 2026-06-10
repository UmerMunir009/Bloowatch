import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/useToast';

export default function CartPage() {
    const { cartItems, getCart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        getCart();
    }, [getCart]);

    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);

    const removeItemFromCart = async (cartItemId: string) => {
        const result = await removeFromCart(cartItemId);
        if (!result.success) {
            showToast(result.message || 'Failed to remove item from cart', 'error');
        } else {
            showToast('Item removed from cart successfully!', 'success');
        }
    };

    const clearEntireCart = async () => {
        const result = await clearCart();
        if (!result.success) {
            showToast(result.message || 'Failed to clear cart', 'error');
        } else {
            showToast('Cart cleared successfully!', 'success');
        }
    };
    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col justify-between">
            <main className="w-full max-w-[1000px] mx-auto px-4 py-16 flex-grow">
                <div className="bg-white rounded-card shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mb-8">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-widest text-black">
                                    <th className="py-5 px-6 text-center w-16"></th>
                                    <th className="py-5 px-4">Product</th>
                                    <th className="py-5 px-4 text-center">Price</th>
                                    <th className="py-5 px-4 text-center">Quantity</th>
                                    <th className="py-5 px-6 text-center">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading && cartItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-neutral-400 uppercase tracking-widest animate-pulse">
                                            Loading your items...
                                        </td>
                                    </tr>
                                ) : cartItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-gray-400 uppercase tracking-wider">
                                            Your cart is currently empty.
                                        </td>
                                    </tr>
                                ) : (
                                    cartItems.map((item) => (
                                        <tr key={item.id} className="text-[14px] text-black">
                                            <td className="py-6 px-6 text-center">
                                                <button
                                                    onClick={() => removeItemFromCart(item.id)}
                                                    className="text-black transition-colors cursor-pointer text-lg font-light"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-20 h-24 bg-[#F8F8F8] flex items-center justify-center p-2 border border-gray-100">
                                                        <img
                                                            src={item.product.images?.[0] || "/api/placeholder/80/100"}
                                                            alt={item.product.name}
                                                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                                                        />
                                                    </div>
                                                    <span className="font-bold text-[14px] tracking-wide text-black">{item.product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-center font-medium text-gray-900">
                                                {Number(item.product.price)}
                                            </td>
                                            <td className="py-6 px-4 text-center">
                                                <div className="inline-flex items-center justify-center border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 text-gray-500 hover:text-black cursor-pointer text-xs"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-semibold min-w-[24px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 text-gray-500 hover:text-black cursor-pointer text-xs"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 text-center font-bold text-gray-900">
                                                {Number(item.product.price) * item.quantity}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex space-x-4 mb-20">
                    <button className="px-6 py-3 bg-primary-blue text-white font-bold text-[11px] uppercase tracking-widest rounded-btn transition-colors cursor-pointer">
                        Apply Coupon
                    </button>
                    <button
                        onClick={clearEntireCart}
                        className="px-6 py-3 bg-primary-blue  text-white font-bold text-[11px] uppercase tracking-widest rounded-btn transition-colors cursor-pointer"
                    >
                        {loading ? 'Clearing Cart...' : 'Clear Cart'}
                    </button>
                </div>
                <div className="w-full max-w-[480px]">
                    <h2 className="text-[22px] font-bold uppercase tracking-wider text-black mb-6">Cart Total</h2>
                    <div className="border-t border-b border-gray-100 divide-y divide-gray-100 mb-8">
                        <div className="py-4 flex justify-between items-center text-[12px]">
                            <span className="font-bold uppercase tracking-wider text-black w-1/3">Subtotal</span>
                            <span className="text-gray-600 font-medium">{subtotal}</span>
                        </div>
                        <div className="py-4 flex justify-between items-center text-[12px]">
                            <span className="font-bold uppercase tracking-wider text-black w-1/3">Shipping</span>
                            <span className="text-gray-400 text-left w-2/3">Enter your shipping address to see updates</span>
                        </div>
                        <div className="py-5 flex justify-between items-center text-[13px]">
                            <span className="font-bold uppercase tracking-wider text-black w-1/3">Total</span>
                            <span className="font-bold text-black">${subtotal}</span>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-primary-blue  text-white font-bold text-[11px] uppercase tracking-widest rounded-btn transition-colors tracking-wide cursor-pointer">
                        Proceed to Checkout
                    </button>
                </div>
            </main>
        </div>
    );
}

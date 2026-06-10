import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import api from '../api/axiosClient';
import { useAuth } from './AuthContext';

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock_quantity: number;
    images: string[];
}
export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}
interface CartContextType {
    cartItems: CartItem[];
    loading: boolean;
    getCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<{ success: boolean; message?: string }>;
    updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<{ success: boolean; message?: string }>;
    clearCart: () => Promise<{ success: boolean; message?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getCart = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            const res = await api.get('/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setCartItems(res.data.data);
            }
        } catch (err: any) {
            console.error('Error fetching cart:', err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addToCart = async (productId: string, quantity = 1) => {
        if (!token) {
            return { success: false, message: 'Please sign in to perform this action.' };
        }

        try {
            setLoading(true);
            const res = await api.post('/cart', { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Add to cart failed.'
            };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        if (!token) return;

        try {
            setCartItems(prev =>
                prev.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item)
            );

            await api.patch(`/cart/${cartItemId}`, { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err: any) {
            console.error('Failed modifying quantity:', err.response?.data?.message || err.message);
            getCart();
        }
    };

    const removeFromCart = async (cartItemId: string) => {
        if (!token) {
            return { success: false, message: 'Please sign in to perform this action.' };
        }

        try {
            await api.delete(`/cart/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));
            return { success: true, message: 'Item removed from cart.' };
        } catch (err: any) {
            console.error('Failed to remove item from cart:', err.response?.data?.message || err.message);
            getCart();
            return { success: false, message: err.response?.data?.message || 'Failed to remove item from cart.' };
        }
    }

    const clearCart = async () => {
        if (!token) {
            return { success: false, message: 'Please sign in to perform this action.' };
        }
        try {
            await api.delete(`/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems([]);
            return { success: true, message: 'Cart cleared successfully.' };
        } catch (err: any) {
            console.error('Failed to clear cart:', err.response?.data?.message || err.message);
            getCart();
            return { success: false, message: err.response?.data?.message || 'Failed to clear cart.' };
        }
    };


    return (
        <CartContext.Provider value={{ cartItems, loading, getCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

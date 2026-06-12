import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/useToast';
import { ToastType } from '../utils/constants';


interface ProductProps {
  id: string;
  title: string;
  images: string[];
  categories: { id: string; name: string }[];
  price: number;
  description: string;
}

export default function ProductCard({ id, title, categories, price, images, description }: ProductProps) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/product/${id}`, {
      state: { id, title, categories, price, images, description }
    });
  };
  const { addToCart, loading } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await addToCart(id, 1);
    if (!result.success) {
      showToast(result.message || 'Failed to add item to cart', ToastType.Error);
    } else {
      showToast('Item added to cart successfully!', ToastType.Success);
    }
  };

  return (
    <div
      onClick={handleNavigation}
      className="flex flex-col items-center group w-full max-w-[280px] mx-auto cursor-pointer "
    >
      <div className="w-full aspect-[4/3] bg-surface-grey relative rounded-sm flex items-center justify-center overflow-hidden">
        <img
          src={images && images.length > 0 ? images[0] : ''}
          alt={title}
          className="h-[85%] w-auto object-contain pb-2 "
        />
      </div>

      <div className="w-full h-12 bg-surface-grey relative overflow-hidden mb-2">
        <button
          onClick={handleAddToCart}
          className="absolute inset-0 w-full h-full bg-primary-blue text-white text-[12px] font-bold tracking-wider uppercase opacity-0 -translate-y-full group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer flex items-center justify-center"
        >
          {loading ? 'Adding...' : 'ADD TO CART'}
        </button>
      </div>

      <h2 className="text-[10px] md:text-[14px] uppercase font-bold text-text-dark tracking-wide mb-1  text-center">
        {title}
      </h2>

      <span className="text-[13px] text-primary-blue font-medium mb-3 block text-center">
        {categories.map(cat => cat.name).join(', ')}
      </span>

      <div className="px-4 py-1.5 bg-primary-blue text-white font-bold text-[14px] min-w-[50px] text-center rounded-btn">
        $ {price}
      </div>
    </div>
  );
}
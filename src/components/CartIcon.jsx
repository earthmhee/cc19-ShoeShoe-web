// src/components/CartIcon.jsx
import { Link } from 'react-router';
import useCartStore from '../stores/useCartStore';
import { useEffect } from 'react';
import { ShoppingBagIcon } from 'lucide-react';
import { ShoppingCartIcon } from '../icons';

const CartIcon = () => {
  const { totalItems, fetchCart } = useCartStore();
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  
  return (
    <Link to="/cart" className="relative">
     <ShoppingCartIcon className="w-5 cursor-pointer transform transition duration-300 hover:rotate-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
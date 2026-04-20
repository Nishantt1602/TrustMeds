import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`medCart_${user.id}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]);
    }
  }, [user]);

  // Save cart to localStorage when cart changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`medCart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.inventoryId === item.inventoryId);
      if (existing) {
        toast.success('Quantity updated in cart!');
        return prev.map((i) => i.inventoryId === item.inventoryId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success('Added to cart!');
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (inventoryId) => {
    setCart((prev) => prev.filter((i) => i.inventoryId !== inventoryId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
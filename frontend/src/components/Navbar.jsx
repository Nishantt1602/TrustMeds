import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
// 👇 Notice ShoppingCart is included here
import { Pill, Search, Bot, LogOut, Store, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext); // Pull cart data

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
          <Pill className="w-8 h-8" />
          <span>TrustMeds</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-gray-600 font-medium">
          <Link to="/search" className="flex items-center gap-1 hover:text-blue-600 transition">
            <Search className="w-5 h-5" /> Search
          </Link>
          
          <Link to="/chat" className="flex items-center gap-1 hover:text-teal-500 transition">
            <Bot className="w-5 h-5" /> AI Assistant
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="flex items-center gap-1 hover:text-green-600 transition relative">
            <ShoppingCart className="w-5 h-5" /> Cart
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <span className="text-sm text-gray-800">Hi, {user.name}</span>
              {user.role === 'vendor' && (
                <Link to="/vendor-dashboard" className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
                  <Store className="w-5 h-5" /> Dashboard
                </Link>
              )}
              <button onClick={logout} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 border-l pl-4 border-gray-200">
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
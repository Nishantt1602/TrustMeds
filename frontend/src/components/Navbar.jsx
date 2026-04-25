import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Pill, Search, Bot, LogOut, ShoppingCart, User, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchQuery.trim()));
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const showSearch = location.pathname !== '/';
  const localUser = user || JSON.parse(localStorage.getItem('userInfo'));

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-xl md:text-2xl shrink-0">
            <Pill className="w-8 h-8" />
            <span>TrustMeds</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 text-gray-600 font-medium">
            <Link to="/chat" className="flex items-center gap-1 hover:text-teal-500 transition">
              <Bot className="w-5 h-5" /> AI Assistant
            </Link>

            {(!user || user.role === 'patient') && (
              <Link to="/cart" className="flex items-center gap-1 transition relative text-green-600 hover:text-green-700">
                <ShoppingCart className="w-5 h-5" /> Cart
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {!user ? (
              <div className="flex gap-3 border-l pl-4 border-gray-200">
                <Link to="/login" className="px-5 py-2 text-green-600 font-bold hover:bg-green-50 rounded-xl transition">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition">Sign Up</Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                 <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                       {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-900">My Hub</span>
                 </Link>
                 <button 
                  onClick={logout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/chat" className="text-teal-600">
              <Bot className="w-6 h-6" />
            </Link>
             {(!user || user.role === 'patient') && (
                <Link to="/cart" className="relative text-green-600">
                  <ShoppingCart className="w-6 h-6" />
                  {cart?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </Link>
             )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Link onClick={() => setIsMenuOpen(false)} to="/chat" className="flex items-center gap-3 p-4 bg-teal-50 text-teal-700 rounded-2xl font-bold">
                <Bot className="w-6 h-6" /> AI Assistant
              </Link>
            </div>

            {user ? (
               <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Link onClick={() => setIsMenuOpen(false)} to="/" className="flex items-center gap-3 p-4 bg-gray-50 text-gray-900 rounded-2xl font-bold">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span>Go to My Hub</span>
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-bold"
                  >
                    <LogOut size={20} /> Logout
                  </button>
               </div>
            ) : (
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <Link onClick={() => setIsMenuOpen(false)} to="/login" className="w-full p-4 text-center text-green-600 font-bold bg-green-50 rounded-2xl">Login</Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/register" className="w-full p-4 text-center text-white font-bold bg-green-600 rounded-2xl shadow-lg shadow-green-100">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
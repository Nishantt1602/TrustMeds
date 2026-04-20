import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Pill, Search, Bot, LogOut, Store, ShoppingCart, User, Stethoscope, Calendar, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchQuery.trim()));
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const localUser = user || JSON.parse(localStorage.getItem('userInfo'));

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={localUser ? "/search" : "/"} className="flex items-center gap-2 text-green-600 font-bold text-xl md:text-2xl shrink-0">
            <Pill className="w-8 h-8" />
            <span>TrustMeds</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 text-gray-600 font-medium">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="border border-gray-300 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-40 xl:w-64 transition-all"
              />
              <button type="submit" className="text-gray-400 hover:text-green-600 transition">
                <Search className="w-5 h-5" />
              </button>
            </form>
            
            <Link to="/chat" className="flex items-center gap-1 hover:text-teal-500 transition">
              <Bot className="w-5 h-5" /> AI Assistant
            </Link>

            {(!localUser || localUser.role === 'patient') && (
              <Link to="/doctors" className="flex items-center gap-1 hover:text-blue-500 transition">
                <Stethoscope className="w-5 h-5" /> Find Doctors
              </Link>
            )}

            {localUser?.role === 'patient' && (
              <Link to="/cart" className="flex items-center gap-1 transition relative text-green-600 hover:text-green-700">
                <ShoppingCart className="w-5 h-5" /> Cart
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {(localUser?.role === 'patient' || localUser?.role === 'doctor') && (
              <Link to="/my-appointments" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition">
                <Calendar className="w-5 h-5" /> Appointments
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                    user.role === 'vendor' ? 'bg-orange-100 text-orange-700' : 
                    user.role === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                {user.role === 'vendor' && (
                  <Link to="/vendor-dashboard" className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition">
                    <Store className="w-5 h-5" />
                  </Link>
                )}
                {user.role === 'doctor' && (
                  <Link to="/doctor-dashboard" className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition">
                    <Stethoscope className="w-5 h-5" />
                  </Link>
                )}
                <Link to="/profile" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 border-l pl-4 border-gray-200">
                <Link to="/login" className="px-5 py-2 text-green-600 font-bold hover:bg-green-50 rounded-xl transition">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
             {localUser?.role === 'patient' && (
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
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500"
              />
            </form>

            <div className="grid grid-cols-1 gap-2">
              <Link onClick={() => setIsMenuOpen(false)} to="/chat" className="flex items-center gap-3 p-4 bg-teal-50 text-teal-700 rounded-2xl font-bold">
                <Bot className="w-6 h-6" /> AI Assistant
              </Link>

              {(!localUser || localUser.role === 'patient') && (
                <Link onClick={() => setIsMenuOpen(false)} to="/doctors" className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold">
                  <Stethoscope className="w-6 h-6" /> Find Doctors
                </Link>
              )}

              {(localUser?.role === 'patient' || localUser?.role === 'doctor') && (
                <Link onClick={() => setIsMenuOpen(false)} to="/my-appointments" className="flex items-center gap-3 p-4 bg-slate-50 text-slate-700 rounded-2xl font-bold">
                  <Calendar className="w-6 h-6" /> My Appointments
                </Link>
              )}
            </div>

            {user ? (
               <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-bold text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-xl font-bold">
                      <User size={18} /> Profile
                    </Link>
                    {user.role === 'vendor' && (
                      <Link onClick={() => setIsMenuOpen(false)} to="/vendor-dashboard" className="flex items-center justify-center gap-2 p-3 bg-orange-100 text-orange-700 rounded-xl font-bold">
                        <Store size={18} /> Dashboard
                      </Link>
                    )}
                    {user.role === 'doctor' && (
                      <Link onClick={() => setIsMenuOpen(false)} to="/doctor-dashboard" className="flex items-center justify-center gap-2 p-3 bg-blue-100 text-blue-700 rounded-xl font-bold">
                        <Stethoscope size={18} /> Dashboard
                      </Link>
                    )}
                  </div>
                  
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
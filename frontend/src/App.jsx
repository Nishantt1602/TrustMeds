import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // NEW
import Navbar from './components/Navbar';
import SearchPage from './pages/Core/SearchPage';
import ChatbotPage from './pages/Core/ChatbotPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CartPage from './pages/Core/CartPage'; // NEW
import VendorDashboard from './pages/Dashboard/VendorDashboard'; // NEW
import DoctorDashboard from './pages/Dashboard/DoctorDashboard'; // NEW
import MyAppointments from './pages/Dashboard/MyAppointments'; // NEW
import UserProfile from './pages/Dashboard/UserProfile'; // NEW - Moved to src folder
import LandingPage from './pages/Core/LandingPage';
import DoctorSearch from './pages/Core/DoctorSearch'; // NEW
import ProtectedRoute from './components/routing/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={<ChatbotPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/my-appointments" element={
                  <ProtectedRoute>
                    <MyAppointments />
                  </ProtectedRoute>
                } />
                <Route path="/doctors" element={<DoctorSearch />} />
                <Route path="/profile" element={<UserProfile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
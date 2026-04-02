import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [storeData, setStoreData] = useState({ storeName: '', address: '', licenseNumber: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = formData.role === 'vendor' ? { ...formData, ...storeData } : formData;
      await API.post('/auth/register', payload);
      // Auto login after register
      await login(formData.email, formData.password);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Create an Account</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <label className="flex-1 border p-3 rounded-lg cursor-pointer text-center flex items-center gap-2 justify-center has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition">
              <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
              👨‍⚕️ I'm a Customer
            </label>
            <label className="flex-1 border p-3 rounded-lg cursor-pointer text-center flex items-center gap-2 justify-center has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition">
              <input type="radio" name="role" value="vendor" checked={formData.role === 'vendor'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
              🏪 I'm a Vendor
            </label>
          </div>

          <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
          <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
          <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
          <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />

          {formData.role === 'vendor' && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg space-y-4 mt-4">
              <h3 className="font-semibold text-orange-800">Store Details</h3>
              <input type="text" placeholder="Store Name" required value={storeData.storeName} onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-orange-500" />
              <input type="text" placeholder="Store Address" required value={storeData.address} onChange={(e) => setStoreData({ ...storeData, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-orange-500" />
              <input type="text" placeholder="License Number" required value={storeData.licenseNumber} onChange={(e) => setStoreData({ ...storeData, licenseNumber: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-orange-500" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-4">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
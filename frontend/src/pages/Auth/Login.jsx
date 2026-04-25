import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogIn, User, Store, Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('patient');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email, password, selectedRole);
    if (res.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(res.message);
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your TrustMeds account</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <label className={`border p-4 rounded-xl cursor-pointer text-center flex flex-row sm:flex-col items-center gap-3 justify-center transition-all ${
            selectedRole === 'patient' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <input type="radio" name="role" value="patient" checked={selectedRole === 'patient'} onChange={(e) => setSelectedRole(e.target.value)} className="hidden" />
            <User className="w-5 h-5" />
            <span className="text-sm font-bold">Patient</span>
          </label>
          <label className={`border p-4 rounded-xl cursor-pointer text-center flex flex-row sm:flex-col items-center gap-3 justify-center transition-all ${
            selectedRole === 'vendor' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <input type="radio" name="role" value="vendor" checked={selectedRole === 'vendor'} onChange={(e) => setSelectedRole(e.target.value)} className="hidden" />
            <Store className="w-5 h-5" />
            <span className="text-sm font-bold">Vendor</span>
          </label>
          <label className={`border p-4 rounded-xl cursor-pointer text-center flex flex-row sm:flex-col items-center gap-3 justify-center transition-all ${
            selectedRole === 'doctor' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <input type="radio" name="role" value="doctor" checked={selectedRole === 'doctor'} onChange={(e) => setSelectedRole(e.target.value)} className="hidden" />
            <Stethoscope className="w-5 h-5" />
            <span className="text-sm font-bold">Doctor</span>
          </label>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500"
              placeholder={selectedRole === 'patient' ? 'patient@example.com' : selectedRole === 'vendor' ? 'vendor@store.com' : 'doctor@clinic.com'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg transition flex justify-center items-center gap-2 font-semibold ${
              selectedRole === 'patient' ? 'bg-green-600 hover:bg-green-700' : selectedRole === 'vendor' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Signing in...' : `Sign In`}
          </button>
        </form>

        {/* Role-specific info */}
        <div className={`mt-6 p-4 rounded-lg text-sm ${
          selectedRole === 'patient' ? 'bg-green-50 border border-green-100' : selectedRole === 'vendor' ? 'bg-orange-50 border border-orange-100' : 'bg-blue-50 border border-blue-100'
        }`}>
          <p className={`font-medium mb-1 ${
            selectedRole === 'patient' ? 'text-green-800' : selectedRole === 'vendor' ? 'text-orange-800' : 'text-blue-800'
          }`}>
            {selectedRole === 'patient' ? '🤕 Patient Access' : selectedRole === 'vendor' ? '🏪 Vendor Access' : '👨‍⚕️ Doctor Access'}
          </p>
          <p className={`text-xs ${
            selectedRole === 'patient' ? 'text-green-600' : selectedRole === 'vendor' ? 'text-orange-600' : 'text-blue-600'
          }`}>
            {selectedRole === 'patient' 
              ? 'Search medicines, book appointments, and manage your health records.' 
              : selectedRole === 'vendor'
              ? 'Manage your store inventory, set prices, and track sales.'
              : 'Manage your consultation schedule, available slots, and professional profile.'}
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            * Your actual account type is determined during registration
          </p>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-green-600 hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
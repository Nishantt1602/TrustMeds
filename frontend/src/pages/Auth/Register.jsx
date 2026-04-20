import { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'patient';
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '', role: defaultRole });
  const [storeData, setStoreData] = useState({ storeName: '', licenseNumber: '' });
  const [doctorData, setDoctorData] = useState({ specialization: '', experienceYears: '', fees: '', qualifications: '', clinicAddress: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let payload = formData;
      if (formData.role === 'vendor') payload = { ...formData, ...storeData };
      if (formData.role === 'doctor') payload = { ...formData, ...doctorData };
      await API.post('/auth/register', payload);
      // Auto login after register
      await login(formData.email, formData.password, formData.role);
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
          <div className="grid grid-cols-3 gap-2 mb-4">
            <label className="border p-2 rounded-lg cursor-pointer text-center flex flex-col items-center gap-1 justify-center has-[:checked]:bg-green-50 has-[:checked]:border-green-500 transition">
              <input type="radio" name="role" value="patient" checked={formData.role === 'patient'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
              <span className="text-xl">🤕</span>
              <span className="text-xs font-medium">Patient</span>
            </label>
            <label className="border p-2 rounded-lg cursor-pointer text-center flex flex-col items-center gap-1 justify-center has-[:checked]:bg-green-50 has-[:checked]:border-green-500 transition">
              <input type="radio" name="role" value="vendor" checked={formData.role === 'vendor'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
              <span className="text-xl">🏪</span>
              <span className="text-xs font-medium">Vendor</span>
            </label>
            <label className="border p-2 rounded-lg cursor-pointer text-center flex flex-col items-center gap-1 justify-center has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition">
              <input type="radio" name="role" value="doctor" checked={formData.role === 'doctor'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
              <span className="text-xl">👨‍⚕️</span>
              <span className="text-xs font-medium">Doctor</span>
            </label>
          </div>

          <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500" />
          <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500" />
          <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500" />
          <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500" />
          <input type="text" placeholder="Address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-green-500" />

          {formData.role === 'vendor' && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg space-y-4 mt-4">
              <h3 className="font-semibold text-orange-800">Store Details</h3>
              <input type="text" placeholder="Store Name" required value={storeData.storeName} onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-orange-500" />
              <input type="text" placeholder="License Number" required value={storeData.licenseNumber} onChange={(e) => setStoreData({ ...storeData, licenseNumber: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-orange-500" />
            </div>
          )}

          {formData.role === 'doctor' && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4 mt-4">
              <h3 className="font-semibold text-blue-800">Doctor Professional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Specialization (e.g. Cardiologist)" required value={doctorData.specialization} onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
                <input type="number" placeholder="Experience (Years)" min="0" required value={doctorData.experienceYears} onChange={(e) => setDoctorData({ ...doctorData, experienceYears: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Consultation Fees (₹)" min="0" required value={doctorData.fees} onChange={(e) => setDoctorData({ ...doctorData, fees: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
                <input type="text" placeholder="Qualifications" required value={doctorData.qualifications} onChange={(e) => setDoctorData({ ...doctorData, qualifications: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
              </div>
              <input type="text" placeholder="Clinic/Hospital Address" required value={doctorData.clinicAddress} onChange={(e) => setDoctorData({ ...doctorData, clinicAddress: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold mt-4">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-green-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
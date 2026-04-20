import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, MapPin, Phone, Shield, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../services/api';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Sync form data with user context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/users/update', formData);
      setUser({ ...user, ...data });
      localStorage.setItem('userInfo', JSON.stringify({ ...user, ...data }));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Please login to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Profile */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 h-32 relative">
           <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <User className="w-12 h-12 text-green-600" />
           </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 flex justify-between items-start">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 font-medium capitalize">{user.role}</p>
           </div>
           <button 
             onClick={() => setIsEditing(!isEditing)}
             className="px-6 py-2 rounded-xl flex items-center gap-2 font-bold transition duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
           >
             {isEditing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
           </button>
        </div>

        <div className="px-8 pb-12">
           {isEditing ? (
             <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200 transition"
                   >
                     <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
                   </button>
                </div>
             </form>
           ) : (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-green-600"><Mail className="w-5 h-5" /></div>
                      <div>
                         <div className="text-xs text-gray-400 font-bold uppercase">Email Address</div>
                         <div className="text-gray-900 font-medium">{user.email}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-green-600"><Phone className="w-5 h-5" /></div>
                      <div>
                         <div className="text-xs text-gray-400 font-bold uppercase">Phone Number</div>
                         <div className="text-gray-900 font-medium">{user.phone || 'Not provided'}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 col-span-2">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-orange-600"><MapPin className="w-5 h-5" /></div>
                      <div>
                         <div className="text-xs text-gray-400 font-bold uppercase">Living Address</div>
                         <div className="text-gray-900 font-medium">{user.address}</div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-green-50 rounded-3xl flex items-center justify-between border border-green-100">
                   <div className="flex items-center gap-4">
                      <Shield className="w-8 h-8 text-green-600" />
                      <div>
                         <h4 className="font-bold text-gray-900">Security Check</h4>
                         <p className="text-gray-600 text-sm">Your account is verified and secure.</p>
                      </div>
                   </div>
                   <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase">Verified</span>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

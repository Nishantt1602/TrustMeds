import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Store, PlusCircle } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [masterMedicines, setMasterMedicines] = useState([]);
  const [formData, setFormData] = useState({ medicineId: '', price: '', stock: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMasterMedicines = async () => {
      try {
        const { data } = await API.get('/medicines/master');
        setMasterMedicines(data);
      } catch (err) {
        console.error("Failed to fetch medicines");
      }
    };
    fetchMasterMedicines();
  }, []);

  const handleAddInventory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/vendor/inventory', formData);
      alert('Inventory Updated Successfully!');
      setFormData({ medicineId: '', price: '', stock: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'vendor') {
    return <div className="text-center py-20 text-red-500 text-xl font-bold">Access Denied. Vendors Only.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Store className="w-10 h-10 text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Add/Update Inventory Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-blue-500" /> Update Store Inventory
          </h2>
          <form onSubmit={handleAddInventory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Medicine</label>
              <select required value={formData.medicineId} onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500">
                <option value="">-- Choose a medicine --</option>
                {masterMedicines.map(med => (
                  <option key={med._id} value={med._id}>{med.name} ({med.composition})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" required min="1" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
                <input type="number" required min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold transition">
              {loading ? 'Updating...' : 'Save to My Store'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">How it works</h3>
          <p className="text-blue-800 mb-4">
            Select a medicine from the master list, set your competitive price, and update your stock. 
            If your price is the cheapest, your store will be highlighted in green on the main search page!
          </p>
          <p className="text-sm text-blue-600 italic">
            * Note: If a medicine is not in the dropdown, contact platform admin to add it to the master dictionary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
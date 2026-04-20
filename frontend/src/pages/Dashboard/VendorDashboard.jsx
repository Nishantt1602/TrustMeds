import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { PlusCircle, ClipboardList, ShieldCheck } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [masterMedicines, setMasterMedicines] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ medicineId: '', price: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMasterMedicines = async () => {
      try {
        const { data } = await API.get('/medicines/master');
        setMasterMedicines(data);
      } catch (err) {
        console.error('Failed to fetch medicines', err);
      }
    };

    const fetchInventory = async () => {
      setInventoryLoading(true);
      try {
        const { data } = await API.get('/vendor/inventory');
        setInventory(data);
      } catch (err) {
        console.error('Failed to fetch vendor inventory', err);
        toast.error('Unable to load inventory right now');
      } finally {
        setInventoryLoading(false);
      }
    };

    fetchMasterMedicines();
    fetchInventory();
  }, []);

  const handleAddInventory = async (e) => {
    e.preventDefault();

    if (!formData.medicineId) {
      toast.error('Please choose a medicine');
      return;
    }
    if (parseFloat(formData.price) < 1) {
      toast.error('Price must be at least ₹1');
      return;
    }
    if (parseFloat(formData.stock) < 1) {
      toast.error('Stock must be at least 1 unit');
      return;
    }

    setLoading(true);
    try {
      await API.post('/vendor/inventory', {
        medicineId: formData.medicineId,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });
      toast.success('Medicine added to inventory!');
      setFormData({ medicineId: '', price: '', stock: '' });
      setShowForm(false);
      const { data } = await API.get('/vendor/inventory');
      setInventory(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  if (user?.role !== 'vendor') {
    return <div className="text-center py-20 text-red-500 text-xl font-bold">Access Denied. Vendors Only.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Vendor Hub</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">My Inventory</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Manage your medicines, stock and pricing from a clean dashboard. Add new items quickly and keep your store competitive.
          </p>
        </div>
        <button
          onClick={toggleForm}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3 font-semibold shadow-lg shadow-slate-200/30 hover:bg-slate-800 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Medicine
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-[28px] overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-semibold">Inventory</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">My Inventory</h2>
            <p className="mt-2 text-sm text-gray-600">{inventory.length} medicine{inventory.length === 1 ? '' : 's'} currently active in your store.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!showForm ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
            >
              Inventory
            </button>
            <button
              onClick={() => setShowForm(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${showForm ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
            >
              Add New Medicine
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-[0.18em] font-semibold">Inventory Snapshot</p>
                    <h3 className="text-xl font-semibold text-slate-900 mt-2">Stock overview</h3>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 border border-slate-200 text-slate-700 text-sm font-semibold">
                    {inventory.length} Items
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-3xl bg-white p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Products</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{inventory.length}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Lowest Price Item</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">₹{inventory.reduce((min, item) => item.price < min ? item.price : min, inventory[0]?.price ?? 0)}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Stock</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{inventory.reduce((sum, item) => sum + (item.stock || 0), 0)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 overflow-hidden">
                {inventoryLoading ? (
                  <div className="p-10 text-center text-slate-500">Loading inventory...</div>
                ) : inventory.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-lg font-semibold text-slate-900">No inventory added yet.</p>
                    <p className="mt-2 text-sm text-slate-600">Start by adding your first medicine to the store.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Medicine</th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Composition</th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Price</th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map((item) => (
                          <tr key={item._id} className="border-t border-slate-200 hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-slate-900">{item.medicineId?.name || 'Unknown'}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{item.medicineId?.composition || 'N/A'}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900">₹{item.price}</td>
                            <td className="px-6 py-4 text-slate-700">{item.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {showForm && (
                <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-orange-500 font-semibold">New Medicine</p>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">Add Medicine</h3>
                    </div>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleAddInventory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Medicine</label>
                      <select
                        required
                        value={formData.medicineId}
                        onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="">Choose a medicine</option>
                        {masterMedicines.map((med) => (
                          <option key={med._id} value={med._id}>
                            {med.name} — {med.composition}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Stock Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-3xl bg-orange-600 px-5 py-3 text-white font-semibold shadow-lg shadow-orange-200/50 hover:bg-orange-700 transition"
                    >
                      {loading ? 'Saving...' : 'Save Medicine'}
                    </button>
                  </form>
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 text-slate-900 font-semibold">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span>Vendor Notes</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>Keep the inventory updated weekly to stay competitive on the marketplace.</p>
                  <p>Use the “Add New Medicine” button to add stock quickly without leaving the page.</p>
                  <p>Prices can be updated by re-adding the same medicine with new values.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

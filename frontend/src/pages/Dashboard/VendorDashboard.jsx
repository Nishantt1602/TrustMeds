import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { PlusCircle, ClipboardList, ShieldCheck, TrendingUp, Package, IndianRupee } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [masterMedicines, setMasterMedicines] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ medicineId: '', price: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'analytics'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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
        toast.error('Unable to load inventory');
      } finally {
        setInventoryLoading(false);
      }
    };

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const { data } = await API.get('/orders/vendor');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMasterMedicines();
    fetchInventory();
    fetchOrders();
  }, []);

  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!formData.medicineId) return toast.error('Please choose a medicine');
    
    setLoading(true);
    try {
      await API.post('/vendor/inventory', {
        medicineId: formData.medicineId,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });
      toast.success('Inventory updated!');
      setFormData({ medicineId: '', price: '', stock: '' });
      setShowForm(false);
      const { data } = await API.get('/vendor/inventory');
      setInventory(data);
    } catch (error) {
      toast.error('Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      const { data } = await API.get('/orders/vendor');
      setOrders(data);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (user?.role !== 'vendor') {
    return <div className="text-center py-20 text-red-500 font-bold">Vendors Only.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-orange-500 font-bold">Vendor Hub</p>
          <h1 className="text-4xl font-black text-slate-900 mt-2">Dashboard</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Update Stock
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-orange-50 p-6 rounded-[32px] border border-white flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-white rounded-2xl shadow-sm"><Package className="text-orange-500" /></div>
          <div><p className="text-[10px] uppercase font-black text-gray-500">Active Items</p><h3 className="text-xl font-black">{inventory.length}</h3></div>
        </div>
        <div className="bg-blue-50 p-6 rounded-[32px] border border-white flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-white rounded-2xl shadow-sm"><ClipboardList className="text-blue-500" /></div>
          <div><p className="text-[10px] uppercase font-black text-gray-500">New Orders</p><h3 className="text-xl font-black">{orders.filter(o => o.status === 'Pending').length}</h3></div>
        </div>
        <div className="bg-green-50 p-6 rounded-[32px] border border-white flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-white rounded-2xl shadow-sm"><TrendingUp className="text-green-500" /></div>
          <div><p className="text-[10px] uppercase font-black text-gray-500">Total Revenue</p><h3 className="text-xl font-black">₹{orders.reduce((s, o) => o.status !== 'Cancelled' ? s + o.totalAmount : s, 0)}</h3></div>
        </div>
        <div className="bg-purple-50 p-6 rounded-[32px] border border-white flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-white rounded-2xl shadow-sm"><ShieldCheck className="text-purple-500" /></div>
          <div><p className="text-[10px] uppercase font-black text-gray-500">Status</p><h3 className="text-xl font-black">{user.isVerified ? 'Verified' : 'Pending'}</h3></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-[32px] overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('inventory')} className={`rounded-full px-6 py-2 text-sm font-bold ${activeTab === 'inventory' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Inventory</button>
            <button onClick={() => setActiveTab('orders')} className={`rounded-full px-6 py-2 text-sm font-bold ${activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Orders</button>
            <button onClick={() => setActiveTab('analytics')} className={`rounded-full px-6 py-2 text-sm font-bold ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>Analytics</button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Left Column */}
            <div>
              {activeTab === 'inventory' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Medicine</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Price</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold text-slate-900">{item.medicineId?.name}</td>
                          <td className="px-6 py-4 font-bold text-green-600">₹{item.price}</td>
                          <td className={`px-6 py-4 font-bold ${item.stock < 10 ? 'text-red-500' : 'text-slate-600'}`}>{item.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-black text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="bg-white border rounded-xl px-4 py-2 text-xs font-bold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-slate-600">{item.medicineName} x {item.quantity}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100">
                  <h3 className="text-2xl font-black text-indigo-900">Revenue Analysis</h3>
                  <p className="text-indigo-600 font-bold mt-2">Total Earnings: ₹{orders.reduce((s, o) => o.status !== 'Cancelled' ? s + o.totalAmount : s, 0)}</p>
                </div>
              )}
            </div>

            {/* Right Column (Form & Notes) */}
            <div className="space-y-6">
              {showForm && (
                <div className="p-6 bg-white border-2 border-orange-100 rounded-3xl shadow-xl">
                  <h3 className="text-xl font-black mb-4">Add Stock</h3>
                  <form onSubmit={handleAddInventory} className="space-y-4">
                    <select
                      className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold"
                      value={formData.medicineId}
                      onChange={(e) => setFormData({...formData, medicineId: e.target.value})}
                    >
                      <option value="">Select Medicine</option>
                      {masterMedicines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                    <input type="number" placeholder="Price" className="w-full bg-slate-50 p-4 rounded-2xl border-none" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})}/>
                    <input type="number" placeholder="Stock" className="w-full bg-slate-50 p-4 rounded-2xl border-none" value={formData.stock} onChange={(e)=>setFormData({...formData, stock: e.target.value})}/>
                    <button type="submit" className="w-full bg-orange-600 text-white p-4 rounded-2xl font-bold">Save Medicine</button>
                  </form>
                </div>
              )}

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <h4 className="font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600"/> Vendor Notes</h4>
                <div className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
                  <p>• Keep inventory updated for better sales.</p>
                  <p>• Update status of orders promptly.</p>
                  <p>• Verified vendors get higher visibility.</p>
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
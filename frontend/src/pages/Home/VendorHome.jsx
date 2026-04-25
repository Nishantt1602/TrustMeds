import { useState, useEffect, useContext } from 'react';
import { 
  Package, ShoppingCart, TrendingUp, DollarSign, Settings, 
  Bell, Search, Plus, ArrowUpRight, CheckCircle2, 
  Clock, AlertCircle, Trash2, PlusCircle, ShieldCheck, LogOut
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

const VendorHome = () => {
  const { user, logout } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [masterMedicines, setMasterMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'inventory', 'orders'
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ medicineId: '', price: '', stock: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, ordRes, masterRes] = await Promise.all([
          API.get('/vendor/inventory'),
          API.get('/orders/vendor'),
          API.get('/medicines/master')
        ]);
        setInventory(Array.isArray(invRes.data) ? invRes.data : []);
        setOrders(Array.isArray(ordRes.data) ? ordRes.data : []);
        setMasterMedicines(Array.isArray(masterRes.data) ? masterRes.data : []);
      } catch (err) {
        console.error('Vendor data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!formData.medicineId) return toast.error('Please choose a medicine');
    
    setSaving(true);
    try {
      await API.post('/vendor/inventory', {
        medicineId: formData.medicineId,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });
      toast.success('Inventory updated!');
      setFormData({ medicineId: '', price: '', stock: '' });
      setShowAddForm(false);
      const { data } = await API.get('/vendor/inventory');
      setInventory(data);
    } catch (error) {
      toast.error('Failed to update inventory');
    } finally {
      setSaving(false);
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

  const totalRevenue = orders.reduce((acc, curr) => curr.status !== 'Cancelled' ? acc + curr.totalAmount : acc, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStockItems = inventory.filter(i => i.stock < 20).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
       <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-20">
      {/* Dynamic Header */}
      <div className="bg-slate-950 border-b border-slate-800 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Verified Vendor Hub
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-white">Welcome back,<br /><span className="text-orange-500">{user?.name}</span></h1>
              <p className="text-slate-400 font-medium max-w-md">Real-time control over your pharmacy operations. Monitor stock levels and dispatch orders from one central hub.</p>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={() => setShowAddForm(true)}
                 className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition shadow-xl shadow-orange-900/20 flex items-center gap-2"
               >
                  <PlusCircle size={20} /> Update Stock
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           <div className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6"><Package size={24} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Stock Items</p>
              <h3 className="text-3xl font-black text-white mt-1">{inventory.length}</h3>
           </div>
           <div className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6"><ShoppingCart size={24} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Orders</p>
              <h3 className="text-3xl font-black text-white mt-1">{pendingOrders}</h3>
           </div>
           <div className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6"><TrendingUp size={24} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Revenue</p>
              <h3 className="text-3xl font-black text-white mt-1">₹{totalRevenue.toLocaleString()}</h3>
           </div>
           <div className="bg-orange-600 p-8 rounded-[2.5rem] shadow-xl shadow-orange-900/20 flex flex-col justify-between text-white">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Inventory Status</p>
              <h3 className="text-2xl font-black mt-2">{lowStockItems} Items Low</h3>
              <button onClick={() => setActiveTab('inventory')} className="text-xs font-black bg-white/20 hover:bg-white/30 py-3 rounded-xl transition mt-4">Restock Now</button>
           </div>
        </div>

        {/* Dynamic Navigation */}
        <div className="flex gap-4 mb-8">
           {['overview', 'inventory', 'orders'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                 activeTab === tab ? 'bg-white text-black shadow-xl' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             {activeTab === 'overview' && (
               <div className="space-y-8">
                  <div className="bg-slate-800/20 p-10 rounded-[2.5rem] border border-slate-800">
                     <h2 className="text-2xl font-black text-white mb-8">Business Analytics</h2>
                     <div className="space-y-6">
                        {inventory.slice(0, 5).map((item, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-sm font-bold">
                                 <span className="text-slate-300">{item.medicineId?.name}</span>
                                 <span className="text-slate-500">{item.stock} Units Left</span>
                              </div>
                              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${item.stock < 10 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(item.stock, 100)}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                   {/* Low Stock Alerts */}
                   <div className="bg-red-950/20 p-8 rounded-[2.5rem] border border-red-500/20">
                      <div className="flex justify-between items-center mb-6">
                         <h2 className="text-xl font-black text-red-500 flex items-center gap-2">
                           <AlertCircle size={20} /> Critical Low Stock
                         </h2>
                         <span className="text-[10px] font-black bg-red-500 text-white px-2 py-1 rounded-md uppercase">Action Required</span>
                      </div>
                      <div className="space-y-3">
                         {inventory.filter(i => i.stock < 10).length === 0 ? (
                           <p className="text-gray-500 text-sm italic">All stock levels are optimal.</p>
                         ) : inventory.filter(i => i.stock < 10).map((item, i) => (
                           <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                              <span className="font-bold text-slate-300">{item.medicineId?.name}</span>
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-black text-red-400">{item.stock} LEFT</span>
                                 <button onClick={() => { setFormData({ medicineId: item.medicineId?._id, price: item.price, stock: '' }); setShowAddForm(true); }} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-colors">Restock</button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Recent Orders Short List */}
                   <div className="bg-slate-800/20 p-8 rounded-[2.5rem] border border-slate-800">
                      <div className="flex justify-between items-center mb-6">
                         <h2 className="text-xl font-black text-white">Recent Orders</h2>
                         <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-orange-500">View All</button>
                      </div>
                      <div className="space-y-4">
                         {orders.slice(0, 3).map(order => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 font-black text-xs">#{order._id.slice(-4)}</div>
                                  <div>
                                     <p className="font-bold text-white text-sm">{order.patientId?.name || 'Customer'}</p>
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{order.status}</p>
                                  </div>
                               </div>
                               <span className="font-black text-white">₹{order.totalAmount}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

             {activeTab === 'inventory' && (
               <div className="bg-slate-800/20 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white">Inventory Management</h2>
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                       <input 
                         type="text" 
                         placeholder="Filter inventory..." 
                         className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 text-white"
                       />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-900">
                          <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Medicine</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Price (₹)</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Stock Level</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {inventory.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-800/40 transition">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 font-black">
                                  {item.medicineId?.name?.charAt(0)}
                                </div>
                                <span className="font-bold text-white">{item.medicineId?.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 font-black text-green-400">₹{item.price}</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${item.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <span className={`text-sm font-bold ${item.stock < 10 ? 'text-red-400' : 'text-slate-300'}`}>{item.stock} Units</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button className="text-slate-500 hover:text-white transition"><Settings size={18} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
             )}

             {activeTab === 'orders' && (
               <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="bg-slate-800/20 p-20 rounded-[2.5rem] border border-slate-800 text-center">
                       <ShoppingCart className="mx-auto text-slate-700 mb-4" size={48} />
                       <p className="text-slate-500 font-bold">No orders received yet.</p>
                    </div>
                  ) : orders.map(order => (
                    <div key={order._id} className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col md:flex-row justify-between gap-6 hover:border-orange-500/20 transition-all">
                       <div className="flex gap-6">
                          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl">
                             #{order._id.slice(-4).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-white">{order.patientId?.name || 'Customer'}</h4>
                             <p className="text-sm text-slate-500 font-bold mt-1">
                               {order.items.length} Items • ₹{order.totalAmount}
                             </p>
                             <div className="flex gap-2 mt-4">
                                {order.items.map((item, i) => (
                                  <span key={i} className="text-[10px] font-black bg-slate-800 px-3 py-1.5 rounded-xl text-slate-400 uppercase border border-slate-700">
                                    {item.medicineName} ×{item.quantity}
                                  </span>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end justify-between gap-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-black uppercase text-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                          >
                             <option value="Pending">Pending</option>
                             <option value="Confirmed">Confirmed</option>
                             <option value="Shipped">Shipped</option>
                             <option value="Delivered">Delivered</option>
                             <option value="Cancelled">Cancelled</option>
                          </select>
                          <div className="flex gap-3">
                             <button className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl transition text-slate-500"><Bell size={18} /></button>
                             <button className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl transition text-slate-500"><ArrowUpRight size={18} /></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>

          {/* Sidebar Panel */}
          <div className="space-y-8">
             <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                   <Settings size={20} className="text-slate-500" /> System Settings
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center group cursor-pointer hover:bg-slate-800 transition">
                      <div>
                         <p className="font-bold text-slate-300 group-hover:text-orange-500 transition-colors">Verification</p>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{user?.isVerified ? 'Verified' : 'Pending'}</p>
                      </div>
                      <ShieldCheck size={20} className={user?.isVerified ? 'text-green-500' : 'text-orange-500'} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative">
              <button 
                onClick={() => setShowAddForm(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                 <Trash2 size={24} />
              </button>
              <h2 className="text-3xl font-black text-white mb-2">Restock Catalog</h2>
              <p className="text-slate-500 font-medium mb-8">Update your store inventory levels or add new products.</p>
              
              <form onSubmit={handleAddInventory} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medicine Name</label>
                    <select
                       className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl font-bold outline-none focus:ring-1 focus:ring-orange-500 text-white"
                       value={formData.medicineId}
                       onChange={(e) => setFormData({...formData, medicineId: e.target.value})}
                    >
                       <option value="">Select a medicine...</option>
                       {masterMedicines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price (₹)</label>
                       <input 
                         type="number" 
                         placeholder="e.g. 150" 
                         className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl font-bold outline-none focus:ring-1 focus:ring-orange-500 text-white" 
                         value={formData.price} 
                         onChange={(e)=>setFormData({...formData, price: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</label>
                       <input 
                         type="number" 
                         placeholder="e.g. 50" 
                         className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl font-bold outline-none focus:ring-1 focus:ring-orange-500 text-white" 
                         value={formData.stock} 
                         onChange={(e)=>setFormData({...formData, stock: e.target.value})}
                       />
                    </div>
                 </div>
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="w-full bg-orange-600 hover:bg-orange-700 text-white p-5 rounded-3xl font-black text-lg transition-all shadow-xl shadow-orange-900/40 mt-4"
                 >
                   {saving ? 'Syncing...' : 'Save Stock Update'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default VendorHome;

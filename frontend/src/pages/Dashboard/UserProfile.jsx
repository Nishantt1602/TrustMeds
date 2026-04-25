import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, MapPin, Phone, Shield, Edit2, Save, X, Package, Heart, ShoppingCart, Clock, Trash2, Bell, FileText, Plus, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import ChatWindow from '../../components/Chat/ChatWindow';

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
   const [orders, setOrders] = useState([]);
   const [wishlist, setWishlist] = useState([]);
   const [prescriptions, setPrescriptions] = useState([]);
   const [conversations, setConversations] = useState([]);
   const location = useLocation();
   const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile'); // 'profile', 'orders', 'wishlist', 'health', 'chats'
   const [chattingWith, setChattingWith] = useState(null);
   const [newReminder, setNewReminder] = useState({ pillName: '', time: '', frequency: 'Daily' });

   const { addToCart } = useContext(CartContext);

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

   useEffect(() => {
      if (user && user.role === 'patient') {
         const fetchData = async () => {
            try {
               const [ordersRes, wishlistRes, presRes, convRes] = await Promise.all([
                  API.get('/orders/patient'),
                  API.get('/wishlist'),
                  API.get('/prescriptions/my'),
                  API.get('/chat/conversations')
               ]);
               setOrders(ordersRes.data);
               setWishlist(wishlistRes.data);
               setPrescriptions(presRes.data);
               setConversations(convRes.data);
            } catch (error) {
               console.error('Failed to fetch user data', error);
            }
         };
         fetchData();
      }
   }, [user]);

   const handleAddReminder = async (e) => {
      e.preventDefault();
      try {
         const { data } = await API.post('/users/reminders', newReminder);
         setUser({ ...user, medicationReminders: data });
         setNewReminder({ pillName: '', time: '', frequency: 'Daily' });
         toast.success('Reminder added!');
      } catch (error) {
         toast.error('Failed to add reminder');
      }
   };

   const handleDeleteReminder = async (id) => {
      try {
         const { data } = await API.delete(`/users/reminders/${id}`);
         setUser({ ...user, medicationReminders: data });
         toast.success('Reminder removed');
      } catch (error) {
         toast.error('Failed to remove');
      }
   };

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

   const handleRemoveFromWishlist = async (wishlistItemId) => {
      try {
         await API.delete(`/wishlist/${wishlistItemId}`);
         setWishlist(wishlist.filter(item => item._id !== wishlistItemId));
         toast.success('Removed from wishlist');
      } catch (err) {
         toast.error('Failed to remove item');
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

            <div className="border-b border-gray-100 flex px-8 overflow-x-auto">
               <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
               >
                  Account Details
               </button>
               {user.role === 'patient' && (
                  <>
                     <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-4 px-6 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'orders' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
                     >
                        Order History
                     </button>
                     <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`py-4 px-6 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'wishlist' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
                     >
                        My Wishlist
                     </button>
                     <button
                        onClick={() => setActiveTab('health')}
                        className={`py-4 px-6 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'health' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
                     >
                        Health Records
                     </button>
                     <button
                        onClick={() => setActiveTab('chats')}
                        className={`py-4 px-6 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'chats' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
                     >
                        Messages
                     </button>
                  </>
               )}
            </div>

            <div className="px-8 pb-12 pt-8">
               {activeTab === 'profile' ? (
                  isEditing ? (
                     <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                           <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                           <input
                              type="text"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                           />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                           <textarea
                              rows="3"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  )
               ) : activeTab === 'orders' ? (
                  <div className="space-y-6">
                     {orders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                           <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                           <p className="text-gray-500 font-medium">No orders found yet.</p>
                        </div>
                     ) : (
                        orders.map(order => (
                           <div key={order._id} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                       <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order ID</div>
                                       <div className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                 </div>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                       'bg-blue-100 text-blue-700'
                                    }`}>
                                    {order.status}
                                 </span>
                              </div>
                              <div className="space-y-2 mb-4">
                                 {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                       <span className="text-gray-600">{item.medicineName} x {item.quantity}</span>
                                       <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                 ))}
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                 <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleDateString()}
                                 </div>
                                 <div className="text-lg font-black text-green-600">₹{order.totalAmount}</div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               ) : activeTab === 'wishlist' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {wishlist.length === 0 ? (
                        <div className="col-span-2 text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                           <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                           <p className="text-gray-500 font-medium">Your wishlist is empty.</p>
                        </div>
                     ) : (
                        wishlist.map(item => (
                           <div key={item._id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group hover:border-green-200 transition">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition">
                                    <Heart className="w-6 h-6 fill-current" />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900">{item.medicineName}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{item.vendorName}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="text-right">
                                    <div className="text-sm font-black text-green-600">₹{item.price}</div>
                                    <button
                                       onClick={() => addToCart({
                                          inventoryId: item.inventoryId,
                                          medicineId: item.medicineId?._id || item.medicineId,
                                          medicineName: item.medicineName,
                                          storeName: item.vendorName,
                                          price: item.price
                                       })}
                                       className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition"
                                    >
                                       Add to Cart
                                    </button>
                                 </div>
                                 <button
                                    onClick={() => handleRemoveFromWishlist(item._id)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               ) : activeTab === 'chats' ? (
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                           <MessageCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Recent Chats</h3>
                     </div>
                     {conversations.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                           <p className="text-gray-400">No active conversations with doctors.</p>
                        </div>
                     ) : (
                        conversations.map((conv) => (
                           <div 
                              key={conv._id}
                              onClick={() => setChattingWith(conv)}
                              className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-200 transition group"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                                    {conv.name?.[0] || 'D'}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition truncate">{conv.name}</h4>
                                    <p className="text-sm text-gray-500 truncate italic">"{conv.lastMessage}"</p>
                                 </div>
                              </div>
                              <div className="text-right ml-4">
                                 <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(conv.createdAt).toLocaleDateString()}
                                 </span>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               ) : (
                  <div className="space-y-12">
                     {/* Medication Reminders Section */}
                     <section>
                        <div className="flex items-center gap-3 mb-6">
                           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <Bell className="w-5 h-5" />
                           </div>
                           <h3 className="text-xl font-bold text-gray-900">Medication Reminders</h3>
                        </div>

                        <form onSubmit={handleAddReminder} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                           <div className="md:col-span-1">
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Medicine Name</label>
                              <input
                                 type="text"
                                 required
                                 placeholder="e.g. Paracetamol"
                                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                 value={newReminder.pillName}
                                 onChange={(e) => setNewReminder({ ...newReminder, pillName: e.target.value })}
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time</label>
                              <input
                                 type="time"
                                 required
                                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                 value={newReminder.time}
                                 onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Frequency</label>
                              <select
                                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                 value={newReminder.frequency}
                                 onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                              >
                                 <option>Daily</option>
                                 <option>Weekly</option>
                                 <option>As needed</option>
                              </select>
                           </div>
                           <div className="flex items-end">
                              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                                 <Plus className="w-4 h-4" /> Add
                              </button>
                           </div>
                        </form>

                        <div className="space-y-4">
                           {user.medicationReminders?.length === 0 ? (
                              <p className="text-gray-400 italic text-center py-6">No active reminders.</p>
                           ) : (
                              user.medicationReminders?.map((rem) => (
                                 <div key={rem._id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                          <Clock className="w-5 h-5" />
                                       </div>
                                       <div>
                                          <h4 className="font-bold text-gray-900">{rem.pillName}</h4>
                                          <p className="text-sm text-gray-500">{rem.time} • {rem.frequency}</p>
                                       </div>
                                    </div>
                                    <button onClick={() => handleDeleteReminder(rem._id)} className="p-2 text-gray-300 hover:text-red-500 transition">
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              ))
                           )}
                        </div>
                     </section>

                     {/* Prescriptions Section */}
                     <section>
                        <div className="flex items-center gap-3 mb-6">
                           <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                              <FileText className="w-5 h-5" />
                           </div>
                           <h3 className="text-xl font-bold text-gray-900">Digital Prescriptions</h3>
                        </div>

                        <div className="space-y-4">
                           {prescriptions.length === 0 ? (
                              <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                 <p className="text-gray-400">No medical records found.</p>
                              </div>
                           ) : (
                              prescriptions.map((pres) => (
                                 <div key={pres._id} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                       <div>
                                          <h4 className="font-black text-gray-900 text-lg uppercase">Prescription #{pres._id.slice(-6).toUpperCase()}</h4>
                                          <p className="text-sm text-gray-500 font-bold">Issued by Dr. {pres.doctorId?.name || 'Unknown'}</p>
                                       </div>
                                       <span className="text-xs font-bold text-gray-400">{new Date(pres.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                                       <p className="text-sm text-gray-700 italic">"{pres.notes}"</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                       {pres.medications.map((med, idx) => (
                                          <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                                             {med.name} - {med.dosage} ({med.frequency})
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </section>
                  </div>
               )}
            </div>
         </div>

         {/* Chat Window Popup */}
         {chattingWith && (
            <ChatWindow 
               otherUser={chattingWith} 
               onClose={() => setChattingWith(null)} 
            />
         )}
      </div>
   );
};

export default UserProfile;
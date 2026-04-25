import { useState, useEffect, useContext } from 'react';
import { 
  User, Briefcase, DollarSign, Clock, MapPin, 
  Save, Plus, Trash2, Calendar, MessageCircle, 
  FilePlus, X, Activity, CheckCircle, ArrowUpRight,
  TrendingUp, Users, Star, Settings, Power, XCircle, ChevronRight, Home, LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import ChatWindow from '../../components/Chat/ChatWindow';

const DoctorHome = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'slots', 'settings'
  const [conversations, setConversations] = useState([]);
  const [chattingWith, setChattingWith] = useState(null);
  
  // Professional details form state
  const [details, setDetails] = useState({
    specialization: '',
    experienceYears: '',
    fees: '',
    qualifications: '',
    clinicAddress: '',
    homeVisitEnabled: false,
    homeVisitFees: ''
  });

  // Slots management state
  const [slotsData, setSlotsData] = useState([]);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '10:00' });

  // Duty status
  const [isOnDuty, setIsOnDuty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, apptRes, convRes] = await Promise.all([
          API.get('/doctor/profile'),
          API.get('/appointments/my-appointments'),
          API.get('/chat/conversations')
        ]);
        
        const data = profRes.data;
        setProfile(data);
        setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
        setConversations(Array.isArray(convRes.data) ? convRes.data : []);
        setIsOnDuty(data.isOnDuty);
        
        setDetails({
          specialization: data.specialization || '',
          experienceYears: data.experienceYears || '',
          fees: data.fees || '',
          qualifications: data.qualifications || '',
          clinicAddress: data.clinicAddress || '',
          homeVisitEnabled: data.homeVisitEnabled || false,
          homeVisitFees: data.homeVisitFees || ''
        });
        setSlotsData(data.availableSlots || []);
      } catch (err) {
        console.error('Doctor data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleDuty = async () => {
    try {
      const newStatus = !isOnDuty;
      await API.put('/doctor/update-details', { isOnDuty: newStatus });
      setIsOnDuty(newStatus);
      toast.success(newStatus ? "You are now ON DUTY" : "You are now OFF DUTY");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/doctor/update-details', details);
      setProfile(data);
      toast.success('Professional details updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const addSlot = async () => {
    const updatedSlots = [...slotsData];
    const dayIndex = updatedSlots.findIndex(s => s.day === newSlot.day);
    
    if (dayIndex > -1) {
      updatedSlots[dayIndex].slots.push({ startTime: newSlot.startTime, endTime: newSlot.endTime, isBooked: false });
    } else {
      updatedSlots.push({
        day: newSlot.day,
        slots: [{ startTime: newSlot.startTime, endTime: newSlot.endTime, isBooked: false }]
      });
    }

    try {
      const { data } = await API.put('/doctor/slots', { availableSlots: updatedSlots });
      setSlotsData(data.availableSlots);
      toast.success('Slot added successfully');
    } catch (err) {
      toast.error('Failed to add slot');
    }
  };

  const removeSlot = async (day, slotIndex) => {
    const updatedSlots = [...slotsData];
    const dayIndex = updatedSlots.findIndex(s => s.day === day);
    
    if (dayIndex > -1) {
      updatedSlots[dayIndex].slots.splice(slotIndex, 1);
      if (updatedSlots[dayIndex].slots.length === 0) {
        updatedSlots.splice(dayIndex, 1);
      }
    }

    try {
      const { data } = await API.put('/doctor/slots', { availableSlots: updatedSlots });
      setSlotsData(data.availableSlots);
      toast.success('Slot removed');
    } catch (err) {
      toast.error('Failed to remove slot');
    }
  };

  const handleAppointmentAction = async (apptId, status) => {
    try {
      // Logic for accepting/declining appointments
      toast.success(`Appointment ${status}`);
      const { data } = await API.get('/appointments/my-appointments');
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to update appointment');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-200">
                  {profile?.name?.charAt(0)}
                </div>
                <button 
                  onClick={toggleDuty}
                  className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${isOnDuty ? 'bg-green-500 text-white' : 'bg-slate-400 text-white hover:bg-slate-500'}`}
                >
                   <Power size={18} />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-slate-900">Dr. {profile?.name}</h1>
                  <CheckCircle className="text-blue-500" size={24} />
                </div>
                <p className="text-slate-500 font-bold mt-1 text-lg">{profile?.specialization} • {profile?.qualifications}</p>
                <div className="flex items-center gap-4 mt-3">
                   <span className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${isOnDuty ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isOnDuty ? 'Online / Accepting' : 'Offline / Away'}
                   </span>
                   <span className="text-slate-400 font-bold text-sm flex items-center gap-1">
                      <MapPin size={14} /> {profile?.clinicAddress || 'Clinic Address Not Set'}
                   </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinic Fees</p>
                  <p className="text-3xl font-black text-slate-900">₹{profile?.fees || 0}</p>
               </div>
               <div className="w-px h-12 bg-slate-200 mx-2"></div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Visit</p>
                  <p className="text-3xl font-black text-green-600">₹{profile?.homeVisitFees || 'N/A'}</p>
               </div>
            </div>
          </div>
          
          <div className="flex gap-8 mt-10">
             {['overview', 'slots', 'settings'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-4 px-2 font-black text-sm uppercase tracking-widest transition-all relative ${
                   activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {tab}
                 {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <Users className="text-blue-500 mb-4" size={24} />
                    <h3 className="text-3xl font-black text-slate-900">{appointments.length}</h3>
                    <p className="text-sm font-bold text-slate-500">Total Consults</p>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <TrendingUp className="text-green-500 mb-4" size={24} />
                    <h3 className="text-3xl font-black text-slate-900">₹{(appointments.length * (profile?.fees || 0)).toLocaleString()}</h3>
                    <p className="text-sm font-bold text-slate-500">Revenue</p>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <Star className="text-orange-500 mb-4" size={24} />
                    <h3 className="text-3xl font-black text-slate-900">4.9</h3>
                    <p className="text-sm font-bold text-slate-500">Patient Rating</p>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-900">Live Appointment Queue</h2>
                  <Link to="/my-appointments" className="text-blue-600 font-bold hover:underline">View Schedule</Link>
                </div>
                <div className="divide-y divide-slate-50">
                  {appointments.length === 0 ? (
                    <div className="p-20 text-center text-slate-400 font-bold italic">No patients in queue.</div>
                  ) : appointments.slice(0, 5).map((appt) => (
                    <div key={appt._id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 text-xl font-black uppercase">
                            {appt.patientId?.name?.charAt(0)}
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="font-black text-slate-900 text-lg">{appt.patientId?.name}</h4>
                               {appt.bookingType === 'Home Visit' && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Home Visit</span>}
                            </div>
                            <p className="text-sm font-bold text-slate-400">{appt.reason || 'General Consultation'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className="text-sm font-black text-slate-900">{appt.startTime}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{appt.day}</p>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleAppointmentAction(appt._id, 'confirmed')} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><CheckCircle size={18} /></button>
                            <button onClick={() => handleAppointmentAction(appt._id, 'cancelled')} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={18} /></button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                 <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <MessageCircle className="text-blue-400" /> Recent Consults
                 </h3>
                 <div className="space-y-4">
                    {conversations.slice(0, 3).map(conv => (
                      <div key={conv._id} onClick={() => setChattingWith(conv)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                         <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold group-hover:text-blue-400 transition-colors">{conv.name}</h4>
                            <span className="text-[10px] text-slate-500">{new Date(conv.createdAt).toLocaleDateString()}</span>
                         </div>
                         <p className="text-xs text-slate-400 truncate italic">"{conv.lastMessage}"</p>
                      </div>
                    ))}
                    {conversations.length === 0 && <p className="text-slate-500 text-center py-4 italic text-sm">No active chats.</p>}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                 <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Activity className="text-green-500" /> Quick Actions
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab('slots')} className="p-4 bg-blue-50 rounded-2xl text-blue-700 font-bold text-center hover:bg-blue-100 transition">Manage Slots</button>
                    <button onClick={() => setActiveTab('settings')} className="p-4 bg-slate-50 rounded-2xl text-slate-700 font-bold text-center hover:bg-slate-100 transition">Profile Edit</button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slots' && (
          <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                    <Clock className="text-blue-500" /> Your Availability
                  </h2>
                  <div className="space-y-6">
                    {slotsData.length === 0 ? (
                      <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                         <p className="text-slate-400 font-bold">No availability slots defined.</p>
                      </div>
                    ) : slotsData.map((dayObj, dIdx) => (
                      <div key={dIdx} className="bg-slate-50 p-6 rounded-[2rem]">
                        <h3 className="font-black text-slate-800 mb-4 uppercase tracking-widest text-xs">{dayObj.day}</h3>
                        <div className="flex flex-wrap gap-3">
                          {dayObj.slots.map((slot, sIdx) => (
                            <div key={sIdx} className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm group">
                              <span className="text-sm font-black text-slate-700">{slot.startTime} - {slot.endTime}</span>
                              <button onClick={() => removeSlot(dayObj.day, sIdx)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl h-fit">
                <h3 className="text-xl font-black mb-8">Add Availability</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Day</label>
                    <select 
                      value={newSlot.day}
                      onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <option key={day} value={day} className="text-slate-900">{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
                      <input 
                        type="time" 
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time</label>
                      <input 
                        type="time" 
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={addSlot}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl mt-4 transition-all shadow-xl shadow-blue-500/20"
                  >
                    Save Slot
                  </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto">
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
                  <Settings className="text-slate-400" /> Profile Settings
                </h2>
                <form onSubmit={handleUpdateDetails} className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Specialization</label>
                         <input type="text" value={details.specialization} onChange={(e) => setDetails({ ...details, specialization: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-bold" required />
                      </div>
                      <div className="space-y-3">
                         <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Experience (Years)</label>
                         <input type="number" value={details.experienceYears} onChange={(e) => setDetails({ ...details, experienceYears: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-bold" required />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Standard Fees (₹)</label>
                         <input type="number" value={details.fees} onChange={(e) => setDetails({ ...details, fees: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-bold" required />
                      </div>
                      <div className="space-y-3">
                         <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Qualifications</label>
                         <input type="text" value={details.qualifications} onChange={(e) => setDetails({ ...details, qualifications: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-bold" required />
                      </div>
                   </div>

                   <div className="p-8 bg-green-50 rounded-[2.5rem] border border-green-100 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Home className="text-green-600" size={24} />
                            <div>
                               <h4 className="font-black text-green-900">Home Visit Services</h4>
                               <p className="text-xs font-bold text-green-600">Enable patients to book home consults</p>
                            </div>
                         </div>
                         <button type="button" onClick={() => setDetails({...details, homeVisitEnabled: !details.homeVisitEnabled})} className={`w-12 h-6 rounded-full transition-colors relative ${details.homeVisitEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${details.homeVisitEnabled ? 'left-7' : 'left-1'}`}></div>
                         </button>
                      </div>
                      {details.homeVisitEnabled && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                           <label className="text-[10px] font-black text-green-700 uppercase tracking-widest">Home Visit Surcharge (₹)</label>
                           <input type="number" value={details.homeVisitFees} onChange={(e) => setDetails({ ...details, homeVisitFees: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold" />
                        </div>
                      )}
                   </div>

                   <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Clinic Address</label>
                      <textarea value={details.clinicAddress} onChange={(e) => setDetails({ ...details, clinicAddress: e.target.value })} rows="3" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-bold" required />
                   </div>

                   <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3">
                     {saving ? 'Saving...' : 'Update Professional Profile'} <Save size={20} />
                   </button>
                </form>
             </div>
          </div>
        )}
      </div>

      {chattingWith && <ChatWindow otherUser={chattingWith} onClose={() => setChattingWith(null)} />}
    </div>
  );
};

export default DoctorHome;

import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { User, Briefcase, DollarSign, Clock, MapPin, Save, Plus, Trash2, Calendar, MessageCircle, FilePlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatWindow from '../../components/Chat/ChatWindow';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [chattingWith, setChattingWith] = useState(null);
  
  // Professional details form state
  const [details, setDetails] = useState({
    specialization: '',
    experienceYears: '',
    fees: '',
    qualifications: '',
    clinicAddress: ''
  });

  // Slots management state
  const [slotsData, setSlotsData] = useState([]);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '10:00' });

  // Prescription Modal State
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: 'Twice daily' }],
    notes: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/doctor/profile');
        setProfile(data);
        setDetails({
          specialization: data.specialization || '',
          experienceYears: data.experienceYears || '',
          fees: data.fees || '',
          qualifications: data.qualifications || '',
          clinicAddress: data.clinicAddress || ''
        });
        setSlotsData(data.availableSlots || []);
      } catch (err) {
        console.error('Failed to fetch doctor profile', err);
        toast.error('Unable to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'doctor') {
      fetchProfile();
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/chat/conversations');
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations');
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
      // Remove day if no slots left
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;

  if (user?.role !== 'doctor') {
    return <div className="text-center py-20 text-red-500 text-xl font-bold">Access Denied. Doctors Only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dr. {profile?.name}</h1>
            <p className="text-gray-500">{profile?.specialization || 'Professional Doctor'}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowPrescriptionModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <FilePlus size={18} />
            <span className="font-bold">Issue Prescription</span>
          </button>
          <Link to="/my-appointments" className="bg-slate-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200">
            <Calendar size={18} />
            <span className="font-bold">Appointments</span>
          </Link>
          <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center text-green-700 hidden sm:block">
            <p className="text-xs uppercase font-bold tracking-wider">Fees</p>
            <p className="text-xl font-bold">₹{profile?.fees || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Professional Details Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="text-blue-500" />
                Professional Details
              </h2>
            </div>
            <form onSubmit={handleUpdateDetails} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Specialization</label>
                <input 
                  type="text" 
                  value={details.specialization}
                  onChange={(e) => setDetails({ ...details, specialization: e.target.value })}
                  placeholder="e.g. Cardiologist"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Experience (Years)</label>
                <input 
                  type="number" 
                  value={details.experienceYears}
                  onChange={(e) => setDetails({ ...details, experienceYears: e.target.value })}
                  placeholder="e.g. 10"
                  min="0"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Consultation Fees (₹)</label>
                <input 
                  type="number" 
                  value={details.fees}
                  onChange={(e) => setDetails({ ...details, fees: e.target.value })}
                  placeholder="e.g. 500"
                  min="0"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Qualifications</label>
                <input 
                  type="text" 
                  value={details.qualifications}
                  onChange={(e) => setDetails({ ...details, qualifications: e.target.value })}
                  placeholder="e.g. MBBS, MD"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Clinic/Hospital Address</label>
                <textarea 
                  value={details.clinicAddress}
                  onChange={(e) => setDetails({ ...details, clinicAddress: e.target.value })}
                  placeholder="Street, City, State..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Slots View */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="text-orange-500" />
              Existing Availability
            </h2>
            {slotsData.length === 0 ? (
              <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">No available slots added yet. Set your schedule on the right.</p>
            ) : (
              <div className="space-y-6">
                {slotsData.map((dayObj, dIdx) => (
                  <div key={dIdx} className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="font-bold text-gray-800 mb-4">{dayObj.day}</h3>
                    <div className="flex flex-wrap gap-3">
                      {dayObj.slots.map((slot, sIdx) => (
                        <div key={sIdx} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm group">
                          <span className="text-sm font-medium text-gray-700">{slot.startTime} - {slot.endTime}</span>
                          <button 
                            onClick={() => removeSlot(dayObj.day, sIdx)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Add Slot */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-blue-400" />
              Add Availability
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Select Day</label>
                <select 
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all shadow-inner"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Start Time</label>
                  <input 
                    type="time" 
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">End Time</label>
                  <input 
                    type="time" 
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all shadow-inner"
                  />
                </div>
              </div>
              <button 
                onClick={addSlot}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-3xl mt-4 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Slot
              </button>
            </div>
          </div>

          {/* Recent Chats Section */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="text-blue-500" />
              Recent Conversations
            </h2>
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                No active chats yet.
              </p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div 
                    key={conv._id}
                    onClick={() => setChattingWith(conv)}
                    className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-blue-100 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{conv.name}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(conv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate italic">"{conv.lastMessage}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window Popup */}
      {chattingWith && (
        <ChatWindow 
          otherUser={chattingWith} 
          onClose={() => setChattingWith(null)} 
        />
      )}

      {/* Issue Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Issue New Prescription</h2>
                <p className="text-sm text-gray-500 mt-1">Provide medical advice and medication details.</p>
              </div>
              <button onClick={() => setShowPrescriptionModal(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700">Patient ID / Email</label>
                 <input 
                   type="text"
                   placeholder="Enter patient identifier..."
                   className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none"
                   value={prescriptionForm.patientId}
                   onChange={e => setPrescriptionForm({...prescriptionForm, patientId: e.target.value})}
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700">Diagnosis</label>
                 <textarea 
                   rows="2"
                   placeholder="Medical condition..."
                   className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none"
                   value={prescriptionForm.diagnosis}
                   onChange={e => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                 />
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700">Medicines</label>
                    <button 
                      onClick={() => setPrescriptionForm({...prescriptionForm, medicines: [...prescriptionForm.medicines, { name: '', dosage: '', frequency: 'Twice daily' }]})}
                      className="text-xs font-black text-blue-600 hover:text-blue-700 border-b-2 border-blue-100"
                    >
                      + Add Medicine
                    </button>
                  </div>
                  {prescriptionForm.medicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <input 
                        placeholder="Medicine Name"
                        className="bg-white px-3 py-2 rounded-xl text-sm border-gray-200 border"
                        value={med.name}
                        onChange={e => {
                          const newMeds = [...prescriptionForm.medicines];
                          newMeds[idx].name = e.target.value;
                          setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                        }}
                      />
                      <input 
                        placeholder="Dosage (e.g. 500mg)"
                        className="bg-white px-3 py-2 rounded-xl text-sm border-gray-200 border"
                        value={med.dosage}
                        onChange={e => {
                          const newMeds = [...prescriptionForm.medicines];
                          newMeds[idx].dosage = e.target.value;
                          setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                        }}
                      />
                      <select 
                        className="bg-white px-3 py-2 rounded-xl text-sm border-gray-200 border"
                        value={med.frequency}
                        onChange={e => {
                          const newMeds = [...prescriptionForm.medicines];
                          newMeds[idx].frequency = e.target.value;
                          setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                        }}
                      >
                         <option>Once daily</option>
                         <option>Twice daily</option>
                         <option>Thrice daily</option>
                         <option>As needed</option>
                      </select>
                    </div>
                  ))}
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700">Additional Notes</label>
                 <textarea 
                   rows="3"
                   placeholder="Lifestyle advice or follow-up instructions..."
                   className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none"
                   value={prescriptionForm.notes}
                   onChange={e => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                 />
               </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button 
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await API.post('/prescriptions', prescriptionForm);
                    toast.success('Prescription issued successfully!');
                    setShowPrescriptionModal(false);
                    setPrescriptionForm({ patientId: '', diagnosis: '', medicines: [{ name: '', dosage: '', frequency: 'Twice daily' }], notes: '' });
                  } catch (err) {
                    toast.error('Failed to issue prescription');
                  }
                }}
                className="flex-[2] py-4 rounded-2xl font-black bg-blue-600 text-white shadow-xl shadow-blue-200 transition transform hover:-translate-y-1 active:scale-95"
              >
                Confirm & Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;

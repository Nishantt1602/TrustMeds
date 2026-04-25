import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Stethoscope, MapPin, Clock, Calendar, CheckCircle, ChevronRight, X, MessageSquare } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ChatWindow from '../../components/Chat/ChatWindow';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chattingWith, setChattingWith] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await API.get(`/public/doctors?q=${query}`);
      setDoctors(data);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(searchQuery);
  };

  const [bookingType, setBookingType] = useState('Clinic Visit');
  const [reason, setReason] = useState('General Consultation');

  const handleBookAppointment = async (day, slot) => {
    if (!user) {
      toast.error('Please login as a patient to book an appointment');
      return;
    }
    if (user.role !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }

    const totalFee = bookingType === 'Home Visit' 
      ? (selectedDoctor.fees + (selectedDoctor.homeVisitFees || 0)) 
      : selectedDoctor.fees;

    navigate('/appointment-checkout', {
      state: {
        doctor: selectedDoctor,
        day,
        slot,
        reason,
        bookingType,
        totalFee
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Stethoscope className="text-blue-600 w-10 h-10" />
          Find Trusted Doctors
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Book appointments with top-rated specialists in your area. Secure, fast, and convenient.
        </p>

        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm transition-all text-lg font-medium"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-200 active:scale-95">
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
           <button 
             type="button"
             onClick={() => fetchDoctors('')}
             className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-blue-500 hover:text-blue-500 transition shadow-sm"
           >
              All Specialists
           </button>
           <button 
             type="button"
             onClick={() => setDoctors(doctors.filter(d => d.homeVisitEnabled))}
             className="px-6 py-2 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-bold hover:bg-green-100 transition shadow-sm flex items-center gap-2"
           >
              <MapPin size={14} /> Available for Home Visit
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-gray-500 font-bold">Scanning Medical Network...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 text-xl font-black">No doctors found matching your criteria.</p>
          <button onClick={() => fetchDoctors()} className="text-blue-600 font-bold mt-4">Reset all filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:translate-y-[-8px] transition-all duration-500 group">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl font-black flex items-center justify-center text-blue-600 text-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                    {doctor.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-blue-100">
                        {doctor.specialization}
                     </div>
                     {doctor.homeVisitEnabled && (
                        <div className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1">
                           <MapPin size={10} /> Home Visit Available
                        </div>
                     )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Dr. {doctor.name}</h3>
                <p className="text-sm text-slate-500 font-bold mb-4 flex items-center gap-1 opacity-70">
                  {doctor.qualifications} • {doctor.experienceYears} Years Experience
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2 text-gray-500 text-sm font-medium leading-relaxed">
                    <MapPin className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                    <span>{doctor.clinicAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-widest mb-1">Consultation</span>
                    <span className="text-2xl font-black text-slate-900">₹{doctor.fees}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedDoctor(doctor)}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-slate-800 transition shadow-lg shadow-slate-100 flex items-center gap-2 group/btn"
                    >
                      Book
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setChattingWith(doctor)}
                      className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-50"
                    >
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] sm:rounded-[40px] max-w-4xl w-full shadow-2xl relative my-4 sm:my-0 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-8 top-8 text-gray-400 hover:text-slate-900 bg-gray-50 p-2 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-6 sm:p-10 md:p-12">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 sm:mb-10">
                <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-4xl font-black shrink-0 border-4 border-white shadow-xl">
                  {selectedDoctor.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-1">Dr. {selectedDoctor.name}</h2>
                  <p className="text-xl text-blue-600 font-bold mb-2">{selectedDoctor.specialization}</p>
                  <p className="text-gray-500 font-medium flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    {selectedDoctor.qualifications} • Verified Professional
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <MapPin className="text-blue-600" />
                    Visit Type & Reason
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setBookingType('Clinic Visit')}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${bookingType === 'Clinic Visit' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                      >
                        Clinic Visit
                      </button>
                      {selectedDoctor.homeVisitEnabled && (
                        <button 
                          onClick={() => setBookingType('Home Visit')}
                          className={`flex-1 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${bookingType === 'Home Visit' ? 'border-green-600 bg-green-50 text-green-600' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                        >
                          Home Visit
                        </button>
                      )}
                    </div>
                    
                    <textarea 
                      placeholder="Reason for visit (optional)..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
                      rows="2"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <Calendar className="text-blue-600" />
                    Select Time Slot
                  </h3>

                  {selectedDoctor.availableSlots?.length === 0 ? (
                    <div className="bg-orange-50 text-orange-700 p-6 rounded-3xl border border-orange-100 flex items-center gap-3">
                      <Clock />
                      <p className="font-bold">No slots available.</p>
                    </div>
                  ) : (
                    <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      {selectedDoctor.availableSlots.map((dayGroup, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">{dayGroup.day}</h4>
                          <div className="flex flex-wrap gap-2">
                            {dayGroup.slots.map((slot, sIdx) => (
                              <button
                                key={sIdx}
                                disabled={slot.isBooked || bookingLoading}
                                onClick={() => handleBookAppointment(dayGroup.day, slot)}
                                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all
                                  ${slot.isBooked 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600 hover:text-blue-600'
                                  }`}
                              >
                                {slot.startTime}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-10 bg-slate-900 text-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                        <MapPin className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Clinic Location</h4>
                        <p className="text-sm font-bold text-white/80">{selectedDoctor.clinicAddress}</p>
                      </div>
                    </div>
                    {bookingType === 'Home Visit' && (
                      <div className="flex items-center gap-3 bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Home Visit Requested</p>
                      </div>
                    )}
                  </div>

                  <div className="w-px h-16 bg-white/10 hidden md:block"></div>

                  <div className="text-center md:text-right space-y-1">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Fee: ₹{selectedDoctor.fees}</span>
                       {bookingType === 'Home Visit' && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">+ Visit Fee: ₹{selectedDoctor.homeVisitFees || 0}</span>}
                    </div>
                    <p className="text-5xl font-black text-white tracking-tighter">
                      ₹{bookingType === 'Home Visit' 
                        ? (selectedDoctor.fees + (selectedDoctor.homeVisitFees || 0)) 
                        : selectedDoctor.fees}
                    </p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Payable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {chattingWith && (
        <ChatWindow 
          otherUser={chattingWith} 
          onClose={() => setChattingWith(null)} 
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default DoctorSearch;

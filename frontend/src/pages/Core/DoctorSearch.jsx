import { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Stethoscope, MapPin, Clock, Calendar, CheckCircle, ChevronRight, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user } = useContext(AuthContext);

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

  const handleBookAppointment = async (day, slot) => {
    if (!user) {
      toast.error('Please login as a patient to book an appointment');
      return;
    }
    if (user.role !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }

    setBookingLoading(true);
    try {
      await API.post('/appointments/book', {
        doctorId: selectedDoctor._id,
        day: day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        reason: 'General Consultation'
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoctor(null);
      fetchDoctors(searchQuery); // Refresh to show slot as booked
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
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

        <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-xl">Searching for doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-xl font-medium">No doctors found matching your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-slate-100/50 overflow-hidden hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl font-bold flex items-center justify-center text-blue-600 text-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {doctor.name.charAt(0)}
                  </div>
                  <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100 uppercase tracking-wider">
                    {doctor.specialization}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">Dr. {doctor.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-1">
                  {doctor.qualifications} • {doctor.experienceYears} Years Exp.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <span>{doctor.clinicAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="text-slate-900">
                    <span className="text-sm font-medium text-gray-400 block uppercase tracking-tighter">Consultation</span>
                    <span className="text-2xl font-black">₹{doctor.fees}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition flex items-center gap-2 group/btn"
                  >
                    Book Now
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[40px] max-w-4xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-8 top-8 text-gray-400 hover:text-slate-900 bg-gray-50 p-2 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 mb-10">
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

              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 underline decoration-blue-200 underline-offset-8">
                  <Calendar className="text-blue-600" />
                  Available Appointment Slots
                </h3>

                {selectedDoctor.availableSlots?.length === 0 ? (
                  <div className="bg-orange-50 text-orange-700 p-6 rounded-3xl border border-orange-100 flex items-center gap-3">
                    <Clock />
                    <p className="font-bold">This doctor hasn't posted any available slots for this week.</p>
                  </div>
                ) : (
                  <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedDoctor.availableSlots.map((dayGroup, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                        <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest">{dayGroup.day}</h4>
                        <div className="flex flex-wrap gap-3">
                          {dayGroup.slots.map((slot, sIdx) => (
                            <button
                              key={sIdx}
                              disabled={slot.isBooked || bookingLoading}
                              onClick={() => handleBookAppointment(dayGroup.day, slot)}
                              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm flex items-center gap-2
                                ${slot.isBooked 
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                                  : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-50'
                                }`}
                            >
                              <Clock size={14} className={slot.isBooked ? 'text-gray-400' : 'text-blue-500'} />
                              {slot.startTime} - {slot.endTime}
                              {slot.isBooked && <span className="ml-1 text-[10px] uppercase font-black tracking-tighter">(Booked)</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-blue-50 rounded-[32px] border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <MapPin className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Clinic Location</h4>
                    <p className="text-gray-500 text-sm">{selectedDoctor.clinicAddress}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-1">Standard Fees</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{selectedDoctor.fees}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

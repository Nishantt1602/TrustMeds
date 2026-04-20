import { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, User, Stethoscope, AlertCircle, XCircle } from 'lucide-react';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/appointments/my-appointments');
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await API.put(`/appointments/cancel/${id}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 text-xl font-medium">Loading your appointments...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Appointments</h1>
          <p className="text-gray-500 font-medium">Manage your {user?.role === 'doctor' ? 'upcoming consultations' : 'medical visits'}</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="font-bold text-slate-800">{appointments.length} Total</span>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-xl shadow-slate-100 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Calendar size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Appointments Found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">You don't have any appointments scheduled at the moment.</p>
          {user?.role === 'patient' && (
            <a href="/doctors" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              <Stethoscope size={20} />
              Find a Doctor
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Date Column */}
              <div className={`p-8 md:w-48 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-50 
                ${apt.status === 'cancelled' ? 'bg-gray-50' : 'bg-blue-50/30'}`}>
                <span className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-1">{apt.day}</span>
                <span className="text-2xl font-black text-slate-900">{apt.startTime}</span>
                <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                  ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' : 
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                  {apt.status}
                </div>
              </div>

              {/* Info Column */}
              <div className="p-8 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                         {user?.role === 'doctor' ? 'Patient' : 'Consulting Specialist'}
                       </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                      {user?.role === 'doctor' ? (
                        <>
                          <User className="text-blue-500" />
                          {apt.patientId?.name}
                        </>
                      ) : (
                        <>
                          <Stethoscope className="text-blue-500" />
                          Dr. {apt.doctorId?.name}
                        </>
                      )}
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                      <div className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                        <Clock size={16} className="text-gray-400 mt-0.5" />
                        <span>{apt.startTime} - {apt.endTime}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <span>{user?.role === 'doctor' ? apt.patientId?.phone : apt.doctorId?.clinicAddress}</span>
                      </div>
                      <div className="col-span-2 flex items-start gap-3 text-sm text-gray-500 font-medium">
                        <AlertCircle size={16} className="text-gray-400 mt-0.5" />
                        <span>Reason: <span className="text-slate-900 font-bold">{apt.reason || 'General Checkup'}</span></span>
                      </div>
                    </div>
                  </div>

                  {apt.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancel(apt._id)}
                      className="bg-white border-2 border-red-100 text-red-500 p-4 rounded-2xl hover:bg-red-50 transition-all group shrink-0"
                      title="Cancel Appointment"
                    >
                      <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;

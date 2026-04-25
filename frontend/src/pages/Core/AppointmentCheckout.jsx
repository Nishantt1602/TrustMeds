import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, CreditCard, ShieldCheck, ArrowLeft, Stethoscope, MapPin } from 'lucide-react';

const AppointmentCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state || !state.doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Appointment Data Found</h2>
          <button onClick={() => navigate('/doctors')} className="text-blue-600 font-bold">Back to Doctors</button>
        </div>
      </div>
    );
  }

  const { doctor, day, slot, reason, bookingType, totalFee } = state;

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await API.post('/appointments/book', {
        doctorId: doctor._id,
        day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        reason,
        bookingType,
        totalFee
      });
      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold mb-6 sm:mb-8 hover:text-slate-900 transition">
          <ArrowLeft size={20} /> Back to Slots
        </button>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Summary Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-8">Appointment Summary</h2>
              
              <div className="flex items-center gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-50">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl sm:text-2xl font-black">
                  {doctor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Dr. {doctor.name}</h3>
                  <p className="text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest">{doctor.specialization}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="text-blue-500" size={18} />
                  <span className="font-bold text-sm sm:text-base">{day}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="text-orange-500" size={18} />
                  <span className="font-bold text-sm sm:text-base">{slot.startTime} - {slot.endTime}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="text-green-500" size={18} />
                  <span className="font-bold text-sm sm:text-base">{bookingType === 'Home Visit' ? 'Home Consultation' : 'Clinic Visit'}</span>
                </div>
              </div>

              {reason && (
                <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reason for Visit</p>
                  <p className="text-sm font-bold text-slate-700">{reason}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-600 text-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-blue-200">
               <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <ShieldCheck size={24} />
                  <span className="font-black uppercase tracking-widest text-[10px]">Secure Booking Guarantee</span>
               </div>
               <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">Your data is encrypted. You can cancel your appointment up to 2 hours before the scheduled time for a full refund.</p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-8">Secure Checkout</h2>

            <div className="space-y-6">
               <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-[1.5rem] sm:rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Standard Consultation</span>
                    <span className="text-white">₹{doctor.fees}</span>
                  </div>
                  {bookingType === 'Home Visit' && (
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Home Visit Surcharge</span>
                      <span className="text-green-400">+ ₹{doctor.homeVisitFees || 0}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-widest">Total Payable</span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-400">₹{totalFee}</span>
                  </div>
               </div>

               <div className="space-y-4 pt-2">
                  <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Select Payment Method</p>
                  <button className="w-full flex items-center justify-between p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl transition-all">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-blue-600" size={20} />
                      <span className="font-bold text-slate-900 text-sm">Card</span>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-blue-600"></div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="font-black text-blue-600 text-xs">UPI</div>
                      <span className="font-bold text-slate-900 text-sm">UPI Apps</span>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200"></div>
                  </button>
               </div>

               <button 
                onClick={handleConfirmBooking}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-2 flex items-center justify-center gap-3"
               >
                 {loading ? 'Processing...' : `Pay ₹${totalFee}`}
               </button>
               
               <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                 By clicking, you agree to our booking policy
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCheckout;

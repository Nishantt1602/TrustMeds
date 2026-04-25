import { useState, useEffect, useContext } from 'react';
import { Search, ShoppingBag, User, Calendar, MapPin, Clock, ArrowRight, Filter, ChevronRight, Activity, Pill, Heart, Home, CheckCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';

const PatientHome = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, docsRes, medsRes, healthRes] = await Promise.all([
          API.get('/appointments/my-appointments'),
          API.get('/public/doctors'),
          API.get('/medicines/master'),
          API.get('/health-records')
        ]);
        setAppointments(Array.isArray(apptsRes.data) ? apptsRes.data.slice(0, 5) : []);
        setFeaturedDoctors(Array.isArray(docsRes.data) ? docsRes.data.slice(0, 4) : []);
        setFeaturedMedicines(Array.isArray(medsRes.data) ? medsRes.data.slice(0, 6) : []);
        setHealthRecords(Array.isArray(healthRes.data) ? healthRes.data : []);
      } catch (err) {
        console.error('Error fetching patient home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search & Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 pt-12 pb-24 px-4 rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">Hello, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
              <p className="text-sm sm:text-base text-indigo-100 opacity-80">How are you feeling today?</p>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <Activity className="text-white" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-indigo-300 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-16 pr-6 py-5 bg-white border-none rounded-2xl text-lg font-medium text-gray-900 shadow-xl focus:ring-4 focus:ring-green-400/30 transition-all placeholder:text-gray-400"
              placeholder="Search medicines, doctors, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
               <button className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/20">
                  Search
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 space-y-12">
        {/* Health Insights & Quick Action Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/search" className="group bg-white p-8 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Pill size={120} className="text-green-600" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                    <ShoppingBag size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Buy Medicines</h2>
                  <p className="text-gray-500 font-medium max-w-[240px]">Compare prices and get home delivery from local stores.</p>
                </div>
                <div className="mt-8 flex items-center text-green-600 font-bold gap-2 group-hover:translate-x-2 transition-transform">
                  Explore Pharmacy <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            <Link to="/doctors" className="group bg-white p-8 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <User size={120} className="text-indigo-600" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                    <Heart size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Consult a Doctor</h2>
                  <p className="text-gray-500 font-medium max-w-[240px]">Book online appointments or request home visits.</p>
                </div>
                <div className="mt-8 flex items-center text-indigo-600 font-bold gap-2 group-hover:translate-x-2 transition-transform">
                  Find Specialist <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-10">
                <Activity size={160} />
             </div>
             <h3 className="text-2xl font-black mb-8">My Health Snapshot</h3>
             <div className="space-y-6">
                <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10">
                   <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Active Prescriptions</p>
                   <div className="flex justify-between items-end">
                      <span className="text-3xl font-black">
                        {healthRecords.filter(r => r.type === 'Prescription' && r.status === 'Active').length.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-green-400 flex items-center gap-1">Update today <CheckCircle size={12} /></span>
                   </div>
                </div>
                <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10">
                   <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Reports Pending</p>
                   <div className="flex justify-between items-end">
                      <span className="text-3xl font-black">
                        {healthRecords.filter(r => r.type === 'Lab Report' && r.status === 'Pending').length.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-orange-400">View History</span>
                   </div>
                </div>
                <div className="pt-4">
                   <p className="text-xs text-white/40 font-medium leading-relaxed italic">"Regular checkups reduce long-term health risks by up to 30%."</p>
                </div>
             </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Upcoming Appointments</h3>
              <p className="text-gray-500 font-medium">Your scheduled health consultations</p>
            </div>
            <Link to="/my-appointments" className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">No upcoming appointments</p>
              <Link to="/doctors" className="text-indigo-500 font-bold mt-2 inline-block">Book your first session</Link>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {appointments.map((appt) => (
                <div key={appt._id} className="min-w-[320px] bg-white p-6 rounded-[2.5rem] shadow-lg border border-gray-50 hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl uppercase">
                      {appt.doctorId?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">Dr. {appt.doctorId?.name || 'Expert'}</h4>
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{appt.doctorId?.specialization || 'General'}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={18} className="text-green-500" />
                      <span className="font-bold text-sm">{new Date(appt.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={18} className="text-orange-500" />
                      <span className="font-bold text-sm">{appt.slot}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={18} className="text-blue-500" />
                      <span className="font-bold text-sm truncate">{appt.bookingType === 'Home Visit' ? 'Home Visit' : 'Clinic Visit'}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Medicine Directory / Search Results */}
        <section className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Pill className="text-green-500" /> Medicine Store
              </h3>
              <p className="text-gray-500 font-medium">Browse our directory of medicines and pharmacies.</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-bold border border-green-100 flex items-center gap-2">
                  <Filter size={18} /> Filters
               </button>
            </div>
          </div>

          <div className="p-10">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-40 bg-gray-100 rounded-[2rem]"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(searchQuery ? featuredMedicines.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())) : featuredMedicines).map((med) => (
                  <Link to={`/search?q=${med.name}`} key={med._id} className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-green-500 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-black group-hover:bg-green-600 group-hover:text-white transition-colors">
                        {med.name.charAt(0)}
                      </div>
                      <span className="text-gray-300 group-hover:text-green-500 transition-colors">
                        <ArrowRight size={20} />
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-1">{med.name}</h4>
                    <p className="text-xs text-gray-500 font-bold mb-4 line-clamp-1">{med.composition || 'Standard Health Composition'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Click to see prices</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {!searchQuery && (
              <div className="mt-12 text-center">
                <Link to="/search" className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-slate-800 transition shadow-xl">
                  Explore Full Directory <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Doctors Preview Grid */}
        <section className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Top Rated Doctors</h3>
                <p className="text-gray-500 font-medium">Expert consultation from verified professionals</p>
              </div>
              <Link to="/doctors" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                See All Specialists <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDoctors.map((doc) => (
                <div key={doc._id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] mx-auto overflow-hidden border-4 border-white shadow-md">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    {doc.homeVisitEnabled && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                        <Home size={14} />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                     <h4 className="font-black text-gray-900 text-lg leading-tight">Dr. {doc.name}</h4>
                     <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1 mb-4">{doc.specialization}</p>
                     
                     <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-2xl mb-6">
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-400 uppercase">Fees</p>
                           <p className="text-sm font-black text-gray-900">₹{doc.fees}</p>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-400 uppercase">Exp</p>
                           <p className="text-sm font-black text-gray-900">{doc.experienceYears}Y+</p>
                        </div>
                     </div>

                     <Link to="/doctors" className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                        Book Appointment
                     </Link>
                  </div>
                </div>
              ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default PatientHome;

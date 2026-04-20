import { Link } from 'react-router-dom';
import { Pill, Shield, Clock, MapPin, ArrowRight, Star, Heart, Activity, Search } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-green-50 to-teal-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm animate-bounce">
                <Shield className="w-4 h-4 mr-2" /> Verified Medicines & Authentic Stores
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                Your Health, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 font-black">Simplified.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Search, compare, and order medicines from verified local pharmacies. Get expert advice and AI-powered health monitoring all in one place.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/search"
                  className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transform hover:-translate-y-1 transition duration-300 flex items-center gap-2"
                >
                  Find Medicines <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-50 transform hover:-translate-y-1 transition duration-300"
                >
                  Join as Partner
                </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                 <img 
                   src="https://images.unsplash.com/photo-1587854680352-936b22b91030?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                   alt="Modern Pharmacy" 
                   className="w-full h-auto rounded-2xl"
                 />
                 <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                         </div>
                       ))}
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">+5k</div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                       <Star className="w-4 h-4 fill-current" />
                       <span className="font-bold text-gray-900">4.9</span>
                       <span className="text-gray-500 text-xs">(2k+ reviews)</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 py-10">
            <div className="text-center px-6">
              <div className="text-3xl font-black text-green-600 mb-1">500+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pharmacies</div>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-black text-green-600 mb-1">10k+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Medicines</div>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-black text-green-600 mb-1">200+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Experts</div>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-black text-green-600 mb-1">24/7</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Health Care Made Effortless</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">We combine technology and trust to bring you the best healthcare services right at your fingertips.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-start gap-6 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Price Comparison</h3>
              <p className="text-gray-600 leading-relaxed">Search for any medicine and see real-time availability and prices across multiple verified stores in your area.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-start gap-6 group">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Health Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">Track your vitals and medication schedules. Get personalized health insights powered by our advanced AI analytics.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-start gap-6 group">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Instant Consult</h3>
              <p className="text-gray-600 leading-relaxed">Connect with verified health partners instantly for digital prescriptions and expert medical guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Promo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
             </div>
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                   <div className="text-blue-400 font-bold uppercase tracking-widest text-sm">Meet Your AI Health Partner</div>
                   <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">AI Assistant that knows your health needs.</h2>
                   <p className="text-gray-400 text-lg">Our intelligent chatbot can explain your prescriptions, check for drug interactions, and help you find alternatives based on composition.</p>
                   <Link to="/chat" className="inline-flex items-center gap-2 text-white font-bold bg-blue-600 px-8 py-4 rounded-xl hover:bg-blue-700 transition">
                      Try AI Assistant <ArrowRight className="w-5 h-5" />
                   </Link>
                </div>
                <div className="hidden lg:flex justify-end">
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-80 space-y-4">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <Activity className="w-6 h-6" />
                         </div>
                         <div className="text-white">
                            <div className="text-xs text-gray-400 font-medium">Heart Rate</div>
                            <div className="text-xl font-bold">72 BPM</div>
                         </div>
                      </div>
                      <div className="h-20 w-full bg-blue-500/10 rounded-xl relative overflow-hidden flex items-end">
                         {[40, 70, 45, 90, 65, 80, 50, 75, 40].map((h, i) => (
                           <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-400/50 mx-0.5 rounded-t-sm"></div>
                         ))}
                      </div>
                      <div className="text-white text-sm font-medium flex justify-between items-center group cursor-pointer">
                         <span>AI Analysis: Normal</span>
                         <Star className="w-4 h-4 text-blue-400 fill-blue-400 animate-pulse" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl">
              <Pill className="w-8 h-8 text-green-500" />
              <span>TrustMeds</span>
            </Link>
            <p className="text-sm leading-relaxed">Making healthcare accessible and transparent through technology and community-driven trust.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">For Users</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/search" className="hover:text-green-500 transition">Search Medicines</Link></li>
              <li><Link to="/chat" className="hover:text-green-500 transition">AI Assistant</Link></li>
              <li><Link to="/cart" className="hover:text-green-500 transition">My Cart</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Partners</h4>
             <ul className="space-y-4 text-sm">
               <li><Link to="/register?role=vendor" className="hover:text-green-500 transition">Pharmacy Registry</Link></li>
               <li><a href="#" className="hover:text-green-500 transition">Terms of Service</a></li>
               <li><a href="#" className="hover:text-green-500 transition">Privacy Policy</a></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-gray-800 text-center text-xs">
          © 2024 TrustMeds Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

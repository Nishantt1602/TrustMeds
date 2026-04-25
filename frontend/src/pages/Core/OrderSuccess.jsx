import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.order || {};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-green-500 to-teal-600 p-12 text-center text-white">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2">Order Confirmed!</h1>
          <p className="text-green-50 opacity-90 text-lg">Thank you for trusting TrustMeds. Your health is our priority.</p>
        </div>
        
        <div className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Summary</div>
              <div className="text-2xl font-black text-gray-900">₹{orderData.totalAmount || 0}</div>
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <Package className="w-4 h-4" /> {orderData.items?.length || 0} Items
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</div>
              <div className="text-2xl font-black text-gray-900">Today</div>
              <div className="text-sm text-gray-500 mt-2">By 8:00 PM</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">What happens next?</h3>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <p className="text-gray-600 text-sm">The pharmacy is verifying your order and preparing the items.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <p className="text-gray-600 text-sm">A delivery partner will be assigned to pick up your order once ready.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <p className="text-gray-600 text-sm">Track your live delivery status in your dashboard.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/profile"
              state={{ activeTab: 'orders' }}
              className="flex-1 bg-gray-900 text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              View My Orders <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/search"
              className="flex-1 bg-white text-gray-900 text-center py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

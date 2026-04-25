import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  Package,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [addressData, setAddressData] = useState({
    street: user?.address || '',
    city: '',
    pincode: '',
    phone: user?.phone || ''
  });

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = totalAmount > 500 ? 0 : 40;
  const grandTotal = totalAmount + shippingFee;

  const handlePlaceOrder = () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(async () => {
      try {
        // Group cart items by vendorId
        const vendorGroups = cart.reduce((groups, item) => {
          const key = item.vendorId;
          if (!groups[key]) groups[key] = [];
          groups[key].push(item);
          return groups;
        }, {});

        // Place an order for each vendor group
        const orderPromises = Object.entries(vendorGroups).map(([vendorId, items]) => {
          const vendorTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const vendorName = items[0].vendorName;

          const orderData = {
            vendorId,
            vendorName,
            items: items.map(item => ({
              medicineId: item.medicineId,
              medicineName: item.medicineName,
              inventoryId: item.inventoryId,
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: vendorTotal, // Simplified: each vendor gets their own total
            shippingAddress: `${addressData.street}, ${addressData.city} - ${addressData.pincode}`,
            paymentMethod,
            paymentStatus: 'paid'
          };
          return API.post('/orders', orderData);
        });

        const responses = await Promise.all(orderPromises);
        
        clearCart();
        toast.success('Payment Successful! Orders Placed.');
        navigate('/order-success', { state: { order: responses[0].data.order } }); // Show first order details
      } catch (err) {
        toast.error(err.response?.data?.message || 'Order failed');
      } finally {
        setIsProcessing(false);
        setShowPaymentModal(false);
      }
    }, 2500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <button onClick={() => navigate('/search')} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-bold transition hover:bg-green-700">
          Go Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Checkout Flow */}
        <div className="flex-1 space-y-8">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8 px-2 sm:px-4">
            {[
              { id: 1, label: 'Shipping', icon: <MapPin className="w-5 h-5" /> },
              { id: 2, label: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
              { id: 3, label: 'Review', icon: <ShieldCheck className="w-5 h-5" /> }
            ].map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 relative">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition duration-500 ${
                  step >= s.id ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : s.icon}
                </div>
                <span className={`text-[8px] sm:text-xs font-black uppercase tracking-widest ${step >= s.id ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {s.id < 3 && (
                  <div className={`hidden sm:block absolute top-5 sm:top-6 left-12 sm:left-16 w-12 sm:w-24 h-0.5 ${step > s.id ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] sm:rounded-[40px] shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12">
            
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <Truck className="text-green-600" /> Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">Street Address</label>
                    <input 
                      type="text" 
                      value={addressData.street}
                      onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                      placeholder="Flat No, Building Name, Area"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      value={addressData.city}
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                      placeholder="e.g. Mumbai"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">Pincode</label>
                    <input 
                      type="text" 
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                      placeholder="000000"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition outline-none"
                    />
                  </div>
                </div>
                <div className="pt-8">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!addressData.street || !addressData.city || !addressData.pincode}
                    className="w-full bg-green-600 text-white py-5 rounded-[20px] font-black text-xl hover:bg-green-700 transition shadow-xl shadow-green-900/10 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <CreditCard className="text-green-600" /> Secure Payment
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-3xl border-2 text-left transition ${
                      paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <CreditCard className={paymentMethod === 'card' ? 'text-green-600' : 'text-gray-400'} />
                      {paymentMethod === 'card' && <CheckCircle2 className="text-green-600 w-5 h-5" />}
                    </div>
                    <div className="font-black text-gray-900">Credit / Debit Card</div>
                    <div className="text-xs text-gray-500 mt-1 font-bold">Visa, Mastercard, RuPay</div>
                  </button>
                  
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-6 rounded-3xl border-2 text-left transition ${
                      paymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-[10px] font-black italic">UPI</div>
                      {paymentMethod === 'upi' && <CheckCircle2 className="text-green-600 w-5 h-5" />}
                    </div>
                    <div className="font-black text-gray-900">UPI / Net Banking</div>
                    <div className="text-xs text-gray-500 mt-1 font-bold">PhonePe, Google Pay, Bank Transfer</div>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-8 bg-gray-50 rounded-3xl space-y-4 border border-gray-100">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Card Number</label>
                      <input type="text" placeholder="#### #### #### ####" className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">CVC</label>
                        <input type="text" placeholder="###" className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-8">
                  <button onClick={() => setStep(1)} className="flex-1 px-8 py-5 rounded-[20px] font-black text-gray-500 hover:bg-gray-100 transition">Back</button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] bg-green-600 text-white py-5 rounded-[20px] font-black text-xl hover:bg-green-700 transition shadow-xl shadow-green-900/10 flex items-center justify-center gap-2"
                  >
                    Review Order <ChevronRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">Final Review</h2>
                  <p className="text-gray-500 font-bold">Please confirm your order details</p>
                </div>

                <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deliver To</div>
                      <div className="font-bold text-gray-900 lowercase">{addressData.street}, {addressData.city} - {addressData.pincode}</div>
                    </div>
                    <button onClick={() => setStep(1)} className="text-green-600 font-bold text-sm hover:underline">Edit</button>
                  </div>
                  <div className="flex justify-between items-start pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</div>
                      <div className="font-bold text-gray-900">{paymentMethod === 'card' ? 'Credit Card' : 'UPI/Net Banking'}</div>
                    </div>
                    <button onClick={() => setStep(2)} className="text-green-600 font-bold text-sm hover:underline">Edit</button>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-3">
                  <AlertCircle className="text-orange-500 w-5 h-5 shrink-0" />
                  <p className="text-xs text-orange-700 font-medium">
                    By clicking "Complete Purchase", you agree to our Terms of Service and Health Policies.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 px-8 py-5 rounded-[20px] font-black text-gray-500 hover:bg-gray-100 transition">Back</button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-[3] bg-green-600 text-white py-5 rounded-[20px] font-black text-xl hover:bg-green-700 transition shadow-xl shadow-green-900/10 flex items-center justify-center gap-2"
                  >
                    Complete Purchase
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-gray-900 text-white rounded-[40px] p-8 md:p-10 sticky top-12">
            <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-tight">Order Summary</h3>
            
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.inventoryId} className="flex gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-green-400 shrink-0">
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black truncate text-lg leading-tight">{item.medicineName}</div>
                    <div className="text-white/40 text-sm font-bold">Qty: {item.quantity} × ₹{item.price}</div>
                  </div>
                  <div className="font-black text-lg">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/10 pt-8">
              <div className="flex justify-between text-white/60 font-bold">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-white/60 font-bold">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between pt-4 text-3xl font-black">
                <span className="text-green-400">Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-green-400" />
              <div className="text-sm">
                <div className="text-white font-black">Secure Checkout</div>
                <div className="text-white/40 font-bold">S256 SSL Encryption</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-10 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
               <div className={`h-full bg-green-500 transition-all duration-1000 ${isProcessing ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            {!isProcessing ? (
               <>
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                   <CreditCard className="w-10 h-10 text-green-600" />
                 </div>
                 <h2 className="text-3xl font-black text-gray-900">Confirm Payment</h2>
                 <p className="text-gray-500 font-bold">Please click below to authorize the transaction of ₹{grandTotal}.</p>
                 <div className="flex flex-col gap-3">
                   <button 
                     onClick={confirmPayment}
                     className="bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition"
                   >
                     Pay Now
                   </button>
                   <button 
                     onClick={() => setShowPaymentModal(false)}
                     className="text-gray-400 font-bold hover:text-gray-600 transition"
                   >
                     Cancel
                   </button>
                 </div>
               </>
            ) : (
               <div className="py-10 space-y-6">
                 <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto" />
                 <h2 className="text-2xl font-black text-gray-900">Processing Payment</h2>
                 <p className="text-gray-500 font-bold">Please do not refresh the page or click back.</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

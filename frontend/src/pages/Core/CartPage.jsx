import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect vendors or show message
  if (user?.role === 'vendor') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-6">
            As a vendor, you can manage your store inventory instead of shopping.
          </p>
          <button
            onClick={() => navigate('/vendor-dashboard')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Go to Vendor Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order");
      return navigate('/login');
    }
    
    // Assuming all items in cart belong to the same vendor for this MVP iteration
    const vendorId = cart[0]?.vendorId; 
    const vendorName = cart[0]?.storeName;
    const items = cart.map(item => ({ 
      medicineId: item.medicineId, 
      medicineName: item.medicineName,
      inventoryId: item.inventoryId,
      quantity: item.quantity, 
      price: item.price 
    }));

    setLoading(true);
    try {
      const response = await API.post('/orders', { vendorId, vendorName, items, totalAmount });
      clearCart();
      navigate('/order-success', { state: { order: response.data.order } });
    } catch (error) {
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <button onClick={() => navigate('/search')} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Browse Medicines</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.inventoryId} className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{item.medicineName}</h3>
                <p className="text-sm text-gray-500">Sold by: {item.storeName}</p>
                <p className="text-green-600 font-semibold mt-1">₹{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xl font-bold text-gray-900">₹{item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.inventoryId)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-md">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div>
            <span className="text-gray-600">Total Amount</span>
            <p className="text-3xl font-extrabold text-green-600">₹{totalAmount}</p>
          </div>
          <button 
            onClick={() => navigate('/checkout')} 
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
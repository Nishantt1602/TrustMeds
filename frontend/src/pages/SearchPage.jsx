import { useState } from 'react';
import API from '../services/api';
import { Search, MapPin, Tag, CheckCircle } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/medicines/search?q=${query}`);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Find & Compare Medicines</h1>
        <p className="text-gray-600 text-lg mb-8">Compare prices across multiple stores to get the best deal.</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Paracetamol, Dolo 650..."
            className="flex-1 px-5 py-4 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-blue-500 shadow-sm text-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold text-lg"
          >
            <Search className="w-6 h-6" /> Search
          </button>
        </form>
      </div>

      {/* States */}
      {loading && <p className="text-center text-blue-600 font-medium">Searching across stores...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {/* Results */}
      <div className="space-y-8">
        {results.map((item) => (
          <div key={item.medicineInfo._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Medicine Info Header */}
            <div className="bg-blue-50 p-6 border-b border-blue-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{item.medicineInfo.name}</h2>
                <p className="text-sm text-gray-600 mt-1"><strong>Composition:</strong> {item.medicineInfo.composition}</p>
                <p className="text-sm text-gray-600"><strong>Uses:</strong> {item.medicineInfo.uses}</p>
              </div>
              <div className="text-right">
                <span className="block text-sm text-gray-500">Starting from</span>
                <span className="text-3xl font-extrabold text-green-600">₹{item.cheapestPrice}</span>
              </div>
            </div>

            {/* Store Listings */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Available at these stores:</h3>
              <div className="grid gap-4">
                {item.stores.map((store, index) => {
                  const isCheapest = index === 0; // Since backend sorts by price asc
                  return (
                    <div 
                      key={store.inventoryId} 
                      className={`flex justify-between items-center p-4 rounded-lg border-2 ${isCheapest ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-lg">{store.storeName}</h4>
                          {store.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" title="Verified Store" />}
                          {isCheapest && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">Cheapest</span>}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" /> {store.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block text-2xl font-bold text-gray-900">₹{store.price}</span>
                          <span className="text-xs text-gray-500">{store.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <button 
  onClick={() => addToCart({
    inventoryId: store.inventoryId,
    medicineId: item.medicineInfo._id,
    medicineName: item.medicineInfo.name,
    storeId: store.storeId, // Ensure your backend includes this in search response, or just pass it if available
    storeName: store.storeName,
    price: store.price
  })}
  disabled={store.stock === 0}
  className={`px-6 py-2 rounded-md font-medium transition ${store.stock > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
>
  Add to Cart
</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
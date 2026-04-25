import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Search, MapPin, Tag, CheckCircle, Store, User, Eye, X, Heart, Pill } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [allMedicines, setAllMedicines] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [userWishlist, setUserWishlist] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Fetch wishlist on user change
  useEffect(() => {
    if (user) {
      API.get('/wishlist').then(res => {
        // Store composite key of medicineId and vendorId
        setUserWishlist(res.data.map(item => `${item.medicineId?._id || item.medicineId}-${item.vendorId?._id || item.vendorId}`));
      }).catch(err => console.error('Failed to load wishlist'));
    } else {
      setUserWishlist([]);
    }
  }, [user]);

  // Handle URL query changes
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      fetchSearchResults(urlQuery);
    } else {
      setQuery('');
      setResults([]);
      loadAllMedicines();
    }
  }, [urlQuery]);

  const fetchSearchResults = async (searchQ) => {
    if (!searchQ) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/medicines/search?q=${searchQ}`);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/medicines/master');
      setAllMedicines(data);
    } catch (err) {
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };


  const handleMedicineClick = async (medicine) => {
    setSelectedMedicine(medicine);
    setLoadingDetails(true);
    try {
      const { data } = await API.get(`/medicines/search?q=${medicine.name}`);
      if (data.length > 0) {
        setMedicineDetails(data[0]);
      }
    } catch (err) {
      setError('Failed to load medicine details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddToWishlist = async (store, medicine) => {
    setWishlistItemId(store.inventoryId);

    try {
      const payload = {
        medicineId: medicine.medicineInfo._id,
        medicineName: medicine.medicineInfo.name,
        vendorId: store.vendorId,
        vendorName: store.vendorName,
        price: store.price,
        inventoryId: store.inventoryId,
      };

      const token = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')).token
        : null;

      if (!token) {
        toast.error('Please login to add to wishlist');
        return;
      }

      await API.post('/wishlist/add', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const compositeKey = `${medicine.medicineInfo._id}-${store.vendorId}`;
      if (!userWishlist.includes(compositeKey)) {
        setUserWishlist(prev => [...prev, compositeKey]);
      }
      toast.success('Added to Wishlist!');
    } catch (err) {
      console.error('Add to wishlist error:', err);
      toast.error(err.response?.data?.message || 'Failed to add to Wishlist.');
    } finally {
      setWishlistItemId(null);
    }
  };

  const closeDetails = () => {
    setSelectedMedicine(null);
    setMedicineDetails(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Role-specific Info */}
      <div className={`mb-8 p-4 rounded-lg border ${
        user?.role === 'vendor'
          ? 'bg-orange-50 border-orange-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          {user?.role === 'vendor' ? (
            <Store className="w-6 h-6 text-orange-600" />
          ) : (
            <User className="w-6 h-6 text-green-600" />
          )}
          <h1 className={`text-2xl font-bold ${
            user?.role === 'vendor' ? 'text-orange-800' : 'text-green-800'
          }`}>
            {user?.role === 'vendor' ? 'Medicine Inventory' : 'Medicine Store'}
          </h1>
        </div>
        <p className={`text-sm ${
          user?.role === 'vendor' ? 'text-orange-700' : 'text-green-700'
        }`}>
          {user?.role === 'vendor'
            ? 'Browse all medicines and check market prices.'
            : 'Browse our directory of medicines and pharmacies.'
          }
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="bg-white px-8 py-3 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
          <Pill className="text-green-600 w-6 h-6" />
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Verified Medicine Directory</h2>
        </div>
      </div>



      {/* States */}
      {loading && <p className="text-center text-green-600 font-medium">Loading medicines...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
          <div className="space-y-8">
            {results.map((item) => (
              <div key={item.medicineInfo._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Medicine Info Header */}
                <div className="bg-green-50 p-6 border-b border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{item.medicineInfo.name}</h2>
                    <p className="text-sm text-gray-600 mt-1"><strong>Composition:</strong> {item.medicineInfo.composition}</p>
                    <p className="text-sm text-gray-600"><strong>Uses:</strong> {item.medicineInfo.uses}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="block text-xs sm:text-sm text-gray-500">Starting from</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-green-600">₹{item.cheapestPrice}</span>
                  </div>
                </div>

                {/* Store Listings */}                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Available at these stores:</h3>
                  <div className="grid gap-4">
                    {item.stores.map((store, index) => {
                      const isCheapest = index === 0;
                      return (
                        <div
                          key={store.inventoryId}
                          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 rounded-2xl border-2 transition-all gap-4 ${isCheapest ? 'border-green-500 bg-green-50 shadow-md shadow-green-100' : 'border-gray-100 bg-gray-50'}`}
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-black text-gray-900 text-lg">{store.storeName}</h4>
                              {store.isVerified && <CheckCircle className="w-4 h-4 text-green-500" title="Verified Store" />}
                              {isCheapest && <span className="bg-green-500 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-black">Cheapest</span>}
                            </div>
                            <p className="text-sm text-gray-500 font-medium flex items-start gap-1.5 leading-tight">
                              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" /> 
                              <span className="line-clamp-1">{store.address}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 border-t sm:border-0 pt-4 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <p className="text-2xl font-black text-gray-900 leading-none mb-1">₹{store.price}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${store.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                {store.stock > 0 ? `${store.stock} units available` : 'Out of stock'}
                              </p>
                            </div>

                            {user && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => addToCart({
                                    inventoryId: store.inventoryId,
                                    medicineId: item.medicineInfo._id,
                                    medicineName: item.medicineInfo.name,
                                    storeName: store.storeName,
                                    vendorId: store.vendorId,
                                    vendorName: store.storeName,
                                    price: store.price
                                  })}
                                  disabled={store.stock <= 0}
                                  className={`px-6 py-2 rounded-md font-medium transition ${
                                    store.stock > 0
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-red-100 text-red-600 cursor-not-allowed border border-red-300'
                                  }`}
                                >
                                  {store.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                {(() => {
                                  const mId = item.medicineInfo?._id || 'unknown';
                                  const vId = store.vendorId || 'unknown';
                                  const compositeKey = `${mId}-${vId}`;
                                  const isWishlisted = (user?.wishlist || []).includes(compositeKey);
                                  return (
                                    <button
                                      onClick={() => handleAddToWishlist(store, item)}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${
                                        isWishlisted
                                          ? 'border-red-500 bg-red-50 text-red-600'
                                          : 'border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500'
                                      }`}
                                    >
                                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                                    </button>
                                  );
                                })()}
                              </div>
                            )}
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
      )}

      {/* All Medicines Grid */}
      {!query && allMedicines.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Available Medicines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMedicines.map((medicine) => (
              <div
                key={medicine._id}
                onClick={() => handleMedicineClick(medicine)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Composition:</strong> {medicine.composition}
                </p>
                <p className="text-sm text-gray-500">Click to see prices</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedMedicine.name}</h2>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {loadingDetails ? (
                <p className="text-center text-green-600">Loading price details...</p>
              ) : medicineDetails ? (
                <div>
                  {/* Medicine Info */}
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicine Information</h3>
                    <p className="text-sm text-gray-600"><strong>Composition:</strong> {medicineDetails.medicineInfo.composition}</p>
                    <p className="text-sm text-gray-600"><strong>Uses:</strong> {medicineDetails.medicineInfo.uses}</p>
                    <p className="text-sm text-gray-600"><strong>Side Effects:</strong> {medicineDetails.medicineInfo.sideEffects}</p>
                  </div>

                  {/* Price Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Comparison</h3>
                    <div className="text-center mb-4">
                      <span className="text-sm text-gray-500">Starting from</span>
                      <div className="text-4xl font-extrabold text-green-600">₹{medicineDetails.cheapestPrice}</div>
                    </div>

                    <div className="space-y-3">
                      {medicineDetails.stores.map((store, index) => {
                        const isCheapest = index === 0;
                        return (
                          <div
                            key={store.inventoryId}
                            className={`flex justify-between items-center p-4 rounded-lg border-2 ${isCheapest ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900">{store.storeName}</h4>
                                {store.isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {isCheapest && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">Cheapest</span>}
                              </div>
                              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" /> {store.address}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900">₹{store.price}</span>
                                <span className="text-xs text-gray-500">{store.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                              </div>

                              {user && (user.role === 'patient' || user.role === 'vendor') && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => addToCart({
                                      inventoryId: store.inventoryId,
                                      medicineId: medicineDetails.medicineInfo._id,
                                      medicineName: medicineDetails.medicineInfo.name,
                                      storeName: store.storeName,
                                      vendorId: store.vendorId,
                                      vendorName: store.storeName,
                                      price: store.price
                                    })}
                                    disabled={store.stock <= 0}
                                    className={`px-4 py-2 rounded-md font-medium transition ${
                                      store.stock > 0
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-red-100 text-red-600 cursor-not-allowed border border-red-300'
                                    }`}
                                  >
                                    {store.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                  </button>
                                  {(() => {
                                    const mId = medicineDetails.medicineInfo?._id || 'unknown';
                                    const vId = store.vendorId || 'unknown';
                                    const compositeKey = `${mId}-${vId}`;
                                    const isWishlisted = userWishlist.includes(compositeKey);
                                    return (
                                      <button
                                        onClick={() => handleAddToWishlist(store, medicineDetails)}
                                        disabled={wishlistItemId === store.inventoryId || isWishlisted}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition border ${
                                          isWishlisted
                                            ? 'border-red-500 bg-red-50 text-red-600 cursor-default'
                                            : wishlistItemId === store.inventoryId
                                              ? 'border-red-200 bg-red-100 text-red-600 cursor-not-allowed'
                                              : 'border-red-300 text-red-600 hover:bg-red-50'
                                        }`}
                                      >
                                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                                        {isWishlisted ? 'Wishlisted' : wishlistItemId === store.inventoryId ? 'Adding...' : 'Wishlist'}
                                      </button>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">Failed to load medicine details</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
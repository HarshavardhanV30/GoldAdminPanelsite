import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, User, Save, ChevronDown, Edit, Trash2, List 
} from 'lucide-react';

const VendorAddress = () => {
  const API_BASE_URL = 'https://goldbackend-production-0ed4.up.railway.app/vendoraddress';

  // State strictly matches the POST API payload
  const initialFormState = {
    vendor_id: '',
    shop_name: '',
    house_no: '',
    street: '',
    area: '',
    landmark: '',
    mandal: '',
    district: '',
    city: '',
    state: '',
    pincode: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [addresses, setAddresses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllAddresses();
  }, []);

  const fetchAllAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/all`);
      const data = await response.json();
      setAddresses(data); 
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const generatePreview = () => {
    const { house_no, street, area, landmark, mandal, city, district, state, pincode } = formData;
    const parts = [house_no, street, area, landmark, mandal, city, district, state, pincode].filter(part => part && part.trim() !== '');
    
    if (parts.length === 0) {
      return "The complete address will be shown here after you fill the details.";
    }
    return parts.join(', ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Payload formatted strictly using the state keys
    const payload = {
      ...formData,
      vendor_id: Number(formData.vendor_id)
    };

    try {
      const url = editId ? `${API_BASE_URL}/${editId}` : `${API_BASE_URL}/add`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage(editId ? 'Address updated successfully!' : 'Address added successfully!');
        setFormData(initialFormState);
        setEditId(null);
        fetchAllAddresses();
      } else {
        setMessage('Failed to save address.');
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setMessage('Error connecting to the server.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (address) => {
    setEditId(address.id || address._id); 
    setFormData({
      ...initialFormState,
      ...address 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('Address deleted successfully!');
        fetchAllAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      
      <div className="max-w-6xl mx-auto mb-6">
        <div className="text-sm text-slate-500 mb-4">
          Vendors &gt; Vendor Addresses &gt; <span className="text-slate-800 font-medium">{editId ? 'Edit Address' : 'Add Address'}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <MapPin className="text-green-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{editId ? 'Edit Vendor Address' : 'Add Vendor Address'}</h1>
              <p className="text-sm text-slate-500">Manage pickup, delivery and store locations dynamically.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-700 rounded-lg hover:bg-green-50 font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Addresses
          </button>
        </div>
      </div>

      {message && (
        <div className="max-w-6xl mx-auto mb-4 p-4 rounded-lg bg-green-100 text-green-800 border border-green-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Vendor Information */}
          <div className="space-y-6">
            <div className="bg-blue-50/50 rounded-lg p-3 flex items-center gap-2 border border-blue-100">
              <User className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-blue-900">Vendor Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Vendor ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  placeholder="e.g. 101" 
                  className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Shop / Company Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  placeholder="e.g. Sri Venkateswara Gold & Diamonds" 
                  className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column - Address Details */}
          <div className="space-y-6">
            <div className="bg-green-50/50 rounded-lg p-3 flex items-center gap-2 border border-green-100">
              <MapPin className="text-green-600" size={20} />
              <h2 className="text-lg font-semibold text-green-900">Address Details</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">House No. <span className="text-red-500">*</span></label>
                  <input type="text" name="house_no" value={formData.house_no} onChange={handleChange} placeholder="e.g. 15/123" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Street <span className="text-red-500">*</span></label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="e.g. Main Bazaar Road" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Area</label>
                  <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Clock Tower Area" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Landmark</label>
                  <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Opposite SBI Bank" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mandal</label>
                  <input type="text" name="mandal" value={formData.mandal} onChange={handleChange} placeholder="e.g. Anantapur" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Anantapur" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="state" value={formData.state} onChange={handleChange} className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" required>
                      <option value="" disabled>Select</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pincode <span className="text-red-500">*</span></label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="515001" className="w-full border border-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" required />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-2 flex gap-3 items-start">
                <div className="bg-slate-200/60 p-2 rounded-full mt-1">
                  <MapPin className="text-slate-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Full Address Preview</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {generatePreview()}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-6 bg-slate-50/50 flex justify-end gap-4">
          <button 
            type="button" 
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            onClick={() => {
              setFormData(initialFormState);
              setEditId(null);
            }}
          >
            Clear / Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-800 text-white rounded-lg hover:bg-green-900 font-medium transition-colors shadow-sm disabled:opacity-70"
          >
            <Save size={18} />
            {loading ? 'Saving...' : (editId ? 'Update Address' : 'Save Address')}
          </button>
        </div>
      </form>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <List className="text-slate-500" size={24} />
          <h2 className="text-lg font-semibold text-slate-800">Saved Addresses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Vendor ID</th>
                <th className="p-4 font-medium">Shop Name</th>
                <th className="p-4 font-medium">City / Area</th>
                <th className="p-4 font-medium">State</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">No addresses found.</td>
                </tr>
              ) : (
                addresses.map((address) => (
                  <tr key={address.id || address._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-800 font-medium">#{address.vendor_id}</td>
                    <td className="p-4 text-sm text-slate-800">{address.shop_name}</td>
                    <td className="p-4 text-sm text-slate-600">{address.city}, {address.area}</td>
                    <td className="p-4 text-sm text-slate-600">{address.state}</td>
                    <td className="p-4 flex justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(address)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(address.id || address._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default VendorAddress;

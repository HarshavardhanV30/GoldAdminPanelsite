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
    <>
      {/* Pure Normal CSS block embedded directly in the component */}
      <style>{`
        .va-wrapper {
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 24px 32px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #1e293b;
          box-sizing: border-box;
        }
        .va-container {
          max-width: 1152px;
          margin: 0 auto;
        }
        .va-breadcrumb {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }
        .va-breadcrumb span {
          font-weight: 500;
          color: #1e293b;
        }
        .va-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .va-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .va-icon-box {
          background-color: #dcfce7;
          padding: 12px;
          border-radius: 12px;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .va-header-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .va-header-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
        .va-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .va-btn-back {
          background-color: #ffffff;
          border: 1px solid #16a34a;
          color: #15803d;
        }
        .va-btn-back:hover {
          background-color: #f0fdf4;
        }
        .va-btn-cancel {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
        }
        .va-btn-cancel:hover {
          background-color: #f8fafc;
        }
        .va-btn-save {
          background-color: #166534;
          color: #ffffff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .va-btn-save:hover {
          background-color: #14532d;
        }
        .va-btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .va-alert {
          background-color: #dcfce7;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .va-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
          margin-bottom: 40px;
        }
        .va-card-body {
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .va-card-body {
            grid-template-columns: 1fr 1fr;
          }
        }
        .va-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .va-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 8px;
        }
        .va-section-header.blue {
          background-color: rgba(239, 246, 255, 0.5);
          border: 1px solid #dbeafe;
          color: #1e3a8a;
        }
        .va-section-header.blue svg { color: #2563eb; }
        .va-section-header.green {
          background-color: rgba(240, 253, 244, 0.5);
          border: 1px solid #dcfce7;
          color: #14532d;
        }
        .va-section-header.green svg { color: #16a34a; }
        .va-section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .va-form-group-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .va-form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .va-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .va-grid-2 { grid-template-columns: 1fr 1fr; }
        }
        .va-grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .va-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }
        .va-label {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 4px;
        }
        .va-asterisk {
          color: #ef4444;
        }
        .va-input-wrapper {
          position: relative;
        }
        .va-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          color: #334155;
          box-sizing: border-box;
          background-color: #ffffff;
          appearance: none;
          outline: none;
          transition: all 0.2s;
        }
        .va-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }
        .va-select-icon {
          position: absolute;
          right: 12px;
          top: 12px;
          color: #94a3b8;
          pointer-events: none;
        }
        .va-preview-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-top: 8px;
        }
        .va-preview-icon {
          background-color: rgba(226, 232, 240, 0.6);
          padding: 8px;
          border-radius: 50%;
          color: #475569;
          display: flex;
        }
        .va-preview-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }
        .va-preview-text {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }
        .va-card-footer {
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          background-color: rgba(248, 250, 252, 0.5);
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }
        .va-table-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .va-table-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        .va-table-header svg {
          color: #64748b;
        }
        .va-table-responsive {
          overflow-x: auto;
        }
        .va-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .va-table th {
          background-color: #f8fafc;
          padding: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }
        .va-table td {
          padding: 16px;
          font-size: 14px;
          color: #1e293b;
          border-bottom: 1px solid #f1f5f9;
        }
        .va-table tr:hover td {
          background-color: #f8fafc;
        }
        .va-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .va-btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .va-btn-icon.edit { color: #2563eb; }
        .va-btn-icon.edit:hover { background-color: #eff6ff; }
        .va-btn-icon.delete { color: #ef4444; }
        .va-btn-icon.delete:hover { background-color: #fef2f2; }
      `}</style>

      <div className="va-wrapper">
        
        <div className="va-container">
          <div className="va-breadcrumb">
            Vendors &gt; Vendor Addresses &gt; <span>{editId ? 'Edit Address' : 'Add Address'}</span>
          </div>
          
          <div className="va-header-row">
            <div className="va-header-left">
              <div className="va-icon-box">
                <MapPin size={28} />
              </div>
              <div>
                <h1 className="va-header-title">{editId ? 'Edit Vendor Address' : 'Add Vendor Address'}</h1>
                <p className="va-header-subtitle">Manage pickup, delivery and store locations dynamically.</p>
              </div>
            </div>
            <button className="va-btn va-btn-back">
              <ArrowLeft size={18} />
              Back to Addresses
            </button>
          </div>
        </div>

        {message && (
          <div className="va-container">
            <div className="va-alert">{message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="va-container va-card">
          <div className="va-card-body">
            
            {/* Left Column - Vendor Information */}
            <div className="va-section">
              <div className="va-section-header blue">
                <User size={20} />
                <h2 className="va-section-title">Vendor Information</h2>
              </div>

              <div className="va-form-group-list">
                <div className="va-form-group">
                  <label className="va-label">
                    Select Vendor ID <span className="va-asterisk">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={handleChange}
                    placeholder="e.g. 101" 
                    className="va-input"
                    required
                  />
                </div>

                <div className="va-form-group">
                  <label className="va-label">
                    Shop / Company Name <span className="va-asterisk">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    placeholder="e.g. Sri Venkateswara Gold & Diamonds" 
                    className="va-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Address Details */}
            <div className="va-section">
              <div className="va-section-header green">
                <MapPin size={20} />
                <h2 className="va-section-title">Address Details</h2>
              </div>

              <div className="va-form-group-list">
                <div className="va-grid-2">
                  <div className="va-form-group">
                    <label className="va-label">House No. <span className="va-asterisk">*</span></label>
                    <input type="text" name="house_no" value={formData.house_no} onChange={handleChange} placeholder="e.g. 15/123" className="va-input" required />
                  </div>
                  <div className="va-form-group">
                    <label className="va-label">Street <span className="va-asterisk">*</span></label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="e.g. Main Bazaar Road" className="va-input" required />
                  </div>
                </div>

                <div className="va-grid-2">
                  <div className="va-form-group">
                    <label className="va-label">Area</label>
                    <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Clock Tower Area" className="va-input" />
                  </div>
                  <div className="va-form-group">
                    <label className="va-label">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Opposite SBI Bank" className="va-input" />
                  </div>
                </div>

                <div className="va-grid-2">
                  <div className="va-form-group">
                    <label className="va-label">Mandal</label>
                    <input type="text" name="mandal" value={formData.mandal} onChange={handleChange} placeholder="e.g. Anantapur" className="va-input" />
                  </div>
                  <div className="va-form-group">
                    <label className="va-label">City <span className="va-asterisk">*</span></label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Anantapur" className="va-input" required />
                  </div>
                </div>

                <div className="va-grid-3">
                  <div className="va-form-group">
                    <label className="va-label">District</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" className="va-input" />
                  </div>
                  <div className="va-form-group">
                    <label className="va-label">State <span className="va-asterisk">*</span></label>
                    <div className="va-input-wrapper">
                      <select name="state" value={formData.state} onChange={handleChange} className="va-input" required>
                        <option value="" disabled>Select</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                      <ChevronDown className="va-select-icon" size={18} />
                    </div>
                  </div>
                  <div className="va-form-group">
                    <label className="va-label">Pincode <span className="va-asterisk">*</span></label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="515001" className="va-input" required />
                  </div>
                </div>

                <div className="va-preview-box">
                  <div className="va-preview-icon">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h3 className="va-preview-title">Full Address Preview</h3>
                    <p className="va-preview-text">
                      {generatePreview()}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="va-card-footer">
            <button 
              type="button" 
              className="va-btn va-btn-cancel"
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
              className="va-btn va-btn-save"
            >
              <Save size={18} />
              {loading ? 'Saving...' : (editId ? 'Update Address' : 'Save Address')}
            </button>
          </div>
        </form>

        <div className="va-container va-card">
          <div className="va-table-header">
            <List size={24} />
            <h2>Saved Addresses</h2>
          </div>
          <div className="va-table-responsive">
            <table className="va-table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Shop Name</th>
                  <th>City / Area</th>
                  <th>State</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {addresses.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No addresses found.</td>
                  </tr>
                ) : (
                  addresses.map((address) => (
                    <tr key={address.id || address._id}>
                      <td style={{ fontWeight: '500' }}>#{address.vendor_id}</td>
                      <td>{address.shop_name}</td>
                      <td style={{ color: '#475569' }}>{address.city}{address.area ? `, ${address.area}` : ''}</td>
                      <td style={{ color: '#475569' }}>{address.state}</td>
                      <td>
                        <div className="va-actions">
                          <button 
                            onClick={() => handleEdit(address)}
                            className="va-btn-icon edit"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(address.id || address._id)}
                            className="va-btn-icon delete"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default VendorAddress;

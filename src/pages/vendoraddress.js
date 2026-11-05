
import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, MapPin, User, Save, ChevronDown,
  Edit, Trash2, List, Building2, CheckCircle,
  AlertCircle, X, Loader2
} from 'lucide-react';

const API_BASE_URL =
  'https://goldbackend-production-0ed4.up.railway.app/vendoraddress';

const initialForm = {
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

const states = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu',
  'Kerala', 'Maharashtra', 'Goa', 'Gujarat', 'Rajasthan',
  'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal', 'Odisha',
  'Bihar', 'Jharkhand', 'Chhattisgarh', 'Punjab', 'Haryana',
  'Himachal Pradesh', 'Uttarakhand', 'Assam', 'Arunachal Pradesh',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim',
  'Tripura'
];

const VendorAddress = () => {
  const [formData, setFormData] = useState(initialForm);
  const [addresses, setAddresses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const notify = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setMessage(''), 3500);
  };

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/all`);
      if (!res.ok) throw new Error('Unable to load addresses');
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ ...initialForm });
    setEditId(null);
  };

  const addressPreview = () => {
    const fields = [
      'house_no', 'street', 'area', 'landmark',
      'mandal', 'city', 'district', 'state', 'pincode'
    ];

    const values = fields
      .map(key => formData[key]?.trim())
      .filter(Boolean);

    return values.length
      ? values.join(', ')
      : 'The complete address will be shown here after you fill the details.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    const payload = {
      ...formData,
      vendor_id: Number(formData.vendor_id)
    };

    try {
      const res = await fetch(
        editId ? `${API_BASE_URL}/${editId}` : `${API_BASE_URL}/add`,
        {
          method: editId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Unable to save address');

      notify(editId ? 'Address updated successfully!' : 'Address added successfully!');
      resetForm();
      await fetchAddresses();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    const id = address.id ?? address._id;
    if (id == null) {
      notify('Address ID is missing', 'error');
      return;
    }

    setEditId(id);
    setFormData({
      ...initialForm,
      ...address,
      vendor_id: String(address.vendor_id ?? ''),
      pincode: String(address.pincode ?? '')
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this address?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Unable to delete address');

      if (String(editId) === String(id)) resetForm();

      notify('Address deleted successfully!');
      await fetchAddresses();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const input = (label, name, placeholder, required = false, type = 'text') => (
    <div className="va-field">
      <label htmlFor={name}>
        {label}{required && <span className="required"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        min={type === 'number' ? '1' : undefined}
      />
    </div>
  );

  return (
    <div className="vendor-address">

      <div className="breadcrumb">
        <span>Vendors</span><ChevronDown />
        <span>Vendor Addresses</span><ChevronDown />
        <strong>{editId ? 'Edit Address' : 'Add Address'}</strong>
      </div>

      <header className="page-header">
        <div className="header-info">
          <div className="header-icon"><MapPin size={34} /></div>
          <div>
            <h1>{editId ? 'Edit Vendor Address' : 'Add Vendor Address'}</h1>
            <p>Add a new address for the vendor to manage pickup, delivery and store locations.</p>
          </div>
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={19} /> Back to Addresses
        </button>
      </header>

      {message && (
        <div className={`notification ${messageType}`}>
          {messageType === 'success'
            ? <CheckCircle size={19} />
            : <AlertCircle size={19} />}
          <span>{message}</span>
          <button type="button" onClick={() => setMessage('')}><X size={17} /></button>
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-content">

          <section className="vendor-section">
            <div className="section-title vendor-title">
              <span><User size={23} /></span>
              <h2>Vendor Information</h2>
            </div>

            <div className="fields">
              {input('Select Vendor ID', 'vendor_id', 'Enter vendor ID', true, 'number')}
              {input('Shop / Company Name', 'shop_name', 'Enter shop or company name', true)}
            </div>
          </section>

          <section className="address-section">
            <div className="section-title address-title">
              <span><MapPin size={23} /></span>
              <h2>Address Details</h2>
            </div>

            <div className="fields">
              <div className="grid-2">
                {input('House No. / Flat No.', 'house_no', 'Enter house no. / flat no.', true)}
                {input('Street / Area', 'street', 'Enter street or area name', true)}
              </div>

              <div className="grid-2">
                {input('Landmark', 'landmark', 'Enter landmark (optional)')}
                {input('City / Town', 'city', 'Enter city or town', true)}
              </div>

              <div className="grid-2">
                {input('Area', 'area', 'Enter area name')}
                {input('Mandal', 'mandal', 'Enter mandal name')}
              </div>

              <div className="grid-2">
                {input('District', 'district', 'Enter district')}

                <div className="va-field">
                  <label htmlFor="state">State <span className="required">*</span></label>
                  <div className="select-wrap">
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown size={19} />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="va-field">
                  <label htmlFor="pincode">Pincode <span className="required">*</span></label>
                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={e => {
                      if (/^\d{0,6}$/.test(e.target.value)) handleChange(e);
                    }}
                    placeholder="Enter pincode"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>

              <div className="address-preview">
                <div className="preview-icon"><MapPin size={22} /></div>
                <div>
                  <h3>Full Address Preview</h3>
                  <p>{addressPreview()}</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        <div className="form-footer">
          <button type="button" className="cancel-btn" onClick={resetForm} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? <Loader2 className="spin" size={19} /> : <Save size={20} />}
            {saving ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
          </button>
        </div>
      </form>

      <div className="saved-card">
        <div className="saved-header">
          <div><List size={23} /><h2>Saved Vendor Addresses</h2></div>
          <button type="button" onClick={fetchAddresses} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Shop Name</th>
                <th>City / Area</th>
                <th>District</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    {loading ? 'Loading addresses...' : 'No vendor addresses found.'}
                  </td>
                </tr>
              ) : addresses.map(address => {
                const id = address.id ?? address._id;
                return (
                  <tr key={id}>
                    <td><strong className="vendor-id">#{address.vendor_id}</strong></td>
                    <td className="shop-name">{address.shop_name || '-'}</td>
                    <td>{[address.city, address.area].filter(Boolean).join(', ') || '-'}</td>
                    <td>{address.district || '-'}</td>
                    <td>{address.state || '-'}</td>
                    <td>{address.pincode || '-'}</td>
                    <td>
                      <div className="actions">
                        <button type="button" className="edit-btn" onClick={() => handleEdit(address)} title="Edit">
                          <Edit size={17} />
                        </button>
                        <button type="button" className="delete-btn" onClick={() => handleDelete(id)} title="Delete">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .vendor-address {
          min-height: 100vh;
          padding: 22px;
          background: #f3f7fc;
          color: #101b35;
          font-family: Inter, Arial, sans-serif;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
          color: #71809a;
          font-size: 14px;
        }

        .breadcrumb svg {
          width: 15px;
          transform: rotate(-90deg);
        }

        .breadcrumb strong { color: #263650; }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 27px;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 16px;
          color: #087c46;
          background: #d9f6e4;
        }

        .page-header h1 {
          margin: 0 0 6px;
          color: #0b1734;
          font-size: 29px;
          font-weight: 750;
        }

        .page-header p {
          margin: 0;
          color: #526481;
          font-size: 15px;
          line-height: 1.6;
        }

        .back-btn, .cancel-btn, .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          padding: 0 23px;
          border-radius: 9px;
          font-size: 15px;
          font-weight: 650;
          cursor: pointer;
          transition: .2s;
        }

        .back-btn {
          background: white;
          border: 1px solid #078849;
          color: #066a3a;
          white-space: nowrap;
        }

        .back-btn:hover { background: #e9f8ef; }

        .notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          margin: 0 auto 16px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
        }

        .notification.success { background: #e5f8eb; color: #087a42; }
        .notification.error { background: #fff0f0; color: #c62828; }
        .notification button { margin-left: auto; border: 0; background: none; color: inherit; cursor: pointer; }

        .form-card, .saved-card {
          width: 100%;
          margin: 0 auto 28px;
          overflow: hidden;
          background: white;
          border: 1px solid #e0e7f0;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(24,49,83,.06);
        }

        .form-content {
          display: grid;
          grid-template-columns: .82fr 1.18fr;
        }

        .vendor-section, .address-section { padding: 22px 24px; }
        .vendor-section { border-right: 1px solid #e5eaf1; }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 54px;
          padding: 9px 14px;
          margin-bottom: 26px;
          border-radius: 10px;
        }

        .section-title span {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }

        .section-title h2 { margin: 0; font-size: 19px; font-weight: 750; }
        .vendor-title { color: #08469c; background: #e7f3ff; }
        .vendor-title span { background: #d9edff; color: #0861d6; }
        .address-title { color: #087344; background: #e9f9ee; }
        .address-title span { background: #d8f5e2; color: #078044; }

        .fields { display: flex; flex-direction: column; gap: 20px; padding: 0 6px; }
        .va-field { width: 100%; min-width: 0; }
        .va-field label { display: block; margin-bottom: 9px; color: #142039; font-size: 15px; font-weight: 650; }
        .required { color: #ed303d; }

        .va-field input, .select-wrap select {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          border: 1px solid #cbd3df;
          border-radius: 9px;
          outline: none;
          background: white;
          color: #15223d;
          font-family: inherit;
          font-size: 15px;
          transition: .2s;
        }

        .va-field input::placeholder { color: #8190a9; opacity: 1; }

        .va-field input:focus, .select-wrap select:focus {
          border-color: #07854a;
          box-shadow: 0 0 0 3px rgba(8,133,74,.10);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 16px;
        }

        .select-wrap { position: relative; }
        .select-wrap select { appearance: none; cursor: pointer; padding-right: 40px; }
        .select-wrap svg { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; }

        .address-preview {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: 10px;
          background: #f0f4fa;
        }

        .preview-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #e0e7f0;
          color: #526783;
        }

        .address-preview h3 { margin: 1px 0 5px; font-size: 15px; font-weight: 750; }
        .address-preview p { margin: 0; color: #73839e; font-size: 14px; line-height: 1.6; overflow-wrap: anywhere; }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          padding: 15px 20px;
          min-height: 90px;
          border-top: 1px solid #e8edf3;
        }

        .cancel-btn { background: #f8f9fb; color: #17233c; border: 1px solid #cbd3df; }
        .cancel-btn:hover { background: #e9edf3; }
        .save-btn { min-width: 205px; background: #00643c; color: white; border: 1px solid #00643c; }
        .save-btn:hover:not(:disabled) { background: #004f30; }
        .save-btn:disabled, .cancel-btn:disabled { opacity: .65; cursor: not-allowed; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .saved-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 19px 22px;
          border-bottom: 1px solid #e7ecf2;
        }

        .saved-header > div { display: flex; align-items: center; gap: 12px; color: #53647d; }
        .saved-header h2 { margin: 0; color: #142039; font-size: 19px; }
        .saved-header > button {
          padding: 9px 17px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          color: #34445e;
          cursor: pointer;
        }

        .table-wrap { width: 100%; overflow-x: auto; }
        .saved-card table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }
        .saved-card thead { background: #f5f7fa; }
        .saved-card th { padding: 15px 18px; color: #56647b; font-size: 13px; font-weight: 700; border-bottom: 1px solid #e3e9f0; }
        .saved-card td { padding: 15px 18px; color: #52617a; font-size: 14px; border-bottom: 1px solid #edf0f4; }
        .saved-card tbody tr:hover { background: #f8fafc; }
        .vendor-id { color: #1454a0; }
        .shop-name { color: #192743 !important; font-weight: 600; }
        .empty { padding: 35px !important; text-align: center; color: #8491a5 !important; }

        .actions { display: flex; justify-content: center; gap: 9px; }
        .actions button {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border: none;
          border-radius: 7px;
          cursor: pointer;
        }

        .edit-btn { background: #eaf3ff; color: #1765c0; }
        .delete-btn { background: #fff0f0; color: #df3434; }
        .edit-btn:hover { background: #d5e8ff; }
        .delete-btn:hover { background: #ffdddd; }

        @media (max-width: 1000px) {
          .form-content { grid-template-columns: .85fr 1.15fr; }
          .vendor-section, .address-section { padding: 18px; }
          .page-header h1 { font-size: 25px; }
        }

        @media (max-width: 768px) {
          .vendor-address { padding: 14px; }
          .page-header { flex-direction: column; align-items: flex-start; }
          .header-info { gap: 13px; }
          .header-icon { width: 55px; height: 55px; }
          .page-header h1 { font-size: 21px; }
          .page-header p { font-size: 13px; }
          .back-btn { width: 100%; }
          .form-content { grid-template-columns: 1fr; }
          .vendor-section { border-right: 0; border-bottom: 1px solid #e5eaf1; }
          .vendor-section, .address-section { padding: 16px; }
          .grid-2 { grid-template-columns: 1fr; gap: 18px; }
          .fields { padding: 0; gap: 18px; }
          .form-footer { flex-direction: column-reverse; padding: 17px; }
          .cancel-btn, .save-btn { width: 100%; }
          .saved-header { padding: 15px; }
          .saved-header h2 { font-size: 16px; }
        }

        @media (max-width: 420px) {
          .vendor-address { padding: 10px; }
          .page-header h1 { font-size: 19px; }
          .vendor-section, .address-section { padding: 13px; }
          .section-title h2 { font-size: 16px; }
          .va-field input, .select-wrap select { height: 47px; font-size: 14px; }
          .saved-header { align-items: flex-start; flex-direction: column; }
          .saved-header > button { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default VendorAddress;

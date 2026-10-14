
import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  MapPin,
  User,
  Save,
  ChevronDown,
  Edit,
  Trash2,
  List,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CalendarDays,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  Store,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Phone,
  Mail,
  Building2,
  MapPinned,
} from 'lucide-react';

const API_BASE_URL =
  'https://goldbackend-production-0ed4.up.railway.app/vendoraddress';

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
  pincode: '',
};

const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
];

const inputClass =
  'w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10';

const labelClass =
  'mb-2 block text-sm font-semibold text-slate-700';

const VendorAddress = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [addresses, setAddresses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isEditing = editId !== null;

  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  const getAddressId = (address) =>
    address.id ?? address._id;

  const fetchAllAddresses = useCallback(async () => {
    setListLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/all`);

      if (!response.ok) {
        throw new Error('Unable to fetch vendor addresses.');
      }

      const data = await response.json();

      // Supports either an array or a common API response object.
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.addresses)
            ? data.addresses
            : [];

      setAddresses(list);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showMessage('error', error.message || 'Failed to load addresses.');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAddresses();
  }, [fetchAllAddresses]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const generatePreview = () => {
    const fields = [
      formData.house_no,
      formData.street,
      formData.area,
      formData.landmark,
      formData.mandal,
      formData.city,
      formData.district,
      formData.state,
      formData.pincode,
    ];

    const parts = fields
      .map((part) => String(part || '').trim())
      .filter(Boolean);

    return parts.length
      ? parts.join(', ')
      : 'Your complete address will appear here as you fill in the details.';
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!Number.isInteger(Number(formData.vendor_id)) ||
        Number(formData.vendor_id) <= 0) {
      showMessage('error', 'Please enter a valid Vendor ID.');
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      showMessage('error', 'Please enter a valid 6-digit Indian pincode.');
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      vendor_id: Number(formData.vendor_id),
      shop_name: formData.shop_name.trim(),
      house_no: formData.house_no.trim(),
      street: formData.street.trim(),
      area: formData.area.trim(),
      landmark: formData.landmark.trim(),
      mandal: formData.mandal.trim(),
      district: formData.district.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    try {
      const url = isEditing
        ? `${API_BASE_URL}/${editId}`
        : `${API_BASE_URL}/add`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
          result.error ||
          'Failed to save vendor address.'
        );
      }

      showMessage(
        'success',
        isEditing
          ? 'Vendor address updated successfully.'
          : 'Vendor address added successfully.'
      );

      resetForm();
      await fetchAllAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      showMessage(
        'error',
        error.message || 'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditId(getAddressId(address));

    setFormData({
      ...initialFormState,
      ...address,
      vendor_id: String(address.vendor_id ?? ''),
      shop_name: address.shop_name ?? '',
      house_no: address.house_no ?? '',
      street: address.street ?? '',
      area: address.area ?? '',
      landmark: address.landmark ?? '',
      mandal: address.mandal ?? '',
      district: address.district ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      pincode: String(address.pincode ?? ''),
    });

    setMessage(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = async (id) => {
    if (id === undefined || id === null) {
      showMessage('error', 'Address ID is missing.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message || result.error || 'Failed to delete address.'
        );
      }

      if (String(editId) === String(id)) {
        resetForm();
      }

      showMessage('success', 'Vendor address deleted successfully.');
      await fetchAllAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      showMessage('error', error.message || 'Unable to delete address.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAddresses = addresses.filter((address) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return true;

    return [
      address.vendor_id,
      address.shop_name,
      address.city,
      address.area,
      address.district,
      address.state,
      address.pincode,
    ].some((value) =>
      String(value ?? '').toLowerCase().includes(search)
    );
  });

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Products', icon: Package },
    { label: 'Orders', icon: ShoppingCart },
    { label: 'Customers', icon: Users },
    { label: 'Vendors', icon: Store, active: true },
    { label: 'Bookings', icon: CalendarDays },
    { label: 'Payments', icon: CreditCard },
    { label: 'Reports', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
  ];

  const Field = ({
    label,
    name,
    placeholder,
    required = false,
    type = 'text',
    icon: Icon,
    children,
    maxLength,
  }) => (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        {children || (
          <input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            inputMode={type === 'number' ? 'numeric' : undefined}
            className={`${inputClass} ${Icon ? 'pl-10' : ''}`}
          />
        )}
      </div>
    </div>
  );

  const AddressSectionTitle = ({ icon: Icon, children, variant }) => {
    const colors =
      variant === 'blue'
        ? 'border-blue-100 bg-blue-50 text-blue-800'
        : 'border-emerald-100 bg-emerald-50 text-emerald-800';

    return (
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${colors}`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80">
          <Icon size={21} />
        </div>
        <h2 className="text-base font-bold sm:text-lg">{children}</h2>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] font-sans text-slate-800">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[#10243d] to-[#172d48] text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <span className="text-3xl">◇</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              G-Buyer
            </h1>
            <p className="text-xs tracking-wide text-slate-300">
              Gold Marketplace
            </p>
          </div>

          <button
            type="button"
            className="ml-auto rounded-lg p-1 text-slate-300 hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                type="button"
                key={label}
                onClick={() => {
                  if (label === 'Vendors') {
                    setSidebarOpen(false);
                    return;
                  }

                  showMessage(
                    'info',
                    `${label} navigation should be connected to your website routes.`
                  );
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={19} />
                <span>{label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                document.getElementById('saved-addresses')?.scrollIntoView({
                  behavior: 'smooth',
                });
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <MapPin size={19} />
              Vendor Addresses
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-300">
              <CheckCircle2 size={17} />
              <span className="text-sm font-semibold">Vendor Management</span>
            </div>
            <p className="text-xs leading-5 text-slate-300">
              Manage shop locations and keep vendor addresses organized.
            </p>
          </div>
          <p className="mt-4 text-center text-[10px] text-slate-500">
            G-Buyer Admin Panel
          </p>
        </div>
      </aside>

      {/* Main page */}
      <main className="min-h-screen lg:ml-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-sm backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <span>Admin</span>
              <span className="text-slate-300">/</span>
              <span>Vendors</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-800">
                Vendor Addresses
              </span>
            </div>

            <span className="text-sm font-semibold text-slate-700 sm:hidden">
              G-Buyer Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={fetchAllAddresses}
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
              title="Refresh addresses"
            >
              <Bell size={20} />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#142b43] text-sm font-bold text-white shadow-sm">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
          {/* Page heading */}
          <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
                <MapPinned size={29} />
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  Vendor Management
                </p>

                <h1 className="text-2xl font-extrabold tracking-tight text-[#14243b] sm:text-3xl">
                  {isEditing
                    ? 'Edit Vendor Address'
                    : 'Add Vendor Address'}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage pickup, delivery, and store locations from one
                  place.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                document.getElementById('saved-addresses')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 xl:self-center"
            >
              <ArrowLeft size={18} />
              Back to Addresses
            </button>
          </div>

          {/* Status message */}
          {message && (
            <div
              role="status"
              className={`mb-6 flex items-start gap-3 rounded-xl border p-4 shadow-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : message.type === 'error'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-blue-200 bg-blue-50 text-blue-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              ) : message.type === 'error' ? (
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
              )}

              <p className="flex-1 text-sm font-medium">{message.text}</p>

              <button
                type="button"
                onClick={() => setMessage(null)}
                className="rounded p-1 opacity-70 hover:opacity-100"
                aria-label="Dismiss message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Vendor information */}
              <section className="border-b border-slate-200 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
                <AddressSectionTitle icon={User} variant="blue">
                  Vendor Information
                </AddressSectionTitle>

                <div className="mt-7 space-y-6">
                  <Field
                    label="Select Vendor ID"
                    name="vendor_id"
                    placeholder="Enter vendor ID, e.g. 101"
                    required
                    type="number"
                  />

                  <Field
                    label="Shop / Company Name"
                    name="shop_name"
                    placeholder="Enter shop or company name"
                    required
                    icon={Building2}
                  />

                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                        <Store size={20} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Vendor details
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Enter the existing Vendor ID and the registered
                          shop or company name associated with this address.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Form status
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isEditing ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {isEditing
                          ? `Editing address #${editId}`
                          : 'Creating a new address'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Address details */}
              <section className="p-5 sm:p-7 lg:p-8">
                <AddressSectionTitle icon={MapPin} variant="green">
                  Address Details
                </AddressSectionTitle>

                <div className="mt-7 space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                      label="House No. / Flat No."
                      name="house_no"
                      placeholder="e.g. 15/123"
                      required
                    />

                    <Field
                      label="Street"
                      name="street"
                      placeholder="Street or road name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                      label="Area"
                      name="area"
                      placeholder="Enter area"
                    />

                    <Field
                      label="Landmark"
                      name="landmark"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                      label="Mandal"
                      name="mandal"
                      placeholder="Enter mandal"
                    />

                    <Field
                      label="City / Town"
                      name="city"
                      placeholder="Enter city or town"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                      label="District"
                      name="district"
                      placeholder="Enter district"
                    />

                    <Field
                      label="State"
                      name="state"
                      required
                    >
                      <div className="relative">
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className={`${inputClass} appearance-none pr-10`}
                        >
                          <option value="">Select state</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </Field>
                  </div>

                  <Field
                    label="Pincode"
                    name="pincode"
                    placeholder="Enter 6-digit pincode"
                    required
                    maxLength={6}
                  />

                  {/* Live address preview */}
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/50 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                        <MapPin size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-800">
                          Full Address Preview
                        </h3>

                        <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                          {generatePreview()}
                        </p>

                        {formData.shop_name && (
                          <p className="mt-2 flex items-start gap-2 text-xs font-semibold text-emerald-800">
                            <Store size={15} className="mt-0.5 shrink-0" />
                            {formData.shop_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Form actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  resetForm();
                  setMessage(null);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
                {isEditing ? 'Cancel Edit' : 'Clear Form'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {loading
                  ? 'Please wait...'
                  : isEditing
                    ? 'Update Address'
                    : 'Save Address'}
              </button>
            </div>
          </form>

          {/* Saved addresses */}
          <section
            id="saved-addresses"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <List size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-[#14243b]">
                    Saved Addresses
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    View and manage registered vendor locations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                  {filteredAddresses.length} address
                  {filteredAddresses.length !== 1 ? 'es' : ''}
                </span>

                <button
                  type="button"
                  onClick={fetchAllAddresses}
                  disabled={listLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={listLoading ? 'animate-spin' : ''}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="border-b border-slate-100 p-5 sm:px-7">
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search vendor, shop, city or state..."
                  aria-label="Search vendor addresses"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Vendor ID</th>
                    <th className="px-6 py-4">Shop Name</th>
                    <th className="px-6 py-4">City / Area</th>
                    <th className="px-6 py-4">State</th>
                    <th className="px-6 py-4">Pincode</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {listLoading && addresses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <RefreshCw
                          size={25}
                          className="mx-auto animate-spin text-emerald-700"
                        />
                        <p className="mt-3 text-sm text-slate-500">
                          Loading vendor addresses...
                        </p>
                      </td>
                    </tr>
                  ) : filteredAddresses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <MapPin size={27} />
                        </div>
                        <p className="mt-4 font-semibold text-slate-700">
                          {searchTerm
                            ? 'No matching addresses found'
                            : 'No addresses found'}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {searchTerm
                            ? 'Try a different search term.'
                            : 'Add your first vendor address using the form above.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAddresses.map((address) => (
                      <tr
                        key={getAddressId(address)}
                        className="transition-colors hover:bg-emerald-50/30"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700">
                            #{address.vendor_id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                              <Store size={19} />
                            </div>
                            <div>
                              <p className="max-w-[230px] truncate text-sm font-bold text-slate-800">
                                {address.shop_name || 'Unnamed shop'}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {address.house_no || ''}
                                {address.street
                                  ? `, ${address.street}`
                                  : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {address.city || '—'}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {address.area || '—'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400" />
                            {address.state || '—'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {address.pincode || '—'}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(address)}
                              disabled={loading}
                              title="Edit address"
                              aria-label={`Edit address for ${address.shop_name || 'vendor'}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 disabled:opacity-50"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(getAddressId(address))}
                              disabled={loading}
                              title="Delete address"
                              aria-label={`Delete address for ${address.shop_name || 'vendor'}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p>
                Showing {filteredAddresses.length} of {addresses.length}{' '}
                saved addresses
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Vendor address management
              </p>
            </div>
          </section>

          <footer className="py-7 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} G-Buyer Gold Marketplace. Admin Panel.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default VendorAddress;

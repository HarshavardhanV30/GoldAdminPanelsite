import React, { useState, useEffect } from 'react';

const API_URL = 'https://goldbackend-production-0ed4.up.railway.app/goldrepair/all';

export default function GoldRepair() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection & Search State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('SCHEDULE'); // SCHEDULE, LIST, PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState('Details'); // Details, Images, History

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const resData = await response.json();
      
      if (resData && resData.success && Array.isArray(resData.data)) {
        // Filter out empty placeholder entries if needed, or keep valid ones
        const validData = resData.data.filter(item => item.id && item.full_name);
        setBookings(validData);
        if (validData.length > 0) {
          setSelectedBooking(validData[0]);
        }
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError('Failed to fetch repair bookings. Please check network connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper calculation metrics
  const totalBookings = bookings.length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const inProgressCount = bookings.filter(b => b.status === 'IN_PROGRESS' || !b.status).length;
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const totalRevenue = bookings.reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0);

  // Search Filter logic
  const filteredBookings = bookings.filter((item) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = item.full_name?.toLowerCase().includes(query);
    const phoneMatch = item.phone?.toLowerCase().includes(query);
    const serviceMatch = item.service_name?.toLowerCase().includes(query);
    const idMatch = String(item.id).includes(query);

    return nameMatch || phoneMatch || serviceMatch || idMatch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-600 font-medium">
        Loading Gold Repair Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-red-500">
        <p className="mb-4 text-lg font-semibold">{error}</p>
        <button 
          onClick={fetchBookings} 
          className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 p-4 md:p-6">
      
      {/* Top Navbar */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by booking ID, customer name, mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span>📅</span>
            <span>02 Oct 2026</span>
          </div>

          <div className="relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>

          <div className="flex items-center space-x-2 border-l pl-4 border-slate-200">
            <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-sm">
              A
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-slate-800">Admin</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Bookings</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalBookings}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">↑ +12% <span className="text-slate-400 font-normal">This Month</span></span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl">📅</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">Completed</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{completedCount}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">↑ +18% <span className="text-slate-400 font-normal">This Month</span></span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-xl">✓</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">In Progress</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{inProgressCount}</h3>
            <span className="text-[11px] text-amber-600 font-medium">↑ 5% <span className="text-slate-400 font-normal">This Month</span></span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-xl">🕒</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingCount}</h3>
            <span className="text-[11px] text-red-500 font-medium">↑ -8% <span className="text-slate-400 font-normal">This Month</span></span>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-lg text-xl">✕</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">↑ +22% <span className="text-slate-400 font-normal">This Month</span></span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl">₹</div>
        </div>
      </div>

      {/* Primary Workspace: Main View & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                activeTab === 'SCHEDULE' ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              📅 Schedule View
            </button>
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                activeTab === 'LIST' ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                activeTab === 'PENDING' ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pending <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">{pendingCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('IN_PROGRESS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                activeTab === 'IN_PROGRESS' ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              In Progress <span className="bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full text-[10px]">{inProgressCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                activeTab === 'COMPLETED' ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Completed <span className="bg-emerald-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">{completedCount}</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600">
                <option>02 Oct 2026</option>
              </select>
              <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600">
                <option>All Services</option>
              </select>
              <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600">
                <option>All Technicians</option>
              </select>
              <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600">
                <option>All Status</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-40 focus:outline-none"
            />
          </div>

          {/* Data Display: Table List or Bookings Cards */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                Today's Schedule <span className="text-slate-400 font-normal">| 02 October 2026</span>
              </h2>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                <button className="px-3 py-1 bg-teal-800 text-white rounded-md font-medium">Day</button>
                <button className="px-3 py-1 text-slate-600 hover:text-slate-900">Week</button>
                <button className="px-3 py-1 text-slate-600 hover:text-slate-900">Month</button>
              </div>
            </div>

            {/* Bookings List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Service Name</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Date & Time</th>
                    <th className="py-2 px-3">City</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-6 text-center text-slate-400">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedBooking(item)}
                        className={`cursor-pointer transition-colors ${
                          selectedBooking?.id === item.id ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-700">#{item.id}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {item.full_name || 'N/A'}
                          <p className="text-[10px] text-slate-400">{item.phone}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{item.service_name || 'Custom Repair'}</td>
                        <td className="py-3 px-3 text-slate-500">{item.jewellery_type || 'N/A'}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {formatDate(item.booking_date)}
                          <p className="text-[10px] text-slate-400">{item.start_time} - {item.end_time}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{item.city || 'N/A'}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">₹{item.total_amount}</td>
                        <td className="py-3 px-3 text-right">
                          <button className="text-teal-700 font-semibold text-[11px] hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Bookings Section */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-800">Upcoming Bookings (Next 7 Days)</h3>
              <button className="text-xs text-teal-700 font-medium hover:underline">View All →</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {bookings.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedBooking(item)}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                >
                  <p className="text-[10px] text-slate-400 font-medium">{formatDate(item.booking_date)}</p>
                  <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{item.service_name || 'Gold Repair'}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.full_name}</p>
                  <p className="text-[10px] text-slate-400">{item.start_time || '10:00 AM'}</p>
                  <span className="mt-2 inline-block px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-semibold rounded">
                    {item.customer_type || 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Detail Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            
            {/* Header / Add Booking action */}
            <div className="bg-teal-900 text-white p-3 flex justify-between items-center">
              <button className="flex items-center text-xs font-semibold bg-teal-800 hover:bg-teal-700 px-3 py-1.5 rounded-lg">
                + Add Booking
              </button>
              <button className="text-slate-300 hover:text-white text-lg">✕</button>
            </div>

            {selectedBooking ? (
              <div className="p-4 space-y-4">
                {/* Status Badge & Booking ID */}
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                    ● In Progress
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Booking ID: #{selectedBooking.id}
                  </span>
                </div>

                {/* Customer Contact Profile */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600">
                      {selectedBooking.full_name ? selectedBooking.full_name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{selectedBooking.full_name || 'N/A'}</h4>
                      <p className="text-xs text-slate-500">{selectedBooking.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a href={`tel:${selectedBooking.phone}`} className="p-1.5 bg-slate-100 text-slate-600 rounded-full text-xs">📞</a>
                    <a href={`https://wa.me/${selectedBooking.phone}`} target="_blank" rel="noreferrer" className="p-1.5 bg-emerald-100 text-emerald-600 rounded-full text-xs">💬</a>
                  </div>
                </div>

                {/* Detail Tabs */}
                <div className="flex border-b border-slate-200 text-xs">
                  {['Details', 'Images', 'History'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveDetailTab(tab)}
                      className={`flex-1 py-2 font-medium text-center ${
                        activeDetailTab === tab 
                          ? 'border-b-2 border-teal-700 text-teal-800 font-semibold' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeDetailTab === 'Details' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service</span>
                      <span className="font-semibold text-slate-800 text-right">{selectedBooking.service_name || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Jewellery Type</span>
                      <span className="font-semibold text-slate-800 text-right">{selectedBooking.jewellery_type || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Issue Description</span>
                      <span className="font-medium text-slate-700 text-right max-w-[180px]">{selectedBooking.issue_description || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Date & Time</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {formatDate(selectedBooking.booking_date)}, {selectedBooking.start_time} - {selectedBooking.end_time}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Address</span>
                      <span className="font-medium text-slate-700 text-right max-w-[180px]">
                        {selectedBooking.house_no}, {selectedBooking.street}, {selectedBooking.area}, {selectedBooking.city}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Status</span>
                      <select className="bg-amber-50 text-amber-800 border border-amber-200 rounded px-2 py-0.5 text-xs font-semibold">
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-400">Amount</span>
                      <span className="font-bold text-slate-900">₹{selectedBooking.service_fee}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Status</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        Paid
                      </span>
                    </div>

                    {/* Admin Notes */}
                    <div className="pt-3">
                      <label className="block font-semibold text-slate-700 mb-1">Admin Notes</label>
                      <textarea
                        rows="2"
                        placeholder="Add notes about this booking..."
                        defaultValue={selectedBooking.special_instructions}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                )}

                {activeDetailTab === 'Images' && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {selectedBooking.jewellery_images && selectedBooking.jewellery_images.length > 0 ? (
                      selectedBooking.jewellery_images.map((imgUrl, index) => (
                        <div key={index} className="h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                          {imgUrl && imgUrl.startsWith('http') ? (
                            <img src={imgUrl} alt="Jewellery" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-slate-400 p-2 text-center">Local Device Image ({index + 1})</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 col-span-2 py-4 text-center">No images attached.</p>
                    )}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                  <button className="py-2 bg-emerald-700 text-white text-[11px] font-semibold rounded-lg hover:bg-emerald-800">
                    ✓ Mark Completed
                  </button>
                  <button className="py-2 bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-lg hover:bg-amber-200">
                    📅 Reschedule
                  </button>
                  <button className="py-2 bg-red-100 text-red-700 text-[11px] font-semibold rounded-lg hover:bg-red-200">
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Select a booking to view complete details.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

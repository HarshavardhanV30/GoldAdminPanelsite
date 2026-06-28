import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { FaTrash, FaSun, FaMoon } from 'react-icons/fa';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [purityFilter, setPurityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // 1. Fetch data from real API endpoint on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://goldbackend-auyv.onrender.com/order/all`);
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Handle status updates via POST API
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch('https://goldbackend-auyv.onrender.com/order/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: Number(orderId), // ensuring it matches your backend payload expectations
          status: newStatus 
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Correctly update the nested reference in state so UI triggers re-render
        setOrders(prevOrders => 
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update status:', result.message);
        alert(`Error updating status: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // 3. Handle order deletion via API
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`https://goldbackend-auyv.onrender.com/order/delete/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      } else {
        const result = await res.json();
        console.error('Failed to delete order:', result.message);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // 4. Export formatted JSON arrays into clean Excel structure
  const exportToExcel = () => {
    const exportData = [];
    orders.forEach(order => {
      (order.order_summary || []).forEach(item => {
        exportData.push({
          OrderID: order.id || '',
          Name: item.name || '',
          Quantity: item.quantity || '',
          Purity: item.purity || '',
          Price: item.price || '',
          TotalPrice: item.quantity > 0 ? (parseFloat(item.price) * item.quantity).toFixed(2) : item.price,
          AdvancePaid: order.advance_paid || '0.00',
          BalanceDue: order.balance_due || '0.00',
          InitialPaymentType: order.initial_payment_type || '',
          PaymentStatus: order.payment_status || '',
          PaymentMethod: order.payment_method || '',
          ExpectedDelivery: order.expected_delivery || '',
          Address_Name: order.address?.name || '',
          Address_Flat: order.address?.flat || '',
          Address_Street: order.address?.street || '',
          Address_City: order.address?.city || '',
          Address_State: order.address?.state || '',
          Address_Pincode: order.address?.pincode || '',
          Address_Mobile: order.address?.mobile || '',
          Address_Type: order.address?.address_type || '',
          Status: order.status || 'processing',
          CancellationReason: order.cancellation_reason || '',
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XXLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XXLSX.writeFile(wb, 'orders.xlsx');
  };

  // Live card metrics safely tied directly to baseline orders state
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'processing' || o.status === 'approved').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  // Modern UI theme styles
  const styles = {
    container: {
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1e1e2f' : '#f8f9fa',
      color: darkMode ? '#f5f5f5' : '#1e1e2f',
      transition: 'all 0.3s ease',
      fontFamily: 'system-ui, sans-serif'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    themeBtn: { fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' },
    filters: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
    input: {
      padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc',
      backgroundColor: darkMode ? '#2a2a3d' : '#fff', color: darkMode ? '#f5f5f5' : '#000'
    },
    select: {
      padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc',
      backgroundColor: darkMode ? '#2a2a3d' : '#fff', color: darkMode ? '#f5f5f5' : '#000'
    },
    exportBtn: {
      cursor: 'pointer', backgroundColor: darkMode ? '#16a34a' : '#22c55e',
      color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px'
    },
    tableContainer: { overflowX: 'auto', width: '100%' },
    table: { width: '100%', borderCollapse: 'collapse', transition: 'all 0.3s ease' },
    thtd: { padding: '0.75rem', border: `1px solid ${darkMode ? '#444' : '#ccc'}`, textAlign: 'left', transition: 'all 0.3s ease', fontSize: '0.9rem' },
    purityBadge: { backgroundColor: '#facc15', padding: '0.2rem 0.5rem', borderRadius: '5px', color: '#000', fontWeight: 'bold' },
    statusBadge: (status) => {
      let bg = '#22c55e';
      if (status === 'cancelled') bg = '#ef4444';
      if (status === 'processing') bg = '#f59e0b';
      if (status === 'approved') bg = '#3b82f6';
      if (status === 'delivered') bg = '#10b981';
      return {
        padding: '0.2rem 0.5rem',
        borderRadius: '5px',
        color: '#fff',
        backgroundColor: bg,
        textTransform: 'capitalize',
        fontWeight: '500'
      };
    },
    btn: (bg, color) => ({
      margin: '0.2rem', padding: '0.4rem 0.6rem',
      backgroundColor: bg, color: color, border: 'none', borderRadius: '5px', cursor: 'pointer',
      transition: '0.3s', fontSize: '0.85rem'
    }),
    cancelledRow: { opacity: 0.6, backgroundColor: darkMode ? '#3a2424' : '#fee2e2' },
    addressInfo: { lineHeight: '1.4', fontSize: '0.85rem' },
    trHover: { cursor: 'pointer', transition: 'background-color 0.2s ease' },
    cardsContainer: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
    card: (bgColor, active) => ({
      flex: '1 1 150px',
      backgroundColor: active ? (darkMode ? '#fff' : '#000') : bgColor,
      color: active ? (darkMode ? '#000' : '#fff') : '#fff',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      minWidth: '120px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: active ? '2px solid #3b82f6' : '2px solid transparent'
    }),
    cardTitle: { fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'capitalize' },
    cardCount: { fontSize: '1.5rem', fontWeight: 'bold' }
  };

  // Flatten nested arrays and apply dynamic searching / filtering logic cleanly
  const filteredOrders = orders.flatMap((order) =>
    (order.order_summary || []).filter(item => {
      const matchTitle = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchPurity = purityFilter === '' || item.purity === purityFilter;
      const matchPrice =
        priceFilter === '' ||
        (priceFilter === 'low' && parseFloat(item.price) < 50000) ||
        (priceFilter === 'mid' && parseFloat(item.price) >= 50000 && parseFloat(item.price) <= 500000) ||
        (priceFilter === 'high' && parseFloat(item.price) > 500000);
      
      const matchStatus = statusFilter === '' || 
        order.status === statusFilter || 
        (statusFilter === 'completed' && order.status === 'delivered');
        
      return matchTitle && matchPurity && matchPrice && matchStatus;
    }).map(item => ({ 
      ...item, 
      orderStatus: order.status, // This correctly reflects updates made to parent state array
      orderId: order.id, 
      order 
    }))
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Order Details Management</h2>
        <button style={styles.themeBtn} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Summary Filter Cards */}
      <div style={styles.cardsContainer}>
        <div style={styles.card(darkMode ? '#2563eb' : '#3b82f6', statusFilter === '')} onClick={() => setStatusFilter('')}>
          <div style={styles.cardTitle}>Total Orders</div>
          <div style={styles.cardCount}>{totalOrders}</div>
        </div>
        <div style={styles.card(darkMode ? '#16a34a' : '#22c55e', statusFilter === 'completed')} onClick={() => setStatusFilter('completed')}>
          <div style={styles.cardTitle}>Completed / Delivered</div>
          <div style={styles.cardCount}>{completedOrders}</div>
        </div>
        <div style={styles.card(darkMode ? '#fbbf24' : '#f59e0b', statusFilter === 'processing')} onClick={() => setStatusFilter('processing')}>
          <div style={styles.cardTitle}>Processing</div>
          <div style={styles.cardCount}>{pendingOrders}</div>
        </div>
        <div style={styles.card(darkMode ? '#dc2626' : '#ef4444', statusFilter === 'cancelled')} onClick={() => setStatusFilter('cancelled')}>
          <div style={styles.cardTitle}>Cancelled</div>
          <div style={styles.cardCount}>{cancelledOrders}</div>
        </div>
      </div>

      {/* Interactive Filters Grid */}
      <div style={styles.filters}>
        <input type="text" placeholder="Search product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
        <select value={purityFilter} onChange={(e) => setPurityFilter(e.target.value)} style={styles.select}>
          <option value="">All Purities</option>
          <option value="18K">18K</option>
          <option value="22K">22K</option>
          <option value="24K">24K</option>
        </select>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} style={styles.select}>
          <option value="">Price Range</option>
          <option value="low">Below ₹50,000</option>
          <option value="mid">₹50,000 - ₹5,000,000</option>
          <option value="high">Above ₹5,000,000</option>
        </select>
        <button style={styles.exportBtn} onClick={exportToExcel}>📁 Export to Excel</button>
      </div>

      {/* Responsive Table Grid */}
      {loading ? (
        <p>Loading records from database...</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={{ backgroundColor: darkMode ? '#2a2a3d' : '#e9ecef' }}>
                {[
                  'Image', 'Product', 'Quantity', 'Purity', 'Price', 'Total Price', 
                  'Advance Paid', 'Balance Due', 'Payment Type', 'Payment Status', 'Method', 
                  'Shipping Address', 'Status', 'Notes', 'Update Status', 'Action'
                ].map((th, i) => (
                  <th key={i} style={styles.thtd}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map((item, idx) => {
                const itemPrice = parseFloat(item.price) || 0;
                const totalPrice = item.quantity * itemPrice;
                const advancePaid = parseFloat(item.order.advance_paid) || 0;
                const balanceDue = parseFloat(item.order.balance_due) || 0;
                const isCancelled = item.orderStatus === 'cancelled';

                return (
                  <tr key={idx} style={{ ...(isCancelled ? styles.cancelledRow : {}), ...styles.trHover }}>
                    <td style={styles.thtd}>
                      {item.image ? <img src={item.image} alt={item.name} style={{ width: '80px', borderRadius: '4px', objectFit: 'contain' }} /> : '—'}
                    </td>
                    <td style={styles.thtd}><strong>{item.name}</strong></td>
                    <td style={styles.thtd}>{item.quantity}</td>
                    <td style={styles.thtd}><span style={styles.purityBadge}>{item.purity}</span></td>
                    <td style={styles.thtd}>₹{itemPrice.toLocaleString('en-IN')}</td>
                    <td style={styles.thtd}>₹{totalPrice.toLocaleString('en-IN')}</td>
                    
                    {/* Advance Paid Column */}
                    <td style={{ ...styles.thtd, color: advancePaid > 0 ? '#22c55e' : 'inherit' }}>
                      ₹{advancePaid.toLocaleString('en-IN')}
                    </td>
                    {/* Balance Due Column */}
                    <td style={{ ...styles.thtd, color: balanceDue > 0 ? '#ef4444' : 'inherit', fontWeight: balanceDue > 0 ? '600' : 'normal' }}>
                      ₹{balanceDue.toLocaleString('en-IN')}
                    </td>
                    
                    {/* Initial Payment Type Column */}
                    <td style={styles.thtd}>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: darkMode ? '#333' : '#e5e7eb' }}>
                        {item.order.initial_payment_type || '—'}
                      </span>
                    </td>

                    {/* Payment Status Column */}
                    <td style={styles.thtd}>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#fff', background: item.order.payment_status === 'partial_paid' ? '#f59e0b' : '#22c55e' }}>
                        {(item.order.payment_status || '—').replace('_', ' ')}
                      </span>
                    </td>

                    <td style={styles.thtd}>{item.order.payment_method || '—'}</td>
                    
                    <td style={styles.thtd}>
                      {item.order.address ? (
                        <div style={styles.addressInfo}>
                          <strong>{item.order.address.name}</strong><br />
                          {item.order.address.flat}, {item.order.address.street}<br />
                          {item.order.address.city}, {item.order.address.state} - {item.order.address.pincode}<br />
                          <small>Phone: {item.order.address.mobile}</small><br />
                          <span style={{ fontSize: '0.7rem', color: '#888' }}>Tag: {item.order.address.address_type}</span>
                        </div>
                      ) : 'No address specified'}
                    </td>

                    <td style={styles.thtd}>
                      <span style={styles.statusBadge(item.orderStatus)}>{item.orderStatus}</span>
                    </td>
                    <td style={styles.thtd}>
                      {isCancelled && item.order.cancellation_reason ? (
                        <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{item.order.cancellation_reason}</span>
                      ) : '—'}
                    </td>

                    <td style={styles.thtd}>
                      {!isCancelled ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <button style={styles.btn(darkMode?'#d97706':'#fbbf24','#000')} onClick={() => handleStatusChange(item.orderId, 'processing')}>🕐 Process</button>
                          <button style={styles.btn(darkMode?'#16a34a':'#22c55e','#fff')} onClick={() => handleStatusChange(item.orderId, 'approved')}>✅ Approve</button>
                          <button style={styles.btn(darkMode?'#2563eb':'#3b82f6','#fff')} onClick={() => handleStatusChange(item.orderId, 'completed')}>🏁 Complete</button>
                          <button style={styles.btn('#10b981','#fff')} onClick={() => handleStatusChange(item.orderId, 'delivered')}>📦 Deliver</button>
                        </div>
                      ) : (
                        <span style={{ color: '#888', fontSize: '0.85rem' }}>No Actions</span>
                      )}
                    </td>

                    <td style={styles.thtd}>
                      <button style={styles.btn('#ef4444','#fff')} onClick={() => handleDelete(item.orderId)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="16" style={{ ...styles.thtd, textAlign: 'center', padding: '2rem' }}>
                    No matching order records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderTable;

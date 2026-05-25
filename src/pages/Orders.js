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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://rendergoldapp-1.onrender.com/order/all`);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch('https://rendergoldapp-1.onrender.com/order/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        const result = await res.json();
        console.error('Failed to update status:', result.message);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`https://rendergoldapp-1.onrender.com/order/delete/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        const result = await res.json();
        console.error('Failed to delete order:', result.message);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

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
          TotalPrice: item.quantity > 1 ? (parseFloat(item.price) * item.quantity).toFixed(2) : item.price,
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
          Status: order.status || 'Processing',
          CancellationReason: order.cancellation_reason || '',
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  };

  // Compute summary counts
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'processing' || o.status === 'approved').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  // Styles for dark/light theme
  const styles = {
    container: {
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1e1e2f' : '#f8f9fa',
      color: darkMode ? '#f5f5f5' : '#1e1e2f',
      transition: 'all 0.3s ease',
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
    table: { width: '100%', borderCollapse: 'collapse', transition: 'all 0.3s ease' },
    thtd: { padding: '0.5rem', border: `1px solid ${darkMode ? '#444' : '#ccc'}`, textAlign: 'left', transition: 'all 0.3s ease' },
    purityBadge: { backgroundColor: '#facc15', padding: '0.2rem 0.5rem', borderRadius: '5px' },
    statusBadge: (status) => ({
      padding: '0.2rem 0.5rem',
      borderRadius: '5px',
      color: '#fff',
      backgroundColor: status === 'cancelled' ? '#ef4444' : '#22c55e'
    }),
    btn: (bg, color) => ({
      margin: '0 0.2rem', padding: '0.3rem 0.5rem',
      backgroundColor: bg, color: color, border: 'none', borderRadius: '5px', cursor: 'pointer',
      transition: '0.3s',
    }),
    cancelledRow: { opacity: 0.6 },
    addressInfo: { lineHeight: '1.2' },
    trHover: { cursor: 'pointer', transition: 'background-color 0.2s ease' },
    cardsContainer: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
    card: (bgColor, active) => ({
      flex: '1 1 150px',
      backgroundColor: active ? '#000' : bgColor,
      color: '#fff',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      minWidth: '120px',
      cursor: 'pointer',
      transition: '0.3s'
    }),
    cardTitle: { fontSize: '0.9rem', marginBottom: '0.5rem' },
    cardCount: { fontSize: '1.5rem', fontWeight: 'bold' }
  };

  // Filtered orders for table
  const filteredOrders = orders.flatMap((order) =>
    (order.order_summary || []).filter(item => {
      const matchTitle = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchPurity = purityFilter === '' || item.purity === purityFilter;
      const matchPrice =
        priceFilter === '' ||
        (priceFilter === 'low' && parseFloat(item.price) < 10000) ||
        (priceFilter === 'mid' && parseFloat(item.price) >= 10000 && parseFloat(item.price) <= 30000) ||
        (priceFilter === 'high' && parseFloat(item.price) > 30000);
      const matchStatus = statusFilter === '' || order.status === statusFilter;
      return matchTitle && matchPurity && matchPrice && matchStatus;
    }).map(item => ({ ...item, orderStatus: order.status, orderId: order.id, order }))
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Order Details</h2>
        <button style={styles.themeBtn} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardsContainer}>
        <div style={styles.card(darkMode ? '#2563eb' : '#3b82f6', statusFilter === '')} onClick={() => setStatusFilter('')}>
          <div style={styles.cardTitle}>Total Orders</div>
          <div style={styles.cardCount}>{totalOrders}</div>
        </div>
        <div style={styles.card(darkMode ? '#16a34a' : '#22c55e', statusFilter === 'completed')} onClick={() => setStatusFilter('completed')}>
          <div style={styles.cardTitle}>Completed</div>
          <div style={styles.cardCount}>{completedOrders}</div>
        </div>
        <div style={styles.card(darkMode ? '#fbbf24' : '#f59e0b', statusFilter === 'processing')} onClick={() => setStatusFilter('processing')}>
          <div style={styles.cardTitle}>processing</div>
          <div style={styles.cardCount}>{pendingOrders}</div>
        </div>
        <div style={styles.card(darkMode ? '#dc2626' : '#ef4444', statusFilter === 'cancelled')} onClick={() => setStatusFilter('cancelled')}>
          <div style={styles.cardTitle}>Cancelled</div>
          <div style={styles.cardCount}>{cancelledOrders}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input type="text" placeholder="Search product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
        <select value={purityFilter} onChange={(e) => setPurityFilter(e.target.value)} style={styles.select}>
          <option value="">All Purity</option>
          <option value="18K">18k</option>
          <option value="22K">22k</option>
          <option value="24K">24k</option>
        </select>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} style={styles.select}>
          <option value="">Price Range</option>
          <option value="low">Below ₹10,000</option>
          <option value="mid">₹10,000 - ₹30,000</option>
          <option value="high">Above ₹30,000</option>
        </select>
        <button style={styles.exportBtn} onClick={exportToExcel}>📁 Export</button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {['Image','Product','Quantity','Purity','Price','Total Price','Payment','Address','Status','Cancellation Reason','Actions','Delete'].map((th, i) => (
                <th key={i} style={styles.thtd}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map((item, idx) => {
              const totalPrice = item.quantity > 1 ? parseFloat(item.price) * item.quantity : null;
              return (
                <tr key={idx} style={{ ...(item.orderStatus === 'cancelled' ? styles.cancelledRow : {}), ...styles.trHover }}>
                  <td style={styles.thtd}>{item.image ? <img src={item.image} alt={item.name} style={{ width: '100px' }} /> : '—'}</td>
                  <td style={styles.thtd}>{item.name}</td>
                  <td style={styles.thtd}>{item.quantity}</td>
                  <td style={styles.thtd}><span style={styles.purityBadge}>{item.purity}</span></td>
                  <td style={styles.thtd}>₹{parseFloat(item.price).toLocaleString('en-IN')}</td>
                  <td style={styles.thtd}>{totalPrice ? `₹${totalPrice.toLocaleString('en-IN')}` : '—'}</td>
                  <td style={styles.thtd}>{item.order.payment_method}</td>
                  <td style={styles.thtd}>
                    {item.order.address ? (
                      <div style={styles.addressInfo}>
                        <strong>{item.order.address.name}</strong><br />
                        {item.order.address.flat}, {item.order.address.street}<br />
                        {item.order.address.city}, {item.order.address.state} - {item.order.address.pincode}<br />
                        <small>{item.order.address.mobile}</small><br />
                        <em>{item.order.address.address_type}</em>
                      </div>
                    ) : 'No address found'}
                  </td>
                  <td style={styles.thtd}>
                    <span style={styles.statusBadge(item.orderStatus)}>{item.orderStatus}</span>
                  </td>
                  <td style={styles.thtd}>{item.orderStatus === 'cancelled' && item.order.cancellation_reason ? <strong>{item.order.cancellation_reason}</strong> : '—'}</td>
                  <td style={styles.thtd}>
                    {item.orderStatus !== 'cancelled' && (
                      <>
                        <button style={styles.btn(darkMode?'#d97706':'#fbbf24','#000')} onClick={() => handleStatusChange(item.orderId, 'processing')}>🕐 Processing</button>
                        <button style={styles.btn(darkMode?'#16a34a':'#22c55e','#fff')} onClick={() => handleStatusChange(item.orderId, 'approved')}>✅ Approve</button>
                        <button style={styles.btn(darkMode?'#2563eb':'#3b82f6','#fff')} onClick={() => handleStatusChange(item.orderId, 'completed')}>🏁 Complete</button>
                      </>
                    )}
                  </td>
                  <td style={styles.thtd}><button style={styles.btn('#ef4444','#fff')} onClick={() => handleDelete(item.orderId)}><FaTrash /></button></td>
                </tr>
              )
            }) : (
              <tr><td colSpan="12" style={styles.thtd}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderTable;

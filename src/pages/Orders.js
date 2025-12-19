import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../App.css';
import { FaTrash } from 'react-icons/fa';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [purityFilter, setPurityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  return (
    <div className="order-container">
      <h2>Order Details</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={purityFilter} onChange={(e) => setPurityFilter(e.target.value)}>
          <option value="">All Purity</option>
          <option value="18K">18k</option>
          <option value="22K">22k</option>
          <option value="24K">24k</option>
        </select>

        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="">Price Range</option>
          <option value="low">Below ₹10,000</option>
          <option value="mid">₹10,000 - ₹30,000</option>
          <option value="high">Above ₹30,000</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="export-btn" onClick={exportToExcel}>📁 Export</button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Purity</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Payment</th>
              <th>Address</th>
              <th>Status</th>
              <th>Cancellation Reason</th>
              <th>Actions</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.flatMap((order, orderIndex) =>
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
                }).map((item, itemIndex) => {
                  const totalPrice =
                    item.quantity > 1
                      ? parseFloat(item.price) * item.quantity
                      : null;

                  return (
                    <tr key={`${orderIndex}-${itemIndex}`} className={order.status === 'cancelled' ? 'cancelled-row' : ''}>
                      <td>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100px', height: 'auto' }}
                          />
                        ) : '—'}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td><span className="purity-badge">{item.purity}</span></td>
                      <td>₹{parseFloat(item.price).toLocaleString('en-IN')}</td>
                      <td>{totalPrice ? `₹${totalPrice.toLocaleString('en-IN')}` : '—'}</td>
                      <td>{order.payment_method}</td>
                      <td>
                        {order.address ? (
                          <div className="address-info">
                            <strong>{order.address.name}</strong><br />
                            {order.address.flat}, {order.address.street}<br />
                            {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                            <small>{order.address.mobile}</small><br />
                            <em>{order.address.address_type}</em>
                          </div>
                        ) : 'No address found'}
                      </td>
                      <td>
                        <span className={`status-badge ${order.status === 'cancelled' ? 'cancelled' : ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === 'cancelled' && order.cancellation_reason ? (
                          <strong>{order.cancellation_reason}</strong>
                        ) : '—'}
                      </td>
                      <td>
                        {order.status !== 'cancelled' && (
                          <>
                            <button onClick={() => handleStatusChange(order.id, 'processing')} className="btn-processing">🕐 Processing</button>
                            <button onClick={() => handleStatusChange(order.id, 'approved')} className="btn-approve">✅ Approve</button>
                            <button onClick={() => handleStatusChange(order.id, 'completed')} className="btn-complete">🏁 Complete</button>
                          </>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(order.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )
            ) : (
              <tr><td colSpan="12">No orders found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderTable;

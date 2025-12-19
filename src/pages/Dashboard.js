import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaStore,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function AdvancedDashboard() {
  const [darkMode, setDarkMode] = useState(true);

  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersRes, sellersRes, productsRes, ordersRes, loansRes] =
        await Promise.all([
          axios.get("https://rendergoldapp-1.onrender.com/users/all"),
          axios.get("https://rendergoldapp-1.onrender.com/seller/all"),
          axios.get("https://rendergoldapp-1.onrender.com/products/all"),
          axios.get("https://rendergoldapp-1.onrender.com/order/all"),
          axios.get("https://rendergoldapp-1.onrender.com/loan/all"),
        ]);

      setUsers(usersRes.data || []);
      setSellers(sellersRes.data || []);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setLoans(loansRes.data || []);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  const revenueData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Orders",
        data: Array.from({ length: 12 }, (_, i) => (orders.length / 12) * (i + 1)),
        borderColor: "#facc15",
        backgroundColor: "rgba(250,204,21,0.25)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const userGrowthData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Users",
        data: Array.from({ length: 12 }, (_, i) => (users.length / 12) * (i + 1)),
        backgroundColor: "#facc15",
      },
      {
        label: "Sellers",
        data: Array.from({ length: 12 }, (_, i) => (sellers.length / 12) * (i + 1)),
        backgroundColor: "#22c55e",
      },
    ],
  };

  return (
    <div className={`layout ${darkMode ? "dark" : "light"}`}>
      <main className="main">
        <div className="header">
          <h1>Dashboardsss</h1>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="stats">
          <StatCard icon={<FaUsers />} title="Total Users" value={users.length} />
          <StatCard icon={<FaStore />} title="Total Sellers" value={sellers.length} />
          <StatCard icon={<FaBox />} title="Total Products" value={products.length} />
          <StatCard icon={<FaShoppingCart />} title="Total Orders" value={orders.length} />
          <StatCard icon={<FaMoneyCheckAlt />} title="Gold Loan Requests" value={loans.length} />
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>Revenue Overview</h3>
            <Line data={revenueData} />
          </div>
          <div className="chart-card">
            <h3>User Growth</h3>
            <Bar data={userGrowthData} />
          </div>
        </div>

        <div className="table-card">
          <h3>Recent Orders</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 7).map((o, i) => (
                  <tr key={i}>
                    <td>{o?._id || "N/A"}</td>
                    <td>{o?.userName || "User"}</td>
                    <td>{o?.productName || "Product"}</td>
                    <td>₹{o?.amount || 0}</td>
                    <td className="success">{o?.status || "Placed"}</td>
                    <td>{new Date(o?.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: Segoe UI, sans-serif; }

        .layout { min-height: 100vh; }

        .dark { --bg:#0b1220; --card:#0f172a; --text:#fff; }
        .light { --bg:#f4f6f8; --card:#fff; --text:#111; }

        .main {
          background: var(--bg);
          color: var(--text);
          padding: 30px;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .theme-toggle {
          background: none;
          border: none;
          color: gold;
          font-size: 22px;
          cursor: pointer;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .card {
          background: var(--card);
          padding: 20px;
          border-radius: 14px;
          display: flex;
          gap: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,.15);
        }

        .icon { font-size: 26px; color: gold; }

        .charts {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 22px;
          margin-top: 26px;
        }

        .chart-card, .table-card {
          background: var(--card);
          padding: 22px;
          border-radius: 14px;
        }

        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; border-bottom: 1px solid #1f2937; }
        .success { color: #22c55e; font-weight: 600; }

        @media (max-width: 1024px) {
          .charts { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ icon, title, value }) => (
  <div className="card">
    <div className="icon">{icon}</div>
    <div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  </div>
);

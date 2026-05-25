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
      const [
        usersRes,
        sellersRes,
        productsRes,
        ordersRes,
        loansRes,
      ] = await Promise.all([
        axios.get("https://rendergoldapp-1.onrender.com/users/all"),
        axios.get("https://rendergoldapp-1.onrender.com/seller/all"),
        axios.get("https://rendergoldapp-1.onrender.com/products/all"),
        axios.get("https://rendergoldapp-1.onrender.com/order/all"),
        axios.get("https://rendergoldapp-1.onrender.com/loan/all"),
      ]);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setSellers(Array.isArray(sellersRes.data) ? sellersRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

      // ✅ VERY IMPORTANT FIX
      setLoans(
        Array.isArray(loansRes.data?.data)
          ? loansRes.data.data
          : []
      );
    } catch (err) {
      console.error("Dashboard API Error:", err);
    }
  };

  /* ================= LOANS ================= */
  const totalLoanCount = loans.length;

  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + Number(loan.loanamount || 0),
    0
  );

  /* ================= REVENUE ================= */
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  const todayRevenue = orders.reduce((sum, o) => {
    const d = new Date(o.order_date);
    return d.toDateString() === today.toDateString()
      ? sum + Number(o.total_amount || 0)
      : sum;
  }, 0);

  const weeklyRevenue = orders.reduce((sum, o) => {
    const d = new Date(o.order_date);
    return d >= startOfWeek ? sum + Number(o.total_amount || 0) : sum;
  }, 0);

  const monthlyRevenue = orders.reduce((sum, o) => {
    const d = new Date(o.order_date);
    return d >= startOfMonth ? sum + Number(o.total_amount || 0) : sum;
  }, 0);

  /* ================= CHARTS ================= */
  const revenueData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Revenue",
        data: Array.from({ length: 12 }, (_, i) => (totalRevenue / 12) * (i + 1)),
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
    <div className={darkMode ? "dark" : "light"}>
      <main className="main">
        <div className="header">
          <h1>Admin Dashboard</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="stats">
          <StatCard icon={<FaUsers />} title="Users" value={users.length} />
          <StatCard icon={<FaStore />} title="Sellers" value={sellers.length} />
          <StatCard icon={<FaBox />} title="Products" value={products.length} />
          <StatCard icon={<FaShoppingCart />} title="Orders" value={orders.length} />
          <StatCard icon={<FaMoneyCheckAlt />} title="Loan Requests" value={totalLoanCount} />
          <StatCard
            icon={<FaMoneyCheckAlt />}
            title="Total Loan Amount"
            value={`₹${totalLoanAmount.toLocaleString("en-IN")}`}
          />
        </div>

        {/* ================= REVENUE ================= */}
        <h2 className="section">Revenue Overview</h2>
        <div className="stats">
          <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} />
          <StatCard title="Today Revenue" value={`₹${todayRevenue.toLocaleString("en-IN")}`} />
          <StatCard title="Weekly Revenue" value={`₹${weeklyRevenue.toLocaleString("en-IN")}`} />
          <StatCard title="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString("en-IN")}`} />
        </div>

        {/* ================= CHARTS ================= */}
        <div className="charts">
          <div className="chart-card"><Line data={revenueData} /></div>
          <div className="chart-card"><Bar data={userGrowthData} /></div>
        </div>
      </main>

      <style>{`
        * { margin:0; box-sizing:border-box; font-family:Segoe UI; }
        .dark { --bg:#0b1220; --card:#0f172a; --text:#fff; }
        .light { --bg:#f4f6f8; --card:#fff; --text:#111; }
        .main { background:var(--bg); color:var(--text); min-height:100vh; padding:30px; }
        .header { display:flex; justify-content:space-between; margin-bottom:20px; }
        button { background:none; border:none; color:gold; font-size:22px; cursor:pointer; }
        .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; }
        .card { background:var(--card); padding:20px; border-radius:14px; display:flex; gap:14px; }
        .icon { font-size:26px; color:gold; }
        .section { margin:30px 0 15px; }
        .charts { display:grid; grid-template-columns:2fr 1fr; gap:22px; margin-top:30px; }
        .chart-card { background:var(--card); padding:20px; border-radius:14px; }
        @media(max-width:900px){ .charts{grid-template-columns:1fr;} }
      `}</style>
    </div>
  );
}

const StatCard = ({ icon, title, value }) => (
  <div className="card">
    {icon && <div className="icon">{icon}</div>}
    <div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  </div>
);

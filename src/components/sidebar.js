import React, { useState } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaStore,
  FaMoneyCheckAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function SidebarOnly() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="brand">{isOpen ? "GBuyers" : "GB"}</div>

        <nav>
          <NavLink to="/dashboard" className="nav-item">
            <FaTachometerAlt />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/users" className="nav-item">
            <FaUsers />
            {isOpen && <span>Users</span>}
          </NavLink>

          <NavLink to="/products" className="nav-item">
            <FaBox />
            {isOpen && <span>Products</span>}
          </NavLink>

          <NavLink to="/orders" className="nav-item">
            <FaShoppingCart />
            {isOpen && <span>Orders</span>}
          </NavLink>

          <NavLink to="/SellerTable" className="nav-item">
            <FaStore />
            {isOpen && <span>Sellers</span>}
          </NavLink>

          <NavLink to="/GoldLoanRequest" className="nav-item">
            <FaMoneyCheckAlt />
            {isOpen && <span>Gold Loans</span>}
          </NavLink>
        </nav>
      </aside>

      {/* ===== TOGGLE BUTTON ===== */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* ===== STYLES ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Segoe UI, sans-serif;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background: #111827;
          color: #fff;
          transition: width 0.3s ease;
          overflow: hidden;
        }

        .sidebar.open { width: 240px; }
        .sidebar.closed { width: 70px; }

        .brand {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: bold;
          color: gold;
        }

        nav {
          margin-top: 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          color: #9ca3af;
          text-decoration: none;
          font-size: 15px;
        }

        .sidebar.closed .nav-item {
          justify-content: center;
        }

        .nav-item:hover {
          background: #1f2937;
          color: gold;
        }

        .toggle-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          background: gold;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          z-index: 2000;
        }
      `}</style>
    </>
  );
}

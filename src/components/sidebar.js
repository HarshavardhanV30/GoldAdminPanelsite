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
  FaEllipsisH,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function SidebarOnly() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="brand">{isOpen ? "G Buyer" : "GB"}</div>

        <nav>
          <NavLink to="/dashboard" className="nav-item">
            <FaTachometerAlt className="icon" />
            {isOpen && <span className="nav-text">Dashboard</span>}
            {isOpen && <FaEllipsisH className="ellipsis" />}
          </NavLink>

          <NavLink to="/users" className="nav-item">
            <FaUsers className="icon" />
            {isOpen && <span className="nav-text">Users</span>}
            {isOpen && <FaEllipsisH className="ellipsis" />}
          </NavLink>

          <NavLink to="/products" className="nav-item">
            <FaBox className="icon" />
            {isOpen && <span className="nav-text">Products</span>}
            {isOpen && <FaEllipsisH className="ellipsis" />}
          </NavLink>

          <NavLink to="/orders" className="nav-item">
            <FaShoppingCart className="icon" />
            {isOpen && <span className="nav-text">Orders</span>}
            {isOpen && <FaEllipsisH className="ellipsis" />}
          </NavLink>

          <NavLink to="/SellerTable" className="nav-item">
            <FaStore className="icon" />
            {isOpen && <span className="nav-text">Sellers</span>}
            {isOpen && <FaEllipsisH className="ellipsis" />}
          </NavLink>

          <NavLink to="/GoldLoanRequest" className="nav-item">
            <FaMoneyCheckAlt className="icon" />
            {isOpen && <span className="nav-text">Gold Loans</span>}
            {isOpen && <FaEllipsisH className="ellipsis" />}
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
          display: flex;
          flex-direction: column;
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
          border-bottom: 1px solid #333;
        }

        nav {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 16px;
          color: #9ca3af;
          text-decoration: none;
          font-size: 15px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item .icon {
          min-width: 24px;
          font-size: 18px;
        }

        .nav-item .ellipsis {
          font-size: 16px;
          color: #9ca3af;
          cursor: pointer;
        }

        .sidebar.closed .nav-item {
          justify-content: center;
        }

        .nav-item:hover {
          background: #1f2937;
          color: gold;
        }

        .nav-item.active {
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}

import React, { useState } from "react";
import {
  FaUsers,
  FaShoppingBag,
  FaStore,
  FaMoneyCheckAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaEllipsisH,
  FaFileAlt,
  FaTools,
  FaImage,
  FaGem,
  FaFolderOpen,
  FaPhoneAlt,
  FaChartLine,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function SidebarOnly() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* ================= BRAND ================= */}
        <div className="brand">
          {isOpen ? "G Buyer" : "GB"}
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav>

          {/* Dashboard */}
          <NavLink to="/dashboard" className="nav-item">
            <FaTachometerAlt className="icon" />

            {isOpen && (
              <span className="nav-text">
                Dashboard
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Users */}
          <NavLink to="/users" className="nav-item">
            <FaUsers className="icon" />

            {isOpen && (
              <span className="nav-text">
                Users
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Policy */}
          <NavLink to="/policy" className="nav-item">
            <FaFileAlt className="icon" />

            {isOpen && (
              <span className="nav-text">
                Policy
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Orders */}
          <NavLink to="/orders" className="nav-item">
            <FaShoppingBag className="icon" />

            {isOpen && (
              <span className="nav-text">
                Orders
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Sellers */}
          <NavLink to="/SellerTable" className="nav-item">
            <FaStore className="icon" />

            {isOpen && (
              <span className="nav-text">
                Sellers
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Gold Repair */}
          <NavLink
            to="/goldrepairscreen"
            className="nav-item"
          >
            <FaTools className="icon" />

            {isOpen && (
              <span className="nav-text">
                Gold Repair
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Gold Loans */}
          <NavLink
            to="/GoldLoanRequest"
            className="nav-item"
          >
            <FaMoneyCheckAlt className="icon" />

            {isOpen && (
              <span className="nav-text">
                Gold Loans
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Add Banners */}
          <NavLink
            to="/AddBanners"
            className="nav-item"
          >
            <FaImage className="icon" />

            {isOpen && (
              <span className="nav-text">
                Add Banners
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Add Gold Products */}
          <NavLink
            to="/AddGoldProducts"
            className="nav-item"
          >
            <FaGem className="icon" />

            {isOpen && (
              <span className="nav-text">
                Add Gold Products
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Add Category */}
          <NavLink
            to="/categoryName"
            className="nav-item"
          >
            <FaFolderOpen className="icon" />

            {isOpen && (
              <span className="nav-text">
                Add Category
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Add Phone Number */}
          <NavLink
            to="/AddPhonenumbers"
            className="nav-item"
          >
            <FaPhoneAlt className="icon" />

            {isOpen && (
              <span className="nav-text">
                Add Phone Number
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Add Gold Price */}
          <NavLink
            to="/AddGoldPrice"
            className="nav-item"
          >
            <FaChartLine className="icon" />

            {isOpen && (
              <span className="nav-text">
                Add Gold Price
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>


          {/* Sell Gold Price */}
          <NavLink
            to="/SellGold"
            className="nav-item"
          >
            <FaHandHoldingUsd className="icon" />

            {isOpen && (
              <span className="nav-text">
                Sell Gold Price
              </span>
            )}

            {isOpen && (
              <FaEllipsisH className="ellipsis" />
            )}
          </NavLink>

        </nav>
      </aside>


      {/* =====================================================
          TOGGLE BUTTON
      ====================================================== */}
      <button
        className={`toggle-btn ${isOpen ? "sidebar-open" : "sidebar-closed"}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>


      {/* =====================================================
          STYLES
      ====================================================== */}
      <style>{`

        /* ================= GLOBAL ================= */

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", Arial, sans-serif;
        }


        /* ================= SIDEBAR ================= */

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;

          height: 100vh;

          background: #111827;

          color: #ffffff;

          transition:
            width 0.3s ease,
            box-shadow 0.3s ease;

          overflow-x: hidden;
          overflow-y: auto;

          display: flex;
          flex-direction: column;

          z-index: 1000;

          box-shadow:
            4px 0 20px rgba(0, 0, 0, 0.15);
        }


        /* OPEN */

        .sidebar.open {
          width: 240px;
        }


        /* CLOSED */

        .sidebar.closed {
          width: 70px;
        }


        /* ================= BRAND ================= */

        .brand {
          height: 70px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 23px;
          font-weight: 800;

          color: #facc15;

          border-bottom:
            1px solid rgba(255, 255, 255, 0.08);

          letter-spacing: 0.5px;

          white-space: nowrap;
        }


        /* ================= NAV ================= */

        nav {
          margin-top: 12px;

          display: flex;
          flex-direction: column;

          padding-bottom: 30px;
        }


        /* ================= NAV ITEM ================= */

        .nav-item {
          min-height: 48px;

          display: flex;
          align-items: center;

          gap: 14px;

          padding: 11px 16px;

          color: #9ca3af;

          text-decoration: none;

          font-size: 14px;
          font-weight: 600;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;

          position: relative;

          white-space: nowrap;

          margin: 2px 8px;

          border-radius: 9px;
        }


        /* ================= ICON ================= */

        .nav-item .icon {
          min-width: 24px;

          width: 20px;
          height: 20px;

          font-size: 18px;

          flex-shrink: 0;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }


        /* ================= TEXT ================= */

        .nav-text {
          flex: 1;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        /* ================= ELLIPSIS ================= */

        .nav-item .ellipsis {
          font-size: 13px;

          color: #6b7280;

          flex-shrink: 0;

          transition: color 0.2s ease;
        }


        /* ================= HOVER ================= */

        .nav-item:hover {
          background: #1f2937;

          color: #facc15;

          transform: translateX(2px);
        }


        .nav-item:hover .icon {
          color: #facc15;

          transform: scale(1.08);
        }


        .nav-item:hover .ellipsis {
          color: #facc15;
        }


        /* ================= ACTIVE ================= */

        .nav-item.active {
          background:
            linear-gradient(
              90deg,
              #facc15,
              #eab308
            );

          color: #111827;

          box-shadow:
            0 4px 12px rgba(250, 204, 21, 0.22);
        }


        .nav-item.active .icon {
          color: #111827;
        }


        .nav-item.active .ellipsis {
          color: #111827;
        }


        /* ================= CLOSED SIDEBAR ================= */

        .sidebar.closed .nav-item {
          justify-content: center;

          gap: 0;

          padding-left: 0;
          padding-right: 0;
        }


        .sidebar.closed .nav-item .icon {
          margin: 0;
        }


        /* ================= TOGGLE BUTTON ================= */

        .toggle-btn {
          position: fixed;

          top: 16px;

          background: #facc15;

          color: #111827;

          border: none;

          width: 38px;
          height: 38px;

          border-radius: 9px;

          cursor: pointer;

          z-index: 2000;

          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 16px;

          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.2);

          transition:
            left 0.3s ease,
            transform 0.2s ease,
            background 0.2s ease;
        }


        /* Toggle when sidebar open */

        .toggle-btn.sidebar-open {
          left: 190px;
        }


        /* Toggle when sidebar closed */

        .toggle-btn.sidebar-closed {
          left: 86px;
        }


        .toggle-btn:hover {
          background: #eab308;

          transform: scale(1.05);
        }


        .toggle-btn:active {
          transform: scale(0.95);
        }


        /* ================= SCROLLBAR ================= */

        .sidebar::-webkit-scrollbar {
          width: 5px;
        }


        .sidebar::-webkit-scrollbar-track {
          background: #111827;
        }


        .sidebar::-webkit-scrollbar-thumb {
          background: #374151;

          border-radius: 10px;
        }


        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }


        /* ================= RESPONSIVE ================= */

        @media (max-width: 768px) {

          .sidebar.open {
            width: 220px;
          }

          .toggle-btn.sidebar-open {
            left: 170px;
          }

        }

      `}</style>
    </>
  );
}

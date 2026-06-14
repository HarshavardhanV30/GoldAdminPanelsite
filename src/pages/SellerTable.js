import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  FaSearch,
  FaEye,
  FaSun,
  FaMoon,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null); // Manages which row's action dropdown is open

  const API_URL = "https://goldbackend-auyv.onrender.com/seller/all";

  /* ================= FETCH DATA ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= CLIENT-SIDE FILTERS EFFECT ================= */
  useEffect(() => {
    let result = products;

    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (minPrice !== "") {
      result = result.filter((p) => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    setFilteredProducts(result);
  }, [searchQuery, minPrice, maxPrice, products]);

  /* ================= CLOSE DROPDOWNS ON DOM CLICK ================= */
  useEffect(() => {
    const closeAllDropdowns = () => setOpenDropdownId(null);
    window.addEventListener("click", closeAllDropdowns);
    return () => window.removeEventListener("click", closeAllDropdowns);
  }, []);

  /* ================= DELETE ACTION ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;

    setLoading(true);
    try {
      await axios.delete(`https://goldbackend-auyv.onrender.com/seller/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS PATCH PIPELINE (APPROVE / REJECT / PENDING) ================= */
  const handleStatusUpdate = async (id, statusValue) => {
    setLoading(true);
    try {
      await axios.patch(
        `https://goldbackend-auyv.onrender.com/seller/${id}/status`,
        { status: statusValue }
      );
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert(`Failed to update product status to ${statusValue}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT SHEET ================= */
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Seller_Products.xlsx");
  };

  /* ================= IMAGE PARSER ================= */
  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  /* ================= DASHBOARD SHORTCUT FILTERS ================= */
  const showAll = () => setFilteredProducts(products);

  const showToday = () =>
    setFilteredProducts(
      products.filter(
        (p) =>
          new Date(p.created_at).toLocaleDateString() ===
          new Date().toLocaleDateString()
      )
    );

  const showHigh = () =>
    setFilteredProducts(products.filter((p) => Number(p.price) > 100000));

  const showLow = () =>
    setFilteredProducts(products.filter((p) => Number(p.price) <= 100000));

  /* ================= PILL BADGE GENERATOR ================= */
  const getStatusStyle = (status) => {
    const normalize = (status || "pending").toLowerCase();
    if (normalize === "approved") return styles.statusApproved;
    if (normalize === "rejected") return styles.statusRejected;
    return styles.statusPending;
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation(); // Stops immediate window-click auto-closure
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode ? "#020617" : "#f8f9fa",
        color: darkMode ? "#e5e7eb" : "#111",
      }}
    >
      {/* GLOBAL LOADING GLASS OVERLAY */}
      {loading && (
        <div style={styles.globalLoaderOverlay}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: 14, fontWeight: "600", letterSpacing: "0.5px" }}>Updating Database Lifecycle...</p>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.searchBox}>
          <FaSearch color={darkMode ? "#94a3b8" : "#64748b"} />
          <input
            placeholder="Search by product name..."
            style={{
              ...styles.searchInput,
              background: darkMode ? "#1e293b" : "#fff",
              color: darkMode ? "#fff" : "#000",
              border: darkMode ? "1px solid #334155" : "1px solid #cbd5e1",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{ cursor: "pointer", fontSize: 20 }}
        >
          {darkMode ? <FaSun color="#facc15" /> : <FaMoon color="#475569" />}
        </div>
      </div>

      <h1 style={styles.title}>Seller Gold Products</h1>
      <p style={styles.subtitle}>Manage and process all raw incoming marketplace listings</p>

      {/* DASHBOARD STATUS COUNTS */}
      <div style={styles.cards}>
        <div style={styles.blueCard} onClick={showAll}>
          <h4>Total Products</h4>
          <h2>{products.length}</h2>
        </div>

        <div style={styles.greenCard} onClick={showToday}>
          <h4>Today</h4>
          <h2>
            {
              products.filter(
                (p) =>
                  new Date(p.created_at).toLocaleDateString() ===
                  new Date().toLocaleDateString()
              ).length
            }
          </h2>
        </div>

        <div style={styles.redCard} onClick={showHigh}>
          <h4>High Amount</h4>
          <h2>{products.filter((p) => Number(p.price) > 100000).length}</h2>
        </div>

        <div style={styles.yellowCard} onClick={showLow}>
          <h4>Low Amount</h4>
          <h2>{products.filter((p) => Number(p.price) <= 100000).length}</h2>
        </div>
      </div>

      {/* FILTER CONSOLE */}
      <div style={styles.filters}>
        <input
          placeholder="Min Price"
          value={minPrice}
          style={{
            ...styles.filterInput,
            background: darkMode ? "#1e293b" : "#fff",
            color: darkMode ? "#fff" : "#000",
            border: darkMode ? "1px solid #334155" : "1px solid #cbd5e1",
          }}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          placeholder="Max Price"
          value={maxPrice}
          style={{
            ...styles.filterInput,
            background: darkMode ? "#1e293b" : "#fff",
            color: darkMode ? "#fff" : "#000",
            border: darkMode ? "1px solid #334155" : "1px solid #cbd5e1",
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          style={styles.actionBtn} 
          onClick={() => { setMinPrice(""); setMaxPrice(""); setSearchQuery(""); }}
        >
          Reset Filters
        </button>
        <button style={{ ...styles.actionBtn, background: "#2563eb", color: "#fff" }} onClick={handleExport}>
          Export XLSX Sheet
        </button>
      </div>

      {/* COMPACT DATA TABLE */}
      <div style={{ ...styles.tableCard, background: darkMode ? "#0f172a" : "#fff", border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ borderBottom: darkMode ? "2px solid #334155" : "2px solid #e2e8f0" }}>
              {[
                "Image",
                "Name",
                "Category",
                "Weight",
                "Purity",
                "Condition",
                "Price",
                "Status",
                "Seller",
                "Mobile",
                "Actions",
              ].map((h) => (
                <th key={h} style={{ ...styles.th, color: darkMode ? "#94a3b8" : "#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} style={{ borderBottom: darkMode ? "1px solid #1e293b" : "1px solid #f1f5f9" }}>
                <td style={styles.td}>
                  {parseImages(p.images)
                    .slice(0, 2)
                    .map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        style={styles.thumb}
                        onClick={() => setEnlargedImage(img)}
                      />
                    ))}
                </td>
                <td style={{ ...styles.td, fontWeight: "500" }}>{p.name}</td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>{p.weight} gm</td>
                <td style={styles.td}>{p.purity}</td>
                <td style={styles.td}>{p.condition}</td>
                <td style={{ ...styles.td, color: "#10b981", fontWeight: "600" }}>₹{p.price}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(p.status)}>
                    {p.status || "Pending"}
                  </span>
                </td>
                <td style={styles.td}>{p.full_name || "N/A"}</td>
                <td style={styles.td}>{p.mobilenumber || "N/A"}</td>
                
                {/* ACTIONS CELL WITH INLINE DROPDOWN POPUP */}
                <td style={{ ...styles.td, position: "relative" }}>
                  <button 
                    style={{ ...styles.dropdownToggleBtn, background: darkMode ? "#1e293b" : "#e2e8f0", color: darkMode ? "#fff" : "#000" }} 
                    onClick={(e) => toggleDropdown(e, p.id)}
                  >
                    Options <FaChevronDown size={10} />
                  </button>

                  {openDropdownId === p.id && (
                    <div style={{ ...styles.dropdownMenu, background: darkMode ? "#1e293b" : "#fff", boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)", border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0" }}>
                      <button 
                        style={{ ...styles.dropdownItem, color: "#10b981" }} 
                        onClick={() => handleStatusUpdate(p.id, "approved")}
                      >
                        <FaCheckCircle /> Approve Item
                      </button>
                      <button 
                        style={{ ...styles.dropdownItem, color: "#ef4444" }} 
                        onClick={() => handleStatusUpdate(p.id, "rejected")}
                      >
                        <FaTimesCircle /> Reject Item
                      </button>
                      <button 
                        style={{ ...styles.dropdownItem, color: "#64748b" }} 
                        onClick={() => handleStatusUpdate(p.id, "pending")}
                      >
                        <FaClock /> Mark Pending
                      </button>
                      <hr style={{ border: "none", borderTop: darkMode ? "1px solid #334155" : "1px solid #f1f5f9", margin: "4px 0" }} />
                      <button 
                        style={{ ...styles.dropdownItem, color: darkMode ? "#fff" : "#000" }} 
                        onClick={() => setActiveProduct(p)}
                      >
                        <FaEye /> View Profile
                      </button>
                      <button 
                        style={{ ...styles.dropdownItem, color: "#b91c1c" }} 
                        onClick={() => handleDelete(p.id)}
                      >
                        <FaTrash /> Delete Record
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={11} style={{ ...styles.td, textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                  No records matching structural filters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL POPUP: PROMPT DETAILED WRAPPER */}
      {activeProduct && (
        <div style={styles.popupOverlay} onClick={() => setActiveProduct(null)}>
          <div style={{ ...styles.popupCard, background: darkMode ? "#1e293b" : "#fff" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: darkMode ? "#fff" : "#000", marginBottom: 16, fontWeight: "700" }}>{activeProduct.name}</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}>
              {parseImages(activeProduct.images).map((img, i) => (
                <img key={i} src={img} alt="" style={styles.bigImage} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Category:</b> {activeProduct.category}</p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Weight:</b> {activeProduct.weight} gm</p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Purity:</b> {activeProduct.purity}</p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Condition:</b> {activeProduct.condition}</p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Price:</b> ₹{activeProduct.price}</p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}>
                <b>Status:</b> <span style={getStatusStyle(activeProduct.status)}>{activeProduct.status || "Pending"}</span>
              </p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Seller:</b> {activeProduct.full_name}</p>
              <p style={{ ...styles.popupText, color: darkMode ? "#cbd5e1" : "#334155" }}><b>Mobile:</b> {activeProduct.mobilenumber}</p>
            </div>
            <button style={{ ...styles.actionBtn, marginTop: 24, width: "100%" }} onClick={() => setActiveProduct(null)}>Close Overlay View</button>
          </div>
        </div>
      )}

      {/* LIGHTBOX MATRIX IMAGE DETECTOR */}
      {enlargedImage && (
        <div style={styles.popupOverlay} onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="" style={{ ...styles.bigImage, maxWidth: "75%", maxHeight: "75vh", objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
};

/* ================= THEMED STRUCTURAL STYLES ================= */
const styles = {
  page: { padding: 24, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", transition: "background 0.2s ease, color 0.2s ease" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, width: "35%" },
  searchInput: { border: "none", outline: "none", padding: "10px 14px", borderRadius: 10, width: "100%", fontSize: 14, transition: "all 0.2s ease" },
  filterInput: { border: "none", outline: "none", padding: "8px 12px", borderRadius: 8, fontSize: 14, width: 130 },
  title: { fontSize: 28, fontWeight: "700", margin: "10px 0 4px 0" },
  subtitle: { color: "#94a3b8", marginBottom: 24, fontSize: 14 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 },
  blueCard: { padding: 20, borderRadius: 16, color: "#fff", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", cursor: "pointer" },
  greenCard: { padding: 20, borderRadius: 16, color: "#fff", background: "linear-gradient(135deg,#10b981,#047857)", cursor: "pointer" },
  redCard: { padding: 20, borderRadius: 16, color: "#fff", background: "linear-gradient(135deg,#ef4444,#b91c1c)", cursor: "pointer" },
  yellowCard: { padding: 20, borderRadius: 16, color: "#111", background: "linear-gradient(135deg,#facc15,#eab308)", cursor: "pointer" },
  filters: { display: "flex", gap: 12, margin: "24px 0", alignItems: "center" },
  actionBtn: { border: "none", background: "#64748b", color: "#fff", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontWeight: "600", fontSize: 13 },
  tableCard: { padding: 20, borderRadius: 16, overflowX: "visible" }, 
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px 16px", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" },
  td: { padding: "14px 16px", fontSize: 14, verticalAlign: "middle" },
  thumb: { width: 48, height: 48, borderRadius: 8, cursor: "pointer", marginRight: 6, objectFit: "cover" },

  // Custom Dropdown Interactive Components
  dropdownToggleBtn: { border: "none", padding: "8px 14px", borderRadius: 8, fontWeight: "600", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  dropdownMenu: { position: "absolute", right: 16, top: "80%", zIndex: 100, borderRadius: 10, padding: "6px", minWidth: "170px", display: "flex", flexDirection: "column", gap: 2 },
  dropdownItem: { background: "none", border: "none", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 13, fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 6, transition: "background 0.15s ease" },

  // Color-coded Status Badges
  statusApproved: { background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  statusRejected: { background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  statusPending: { background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: "700", textTransform: "capitalize" },

  // Loading Modals & Overlays
  globalLoaderOverlay: { position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.65)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff" },
  spinner: { width: 42, height: 42, border: "4px solid rgba(255,255,255,0.2)", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 0.85s linear infinite" },
  popupOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(2px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 },
  popupCard: { padding: 28, borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" },
  popupText: { fontSize: 14, marginBottom: 4 },
  bigImage: { width: 90, height: 90, borderRadius: 10, objectFit: "cover", border: "1px solid #cbd5e1" },
};

// Global CSS Insertion for Spinner Keyframes
if (typeof document !== "undefined") {
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement("style")).sheet;
  try { styleSheet.insertRule("@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }", styleSheet.cssRules.length); } catch (e) {}
}

export default SellerProductTable;

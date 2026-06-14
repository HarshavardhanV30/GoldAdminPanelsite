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
} from "react-icons/fa";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  
  // Professional UI State Management
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  /* ================= CLIENT-SIDE SEARCH & FILTER EFFECT ================= */
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

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

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

  /* ================= STATUS UPDATE (PATCH) ================= */
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

  /* ================= EXPORT ================= */
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

  /* ================= CARD SHORTCUT FILTERS ================= */
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

  /* ================= DYNAMIC STYLE RETRIEVER FOR STATUS PILLS ================= */
  const getStatusStyle = (status) => {
    const normalize = (status || "pending").toLowerCase();
    if (normalize === "approved") return styles.statusApproved;
    if (normalize === "cancelled") return styles.statusCancelled;
    return styles.statusPending;
  };

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode ? "#020617" : "#f8f9fa",
        color: darkMode ? "#e5e7eb" : "#111",
      }}
    >
      {/* GLOBAL BACKGROUND LOADING SCREEN */}
      {loading && (
        <div style={styles.globalLoaderOverlay}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: 12, fontWeight: "500" }}>Processing Requests...</p>
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
      <p style={styles.subtitle}>Manage all seller gold product listings</p>

      {/* DASHBOARD CARDS */}
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

      {/* FILTERS */}
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
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button 
          style={styles.actionBtn} 
          onClick={() => { setMinPrice(""); setMaxPrice(""); setSearchQuery(""); }}
        >
          Reset Filters
        </button>
        <button style={{ ...styles.actionBtn, background: "#2563eb", color: "#fff" }} onClick={handleExport}>
          Export XLSX
        </button>
      </div>

      {/* TABLE */}
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
                <td style={styles.td}>
                  <div style={styles.actionContainer}>
                    {/* DYNAMIC ACTION BUTTONS */}
                    <button
                      disabled={loading}
                      style={{ ...styles.btnApprove, opacity: loading ? 0.6 : 1 }}
                      onClick={() => handleStatusUpdate(p.id, "approved")}
                    >
                      <FaCheckCircle /> Approve
                    </button>

                    <button
                      disabled={loading}
                      style={{ ...styles.btnCancel, opacity: loading ? 0.6 : 1 }}
                      onClick={() => handleStatusUpdate(p.id, "cancelled")}
                    >
                      <FaTimesCircle /> Cancel
                    </button>

                    <button
                      disabled={loading}
                      style={{ ...styles.btnPending, opacity: loading ? 0.6 : 1 }}
                      onClick={() => handleStatusUpdate(p.id, "pending")}
                    >
                      <FaClock /> Pending
                    </button>

                    <button
                      disabled={loading}
                      style={{ ...styles.btnView, opacity: loading ? 0.6 : 1 }}
                      onClick={() => setActiveProduct(p)}
                    >
                      <FaEye />
                    </button>

                    <button
                      disabled={loading}
                      style={{ ...styles.btnDelete, opacity: loading ? 0.6 : 1 }}
                      onClick={() => handleDelete(p.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={11} style={{ ...styles.td, textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP MODAL */}
      {activeProduct && (
        <div style={styles.popupOverlay} onClick={() => setActiveProduct(null)}>
          <div style={{ ...styles.popupCard, background: darkMode ? "#1e293b" : "#fff" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: darkMode ? "#fff" : "#000", marginBottom: 16 }}>{activeProduct.name}</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}>
              {parseImages(activeProduct.images).map((img, i) => (
                <img key={i} src={img} alt="" style={styles.bigImage} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
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
            <button style={{ ...styles.actionBtn, marginTop: 20, width: "100%" }} onClick={() => setActiveProduct(null)}>Close Details</button>
          </div>
        </div>
      )}

      {/* IMAGE ENLARGEMENT POPUP */}
      {enlargedImage && (
        <div style={styles.popupOverlay} onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="" style={{ ...styles.bigImage, maxWidth: "80%", maxHeight: "80vh" }} />
        </div>
      )}
    </div>
  );
};

/* ================= THEMED STYLES ================= */
const styles = {
  page: { padding: 24, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", transition: "background 0.2s ease" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, width: "40%" },
  searchInput: { border: "none", outline: "none", padding: "10px 14px", borderRadius: 10, width: "100%", fontSize: 14 },
  filterInput: { border: "none", outline: "none", padding: "8px 12px", borderRadius: 8, fontSize: 14, width: 120 },
  title: { fontSize: 28, fontWeight: "700", margin: "10px 0 4px 0" },
  subtitle: { color: "#94a3b8", marginBottom: 24 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 },
  blueCard: { padding: 20, borderRadius: 16, color: "#fff", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", cursor: "pointer" },
  greenCard: { padding: 20, borderRadius: 16, color: "#fff", background: "linear-gradient(135deg,#10b981,#047857)", cursor: "pointer" },
  redCard: { padding: 20, borderRadius: 16, color: "#fff", background: "linear-gradient(135deg,#ef4444,#b91c1c)", cursor: "pointer" },
  yellowCard: { padding: 20, borderRadius: 16, color: "#111", background: "linear-gradient(135deg,#facc15,#eab308)", cursor: "pointer" },
  filters: { display: "flex", gap: 12, margin: "24px 0", alignItems: "center" },
  actionBtn: { border: "none", background: "#64748b", color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: "600" },
  tableCard: { padding: 20, borderRadius: 16, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px 16px", fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
  td: { padding: "16px", fontSize: 14, verticalAlign: "middle" },
  thumb: { width: 50, height: 50, borderRadius: 8, cursor: "pointer", marginRight: 6, objectFit: "cover" },
  actionContainer: { display: "flex", alignItems: "center", gap: 6 },
  
  // Custom Dynamic Status Pill Styling
  statusApproved: { background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: "700" },
  statusCancelled: { background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: "700" },
  statusPending: { background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: "700" },

  // Table Buttons
  btnApprove: { background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: 4, fontSize: 12 },
  btnCancel: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: 4, fontSize: 12 },
  btnPending: { background: "#64748b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: 4, fontSize: 12 },
  btnView: { background: "#facc15", color: "#000", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", display: "flex" },
  btnDelete: { background: "#b91c1c", color: "#fff", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", display: "flex" },

  // Loader & Overlays
  globalLoaderOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff" },
  spinner: { width: 40, height: 40, border: "4px solid rgba(255,255,255,0.3)", borderTop: "4px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" },
  popupOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 },
  popupCard: { padding: 24, borderRadius: 16, width: "100%", maxWidth: 550, maxHeight: "85vh", overflowY: "auto" },
  popupText: { fontSize: 14, marginBottom: 8 },
  bigImage: { width: 100, height: 100, borderRadius: 8, objectFit: "cover", border: "1px solid #cbd5e1" },
};

// CSS Injection hook trick for pure loading spinner keyframe
if (typeof document !== "undefined") {
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement("style")).sheet;
  try { styleSheet.insertRule("@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }", styleSheet.cssRules.length); } catch (e) {}
}

export default SellerProductTable;

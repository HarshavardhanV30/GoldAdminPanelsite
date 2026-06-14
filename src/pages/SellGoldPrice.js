import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  CalendarDays,
  Pencil,
  Trash2,
  Search,
  Send,
  RotateCcw,
  ChevronDown,
  Loader2,
} from "lucide-react";

// Inline injection of missing keyframes to prevent application rendering breaks
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

const SellGoldPrice = () => {
  // --- STATE MANAGEMENT ---
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form States
  const [karat, setKarat] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Edit Tracking State
  const [editingId, setEditingId] = useState(null);

  // Dynamic Today's Metric Display Cards
  const [today22K, setToday22K] = useState({ price: "0.00", change: "+ ₹0.00" });
  const [today24K, setToday24K] = useState({ price: "0.00", change: "+ ₹0.00" });

  // Calculate top-card display rules based on current array response
  const calculateLiveMetrics = (data) => {
    if (!data || data.length === 0) return;

    // Filter out historical rows by Karat variants
    const k22Items = data.filter((item) => parseInt(item.karat) === 22);
    const k24Items = data.filter((item) => parseInt(item.karat) === 24);

    if (k22Items.length > 0) {
      const current = parseFloat(k22Items[0].price || 0);
      const previous = k22Items[1] ? parseFloat(k22Items[1].price || 0) : current;
      const diff = current - previous;
      setToday22K({
        price: current.toFixed(2),
        change: `${diff >= 0 ? "+" : "-"} ₹${Math.abs(diff).toFixed(2)}`,
      });
    } else {
      setToday22K({ price: "0.00", change: "+ ₹0.00" });
    }

    if (k24Items.length > 0) {
      const current = parseFloat(k24Items[0].price || 0);
      const previous = k24Items[1] ? parseFloat(k24Items[1].price || 0) : current;
      const diff = current - previous;
      setToday24K({
        price: current.toFixed(2),
        change: `${diff >= 0 ? "+" : "-"} ₹${Math.abs(diff).toFixed(2)}`,
      });
    } else {
      setToday24K({ price: "0.00", change: "+ ₹0.00" });
    }
  };

  // --- API CALLS ---

  // 1. GET ALL: Fetch All Prices from /sellprice/all
  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://goldbackend-auyv.onrender.com/sellprice/all");
      
      // Robust structural parser handling raw array response vs nested object response setups
      const dataArray = Array.isArray(response.data) 
        ? response.data 
        : response.data.data 
          ? (Array.isArray(response.data.data) ? response.data.data : [response.data.data])
          : [];
          
      setHistoryData(dataArray);
      calculateLiveMetrics(dataArray);
    } catch (error) {
      console.error("Error fetching gold prices:", error);
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // --- HELPER UTILITIES ---
  const handleReset = () => {
    setEditingId(null);
    setKarat("");
    setPrice("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // 2. POST & PUT Handles updated to the new API path mappings
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!karat || !price || !date) {
      alert("Please fill all compulsory fields.");
      return;
    }

    // Base properties optimized to prevent validation schema mismatch drops
    const payload = {
      karat: parseInt(karat),
      price: parseFloat(price),
      date: date,
    };

    try {
      if (editingId) {
        // PUT Request: /sellprice/YOUR_RECORD_ID
        // Note: target payload retains expected fields matching properties requirements
        await axios.put(`https://goldbackend-auyv.onrender.com/sellprice/${editingId}`, payload);
        alert("Selling rate updated successfully!");
      } else {
        // POST Request: /sellprice/add
        await axios.post("https://goldbackend-auyv.onrender.com/sellprice/add", payload);
        alert("Selling rate added successfully!");
      }
      handleReset();
      fetchPrices();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving record. Please review request details.");
    }
  };

  // 3. DELETE: Record removal target routing path
  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid Record ID.");
      return;
    }
    if (window.confirm("Are you sure you want to permanently delete this selling price history item?")) {
      try {
        // DELETE Request: /sellprice/delete/YOUR_RECORD_ID
        await axios.delete(`https://goldbackend-auyv.onrender.com/sellprice/delete/${id}`);
        alert("Record deleted successfully.");
        fetchPrices();
      } catch (error) {
        console.error("Error executing delete command:", error);
        alert("Could not process delete operations.");
      }
    }
  };

  const handleEditSetup = (item) => {
    const itemId = item.id || item._id; 
    setEditingId(itemId);
    setKarat(item.karat ? item.karat.toString() : "");
    setPrice(item.price ? item.price.toString() : "");
    if (item.date) {
      const cleanDate = item.date.split("T")[0];
      setDate(cleanDate);
    }
  };

  const formatDateString = (rawString) => {
    if (!rawString) return "N/A";
    const parsed = new Date(rawString);
    if (isNaN(parsed)) return rawString;
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredHistory = historyData.filter((item) => {
    const term = searchQuery.toLowerCase();
    const itemId = (item.id || item._id || "").toString().toLowerCase();
    const itemKarat = (item.karat || "").toString().toLowerCase();
    const itemPrice = (item.price || "").toString().toLowerCase();
    const itemDate = formatDateString(item.date).toLowerCase();

    return (
      itemId.includes(term) ||
      itemKarat.includes(term) ||
      itemPrice.includes(term) ||
      itemDate.includes(term)
    );
  });

  return (
    <div
      style={{
        background: "#f4f7fc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#2d3748",
      }}
    >
      {/* HEADER SECTION */}
      <header
        style={{
          background: "#0047d6",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          color: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: "700", margin: 0, letterSpacing: "-0.5px" }}>
          Gold Selling Price Dashboard
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}></div>
      </header>

      <main style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* TOP INTERACTIVE CONTROL FORM */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "18px", margin: 0, fontWeight: "600", color: "#1a202c" }}>
              {editingId ? "Modify Historical Selling Price" : "Update Gold Selling Price"}
            </h2>

            <div
              style={{
                background: "#e6f4ea",
                color: "#137333",
                padding: "6px 12px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <CalendarDays size={16} />
              Current Session: {formatDateString(new Date())}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Field 1: Karat Selector */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#4a5568",
                  }}
                >
                  Select Karat *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={karat}
                    onChange={(e) => setKarat(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "11px 14px",
                      fontSize: "14px",
                      background: "#fff",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                      color: karat ? "#2d3748" : "#a0aec0",
                    }}
                  >
                    <option value="" disabled>Select Karat Configuration</option>
                    <option value="22" style={{ color: "#2d3748" }}>22 Karat (Standard Jewelry)</option>
                    <option value="24" style={{ color: "#2d3748" }}>24 Karat (Pure Gold bullion)</option>
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#718096",
                    }}
                  />
                </div>
              </div>

              {/* Field 2: Price Input */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#4a5568",
                  }}
                >
                  Gold Selling Price (Per Gram) *
                </label>
                <div
                  style={{
                    display: "flex",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      background: "#edf2f7",
                      padding: "11px 16px",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#4a5568",
                      borderRight: "1.5px solid #e2e8f0",
                    }}
                  >
                    ₹
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 7340.50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      padding: "11px 14px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              {/* Field 3: Target Date */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#4a5568",
                  }}
                >
                  Target Date Log *
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    background: "#fff",
                  }}
                >
                  <CalendarDays size={16} style={{ color: "#718096" }} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "14px",
                      color: "#2d3748",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ACTION TRIGGERS BAR */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#4a5568",
                }}
              >
                <RotateCcw size={16} />
                Clear Form
              </button>

              <button
                type="submit"
                style={{
                  background: editingId ? "#e67e22" : "#0057ff",
                  color: "#fff",
                  border: "none",
                  padding: "10px 28px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: editingId 
                    ? "0 2px 4px rgba(230,126,34,0.2)" 
                    : "0 2px 4px rgba(0,87,255,0.2)",
                }}
              >
                <Send size={16} />
                {editingId ? "Apply Changes" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* MARKET SNAPSHOT TICKER CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Card: 22K Display */}
          <div
            style={{
              background: "#fffdf5",
              border: "1.5px solid #fbe7b7",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "600", color: "#744210" }}>
                22 Karat Gold Selling Rate
              </h3>
              <h1 style={{ color: "#b7791f", fontSize: "32px", margin: 0, fontWeight: "700" }}>
                ₹ {today22K.price}
              </h1>
              <p style={{ color: "#718096", margin: "4px 0 0 0", fontSize: "12px" }}>Most Recent Record Entry</p>
            </div>
            <div
              style={{
                color: today22K.change.startsWith("+") ? "#1c7430" : "#dc3545",
                fontWeight: "700",
                fontSize: "16px",
                background: today22K.change.startsWith("+") ? "#e6f4ea" : "#fde8e8",
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              {today22K.change}
            </div>
          </div>

          {/* Card: 24K Display */}
          <div
            style={{
              background: "#f7faff",
              border: "1.5px solid #ccdffd",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "600", color: "#2b6cb0" }}>
                24 Karat Gold Selling Rate
              </h3>
              <h1 style={{ color: "#2b6cb0", fontSize: "32px", margin: 0, fontWeight: "700" }}>
                ₹ {today24K.price}
              </h1>
              <p style={{ color: "#718096", margin: "4px 0 0 0", fontSize: "12px" }}>Most Recent Record Entry</p>
            </div>
            <div
              style={{
                color: today24K.change.startsWith("+") ? "#1c7430" : "#dc3545",
                fontWeight: "700",
                fontSize: "16px",
                background: today24K.change.startsWith("+") ? "#e6f4ea" : "#fde8e8",
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              {today24K.change}
            </div>
          </div>
        </div>

        {/* LOG DATA TABLE VIEWPORT */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Gold Selling Price Audit History</h2>

            <div
              style={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "280px",
                background: "#fff",
              }}
            >
              <Search size={16} style={{ color: "#a0aec0" }} />
              <input
                type="text"
                placeholder="Search history tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          {/* TABLE INTERFACE */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                  <th style={tableHeaderStyle}>ID Token</th>
                  <th style={tableHeaderStyle}>Date Evaluated</th>
                  <th style={tableHeaderStyle}>Karat Category</th>
                  <th style={tableHeaderStyle}>Selling Price (Per Gram)</th>
                  <th style={tableHeaderStyle}>Authorized Operative</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>Actions Grid</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "#718096" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <Loader2 style={{ animation: "spin 1s linear infinite" }} size={18} />
                        Loading database state matrix values...
                      </div>
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                      No matching gold data rows located inside state tables.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, index) => {
                    const currentId = item.id || item._id;
                    return (
                      <tr
                        key={currentId || index}
                        style={{
                          borderBottom: "1px solid #edf2f7",
                          background: editingId === currentId ? "#fffaf0" : "#fff",
                        }}
                      >
                        <td style={tableCellStyle}>#{currentId || index + 1}</td>
                        <td style={{ ...tableCellStyle, fontWeight: "500" }}>{formatDateString(item.date)}</td>
                        <td style={tableCellStyle}>
                          <span
                            style={{
                              background: item.karat === 24 ? "#eff6ff" : "#fef7e0",
                              color: item.karat === 24 ? "#1e40af" : "#854d0e",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            {item.karat} Karat
                          </span>
                        </td>
                        <td style={{ ...tableCellStyle, fontWeight: "600", color: "#1a202c" }}>
                          ₹ {parseFloat(item.price || 0).toFixed(2)}
                        </td>
                        <td style={{ ...tableCellStyle, color: "#718096" }}>Admin</td>

                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                            <button
                              title="Edit Data Item"
                              onClick={() => handleEditSetup(item)}
                              style={{
                                border: "1.5px solid #cbd5e1",
                                background: "#fff",
                                borderRadius: "6px",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Pencil size={14} color="#0057ff" />
                            </button>

                            <button
                              title="Delete Records"
                              onClick={() => handleDelete(currentId)}
                              style={{
                                border: "1.5px solid #fed7d7",
                                background: "#fff",
                                borderRadius: "6px",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Trash2 size={14} color="#e53e3e" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// Styles
const tableHeaderStyle = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#4a5568",
  letterSpacing: "0.5px",
};

const tableCellStyle = {
  padding: "12px 16px",
  fontSize: "13.5px",
  color: "#2d3748",
};

export default SellGoldPrice;
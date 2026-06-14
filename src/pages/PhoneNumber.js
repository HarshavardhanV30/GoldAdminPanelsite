import React, { useState, useEffect } from "react";
import {
  Menu,
  UserCircle,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

const AddPhoneNumber = () => {
  // State variables
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  const BASE_URL = "https://goldbackend-auyv.onrender.com/numbers";

  // 1. GET ALL NUMBERS
  const fetchNumbers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/numberall`);
      const result = await response.json();
      if (result.success) {
        setPhoneNumbers(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  // 2. POST (ADD) / PUT (EDIT) NUMBER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !email) {
      alert("Please enter both email and phone number.");
      return;
    }

    const payload = {
      email: email,
      phone_number: phoneNumber,
    };

    try {
      if (editingId) {
        // PUT request
        const response = await fetch(`${BASE_URL}/number/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          alert("Number updated successfully");
          setEditingId(null);
          setPhoneNumber("");
          setEmail("");
          fetchNumbers();
        }
      } else {
        // POST request
        const response = await fetch(`${BASE_URL}/addnumber`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.success) {
          alert(result.message);
          setPhoneNumber("");
          setEmail("");
          fetchNumbers();
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // 3. DELETE NUMBER
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const response = await fetch(`${BASE_URL}/delete/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Entry deleted successfully");
          fetchNumbers();
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  // Setup Form for Editing
  const startEdit = (item) => {
    setEditingId(item.id);
    setPhoneNumber(item.phone_number);
    setEmail(item.email || "");
  };

  // Filter list based on search
  const filteredNumbers = phoneNumbers.filter((item) => {
    const num = item.phone_number ? item.phone_number.toLowerCase() : "";
    const mail = item.email ? item.email.toLowerCase() : "";
    const query = searchQuery.toLowerCase();
    return num.includes(query) || mail.includes(query);
  });

  return (
    <div
      style={{
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "60px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Menu size={24} color="#6b7280" style={{ cursor: "pointer" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#111827",
            fontSize: "14px",
          }}
        >
          <UserCircle size={32} color="#9ca3af" />
          <span style={{ fontWeight: "500" }}>Admin</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          <span style={{ color: "#2563eb", fontWeight: "600" }}>Dashboard</span>
          <span>/</span>
          <span>Phone Numbers</span>
          <span>/</span>
          <span style={{ color: "#111827" }}>Add Phone Number</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "6px",
            color: "#111827",
          }}
        >
          {editingId ? "Edit Phone Number" : "Add Phone Number"}
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "24px",
          }}
        >
          Manage and configure phone numbers within your system records.
        </p>

        {/* Add/Edit Phone Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Email Input */}
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Email Address <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="enter user email (e.g., user@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: "45px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    padding: "0 14px",
                    fontSize: "14px",
                    color: "#374151",
                    outline: "none",
                  }}
                />
              </div>

              {/* Phone Number Input */}
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Phone Number <span style={{ color: "red" }}>*</span>
                </label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    overflow: "hidden",
                    height: "45px",
                  }}
                >
                  <div
                    style={{
                      width: "70px",
                      height: "100%",
                      backgroundColor: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: "1px solid #e5e7eb",
                      gap: "4px",
                      fontSize: "16px",
                    }}
                  >
                    🇮🇳
                    <ChevronDown size={14} color="#6b7280" />
                  </div>

                  <div
                    style={{
                      width: "55px",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    +91
                  </div>

                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      flex: 1,
                      height: "100%",
                      border: "none",
                      outline: "none",
                      padding: "0 12px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setPhoneNumber("");
                    setEmail("");
                  }}
                  style={{
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                style={{
                  backgroundColor: editingId ? "#198754" : "#0d6efd",
                  color: "#fff",
                  border: "none",
                  padding: "10px 30px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {editingId ? "Update Data" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Table Utilities */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Phone Numbers List
            </h2>

            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                padding: "8px 12px",
                width: "280px",
                backgroundColor: "#fff",
              }}
            >
              <Search size={16} color="#6b7280" />
              <input
                type="text"
                placeholder="Search phone or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  marginLeft: "8px",
                  width: "100%",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f9fafb",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th style={thStyle}># ID</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone Number</th>
                  <th style={thStyle}>Created On</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredNumbers.length > 0 ? (
                  filteredNumbers.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <td style={tdStyle}>{item.id}</td>
                      <td style={tdStyle}>{item.email || "N/A"}</td>
                      <td style={{ ...tdStyle, fontWeight: "500", color: "#111827" }}>
                        {item.phone_number}
                      </td>
                      <td style={tdStyle}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "Just now"}
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "14px", justifyContent: "flex-end" }}>
                          <Pencil
                            size={16}
                            color="#2563eb"
                            style={{ cursor: "pointer" }}
                            onClick={() => startEdit(item)}
                          />
                          <Trash2
                            size={16}
                            color="#ef4444"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: "center", color: "#9ca3af" }}>
                      No phone numbers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Metrics */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Showing {filteredNumbers.length} of {phoneNumbers.length} entries
            </p>

            {/* Dummy Pagination */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button style={pageBtn}>‹</button>
              <button
                style={{
                  ...pageBtn,
                  backgroundColor: "#0d6efd",
                  color: "#fff",
                  borderColor: "#0d6efd",
                }}
              >
                1
              </button>
              <button style={pageBtn}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scaled down table styles for perfect screens
const thStyle = {
  padding: "12px 16px",
  fontSize: "13px",
  color: "#4b5563",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "13px",
  color: "#4b5563",
};

const pageBtn = {
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  backgroundColor: "#fff",
  fontSize: "13px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default AddPhoneNumber;

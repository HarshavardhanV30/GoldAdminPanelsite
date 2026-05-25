import React from "react";
import {
  Menu,
  UserCircle,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

const AddPhoneNumber = () => {
  const phoneNumbers = [
    {
      id: 1,
      number: "+91 98765 43210",
      addedOn: "20 May 2024, 10:30 AM",
      addedBy: "Admin",
    },
    {
      id: 2,
      number: "+91 87654 32109",
      addedOn: "18 May 2024, 03:15 PM",
      addedBy: "Admin",
    },
    {
      id: 3,
      number: "+91 76543 21098",
      addedOn: "15 May 2024, 11:45 AM",
      addedBy: "Admin",
    },
  ];

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
          height: "80px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Menu size={30} color="#6b7280" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#111827",
            fontSize: "18px",
          }}
        >
          <UserCircle size={42} color="#9ca3af" />
          <span>Admin</span>
          <ChevronDown size={20} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "35px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            marginBottom: "30px",
            fontSize: "16px",
            color: "#6b7280",
          }}
        >
          <span style={{ color: "#2563eb", fontWeight: "600" }}>
            Dashboard
          </span>
          <span>/</span>
          <span>Phone Numbers</span>
          <span>/</span>
          <span>Add Phone Number</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Add Phone Number
        </h1>

        <p
          style={{
            fontSize: "22px",
            color: "#6b7280",
            marginBottom: "35px",
          }}
        >
          Add a new phone number to the system.
        </p>

        {/* Add Phone Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "35px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginBottom: "35px",
          }}
        >
          <label
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Phone Number <span style={{ color: "red" }}>*</span>
          </label>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              overflow: "hidden",
              height: "70px",
            }}
          >
            {/* Country */}
            <div
              style={{
                width: "120px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid #e5e7eb",
                gap: "8px",
                fontSize: "26px",
              }}
            >
              🇮🇳
              <ChevronDown size={18} color="#6b7280" />
            </div>

            {/* Code */}
            <div
              style={{
                width: "100px",
                textAlign: "center",
                fontSize: "24px",
                color: "#111827",
              }}
            >
              +91
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter phone number"
              style={{
                flex: 1,
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 20px",
                fontSize: "22px",
                color: "#374151",
              }}
            />
          </div>

          {/* Submit Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "30px",
            }}
          >
            <button
              style={{
                backgroundColor: "#0d6efd",
                color: "#fff",
                border: "none",
                padding: "18px 60px",
                borderRadius: "8px",
                fontSize: "24px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h2
              style={{
                fontSize: "30px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Phone Numbers List
            </h2>

            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "12px 18px",
                width: "350px",
                backgroundColor: "#fff",
              }}
            >
              <Search size={22} color="#6b7280" />
              <input
                type="text"
                placeholder="Search phone numbers"
                style={{
                  border: "none",
                  outline: "none",
                  marginLeft: "10px",
                  width: "100%",
                  fontSize: "18px",
                }}
              />
            </div>
          </div>

          {/* Table */}
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
                  }}
                >
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Phone Number</th>
                  <th style={thStyle}>Added On</th>
                  <th style={thStyle}>Added By</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {phoneNumbers.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={tdStyle}>{item.id}</td>
                    <td style={tdStyle}>{item.number}</td>
                    <td style={tdStyle}>{item.addedOn}</td>
                    <td style={tdStyle}>{item.addedBy}</td>

                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <Pencil
                          size={22}
                          color="#2563eb"
                          style={{ cursor: "pointer" }}
                        />
                        <Trash2
                          size={22}
                          color="#ef4444"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
              }}
            >
              Showing 1 to 3 of 3 entries
            </p>

            {/* Pagination */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={pageBtn}>‹</button>

              <button
                style={{
                  ...pageBtn,
                  backgroundColor: "#0d6efd",
                  color: "#fff",
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

const thStyle = {
  padding: "20px",
  fontSize: "18px",
  color: "#374151",
  fontWeight: "600",
};

const tdStyle = {
  padding: "22px 20px",
  fontSize: "18px",
  color: "#374151",
};

const pageBtn = {
  width: "42px",
  height: "42px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#fff",
  fontSize: "18px",
  cursor: "pointer",
};

export default AddPhoneNumber;
import React from "react";
import {
  FaBars,
  FaUserCircle,
  FaPen,
  FaTrash,
} from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Electronics",
    createdAt: "20 May 2024, 10:30 AM",
  },
  {
    id: 2,
    name: "Fashion",
    createdAt: "20 May 2024, 11:15 AM",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    createdAt: "21 May 2024, 09:45 AM",
  },
  {
    id: 4,
    name: "Beauty & Health",
    createdAt: "21 May 2024, 10:20 AM",
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    createdAt: "22 May 2024, 02:10 PM",
  },
];

const CategoryAdminPanel = () => {
  return (
    <div
      style={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
        }}
      >
        <FaBars size={24} color="#1f2937" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "20px",
            fontWeight: "500",
            color: "#111827",
          }}
        >
          <FaUserCircle size={34} color="#9ca3af" />
          <span>Admin</span>
          <span style={{ fontSize: "14px" }}>▼</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "35px" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: "54px",
            margin: 0,
            fontWeight: "700",
            color: "#000",
          }}
        >
          Categories
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#6b7280",
            fontSize: "28px",
          }}
        >
          Manage your categories
        </p>

        {/* Add Category Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "35px",
            marginTop: "35px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            border: "1px solid #ececec",
          }}
        >
          <h2
            style={{
              marginBottom: "35px",
              fontSize: "36px",
              color: "#111827",
            }}
          >
            Add New Category
          </h2>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "15px",
                fontWeight: "600",
                fontSize: "24px",
                color: "#111827",
              }}
            >
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              style={{
                width: "100%",
                height: "70px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                paddingLeft: "20px",
                fontSize: "22px",
                outline: "none",
                color: "#111827",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            style={{
              marginTop: "30px",
              backgroundColor: "#1565ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "16px 32px",
              fontSize: "22px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Submit
          </button>
        </div>

        {/* Categories Table */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "35px",
            marginTop: "35px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            border: "1px solid #ececec",
          }}
        >
          <h2
            style={{
              marginBottom: "30px",
              fontSize: "36px",
              color: "#111827",
            }}
          >
            All Categories
          </h2>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
            }}
          >
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
                  <th style={tableHeader}>#</th>
                  <th style={tableHeader}>Category Name</th>
                  <th style={tableHeader}>Created At</th>
                  <th style={tableHeader}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={tableCell}>{item.id}</td>
                    <td style={tableCell}>{item.name}</td>
                    <td style={tableCell}>{item.createdAt}</td>

                    <td style={tableCell}>
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        <button
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "8px",
                            border: "2px solid #2563eb",
                            background: "#fff",
                            color: "#2563eb",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaPen size={18} />
                        </button>

                        <button
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "8px",
                            border: "2px solid #ef4444",
                            background: "#fff",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const tableHeader = {
  padding: "24px",
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
};

const tableCell = {
  padding: "24px",
  fontSize: "22px",
  color: "#374151",
};

export default CategoryAdminPanel;
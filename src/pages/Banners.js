import React from "react";
import {
  FaEdit,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";

const bannerData = [
  {
    id: 1,
    name: "Summer Sale Banner",
    image:
      "https://img.freepik.com/free-vector/summer-sale-banner-template_23-2148921533.jpg",
  },
  {
    id: 2,
    name: "New Arrivals Banner",
    image:
      "https://img.freepik.com/free-vector/new-arrival-banner-template_23-2148899923.jpg",
  },
  {
    id: 3,
    name: "Mega Discount Banner",
    image:
      "https://img.freepik.com/free-vector/mega-sale-banner-template_23-2148908004.jpg",
  },
  {
    id: 4,
    name: "Festival Offer Banner",
    image:
      "https://img.freepik.com/free-vector/festival-sale-banner-template_23-2149737135.jpg",
  },
];

const BannerManagement = () => {
  return (
    <div
      style={{
        background: "#f5f6fa",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Banner Management
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            color: "#111827",
          }}
        >
          <FaUserCircle size={28} color="#9ca3af" />
          <span>Admin</span>
        </div>
      </div>

      {/* Add Banner Section */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "25px",
            color: "#111827",
          }}
        >
          Add New Banner
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Banner Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Banner Name <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="text"
              placeholder="Enter banner name"
              style={{
                width: "100%",
                height: "52px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                padding: "0 15px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          {/* Banner Image */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Banner Image <span style={{ color: "red" }}>*</span>
            </label>

            <div
              style={{
                display: "flex",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                overflow: "hidden",
                height: "52px",
              }}
            >
              <input
                type="file"
                style={{
                  flex: 1,
                  border: "none",
                  padding: "12px",
                  fontSize: "15px",
                }}
              />

              <button
                style={{
                  width: "120px",
                  border: "none",
                  background: "#f3f4f6",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Browse
              </button>
            </div>

            <p
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Recommended size: 1920 x 600 px (JPG, PNG, WEBP)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "14px 35px",
            borderRadius: "6px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Submit
        </button>
      </div>

      {/* Banner List */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "25px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "25px",
            color: "#111827",
          }}
        >
          Banner List
        </h2>

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
                  borderBottom: "1px solid #e5e7eb",
                  textAlign: "left",
                }}
              >
                <th style={tableHead}>#</th>
                <th style={tableHead}>Banner Name</th>
                <th style={tableHead}>Banner Image</th>
                <th style={tableHead}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bannerData.map((banner) => (
                <tr
                  key={banner.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td style={tableCell}>{banner.id}</td>

                  <td style={tableCell}>{banner.name}</td>

                  <td style={tableCell}>
                    <img
                      src={banner.image}
                      alt={banner.name}
                      style={{
                        width: "350px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </td>

                  <td style={tableCell}>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                      }}
                    >
                      <button
                        style={{
                          width: "42px",
                          height: "42px",
                          border: "2px solid #2563eb",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#2563eb",
                          cursor: "pointer",
                        }}
                      >
                        <FaEdit size={18} />
                      </button>

                      <button
                        style={{
                          width: "42px",
                          height: "42px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#ef4444",
                          color: "#fff",
                          cursor: "pointer",
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

        <p
          style={{
            marginTop: "20px",
            fontSize: "16px",
            color: "#374151",
          }}
        >
          Showing 1 to 4 of 4 entries
        </p>
      </div>
    </div>
  );
};

const tableHead = {
  padding: "18px",
  fontSize: "18px",
  fontWeight: "700",
  color: "#111827",
};

const tableCell = {
  padding: "18px",
  fontSize: "17px",
  color: "#111827",
  verticalAlign: "middle",
};

export default BannerManagement;
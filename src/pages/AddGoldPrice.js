import React from "react";
import {
  CalendarDays,
  Pencil,
  Trash2,
  Search,
  Send,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

const GoldPriceDashboard = () => {
  const historyData = [
    {
      date: "17 May 2025",
      price22: "₹ 6,530.00",
      price24: "₹ 7,130.00",
    },
    {
      date: "16 May 2025",
      price22: "₹ 6,510.00",
      price24: "₹ 7,105.00",
    },
    {
      date: "15 May 2025",
      price22: "₹ 6,495.00",
      price24: "₹ 7,085.00",
    },
    {
      date: "14 May 2025",
      price22: "₹ 6,505.00",
      price24: "₹ 7,100.00",
    },
    {
      date: "13 May 2025",
      price22: "₹ 6,475.00",
      price24: "₹ 7,065.00",
    },
  ];

  return (
    <div
      style={{
        background: "#f3f6fb",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#0047d6",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          color: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "34px", fontWeight: "700" }}>
          Gold Price Dashboard
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#d9d9d9",
            }}
          ></div>

          <div>
            <h3 style={{ margin: 0 }}>Admin</h3>
          </div>

          <ChevronDown size={20} />
        </div>
      </div>

      <div style={{ padding: "25px" }}>
        {/* TOP FORM */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
            marginBottom: "25px",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "34px",
                margin: 0,
                fontWeight: "700",
              }}
            >
              Add / Update Gold Price
            </h2>

            <div
              style={{
                background: "#e8f9e7",
                color: "#2f7d32",
                padding: "10px 18px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "600",
              }}
            >
              <CalendarDays size={20} />
              Current Date: 17 May 2025
            </div>
          </div>

          {/* FORM ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "25px",
            }}
          >
            {/* Select Karat */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                Select Karat *
              </label>

              <div
                style={{
                  border: "2px solid #dfe7f2",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#fff",
                }}
              >
                <span>Select Karat</span>
                <ChevronDown />
              </div>
            </div>

            {/* 22K */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                22 Karat Price (Per Gram) *
              </label>

              <div
                style={{
                  display: "flex",
                  border: "2px solid #dfe7f2",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#f7f7f7",
                    padding: "16px",
                    fontWeight: "bold",
                  }}
                >
                  ₹
                </div>

                <input
                  type="text"
                  placeholder="Enter 22K price"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            {/* 24K */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                24 Karat Price (Per Gram) *
              </label>

              <div
                style={{
                  display: "flex",
                  border: "2px solid #dfe7f2",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#f7f7f7",
                    padding: "16px",
                    fontWeight: "bold",
                  }}
                >
                  ₹
                </div>

                <input
                  type="text"
                  placeholder="Enter 24K price"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                Date *
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "2px solid #dfe7f2",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#fff",
                }}
              >
                <CalendarDays size={20} />
                <input
                  type="date"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "25px",
              marginTop: "35px",
            }}
          >
            <button
              style={{
                background: "#fff",
                border: "2px solid #dfe7f2",
                padding: "16px 50px",
                borderRadius: "14px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <button
              style={{
                background: "#0057ff",
                color: "#fff",
                border: "none",
                padding: "16px 55px",
                borderRadius: "14px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 5px 15px rgba(0,87,255,0.3)",
              }}
            >
              <Send size={20} />
              Submit Price
            </button>
          </div>
        </div>

        {/* MARKET PRICE CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            marginBottom: "25px",
          }}
        >
          {/* 22K */}
          <div
            style={{
              background: "#fffef7",
              border: "2px solid #ffe3a3",
              borderRadius: "18px",
              padding: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "10px" }}>
                22 Karat Gold (Per Gram)
              </h3>

              <h1
                style={{
                  color: "#d89c00",
                  fontSize: "52px",
                  margin: 0,
                }}
              >
                ₹ 6,530.00
              </h1>

              <p style={{ color: "#555" }}>Today's Price</p>
            </div>

            <div
              style={{
                color: "green",
                fontWeight: "700",
                fontSize: "26px",
              }}
            >
              + ₹20.00
            </div>
          </div>

          {/* 24K */}
          <div
            style={{
              background: "#f7fbff",
              border: "2px solid #b9dcff",
              borderRadius: "18px",
              padding: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "10px" }}>
                24 Karat Gold (Per Gram)
              </h3>

              <h1
                style={{
                  color: "#0057ff",
                  fontSize: "52px",
                  margin: 0,
                }}
              >
                ₹ 7,130.00
              </h1>

              <p style={{ color: "#555" }}>Today's Price</p>
            </div>

            <div
              style={{
                color: "green",
                fontWeight: "700",
                fontSize: "26px",
              }}
            >
              + ₹25.00
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>Gold Price History</h2>

            <div
              style={{
                border: "2px solid #dfe7f2",
                borderRadius: "12px",
                padding: "12px 15px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "250px",
              }}
            >
              <Search size={18} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              overflow: "hidden",
              borderRadius: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f2f6fc",
                  height: "65px",
                }}
              >
                <th>Date</th>
                <th>22 Karat (Per Gram)</th>
                <th>24 Karat (Per Gram)</th>
                <th>Updated By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {historyData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #edf1f7",
                    height: "75px",
                    background: "#fff",
                  }}
                >
                  <td>{item.date}</td>
                  <td>{item.price22}</td>
                  <td>{item.price24}</td>
                  <td>Admin</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        style={{
                          border: "2px solid #c7d8ff",
                          background: "#fff",
                          borderRadius: "10px",
                          width: "42px",
                          height: "42px",
                          cursor: "pointer",
                        }}
                      >
                        <Pencil size={18} color="#0057ff" />
                      </button>

                      <button
                        style={{
                          border: "2px solid #ffd0d0",
                          background: "#fff",
                          borderRadius: "10px",
                          width: "42px",
                          height: "42px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={18} color="red" />
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
  );
};

export default GoldPriceDashboard;
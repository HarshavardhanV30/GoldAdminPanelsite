import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://goldbackend-production-0ed4.up.railway.app/goldrepair/all";

const COLORS = {
  teal: "#008F90",
  dark: "#006D6B",
  light: "#E8F8F7",
  bg: "#F4F8F8",
  white: "#FFFFFF",
  text: "#172B2A",
  muted: "#71808A",
  border: "#E2EAEA",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  blue: "#2563EB",
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#F4F8F8 0%,#EEF7F6 50%,#F7FAFA 100%)",
    color: COLORS.text,
    fontFamily: "Inter, Arial, sans-serif",
    padding: 20,
    boxSizing: "border-box",
  },

  card: {
    background: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,70,70,.06)",
  },

  button: {
    border: 0,
    cursor: "pointer",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 11,
    padding: "9px 13px",
  },

  input: {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 9,
    padding: "9px 11px",
    outline: "none",
    background: "#FAFCFC",
    color: COLORS.text,
    fontSize: 11,
    boxSizing: "border-box",
  },
};

export default function GoldRepair() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  // Calendar date
  const [selectedDate, setSelectedDate] = useState("");

  // Full detail modal
  const [showDetails, setShowDetails] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();

      const data =
        result?.success && Array.isArray(result.data)
          ? result.data.filter((item) => item?.id)
          : [];

      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to fetch repair bookings. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  const getLocalDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const statistics = useMemo(() => {
    const completed = bookings.filter(
      (item) => item.status === "COMPLETED"
    ).length;

    const pending = bookings.filter(
      (item) => item.status === "PENDING"
    ).length;

    const cancelled = bookings.filter(
      (item) => item.status === "CANCELLED"
    ).length;

    const inProgress = bookings.filter(
      (item) => item.status === "IN_PROGRESS" || !item.status
    ).length;

    const revenue = bookings.reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    );

    return {
      total: bookings.length,
      completed,
      pending,
      cancelled,
      inProgress,
      revenue,
    };
  }, [bookings]);

  // --------------------------------------------------
  // FILTER BOOKINGS
  // --------------------------------------------------

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bookings.filter((item) => {
      // Search
      const searchMatch =
        !query ||
        [
          item.id,
          item.service_id,
          item.service_name,
          item.jewellery_type,
          item.full_name,
          item.phone,
          item.city,
          item.district,
          item.state,
          item.pincode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      // Calendar filter
      const dateMatch =
        !selectedDate ||
        getLocalDate(item.booking_date) === selectedDate;

      // Status filter
      const status = item.status || "IN_PROGRESS";

      const statusMatch =
        activeTab === "ALL" ||
        (activeTab === "IN_PROGRESS" &&
          (status === "IN_PROGRESS" || !item.status)) ||
        status === activeTab;

      return searchMatch && dateMatch && statusMatch;
    });
  }, [bookings, searchQuery, selectedDate, activeTab]);

  // --------------------------------------------------
  // SELECT BOOKING
  // --------------------------------------------------

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  // --------------------------------------------------
  // STATUS COLORS
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    const currentStatus = status || "IN_PROGRESS";

    if (currentStatus === "COMPLETED") {
      return {
        color: COLORS.green,
        background: "#ECFDF5",
      };
    }

    if (currentStatus === "PENDING") {
      return {
        color: COLORS.red,
        background: "#FEF2F2",
      };
    }

    if (currentStatus === "CANCELLED") {
      return {
        color: COLORS.red,
        background: "#FEF2F2",
      };
    }

    return {
      color: COLORS.amber,
      background: "#FFF7ED",
    };
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div
        style={{
          ...styles.page,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            ...styles.card,
            padding: 40,
            textAlign: "center",
            minWidth: 280,
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 12 }}>💎</div>

          <div style={{ fontWeight: 800, fontSize: 16 }}>
            Gold Repair Dashboard
          </div>

          <div
            style={{
              color: COLORS.muted,
              fontSize: 11,
              marginTop: 7,
            }}
          >
            Loading repair bookings...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div
        style={{
          ...styles.page,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            ...styles.card,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40 }}>⚠️</div>

          <p
            style={{
              color: COLORS.red,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {error}
          </p>

          <button
            onClick={fetchBookings}
            style={{
              ...styles.button,
              background: COLORS.teal,
              color: "#fff",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* =========================================================
          HEADER
      ========================================================== */}

      <header
        style={{
          ...styles.card,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 260, maxWidth: 550 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: COLORS.dark,
            }}
          >
            Gold Repair
          </div>

          <div
            style={{
              color: COLORS.muted,
              fontSize: 10,
              marginTop: 3,
            }}
          >
            Repair booking management dashboard
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: COLORS.light,
              color: COLORS.dark,
              padding: "8px 12px",
              borderRadius: 9,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            📅 {selectedDate ? selectedDate : "All Dates"}
          </div>

          <div style={{ fontSize: 20 }}>🔔</div>

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: COLORS.dark,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            A
          </div>
        </div>
      </header>

      {/* =========================================================
          KPI CARDS
      ========================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {[
          [
            "Total Bookings",
            statistics.total,
            "📅",
            COLORS.blue,
            "#EFF6FF",
          ],
          [
            "Completed",
            statistics.completed,
            "✓",
            COLORS.green,
            "#ECFDF5",
          ],
          [
            "In Progress",
            statistics.inProgress,
            "◷",
            COLORS.amber,
            "#FFF7ED",
          ],
          [
            "Pending",
            statistics.pending,
            "!",
            COLORS.red,
            "#FEF2F2",
          ],
          [
            "Revenue",
            `₹${statistics.revenue.toLocaleString("en-IN")}`,
            "₹",
            COLORS.blue,
            "#EFF6FF",
          ],
        ].map(([title, value, icon, color, iconBg]) => (
          <div
            key={title}
            style={{
              ...styles.card,
              padding: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `3px solid ${color}`,
            }}
          >
            <div>
              <div
                style={{
                  color: COLORS.muted,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  marginTop: 5,
                }}
              >
                {value}
              </div>
            </div>

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: iconBg,
                color,
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 19,
              }}
            >
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          FILTER BAR
      ========================================================== */}

      <div
        style={{
          ...styles.card,
          padding: 14,
          marginBottom: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              Booking Schedule
            </div>

            <div
              style={{
                color: COLORS.muted,
                fontSize: 10,
                marginTop: 3,
              }}
            >
              Select a date to display bookings for that day
            </div>
          </div>

          {selectedDate && (
            <button
              onClick={clearDateFilter}
              style={{
                ...styles.button,
                background: "#FEF2F2",
                color: COLORS.red,
              }}
            >
              ✕ Clear Date
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* CALENDAR */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 10,
                zIndex: 1,
                fontSize: 14,
              }}
            >
              📅
            </span>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                ...styles.input,
                paddingLeft: 32,
                minWidth: 170,
                cursor: "pointer",
              }}
            />
          </div>

          {/* SEARCH */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, customer, phone, service..."
            style={{
              ...styles.input,
              flex: 1,
              minWidth: 230,
            }}
          />

          <button
            onClick={fetchBookings}
            style={{
              ...styles.button,
              background: COLORS.teal,
              color: "#fff",
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* STATUS TABS */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginTop: 12,
          }}
        >
          {[
            ["ALL", `All (${bookings.length})`],
            ["PENDING", `Pending (${statistics.pending})`],
            ["IN_PROGRESS", `In Progress (${statistics.inProgress})`],
            ["COMPLETED", `Completed (${statistics.completed})`],
            ["CANCELLED", `Cancelled (${statistics.cancelled})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                ...styles.button,
                padding: "7px 11px",
                background:
                  activeTab === key ? COLORS.dark : "#F3F7F7",
                color: activeTab === key ? "#fff" : COLORS.muted,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* DATE RESULT */}
        <div
          style={{
            marginTop: 12,
            padding: "9px 11px",
            borderRadius: 9,
            background: COLORS.light,
            color: COLORS.dark,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {selectedDate
            ? `Showing ${filteredBookings.length} booking(s) for ${new Date(
                `${selectedDate}T00:00:00`
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : `Showing ${filteredBookings.length} booking(s) from all dates`}
        </div>
      </div>

      {/* =========================================================
          TABLE
      ========================================================== */}

      <div
        style={{
          ...styles.card,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <b style={{ fontSize: 14 }}>Repair Bookings</b>

            <div
              style={{
                color: COLORS.muted,
                fontSize: 10,
                marginTop: 3,
              }}
            >
              Click any booking to view complete information
            </div>
          </div>

          <span
            style={{
              background: COLORS.light,
              color: COLORS.dark,
              padding: "6px 10px",
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {filteredBookings.length} Results
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 900,
              borderCollapse: "collapse",
              fontSize: 11,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#F7FAFA",
                  color: COLORS.muted,
                }}
              >
                {[
                  "ID",
                  "Service",
                  "Customer",
                  "Jewellery",
                  "Date",
                  "Time",
                  "Type",
                  "Amount",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "11px 10px",
                      textAlign: "left",
                      fontWeight: 800,
                      borderBottom: `1px solid ${COLORS.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      padding: 50,
                      textAlign: "center",
                      color: COLORS.muted,
                    }}
                  >
                    <div style={{ fontSize: 35 }}>📭</div>

                    <div
                      style={{
                        marginTop: 8,
                        fontWeight: 800,
                      }}
                    >
                      No bookings found
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 10,
                      }}
                    >
                      Try another date or search value.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((item) => {
                  const statusStyle = getStatusStyle(item.status);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => openDetails(item)}
                      style={{
                        cursor: "pointer",
                        borderBottom: `1px solid ${COLORS.border}`,
                        background: "#fff",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 10px",
                          fontWeight: 900,
                          color: COLORS.dark,
                        }}
                      >
                        #{item.id}
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <b>{item.service_name || "N/A"}</b>

                        <small
                          style={{
                            display: "block",
                            color: COLORS.muted,
                            marginTop: 3,
                          }}
                        >
                          {item.service_id || "N/A"}
                        </small>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <b>{item.full_name || "N/A"}</b>

                        <small
                          style={{
                            display: "block",
                            color: COLORS.muted,
                            marginTop: 3,
                          }}
                        >
                          {item.phone || "N/A"}
                        </small>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        {item.jewellery_type || "N/A"}
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        {formatDate(item.booking_date)}
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        {item.start_time || "--"}
                        <small
                          style={{
                            display: "block",
                            color: COLORS.muted,
                            marginTop: 3,
                          }}
                        >
                          to {item.end_time || "--"}
                        </small>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            padding: "5px 8px",
                            borderRadius: 7,
                            background: "#F1F5F9",
                            fontSize: 9,
                            fontWeight: 800,
                          }}
                        >
                          {item.service_type || "N/A"}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "12px 10px",
                          fontWeight: 900,
                        }}
                      >
                        ₹
                        {Number(
                          item.total_amount || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            openDetails(item);
                          }}
                          style={{
                            ...styles.button,
                            padding: "6px 10px",
                            background: COLORS.light,
                            color: COLORS.dark,
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          FULL DETAILS MODAL
      ========================================================== */}

      {showDetails && selectedBooking && (
        <div
          onClick={closeDetails}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7,40,40,.65)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            padding: 20,
            overflowY: "auto",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(1100px,100%)",
              margin: "20px auto",
              background: COLORS.white,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,.25)",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,#006D6B 0%,#008F90 55%,#00A6A2 100%)",
                color: "#fff",
                padding: "18px 22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 15,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                >
                  Gold Repair Booking Details
                </div>

                <div
                  style={{
                    opacity: 0.8,
                    fontSize: 10,
                    marginTop: 4,
                  }}
                >
                  Complete information for Booking #{selectedBooking.id}
                </div>
              </div>

              <button
                onClick={closeDetails}
                style={{
                  width: 34,
                  height: 34,
                  border: "1px solid rgba(255,255,255,.3)",
                  background: "rgba(255,255,255,.12)",
                  color: "#fff",
                  borderRadius: 9,
                  cursor: "pointer",
                  fontSize: 17,
                }}
              >
                ✕
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div style={{ padding: 22 }}>
              {/* TOP SUMMARY */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  ["Booking ID", `#${selectedBooking.id}`],
                  ["Service ID", selectedBooking.service_id],
                  ["Service", selectedBooking.service_name],
                  ["Customer", selectedBooking.full_name],
                  ["Phone", selectedBooking.phone],
                  ["Total Amount", `₹${selectedBooking.total_amount}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: "#F7FAFA",
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 11,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        color: COLORS.muted,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </div>

                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 12,
                        fontWeight: 900,
                        wordBreak: "break-word",
                      }}
                    >
                      {value || "N/A"}
                    </div>
                  </div>
                ))}
              </div>

              {/* ALL DATA */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0,1.2fr) minmax(0,1fr)",
                  gap: 20,
                }}
              >
                {/* LEFT INFORMATION */}
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      marginBottom: 10,
                      color: COLORS.dark,
                    }}
                  >
                    📋 Complete Booking Information
                  </div>

                  <div
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 13,
                      overflow: "hidden",
                    }}
                  >
                    {[
                      ["id", selectedBooking.id],
                      ["service_id", selectedBooking.service_id],
                      ["service_name", selectedBooking.service_name],
                      ["jewellery_type", selectedBooking.jewellery_type],
                      [
                        "issue_description",
                        selectedBooking.issue_description,
                      ],
                      ["booking_date", formatDate(selectedBooking.booking_date)],
                      [
                        "booking_date_raw",
                        selectedBooking.booking_date,
                      ],
                      ["start_time", selectedBooking.start_time],
                      ["end_time", selectedBooking.end_time],
                      ["service_type", selectedBooking.service_type],
                      ["customer_type", selectedBooking.customer_type],
                      ["full_name", selectedBooking.full_name],
                      ["phone", selectedBooking.phone],
                      ["house_no", selectedBooking.house_no],
                      ["street", selectedBooking.street],
                      ["area", selectedBooking.area],
                      ["landmark", selectedBooking.landmark],
                      ["city", selectedBooking.city],
                      ["district", selectedBooking.district],
                      ["state", selectedBooking.state],
                      ["pincode", selectedBooking.pincode],
                      [
                        "special_instructions",
                        selectedBooking.special_instructions,
                      ],
                      ["service_fee", selectedBooking.service_fee],
                      ["tax_amount", selectedBooking.tax_amount],
                      ["total_amount", selectedBooking.total_amount],
                      ["created_at", formatDateTime(selectedBooking.created_at)],
                      ["updated_at", formatDateTime(selectedBooking.updated_at)],
                      ["status", selectedBooking.status || "IN_PROGRESS"],
                    ].map(([key, value], index) => (
                      <div
                        key={`${key}-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "180px 1fr",
                          gap: 15,
                          padding: "10px 12px",
                          background:
                            index % 2 === 0 ? "#FAFCFC" : "#fff",
                          borderBottom:
                            index === 27
                              ? "none"
                              : `1px solid ${COLORS.border}`,
                        }}
                      >
                        <div
                          style={{
                            color: COLORS.muted,
                            fontSize: 10,
                            fontWeight: 800,
                            wordBreak: "break-word",
                          }}
                        >
                          {key}
                        </div>

                        <div
                          style={{
                            color: COLORS.text,
                            fontSize: 11,
                            fontWeight: 600,
                            wordBreak: "break-word",
                          }}
                        >
                          {value !== undefined &&
                          value !== null &&
                          value !== ""
                            ? String(value)
                            : "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT IMAGES */}
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      marginBottom: 10,
                      color: COLORS.dark,
                    }}
                  >
                    🖼 Jewellery Images
                  </div>

                  {Array.isArray(selectedBooking.jewellery_images) &&
                  selectedBooking.jewellery_images.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(160px,1fr))",
                        gap: 10,
                      }}
                    >
                      {selectedBooking.jewellery_images.map(
                        (imageUrl, index) => (
                          <div
                            key={`${imageUrl}-${index}`}
                            style={{
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 12,
                              overflow: "hidden",
                              background: "#F4F7F7",
                            }}
                          >
                            <div
                              style={{
                                height: 180,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                  "linear-gradient(135deg,#F1F5F5,#E7EEEE)",
                                position: "relative",
                              }}
                            >
                              {imageUrl &&
                              imageUrl.startsWith("http") ? (
                                <img
                                  src={imageUrl}
                                  alt={`Jewellery ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: 12,
                                    color: COLORS.muted,
                                  }}
                                >
                                  <div style={{ fontSize: 35 }}>💍</div>

                                  <div
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 800,
                                      marginTop: 6,
                                    }}
                                  >
                                    Image {index + 1}
                                  </div>

                                  <div
                                    style={{
                                      fontSize: 8,
                                      marginTop: 5,
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    Local device image
                                  </div>
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                padding: 9,
                                background: "#fff",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 9,
                                  color: COLORS.muted,
                                  fontWeight: 700,
                                }}
                              >
                                IMAGE {index + 1}
                              </div>

                              <div
                                style={{
                                  fontSize: 8,
                                  marginTop: 4,
                                  color: COLORS.text,
                                  wordBreak: "break-all",
                                  lineHeight: 1.4,
                                }}
                              >
                                {imageUrl}
                              </div>

                              {imageUrl?.startsWith("http") && (
                                <a
                                  href={imageUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "inline-block",
                                    marginTop: 7,
                                    padding: "5px 8px",
                                    borderRadius: 6,
                                    background: COLORS.light,
                                    color: COLORS.dark,
                                    textDecoration: "none",
                                    fontSize: 9,
                                    fontWeight: 800,
                                  }}
                                >
                                  Open Image ↗
                                </a>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        border: `1px dashed ${COLORS.border}`,
                        borderRadius: 12,
                        padding: 40,
                        textAlign: "center",
                        color: COLORS.muted,
                        fontSize: 11,
                      }}
                    >
                      <div style={{ fontSize: 35 }}>📷</div>
                      No jewellery images available.
                    </div>
                  )}

                  {/* PAYMENT SUMMARY */}
                  <div
                    style={{
                      marginTop: 15,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12,
                      padding: 14,
                      background: "#FAFCFC",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        marginBottom: 10,
                      }}
                    >
                      💰 Payment Summary
                    </div>

                    {[
                      ["Service Fee", selectedBooking.service_fee],
                      ["Tax", selectedBooking.tax_amount],
                      ["Total Amount", selectedBooking.total_amount],
                    ].map(([label, amount]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "7px 0",
                          borderBottom:
                            label === "Total Amount"
                              ? "none"
                              : `1px solid ${COLORS.border}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: COLORS.muted,
                          }}
                        >
                          {label}
                        </span>

                        <b
                          style={{
                            fontSize: label === "Total Amount" ? 15 : 11,
                            color:
                              label === "Total Amount"
                                ? COLORS.dark
                                : COLORS.text,
                          }}
                        >
                          ₹{amount || "0.00"}
                        </b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div
                style={{
                  marginTop: 20,
                  padding: 15,
                  borderRadius: 12,
                  background: "#F7FAFA",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: COLORS.dark,
                    marginBottom: 8,
                  }}
                >
                  📍 Complete Service Address
                </div>

                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.7,
                    color: COLORS.text,
                  }}
                >
                  {[
                    selectedBooking.house_no,
                    selectedBooking.street,
                    selectedBooking.area,
                    selectedBooking.landmark
                      ? `Landmark: ${selectedBooking.landmark}`
                      : null,
                    selectedBooking.city,
                    selectedBooking.district,
                    selectedBooking.state,
                    selectedBooking.pincode
                      ? `PIN: ${selectedBooking.pincode}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Address not available"}
                </div>
              </div>

              {/* SPECIAL INSTRUCTIONS */}
              <div
                style={{
                  marginTop: 12,
                  padding: 15,
                  borderRadius: 12,
                  background: "#FFF9EA",
                  border: "1px solid #F5E3B0",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#946200",
                  }}
                >
                  📝 Special Instructions
                </div>

                <div
                  style={{
                    marginTop: 7,
                    fontSize: 11,
                    color: "#715000",
                  }}
                >
                  {selectedBooking.special_instructions ||
                    "No special instructions provided."}
                </div>
              </div>

              {/* CLOSE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 18,
                }}
              >
                {selectedBooking.phone && (
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    style={{
                      ...styles.button,
                      background: COLORS.light,
                      color: COLORS.dark,
                      textDecoration: "none",
                    }}
                  >
                    📞 Call Customer
                  </a>
                )}

                {selectedBooking.phone && (
                  <a
                    href={`https://wa.me/${selectedBooking.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...styles.button,
                      background: "#ECFDF5",
                      color: COLORS.green,
                      textDecoration: "none",
                    }}
                  >
                    💬 WhatsApp
                  </a>
                )}

                <button
                  onClick={closeDetails}
                  style={{
                    ...styles.button,
                    background: COLORS.dark,
                    color: "#fff",
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          RESPONSIVE CSS
      ========================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        button {
          transition: all .18s ease;
        }

        button:hover {
          transform: translateY(-1px);
          filter: brightness(.97);
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: ${COLORS.teal} !important;
          box-shadow: 0 0 0 3px rgba(0,143,144,.08);
        }

        tbody tr {
          transition: background .18s ease;
        }

        tbody tr:hover {
          background: #F3FBFA !important;
        }

        @media(max-width:900px) {
          div[style*="minmax(0,1.2fr)"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media(max-width:650px) {
          body {
            margin: 0;
          }

          div[style*="padding: 20px"] {
            padding: 10px !important;
          }

          table {
            min-width: 850px;
          }
        }
      `}</style>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://goldbackend-production-0ed4.up.railway.app/goldrepair/all";

const C = {
  teal: "#087F7B",
  dark: "#075E5B",
  light: "#E8F7F5",
  bg: "#F4F7F8",
  white: "#fff",
  text: "#172B2A",
  muted: "#71808A",
  border: "#E4EAEC",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  blue: "#2563EB",
};

const css = {
  page: {
    minHeight: "100vh",
    background: `linear-gradient(135deg,#F4F7F8 0%,#EDF5F4 100%)`,
    color: C.text,
    fontFamily: "Inter,Arial,sans-serif",
    padding: 20,
  },
  card: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(15,50,50,.06)",
  },
  input: {
    width: "100%",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "10px 12px 10px 38px",
    outline: "none",
    fontSize: 12,
    background: "#FAFCFC",
    boxSizing: "border-box",
  },
  btn: {
    border: 0,
    cursor: "pointer",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 11,
    padding: "9px 13px",
  },
};

const statusColor = (status) =>
  ({
    COMPLETED: [C.green, "#ECFDF5"],
    PENDING: [C.red, "#FEF2F2"],
    CANCELLED: [C.red, "#FEF2F2"],
    IN_PROGRESS: [C.amber, "#FFF7ED"],
  }[status] || [C.amber, "#FFF7ED"]);

export default function GoldRepair() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("SCHEDULE");
  const [activeDetailTab, setActiveDetailTab] = useState("Details");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("API request failed");

      const result = await response.json();
      const data =
        result?.success && Array.isArray(result.data)
          ? result.data.filter((x) => x?.id && x?.full_name)
          : [];

      setBookings(data);
      setSelectedBooking((prev) => prev || data[0] || null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch repair bookings. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const stats = useMemo(() => {
    const completed = bookings.filter(
      (b) => b.status === "COMPLETED"
    ).length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const inProgress = bookings.filter(
      (b) => b.status === "IN_PROGRESS" || !b.status
    ).length;
    const revenue = bookings.reduce(
      (sum, b) => sum + (parseFloat(b.total_amount) || 0),
      0
    );

    return [
      ["Total Bookings", bookings.length, "↑ +12%", "📅", C.blue, "#EFF6FF"],
      ["Completed", completed, "↑ +18%", "✓", C.green, "#ECFDF5"],
      ["In Progress", inProgress, "↑ 5%", "◷", C.amber, "#FFF7ED"],
      ["Pending", pending, "↓ 8%", "!", C.red, "#FEF2F2"],
      [
        "Total Revenue",
        `₹${revenue.toLocaleString("en-IN")}`,
        "↑ +22%",
        "₹",
        C.blue,
        "#EFF6FF",
      ],
    ];
  }, [bookings]);

  const counts = {
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    IN_PROGRESS: bookings.filter(
      (b) => b.status === "IN_PROGRESS" || !b.status
    ).length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  const filteredBookings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return bookings.filter((item) => {
      const matchesSearch =
        !q ||
        [item.full_name, item.phone, item.service_name, item.id]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesTab =
        activeTab === "SCHEDULE" ||
        activeTab === "LIST" ||
        item.status === activeTab ||
        (activeTab === "IN_PROGRESS" && !item.status);

      return matchesSearch && matchesTab;
    });
  }, [bookings, searchQuery, activeTab]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const currentStatus = selectedBooking?.status || "IN_PROGRESS";
  const [statusTextColor, statusBg] = statusColor(currentStatus);

  if (loading)
    return (
      <div
        style={{
          ...css.page,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ ...css.card, padding: 35, textAlign: "center" }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>💎</div>
          <b style={{ color: C.dark }}>Loading Gold Repair Dashboard...</b>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
            Fetching repair bookings
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          ...css.page,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ ...css.card, padding: 35, textAlign: "center" }}>
          <div style={{ fontSize: 35 }}>⚠️</div>
          <p style={{ color: C.red, fontWeight: 700 }}>{error}</p>
          <button
            onClick={fetchBookings}
            style={{ ...css.btn, background: C.teal, color: "#fff" }}
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div style={css.page}>
      {/* HEADER */}
      <header
        style={{
          ...css.card,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 18,
        }}
      >
        <div style={{ flex: 1, maxWidth: 520, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 13,
              top: 9,
              fontSize: 16,
              color: C.muted,
            }}
          >
            🔍
          </span>
          <input
            style={css.input}
            placeholder="Search booking ID, customer, mobile or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              border: `1px solid ${C.border}`,
              borderRadius: 9,
              fontSize: 11,
              background: "#FAFCFC",
            }}
          >
            📅 02 Oct 2026
          </div>

          <div style={{ position: "relative", fontSize: 20 }}>
            🔔
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -7,
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: C.red,
                color: "#fff",
                fontSize: 9,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              3
            </span>
          </div>

          <div
            style={{
              borderLeft: `1px solid ${C.border}`,
              paddingLeft: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                background: C.dark,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              A
            </div>
            <div>
              <b style={{ display: "block", fontSize: 12 }}>Admin</b>
              <span style={{ fontSize: 9, color: C.muted }}>
                Administrator
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* TITLE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
            Gold Repair
          </h1>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 12 }}>
            Manage repair bookings, technicians and customer requests
          </p>
        </div>

        <button
          style={{
            ...css.btn,
            background: `linear-gradient(135deg,${C.teal},${C.dark})`,
            color: "#fff",
            padding: "11px 16px",
            boxShadow: "0 5px 15px rgba(8,127,123,.2)",
          }}
        >
          ＋ Add Booking
        </button>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {stats.map(([title, value, growth, icon, color, bg]) => (
          <div
            key={title}
            style={{
              ...css.card,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `3px solid ${color}`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  fontWeight: 600,
                  marginBottom: 5,
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 23, fontWeight: 800 }}>{value}</div>
              <div style={{ color, fontSize: 10, marginTop: 4 }}>
                {growth}{" "}
                <span style={{ color: C.muted, fontWeight: 400 }}>
                  This Month
                </span>
              </div>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: bg,
                color,
                display: "grid",
                placeItems: "center",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(320px,1fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <main>
          {/* TABS */}
          <div
            style={{
              ...css.card,
              padding: 7,
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 12,
            }}
          >
            {[
              ["SCHEDULE", "📅 Schedule"],
              ["LIST", "☷ List"],
              ["PENDING", `Pending ${counts.PENDING}`],
              ["IN_PROGRESS", `In Progress ${counts.IN_PROGRESS}`],
              ["COMPLETED", `Completed ${counts.COMPLETED}`],
              ["CANCELLED", `Cancelled ${counts.CANCELLED}`],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  ...css.btn,
                  padding: "8px 11px",
                  background: activeTab === key ? C.dark : "#F5F8F8",
                  color: activeTab === key ? "#fff" : C.muted,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* FILTER */}
          <div
            style={{
              ...css.card,
              padding: 11,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {["02 Oct 2026", "All Services", "All Technicians", "All Status"].map(
              (x) => (
                <select
                  key={x}
                  defaultValue={x}
                  style={{
                    border: `1px solid ${C.border}`,
                    background: "#F8FAFA",
                    borderRadius: 8,
                    padding: "8px 10px",
                    fontSize: 11,
                    color: C.muted,
                    outline: "none",
                  }}
                >
                  <option>{x}</option>
                </select>
              )
            )}

            <input
              style={{
                ...css.input,
                width: 180,
                marginLeft: "auto",
                padding: "8px 10px",
              }}
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div style={{ ...css.card, overflow: "hidden", marginBottom: 14 }}>
            <div
              style={{
                padding: "15px 16px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <b style={{ fontSize: 14 }}>Today's Schedule</b>
                <span style={{ color: C.muted, fontSize: 11, marginLeft: 8 }}>
                  02 October 2026
                </span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: C.teal,
                  background: C.light,
                  padding: "6px 9px",
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              >
                {filteredBookings.length} Bookings
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 11,
                  minWidth: 760,
                }}
              >
                <thead>
                  <tr style={{ background: "#F8FAFA", color: C.muted }}>
                    {[
                      "ID",
                      "Customer",
                      "Service",
                      "Type",
                      "Date & Time",
                      "City",
                      "Amount",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "11px 10px",
                          textAlign: "left",
                          fontWeight: 700,
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.length ? (
                    filteredBookings.map((item) => {
                      const selected = selectedBooking?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedBooking(item)}
                          style={{
                            cursor: "pointer",
                            background: selected ? "#F0FBF9" : "#fff",
                            borderBottom: `1px solid ${C.border}`,
                            transition: "all .2s",
                          }}
                        >
                          <td style={{ padding: "12px 10px", fontWeight: 800 }}>
                            #{item.id}
                          </td>
                          <td style={{ padding: "12px 10px" }}>
                            <b>{item.full_name || "N/A"}</b>
                            <small
                              style={{
                                display: "block",
                                color: C.muted,
                                marginTop: 3,
                              }}
                            >
                              {item.phone || "N/A"}
                            </small>
                          </td>
                          <td style={{ padding: "12px 10px" }}>
                            {item.service_name || "Custom Repair"}
                          </td>
                          <td style={{ padding: "12px 10px", color: C.muted }}>
                            {item.jewellery_type || "N/A"}
                          </td>
                          <td style={{ padding: "12px 10px" }}>
                            {formatDate(item.booking_date)}
                            <small
                              style={{
                                display: "block",
                                color: C.muted,
                                marginTop: 3,
                              }}
                            >
                              {item.start_time || "--"} - {item.end_time || "--"}
                            </small>
                          </td>
                          <td style={{ padding: "12px 10px", color: C.muted }}>
                            {item.city || "N/A"}
                          </td>
                          <td style={{ padding: "12px 10px", fontWeight: 800 }}>
                            ₹{item.total_amount || 0}
                          </td>
                          <td style={{ padding: "12px 10px" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(item);
                              }}
                              style={{
                                ...css.btn,
                                padding: "6px 9px",
                                background: C.light,
                                color: C.dark,
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          padding: 40,
                          textAlign: "center",
                          color: C.muted,
                        }}
                      >
                        <div style={{ fontSize: 28 }}>📭</div>
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* UPCOMING */}
          <div style={{ ...css.card, padding: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <b style={{ fontSize: 13 }}>Upcoming Bookings</b>
              <span style={{ color: C.teal, fontSize: 11, fontWeight: 700 }}>
                Next 7 Days →
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                gap: 9,
              }}
            >
              {bookings.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedBooking(item)}
                  style={{
                    padding: 12,
                    background: "#F8FAFA",
                    border: `1px solid ${C.border}`,
                    borderRadius: 11,
                    cursor: "pointer",
                  }}
                >
                  <small style={{ color: C.muted }}>
                    {formatDate(item.booking_date)}
                  </small>
                  <b
                    style={{
                      display: "block",
                      fontSize: 11,
                      marginTop: 5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.service_name || "Gold Repair"}
                  </b>
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      color: C.muted,
                      marginTop: 4,
                    }}
                  >
                    {item.full_name}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      padding: "4px 7px",
                      borderRadius: 6,
                      background: "#FFF4D6",
                      color: "#9A6700",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {item.customer_type || "Upcoming"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* RIGHT DETAIL PANEL */}
        <aside
          style={{
            ...css.card,
            overflow: "hidden",
            position: "sticky",
            top: 20,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg,${C.dark},${C.teal})`,
              color: "#fff",
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <b style={{ fontSize: 14 }}>Booking Details</b>
              <div style={{ opacity: 0.75, fontSize: 10, marginTop: 3 }}>
                Repair management panel
              </div>
            </div>
            <button
              style={{
                border: "1px solid rgba(255,255,255,.25)",
                background: "rgba(255,255,255,.1)",
                color: "#fff",
                borderRadius: 8,
                padding: "5px 9px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {!selectedBooking ? (
            <div style={{ padding: 40, textAlign: "center", color: C.muted }}>
              Select a booking to view details.
            </div>
          ) : (
            <div style={{ padding: 16 }}>
              {/* STATUS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <span
                  style={{
                    color: statusTextColor,
                    background: statusBg,
                    borderRadius: 20,
                    padding: "6px 10px",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  ● {currentStatus.replace("_", " ")}
                </span>
                <b style={{ fontSize: 10, color: C.muted }}>
                  #{selectedBooking.id}
                </b>
              </div>

              {/* CUSTOMER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 15,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 13,
                      background: C.light,
                      color: C.dark,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    {selectedBooking.full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <b style={{ fontSize: 13 }}>
                      {selectedBooking.full_name || "N/A"}
                    </b>
                    <small
                      style={{
                        display: "block",
                        color: C.muted,
                        marginTop: 3,
                      }}
                    >
                      {selectedBooking.phone || "N/A"}
                    </small>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <a
                    href={`tel:${selectedBooking.phone || ""}`}
                    style={{
                      textDecoration: "none",
                      background: "#F1F5F9",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    📞
                  </a>
                  <a
                    href={`https://wa.me/${selectedBooking.phone || ""}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      background: "#ECFDF5",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    💬
                  </a>
                </div>
              </div>

              {/* DETAIL TABS */}
              <div
                style={{
                  display: "flex",
                  borderBottom: `1px solid ${C.border}`,
                  marginBottom: 15,
                }}
              >
                {["Details", "Images", "History"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    style={{
                      flex: 1,
                      border: 0,
                      background: "transparent",
                      padding: "10px 4px",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        activeDetailTab === tab ? C.teal : C.muted,
                      borderBottom:
                        activeDetailTab === tab
                          ? `2px solid ${C.teal}`
                          : "2px solid transparent",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* DETAILS */}
              {activeDetailTab === "Details" && (
                <div style={{ fontSize: 11 }}>
                  {[
                    ["Service", selectedBooking.service_name || "N/A"],
                    ["Jewellery", selectedBooking.jewellery_type || "N/A"],
                    [
                      "Issue",
                      selectedBooking.issue_description || "N/A",
                    ],
                    [
                      "Date & Time",
                      `${formatDate(selectedBooking.booking_date)} • ${
                        selectedBooking.start_time || "--"
                      } - ${selectedBooking.end_time || "--"}`,
                    ],
                    [
                      "Address",
                      [
                        selectedBooking.house_no,
                        selectedBooking.street,
                        selectedBooking.area,
                        selectedBooking.city,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 15,
                        padding: "8px 0",
                        borderBottom: `1px dashed ${C.border}`,
                      }}
                    >
                      <span style={{ color: C.muted, minWidth: 75 }}>
                        {label}
                      </span>
                      <b style={{ textAlign: "right", maxWidth: 210 }}>
                        {value}
                      </b>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    <span style={{ color: C.muted }}>Status</span>
                    <select
                      defaultValue={currentStatus}
                      style={{
                        border: 0,
                        background: statusBg,
                        color: statusTextColor,
                        padding: "5px 8px",
                        borderRadius: 7,
                        fontWeight: 700,
                        fontSize: 10,
                      }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 11,
                    }}
                  >
                    <span style={{ color: C.muted }}>Amount</span>
                    <b style={{ fontSize: 16 }}>
                      ₹{selectedBooking.total_amount || selectedBooking.service_fee || 0}
                    </b>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <span style={{ color: C.muted }}>Payment</span>
                    <span
                      style={{
                        background: "#ECFDF5",
                        color: C.green,
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 9,
                        fontWeight: 800,
                      }}
                    >
                      PAID
                    </span>
                  </div>

                  <label
                    style={{
                      display: "block",
                      fontWeight: 700,
                      marginTop: 15,
                      marginBottom: 6,
                    }}
                  >
                    Admin Notes
                  </label>
                  <textarea
                    rows="3"
                    defaultValue={selectedBooking.special_instructions || ""}
                    placeholder="Add notes about this booking..."
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border: `1px solid ${C.border}`,
                      background: "#F8FAFA",
                      borderRadius: 9,
                      padding: 9,
                      resize: "vertical",
                      outline: "none",
                      fontSize: 11,
                    }}
                  />
                </div>
              )}

              {/* IMAGES */}
              {activeDetailTab === "Images" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {Array.isArray(selectedBooking.jewellery_images) &&
                  selectedBooking.jewellery_images.length ? (
                    selectedBooking.jewellery_images.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          height: 110,
                          borderRadius: 10,
                          overflow: "hidden",
                          background: "#F1F5F9",
                          border: `1px solid ${C.border}`,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {url?.startsWith("http") ? (
                          <img
                            src={url}
                            alt={`Jewellery ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ color: C.muted, fontSize: 10 }}>
                            Image {index + 1}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        gridColumn: "1/-1",
                        textAlign: "center",
                        color: C.muted,
                        padding: 25,
                      }}
                    >
                      📷 No images attached.
                    </p>
                  )}
                </div>
              )}

              {/* HISTORY */}
              {activeDetailTab === "History" && (
                <div>
                  {[
                    ["Booking Created", "Customer submitted repair request"],
                    ["Inspection", "Jewellery received for inspection"],
                    ["Repair", "Repair process pending"],
                  ].map(([title, text], i) => (
                    <div
                      key={title}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "10px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: i === 2 ? "#FFF7ED" : C.light,
                          color: i === 2 ? C.amber : C.teal,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <b style={{ fontSize: 11 }}>{title}</b>
                        <p
                          style={{
                            margin: "3px 0",
                            color: C.muted,
                            fontSize: 10,
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ACTIONS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 6,
                  borderTop: `1px solid ${C.border}`,
                  marginTop: 16,
                  paddingTop: 14,
                }}
              >
                <button
                  style={{
                    ...css.btn,
                    background: "#ECFDF5",
                    color: C.green,
                  }}
                >
                  ✓ Complete
                </button>
                <button
                  style={{
                    ...css.btn,
                    background: "#FFF7ED",
                    color: C.amber,
                  }}
                >
                  📅 Reschedule
                </button>
                <button
                  style={{
                    ...css.btn,
                    background: "#FEF2F2",
                    color: C.red,
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* RESPONSIVE INLINE STYLE */}
      <style>{`
        @media(max-width:1000px){
          div[style*="minmax(320px,1fr)"]{grid-template-columns:1fr!important}
          aside[style*="position:sticky"]{position:relative!important;top:0!important}
        }
        @media(max-width:700px){
          body{margin:0}
          header{flex-direction:column!important;align-items:stretch!important}
          header>div:last-child{justify-content:space-between}
          ${` `}
        }
        button:hover{filter:brightness(.97)}
        tr:hover{background:#F8FCFC!important}
        input:focus,select:focus,textarea:focus{
          border-color:${C.teal}!important;
          box-shadow:0 0 0 3px rgba(8,127,123,.08);
        }
      `}</style>
    </div>
  );
}

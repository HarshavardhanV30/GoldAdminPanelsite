// goldrepir.js

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Eye,
  Pencil,
  MoreVertical,
  Plus,
  Wrench,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  Phone,
  UserRound,
  Image as ImageIcon,
  X,
  Database,
  Filter,
  IndianRupee,
} from "lucide-react";

const API_URL =
  "https://goldbackend-production-0ed4.up.railway.app/goldrepair/all";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1611591475850-9d5a7d97cb8a?w=800&auto=format&fit=crop&q=80";

const API_KEYS = [
  "id",
  "service_id",
  "service_name",
  "jewellery_type",
  "issue_description",
  "jewellery_images",
  "booking_date",
  "start_time",
  "end_time",
  "service_type",
  "customer_type",
  "full_name",
  "phone",
  "house_no",
  "street",
  "area",
  "landmark",
  "city",
  "district",
  "state",
  "pincode",
  "special_instructions",
  "service_fee",
  "tax_amount",
  "total_amount",
  "created_at",
  "updated_at",
];

const EMPTY_BOOKING = {
  id: "",
  service_id: "",
  service_name: "",
  jewellery_type: "",
  issue_description: "",
  jewellery_images: [],
  booking_date: "",
  start_time: "",
  end_time: "",
  service_type: "",
  customer_type: "",
  full_name: "",
  phone: "",
  house_no: "",
  street: "",
  area: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  special_instructions: "",
  service_fee: "0.00",
  tax_amount: "0.00",
  total_amount: "0.00",
  created_at: "",
  updated_at: "",
};

function getTodayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function dateKey(value) {
  if (!value) return "";
  return String(value).substring(0, 10);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  if (!value) return "—";

  const parts = String(value).split(":");
  const hour = Number(parts[0]);
  const minute = parts[1] || "00";

  if (Number.isNaN(hour)) return value;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}

function formatTimeRange(row) {
  if (!row.start_time && !row.end_time) return "—";

  return `${formatTime(row.start_time)} - ${formatTime(row.end_time)}`;
}

function money(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number.isNaN(amount) ? 0 : amount);
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (Array.isArray(value)) {
    const values = value.filter(Boolean);

    return values.length ? values.join(" | ") : "—";
  }

  return String(value);
}

function isValidBooking(row) {
  return Boolean(
    row &&
      (row.id ||
        row.service_id ||
        row.service_name ||
        row.full_name ||
        row.booking_date)
  );
}

function getStatus(row) {
  const bookingDate = dateKey(row.booking_date);
  const today = getTodayKey();

  if (!bookingDate) {
    return {
      label: "Incomplete",
      className: "status-incomplete",
    };
  }

  if (bookingDate === today) {
    return {
      label: "Today",
      className: "status-today",
    };
  }

  if (bookingDate > today) {
    return {
      label: "Upcoming",
      className: "status-upcoming",
    };
  }

  return {
    label: "Past",
    className: "status-past",
  };
}

function getImage(row) {
  const images = Array.isArray(row.jewellery_images)
    ? row.jewellery_images
    : [];

  const onlineImage = images.find(
    (image) =>
      typeof image === "string" &&
      (image.startsWith("http://") || image.startsWith("https://"))
  );

  return onlineImage || FALLBACK_IMAGE;
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: previousDays - i,
      current: false,
      key: "",
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push({
      day,
      current: true,
      key: `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`,
    });
  }

  while (days.length < 42) {
    days.push({
      day: days.length - firstDay - totalDays + 1,
      current: false,
      key: "",
    });
  }

  return days.slice(0, 42);
}

export default function GoldRepair() {
  const [bookings, setBookings] = useState([]);
  const [apiCount, setApiCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showRawApi, setShowRawApi] = useState(false);
  const [mobileDetails, setMobileDetails] = useState(false);

  const [calendarDate, setCalendarDate] = useState(
    new Date(2026, 9, 1)
  );

  const fetchBookings = useCallback(async (refresh = false) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result || result.success !== true) {
        throw new Error(
          result?.message || "API returned unsuccessful response"
        );
      }

      const rows = Array.isArray(result.data) ? result.data : [];

      setBookings(rows);
      setApiCount(Number(result.count) || rows.length);

      setSelectedBooking((oldSelected) => {
        if (!oldSelected) {
          return rows.find(isValidBooking) || null;
        }

        return (
          rows.find(
            (row) => String(row.id) === String(oldSelected.id)
          ) ||
          rows.find(isValidBooking) ||
          null
        );
      });
    } catch (err) {
      console.error("Gold Repair API Error:", err);

      setError(
        err?.message || "Unable to load gold repair bookings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const today = getTodayKey();

  const validBookings = useMemo(
    () => bookings.filter(isValidBooking),
    [bookings]
  );

  const statistics = useMemo(() => {
    const todayBookings = validBookings.filter(
      (row) => dateKey(row.booking_date) === today
    );

    const upcomingBookings = validBookings.filter(
      (row) => dateKey(row.booking_date) > today
    );

    const pastBookings = validBookings.filter(
      (row) => dateKey(row.booking_date) < today
    );

    const revenue = validBookings.reduce(
      (total, row) => total + Number(row.total_amount || 0),
      0
    );

    return {
      total: apiCount || bookings.length,
      today: todayBookings.length,
      upcoming: upcomingBookings.length,
      past: pastBookings.length,
      incomplete: bookings.length - validBookings.length,
      revenue,
    };
  }, [apiCount, bookings, today, validBookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((row) => {
      const searchableText = [
        row.id,
        row.service_id,
        row.service_name,
        row.jewellery_type,
        row.issue_description,
        row.full_name,
        row.phone,
        row.house_no,
        row.street,
        row.area,
        row.landmark,
        row.city,
        row.district,
        row.state,
        row.pincode,
        row.service_type,
        row.customer_type,
      ]
        .map(displayValue)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesDate =
        !dateFilter ||
        dateKey(row.booking_date) === dateFilter;

      const rowStatus = getStatus(row).label.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        rowStatus === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [
    bookings,
    search,
    dateFilter,
    statusFilter,
  ]);

  const todayBookings = useMemo(() => {
    return validBookings
      .filter(
        (row) => dateKey(row.booking_date) === today
      )
      .sort((a, b) =>
        String(a.start_time || "").localeCompare(
          String(b.start_time || "")
        )
      );
  }, [validBookings, today]);

  const calendarDays = useMemo(
    () =>
      getCalendarDays(
        calendarDate.getFullYear(),
        calendarDate.getMonth()
      ),
    [calendarDate]
  );

  const bookingDates = useMemo(() => {
    return new Set(
      bookings
        .map((row) => dateKey(row.booking_date))
        .filter(Boolean)
    );
  }, [bookings]);

  const calendarTitle = calendarDate.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  const selected = selectedBooking || EMPTY_BOOKING;
  const selectedStatus = getStatus(selected);

  function selectBooking(row) {
    setSelectedBooking(row);
    setMobileDetails(true);
  }

  function previousMonth() {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        1
      )
    );
  }

  function goToday() {
    const current = new Date();

    setCalendarDate(
      new Date(
        current.getFullYear(),
        current.getMonth(),
        1
      )
    );

    setDateFilter(getTodayKey());
  }

  function resetFilters() {
    setSearch("");
    setDateFilter("");
    setStatusFilter("all");
  }

  return (
    <div className="gold-repair-app">
      <style>{styles}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">♔</div>

          <div>
            <div className="brand-name">G-BUYER</div>
            <div className="brand-sub">ADMIN PANEL</div>
          </div>
        </div>

        <div className="sidebar-line" />

        <nav className="navigation">
          <button className="nav-item">
            <span>⌂</span>
            Dashboard
          </button>

          <button className="nav-item active">
            <span>⚒</span>
            Gold Repair
          </button>

          <button className="nav-item">
            <span>▣</span>
            All Bookings
            <b>{apiCount || bookings.length}</b>
          </button>

          <button className="nav-item">
            <span>◷</span>
            Today's Schedule
          </button>

          <button className="nav-item">
            <span>▦</span>
            Calendar View
          </button>

          <button className="nav-item">
            <span>♙</span>
            Customers
          </button>

          <button className="nav-item">
            <span>▤</span>
            Services
          </button>

          <button className="nav-item">
            <span>▥</span>
            Inventory
          </button>

          <button className="nav-item">
            <span>▣</span>
            Payments
          </button>

          <button className="nav-item">
            <span>▥</span>
            Reports
          </button>

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="support-box">
            <div className="support-icon">◉</div>

            <div>
              <strong>Need Help?</strong>
              <span>Contact Support</span>
            </div>
          </div>

          <button className="logout">
            ⇥ &nbsp; Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* HEADER */}
        <header className="header">
          <div className="search-box">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search by Booking ID, Customer Name, Mobile Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="header-right">
            <button className="notification-button">
              <Bell size={20} />
              <span>3</span>
            </button>

            <div className="admin-user">
              <div className="admin-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <small>admin@g-buyer.com</small>
              </div>

              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* STATISTICS */}
        <section className="statistics">
          <StatCard
            icon={<CalendarDays />}
            title="Total Bookings"
            value={statistics.total}
            subtitle={`${validBookings.length} valid records`}
            color="blue"
          />

          <StatCard
            icon={<Wrench />}
            title="Today's Bookings"
            value={statistics.today}
            subtitle={formatDate(today)}
            color="gold"
          />

          <StatCard
            icon={<Clock3 />}
            title="Upcoming"
            value={statistics.upcoming}
            subtitle="Future schedules"
            color="purple"
          />

          <StatCard
            icon={<CheckCircle2 />}
            title="Total Revenue"
            value={money(statistics.revenue)}
            subtitle="From total_amount"
            color="green"
            small
          />

          <StatCard
            icon={<XCircle />}
            title="Incomplete"
            value={statistics.incomplete}
            subtitle="Missing booking data"
            color="red"
          />
        </section>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            <div>
              <strong>Unable to load booking data</strong>
              <span>{error}</span>
            </div>

            <button onClick={() => fetchBookings(true)}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          {/* LEFT */}
          <section className="left-content">
            {/* BOOKING TABLE */}
            <div className="card booking-card">
              <div className="card-header">
                <div className="title-area">
                  <CalendarDays size={23} />

                  <div>
                    <h2>Gold Repair Schedule</h2>
                    <p>
                      Live data from{" "}
                      <strong>/goldrepair/all</strong>
                    </p>
                  </div>
                </div>

                <div className="header-buttons">
                  <button
                    className="date-button"
                    onClick={goToday}
                  >
                    <CalendarDays size={16} />
                    Today
                  </button>

                  <button
                    className="primary-button"
                    onClick={() =>
                      alert(
                        "Connect your create booking API here."
                      )
                    }
                  >
                    <Plus size={18} />
                    New Booking
                  </button>
                </div>
              </div>

              {/* TABS */}
              <div className="tabs">
                <button
                  className={
                    statusFilter === "all" ? "active" : ""
                  }
                  onClick={() => setStatusFilter("all")}
                >
                  All ({bookings.length})
                </button>

                <button
                  className={
                    statusFilter === "today" ? "active" : ""
                  }
                  onClick={() => setStatusFilter("today")}
                >
                  Today ({statistics.today})
                </button>

                <button
                  className={
                    statusFilter === "upcoming"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setStatusFilter("upcoming")
                  }
                >
                  Upcoming ({statistics.upcoming})
                </button>

                <button
                  className={
                    statusFilter === "past" ? "active" : ""
                  }
                  onClick={() => setStatusFilter("past")}
                >
                  Past ({statistics.past})
                </button>

                <button
                  className={
                    statusFilter === "incomplete"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setStatusFilter("incomplete")
                  }
                >
                  Incomplete ({statistics.incomplete})
                </button>
              </div>

              {/* FILTERS */}
              <div className="filters">
                <label className="filter">
                  <CalendarDays size={16} />

                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) =>
                      setDateFilter(e.target.value)
                    }
                  />
                </label>

                <label className="filter">
                  <Filter size={16} />

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                  >
                    <option value="all">
                      All Schedule Status
                    </option>
                    <option value="today">Today</option>
                    <option value="upcoming">
                      Upcoming
                    </option>
                    <option value="past">Past</option>
                    <option value="incomplete">
                      Incomplete
                    </option>
                  </select>
                </label>

                <button
                  className="reset-button"
                  onClick={resetFilters}
                >
                  Reset
                </button>

                <button
                  className="refresh-button"
                  onClick={() => fetchBookings(true)}
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={16}
                    className={
                      refreshing ? "spin" : ""
                    }
                  />
                  {refreshing
                    ? "Refreshing..."
                    : "Refresh"}
                </button>
              </div>

              {/* TABLE */}
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Jewellery</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Schedule</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="10"
                          className="loading-cell"
                        >
                          <RefreshCw
                            className="spin"
                            size={24}
                          />
                          Loading booking data...
                        </td>
                      </tr>
                    ) : filteredBookings.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          className="loading-cell"
                        >
                          No booking records found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map(
                        (row, index) => {
                          const status = getStatus(row);

                          return (
                            <tr
                              key={
                                row.id ||
                                `booking-${index}`
                              }
                              className={
                                selectedBooking?.id ===
                                row.id
                                  ? "selected-row"
                                  : ""
                              }
                            >
                              <td className="booking-id">
                                {row.id
                                  ? `#${row.id}`
                                  : "—"}
                              </td>

                              <td>
                                <strong>
                                  {formatDate(
                                    row.booking_date
                                  )}
                                </strong>
                              </td>

                              <td className="time">
                                {formatTimeRange(row)}
                              </td>

                              <td>
                                <div className="customer">
                                  <div className="customer-avatar">
                                    {(
                                      row.full_name ||
                                      "?"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <strong>
                                      {row.full_name ||
                                        "Unknown"}
                                    </strong>

                                    <small>
                                      {row.phone ||
                                        "No mobile"}
                                    </small>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="service">
                                  <div className="service-image">
                                    <img
                                      src={getImage(row)}
                                      alt={
                                        row.service_name ||
                                        "Jewellery"
                                      }
                                    />
                                  </div>

                                  <div>
                                    <strong>
                                      {row.service_name ||
                                        "Service not provided"}
                                    </strong>

                                    <small>
                                      {row.service_id ||
                                        "No service ID"}
                                    </small>
                                  </div>
                                </div>
                              </td>

                              <td>
                                {row.jewellery_type ||
                                  "—"}
                              </td>

                              <td>
                                <span className="service-type">
                                  {row.service_type ||
                                    "—"}
                                </span>
                              </td>

                              <td className="amount">
                                {money(
                                  row.total_amount
                                )}
                              </td>

                              <td>
                                <span
                                  className={`status ${status.className}`}
                                >
                                  {status.label}
                                </span>
                              </td>

                              <td>
                                <div className="actions">
                                  <button
                                    title="View"
                                    onClick={() =>
                                      selectBooking(row)
                                    }
                                  >
                                    <Eye size={16} />
                                  </button>

                                  <button
                                    title="Edit"
                                    onClick={() =>
                                      alert(
                                        `Edit Booking #${row.id}`
                                      )
                                    }
                                  >
                                    <Pencil size={15} />
                                  </button>

                                  <button title="More">
                                    <MoreVertical
                                      size={16}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span>
                  Showing{" "}
                  <strong>
                    {filteredBookings.length}
                  </strong>{" "}
                  of{" "}
                  <strong>{bookings.length}</strong>{" "}
                  API records
                </span>

                <button
                  onClick={() =>
                    setShowRawApi(!showRawApi)
                  }
                >
                  <Database size={15} />
                  {showRawApi
                    ? "Hide API Fields"
                    : "Show All API Fields"}
                </button>
              </div>
            </div>

            {/* RAW API TABLE */}
            {showRawApi && (
              <div className="card raw-api-card">
                <div className="card-header">
                  <div className="title-area">
                    <Database size={22} />

                    <div>
                      <h2>Complete API Response</h2>
                      <p>
                        Every JSON key is displayed as a
                        column and every data object as a
                        row.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="raw-table-container">
                  <table className="raw-table">
                    <thead>
                      <tr>
                        {API_KEYS.map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {bookings.map((row, index) => (
                        <tr
                          key={
                            row.id ||
                            `raw-${index}`
                          }
                        >
                          {API_KEYS.map((key) => (
                            <td
                              key={`${index}-${key}`}
                            >
                              {key ===
                              "jewellery_images"
                                ? displayValue(
                                    row[key]
                                  )
                                : key ===
                                    "service_fee" ||
                                  key ===
                                    "tax_amount" ||
                                  key ===
                                    "total_amount"
                                ? money(row[key])
                                : displayValue(
                                    row[key]
                                  )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TODAY SCHEDULE */}
            <div className="card today-card">
              <div className="card-header">
                <div className="title-area">
                  <Clock3 size={22} />

                  <div>
                    <h2>
                      Today's Repair Schedule
                    </h2>

                    <p>
                      {todayBookings.length} booking(s)
                      scheduled today
                    </p>
                  </div>
                </div>
              </div>

              {todayBookings.length === 0 ? (
                <div className="empty">
                  No bookings scheduled for today.
                </div>
              ) : (
                <div className="timeline">
                  {todayBookings.map((row) => (
                    <button
                      key={row.id}
                      className="timeline-item"
                      onClick={() =>
                        selectBooking(row)
                      }
                    >
                      <span className="timeline-time">
                        {formatTime(
                          row.start_time
                        )}
                      </span>

                      <span className="timeline-dot" />

                      <span className="timeline-info">
                        <strong>
                          {row.full_name ||
                            "Unknown Customer"}
                        </strong>

                        <small>
                          {row.service_name ||
                            "Repair Service"}{" "}
                          ·{" "}
                          {formatTimeRange(row)}
                        </small>
                      </span>

                      <span className="timeline-price">
                        {money(row.total_amount)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="right-content">
            {/* CALENDAR */}
            <div className="card calendar-card">
              <div className="side-header">
                <div>
                  <h3>{calendarTitle}</h3>
                  <span>Booking calendar</span>
                </div>

                <div className="calendar-actions">
                  <button onClick={previousMonth}>
                    <ChevronLeft size={17} />
                  </button>

                  <button onClick={nextMonth}>
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="weekdays">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarDays.map(
                  (calendarDay, index) => {
                    const isToday =
                      calendarDay.key === today;

                    const hasBooking =
                      bookingDates.has(
                        calendarDay.key
                      );

                    const selected =
                      dateFilter ===
                      calendarDay.key;

                    return (
                      <button
                        key={`${calendarDay.key}-${index}`}
                        disabled={!calendarDay.current}
                        className={[
                          !calendarDay.current
                            ? "calendar-muted"
                            : "",
                          isToday
                            ? "calendar-today"
                            : "",
                          selected
                            ? "calendar-selected"
                            : "",
                        ].join(" ")}
                        onClick={() => {
                          if (
                            calendarDay.current
                          ) {
                            setDateFilter(
                              dateFilter ===
                                calendarDay.key
                                ? ""
                                : calendarDay.key
                            );
                          }
                        }}
                      >
                        {calendarDay.day}

                        {hasBooking && (
                          <i />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="calendar-legend">
                <span>
                  <i className="today-dot" />
                  Today
                </span>

                <span>
                  <i className="booking-dot" />
                  Booking
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="card details-card">
              <div className="side-header">
                <div>
                  <h3>Booking Details</h3>

                  <span>
                    {selected.id
                      ? `Booking #${selected.id}`
                      : "Select booking"}
                  </span>
                </div>

                {selected.id && (
                  <span
                    className={`status ${selectedStatus.className}`}
                  >
                    {selectedStatus.label}
                  </span>
                )}
              </div>

              {!selected.id ? (
                <div className="empty details-empty">
                  <Eye size={32} />

                  <strong>
                    Select a booking
                  </strong>

                  <span>
                    Click the view icon from the
                    booking table.
                  </span>
                </div>
              ) : (
                <>
                  <div className="detail-hero">
                    <div className="detail-image">
                      <img
                        src={getImage(selected)}
                        alt={
                          selected.service_name ||
                          "Gold repair"
                        }
                      />
                    </div>

                    <div>
                      <span className="service-id">
                        {selected.service_id ||
                          "NO SERVICE ID"}
                      </span>

                      <h3>
                        {selected.service_name ||
                          "Service not provided"}
                      </h3>

                      <p>
                        {selected.jewellery_type ||
                          "Jewellery type not provided"}
                      </p>
                    </div>
                  </div>

                  <DetailSection title="Customer">
                    <DetailRow
                      icon={<UserRound size={16} />}
                      label="Customer"
                      value={selected.full_name}
                    />

                    <DetailRow
                      icon={<Phone size={16} />}
                      label="Mobile"
                      value={selected.phone}
                    />

                    <DetailRow
                      icon={<MapPin size={16} />}
                      label="Address"
                      value={[
                        selected.house_no,
                        selected.street,
                        selected.area,
                        selected.landmark,
                        selected.city,
                        selected.district,
                        selected.state,
                        selected.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                  </DetailSection>

                  <DetailSection title="Schedule">
                    <DetailRow
                      icon={
                        <CalendarDays size={16} />
                      }
                      label="Date"
                      value={formatDate(
                        selected.booking_date
                      )}
                    />

                    <DetailRow
                      icon={<Clock3 size={16} />}
                      label="Time"
                      value={formatTimeRange(
                        selected
                      )}
                    />

                    <DetailRow
                      icon={<Wrench size={16} />}
                      label="Service Type"
                      value={selected.service_type}
                    />

                    <DetailRow
                      icon={<UserRound size={16} />}
                      label="Customer Type"
                      value={selected.customer_type}
                    />
                  </DetailSection>

                  <DetailSection title="Repair Information">
                    <DetailRow
                      icon={<Wrench size={16} />}
                      label="Issue"
                      value={
                        selected.issue_description
                      }
                    />

                    <DetailRow
                      icon={<IndianRupee size={16} />}
                      label="Service Fee"
                      value={money(
                        selected.service_fee
                      )}
                    />

                    <DetailRow
                      icon={<IndianRupee size={16} />}
                      label="Tax"
                      value={money(
                        selected.tax_amount
                      )}
                    />

                    <DetailRow
                      icon={<IndianRupee size={16} />}
                      label="Total"
                      value={money(
                        selected.total_amount
                      )}
                      highlight
                    />

                    <DetailRow
                      label="Instructions"
                      value={
                        selected.special_instructions
                      }
                    />
                  </DetailSection>

                  <DetailSection title="Jewellery Images">
                    <div className="image-grid">
                      {(
                        Array.isArray(
                          selected.jewellery_images
                        )
                          ? selected.jewellery_images
                          : []
                      ).filter(Boolean).length ===
                      0 ? (
                        <div className="no-images">
                          <ImageIcon size={19} />
                          No images available
                        </div>
                      ) : (
                        (
                          Array.isArray(
                            selected.jewellery_images
                          )
                            ? selected.jewellery_images
                            : []
                        )
                          .filter(Boolean)
                          .map(
                            (image, index) => (
                              <div
                                className="image-thumb"
                                key={index}
                              >
                                {String(
                                  image
                                ).startsWith(
                                  "http"
                                ) ? (
                                  <img
                                    src={image}
                                    alt={`Repair ${
                                      index + 1
                                    }`}
                                  />
                                ) : (
                                  <div className="local-image">
                                    <ImageIcon
                                      size={20}
                                    />
                                    <span>
                                      Local image
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )
                      )}
                    </div>
                  </DetailSection>

                  <DetailSection title="API Record">
                    <DetailRow
                      label="Created"
                      value={formatDateTime(
                        selected.created_at
                      )}
                    />

                    <DetailRow
                      label="Updated"
                      value={formatDateTime(
                        selected.updated_at
                      )}
                    />
                  </DetailSection>

                  <button
                    className="close-details"
                    onClick={() =>
                      setSelectedBooking(null)
                    }
                  >
                    Clear Selection
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE DETAILS */}
      {mobileDetails && selected.id && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setMobileDetails(false)
          }
        >
          <div
            className="mobile-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mobile-modal-header">
              <strong>
                Booking #{selected.id}
              </strong>

              <button
                onClick={() =>
                  setMobileDetails(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-modal-body">
              <h2>
                {selected.service_name ||
                  "Gold Repair"}
              </h2>

              <p>
                {selected.full_name ||
                  "Unknown Customer"}
              </p>

              <DetailRow
                label="Date"
                value={formatDate(
                  selected.booking_date
                )}
              />

              <DetailRow
                label="Time"
                value={formatTimeRange(
                  selected
                )}
              />

              <DetailRow
                label="Phone"
                value={selected.phone}
              />

              <DetailRow
                label="Jewellery"
                value={selected.jewellery_type}
              />

              <DetailRow
                label="Issue"
                value={selected.issue_description}
              />

              <DetailRow
                label="Total"
                value={money(
                  selected.total_amount
                )}
                highlight
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  small,
}) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span>{title}</span>

        <strong className={small ? "small-value" : ""}>
          {value}
        </strong>

        <small>{subtitle}</small>
      </div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div className="detail-section">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="detail-row">
      <div className="detail-label">
        {icon && <span>{icon}</span>}
        <label>{label}</label>
      </div>

      <strong className={highlight ? "highlight" : ""}>
        {displayValue(value)}
      </strong>
    </div>
  );
}

const styles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f8fa;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input,
select {
  font-family: inherit;
}

.gold-repair-app {
  min-height: 100vh;
  display: flex;
  color: #10283a;
  background: #f4f8fa;
}

/* SIDEBAR */

.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 25px 12px 18px;
  display: flex;
  flex-direction: column;
  color: white;
  background:
    radial-gradient(
      circle at 20% 80%,
      rgba(37, 190, 180, 0.16),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #005052 0%,
      #003e41 55%,
      #003034 100%
    );
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 16px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border: 2px solid #f4c54d;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #f4c54d;
  font-size: 22px;
}

.brand-name {
  color: #f6c64c;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.brand-sub {
  margin-top: 4px;
  font-size: 9px;
  letter-spacing: 3px;
}

.sidebar-line {
  height: 1px;
  margin: 22px 12px 16px;
  background: rgba(255,255,255,0.14);
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  min-height: 47px;
  border: 0;
  border-radius: 10px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: rgba(255,255,255,0.9);
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
}

.nav-item:hover {
  background: rgba(255,255,255,0.08);
}

.nav-item.active {
  color: #19323a;
  font-weight: 800;
  background: linear-gradient(
    90deg,
    #ffd75e,
    #efba36
  );
}

.nav-item span {
  width: 23px;
  text-align: center;
  font-size: 18px;
}

.nav-item b {
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #efbd3e;
  color: #17343a;
  font-size: 10px;
}

.sidebar-bottom {
  margin-top: auto;
  padding: 14px 9px 0;
}

.support-box {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
}

.support-icon {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: rgba(255,255,255,0.1);
}

.support-box strong,
.support-box span {
  display: block;
}

.support-box strong {
  font-size: 11px;
}

.support-box span {
  margin-top: 3px;
  font-size: 9px;
  opacity: 0.7;
}

.logout {
  width: 100%;
  height: 41px;
  margin-top: 10px;
  border: 0;
  border-radius: 9px;
  background: rgba(255,255,255,0.08);
  color: white;
  cursor: pointer;
}

/* MAIN */

.main-content {
  flex: 1;
  min-width: 0;
  padding: 0 16px 25px;
}

.header {
  height: 80px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #e2eaed;
}

.search-box {
  width: min(710px, 100%);
  height: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  border: 1px solid #dce6e9;
  border-radius: 12px;
  background: white;
  color: #617486;
  box-shadow: 0 4px 15px rgba(22,55,73,0.04);
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 12px;
  color: #22394b;
}

.search-box button {
  border: 0;
  background: transparent;
  color: #778995;
  cursor: pointer;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 17px;
}

.notification-button {
  position: relative;
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border: 1px solid #e0e8eb;
  border-radius: 50%;
  background: white;
  color: #203a4b;
  cursor: pointer;
}

.notification-button span {
  position: absolute;
  right: -1px;
  top: -2px;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e7353d;
  color: white;
  font-size: 9px;
  font-weight: 800;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.admin-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #d9f1ef;
  color: #007071;
  font-weight: 900;
}

.admin-user strong,
.admin-user small {
  display: block;
}

.admin-user strong {
  font-size: 13px;
}

.admin-user small {
  margin-top: 2px;
  color: #788895;
  font-size: 9px;
}

/* STATISTICS */

.statistics {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 15px 0 13px;
}

.stat-card {
  min-height: 108px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px 14px;
  position: relative;
  overflow: hidden;
  border: 1px solid #e1e9ec;
  border-radius: 13px;
  background: white;
  box-shadow: 0 5px 18px rgba(25,60,78,0.04);
}

.stat-icon {
  width: 45px;
  height: 45px;
  min-width: 45px;
  display: grid;
  place-items: center;
  border-radius: 11px;
}

.stat-card.blue .stat-icon {
  color: #08757a;
  background: #d8f2f4;
}

.stat-card.gold .stat-icon {
  color: #a66e00;
  background: #fff0c7;
}

.stat-card.purple .stat-icon {
  color: #3859b3;
  background: #e4e9ff;
}

.stat-card.green .stat-icon {
  color: #16824f;
  background: #d8f3e3;
}

.stat-card.red .stat-icon {
  color: #cf3b43;
  background: #ffe0e2;
}

.stat-content span,
.stat-content small {
  display: block;
}

.stat-content span {
  color: #526778;
  font-size: 10px;
  font-weight: 800;
}

.stat-content strong {
  display: block;
  margin-top: 5px;
  font-size: 25px;
  line-height: 1;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.stat-content strong.small-value {
  font-size: 18px;
  margin-top: 8px;
}

.stat-content small {
  margin-top: 8px;
  color: #7c8c98;
  font-size: 9px;
}

/* ERROR */

.error-box {
  margin-bottom: 12px;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border: 1px solid #efc1c3;
  border-radius: 10px;
  background: #fff5f5;
  color: #8c292f;
}

.error-box strong,
.error-box span {
  display: block;
}

.error-box strong {
  font-size: 12px;
}

.error-box span {
  margin-top: 3px;
  font-size: 10px;
}

.error-box button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 0;
  border-radius: 7px;
  background: #973139;
  color: white;
  cursor: pointer;
}

/* GRID */

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 365px;
  gap: 13px;
  align-items: start;
}

.left-content,
.right-content {
  min-width: 0;
}

.left-content,
.right-content {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.card {
  overflow: hidden;
  border: 1px solid #e0e8eb;
  border-radius: 13px;
  background: white;
  box-shadow: 0 5px 18px rgba(25,60,78,0.04);
}

.card-header {
  min-height: 70px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid #edf1f3;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-area > svg {
  color: #006e70;
}

.title-area h2 {
  margin: 0;
  font-size: 17px;
}

.title-area p {
  margin: 4px 0 0;
  color: #7c8c98;
  font-size: 9px;
}

.title-area p strong {
  color: #007274;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.date-button,
.primary-button,
.reset-button,
.refresh-button {
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 800;
}

.date-button,
.reset-button,
.refresh-button {
  border: 1px solid #dce6e9;
  background: white;
  color: #405667;
}

.primary-button {
  border: 1px solid #006d6f;
  background: linear-gradient(
    135deg,
    #008d8e,
    #006a6b
  );
  color: white;
}

/* TABS */

.tabs {
  display: flex;
  gap: 7px;
  padding: 10px 16px 4px;
  overflow-x: auto;
}

.tabs button {
  height: 34px;
  padding: 0 13px;
  border: 1px solid #e0e8eb;
  border-radius: 18px;
  background: #f7f9fa;
  color: #586c7b;
  cursor: pointer;
  white-space: nowrap;
  font-size: 9px;
  font-weight: 800;
}

.tabs button.active {
  border-color: #006e70;
  background: #006e70;
  color: white;
}

/* FILTERS */

.filters {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
}

.filter {
  height: 37px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 9px;
  border: 1px solid #dce6e9;
  border-radius: 8px;
  color: #71818e;
  background: white;
}

.filter input,
.filter select {
  min-width: 125px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #354b5b;
  font-size: 10px;
}

.refresh-button {
  margin-left: auto;
  color: #006f70;
}

.refresh-button:disabled {
  opacity: 0.6;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* TABLE */

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 1050px;
  border-collapse: collapse;
}

thead th {
  height: 43px;
  padding: 0 9px;
  background: #f4f7f9;
  border-bottom: 1px solid #e5ecef;
  color: #536879;
  text-align: left;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;
}

tbody td {
  height: 66px;
  padding: 8px 9px;
  border-bottom: 1px solid #edf1f3;
  color: #334a5b;
  font-size: 9px;
  vertical-align: middle;
}

tbody tr:hover,
tbody tr.selected-row {
  background: #f7fcfc;
}

.booking-id {
  color: #81909b !important;
  font-weight: 800;
}

.time {
  white-space: nowrap;
  font-weight: 800;
}

.customer,
.service {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-avatar {
  width: 31px;
  height: 31px;
  min-width: 31px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #def0ee;
  color: #006f70;
  font-weight: 900;
}

.customer strong,
.customer small,
.service strong,
.service small {
  display: block;
}

.customer strong,
.service strong {
  max-width: 145px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 9px;
}

.customer small,
.service small {
  margin-top: 3px;
  color: #82909b;
  font-size: 8px;
}

.service-image {
  width: 42px;
  height: 42px;
  min-width: 42px;
  overflow: hidden;
  border-radius: 8px;
  background: #f0ebe3;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-type {
  padding: 5px 7px;
  border-radius: 5px;
  background: #edf6f6;
  color: #007273;
  font-size: 8px;
  font-weight: 900;
}

.amount {
  color: #174153 !important;
  font-weight: 900;
  white-space: nowrap;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 65px;
  padding: 6px 8px;
  border-radius: 7px;
  font-size: 8px;
  font-weight: 900;
  white-space: nowrap;
}

.status-today {
  background: #dff0ff;
  color: #1b5d99;
}

.status-upcoming {
  background: #dff4e8;
  color: #177c4c;
}

.status-past {
  background: #edf0f2;
  color: #687884;
}

.status-incomplete {
  background: #ffe1e3;
  color: #ba3b43;
}

.actions {
  display: flex;
  gap: 5px;
}

.actions button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid #dfe7ea;
  border-radius: 7px;
  background: white;
  color: #526775;
  cursor: pointer;
}

.actions button:hover {
  border-color: #73baba;
  color: #006f70;
}

.loading-cell {
  height: 170px !important;
  text-align: center;
  color: #718391 !important;
}

.loading-cell svg {
  margin-right: 8px;
  vertical-align: middle;
}

/* TABLE FOOTER */

.table-footer {
  min-height: 50px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #7a8a96;
  font-size: 9px;
}

.table-footer button {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 31px;
  padding: 0 10px;
  border: 1px solid #c9e2e2;
  border-radius: 7px;
  background: #f3fbfb;
  color: #007071;
  cursor: pointer;
  font-size: 9px;
  font-weight: 800;
}

/* RAW API */

.raw-table-container {
  overflow: auto;
}

.raw-table {
  min-width: 3300px;
  width: max-content;
}

.raw-table th,
.raw-table td {
  max-width: 260px;
  padding: 9px;
  border-right: 1px solid #edf1f3;
  border-bottom: 1px solid #e5ecef;
  text-align: left;
  vertical-align: top;
  font-size: 8px;
}

.raw-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #edf7f7;
  color: #006e70;
}

.raw-table td {
  color: #435665;
  overflow-wrap: anywhere;
}

/* TODAY */

.timeline {
  padding: 7px 15px 12px;
}

.timeline-item {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-bottom: 1px solid #edf1f3;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.timeline-item:last-child {
  border-bottom: 0;
}

.timeline-time {
  width: 65px;
  min-width: 65px;
  color: #006f70;
  font-size: 9px;
  font-weight: 900;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e5b43b;
  box-shadow: 0 0 0 4px #fff7df;
}

.timeline-info {
  flex: 1;
  min-width: 0;
}

.timeline-info strong,
.timeline-info small {
  display: block;
}

.timeline-info strong {
  font-size: 9px;
}

.timeline-info small {
  margin-top: 3px;
  color: #7a8b97;
  font-size: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.timeline-price {
  color: #1b5360;
  font-size: 9px;
  font-weight: 900;
  white-space: nowrap;
}

.empty {
  min-height: 110px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 5px;
  padding: 20px;
  color: #84939e;
  font-size: 10px;
  text-align: center;
}

/* CALENDAR */

.calendar-card,
.details-card {
  padding: 16px;
}

.side-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.side-header h3 {
  margin: 0;
  font-size: 16px;
}

.side-header span {
  display: block;
  margin-top: 3px;
  color: #7a8996;
  font-size: 8px;
}

.calendar-actions {
  display: flex;
  gap: 4px;
}

.calendar-actions button {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border: 1px solid #dce6e9;
  border-radius: 7px;
  background: white;
  color: #435768;
  cursor: pointer;
}

.weekdays,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.weekdays {
  margin-top: 20px;
  margin-bottom: 6px;
}

.weekdays span {
  text-align: center;
  color: #718290;
  font-size: 8px;
  font-weight: 800;
}

.calendar-grid button {
  position: relative;
  height: 37px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #334c5e;
  cursor: pointer;
  font-size: 9px;
}

.calendar-grid button.calendar-muted {
  color: #c5ccd1;
  cursor: default;
}

.calendar-grid button.calendar-today {
  background: #006f70;
  color: white;
  font-weight: 900;
}

.calendar-grid button.calendar-selected {
  box-shadow: inset 0 0 0 2px #e2b43a;
}

.calendar-grid button i {
  position: absolute;
  left: 50%;
  bottom: 3px;
  width: 4px;
  height: 4px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #159967;
}

.calendar-grid button.calendar-today i {
  background: #f7d25b;
}

.calendar-legend {
  display: flex;
  gap: 15px;
  margin-top: 9px;
  padding-top: 9px;
  border-top: 1px solid #edf1f3;
  color: #748492;
  font-size: 8px;
}

.calendar-legend span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.calendar-legend i {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
}

.today-dot {
  background: #006f70;
}

.booking-dot {
  background: #159967;
}

/* DETAILS */

.detail-hero {
  display: flex;
  gap: 11px;
  margin-top: 17px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf1f3;
}

.detail-image {
  width: 75px;
  height: 75px;
  min-width: 75px;
  overflow: hidden;
  border-radius: 9px;
  background: #f0ebe3;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-id {
  display: inline-block;
  padding: 4px 6px;
  border-radius: 5px;
  background: #edf6f6;
  color: #006f70;
  font-size: 7px;
  font-weight: 900;
}

.detail-hero h3 {
  margin: 7px 0 3px;
  font-size: 14px;
}

.detail-hero p {
  margin: 0;
  color: #72828e;
  font-size: 9px;
}

.detail-section {
  padding: 12px 0;
  border-bottom: 1px solid #edf1f3;
}

.detail-section h4 {
  margin: 0 0 7px;
  color: #263f50;
  font-size: 10px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 5px 0;
}

.detail-label {
  min-width: 105px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  color: #788894;
  font-size: 8px;
}

.detail-label span {
  display: flex;
  color: #587080;
}

.detail-row > strong {
  flex: 1;
  color: #334a5a;
  text-align: right;
  font-size: 8px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.detail-row > strong.highlight {
  color: #007274;
  font-size: 12px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.image-thumb {
  height: 67px;
  overflow: hidden;
  border-radius: 8px;
  background: #f1f4f5;
}

.image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.local-image,
.no-images {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 3px;
  color: #82929d;
  font-size: 7px;
  text-align: center;
}

.no-images {
  grid-column: 1 / -1;
  height: 65px;
  border: 1px dashed #d7e0e4;
  border-radius: 8px;
}

.close-details {
  width: 100%;
  height: 39px;
  margin-top: 14px;
  border: 1px solid #006f70;
  border-radius: 8px;
  background: #006f70;
  color: white;
  cursor: pointer;
  font-size: 9px;
  font-weight: 900;
}

/* MOBILE */

.mobile-overlay {
  display: none;
}

@media (max-width: 1280px) {
  .statistics {
    grid-template-columns: repeat(3, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: minmax(0, 1fr) 330px;
  }
}

@media (max-width: 1050px) {
  .sidebar {
    width: 78px;
    min-width: 78px;
  }

  .brand {
    justify-content: center;
    padding: 0;
  }

  .brand > div:last-child {
    display: none;
  }

  .sidebar-line {
    margin-left: 8px;
    margin-right: 8px;
  }

  .nav-item {
    justify-content: center;
    padding: 0;
    font-size: 0;
  }

  .nav-item span {
    font-size: 18px;
  }

  .nav-item b {
    display: none;
  }

  .support-box div:last-child,
  .logout {
    font-size: 0;
  }

  .support-box {
    justify-content: center;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .right-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .gold-repair-app {
    display: block;
  }

  .sidebar {
    display: none;
  }

  .main-content {
    padding: 0 10px 20px;
  }

  .header {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 0;
  }

  .search-box {
    order: 2;
    width: 100%;
  }

  .header-right {
    margin-left: auto;
  }

  .admin-user > div:not(.admin-avatar) {
    display: none;
  }

  .statistics {
    grid-template-columns: repeat(2, 1fr);
  }

  .right-content {
    display: none;
  }

  .filters {
    flex-wrap: wrap;
  }

  .filter {
    flex: 1 1 150px;
  }

  .refresh-button {
    margin-left: 0;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    background: rgba(0,0,0,0.45);
  }

  .mobile-modal {
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 18px 18px 0 0;
    background: white;
  }

  .mobile-modal-header {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e7edef;
  }

  .mobile-modal-header button {
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .mobile-modal-body {
    padding: 17px;
  }

  .mobile-modal-body h2 {
    margin: 0 0 5px;
    font-size: 17px;
  }

  .mobile-modal-body > p {
    margin: 0 0 15px;
    color: #748591;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .statistics {
    grid-template-columns: 1fr;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-buttons {
    width: 100%;
    justify-content: flex-end;
  }

  .table-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;

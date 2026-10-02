import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://goldbackend-production-0ed4.up.railway.app/goldrepair/all";

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";

  const parts = time.split(":");

  if (parts.length < 2) return time;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  const suffix = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${suffix}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const currency = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getStatus = (booking) => {
  if (booking.status) {
    return String(booking.status).toUpperCase();
  }

  if (!booking.booking_date) {
    return "PENDING";
  }

  const bookingDate = new Date(booking.booking_date);
  const today = new Date();

  bookingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (bookingDate < today) {
    return "COMPLETED";
  }

  if (bookingDate.getTime() === today.getTime()) {
    return "IN_PROGRESS";
  }

  return "PENDING";
};

const getStatusLabel = (status) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "CONFIRMED":
      return "Confirmed";

    default:
      return "Pending";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "status-completed";

    case "IN_PROGRESS":
      return "status-progress";

    case "CANCELLED":
      return "status-cancelled";

    case "CONFIRMED":
      return "status-confirmed";

    default:
      return "status-pending";
  }
};

const cleanPhone = (phone) => {
  if (!phone) return "";

  return String(phone).replace(/\D/g, "");
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GoldRepair() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [activeTab, setActiveTab] = useState("SCHEDULE");

  const [activeDetailTab, setActiveDetailTab] = useState("Details");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedDate, setSelectedDate] = useState("ALL");

  const [selectedService, setSelectedService] = useState("ALL");

  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [viewMode, setViewMode] = useState("DAY");

  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [statusMap, setStatusMap] = useState({});


  /* =========================================================
     FETCH BOOKINGS
  ========================================================= */

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText}`
        );
      }

      const resData = await response.json();

      if (
        resData &&
        resData.success &&
        Array.isArray(resData.data)
      ) {
        const validData = resData.data.filter(
          (item) =>
            item &&
            item.id &&
            item.full_name &&
            item.booking_date
        );

        setBookings(validData);

        if (validData.length > 0) {
          setSelectedBooking(validData[0]);
        }
      } else {
        setBookings([]);
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Gold repair API error:", err);

      setError(
        "Unable to load Gold Repair bookings. Please check your API or internet connection."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = async () => {
    setRefreshing(true);

    await fetchBookings();

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };


  /* =========================================================
     SERVICES
  ========================================================= */

  const services = useMemo(() => {
    const unique = bookings
      .map((item) => item.service_name)
      .filter(Boolean);

    return [...new Set(unique)];
  }, [bookings]);


  /* =========================================================
     STATUS
  ========================================================= */

  const getBookingStatus = (booking) => {
    return statusMap[booking.id] || getStatus(booking);
  };


  /* =========================================================
     COUNTS
  ========================================================= */

  const totalBookings = bookings.length;

  const completedCount = bookings.filter(
    (item) => getBookingStatus(item) === "COMPLETED"
  ).length;

  const inProgressCount = bookings.filter(
    (item) => getBookingStatus(item) === "IN_PROGRESS"
  ).length;

  const pendingCount = bookings.filter(
    (item) =>
      getBookingStatus(item) === "PENDING" ||
      getBookingStatus(item) === "CONFIRMED"
  ).length;

  const cancelledCount = bookings.filter(
    (item) => getBookingStatus(item) === "CANCELLED"
  ).length;

  const totalRevenue = bookings.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );


  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bookings.filter((item) => {
      const status = getBookingStatus(item);

      const searchMatch =
        !query ||
        String(item.id || "")
          .toLowerCase()
          .includes(query) ||
        String(item.service_id || "")
          .toLowerCase()
          .includes(query) ||
        String(item.full_name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.phone || "")
          .toLowerCase()
          .includes(query) ||
        String(item.service_name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.jewellery_type || "")
          .toLowerCase()
          .includes(query) ||
        String(item.city || "")
          .toLowerCase()
          .includes(query);

      const statusMatch =
        selectedStatus === "ALL" ||
        status === selectedStatus;

      const serviceMatch =
        selectedService === "ALL" ||
        item.service_name === selectedService;

      const dateMatch =
        selectedDate === "ALL" ||
        item.booking_date?.slice(0, 10) === selectedDate;

      let tabMatch = true;

      if (activeTab === "PENDING") {
        tabMatch =
          status === "PENDING" ||
          status === "CONFIRMED";
      }

      if (activeTab === "IN_PROGRESS") {
        tabMatch = status === "IN_PROGRESS";
      }

      if (activeTab === "COMPLETED") {
        tabMatch = status === "COMPLETED";
      }

      if (activeTab === "CANCELLED") {
        tabMatch = status === "CANCELLED";
      }

      return (
        searchMatch &&
        statusMatch &&
        serviceMatch &&
        dateMatch &&
        tabMatch
      );
    });
  }, [
    bookings,
    searchQuery,
    selectedStatus,
    selectedService,
    selectedDate,
    activeTab,
    statusMap,
  ]);


  /* =========================================================
     STATUS UPDATE
  ========================================================= */

  const updateStatus = (booking, newStatus) => {
    setStatusMap((previous) => ({
      ...previous,
      [booking.id]: newStatus,
    }));

    setSelectedBooking({
      ...booking,
      status: newStatus,
    });
  };


  /* =========================================================
     TODAY
  ========================================================= */

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")`;


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <div className="gold-loading">
          <div className="loading-orbit">
            <div className="loading-gold-ring"></div>
            <div className="loading-icon">G</div>
          </div>

          <h2>Loading Gold Repair</h2>

          <p>
            Fetching booking schedules...
          </p>

          <div className="loading-line">
            <span></span>
          </div>
        </div>

        <GoldRepairStyles />
      </>
    );
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <>
        <div className="gold-error-page">
          <div className="error-card">
            <div className="error-icon">
              !
            </div>

            <h2>Unable to Load Bookings</h2>

            <p>{error}</p>

            <button
              className="primary-button"
              onClick={fetchBookings}
            >
              ↻ Retry
            </button>
          </div>
        </div>

        <GoldRepairStyles />
      </>
    );
  }


  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <>
      <div className="gold-repair-page">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="repair-header">

          <div className="header-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search Booking ID, Customer, Mobile, Service..."
            />

            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}

          </div>


          <div className="header-actions">

            <button
              className="header-date"
              title="Current date"
            >
              <span>▣</span>

              {today.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </button>


            <button
              className="notification-button"
              title="Notifications"
            >
              ♧

              <span className="notification-count">
                {pendingCount}
              </span>
            </button>


            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>

                <span>
                  Administrator
                </span>
              </div>

              <span className="profile-arrow">
                ▾
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="page-heading">

          <div>
            <div className="heading-breadcrumb">
              G-BUYER
              <span>›</span>
              Gold Repair
            </div>

            <h1>
              Repair Booking Schedule
            </h1>

            <p>
              Manage doorstep jewellery repair bookings,
              schedules and customer requests.
            </p>
          </div>


          <button
            className="refresh-button"
            onClick={handleRefresh}
          >
            <span
              className={
                refreshing
                  ? "refresh-icon spinning"
                  : "refresh-icon"
              }
            >
              ↻
            </span>

            Refresh
          </button>

        </div>


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="kpi-grid">

          <KpiCard
            title="Total Bookings"
            value={totalBookings}
            subtitle="All repair bookings"
            icon="▦"
            type="blue"
          />

          <KpiCard
            title="Today's Bookings"
            value={
              bookings.filter(
                (item) =>
                  item.booking_date?.slice(0, 10) ===
                  todayString
              ).length
            }
            subtitle="Scheduled today"
            icon="◷"
            type="gold"
          />

          <KpiCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Currently active"
            icon="◉"
            type="purple"
            live
          />

          <KpiCard
            title="Completed"
            value={completedCount}
            subtitle="Repair completed"
            icon="✓"
            type="green"
          />

          <KpiCard
            title="Revenue"
            value={currency(totalRevenue)}
            subtitle="Total booking value"
            icon="₹"
            type="orange"
          />

        </section>


        {/* =================================================
            MAIN WORKSPACE
        ================================================= */}

        <main className="workspace">

          {/* =================================================
              LEFT AREA
          ================================================= */}

          <section className="main-panel">

            {/* Tabs */}

            <div className="schedule-toolbar">

              <div className="schedule-tabs">

                <button
                  className={
                    activeTab === "SCHEDULE"
                      ? "schedule-tab active"
                      : "schedule-tab"
                  }
                  onClick={() =>
                    setActiveTab("SCHEDULE")
                  }
                >
                  ▦ Schedule
                </button>

                <button
                  className={
                    activeTab === "LIST"
                      ? "schedule-tab active"
                      : "schedule-tab"
                  }
                  onClick={() =>
                    setActiveTab("LIST")
                  }
                >
                  ☷ List
                </button>

                <button
                  className={
                    activeTab === "PENDING"
                      ? "schedule-tab active"
                      : "schedule-tab"
                  }
                  onClick={() =>
                    setActiveTab("PENDING")
                  }
                >
                  Pending
                  <span className="tab-count pending-count">
                    {pendingCount}
                  </span>
                </button>

                <button
                  className={
                    activeTab === "IN_PROGRESS"
                      ? "schedule-tab active"
                      : "schedule-tab"
                  }
                  onClick={() =>
                    setActiveTab("IN_PROGRESS")
                  }
                >
                  In Progress
                  <span className="tab-count progress-count">
                    {inProgressCount}
                  </span>
                </button>

                <button
                  className={
                    activeTab === "COMPLETED"
                      ? "schedule-tab active"
                      : "schedule-tab"
                  }
                  onClick={() =>
                    setActiveTab("COMPLETED")
                  }
                >
                  Completed
                  <span className="tab-count completed-count">
                    {completedCount}
                  </span>
                </button>

                <button
                  className={
                    activeTab === "CANCELLED"
                      ? "schedule-tab active"
                      : "schedule-tab"
                  }
                  onClick={() =>
                    setActiveTab("CANCELLED")
                  }
                >
                  Cancelled
                  <span className="tab-count cancelled-count">
                    {cancelledCount}
                  </span>
                </button>

              </div>


              <button
                className="new-booking-button"
                onClick={() =>
                  alert("New Booking feature")
                }
              >
                <span>＋</span>
                New Booking
              </button>

            </div>


            {/* Filters */}

            <div className="filter-card">

              <div className="filter-group">

                <div className="filter-box">
                  <span>▣</span>

                  <select
                    value={selectedDate}
                    onChange={(e) =>
                      setSelectedDate(e.target.value)
                    }
                  >
                    <option value="ALL">
                      All Dates
                    </option>

                    {[...new Set(
                      bookings
                        .filter(
                          (item) =>
                            item.booking_date
                        )
                        .map((item) =>
                          item.booking_date.slice(
                            0,
                            10
                          )
                        )
                    )].map((date) => (
                      <option
                        key={date}
                        value={date}
                      >
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="filter-box">

                  <span>◆</span>

                  <select
                    value={selectedService}
                    onChange={(e) =>
                      setSelectedService(
                        e.target.value
                      )
                    }
                  >
                    <option value="ALL">
                      All Services
                    </option>

                    {services.map((service) => (
                      <option
                        key={service}
                        value={service}
                      >
                        {service}
                      </option>
                    ))}
                  </select>

                </div>


                <div className="filter-box">

                  <span>●</span>

                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value
                      )
                    }
                  >
                    <option value="ALL">
                      All Status
                    </option>

                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="CONFIRMED">
                      Confirmed
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>

                </div>

              </div>


              <div className="result-count">

                <strong>
                  {filteredBookings.length}
                </strong>

                bookings found

              </div>

            </div>


            {/* Schedule Card */}

            <div className="schedule-card">

              <div className="schedule-card-header">

                <div>

                  <div className="section-title">
                    <span className="section-title-icon">
                      ▦
                    </span>

                    Today's Repair Schedule
                  </div>

                  <span className="section-subtitle">
                    {formatDate(new Date())}
                  </span>

                </div>


                <div className="view-switcher">

                  {["DAY", "WEEK", "MONTH"].map(
                    (mode) => (
                      <button
                        key={mode}
                        className={
                          viewMode === mode
                            ? "view-button active"
                            : "view-button"
                        }
                        onClick={() =>
                          setViewMode(mode)
                        }
                      >
                        {mode}
                      </button>
                    )
                  )}

                </div>

              </div>


              {/* Table */}

              <div className="table-container">

                <table className="booking-table">

                  <thead>

                    <tr>

                      <th>#</th>

                      <th>Time</th>

                      <th>Customer</th>

                      <th>Service</th>

                      <th>Jewellery</th>

                      <th>Status</th>

                      <th>Amount</th>

                      <th>Action</th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredBookings.length === 0 ? (

                      <tr>

                        <td
                          colSpan="8"
                          className="empty-cell"
                        >

                          <div className="empty-state">

                            <div className="empty-icon">
                              ◌
                            </div>

                            <h3>
                              No Bookings Found
                            </h3>

                            <p>
                              Try changing your
                              search or filters.
                            </p>

                          </div>

                        </td>

                      </tr>

                    ) : (

                      filteredBookings.map(
                        (item, index) => {

                          const status =
                            getBookingStatus(item);

                          const isSelected =
                            selectedBooking?.id ===
                            item.id;

                          return (
                            <tr
                              key={item.id}
                              className={
                                isSelected
                                  ? "selected-row"
                                  : ""
                              }
                              onClick={() => {
                                setSelectedBooking(
                                  item
                                );

                                setMobileDetailsOpen(
                                  true
                                );
                              }}
                            >

                              <td>
                                <span className="row-number">
                                  {index + 1}
                                </span>
                              </td>


                              <td>

                                <div className="time-cell">

                                  <strong>
                                    {formatTime(
                                      item.start_time
                                    )}
                                  </strong>

                                  <span>
                                    {formatTime(
                                      item.end_time
                                    )}
                                  </span>

                                </div>

                              </td>


                              <td>

                                <div className="customer-cell">

                                  <div className="customer-avatar">
                                    {item.full_name
                                      ?.charAt(0)
                                      ?.toUpperCase() ||
                                      "U"}
                                  </div>

                                  <div>

                                    <strong>
                                      {item.full_name ||
                                        "Unknown"}
                                    </strong>

                                    <span>
                                      {item.phone ||
                                        "N/A"}
                                    </span>

                                  </div>

                                </div>

                              </td>


                              <td>

                                <div className="service-cell">

                                  <strong>
                                    {item.service_name ||
                                      "Gold Repair"}
                                  </strong>

                                  <span>
                                    {item.service_id ||
                                      "Custom"}
                                  </span>

                                </div>

                              </td>


                              <td>

                                <span className="jewellery-badge">
                                  {item.jewellery_type ||
                                    "N/A"}
                                </span>

                              </td>


                              <td>

                                <span
                                  className={`status-badge ${getStatusClass(
                                    status
                                  )}`}
                                >
                                  <span className="status-dot"></span>

                                  {getStatusLabel(
                                    status
                                  )}
                                </span>

                              </td>


                              <td>

                                <strong className="amount">
                                  {currency(
                                    item.total_amount
                                  )}
                                </strong>

                              </td>


                              <td>

                                <button
                                  className="view-button-table"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    setSelectedBooking(
                                      item
                                    );

                                    setMobileDetailsOpen(
                                      true
                                    );
                                  }}
                                >
                                  View
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                UPCOMING BOOKINGS
            ================================================= */}

            <div className="upcoming-card">

              <div className="upcoming-header">

                <div>

                  <h3>
                    Upcoming Repair Bookings
                  </h3>

                  <p>
                    Next scheduled customer visits
                  </p>

                </div>

                <span className="upcoming-total">
                  {bookings.length} Total
                </span>

              </div>


              <div className="upcoming-grid">

                {bookings
                  .filter(
                    (item) =>
                      item.booking_date
                  )
                  .slice(0, 5)
                  .map((item) => {

                    const status =
                      getBookingStatus(item);

                    return (
                      <div
                        key={item.id}
                        className="upcoming-item"
                        onClick={() =>
                          setSelectedBooking(item)
                        }
                      >

                        <div className="upcoming-date">
                          {formatDate(
                            item.booking_date
                          )}
                        </div>

                        <div className="upcoming-service">
                          {item.service_name ||
                            "Gold Repair"}
                        </div>

                        <div className="upcoming-customer">
                          {item.full_name}
                        </div>

                        <div className="upcoming-time">
                          ◷{" "}
                          {formatTime(
                            item.start_time
                          )}
                        </div>

                        <span
                          className={`mini-status ${getStatusClass(
                            status
                          )}`}
                        >
                          {getStatusLabel(status)}
                        </span>

                      </div>
                    );
                  })}

              </div>

            </div>

          </section>


          {/* =================================================
              RIGHT DETAIL PANEL
          ================================================= */}

          <aside
            className={
              mobileDetailsOpen
                ? "detail-panel mobile-visible"
                : "detail-panel"
            }
          >

            <div className="detail-header">

              <div>

                <span>
                  BOOKING DETAILS
                </span>

                <h2>
                  Repair Information
                </h2>

              </div>

              <button
                className="detail-close"
                onClick={() =>
                  setMobileDetailsOpen(false)
                }
              >
                ×
              </button>

            </div>


            {selectedBooking ? (

              <div className="detail-content">

                {/* Hero */}

                <div className="booking-hero">

                  <div className="hero-image">

                    {selectedBooking
                      .jewellery_images?.[0] &&
                    selectedBooking
                      .jewellery_images[0]
                      .startsWith("http") ? (

                      <img
                        src={
                          selectedBooking
                            .jewellery_images[0]
                        }
                        alt="Jewellery"
                      />

                    ) : (

                      <div className="hero-placeholder">
                        ◆
                      </div>

                    )}

                  </div>


                  <div className="hero-info">

                    <span className="booking-code">
                      #GRP-
                      {String(
                        selectedBooking.id
                      ).padStart(5, "0")}
                    </span>

                    <h3>
                      {selectedBooking.service_name ||
                        "Gold Repair"}
                    </h3>

                    <p>
                      {selectedBooking.jewellery_type ||
                        "Jewellery"}
                    </p>

                  </div>

                </div>


                {/* Status */}

                <div className="detail-status-row">

                  <span
                    className={`status-badge large ${getStatusClass(
                      getBookingStatus(
                        selectedBooking
                      )
                    )}`}
                  >
                    <span className="status-dot"></span>

                    {getStatusLabel(
                      getBookingStatus(
                        selectedBooking
                      )
                    )}
                  </span>

                  <span className="created-time">
                    Created{" "}
                    {formatDateTime(
                      selectedBooking.created_at
                    )}
                  </span>

                </div>


                {/* Customer */}

                <div className="detail-section">

                  <div className="detail-section-title">
                    <span>♙</span>
                    Customer
                  </div>


                  <div className="customer-detail-card">

                    <div className="large-avatar">
                      {selectedBooking.full_name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="customer-detail-info">

                      <strong>
                        {selectedBooking.full_name ||
                          "N/A"}
                      </strong>

                      <span>
                        {selectedBooking.phone ||
                          "N/A"}
                      </span>

                    </div>


                    <div className="contact-actions">

                      <a
                        href={`tel:${selectedBooking.phone}`}
                        className="contact-button call"
                        title="Call customer"
                      >
                        ☎
                      </a>

                      <a
                        href={`https://wa.me/${cleanPhone(
                          selectedBooking.phone
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-button whatsapp"
                        title="WhatsApp customer"
                      >
                        ◉
                      </a>

                    </div>

                  </div>

                </div>


                {/* Detail Tabs */}

                <div className="detail-tabs">

                  {["Details", "Images", "History"].map(
                    (tab) => (
                      <button
                        key={tab}
                        className={
                          activeDetailTab === tab
                            ? "detail-tab active"
                            : "detail-tab"
                        }
                        onClick={() =>
                          setActiveDetailTab(tab)
                        }
                      >
                        {tab}
                      </button>
                    )
                  )}

                </div>


                {/* DETAILS TAB */}

                {activeDetailTab === "Details" && (

                  <div className="detail-information">

                    <DetailRow
                      label="Service"
                      value={
                        selectedBooking.service_name ||
                        "N/A"
                      }
                    />

                    <DetailRow
                      label="Service ID"
                      value={
                        selectedBooking.service_id ||
                        "N/A"
                      }
                    />

                    <DetailRow
                      label="Jewellery Type"
                      value={
                        selectedBooking.jewellery_type ||
                        "N/A"
                      }
                    />

                    <DetailRow
                      label="Service Type"
                      value={
                        selectedBooking.service_type ||
                        "N/A"
                      }
                    />

                    <DetailRow
                      label="Customer Type"
                      value={
                        selectedBooking.customer_type ||
                        "N/A"
                      }
                    />

                    <DetailRow
                      label="Date"
                      value={formatDate(
                        selectedBooking.booking_date
                      )}
                    />

                    <DetailRow
                      label="Time"
                      value={`${formatTime(
                        selectedBooking.start_time
                      )} - ${formatTime(
                        selectedBooking.end_time
                      )}`}
                    />

                    <div className="detail-description">

                      <span>
                        Issue Description
                      </span>

                      <p>
                        {selectedBooking.issue_description ||
                          "No issue description provided."}
                      </p>

                    </div>


                    <div className="address-box">

                      <div className="address-title">
                        <span>⌖</span>
                        Doorstep Address
                      </div>

                      <p>
                        {selectedBooking.house_no}
                        {selectedBooking.street
                          ? `, ${selectedBooking.street}`
                          : ""}
                        {selectedBooking.area
                          ? `, ${selectedBooking.area}`
                          : ""}
                        {selectedBooking.landmark
                          ? `, ${selectedBooking.landmark}`
                          : ""}
                        {selectedBooking.city
                          ? `, ${selectedBooking.city}`
                          : ""}
                        {selectedBooking.district
                          ? `, ${selectedBooking.district}`
                          : ""}
                        {selectedBooking.state
                          ? `, ${selectedBooking.state}`
                          : ""}
                        {selectedBooking.pincode
                          ? ` - ${selectedBooking.pincode}`
                          : ""}
                      </p>

                    </div>


                    <div className="instruction-box">

                      <strong>
                        Special Instructions
                      </strong>

                      <p>
                        {selectedBooking.special_instructions ||
                          "No special instructions."}
                      </p>

                    </div>


                    {/* Pricing */}

                    <div className="pricing-card">

                      <div>
                        <span>
                          Service Fee
                        </span>

                        <strong>
                          {currency(
                            selectedBooking.service_fee
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Tax
                        </span>

                        <strong>
                          {currency(
                            selectedBooking.tax_amount
                          )}
                        </strong>
                      </div>


                      <div className="pricing-total">

                        <span>
                          Total Amount
                        </span>

                        <strong>
                          {currency(
                            selectedBooking.total_amount
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* Status Update */}

                    <div className="status-update">

                      <label>
                        Update Booking Status
                      </label>

                      <select
                        value={getBookingStatus(
                          selectedBooking
                        )}
                        onChange={(e) =>
                          updateStatus(
                            selectedBooking,
                            e.target.value
                          )
                        }
                      >

                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="CONFIRMED">
                          Confirmed
                        </option>

                        <option value="IN_PROGRESS">
                          In Progress
                        </option>

                        <option value="COMPLETED">
                          Completed
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>
                )}


                {/* IMAGES TAB */}

                {activeDetailTab === "Images" && (

                  <div className="images-section">

                    <div className="image-count">
                      Jewellery Images
                      <span>
                        {
                          selectedBooking
                            .jewellery_images
                            ?.filter(Boolean)
                            .length || 0
                        }
                      </span>
                    </div>


                    <div className="image-grid">

                      {selectedBooking
                        .jewellery_images
                        ?.filter(Boolean)
                        .map(
                          (image, index) => {

                            if (
                              !image.startsWith(
                                "http"
                              )
                            ) {
                              return (
                                <div
                                  key={index}
                                  className="image-placeholder"
                                >
                                  <span>
                                    ◆
                                  </span>

                                  <small>
                                    Local Image
                                  </small>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={index}
                                className="repair-image"
                              >
                                <img
                                  src={image}
                                  alt={`Jewellery ${
                                    index + 1
                                  }`}
                                />

                                <span>
                                  Image{" "}
                                  {index + 1}
                                </span>
                              </div>
                            );
                          }
                        )}

                    </div>


                    {(!selectedBooking
                      .jewellery_images ||
                      selectedBooking
                        .jewellery_images
                        .filter(Boolean)
                        .length === 0) && (

                      <div className="no-images">
                        <div>
                          ◇
                        </div>

                        <p>
                          No jewellery images
                        </p>

                        <span>
                          Customer has not
                          uploaded images.
                        </span>
                      </div>

                    )}

                  </div>
                )}


                {/* HISTORY TAB */}

                {activeDetailTab === "History" && (

                  <div className="history-section">

                    <HistoryItem
                      icon="✓"
                      title="Booking Created"
                      description="Booking request received"
                      date={
                        selectedBooking.created_at
                      }
                      active
                    />

                    <HistoryItem
                      icon="◷"
                      title="Schedule Confirmed"
                      description={`${formatDate(
                        selectedBooking.booking_date
                      )} • ${formatTime(
                        selectedBooking.start_time
                      )}`}
                    />

                    <HistoryItem
                      icon="◆"
                      title="Repair Service"
                      description={
                        selectedBooking.service_name ||
                        "Gold Repair"
                      }
                    />

                    <HistoryItem
                      icon="₹"
                      title="Payment"
                      description={`Total ${currency(
                        selectedBooking.total_amount
                      )}`}
                    />

                  </div>
                )}


                {/* Footer Actions */}

                <div className="detail-actions">

                  <button
                    className="complete-action"
                    onClick={() =>
                      updateStatus(
                        selectedBooking,
                        "COMPLETED"
                      )
                    }
                  >
                    ✓
                    Mark Completed
                  </button>

                  <button
                    className="reschedule-action"
                    onClick={() =>
                      alert(
                        "Reschedule booking #" +
                          selectedBooking.id
                      )
                    }
                  >
                    ◷
                    Reschedule
                  </button>

                  <button
                    className="cancel-action"
                    onClick={() =>
                      updateStatus(
                        selectedBooking,
                        "CANCELLED"
                      )
                    }
                  >
                    ×
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <div className="no-selected-booking">

                <div className="no-selected-icon">
                  ▦
                </div>

                <h3>
                  Select a Booking
                </h3>

                <p>
                  Select any booking from the
                  schedule to see complete details.
                </p>

              </div>

            )}

          </aside>

        </main>

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <GoldRepairStyles />

    </>
  );
}


/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  type,
  live,
}) {
  return (
    <div className={`kpi-card kpi-${type}`}>

      <div className="kpi-content">

        <span className="kpi-title">
          {title}
        </span>

        <strong className="kpi-value">
          {value}
        </strong>

        <span className="kpi-subtitle">
          {live && (
            <i className="live-dot"></i>
          )}

          {subtitle}
        </span>

      </div>


      <div className="kpi-icon">
        {icon}
      </div>

    </div>
  );
}


/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   HISTORY ITEM
========================================================= */

function HistoryItem({
  icon,
  title,
  description,
  date,
  active,
}) {
  return (
    <div
      className={
        active
          ? "history-item active"
          : "history-item"
      }
    >

      <div className="history-icon">
        {icon}
      </div>

      <div className="history-content">

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

        {date && (
          <small>
            {formatDateTime(date)}
          </small>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   CSS
========================================================= */

function GoldRepairStyles() {
  return (
    <style>{`

      /* =====================================================
         ROOT
      ====================================================== */

      .gold-repair-page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 90% 0%,
            rgba(13, 148, 136, 0.07),
            transparent 28%
          ),
          linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 100%
          );

        color: #10243e;

        font-family:
          Inter,
          "Segoe UI",
          Arial,
          sans-serif;

        padding: 22px;

        animation: pageFade 0.5s ease;
      }


      @keyframes pageFade {
        from {
          opacity: 0;
          transform: translateY(8px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }


      /* =====================================================
         HEADER
      ====================================================== */

      .repair-header {
        min-height: 70px;

        background: rgba(255,255,255,0.92);

        backdrop-filter: blur(16px);

        border:
          1px solid rgba(226,232,240,0.9);

        border-radius: 18px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 20px;

        padding: 12px 18px;

        box-shadow:
          0 8px 30px rgba(15,23,42,0.05);

        position: sticky;

        top: 12px;

        z-index: 50;
      }


      .header-search {
        position: relative;

        flex: 1;

        max-width: 620px;
      }


      .header-search input {
        width: 100%;

        height: 46px;

        border:
          1px solid #e2e8f0;

        border-radius: 13px;

        background: #f8fafc;

        padding:
          0 45px 0 45px;

        outline: none;

        color: #0f172a;

        font-size: 13px;

        transition: 0.25s ease;
      }


      .header-search input:focus {
        background: #ffffff;

        border-color: #008f90;

        box-shadow:
          0 0 0 4px rgba(0,143,144,0.09);
      }


      .search-icon {
        position: absolute;

        left: 16px;

        top: 12px;

        font-size: 23px;

        color: #64748b;

        z-index: 2;
      }


      .clear-search {
        position: absolute;

        right: 12px;

        top: 10px;

        width: 26px;

        height: 26px;

        border: 0;

        border-radius: 50%;

        background: #e2e8f0;

        color: #475569;

        cursor: pointer;

        font-size: 18px;
      }


      .header-actions {
        display: flex;

        align-items: center;

        gap: 14px;
      }


      .header-date {
        height: 42px;

        border:
          1px solid #e2e8f0;

        background: #fff;

        padding: 0 13px;

        border-radius: 11px;

        color: #475569;

        display: flex;

        align-items: center;

        gap: 8px;

        font-size: 12px;

        font-weight: 600;
      }


      .notification-button {
        width: 42px;

        height: 42px;

        border:
          1px solid #e2e8f0;

        border-radius: 12px;

        background: white;

        position: relative;

        cursor: pointer;

        font-size: 20px;

        color: #334155;
      }


      .notification-count {
        position: absolute;

        top: -5px;

        right: -4px;

        width: 18px;

        height: 18px;

        border-radius: 50%;

        background: #ef4444;

        color: #fff;

        font-size: 9px;

        font-weight: 800;

        display: flex;

        align-items: center;

        justify-content: center;

        border: 2px solid white;
      }


      .admin-profile {
        display: flex;

        align-items: center;

        gap: 9px;

        padding-left: 15px;

        border-left:
          1px solid #e2e8f0;
      }


      .admin-avatar {
        width: 40px;

        height: 40px;

        border-radius: 50%;

        background:
          linear-gradient(
            135deg,
            #008f90,
            #006d6b
          );

        color: white;

        display: flex;

        align-items: center;

        justify-content: center;

        font-weight: 800;

        box-shadow:
          0 4px 12px rgba(0,143,144,0.2);
      }


      .admin-profile strong {
        display: block;

        font-size: 12px;

        color: #0f172a;
      }


      .admin-profile span {
        display: block;

        font-size: 10px;

        color: #94a3b8;

        margin-top: 2px;
      }


      .admin-profile .profile-arrow {
        color: #64748b;

        font-size: 15px;

        margin-left: 5px;
      }


      /* =====================================================
         PAGE HEADING
      ====================================================== */

      .page-heading {
        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 20px;

        margin:
          25px 2px 20px;
      }


      .heading-breadcrumb {
        font-size: 11px;

        font-weight: 800;

        color: #008f90;

        letter-spacing: 1px;

        margin-bottom: 7px;
      }


      .heading-breadcrumb span {
        margin:
          0 7px;

        color: #94a3b8;
      }


      .page-heading h1 {
        font-size: 25px;

        line-height: 1.2;

        font-weight: 800;

        color: #0f243b;

        margin-bottom: 6px;
      }


      .page-heading p {
        color: #64748b;

        font-size: 12px;
      }


      .refresh-button {
        height: 42px;

        border: 0;

        background: #ffffff;

        color: #006d6b;

        padding:
          0 16px;

        border-radius: 11px;

        cursor: pointer;

        font-weight: 700;

        font-size: 12px;

        display: flex;

        align-items: center;

        gap: 8px;

        box-shadow:
          0 4px 15px rgba(15,23,42,0.06);

        transition: 0.25s ease;
      }


      .refresh-button:hover {
        transform: translateY(-2px);

        box-shadow:
          0 8px 22px rgba(15,23,42,0.1);
      }


      .refresh-icon {
        font-size: 19px;
      }


      .spinning {
        animation:
          rotateRefresh 0.8s linear infinite;
      }


      @keyframes rotateRefresh {
        to {
          transform: rotate(360deg);
        }
      }


      /* =====================================================
         KPI
      ====================================================== */

      .kpi-grid {
        display: grid;

        grid-template-columns:
          repeat(5, minmax(0, 1fr));

        gap: 14px;

        margin-bottom: 18px;
      }


      .kpi-card {
        min-height: 130px;

        border-radius: 17px;

        background: rgba(255,255,255,0.95);

        border:
          1px solid #e2e8f0;

        padding: 18px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        position: relative;

        overflow: hidden;

        box-shadow:
          0 6px 22px rgba(15,23,42,0.045);

        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;
      }


      .kpi-card::before {
        content: "";

        position: absolute;

        width: 100px;

        height: 100px;

        border-radius: 50%;

        right: -45px;

        top: -45px;

        background: rgba(0,143,144,0.05);
      }


      .kpi-card:hover {
        transform: translateY(-4px);

        box-shadow:
          0 13px 30px rgba(15,23,42,0.09);
      }


      .kpi-title {
        display: block;

        color: #64748b;

        font-size: 11px;

        font-weight: 700;
      }


      .kpi-value {
        display: block;

        color: #10243e;

        font-size: 25px;

        margin:
          7px 0 5px;

        font-weight: 800;
      }


      .kpi-subtitle {
        color: #94a3b8;

        font-size: 10px;
      }


      .kpi-icon {
        width: 48px;

        height: 48px;

        border-radius: 13px;

        display: flex;

        align-items: center;

        justify-content: center;

        font-size: 22px;

        font-weight: 800;

        position: relative;

        z-index: 2;
      }


      .kpi-blue .kpi-icon {
        background: #e0f2fe;

        color: #0284c7;
      }


      .kpi-gold .kpi-icon {
        background: #fef3c7;

        color: #d97706;
      }


      .kpi-purple .kpi-icon {
        background: #ede9fe;

        color: #7c3aed;
      }


      .kpi-green .kpi-icon {
        background: #dcfce7;

        color: #059669;
      }


      .kpi-orange .kpi-icon {
        background: #ffedd5;

        color: #ea580c;
      }


      .live-dot {
        display: inline-block;

        width: 6px;

        height: 6px;

        background: #10b981;

        border-radius: 50%;

        margin-right: 5px;

        box-shadow:
          0 0 0 4px rgba(16,185,129,0.1);

        animation:
          pulseLive 1.5s infinite;
      }


      @keyframes pulseLive {
        50% {
          opacity: 0.4;
        }
      }


      /* =====================================================
         WORKSPACE
      ====================================================== */

      .workspace {
        display: grid;

        grid-template-columns:
          minmax(0, 1fr) 370px;

        gap: 18px;

        align-items: start;
      }


      .main-panel {
        min-width: 0;
      }


      /* =====================================================
         TOOLBAR
      ====================================================== */

      .schedule-toolbar {
        background: #ffffff;

        border:
          1px solid #e2e8f0;

        border-radius: 16px;

        padding: 9px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 10px;

        margin-bottom: 12px;

        box-shadow:
          0 5px 20px rgba(15,23,42,0.04);
      }


      .schedule-tabs {
        display: flex;

        flex-wrap: wrap;

        gap: 4px;
      }


      .schedule-tab {
        border: 0;

        background: transparent;

        color: #64748b;

        padding:
          9px 11px;

        border-radius: 9px;

        cursor: pointer;

        font-size: 11px;

        font-weight: 700;

        transition: 0.2s ease;
      }


      .schedule-tab:hover {
        background: #f1f5f9;

        color: #0f766e;
      }


      .schedule-tab.active {
        color: white;

        background:
          linear-gradient(
            135deg,
            #008f90,
            #006d6b
          );

        box-shadow:
          0 4px 12px rgba(0,143,144,0.2);
      }


      .tab-count {
        display: inline-flex;

        align-items: center;

        justify-content: center;

        min-width: 18px;

        height: 18px;

        border-radius: 50%;

        margin-left: 5px;

        padding: 0 4px;

        font-size: 9px;
      }


      .pending-count {
        background: #fef3c7;

        color: #b45309;
      }


      .progress-count {
        background: #ede9fe;

        color: #6d28d9;
      }


      .completed-count {
        background: #dcfce7;

        color: #047857;
      }


      .cancelled-count {
        background: #fee2e2;

        color: #b91c1c;
      }


      .new-booking-button {
        border: 0;

        background:
          linear-gradient(
            135deg,
            #008f90,
            #006d6b
          );

        color: #ffffff;

        height: 38px;

        padding:
          0 15px;

        border-radius: 10px;

        font-size: 11px;

        font-weight: 800;

        cursor: pointer;

        white-space: nowrap;

        box-shadow:
          0 5px 15px rgba(0,143,144,0.2);

        transition: 0.25s ease;
      }


      .new-booking-button:hover {
        transform: translateY(-2px);

        box-shadow:
          0 9px 22px rgba(0,143,144,0.25);
      }


      /* =====================================================
         FILTERS
      ====================================================== */

      .filter-card {
        min-height: 60px;

        background: #ffffff;

        border:
          1px solid #e2e8f0;

        border-radius: 14px;

        padding:
          9px 12px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 10px;

        margin-bottom: 12px;
      }


      .filter-group {
        display: flex;

        flex-wrap: wrap;

        gap: 8px;
      }


      .filter-box {
        height: 35px;

        background: #f8fafc;

        border:
          1px solid #e2e8f0;

        border-radius: 9px;

        display: flex;

        align-items: center;

        gap: 7px;

        padding: 0 9px;

        color: #64748b;
      }


      .filter-box select {
        border: 0;

        background: transparent;

        outline: none;

        color: #475569;

        font-size: 10px;

        font-weight: 600;

        cursor: pointer;
      }


      .result-count {
        color: #94a3b8;

        font-size: 10px;

        white-space: nowrap;
      }


      .result-count strong {
        color: #008f90;

        font-size: 12px;
      }


      /* =====================================================
         SCHEDULE CARD
      ====================================================== */

      .schedule-card {
        background: #ffffff;

        border:
          1px solid #e2e8f0;

        border-radius: 17px;

        overflow: hidden;

        box-shadow:
          0 6px 25px rgba(15,23,42,0.045);
      }


      .schedule-card-header {
        padding:
          17px 18px;

        display: flex;

        justify-content: space-between;

        align-items: center;

        border-bottom:
          1px solid #eef2f7;
      }


      .section-title {
        display: flex;

        align-items: center;

        gap: 8px;

        font-size: 14px;

        font-weight: 800;

        color: #10243e;
      }


      .section-title-icon {
        width: 30px;

        height: 30px;

        display: flex;

        align-items: center;

        justify-content: center;

        background: #e6fffb;

        color: #008f90;

        border-radius: 8px;

        font-size: 15px;
      }


      .section-subtitle {
        display: block;

        margin-left: 38px;

        margin-top: 3px;

        color: #94a3b8;

        font-size: 10px;
      }


      .view-switcher {
        background: #f1f5f9;

        padding: 3px;

        border-radius: 9px;

        display: flex;
      }


      .view-button {
        border: 0;

        background: transparent;

        color: #64748b;

        font-size: 9px;

        font-weight: 800;

        padding:
          6px 9px;

        border-radius: 7px;

        cursor: pointer;
      }


      .view-button.active {
        background: #ffffff;

        color: #008f90;

        box-shadow:
          0 2px 7px rgba(15,23,42,0.08);
      }


      /* =====================================================
         TABLE
      ====================================================== */

      .table-container {
        overflow-x: auto;
      }


      .booking-table {
        width: 100%;

        border-collapse: collapse;

        min-width: 920px;
      }


      .booking-table th {
        background: #f8fafc;

        color: #94a3b8;

        text-align: left;

        padding:
          11px 12px;

        font-size: 9px;

        text-transform: uppercase;

        letter-spacing: 0.5px;

        font-weight: 800;

        border-bottom:
          1px solid #e2e8f0;
      }


      .booking-table td {
        padding:
          11px 12px;

        border-bottom:
          1px solid #f1f5f9;

        vertical-align: middle;

        font-size: 11px;
      }


      .booking-table tbody tr {
        cursor: pointer;

        transition:
          background 0.2s ease,
          transform 0.2s ease;
      }


      .booking-table tbody tr:hover {
        background: #f8fffe;
      }


      .booking-table tbody tr.selected-row {
        background:
          linear-gradient(
            90deg,
            #effdfb,
            #ffffff
          );

        box-shadow:
          inset 3px 0 #008f90;
      }


      .row-number {
        color: #64748b;

        font-weight: 800;

        background: #f1f5f9;

        border-radius: 7px;

        padding:
          5px 7px;
      }


      .time-cell strong,
      .customer-cell strong,
      .service-cell strong {
        display: block;

        color: #172b45;

        font-size: 11px;

        font-weight: 800;
      }


      .time-cell span,
      .customer-cell span,
      .service-cell span {
        display: block;

        color: #94a3b8;

        font-size: 9px;

        margin-top: 3px;
      }


      .customer-cell {
        display: flex;

        align-items: center;

        gap: 8px;
      }


      .customer-avatar {
        width: 32px;

        height: 32px;

        border-radius: 10px;

        background:
          linear-gradient(
            135deg,
            #ccfbf1,
            #99f6e4
          );

        color: #006d6b;

        display: flex;

        align-items: center;

        justify-content: center;

        font-weight: 800;

        font-size: 12px;
      }


      .jewellery-badge {
        display: inline-block;

        background: #fffbeb;

        color: #a16207;

        border:
          1px solid #fde68a;

        border-radius: 7px;

        padding:
          5px 7px;

        font-size: 9px;

        font-weight: 700;
      }


      .status-badge {
        display: inline-flex;

        align-items: center;

        gap: 5px;

        border-radius: 20px;

        padding:
          5px 8px;

        font-size: 9px;

        font-weight: 800;

        white-space: nowrap;
      }


      .status-badge.large {
        padding:
          7px 11px;

        font-size: 10px;
      }


      .status-dot {
        width: 6px;

        height: 6px;

        border-radius: 50%;

        background: currentColor;
      }


      .status-pending {
        background: #fef3c7;

        color: #b45309;
      }


      .status-progress {
        background: #dbeafe;

        color: #1d4ed8;
      }


      .status-completed {
        background: #dcfce7;

        color: #047857;
      }


      .status-cancelled {
        background: #fee2e2;

        color: #b91c1c;
      }


      .status-confirmed {
        background: #ccfbf1;

        color: #0f766e;
      }


      .amount {
        color: #10243e;

        font-size: 11px;

        white-space: nowrap;
      }


      .view-button-table {
        border: 1px solid #ccfbf1;

        background: #f0fdfa;

        color: #008f90;

        border-radius: 7px;

        padding:
          6px 9px;

        cursor: pointer;

        font-size: 9px;

        font-weight: 800;

        transition: 0.2s ease;
      }


      .view-button-table:hover {
        background: #008f90;

        color: white;
      }


      /* =====================================================
         EMPTY
      ====================================================== */

      .empty-cell {
        height: 280px;
      }


      .empty-state {
        text-align: center;

        color: #94a3b8;
      }


      .empty-icon {
        width: 60px;

        height: 60px;

        border-radius: 50%;

        background: #f1f5f9;

        margin:
          0 auto 12px;

        display: flex;

        align-items: center;

        justify-content: center;

        font-size: 25px;
      }


      .empty-state h3 {
        color: #475569;

        font-size: 14px;

        margin-bottom: 5px;
      }


      .empty-state p {
        font-size: 11px;
      }


      /* =====================================================
         UPCOMING
      ====================================================== */

      .upcoming-card {
        margin-top: 16px;

        background: white;

        border:
          1px solid #e2e8f0;

        border-radius: 17px;

        padding: 17px;

        box-shadow:
          0 6px 25px rgba(15,23,42,0.04);
      }


      .upcoming-header {
        display: flex;

        justify-content: space-between;

        align-items: center;

        margin-bottom: 14px;
      }


      .upcoming-header h3 {
        font-size: 13px;

        color: #10243e;
      }


      .upcoming-header p {
        font-size: 10px;

        color: #94a3b8;

        margin-top: 3px;
      }


      .upcoming-total {
        background: #e6fffb;

        color: #008f90;

        padding:
          6px 9px;

        border-radius: 8px;

        font-size: 9px;

        font-weight: 800;
      }


      .upcoming-grid {
        display: grid;

        grid-template-columns:
          repeat(5, minmax(0, 1fr));

        gap: 9px;
      }


      .upcoming-item {
        background:
          linear-gradient(
            145deg,
            #f8fafc,
            #ffffff
          );

        border:
          1px solid #e2e8f0;

        border-radius: 12px;

        padding: 11px;

        cursor: pointer;

        transition: 0.25s ease;
      }


      .upcoming-item:hover {
        transform: translateY(-3px);

        border-color: #99f6e4;

        box-shadow:
          0 8px 20px rgba(15,23,42,0.08);
      }


      .upcoming-date {
        color: #008f90;

        font-size: 9px;

        font-weight: 800;
      }


      .upcoming-service {
        color: #172b45;

        font-size: 10px;

        font-weight: 800;

        margin-top: 6px;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;
      }


      .upcoming-customer {
        color: #64748b;

        font-size: 9px;

        margin-top: 4px;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;
      }


      .upcoming-time {
        color: #94a3b8;

        font-size: 9px;

        margin-top: 6px;
      }


      .mini-status {
        display: inline-block;

        margin-top: 8px;

        border-radius: 6px;

        padding:
          4px 6px;

        font-size: 8px;

        font-weight: 800;
      }


      /* =====================================================
         DETAIL PANEL
      ====================================================== */

      .detail-panel {
        background: #ffffff;

        border:
          1px solid #e2e8f0;

        border-radius: 17px;

        overflow: hidden;

        position: sticky;

        top: 105px;

        box-shadow:
          0 8px 28px rgba(15,23,42,0.07);

        max-height:
          calc(100vh - 125px);

        overflow-y: auto;
      }


      .detail-panel::-webkit-scrollbar {
        width: 5px;
      }


      .detail-panel::-webkit-scrollbar-thumb {
        background: #cbd5e1;

        border-radius: 10px;
      }


      .detail-header {
        min-height: 70px;

        background:
          linear-gradient(
            135deg,
            #006d6b,
            #008f90
          );

        color: white;

        padding:
          14px 16px;

        display: flex;

        justify-content: space-between;

        align-items: center;
      }


      .detail-header span {
        display: block;

        font-size: 8px;

        letter-spacing: 1.2px;

        opacity: 0.7;

        font-weight: 800;
      }


      .detail-header h2 {
        font-size: 14px;

        margin-top: 3px;
      }


      .detail-close {
        width: 32px;

        height: 32px;

        border: 1px solid rgba(255,255,255,0.25);

        background: rgba(255,255,255,0.1);

        color: white;

        border-radius: 8px;

        cursor: pointer;

        font-size: 18px;
      }


      .detail-content {
        padding: 15px;
      }


      /* =====================================================
         HERO
      ====================================================== */

      .booking-hero {
        display: flex;

        gap: 12px;

        padding-bottom: 13px;

        border-bottom:
          1px solid #eef2f7;
      }


      .hero-image {
        width: 78px;

        height: 78px;

        border-radius: 13px;

        overflow: hidden;

        flex-shrink: 0;

        background:
          linear-gradient(
            135deg,
            #fef3c7,
            #fde68a
          );
      }


      .hero-image img {
        width: 100%;

        height: 100%;

        object-fit: cover;
      }


      .hero-placeholder {
        width: 100%;

        height: 100%;

        display: flex;

        align-items: center;

        justify-content: center;

        color: #a16207;

        font-size: 28px;
      }


      .hero-info {
        min-width: 0;

        padding-top: 3px;
      }


      .booking-code {
        display: inline-block;

        background: #f1f5f9;

        color: #64748b;

        border-radius: 6px;

        padding:
          4px 6px;

        font-size: 8px;

        font-weight: 800;

        margin-bottom: 6px;
      }


      .hero-info h3 {
        color: #10243e;

        font-size: 14px;

        line-height: 1.3;
      }


      .hero-info p {
        color: #94a3b8;

        font-size: 10px;

        margin-top: 4px;
      }


      .detail-status-row {
        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 10px;

        padding:
          12px 0;
      }


      .created-time {
        color: #94a3b8;

        font-size: 8px;

        text-align: right;
      }


      /* =====================================================
         CUSTOMER
      ====================================================== */

      .detail-section {
        margin-top: 3px;
      }


      .detail-section-title {
        display: flex;

        align-items: center;

        gap: 7px;

        font-size: 10px;

        color: #475569;

        font-weight: 800;

        margin-bottom: 8px;
      }


      .customer-detail-card {
        background: #f8fafc;

        border:
          1px solid #e2e8f0;

        border-radius: 11px;

        padding: 10px;

        display: flex;

        align-items: center;

        gap: 9px;
      }


      .large-avatar {
        width: 39px;

        height: 39px;

        border-radius: 11px;

        background:
          linear-gradient(
            135deg,
            #99f6e4,
            #ccfbf1
          );

        color: #006d6b;

        display: flex;

        align-items: center;

        justify-content: center;

        font-weight: 900;

        font-size: 13px;
      }


      .customer-detail-info {
        flex: 1;

        min-width: 0;
      }


      .customer-detail-info strong {
        display: block;

        color: #172b45;

        font-size: 11px;
      }


      .customer-detail-info span {
        display: block;

        color: #94a3b8;

        font-size: 9px;

        margin-top: 3px;
      }


      .contact-actions {
        display: flex;

        gap: 5px;
      }


      .contact-button {
        width: 29px;

        height: 29px;

        border-radius: 8px;

        display: flex;

        align-items: center;

        justify-content: center;

        text-decoration: none;

        font-size: 12px;
      }


      .contact-button.call {
        background: #dbeafe;

        color: #2563eb;
      }


      .contact-button.whatsapp {
        background: #dcfce7;

        color: #16a34a;
      }


      /* =====================================================
         DETAIL TABS
      ====================================================== */

      .detail-tabs {
        display: grid;

        grid-template-columns:
          repeat(3, 1fr);

        border-bottom:
          1px solid #e2e8f0;

        margin-top: 15px;
      }


      .detail-tab {
        border: 0;

        background: transparent;

        padding:
          9px 4px;

        color: #94a3b8;

        font-size: 10px;

        font-weight: 700;

        cursor: pointer;

        border-bottom:
          2px solid transparent;
      }


      .detail-tab.active {
        color: #008f90;

        border-bottom-color:
          #008f90;
      }


      /* =====================================================
         DETAIL INFORMATION
      ====================================================== */

      .detail-information {
        padding-top: 12px;
      }


      .detail-row {
        display: flex;

        justify-content: space-between;

        align-items: flex-start;

        gap: 15px;

        padding:
          7px 0;
      }


      .detail-row > span {
        color: #94a3b8;

        font-size: 9px;
      }


      .detail-row > strong {
        color: #334155;

        font-size: 9px;

        text-align: right;

        max-width: 60%;
      }


      .detail-description {
        background: #f8fafc;

        border-radius: 9px;

        padding: 9px;

        margin-top: 5px;
      }


      .detail-description span {
        display: block;

        color: #64748b;

        font-size: 9px;

        font-weight: 800;

        margin-bottom: 5px;
      }


      .detail-description p {
        color: #475569;

        font-size: 9px;

        line-height: 1.5;
      }


      .address-box {
        margin-top: 10px;

        padding: 10px;

        background: #f0fdfa;

        border:
          1px solid #ccfbf1;

        border-radius: 10px;
      }


      .address-title {
        color: #006d6b;

        font-size: 9px;

        font-weight: 800;

        display: flex;

        gap: 6px;

        align-items: center;

        margin-bottom: 5px;
      }


      .address-box p {
        color: #475569;

        font-size: 9px;

        line-height: 1.5;
      }


      .instruction-box {
        margin-top: 10px;

        padding: 10px;

        border-radius: 10px;

        background: #fffbeb;

        border:
          1px solid #fde68a;
      }


      .instruction-box strong {
        color: #92400e;

        font-size: 9px;
      }


      .instruction-box p {
        color: #78350f;

        font-size: 9px;

        margin-top: 5px;

        line-height: 1.4;
      }


      /* =====================================================
         PRICING
      ====================================================== */

      .pricing-card {
        margin-top: 11px;

        background: #f8fafc;

        border:
          1px solid #e2e8f0;

        border-radius: 11px;

        padding: 10px;
      }


      .pricing-card > div {
        display: flex;

        justify-content: space-between;

        padding: 5px 0;
      }


      .pricing-card span {
        color: #94a3b8;

        font-size: 9px;
      }


      .pricing-card strong {
        color: #334155;

        font-size: 9px;
      }


      .pricing-card .pricing-total {
        border-top:
          1px dashed #cbd5e1;

        margin-top: 5px;

        padding-top: 9px;
      }


      .pricing-total span {
        color: #334155;

        font-weight: 800;
      }


      .pricing-total strong {
        color: #008f90;

        font-size: 14px;
      }


      /* =====================================================
         STATUS UPDATE
      ====================================================== */

      .status-update {
        margin-top: 12px;
      }


      .status-update label {
        display: block;

        color: #64748b;

        font-size: 9px;

        font-weight: 800;

        margin-bottom: 6px;
      }


      .status-update select {
        width: 100%;

        height: 37px;

        border:
          1px solid #dbe4ec;

        border-radius: 9px;

        background: #ffffff;

        padding:
          0 10px;

        color: #334155;

        font-size: 10px;

        font-weight: 700;

        outline: none;

        cursor: pointer;
      }


      .status-update select:focus {
        border-color: #008f90;

        box-shadow:
          0 0 0 3px rgba(0,143,144,0.08);
      }


      /* =====================================================
         IMAGES
      ====================================================== */

      .images-section {
        padding-top: 13px;
      }


      .image-count {
        color: #475569;

        font-size: 10px;

        font-weight: 800;

        display: flex;

        justify-content: space-between;

        margin-bottom: 10px;
      }


      .image-count span {
        background: #e6fffb;

        color: #008f90;

        border-radius: 10px;

        padding:
          3px 7px;

        font-size: 8px;
      }


      .image-grid {
        display: grid;

        grid-template-columns:
          repeat(2, 1fr);

        gap: 8px;
      }


      .repair-image {
        height: 110px;

        border-radius: 10px;

        overflow: hidden;

        position: relative;

        background: #f1f5f9;
      }


      .repair-image img {
        width: 100%;

        height: 100%;

        object-fit: cover;

        transition: 0.3s ease;
      }


      .repair-image:hover img {
        transform: scale(1.06);
      }


      .repair-image span {
        position: absolute;

        left: 6px;

        bottom: 6px;

        background: rgba(15,23,42,0.75);

        color: white;

        border-radius: 5px;

        padding:
          3px 5px;

        font-size: 7px;
      }


      .image-placeholder {
        height: 110px;

        border:
          1px dashed #cbd5e1;

        border-radius: 10px;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        color: #94a3b8;

        gap: 5px;
      }


      .image-placeholder span {
        font-size: 20px;

        color: #d4a017;
      }


      .image-placeholder small {
        font-size: 8px;
      }


      .no-images {
        padding: 30px 10px;

        text-align: center;

        color: #94a3b8;
      }


      .no-images div {
        font-size: 30px;

        color: #cbd5e1;

        margin-bottom: 8px;
      }


      .no-images p {
        color: #64748b;

        font-size: 11px;

        font-weight: 700;
      }


      .no-images span {
        font-size: 9px;
      }


      /* =====================================================
         HISTORY
      ====================================================== */

      .history-section {
        padding:
          15px 5px;
      }


      .history-item {
        position: relative;

        display: flex;

        gap: 10px;

        padding-bottom: 20px;
      }


      .history-item:not(:last-child)::after {
        content: "";

        position: absolute;

        left: 14px;

        top: 31px;

        bottom: 5px;

        width: 1px;

        background: #e2e8f0;
      }


      .history-icon {
        width: 29px;

        height: 29px;

        border-radius: 50%;

        background: #f1f5f9;

        color: #64748b;

        display: flex;

        align-items: center;

        justify-content: center;

        font-size: 10px;

        font-weight: 800;

        flex-shrink: 0;

        position: relative;

        z-index: 2;
      }


      .history-item.active .history-icon {
        background: #ccfbf1;

        color: #008f90;
      }


      .history-content strong {
        display: block;

        color: #334155;

        font-size: 10px;
      }


      .history-content span {
        display: block;

        color: #94a3b8;

        font-size: 9px;

        margin-top: 3px;
      }


      .history-content small {
        display: block;

        color: #cbd5e1;

        font-size: 8px;

        margin-top: 4px;
      }


      /* =====================================================
         ACTIONS
      ====================================================== */

      .detail-actions {
        display: grid;

        grid-template-columns:
          1.2fr 1fr 0.8fr;

        gap: 6px;

        border-top:
          1px solid #eef2f7;

        margin-top: 15px;

        padding-top: 13px;
      }


      .detail-actions button {
        min-height: 37px;

        border: 0;

        border-radius: 9px;

        cursor: pointer;

        font-size: 9px;

        font-weight: 800;

        transition: 0.2s ease;
      }


      .detail-actions button:hover {
        transform: translateY(-2px);
      }


      .complete-action {
        background:
          linear-gradient(
            135deg,
            #059669,
            #047857
          );

        color: white;

        box-shadow:
          0 5px 12px rgba(5,150,105,0.18);
      }


      .reschedule-action {
        background: #fef3c7;

        color: #92400e;
      }


      .cancel-action {
        background: #fee2e2;

        color: #b91c1c;
      }


      /* =====================================================
         NO SELECTION
      ====================================================== */

      .no-selected-booking {
        padding:
          60px 25px;

        text-align: center;
      }


      .no-selected-icon {
        width: 70px;

        height: 70px;

        margin:
          0 auto 15px;

        border-radius: 20px;

        background: #f1f5f9;

        color: #94a3b8;

        display: flex;

        align-items: center;

        justify-content: center;

        font-size: 30px;
      }


      .no-selected-booking h3 {
        color: #334155;

        font-size: 14px;

        margin-bottom: 5px;
      }


      .no-selected-booking p {
        color: #94a3b8;

        font-size: 10px;

        line-height: 1.5;
      }


      /* =====================================================
         LOADING
      ====================================================== */

      .gold-loading,
      .gold-error-page {
        min-height: 100vh;

        background:
          radial-gradient(
            circle at center,
            #e6fffb,
            #f8fafc 55%
          );

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        color: #10243e;
      }


      .loading-orbit {
        width: 85px;

        height: 85px;

        border-radius: 50%;

        border:
          2px solid #ccfbf1;

        position: relative;

        display: flex;

        align-items: center;

        justify-content: center;

        margin-bottom: 20px;
      }


      .loading-gold-ring {
        position: absolute;

        inset: 0;

        border:
          3px solid transparent;

        border-top-color: #d4a017;

        border-right-color: #008f90;

        border-radius: 50%;

        animation:
          loadingSpin 1s linear infinite;
      }


      .loading-icon {
        width: 48px;

        height: 48px;

        border-radius: 14px;

        background:
          linear-gradient(
            135deg,
            #008f90,
            #006d6b
          );

        color: #facc15;

        display: flex;

        align-items: center;

        justify-content: center;

        font-size: 24px;

        font-weight: 900;
      }


      @keyframes loadingSpin {
        to {
          transform: rotate(360deg);
        }
      }


      .gold-loading h2 {
        font-size: 19px;

        margin-bottom: 6px;
      }


      .gold-loading p {
        color: #94a3b8;

        font-size: 11px;
      }


      .loading-line {
        width: 180px;

        height: 4px;

        border-radius: 10px;

        background: #e2e8f0;

        margin-top: 18px;

        overflow: hidden;
      }


      .loading-line span {
        display: block;

        width: 45%;

        height: 100%;

        background: #008f90;

        border-radius: 10px;

        animation:
          loadingBar 1.3s infinite;
      }


      @keyframes loadingBar {
        0% {
          transform: translateX(-100%);
        }

        100% {
          transform: translateX(350%);
        }
      }


      /* =====================================================
         ERROR
      ====================================================== */

      .error-card {
        background: white;

        border:
          1px solid #fee2e2;

        border-radius: 18px;

        padding: 35px;

        text-align: center;

        max-width: 430px;

        box-shadow:
          0 15px 40px rgba(15,23,42,0.08);
      }


      .error-icon {
        width: 55px;

        height: 55px;

        border-radius: 50%;

        background: #fee2e2;

        color: #dc2626;

        display: flex;

        align-items: center;

        justify-content: center;

        margin:
          0 auto 15px;

        font-size: 24px;

        font-weight: 900;
      }


      .error-card h2 {
        font-size: 17px;

        margin-bottom: 8px;
      }


      .error-card p {
        color: #64748b;

        font-size: 11px;

        line-height: 1.6;

        margin-bottom: 20px;
      }


      .primary-button {
        border: 0;

        background:
          linear-gradient(
            135deg,
            #008f90,
            #006d6b
          );

        color: white;

        border-radius: 9px;

        padding:
          10px 18px;

        font-size: 11px;

        font-weight: 800;

        cursor: pointer;
      }


      /* =====================================================
         RESPONSIVE
      ====================================================== */

      @media (max-width: 1300px) {

        .kpi-grid {
          grid-template-columns:
            repeat(3, 1fr);
        }

        .workspace {
          grid-template-columns:
            minmax(0, 1fr) 340px;
        }

        .upcoming-grid {
          grid-template-columns:
            repeat(3, 1fr);
        }

      }


      @media (max-width: 1050px) {

        .workspace {
          grid-template-columns: 1fr;
        }

        .detail-panel {
          position: fixed;

          right: 15px;

          top: 15px;

          bottom: 15px;

          width: min(390px, calc(100vw - 30px));

          z-index: 2000;

          transform:
            translateX(calc(100% + 30px));

          transition:
            transform 0.3s ease;
        }

        .detail-panel.mobile-visible {
          transform:
            translateX(0);
        }

      }


      @media (max-width: 800px) {

        .gold-repair-page {
          padding: 12px;
        }

        .repair-header {
          flex-direction: column;

          align-items: stretch;
        }

        .header-search {
          max-width: none;
        }

        .header-actions {
          justify-content: space-between;
        }

        .page-heading {
          align-items: flex-start;

          flex-direction: column;
        }

        .kpi-grid {
          grid-template-columns:
            repeat(2, 1fr);
        }

        .schedule-toolbar {
          align-items: stretch;

          flex-direction: column;
        }

        .schedule-tabs {
          overflow-x: auto;

          flex-wrap: nowrap;

          padding-bottom: 3px;
        }

        .new-booking-button {
          width: 100%;
        }

        .filter-card {
          align-items: stretch;

          flex-direction: column;
        }

        .filter-group {
          width: 100%;
        }

        .filter-box {
          flex: 1;
        }

        .filter-box select {
          width: 100%;
        }

        .result-count {
          text-align: right;
        }

        .upcoming-grid {
          grid-template-columns:
            repeat(2, 1fr);
        }

      }


      @media (max-width: 520px) {

        .gold-repair-page {
          padding: 8px;
        }

        .header-date {
          display: none;
        }

        .admin-profile {
          padding-left: 8px;
        }

        .admin-profile > div:not(.admin-avatar) {
          display: none;
        }

        .admin-profile .profile-arrow {
          display: none;
        }

        .page-heading h1 {
          font-size: 21px;
        }

        .kpi-grid {
          grid-template-columns: 1fr;
        }

        .filter-group {
          flex-direction: column;
        }

        .filter-box {
          width: 100%;
        }

        .upcoming-grid {
          grid-template-columns: 1fr;
        }

      }

    `}</style>
  );
}

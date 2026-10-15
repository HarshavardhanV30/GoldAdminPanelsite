import React, { useState, useEffect, useCallback } from "react";

const BASE_URL =
  "https://goldbackend-production-0ed4.up.railway.app/goldservice";

const INITIAL_FORM = {
  service_id: "",
  service_name: "",
  service_fee: "",
  original_price: "",
};

const GoldRepairService = ({ existingServiceId = null }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");

  // GET ALL SERVICES
  const fetchAllServices = useCallback(async () => {
    setListLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/all`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to fetch services.");
      }

      // Supports either a direct array or common API response wrappers.
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.services)
        ? result.services
        : [];

      setServices(list);
    } catch (error) {
      showMessage(error.message || "Failed to load services.", "error");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  // MESSAGE HANDLER
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // LOAD SELECTED SERVICE FOR EDITING
  const editService = (service) => {
    setFormData({
      service_id: service.service_id ?? "",
      service_name: service.service_name ?? "",
      service_fee: service.service_fee ?? "",
      original_price: service.original_price ?? "",
    });

    setImageFile(null);
    setImagePreview(service.service_image || null);
    setEditingId(service.id);
    setIsEditing(true);
    showMessage("Editing selected service.", "success");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SUPPORT EXISTING SERVICE ID PROP
  useEffect(() => {
    if (existingServiceId == null || services.length === 0) return;

    const service = services.find(
      (item) => String(item.id) === String(existingServiceId)
    );

    if (service) {
      editService(service);
    } else {
      showMessage("Service not found.", "error");
    }
    // Only run when the requested ID or loaded service list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingServiceId, services]);

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE UPLOAD
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      showMessage("Please select a PNG or JPG image.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size must be 5MB or less.", "error");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  };

  // CLEAR FORM
  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsEditing(false);
    setMessage("");

    const fileInput = document.getElementById("service-image");
    if (fileInput) fileInput.value = "";
  };

  // DISCOUNT CALCULATION
  const calculateDiscount = () => {
    const fee = Number(formData.service_fee);
    const original = Number(formData.original_price);

    if (
      Number.isFinite(fee) &&
      Number.isFinite(original) &&
      original > fee &&
      original > 0 &&
      fee >= 0
    ) {
      return Math.round(((original - fee) / original) * 100);
    }

    return 0;
  };

  // POST NEW SERVICE / PUT EXISTING SERVICE
  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !formData.service_id.trim() ||
      !formData.service_name.trim() ||
      formData.service_fee === "" ||
      formData.original_price === ""
    ) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }

    if (
      !Number.isFinite(Number(formData.service_fee)) ||
      !Number.isFinite(Number(formData.original_price)) ||
      Number(formData.service_fee) < 0 ||
      Number(formData.original_price) < 0
    ) {
      showMessage("Enter valid non-negative prices.", "error");
      return;
    }

    if (!isEditing && !imageFile) {
      showMessage("Please select a service image.", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const submitData = new FormData();

      submitData.append("service_id", formData.service_id.trim());
      submitData.append("service_name", formData.service_name.trim());
      submitData.append("service_fee", formData.service_fee);
      submitData.append("original_price", formData.original_price);

      if (imageFile) {
        submitData.append("service_image", imageFile);
      }

      const url = isEditing
        ? `${BASE_URL}/${editingId}`
        : `${BASE_URL}/add`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: submitData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to save service."
        );
      }

      showMessage(
        isEditing
          ? "Service updated successfully!"
          : "Service created successfully!",
        "success"
      );

      resetForm();
      await fetchAllServices();
    } catch (error) {
      showMessage(error.message || "Failed to connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // DELETE SERVICE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gold repair service?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to delete service."
        );
      }

      if (String(editingId) === String(id)) {
        resetForm();
      }

      showMessage("Service deleted successfully!", "success");
      await fetchAllServices();
    } catch (error) {
      showMessage(error.message || "Failed to delete service.", "error");
    } finally {
      setLoading(false);
    }
  };

  // FILTER TABLE
  const filteredServices = services.filter((service) => {
    const query = searchTerm.toLowerCase();

    return (
      String(service.service_id || "").toLowerCase().includes(query) ||
      String(service.service_name || "").toLowerCase().includes(query) ||
      String(service.id || "").toLowerCase().includes(query)
    );
  });

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f3f6f8",
      padding: "clamp(12px, 3vw, 32px)",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#172b35",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      background: "linear-gradient(120deg, #073b3b, #105b54)",
      color: "#fff",
      padding: "24px",
      borderRadius: "16px",
      marginBottom: "24px",
      boxShadow: "0 8px 24px rgba(7,59,59,.12)",
    },
    panel: {
      background: "#fff",
      border: "1px solid #e3e9ec",
      borderRadius: "16px",
      padding: "clamp(16px, 3vw, 28px)",
      boxShadow: "0 4px 18px rgba(20,45,55,.04)",
      minWidth: 0,
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 700,
      color: "#334852",
      marginBottom: "8px",
    },
    input: {
      display: "block",
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #d7e0e4",
      borderRadius: "9px",
      fontSize: "14px",
      outlineColor: "#c99724",
      boxSizing: "border-box",
      background: "#fff",
      color: "#172b35",
    },
    primaryButton: {
      background: "#e6ae2c",
      color: "#172b35",
      border: "none",
      borderRadius: "9px",
      padding: "12px 18px",
      fontWeight: 800,
      cursor: "pointer",
    },
    secondaryButton: {
      background: "#fff",
      color: "#334852",
      border: "1px solid #d7e0e4",
      borderRadius: "9px",
      padding: "12px 18px",
      fontWeight: 700,
      cursor: "pointer",
    },
    tableCell: {
      padding: "14px 12px",
      textAlign: "left",
      borderBottom: "1px solid #edf1f3",
      fontSize: "13px",
      verticalAlign: "middle",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={{ color: "#f3c65e", fontSize: "12px", fontWeight: 800 }}>
            G-BUYER / ADMIN PANEL
          </div>

          <h1 style={{ fontSize: "clamp(23px, 3vw, 30px)", margin: "10px 0" }}>
            Gold Repair Services
          </h1>

          <p style={{ color: "#d0e4df", margin: 0, lineHeight: 1.6 }}>
            Manage service details, pricing, images and repair service listings.
          </p>
        </header>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Services", value: services.length, icon: "✦" },
            {
              label: "Lowest Service Fee",
              value:
                services.length > 0
                  ? `₹${money(
                      Math.min(...services.map((s) => Number(s.service_fee) || 0))
                    )}`
                  : "₹0.00",
              icon: "₹",
            },
            {
              label: "Services With Images",
              value: services.filter((s) => s.service_image).length,
              icon: "▧",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                ...styles.panel,
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  flexShrink: 0,
                  borderRadius: "12px",
                  display: "grid",
                  placeItems: "center",
                  background: "#fff4d4",
                  color: "#a36b00",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                {item.icon}
              </div>

              <div>
                <div style={{ color: "#71818a", fontSize: "12px" }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "21px",
                    fontWeight: 800,
                    marginTop: "5px",
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD / EDIT FORM + PREVIEW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "22px",
            alignItems: "start",
            marginBottom: "28px",
          }}
        >
          <section style={styles.panel}>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  color: "#a77814",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              >
                SERVICE CONFIGURATION
              </div>

              <h2 style={{ margin: "8px 0", fontSize: "22px" }}>
                {isEditing ? "Edit Service" : "Add New Service"}
              </h2>

              <p style={{ color: "#71818a", fontSize: "13px", lineHeight: 1.6 }}>
                Enter the service information and upload a clear image.
              </p>
            </div>

            {message && (
              <div
                role="status"
                style={{
                  padding: "12px",
                  borderRadius: "9px",
                  marginBottom: "18px",
                  fontSize: "13px",
                  background:
                    messageType === "error" ? "#fff0f0" : "#eaf8ee",
                  color: messageType === "error" ? "#b42318" : "#16743b",
                  border:
                    messageType === "error"
                      ? "1px solid #ffd0d0"
                      : "1px solid #c9ebd2",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <label style={styles.label}>
                    Service ID <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleInputChange}
                    placeholder="SRV-GOLD-007"
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Service Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="service_name"
                    value={formData.service_name}
                    onChange={handleInputChange}
                    placeholder="Gold Earring Repair"
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Service Fee (₹) <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="number"
                    name="service_fee"
                    min="0"
                    step="0.01"
                    value={formData.service_fee}
                    onChange={handleInputChange}
                    placeholder="449.00"
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Original Price (₹){" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="number"
                    name="original_price"
                    min="0"
                    step="0.01"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    placeholder="1000.00"
                    required
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD */}
              <div style={{ marginTop: "22px" }}>
                <label style={styles.label}>
                  Service Image{" "}
                  {!isEditing && (
                    <span style={{ color: "#dc2626" }}>*</span>
                  )}
                </label>

                <label
                  htmlFor="service-image"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "120px",
                    padding: "20px",
                    border: "2px dashed #d7e0e4",
                    borderRadius: "12px",
                    background: "#fafcfc",
                    cursor: "pointer",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: "30px", color: "#a77814" }}>
                    ⇧
                  </span>
                  <strong style={{ fontSize: "14px", marginTop: "8px" }}>
                    Click to upload an image
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#71818a",
                      marginTop: "6px",
                    }}
                  >
                    PNG or JPG · Maximum 5MB
                  </span>

                  <input
                    id="service-image"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImageChange}
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                      clip: "rect(0,0,0,0)",
                    }}
                  />
                </label>

                {imagePreview && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      marginTop: "14px",
                      padding: "10px",
                      border: "1px solid #e3e9ec",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Selected service"
                      style={{
                        width: "86px",
                        height: "76px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: "13px" }}>
                        {imageFile ? imageFile.name : "Current service image"}
                      </strong>
                      <div
                        style={{
                          color: "#71818a",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {imageFile
                          ? `${(imageFile.size / 1024).toFixed(1)} KB`
                          : "Existing image"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        const input = document.getElementById("service-image");
                        if (input) input.value = "";
                      }}
                      style={{
                        ...styles.secondaryButton,
                        padding: "8px 10px",
                        color: "#b42318",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {isEditing && !imageFile && (
                  <p style={{ color: "#71818a", fontSize: "12px" }}>
                    To replace the image, upload another file. If no new file is
                    selected, the existing image is not sent in the update.
                  </p>
                )}
              </div>

              {/* FORM ACTIONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.primaryButton,
                    flex: 1,
                    minWidth: "140px",
                    opacity: loading ? 0.65 : 1,
                  }}
                >
                  {loading
                    ? "Please wait..."
                    : isEditing
                    ? "✓ Update Service"
                    : "+ Save Service"}
                </button>
              </div>
            </form>
          </section>

          {/* LIVE PREVIEW */}
          <section
            style={{
              ...styles.panel,
              background: "#fffaf0",
              borderColor: "#f0dfb6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                alignItems: "center",
                marginBottom: "18px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ fontSize: "20px", margin: 0 }}>Live Preview</h2>
              <span
                style={{
                  background: "#ffedb6",
                  color: "#815b09",
                  padding: "7px 12px",
                  borderRadius: "30px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                ✦ GOLD REPAIR
              </span>
            </div>

            <div
              style={{
                height: "clamp(200px, 28vw, 330px)",
                background: "#f2ead9",
                borderRadius: "12px",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                border: "1px solid #e8dcc4",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={formData.service_name || "Service preview"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ color: "#927c55", textAlign: "center" }}>
                  <div style={{ fontSize: "42px" }}>◇</div>
                  <div style={{ fontSize: "13px" }}>Service image preview</div>
                </div>
              )}
            </div>

            <div style={{ padding: "18px 0 4px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "23px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {formData.service_name || "Service Name"}
                </h3>

                <span
                  style={{
                    fontSize: "11px",
                    padding: "6px 9px",
                    background: "#fff",
                    border: "1px solid #e6d7b6",
                    borderRadius: "7px",
                  }}
                >
                  {formData.service_id || "SERVICE-ID"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  margin: "18px 0 22px",
                }}
              >
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#bd850e",
                  }}
                >
                  ₹{money(formData.service_fee)}
                </span>

                {Number(formData.original_price) > 0 && (
                  <span
                    style={{
                      color: "#899197",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{money(formData.original_price)}
                  </span>
                )}

                {calculateDiscount() > 0 && (
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "6px 9px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {calculateDiscount()}% OFF
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  background: "#f6efdf",
                  borderRadius: "10px",
                  padding: "16px 6px",
                  textAlign: "center",
                  gap: "4px",
                }}
              >
                {[
                  ["⚒", "Expert Repair"],
                  ["✓", "Quality Work"],
                  ["◇", "Shine Restored"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    style={{
                      padding: "5px",
                      borderRight:
                        label !== "Shine Restored"
                          ? "1px solid #e1d4bb"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        color: "#0f766e",
                        fontSize: "24px",
                        marginBottom: "8px",
                      }}
                    >
                      {icon}
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ALL SERVICES TABLE — BOTTOM OF PAGE */}
        <section style={styles.panel}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#a77814",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              >
                SERVICE DIRECTORY
              </div>
              <h2 style={{ margin: "8px 0", fontSize: "23px" }}>
                All Gold Repair Services
              </h2>
              <p style={{ color: "#71818a", fontSize: "13px", margin: 0 }}>
                View, edit, and delete services from your database.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAllServices}
              disabled={listLoading}
              style={styles.secondaryButton}
            >
              ↻ {listLoading ? "Refreshing..." : "Refresh List"}
            </button>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by service ID, name, or database ID..."
            style={{ ...styles.input, marginBottom: "20px" }}
          />

          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                width: "100%",
                minWidth: "800px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f7f7" }}>
                  {[
                    "IMAGE",
                    "DATABASE ID",
                    "SERVICE ID",
                    "SERVICE NAME",
                    "SERVICE FEE",
                    "ORIGINAL PRICE",
                    "DISCOUNT",
                    "ACTIONS",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        ...styles.tableCell,
                        fontSize: "11px",
                        color: "#62747c",
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {listLoading && services.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ ...styles.tableCell, textAlign: "center" }}
                    >
                      Loading services...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        ...styles.tableCell,
                        textAlign: "center",
                        padding: "40px 12px",
                        color: "#71818a",
                      }}
                    >
                      <div style={{ fontSize: "30px", marginBottom: "10px" }}>
                        ◇
                      </div>
                      {searchTerm
                        ? "No matching services found."
                        : "No services available. Add your first service above."}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const fee = Number(service.service_fee) || 0;
                    const original = Number(service.original_price) || 0;
                    const discount =
                      original > fee && original > 0
                        ? Math.round(((original - fee) / original) * 100)
                        : 0;

                    return (
                      <tr key={service.id}>
                        <td style={styles.tableCell}>
                          {service.service_image ? (
                            <img
                              src={service.service_image}
                              alt={service.service_name || "Service"}
                              loading="lazy"
                              style={{
                                width: "58px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e3e9ec",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "58px",
                                height: "50px",
                                borderRadius: "8px",
                                background: "#f3f6f8",
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              ◇
                            </div>
                          )}
                        </td>

                        <td style={styles.tableCell}>{service.id}</td>

                        <td style={styles.tableCell}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 8px",
                              background: "#edf5f4",
                              color: "#0f766e",
                              borderRadius: "6px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {service.service_id || "—"}
                          </span>
                        </td>

                        <td
                          style={{
                            ...styles.tableCell,
                            fontWeight: 700,
                            maxWidth: "200px",
                          }}
                        >
                          {service.service_name || "—"}
                        </td>

                        <td
                          style={{
                            ...styles.tableCell,
                            color: "#a77814",
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹{money(fee)}
                        </td>

                        <td
                          style={{
                            ...styles.tableCell,
                            color: "#71818a",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹{money(original)}
                        </td>

                        <td style={styles.tableCell}>
                          {discount > 0 ? (
                            <span
                              style={{
                                background: "#e6f7eb",
                                color: "#16743b",
                                borderRadius: "6px",
                                padding: "5px 8px",
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {discount}% OFF
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td style={styles.tableCell}>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => editService(service)}
                              disabled={loading}
                              style={{
                                ...styles.secondaryButton,
                                padding: "8px 11px",
                                fontSize: "12px",
                              }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(service.id)}
                              disabled={loading}
                              style={{
                                ...styles.secondaryButton,
                                padding: "8px 11px",
                                fontSize: "12px",
                                color: "#b42318",
                                borderColor: "#f1c5c5",
                              }}
                            >
                              Delete
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

          <div
            style={{
              borderTop: "1px solid #edf1f3",
              paddingTop: "16px",
              marginTop: "14px",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              color: "#71818a",
              fontSize: "12px",
            }}
          >
            <span>
              Showing {filteredServices.length} of {services.length} services
            </span>
            <span>G-BUYER · Gold Repair Management</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GoldRepairService;

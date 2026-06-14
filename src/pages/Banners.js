import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";

const BannerManagement = () => {
  // Component States
  const [banners, setBanners] = useState([]);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // File Input Ref to reset the field safely
  const fileInputRef = useRef(null);

  // 1. GET ALL Banners
  const fetchBanners = async () => {
    try {
      const response = await fetch("https://goldbackend-auyv.onrender.com/banners/bannerall");
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert("Failed to load banners.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Reset form status
  const resetForm = () => {
    setName("");
    setImageFile(null);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 2. POST (Add) & PUT (Update) Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!editId && (!name || !imageFile)) {
      alert("Please fill in both name and image fields to add a banner.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (imageFile) formData.append("bannerimage", imageFile);

    try {
      let url = "https://goldbackend-auyv.onrender.com/banners/add";
      let method = "POST";

      if (editId) {
        url = `https://goldbackend-auyv.onrender.com/banners/update/${editId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        alert(editId ? "Banner updated successfully!" : "Banner added successfully!");
        resetForm();
        fetchBanners();
      } else {
        alert("Something went wrong with the submission.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("API error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Setup form fields for editing
  const handleEditSetup = (banner) => {
    setEditId(banner.id);
    setName(banner.name);
    // Note: Browser security does not allow pre-filling input type="file" via code.
    // The image file remains optional during updating.
  };

  // 3. DELETE Banner
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await fetch(`https://goldbackend-auyv.onrender.com/banners/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Banner deleted successfully!");
          fetchBanners();
          if (editId === id) resetForm(); // Clear form if current edited banner is deleted
        } else {
          alert("Failed to delete banner.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("API error occurred while deleting.");
      }
    }
  };

  return (
    <div
      style={{
        background: "#f5f6fa",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Section */}
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
            fontSize: "26px", // Reduced font size
            fontWeight: "700",
            color: "#111827",
            margin: 0,
          }}
        >
          Banner Management
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px", // Reduced font size
            color: "#111827",
          }}
        >
          <FaUserCircle size={22} color="#9ca3af" />
          <span>Admin</span>
        </div>
      </div>

      {/* Dynamic Add / Edit Banner Section */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            fontSize: "20px", // Reduced font size
            fontWeight: "700",
            marginBottom: "15px",
            color: "#111827",
          }}
        >
          {editId ? "Edit Banner Details" : "Add New Banner"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Banner Name Field */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  fontSize: "14px", // Reduced font size
                }}
              >
                Banner Name {!editId && <span style={{ color: "red" }}>*</span>}
              </label>

              <input
                type="text"
                placeholder="Enter banner name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px", // Reduced height
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "0 12px",
                  fontSize: "14px", // Reduced font size
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Banner Image Field */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  fontSize: "14px", // Reduced font size
                }}
              >
                Banner Image {!editId && <span style={{ color: "red" }}>*</span>}
              </label>

              <div
                style={{
                  display: "flex",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  overflow: "hidden",
                  height: "40px", // Reduced height
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "8px",
                    fontSize: "13px", // Reduced font size
                    background: "#fff",
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    width: "100px",
                    border: "none",
                    background: "#f3f4f6",
                    fontSize: "14px", // Reduced font size
                    cursor: "pointer",
                    borderLeft: "1px solid #d1d5db",
                  }}
                >
                  Browse
                </button>
              </div>

              <p
                style={{
                  marginTop: "6px",
                  fontSize: "12px", // Reduced font size
                  color: "#6b7280",
                }}
              >
                Recommended size: 1920 x 600 px (JPG, PNG, WEBP) {editId && "• Leave blank to keep existing"}
              </p>
            </div>
          </div>

          {/* Form Actions Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: editId ? "#10b981" : "#2563eb", // Emerald for save, blue for submit
                color: "#fff",
                border: "none",
                padding: "10px 25px",
                borderRadius: "6px",
                fontSize: "14px", // Reduced font size
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {loading ? "Processing..." : editId ? "Update Banner" : "Submit"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "#6b7280",
                  color: "#fff",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banner List Table Section */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "20px", // Reduced font size
            fontWeight: "700",
            marginBottom: "15px",
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
                  background: "#f9fafb",
                }}
              >
                <th style={tableHead}>#</th>
                <th style={tableHead}>Banner Name</th>
                <th style={tableHead}>Banner Image</th>
                <th style={tableHead}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...tableCell, textAlign: "center", color: "#9ca3af" }}>
                    No banners found.
                  </td>
                </tr>
              ) : (
                banners.map((banner, index) => (
                  <tr
                    key={banner.id || index}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={tableCell}>{index + 1}</td>

                    <td style={tableCell}>{banner.name}</td>

                    <td style={tableCell}>
                      {banner.bannerimage ? (
                        <img
                          src={banner.bannerimage}
                          alt={banner.name}
                          style={{
                            width: "220px", // Reduced size
                            height: "65px",  // Reduced size
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>No Image</span>
                      )}
                    </td>

                    <td style={tableCell}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {/* Edit Action Button */}
                        <button
                          onClick={() => handleEditSetup(banner)}
                          title="Edit Banner"
                          style={{
                            width: "32px", // Reduced size
                            height: "32px", // Reduced size
                            border: "1.5px solid #2563eb",
                            borderRadius: "6px",
                            background: "#fff",
                            color: "#2563eb",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaEdit size={14} />
                        </button>

                        {/* Delete Action Button */}
                        <button
                          onClick={() => handleDelete(banner.id)}
                          title="Delete Banner"
                          style={{
                            width: "32px", // Reduced size
                            height: "32px", // Reduced size
                            border: "none",
                            borderRadius: "6px",
                            background: "#ef4444",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p
          style={{
            marginTop: "15px",
            fontSize: "13px", // Reduced font size
            color: "#374151",
          }}
        >
          Showing {banners.length} of {banners.length} entries
        </p>
      </div>
    </div>
  );
};

// Reusable styling templates with scaled down fonts and paddings
const tableHead = {
  padding: "12px 16px", // Reduced padding
  fontSize: "14px",      // Reduced font size
  fontWeight: "700",
  color: "#4b5563",
};

const tableCell = {
  padding: "12px 16px", // Reduced padding
  fontSize: "13px",      // Reduced font size
  color: "#111827",
  verticalAlign: "middle",
};

export default BannerManagement;
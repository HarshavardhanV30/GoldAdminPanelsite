import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaUserCircle,
  FaPen,
  FaTrash,
} from "react-icons/fa";

const BASE_URL = "https://goldbackend-auyv.onrender.com/category";

const CategoryAdminPanel = () => {
  // State variables
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);   // Stores local file object for upload
  const [previewUrl, setPreviewUrl] = useState("");         // Stores temporary local visual preview
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // File Input Ref to safely target and reset the field reset
  const fileInputRef = useRef(null);

  // Fetch all categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);

  // 1. GET ALL API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/all`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories.");
    }
  };

  // Capture file and generate a fast local preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    // Create a local temporary URL just for the browser preview
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 2. POST (Add) or PUT (Update) API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    // Validation for raw additions
    if (!editingId && !selectedFile) {
      alert("Please select an image file to add a new category.");
      return;
    }

    setLoading(true);

    // Using FormData format to allow backend process via Cloudinary
    const formData = new FormData();
    formData.append("name", name);
    if (selectedFile) {
      formData.append("categoryimage", selectedFile);
    }

    try {
      let url = `${BASE_URL}/add`;
      let method = "POST";

      if (editingId) {
        url = `${BASE_URL}/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        body: formData, // Send FormData direct payload (Do not add application/json headers)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server status: ${response.status} - ${errText}`);
      }

      // Reset form variables upon successful configuration updates
      handleCancelEdit();

      // Refresh data grid
      fetchCategories();
      alert(editingId ? "Category updated successfully!" : "Category added successfully!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert(`Failed to save category. Error Details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Setup form fields for updating an entry
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setPreviewUrl(item.categoryimage || ""); // Existing cloud image acts as the initial placeholder preview
    setSelectedFile(null); // Clear selected file instance
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. DELETE API
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      alert("Category deleted successfully!");
      fetchCategories();
      if (editingId === id) handleCancelEdit();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  // Cancel out of editing mode / Clean reset operations
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          height: "60px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <FaBars size={20} color="#1f2937" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "15px",
            fontWeight: "500",
            color: "#111827",
          }}
        >
          <FaUserCircle size={28} color="#9ca3af" />
          <span>Admin</span>
          <span style={{ fontSize: "11px" }}>▼</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            margin: 0,
            fontWeight: "700",
            color: "#000",
          }}
        >
          Categories
        </h1>

        <p
          style={{
            marginTop: "6px",
            color: "#6b7280",
            fontSize: "14px",
            marginBottom: "0px"
          }}
        >
          Manage your categories
        </p>

        {/* Add / Edit Category Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            marginTop: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #ececec",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              color: "#111827",
              marginTop: 0
            }}
          >
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#111827",
                }}
              >
                Category Name {!editingId && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#111827",
                }}
              >
                Category Image File {!editingId && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="categoryImageInput"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={fileInputStyle}
                required={!editingId} 
              />
              
              {/* Image Preview Window */}
              {previewUrl && (
                <div style={{ marginTop: "12px" }}>
                  <span style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                    Selected Preview:
                  </span>
                  <img
                    src={previewUrl}
                    alt="Preview Target"
                    style={{
                      height: "75px",
                      width: "75px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb"
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#93c5fd" : editingId ? "#10b981" : "#1565ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "500",
                }}
              >
                {loading ? "Processing..." : editingId ? "Update" : "Submit"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    backgroundColor: "#e5e7eb",
                    color: "#1f2937",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            marginTop: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #ececec",
          }}
        >
          <h2
            style={{
              marginBottom: "16px",
              fontSize: "18px",
              color: "#111827",
              marginTop: 0
            }}
          >
            All Categories
          </h2>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
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
                  <th style={tableHeader}># ID</th>
                  <th style={tableHeader}>Image</th>
                  <th style={tableHeader}>Category Name</th>
                  <th style={tableHeader}>Created At</th>
                  <th style={tableHeader}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ ...tableCell, textAlign: "center", color: "#9ca3af" }}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <td style={tableCell}>{item.id || index + 1}</td>
                      <td style={tableCell}>
                        <img 
                          src={item.categoryimage || "https://via.placeholder.com/45"} 
                          alt={item.name} 
                          style={{ width: "45px", height: "45px", borderRadius: "4px", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/45"; }}
                        />
                      </td>
                      <td style={tableCell}>{item.name}</td>
                      <td style={tableCell}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                      </td>

                      <td style={tableCell}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit Category"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "6px",
                              border: "1.5px solid #2563eb",
                              background: "#fff",
                              color: "#2563eb",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaPen size={12} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Category"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "6px",
                              border: "1.5px solid #ef4444",
                              background: "#fff",
                              color: "#ef4444",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout Design Specifications
const tableHeader = {
  padding: "14px 18px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
};

const tableCell = {
  padding: "14px 18px",
  fontSize: "14px",
  color: "#374151",
  verticalAlign: "middle"
};

const inputStyle = {
  width: "100%",
  height: "42px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  paddingLeft: "12px",
  fontSize: "14px",
  outline: "none",
  color: "#111827",
  boxSizing: "border-box",
};

const fileInputStyle = {
  display: "block",
  width: "100%",
  fontSize: "14px",
  color: "#374151",
  padding: "8px 0"
};

export default CategoryAdminPanel;

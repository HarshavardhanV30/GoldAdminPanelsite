import React, { useState, useEffect } from "react";
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
  const [categoryImage, setCategoryImage] = useState(""); // Stores base64 string or url
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  // Helper: Convert File Object to Base64 String 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit to prevent oversized Base64 payload failures (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Please choose an image smaller than 2MB.");
      e.target.value = ""; // Clear file selector
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCategoryImage(reader.result); // Base64 Data URI string
    };
    reader.readAsDataURL(file);
  };

  // 2. POST (Add) or PUT (Update) API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    setLoading(true);
    
    // Request body configured exactly to match your schema keys
    const bodyData = {
      name: name,
      categoryimage: categoryImage || "https://via.placeholder.com/150"
    };

    try {
      let url = `${BASE_URL}/add`;
      let method = "POST";

      if (editingId) {
        url = `${BASE_URL}/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("API action failed");

      // Reset form variables
      setName("");
      setCategoryImage("");
      setEditingId(null);
      
      // Reset input element visually
      const fileInput = document.getElementById("categoryImageInput");
      if (fileInput) fileInput.value = "";

      // Refresh the list
      fetchCategories();
      alert(editingId ? "Category updated successfully!" : "Category added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  // Setup form fields for updating an entry
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setCategoryImage(item.categoryimage || "");
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
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  // Cancel out of editing mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategoryImage("");
    const fileInput = document.getElementById("categoryImageInput");
    if (fileInput) fileInput.value = "";
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
                Category Name
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
                Category Image File
              </label>
              <input
                id="categoryImageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={fileInputStyle}
                required={!editingId} // Image is mandatory only when creating new
              />
              
              {/* Image Preview Window */}
              {categoryImage && (
                <div style={{ marginTop: "12px" }}>
                  <span style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                    Image Preview:
                  </span>
                  <img
                    src={categoryImage}
                    alt="Preview Target"
                    style={{
                      height: "70px",
                      width: "70px",
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
                  backgroundColor: loading ? "#93c5fd" : "#1565ff",
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
            borderRadius: "#8px",
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
                  categories.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <td style={tableCell}>{item.id}</td>
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

// Extracted Styles with Normalized Standard Dimensions
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

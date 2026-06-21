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
  const [categoryImage, setCategoryImage] = useState("");
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

  // 2. POST (Add) or PUT (Update) API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    setLoading(true);
    
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

      setName("");
      setCategoryImage("");
      setEditingId(null);
      
      fetchCategories();
      alert(editingId ? "Category updated successfully!" : "Category added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategoryImage("");
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
          padding: "0 20px",
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
          <FaUserCircle size={26} color="#9ca3af" />
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
            color: "#111827",
          }}
        >
          Categories
        </h1>

        <p
          style={{
            marginTop: "6px",
            color: "#6b7280",
            fontSize: "15px",
            marginBlockEnd: 0,
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
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
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
                Category Image URL
              </label>
              <input
                type="url"
                value={categoryImage}
                onChange={(e) => setCategoryImage(e.target.value)}
                placeholder="Enter category image URL (e.g. Cloudinary link)"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
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
                  transition: "background-color 0.2s",
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
              margin: "0 0 16px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
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
                          src={item.categoryimage || "https://via.placeholder.com/40"} 
                          alt={item.name} 
                          style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                        />
                      </td>
                      <td style={{ ...tableCell, fontWeight: "500" }}>{item.name}</td>
                      <td style={tableCell}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
                      </td>

                      <td style={tableCell}>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit Category"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              border: "1px solid #2563eb",
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
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              border: "1px solid #ef4444",
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

// Updated Styles Object Matrix
const tableHeader = {
  padding: "14px 16px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#4b5563",
};

const tableCell = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#111827",
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

export default CategoryAdminPanel;

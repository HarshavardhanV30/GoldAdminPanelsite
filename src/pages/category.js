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
  const [editingId, setEditingId] = useState(null); // Keeps track if we are updating

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
    
    // Construct request body match JSON expectations
    const bodyData = {
      name: name,
      categoryimage: categoryImage || "https://via.placeholder.com/150" // Fallback placeholder if empty
    };

    try {
      let url = `${BASE_URL}/add`;
      let method = "POST";

      // If editingId exists, swap to the PUT routine
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
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to the form nicely
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
      fetchCategories(); // Refresh list
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
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
        }}
      >
        <FaBars size={24} color="#1f2937" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "20px",
            fontWeight: "500",
            color: "#111827",
          }}
        >
          <FaUserCircle size={34} color="#9ca3af" />
          <span>Admin</span>
          <span style={{ fontSize: "14px" }}>▼</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "35px" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: "54px",
            margin: 0,
            fontWeight: "700",
            color: "#000",
          }}
        >
          Categories
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#6b7280",
            fontSize: "28px",
          }}
        >
          Manage your categories
        </p>

        {/* Add / Edit Category Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "35px",
            marginTop: "35px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            border: "1px solid #ececec",
          }}
        >
          <h2
            style={{
              marginBottom: "35px",
              fontSize: "36px",
              color: "#111827",
            }}
          >
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "15px",
                  fontWeight: "600",
                  fontSize: "24px",
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

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "15px",
                  fontWeight: "600",
                  fontSize: "24px",
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

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "10px",
                  backgroundColor: loading ? "#93c5fd" : "#1565ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "16px 32px",
                  fontSize: "22px",
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
                    marginTop: "10px",
                    backgroundColor: "#e5e7eb",
                    color: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    padding: "16px 32px",
                    fontSize: "22px",
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
            borderRadius: "12px",
            padding: "35px",
            marginTop: "35px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            border: "1px solid #ececec",
          }}
        >
          <h2
            style={{
              marginBottom: "30px",
              fontSize: "36px",
              color: "#111827",
            }}
          >
            All Categories
          </h2>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
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
                          src={item.categoryimage || "https://via.placeholder.com/60"} 
                          alt={item.name} 
                          style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                        />
                      </td>
                      <td style={tableCell}>{item.name}</td>
                      <td style={tableCell}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
                      </td>

                      <td style={tableCell}>
                        <div
                          style={{
                            display: "flex",
                            gap: "15px",
                          }}
                        >
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit Category"
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "8px",
                              border: "2px solid #2563eb",
                              background: "#fff",
                              color: "#2563eb",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaPen size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Category"
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "8px",
                              border: "2px solid #ef4444",
                              background: "#fff",
                              color: "#ef4444",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaTrash size={18} />
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

// Extracted / Shared Styles
const tableHeader = {
  padding: "24px",
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
};

const tableCell = {
  padding: "24px",
  fontSize: "22px",
  color: "#374151",
  verticalAlign: "middle"
};

const inputStyle = {
  width: "100%",
  height: "70px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  paddingLeft: "20px",
  fontSize: "22px",
  outline: "none",
  color: "#111827",
  boxSizing: "border-box",
};

export default CategoryAdminPanel;

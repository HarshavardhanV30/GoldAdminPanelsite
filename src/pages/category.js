import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaPen, FaTrash, FaTimes } from "react-icons/fa";

const BASE_URL = "https://goldbackend-production-3359.up.railway.app/category";

const CategoryAdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  // 1. Fetch All Categories (GET)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/all`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error loading categories. Please check API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Add New Category (POST)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (file) {
      formData.append("categoryimage", file);
    }

    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add category");

      setName("");
      setFile(null);
      // Reset file input UI
      const fileInput = document.getElementById("categoryImageInput");
      if (fileInput) fileInput.value = "";

      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  // 3. Delete Category (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  // 4. Start Editing
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditFile(null);
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditFile(null);
  };

  // 5. Submit Update (PUT)
  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editName);
    if (editFile) {
      formData.append("categoryimage", editFile);
    }

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update category");

      cancelEdit();
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
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
        <FaBars size={20} color="#1f2937" style={{ cursor: "pointer" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          <FaUserCircle size={24} color="#9ca3af" />
          <span>Admin</span>
          <span style={{ fontSize: "10px" }}>▼</span>
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

        <p style={{ marginTop: "4px", color: "#6b7280", fontSize: "14px" }}>
          Manage your categories
        </p>

        {/* Add Category Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              marginBottom: "16px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Add New Category
          </h2>

          <form onSubmit={handleAddCategory}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rings, Necklaces"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    padding: "0 12px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#111827",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Category Image
                </label>
                <input
                  id="categoryImageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "6px 0",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "16px",
                backgroundColor: "#1565ff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Categories Table */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              marginBottom: "16px",
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
                  <th style={tableHeader}>#</th>
                  <th style={tableHeader}>Image</th>
                  <th style={tableHeader}>Category Name</th>
                  <th style={tableHeader}>Created At</th>
                  <th style={tableHeader}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ ...tableCell, textAlign: "center" }}>
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ ...tableCell, textAlign: "center" }}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((item, index) => {
                    const isEditing = editingId === item.id;

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <td style={tableCell}>{index + 1}</td>

                        {/* Image Column */}
                        <td style={tableCell}>
                          {isEditing ? (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setEditFile(e.target.files[0])}
                              style={{ fontSize: "12px" }}
                            />
                          ) : item.categoryimage ? (
                            <img
                              src={item.categoryimage}
                              alt={item.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                objectFit: "cover",
                                border: "1px solid #e5e7eb",
                              }}
                            />
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                              No Image
                            </span>
                          )}
                        </td>

                        {/* Name Column */}
                        <td style={tableCell}>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              style={{
                                height: "32px",
                                borderRadius: "4px",
                                border: "1px solid #d1d5db",
                                padding: "0 8px",
                                fontSize: "14px",
                              }}
                            />
                          ) : (
                            item.name
                          )}
                        </td>

                        {/* Created At Column */}
                        <td style={tableCell}>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : item.createdAt || "N/A"}
                        </td>

                        {/* Action Buttons */}
                        <td style={tableCell}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleUpdate(item.id)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    border: "none",
                                    background: "#16a34a",
                                    color: "#fff",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  style={{
                                    padding: "6px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d5db",
                                    background: "#fff",
                                    color: "#374151",
                                    cursor: "pointer",
                                  }}
                                >
                                  <FaTimes size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(item)}
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const tableHeader = {
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const tableCell = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#4b5563",
};

export default CategoryAdminPanel;

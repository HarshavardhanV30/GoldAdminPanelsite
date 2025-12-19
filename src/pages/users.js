import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaMoon,
  FaSun,
  FaFileExcel,
} from "react-icons/fa";
import * as XLSX from "xlsx";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("dark"); // dark | light

  const isDark = theme === "dark";

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://rendergoldapp-1.onrender.com/users/all"
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `https://rendergoldapp-1.onrender.com/users/${id}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  /* ================= EXPORT EXCEL ================= */
  const exportToExcel = () => {
    const data = users.map((u) => ({
      ID: u.id,
      Name: u.full_name,
      Email: u.email,
      Phone: u.phone,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users_List.xlsx");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: isDark
          ? "radial-gradient(circle at top, #0f172a, #020617)"
          : "#f1f5f9",
        color: isDark ? "#e5e7eb" : "#020617",
        fontFamily: "Inter, Segoe UI, sans-serif",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "700", margin: 0 }}>
            Users
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: isDark ? "#94a3b8" : "#475569",
            }}
          >
            Manage all platform users
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              background: "#1e293b",
              border: "none",
              padding: "10px",
              borderRadius: "10px",
              color: "#facc15",
              cursor: "pointer",
            }}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          <button
            onClick={exportToExcel}
            style={{
              background: "#16a34a",
              border: "none",
              padding: "10px 14px",
              borderRadius: "10px",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaFileExcel /> Export
          </button>
        </div>
      </div>

      {/* ================= CARD ================= */}
      <div
        style={{
          height: "calc(100% - 90px)",
          borderRadius: "14px",
          border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
          display: "flex",
          flexDirection: "column",
          background: isDark ? "#020617" : "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "18px",
            borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: "18px" }}>All Users</h4>
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              {filteredUsers.length} users
            </span>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderRadius: "10px",
              padding: "8px 14px",
              outline: "none",
              width: "220px",
              border: "1px solid",
              background: isDark ? "#020617" : "#f8fafc",
              color: isDark ? "#e5e7eb" : "#020617",
              borderColor: isDark ? "#1e293b" : "#cbd5f5",
            }}
          />
        </div>

        {/* ================= TABLE ================= */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedUser(user)}
                >
                  <td style={{ color: "#facc15", fontWeight: "600" }}>
                    {user.id}
                  </td>
                  <td style={{ fontWeight: "600" }}>
                    {user.full_name}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td style={{ textAlign: "center" }}>
                    <FaEdit
                      style={{
                        color: "#38bdf8",
                        marginRight: "12px",
                        cursor: "pointer",
                      }}
                    />
                    <FaTrash
                      style={{
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user.id);
                      }}
                    />
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#64748b",
                    }}
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              background: "#020617",
              padding: "25px",
              borderRadius: "14px",
              width: "420px",
              color: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "15px" }}>User Details</h3>
            <p><b>ID:</b> {selectedUser.id}</p>
            <p><b>Name:</b> {selectedUser.full_name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Phone:</b> {selectedUser.phone}</p>

            <button
              style={{
                marginTop: "15px",
                background: "#1e293b",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

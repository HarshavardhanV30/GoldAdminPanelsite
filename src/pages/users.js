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
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://rendergoldapp-1.onrender.com/users/all",
        { timeout: 10000 }
      );

      const safeData = Array.isArray(res?.data) ? res.data : [];
      setUsers(safeData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!id) return;

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
    try {
      const data = users.map((u, index) => ({
        "S.NO": index + 1,
        ID: u?.id ?? "",
        Name: u?.full_name ?? "",
        Email: u?.email ?? "",
        Phone: u?.phone ?? "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "Users_List.xlsx");
    } catch (err) {
      console.error("Excel export failed:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FILTER ================= */
  const filteredUsers = users.filter((u) => {
    const name = (u?.full_name || "").toLowerCase();
    const email = (u?.email || "").toLowerCase();
    const searchText = search.toLowerCase();
    return name.includes(searchText) || email.includes(searchText);
  });

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
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Users</h2>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
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

      {/* CARD */}
      <div
        style={{
          height: "calc(100% - 90px)",
          borderRadius: "14px",
          border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
          display: "flex",
          flexDirection: "column",
          background: isDark ? "#020617" : "#ffffff",
        }}
      >
        {/* SEARCH */}
        <div
          style={{
            padding: "18px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{filteredUsers.length} users</span>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        {/* TABLE */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user?.id ?? index}>
                  <td>{index + 1}</td>
                  <td>{user?.id}</td>
                  <td>{user?.full_name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.phone}</td>

                  {/* ✅ FIXED ACTIONS UI */}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* EDIT BUTTON */}
                      <button
                        style={{
                          background: "#3b82f6",
                          border: "none",
                          padding: "8px",
                          borderRadius: "8px",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => setSelectedUser(user)}
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        style={{
                          background: "#ef4444",
                          border: "none",
                          padding: "8px",
                          borderRadius: "8px",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUser(user?.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#020617",
              padding: "20px",
              margin: "100px auto",
              width: "400px",
              color: "#fff",
              borderRadius: "10px",
            }}
          >
            <p>ID: {selectedUser?.id}</p>
            <p>Name: {selectedUser?.full_name}</p>
            <p>Email: {selectedUser?.email}</p>
            <p>Phone: {selectedUser?.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

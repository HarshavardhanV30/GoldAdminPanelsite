import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaSun,
  FaMoon,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import * as XLSX from "xlsx";

export default function GoldLoanRequests() {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [popupImage, setPopupImage] = useState(null);
  const [popupLoan, setPopupLoan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [searchText, setSearchText] = useState("");

  const API_BASE = "https://goldbackend-production-eaef.up.railway.app";

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/loan/all`);
      const data = res.data.data || res.data || [];
      setLoans(data);
      setFilteredLoans(data);
    } catch (err) {
      setError("Failed to load loan requests");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DASHBOARD FILTERS ================= */
  const showAll = () => setFilteredLoans(loans);

  const showToday = () => {
    const today = new Date().toLocaleDateString();
    setFilteredLoans(
      loans.filter(
        (l) => new Date(l.created_at).toLocaleDateString() === today
      )
    );
  };

  const showHighAmount = () =>
    setFilteredLoans(loans.filter((l) => Number(l.loanamount) > 100000));

  const showLowAmount = () =>
    setFilteredLoans(loans.filter((l) => Number(l.loanamount) <= 100000));

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan request?")) return;
    try {
      await axios.delete(`${API_BASE}/loan/${id}`);
      setLoans((prev) => prev.filter((l) => l.id !== id));
      setFilteredLoans((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed. Please try again.");
    }
  };

  /* ================= EXCEL ================= */
  const exportToExcel = () => {
    const data = filteredLoans.map((l) => ({
      ID: l.id,
      Name: l.fullname,
      Mobile: l.mobile,
      Address: l.address,
      GoldType: l.goldtype,
      Weight: l.goldweight,
      Amount: l.loanamount,
      Bank: l.bank,
      Date: new Date(l.created_at).toLocaleDateString(),
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Loans");
    XLSX.writeFile(wb, "GoldLoans.xlsx");
  };

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = loans.filter((l) =>
      l.fullname?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredLoans(filtered);
    setCurrentPage(1);
  }, [searchText, loans]);

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredLoans.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLoans.length / rowsPerPage) || 1;

  const theme = darkMode
    ? { bg: "#020617", card: "#0f172a", text: "#e5e7eb", border: "#334155" }
    : { bg: "#f8fafc", card: "#ffffff", text: "#020617", border: "#cbd5e1" };

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ ...styles.searchBox, borderColor: theme.border }}>
          <FaSearch />
          <input
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ ...styles.searchInput, color: theme.text }}
          />
        </div>

        <div style={styles.headerIcons}>
          <FaFileExcel title="Export Excel" onClick={exportToExcel} />
          {darkMode ? (
            <FaSun title="Light Mode" onClick={() => setDarkMode(false)} />
          ) : (
            <FaMoon title="Dark Mode" onClick={() => setDarkMode(true)} />
          )}
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, ...styles.blue }} onClick={showAll}>
          <h4>Total Requests</h4>
          <h2>{loans.length}</h2>
        </div>

        <div style={{ ...styles.card, ...styles.green }} onClick={showToday}>
          <h4>Today</h4>
          <h2>
            {
              loans.filter(
                (l) =>
                  new Date(l.created_at).toLocaleDateString() ===
                  new Date().toLocaleDateString()
              ).length
            }
          </h2>
        </div>

        <div style={{ ...styles.card, ...styles.red }} onClick={showHighAmount}>
          <h4>High Amount</h4>
          <h2>{loans.filter((l) => Number(l.loanamount) > 100000).length}</h2>
        </div>

        <div style={{ ...styles.card, ...styles.yellow }} onClick={showLowAmount}>
          <h4>Low Amount</h4>
          <h2>{loans.filter((l) => Number(l.loanamount) <= 100000).length}</h2>
        </div>
      </div>

      <h1 style={styles.title}>Gold Loan Requests</h1>

      {/* TABLE */}
      <div style={{ ...styles.tableCard, background: theme.card }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: 20 }}>Loading...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center", padding: 20 }}>{error}</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Images",
                      "Applicant",
                      "Mobile",
                      "Address",
                      "Gold",
                      "Weight",
                      "Amount",
                      "Bank",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th key={h} style={{ ...styles.th, borderColor: theme.border }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRows.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center", padding: 20 }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    currentRows.map((loan) => (
                      <tr key={loan.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={styles.td}>{loan.id}</td>
                        <td style={styles.td}>
                          <div style={styles.imageCell}>
                            {Array.isArray(loan.image) &&
                              loan.image.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt="loan"
                                  style={styles.thumb}
                                  onClick={() => setPopupImage(img)}
                                />
                              ))}
                          </div>
                        </td>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{loan.fullname}</td>
                        <td style={styles.td}>{loan.mobile}</td>
                        <td style={styles.td}>{loan.address}</td>
                        <td style={styles.td}>{loan.goldtype}</td>
                        <td style={styles.td}>{loan.goldweight} g</td>
                        <td style={styles.td}>₹{Number(loan.loanamount || 0).toLocaleString()}</td>
                        <td style={styles.td}>{loan.bank}</td>
                        <td style={styles.td}>
                          {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : ""}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <FaEye title="View Details" onClick={() => setPopupLoan(loan)} style={{ cursor: "pointer" }} />
                            <FaTrash
                              title="Delete"
                              onClick={() => handleDelete(loan.id)}
                              style={{ color: "#ef4444", cursor: "pointer" }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.pageBtn,
                    background: currentPage === i + 1 ? "#2563eb" : "transparent",
                    color: currentPage === i + 1 ? "#fff" : theme.text,
                  }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                style={styles.pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* IMAGE POPUP */}
      {popupImage && (
        <div style={styles.popupOverlay} onClick={() => setPopupImage(null)}>
          <img src={popupImage} alt="Large view" style={styles.popupImage} />
        </div>
      )}

      {/* VIEW DETAILS POPUP */}
      {popupLoan && (
        <div style={styles.popupOverlay} onClick={() => setPopupLoan(null)}>
          <div style={{ ...styles.popupCard, background: theme.card }} onClick={(e) => e.stopPropagation()}>
            <FaTimes style={styles.close} onClick={() => setPopupLoan(null)} />
            <h2>Loan Details</h2>
            <p><b>ID:</b> {popupLoan.id}</p>
            <p><b>Name:</b> {popupLoan.fullname}</p>
            <p><b>Mobile:</b> {popupLoan.mobile}</p>
            <p><b>Address:</b> {popupLoan.address}</p>
            <p><b>Gold Type:</b> {popupLoan.goldtype}</p>
            <p><b>Weight:</b> {popupLoan.goldweight} g</p>
            <p><b>Loan Amount:</b> ₹{popupLoan.loanamount}</p>
            <p><b>Bank:</b> {popupLoan.bank}</p>
            <p><b>Date:</b> {new Date(popupLoan.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { minHeight: "100vh", padding: 20, fontFamily: "Inter, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid",
    padding: "8px 12px",
    borderRadius: 10,
    width: "300px",
  },
  searchInput: { border: "none", outline: "none", background: "transparent", width: "100%" },
  headerIcons: { display: "flex", gap: 15, cursor: "pointer", fontSize: 18, alignItems: "center" },
  title: { fontSize: 26, marginBottom: 20 },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 16,
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    cursor: "pointer",
    color: "#fff",
    boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
  },
  blue: { background: "linear-gradient(135deg,#2563eb,#1e40af)" },
  green: { background: "linear-gradient(135deg,#22c55e,#15803d)" },
  red: { background: "linear-gradient(135deg,#ef4444,#991b1b)" },
  yellow: {
    background: "linear-gradient(135deg,#facc15,#ca8a04)",
    color: "#020617",
  },

  tableCard: { borderRadius: 16, padding: 20, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  table: { width: "100%", minWidth: 1300, borderCollapse: "collapse" },
  th: { padding: 12, borderBottom: "1px solid", textAlign: "left" },
  td: { padding: 12, fontSize: 14 },
  imageCell: { display: "flex", gap: 6 },
  thumb: { width: 42, height: 42, borderRadius: 6, cursor: "pointer", objectFit: "cover" },
  actions: { display: "flex", gap: 12, alignItems: "center" },

  pagination: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    gap: 8,
  },
  pageBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #334155",
    cursor: "pointer",
    background: "transparent",
  },

  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popupImage: { maxHeight: "80vh", maxWidth: "90vw", borderRadius: 10 },
  popupCard: { padding: 25, borderRadius: 12, width: 450, position: "relative" },
  close: { position: "absolute", top: 15, right: 15, cursor: "pointer", fontSize: 18 },
};

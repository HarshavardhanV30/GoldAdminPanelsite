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

  const API_BASE = "https://rendergoldapp-1.onrender.com";

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/loan/all`);
      const data = res.data.data || [];
      setLoans(data);
      setFilteredLoans(data);
    } catch {
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
    if (!window.confirm("Delete this loan request?")) return;
    try {
      await axios.delete(`${API_BASE}/loan/${id}`);
      setLoans((prev) => prev.filter((l) => l.id !== id));
      setFilteredLoans((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Delete failed");
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
      l.fullname.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredLoans(filtered);
    setCurrentPage(1);
  }, [searchText, loans]);

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredLoans.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLoans.length / rowsPerPage);

  const theme = darkMode
    ? { bg: "#020617", card: "#020617", text: "#e5e7eb" }
    : { bg: "#f8fafc", card: "#ffffff", text: "#020617" };

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.searchBox}>
          <FaSearch />
          <input
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ ...styles.searchInput, color: theme.text }}
          />
        </div>

        <div style={styles.headerIcons}>
          <FaFileExcel onClick={exportToExcel} />
          {darkMode ? (
            <FaSun onClick={() => setDarkMode(false)} />
          ) : (
            <FaMoon onClick={() => setDarkMode(true)} />
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

        <div
          style={{ ...styles.card, ...styles.yellow }}
          onClick={showLowAmount}
        >
          <h4>Low Amount</h4>
          <h2>{loans.filter((l) => Number(l.loanamount) <= 100000).length}</h2>
        </div>
      </div>

      <h1 style={styles.title}>Gold Loan Requests</h1>

      {/* TABLE */}
      <div style={{ ...styles.tableCard, background: theme.card }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
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
                      <th key={h} style={styles.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.id}</td>
                      <td>
                        <div style={styles.imageCell}>
                          {loan.image.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              style={styles.thumb}
                              onClick={() => setPopupImage(img)}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{loan.fullname}</td>
                      <td>{loan.mobile}</td>
                      <td>{loan.address}</td>
                      <td>{loan.goldtype}</td>
                      <td>{loan.goldweight} g</td>
                      <td>₹{Number(loan.loanamount).toLocaleString()}</td>
                      <td>{loan.bank}</td>
                      <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={styles.actions}>
                          <FaEye onClick={() => setPopupLoan(loan)} />
                          <FaTrash
                            onClick={() => handleDelete(loan.id)}
                            style={{ color: "#ef4444" }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div style={styles.pagination}>
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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
          <img src={popupImage} alt="" style={styles.popupImage} />
        </div>
      )}

      {/* VIEW DETAILS POPUP */}
      {popupLoan && (
        <div style={styles.popupOverlay} onClick={() => setPopupLoan(null)}>
          <div style={{ ...styles.popupCard, background: theme.card }}>
            <FaTimes style={styles.close} onClick={() => setPopupLoan(null)} />
            <h2>Loan Details</h2>
            <p><b>Name:</b> {popupLoan.fullname}</p>
            <p><b>Mobile:</b> {popupLoan.mobile}</p>
            <p><b>Address:</b> {popupLoan.address}</p>
            <p><b>Gold Type:</b> {popupLoan.goldtype}</p>
            <p><b>Weight:</b> {popupLoan.goldweight} g</p>
            <p><b>Loan Amount:</b> ₹{popupLoan.loanamount}</p>
            <p><b>Bank:</b> {popupLoan.bank}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { minHeight: "100vh", padding: 20, fontFamily: "Inter, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  searchBox: {
    display: "flex",
    gap: 8,
    border: "1px solid #334155",
    padding: "8px 12px",
    borderRadius: 10,
  },
  searchInput: { border: "none", outline: "none", background: "transparent" },
  headerIcons: { display: "flex", gap: 15, cursor: "pointer" },
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

  tableCard: { borderRadius: 16, padding: 20 },
  table: { width: "100%", minWidth: 1300, borderCollapse: "collapse" },
  th: { padding: 12, borderBottom: "1px solid #334155" },
  imageCell: { display: "flex", gap: 6 },
  thumb: { width: 42, height: 42, borderRadius: 6, cursor: "pointer" },
  actions: { display: "flex", gap: 12 },

  pagination: {
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
    gap: 10,
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
  popupImage: { maxHeight: "80vh", borderRadius: 10 },
  popupCard: { padding: 20, borderRadius: 12, width: 600 },
  close: { position: "absolute", top: 12, right: 12, cursor: "pointer" },
};

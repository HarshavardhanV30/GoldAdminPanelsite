import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaMoon, FaSun, FaFileExcel, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";

const GoldLoanTable = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [viewLoan, setViewLoan] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [theme, setTheme] = useState("dark");

  const API_URL = "https://rendergoldapp-1.onrender.com/loan/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#020617" : "#ffffff",
    text: isDark ? "#e5e7eb" : "#0f172a",
    header: isDark ? "#020617" : "#1e293b",
    border: "#334155",
    hover: isDark ? "#1e293b" : "#e2e8f0",
    accent: "#facc15",
    danger: "#ef4444",
    muted: "#94a3b8",
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFilteredLoans(
      loans.filter(
        (l) =>
          l.fullname?.toLowerCase().includes(s) ||
          l.mobile?.includes(s) ||
          l.bank?.toLowerCase().includes(s)
      )
    );
  }, [search, loans]);

  const fetchLoans = async () => {
    const res = await axios.get(API_URL);
    const data = res.data?.data || [];
    setLoans(data);
    setFilteredLoans(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan request?")) return;
    await axios.delete(`https://rendergoldapp-1.onrender.com/loan/${id}`);
    fetchLoans();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLoans);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GoldLoans");
    XLSX.writeFile(wb, "GoldLoans.xlsx");
  };

  const parseImages = (img) => {
    try {
      return Array.isArray(img) ? img : JSON.parse(img);
    } catch {
      return [];
    }
  };

  const getImage = (img) =>
    img?.startsWith("http") ? img : `${IMAGE_BASE}${img}`;

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: 24, color: colors.text }}>
      {/* ================= HEADER ================= */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h3 className="fw-bold mb-0">Doorstep Gold Loan Requests</h3>

        <div className="d-flex gap-2">
          <button className="btn rounded-circle shadow-sm" style={{ background: colors.accent }} onClick={exportExcel}>
            <FaFileExcel />
          </button>
          <button
            className="btn rounded-circle shadow-sm"
            style={{ background: isDark ? "#0f172a" : "#e2e8f0", color: colors.text }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-4">
        <div
          className="d-flex align-items-center px-3 py-2 rounded-3"
          style={{ background: colors.card, border: `1px solid ${colors.border}` }}
        >
          <FaSearch color={colors.muted} />
          <input
            type="text"
            placeholder="Search by Name, Mobile or Bank"
            className="form-control border-0 bg-transparent text-reset ms-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="table-responsive d-none d-md-block rounded-4 shadow-lg overflow-hidden">
        <table className="table table-borderless align-middle mb-0">
          <thead style={{ background: colors.header, color: "#fff" }}>
            <tr>
              <th className="ps-4">Image</th>
              <th>Bank</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Gold</th>
              <th>Loan</th>
              <th className="text-center pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <tr
                key={loan.id}
                style={{ borderBottom: `1px solid ${colors.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="ps-4">
                  {parseImages(loan.image).slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={getImage(img)}
                      onClick={() => setEnlargedImage(getImage(img))}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `2px solid ${colors.accent}`,
                      }}
                    />
                  ))}
                </td>
                <td>{loan.bank}</td>
                <td className="fw-semibold">{loan.fullname}</td>
                <td>{loan.mobile}</td>
                <td>{loan.goldweight} gm</td>
                <td className="fw-semibold">₹{loan.loanamount}</td>
                <td className="text-center pe-4">
                  <FaEye
                    color={colors.accent}
                    style={{ cursor: "pointer", marginRight: 14 }}
                    onClick={() => setViewLoan(loan)}
                  />
                  <FaTrash
                    color={colors.danger}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(loan.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="d-md-none">
        {filteredLoans.map((loan) => (
          <div
            key={loan.id}
            className="mb-3 p-3 rounded-4 shadow-sm"
            style={{ background: colors.card, border: `1px solid ${colors.border}` }}
          >
            <div className="d-flex gap-3">
              {parseImages(loan.image).slice(0, 1).map((img, i) => (
                <img
                  key={i}
                  src={getImage(img)}
                  onClick={() => setEnlargedImage(getImage(img))}
                  style={{ width: 80, height: 80, borderRadius: 12 }}
                />
              ))}
              <div>
                <h6 className="fw-bold mb-1">{loan.fullname}</h6>
                <p className="mb-1 text-muted">{loan.bank}</p>
                <p className="mb-1">₹{loan.loanamount}</p>
                <div className="d-flex gap-3 mt-2">
                  <FaEye color={colors.accent} onClick={() => setViewLoan(loan)} />
                  <FaTrash color={colors.danger} onClick={() => handleDelete(loan.id)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= IMAGE POPUP ================= */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img src={enlargedImage} style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 14 }} />
        </div>
      )}
    </div>
  );
};

export default GoldLoanTable;

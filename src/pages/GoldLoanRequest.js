import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaMoon, FaSun, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const GoldLoanTable = () => {
  const [loans, setLoans] = useState([]);
  const [viewLoan, setViewLoan] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [theme, setTheme] = useState("dark");

  const API_URL = "https://rendergoldapp-1.onrender.com/loan/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const res = await axios.get(API_URL);
    setLoans(res.data?.data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan request?")) return;
    await axios.delete(`https://rendergoldapp-1.onrender.com/loan/${id}`);
    fetchLoans();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(loans);
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
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: 24, color: colors.text }}>
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Doorstep Gold Loan Requests</h3>

        <div className="d-flex gap-2">
          <button
            className="btn d-flex align-items-center justify-content-center shadow-sm"
            style={{
              background: colors.accent,
              color: "#000",
              width: 42,
              height: 42,
              borderRadius: "50%",
            }}
            title="Export Excel"
            onClick={exportExcel}
          >
            <FaFileExcel />
          </button>

          <button
            className="btn d-flex align-items-center justify-content-center shadow-sm"
            style={{
              background: isDark ? "#0f172a" : "#e2e8f0",
              color: colors.text,
              width: 42,
              height: 42,
              borderRadius: "50%",
            }}
            title="Toggle Theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-responsive rounded-4 shadow-lg overflow-hidden">
        <table className="table table-borderless align-middle mb-0">
          <thead style={{ background: colors.header, color: "#fff" }}>
            <tr>
              <th>Image</th>
              <th>Bank</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Gold</th>
              <th>Loan</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr
                key={loan.id}
                style={{ borderBottom: `1px solid ${colors.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td>
                  {parseImages(loan.image).slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={getImage(img)}
                      onClick={() => setEnlargedImage(getImage(img))}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 12,
                        objectFit: "cover",
                        cursor: "pointer",
                        border: `2px solid ${colors.accent}`,
                        transition: "transform 0.2s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ))}
                </td>
                <td>{loan.bank}</td>
                <td className="fw-semibold">{loan.fullname}</td>
                <td>{loan.mobile}</td>
                <td>{loan.goldweight} gm</td>
                <td className="fw-semibold">₹{loan.loanamount}</td>
                <td className="text-center">
                  <FaEye
                    size={18}
                    title="View Details"
                    style={{ cursor: "pointer", marginRight: 14, color: colors.accent }}
                    onClick={() => setViewLoan(loan)}
                  />
                  <FaTrash
                    size={16}
                    title="Delete"
                    style={{ cursor: "pointer", color: colors.danger }}
                    onClick={() => handleDelete(loan.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewLoan && (
        <div
          onClick={() => setViewLoan(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.card,
              padding: 24,
              borderRadius: 16,
              width: 720,
              color: colors.text,
            }}
          >
            <h4 className="fw-bold mb-3">{viewLoan.fullname}</h4>

            <div className="d-flex gap-3 mb-3">
              {parseImages(viewLoan.image).map((img, i) => (
                <img
                  key={i}
                  src={getImage(img)}
                  style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover" }}
                />
              ))}
            </div>

            <p><strong>Bank:</strong> {viewLoan.bank}</p>
            <p><strong>Mobile:</strong> {viewLoan.mobile}</p>
            <p><strong>Address:</strong> {viewLoan.address}</p>
            <p><strong>Gold:</strong> {viewLoan.goldweight} gm ({viewLoan.goldtype})</p>
            <p><strong>ID Proof:</strong> {viewLoan.idproof}</p>
            <p><strong>Loan Amount:</strong> ₹{viewLoan.loanamount}</p>
            <p><strong>Remarks:</strong> {viewLoan.remarks}</p>

            <button className="btn btn-secondary mt-3" onClick={() => setViewLoan(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= IMAGE POPUP ================= */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={enlargedImage}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 14,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GoldLoanTable;

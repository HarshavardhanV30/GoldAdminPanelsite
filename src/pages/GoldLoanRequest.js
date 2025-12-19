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
    if (window.confirm("Delete this loan request?")) {
      await axios.delete(`https://rendergoldapp-1.onrender.com/loan/${id}`);
      fetchLoans();
    }
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

  const colors = {
    bg: theme === "dark" ? "#020617" : "#f8fafc",
    card: theme === "dark" ? "#020617" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#0f172a",
    header: theme === "dark" ? "#020617" : "#1e293b",
    border: "#334155",
    hover: theme === "dark" ? "#1e293b" : "#e2e8f0",
    accent: "#facc15",
    danger: "#ef4444",
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: 24, color: colors.text }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Doorstep Gold Loan Requests</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-warning" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          <button className="btn btn-success" onClick={exportExcel}>
            <FaFileExcel />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive rounded-4 overflow-hidden shadow-lg">
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
                style={{ borderBottom: `1px solid ${colors.border}`, cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td>
                  {parseImages(loan.image).slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={getImage(img)}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 10,
                        objectFit: "cover",
                        border: `1px solid ${colors.border}`,
                      }}
                      onClick={() => setEnlargedImage(getImage(img))}
                    />
                  ))}
                </td>
                <td>{loan.bank}</td>
                <td>{loan.fullname}</td>
                <td>{loan.mobile}</td>
                <td>{loan.goldweight} gm</td>
                <td>₹{loan.loanamount}</td>
                <td className="text-center">
                  <FaEye
                    size={18}
                    color={colors.accent}
                    style={{ marginRight: 14 }}
                    onClick={() => setViewLoan(loan)}
                  />
                  <FaTrash
                    size={16}
                    color={colors.danger}
                    onClick={() => handleDelete(loan.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
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
              borderRadius: 14,
              width: 700,
              color: colors.text,
            }}
          >
            <h4 className="fw-bold mb-3">{viewLoan.fullname}</h4>
            <div className="d-flex gap-2 mb-3">
              {parseImages(viewLoan.image).map((img, i) => (
                <img
                  key={i}
                  src={getImage(img)}
                  style={{ width: 140, height: 140, borderRadius: 10, objectFit: "cover" }}
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
            <button className="btn btn-secondary mt-3" onClick={() => setViewLoan(null)}>Close</button>
          </div>
        </div>
      )}

      {/* IMAGE ZOOM */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img src={enlargedImage} style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
};

export default GoldLoanTable;

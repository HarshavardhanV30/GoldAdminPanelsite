import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaMoon, FaSun, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const GoldLoanTable = () => {
  const [loans, setLoans] = useState([]);
  const [activeLoan, setActiveLoan] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [theme, setTheme] = useState("light");

  const API_URL = "https://rendergoldapp-1.onrender.com/loan/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

  // Detect system theme
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  const parseImages = (images) => {
    try {
      if (Array.isArray(images)) return images;
      if (typeof images === "string") return JSON.parse(images);
      return [];
    } catch {
      return [];
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/")) return `${IMAGE_BASE}${imgPath}`;
    return `${IMAGE_BASE}/uploads/${imgPath}`;
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data?.data || [];
      setLoans(data);
    } catch (error) {
      console.error("Error fetching gold loan requests:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this loan request?")) {
      try {
        await axios.delete(`https://rendergoldapp-1.onrender.com/loan/${id}`);
        fetchLoans();
        setActiveLoan(null);
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(loans.map(loan => ({
      "Bank Name": loan.bank,
      "Full Name": loan.fullname,
      "Mobile Number": loan.mobile,
      "Address": loan.address,
      "Gold Weight": loan.goldweight,
      "Gold Type": loan.goldtype,
      "ID Proof": loan.idproof,
      "Loan Amount": loan.loanamount,
      "Remarks": loan.remarks
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gold Loans");
    XLSX.writeFile(wb, "GoldLoans.xlsx");
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className={`${theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"} p-4 min-vh-100`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary fw-bold">Doorstep Gold Loan Requests</h3>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-sm`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <><FaSun /> Switch to Light Mode</> : <><FaMoon /> Switch to Dark Mode</>}
          </button>
          <button className="btn btn-success btn-sm" onClick={exportToExcel}>
            <FaFileExcel /> Export to Excel
          </button>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className={`table table-bordered table-hover align-middle mb-0 ${theme === "dark" ? "table-dark" : ""}`}>
          <thead className={theme === "dark" ? "table-secondary" : "table-dark"}>
            <tr>
              <th>Images</th>
              <th>Bank Name</th>
              <th>Full Name</th>
              <th>Mobile Number</th>
              <th>Address</th>
              <th>Gold Weight (gm)</th>
              <th>Gold Type</th>
              <th>ID Proof</th>
              <th>Loan Amount</th>
              <th>Remarks</th>
              <th style={{ width: "130px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? loans.map((loan) => (
              <tr key={loan.id} className={activeLoan?.id === loan.id ? "table-primary" : ""} style={{ cursor: "pointer" }}>
                <td>
                  {parseImages(loan.image).slice(0, 2).map((imgUrl, i) => (
                    <img
                      key={i}
                      src={getImageUrl(imgUrl)}
                      alt={`Gold item ${i + 1}`}
                      width="70"
                      height="70"
                      style={{
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginRight: "6px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnlargedImage(getImageUrl(imgUrl));
                      }}
                    />
                  ))}
                </td>
                <td>{loan.bank}</td>
                <td>{loan.fullname}</td>
                <td>{loan.mobile}</td>
                <td>{loan.address}</td>
                <td>{loan.goldweight}</td>
                <td>{loan.goldtype}</td>
                <td>{loan.idproof}</td>
                <td>₹{loan.loanamount}</td>
                <td>{loan.remarks?.slice(0, 30)}...</td>
                <td>
                  <div className="d-flex gap-1 justify-content-center">
                    <button className="btn btn-sm btn-primary" onClick={() => setActiveLoan(loan)} title="View Details"><FaEye /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(loan.id)} title="Delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="11" className="text-center">No loan requests available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Loan Detail Card */}
      {activeLoan && (
        <div className="card mt-4 shadow-lg border-0">
          <div className="card-header bg-primary text-white fw-bold">Loan Request Details</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-5 mb-3 mb-md-0">
                <div style={{ display: "flex", overflowX: "auto", gap: "10px", paddingBottom: "6px", scrollSnapType: "x mandatory" }}>
                  {parseImages(activeLoan.image).map((imgUrl, i) => (
                    <div key={i} style={{ flex: "0 0 auto", scrollSnapAlign: "start", cursor: "pointer" }} onClick={() => setEnlargedImage(getImageUrl(imgUrl))}>
                      <img
                        src={getImageUrl(imgUrl)}
                        alt={`Gold item ${i + 1}`}
                        style={{ height: "250px", width: "auto", borderRadius: "8px", border: "1px solid #ccc", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-7">
                <h5 className="fw-bold text-primary mb-3">{activeLoan.fullname}</h5>
                <p><strong>Bank Name:</strong> {activeLoan.bank}</p>
                <p><strong>Mobile Number:</strong> {activeLoan.mobile}</p>
                <p><strong>Address:</strong> {activeLoan.address}</p>
                <p><strong>Gold Weight:</strong> {activeLoan.goldweight} gm</p>
                <p><strong>Gold Type:</strong> {activeLoan.goldtype}</p>
                <p><strong>ID Proof:</strong> {activeLoan.idproof}</p>
                <p><strong>Loan Amount:</strong> ₹{activeLoan.loanamount}</p>
                <p><strong>Remarks:</strong> {activeLoan.remarks}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <img src={enlargedImage} alt="Enlarged" style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "8px" }} />
        </div>
      )}
    </div>
  );
};

export default GoldLoanTable;

import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  FaEye,
  FaTrash,
  FaMoon,
  FaSun,
  FaFileExcel,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  const API_URL = "https://rendergoldapp-1.onrender.com/seller/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

  /* ---------------- HELPERS ---------------- */
  const parseImages = (images) => {
    try {
      return Array.isArray(images) ? images : JSON.parse(images);
    } catch {
      return [];
    }
  };

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `${IMAGE_BASE}${img}`;

  /* ---------------- API ---------------- */
  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data || []);
    setFiltered(res.data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- FILTER & SEARCH ---------------- */
  useEffect(() => {
    let data = [...products];

    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    data = data.filter(
      (p) => (+p.price || 0) >= min && (+p.price || 0) <= max
    );

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s) ||
          p.full_name?.toLowerCase().includes(s) ||
          p.mobilenumber?.includes(s)
      );
    }

    setFiltered(data);
  }, [search, minPrice, maxPrice, products]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`https://rendergoldapp-1.onrender.com/seller/${id}`);
    fetchProducts();
  };

  /* ---------------- EXPORT ---------------- */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seller Products");
    XLSX.writeFile(wb, "Seller_Products.xlsx");
  };

  /* ---------------- THEME ---------------- */
  const colors = {
    bg: darkMode ? "#020617" : "#f8fafc",
    card: darkMode ? "#020617" : "#ffffff",
    header: darkMode ? "#020617" : "#1e293b",
    hover: darkMode ? "#1e293b" : "#f1f5f9",
    text: darkMode ? "#e5e7eb" : "#0f172a",
    border: "#334155",
    accent: "#facc15",
    danger: "#ef4444",
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: 24, color: colors.text }}>
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Seller Gold Products</h3>

        <button
          className="btn rounded-circle shadow"
          style={{ background: colors.accent }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="card rounded-4 shadow mb-4" style={{ background: colors.card }}>
        <div className="card-body d-flex flex-wrap gap-3 align-items-center">
          {/* SEARCH */}
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text"><FaSearch /></span>
            <input
              className="form-control"
              placeholder="Search name / mobile / category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* MIN */}
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            style={{ maxWidth: 140 }}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          {/* MAX */}
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            style={{ maxWidth: 140 }}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          {/* EXPORT */}
          <button
            className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4"
            onClick={exportExcel}
          >
            <FaFileExcel /> Export
          </button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="table-responsive d-none d-md-block shadow rounded-4 overflow-hidden">
        <table className="table table-borderless align-middle mb-0">
          <thead style={{ background: colors.header, color: "#fff" }}>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Purity</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Mobile</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                style={{ borderBottom: `1px solid ${colors.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td>
                  {parseImages(p.images).slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={getImageUrl(img)}
                      onClick={() => setImagePreview(getImageUrl(img))}
                      style={{
                        width: 65,
                        height: 65,
                        borderRadius: 10,
                        cursor: "pointer",
                        objectFit: "cover",
                        border: "2px solid #eab308",
                      }}
                    />
                  ))}
                </td>
                <td className="fw-semibold">{p.name}</td>
                <td>{p.category}</td>
                <td>{p.weight} gm</td>
                <td>{p.purity}</td>
                <td className="fw-bold">₹{p.price}</td>
                <td>{p.full_name}</td>
                <td>{p.mobilenumber}</td>
                <td className="text-center">
                  <FaEye
                    className="me-3"
                    style={{ cursor: "pointer", color: colors.accent }}
                    onClick={() => setViewProduct(p)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer", color: colors.danger }}
                    onClick={() => handleDelete(p.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="d-md-none">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="card mb-3 shadow rounded-4"
            style={{ background: colors.card }}
          >
            <div className="card-body">
              <div className="d-flex gap-3">
                <img
                  src={getImageUrl(parseImages(p.images)[0])}
                  style={{ width: 90, height: 90, borderRadius: 12 }}
                />
                <div>
                  <h6 className="fw-bold">{p.name}</h6>
                  <p className="mb-1">₹{p.price}</p>
                  <p className="mb-1">{p.weight} gm | {p.purity}</p>
                  <p className="mb-1">{p.mobilenumber}</p>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-3">
                <FaEye onClick={() => setViewProduct(p)} />
                <FaTrash
                  style={{ color: colors.danger }}
                  onClick={() => handleDelete(p.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= IMAGE POPUP ================= */}
      {imagePreview && (
        <div
          onClick={() => setImagePreview(null)}
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
          <img src={imagePreview} style={{ maxWidth: "90%", borderRadius: 14 }} />
        </div>
      )}

      {/* ================= VIEW PRODUCT ================= */}
      {viewProduct && (
        <div
          onClick={() => setViewProduct(null)}
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
            className="shadow-lg"
            style={{
              background: colors.card,
              padding: 24,
              borderRadius: 16,
              width: 720,
            }}
          >
            <h4 className="fw-bold mb-3">{viewProduct.name}</h4>
            <p><b>Category:</b> {viewProduct.category}</p>
            <p><b>Price:</b> ₹{viewProduct.price}</p>
            <button className="btn btn-secondary mt-3" onClick={() => setViewProduct(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductTable;

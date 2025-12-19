import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaEye, FaTrash, FaMoon, FaSun, FaFileExcel, FaFilter } from "react-icons/fa";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const API_URL = "https://rendergoldapp-1.onrender.com/seller/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

  /* ---------------- HELPERS ---------------- */
  const parseImages = (images) => {
    try {
      if (Array.isArray(images)) return images;
      if (typeof images === "string") return JSON.parse(images);
      return [];
    } catch {
      return [];
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${IMAGE_BASE}${img}`;
    return `${IMAGE_BASE}/uploads/${img}`;
  };

  /* ---------------- API ---------------- */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data || []);
      setFilteredProducts(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await axios.delete(`https://rendergoldapp-1.onrender.com/seller/${id}`);
    fetchProducts();
  };

  /* ---------------- FILTER ---------------- */
  const handleFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    setFilteredProducts(
      products.filter((p) => (+p.price || 0) >= min && (+p.price || 0) <= max)
    );
  };

  /* ---------------- EXPORT ---------------- */
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seller Products");
    XLSX.writeFile(wb, "Seller_Products.xlsx");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- THEME ---------------- */
  const colors = {
    bg: darkMode ? "#020617" : "#f8fafc",
    card: darkMode ? "#020617" : "#ffffff",
    header: darkMode ? "#020617" : "#1e293b",
    hover: darkMode ? "#1e293b" : "#f1f5f9",
    text: darkMode ? "#e5e7eb" : "#0f172a",
    border: "#334155",
    accent: "#facc15",
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: 24, color: colors.text }}>
      {/* ---------------- HEADER ---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Seller Gold Products</h3>
        <button
          className="btn btn-warning rounded-circle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* ---------------- FILTER CARD ---------------- */}
      <div className="card shadow-sm rounded-4 mb-4" style={{ background: colors.card }}>
        <div className="card-body d-flex flex-wrap gap-3 align-items-center">
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: 160 }}
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: 160 }}
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleFilter}>
            <FaFilter /> Filter
          </button>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleExport}>
            <FaFileExcel /> Export
          </button>
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="table-responsive shadow-lg rounded-4 overflow-hidden">
        <table className="table table-borderless align-middle">
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
            {filteredProducts.map((p) => (
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
                        width: 70,
                        height: 70,
                        borderRadius: 10,
                        cursor: "pointer",
                        objectFit: "cover",
                        border: "2px solid #eab308",
                      }}
                    />
                  ))}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.weight} gm</td>
                <td>{p.purity}</td>
                <td>₹{p.price}</td>
                <td>{p.full_name || "N/A"}</td>
                <td>{p.mobilenumber || "N/A"}</td>
                <td className="text-center">
                  <FaEye
                    size={18}
                    style={{ cursor: "pointer", marginRight: 14, color: colors.accent }}
                    onClick={() => setViewProduct(p)}
                  />
                  <FaTrash
                    size={16}
                    style={{ cursor: "pointer", color: "#ef4444" }}
                    onClick={() => handleDelete(p.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- IMAGE POPUP ---------------- */}
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
          <img
            src={imagePreview}
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 14 }}
          />
        </div>
      )}

      {/* ---------------- VIEW PRODUCT ---------------- */}
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
            style={{
              background: colors.card,
              padding: 24,
              borderRadius: 16,
              width: 720,
              color: colors.text,
            }}
          >
            <h4 className="fw-bold mb-3">{viewProduct.name}</h4>
            <div className="d-flex gap-3 mb-3">
              {parseImages(viewProduct.images).map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover" }}
                />
              ))}
            </div>
            <p><strong>Category:</strong> {viewProduct.category}</p>
            <p><strong>Weight:</strong> {viewProduct.weight} gm</p>
            <p><strong>Purity:</strong> {viewProduct.purity}</p>
            <p><strong>Condition:</strong> {viewProduct.condition}</p>
            <p><strong>Price:</strong> ₹{viewProduct.price}</p>
            <p><strong>Description:</strong> {viewProduct.description}</p>

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

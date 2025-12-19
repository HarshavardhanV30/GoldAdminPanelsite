import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaEye, FaTrash, FaMoon, FaSun } from "react-icons/fa";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const API_URL = "https://rendergoldapp-1.onrender.com/seller/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`https://rendergoldapp-1.onrender.com/seller/${id}`);
      fetchProducts();
    }
  };

  const handleFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    setFilteredProducts(products.filter(p => (+p.price || 0) >= min && (+p.price || 0) <= max));
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Seller_Products.xlsx");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const colors = {
    bg: darkMode ? "#020617" : "#f8fafc",
    card: darkMode ? "#020617" : "#ffffff",
    header: darkMode ? "#020617" : "#1e293b",
    rowHover: darkMode ? "#1e293b" : "#f1f5f9",
    text: darkMode ? "#e5e7eb" : "#0f172a",
    border: "#334155",
    accent: "#facc15",
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: "24px", color: colors.text }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Seller Gold Products</h3>
        <button className="btn btn-warning" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input className="form-control" placeholder="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
        <button className="btn btn-success" onClick={handleExport}>Export</button>
      </div>

      {/* Table */}
      <div className="table-responsive rounded-4 overflow-hidden shadow-lg">
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
            {filteredProducts.map(product => (
              <tr
                key={product.id}
                style={{ borderBottom: `1px solid ${colors.border}` }}
                onMouseOver={(e) => e.currentTarget.style.background = colors.rowHover}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td>
                  {parseImages(product.images).slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={getImageUrl(img)}
                      style={{ width: "70px", height: "70px", borderRadius: "10px", objectFit: "cover" }}
                    />
                  ))}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.weight} gm</td>
                <td>{product.purity}</td>
                <td>₹{product.price}</td>
                <td>{product.full_name || "N/A"}</td>
                <td>{product.mobilenumber || "N/A"}</td>
                <td className="text-center">
                  <FaEye
                    size={18}
                    color={colors.accent}
                    style={{ cursor: "pointer", marginRight: "12px" }}
                    onClick={() => setViewProduct(product)}
                  />
                  <FaTrash
                    size={16}
                    color="#ef4444"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP */}
      {viewProduct && (
        <div
          onClick={() => setViewProduct(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.card,
              padding: "24px",
              borderRadius: "14px",
              width: "700px",
              color: colors.text,
            }}
          >
            <h4 className="fw-bold mb-3">{viewProduct.name}</h4>
            <div className="d-flex gap-3 mb-3">
              {parseImages(viewProduct.images).map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  style={{ width: "140px", height: "140px", borderRadius: "10px", objectFit: "cover" }}
                />
              ))}
            </div>
            <p><strong>Category:</strong> {viewProduct.category}</p>
            <p><strong>Weight:</strong> {viewProduct.weight} gm</p>
            <p><strong>Purity:</strong> {viewProduct.purity}</p>
            <p><strong>Condition:</strong> {viewProduct.condition}</p>
            <p><strong>Price:</strong> ₹{viewProduct.price}</p>
            <p><strong>Description:</strong> {viewProduct.description}</p>
            <button className="btn btn-secondary mt-3" onClick={() => setViewProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductTable;

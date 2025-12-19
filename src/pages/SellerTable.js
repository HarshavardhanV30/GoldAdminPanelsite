import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://rendergoldapp-1.onrender.com/seller/${id}`);
        alert("Product deleted successfully (if supported by API)");
        fetchProducts();
        setActiveProduct(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleRowClick = (product) => {
    setActiveProduct(product.id === activeProduct?.id ? null : product);
  };

  const handleFilter = () => {
    let min = parseFloat(minPrice) || 0;
    let max = parseFloat(maxPrice) || Infinity;
    const filtered = products.filter((p) => {
      const price = parseFloat(p.price) || 0;
      return price >= min && price <= max;
    });
    setFilteredProducts(filtered);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProducts.map((p) => ({
        Name: p.name,
        Category: p.category,
        Weight: p.weight,
        Purity: p.purity,
        Condition: p.condition,
        Price: p.price,
        Description: p.description,
        Seller: p.full_name || "Not Provided",
        Mobile: p.mobilenumber || "Not Provided",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "Seller_Products.xlsx");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const themeStyles = {
    background: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#020617" : "#ffffff",
    text: darkMode ? "#e5e7eb" : "#1e293b",
    tableHeader: darkMode ? "#020617" : "#1e293b",
    border: darkMode ? "#334155" : "#e2e8f0",
  };

  return (
    <div
      className="container py-4"
      style={{ background: themeStyles.background, minHeight: "100vh", color: themeStyles.text }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Seller Gold Products</h4>
        <button
          className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input type="number" className="form-control" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" className="form-control" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button className="btn btn-primary" onClick={handleFilter}>Apply</button>
        <button className="btn btn-success" onClick={handleExport}>Export</button>
      </div>

      <div className="table-responsive">
        <table
          className="table align-middle"
          style={{
            background: themeStyles.card,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: themeStyles.tableHeader, color: "#fff" }}>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Purity</th>
              <th>Condition</th>
              <th>Price</th>
              <th>Description</th>
              <th>Seller</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product)}
                style={{
                  cursor: "pointer",
                  background: activeProduct?.id === product.id ? "#2563eb20" : "transparent",
                }}
              >
                <td>
                  {parseImages(product.images).slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={getImageUrl(img)}
                      width="70"
                      height="70"
                      style={{ objectFit: "cover", borderRadius: "8px", marginRight: "6px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnlargedImage(getImageUrl(img));
                      }}
                    />
                  ))}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.weight} gm</td>
                <td>{product.purity}</td>
                <td>{product.condition}</td>
                <td>₹{product.price}</td>
                <td>{product.description?.slice(0, 25)}...</td>
                <td>{product.full_name || "N/A"}</td>
                <td>{product.mobilenumber || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          <img src={enlargedImage} style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default SellerProductTable;

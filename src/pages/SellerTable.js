import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaSearch, FaEye, FaSun, FaMoon, FaTrash } from "react-icons/fa";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const API_URL = "https://rendergoldapp-1.onrender.com/seller/all";

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await axios.delete(`https://rendergoldapp-1.onrender.com/seller/${id}`);
    fetchProducts();
  };

  /* ================= EXPORT ================= */
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Seller_Products.xlsx");
  };

  /* ================= IMAGE PARSER ================= */
  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  /* ================= CARD FILTERS ================= */
  const showAll = () => setFilteredProducts(products);

  const showToday = () =>
    setFilteredProducts(
      products.filter(
        (p) =>
          new Date(p.created_at).toLocaleDateString() ===
          new Date().toLocaleDateString()
      )
    );

  const showHigh = () =>
    setFilteredProducts(products.filter((p) => Number(p.price) > 100000));

  const showLow = () =>
    setFilteredProducts(products.filter((p) => Number(p.price) <= 100000));

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode ? "#020617" : "#f8f9fa",
        color: darkMode ? "#e5e7eb" : "#111",
      }}
    >
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.searchBox}>
          <FaSearch />
          <input
            placeholder="Search by product name..."
            style={styles.searchInput}
            onChange={(e) =>
              setFilteredProducts(
                products.filter((p) =>
                  p.name.toLowerCase().includes(e.target.value.toLowerCase())
                )
              )
            }
          />
        </div>

        <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div>

      <h1 style={styles.title}>Seller Gold Products</h1>
      <p style={styles.subtitle}>Manage all seller gold product listings</p>

      {/* DASHBOARD CARDS */}
      <div style={styles.cards}>
        <div style={styles.blueCard} onClick={showAll}>
          <h4>Total Products</h4>
          <h2>{products.length}</h2>
        </div>

        <div style={styles.greenCard} onClick={showToday}>
          <h4>Today</h4>
          <h2>{products.filter(p =>
            new Date(p.created_at).toLocaleDateString() ===
            new Date().toLocaleDateString()
          ).length}</h2>
        </div>

        <div style={styles.redCard} onClick={showHigh}>
          <h4>High Amount</h4>
          <h2>{products.filter(p => Number(p.price) > 100000).length}</h2>
        </div>

        <div style={styles.yellowCard} onClick={showLow}>
          <h4>Low Amount</h4>
          <h2>{products.filter(p => Number(p.price) <= 100000).length}</h2>
        </div>
      </div>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button onClick={() =>
          setFilteredProducts(
            products.filter(
              (p) => Number(p.price) >= (minPrice || 0) && Number(p.price) <= (maxPrice || Infinity)
            )
          )
        }>
          Apply
        </button>
        <button onClick={handleExport}>Export</button>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Image","Name","Category","Weight","Purity","Condition","Price","Seller","Mobile","Actions"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  {parseImages(p.images).slice(0,2).map((img,i)=>(
                    <img key={i} src={img} style={styles.thumb} onClick={()=>setEnlargedImage(img)} />
                  ))}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.weight} gm</td>
                <td>{p.purity}</td>
                <td>{p.condition}</td>
                <td>₹{p.price}</td>
                <td>{p.full_name || "N/A"}</td>
                <td>{p.mobilenumber || "N/A"}</td>
                <td style={{display:"flex",gap:8}}>
                  <button style={styles.btnView} onClick={() => setActiveProduct(p)}>
                    <FaEye />
                  </button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(p.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP */}
      {activeProduct && (
        <div style={styles.popupOverlay} onClick={() => setActiveProduct(null)}>
          <div style={styles.popupCard} onClick={(e)=>e.stopPropagation()}>
            <h2 style={{color:"#000"}}>{activeProduct.name}</h2>

            {parseImages(activeProduct.images).map((img,i)=>(
              <img key={i} src={img} style={styles.bigImage} />
            ))}

            <p style={styles.popupText}><b>Category:</b> {activeProduct.category}</p>
            <p style={styles.popupText}><b>Weight:</b> {activeProduct.weight} gm</p>
            <p style={styles.popupText}><b>Purity:</b> {activeProduct.purity}</p>
            <p style={styles.popupText}><b>Condition:</b> {activeProduct.condition}</p>
            <p style={styles.popupText}><b>Price:</b> ₹{activeProduct.price}</p>
            <p style={styles.popupText}><b>Seller:</b> {activeProduct.full_name}</p>
            <p style={styles.popupText}><b>Mobile:</b> {activeProduct.mobilenumber}</p>
          </div>
        </div>
      )}

      {enlargedImage && (
        <div style={styles.popupOverlay} onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} style={styles.bigImage} />
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  page:{padding:20,minHeight:"100vh"},
  header:{display:"flex",justifyContent:"space-between"},
  searchBox:{display:"flex",gap:8},
  searchInput:{border:"none",outline:"none"},
  title:{fontSize:26},
  subtitle:{color:"#94a3b8"},

  cards:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16},
  blueCard:{padding:20,borderRadius:16,color:"#fff",background:"linear-gradient(135deg,#2563eb,#1e40af)",cursor:"pointer"},
  greenCard:{padding:20,borderRadius:16,color:"#fff",background:"linear-gradient(135deg,#22c55e,#15803d)",cursor:"pointer"},
  redCard:{padding:20,borderRadius:16,color:"#fff",background:"linear-gradient(135deg,#ef4444,#991b1b)",cursor:"pointer"},
  yellowCard:{padding:20,borderRadius:16,color:"#111",background:"linear-gradient(135deg,#facc15,#ca8a04)",cursor:"pointer"},

  filters:{display:"flex",gap:10,margin:"20px 0"},

  tableCard:{padding:20,borderRadius:16,background:"#020617"},
  table:{width:"100%",borderCollapse:"collapse"},
  thumb:{width:60,height:60,borderRadius:6,cursor:"pointer"},

  btnView:{background:"#facc15",border:"none",padding:6,borderRadius:6,cursor:"pointer"},
  btnDelete:{background:"#ef4444",color:"#fff",border:"none",padding:6,borderRadius:6,cursor:"pointer"},

  popupOverlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center"},
  popupCard:{background:"#fff",padding:20,borderRadius:12,maxWidth:600,maxHeight:"90vh",overflowY:"auto"},
  popupText:{color:"#000",marginBottom:6},
  bigImage:{maxWidth:"100%",borderRadius:8,marginBottom:10},
};

export default SellerProductTable;

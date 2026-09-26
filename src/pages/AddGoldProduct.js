import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  RotateCcw,
  X,
  Save,
  Trash2,
  Plus,
  Info,
  MapPin,
  Upload,
  Eye,
} from "lucide-react";

const API = "https://goldbackend-production-5c2a.up.railway.app";

const categories = [
  "Gold Rings","Gold Necklaces","Gold Pendants","Gold Earrings","Gold Bracelets",
  "Gold Bangles","Gold Chains","Gold Mangalsutra","Gold Anklets",
  "Gold Nose Pins & Septum Rings","Gold Brooches & Pins","Gold Toe Rings",
  "Gold Armlets / Bajuband","Gold Maang Tikka & Head Jewelry","Gold Jewelry Sets",
  "Gold Cufflinks & Shirt Studs","Gold Charm Bracelets & Anklets","Gold Lockets",
  "Gold Waist Chains / Kamarbandh","Gold Coins & Bars","Silver Rings",
  "Silver Necklaces","Silver Pendants","Silver Earrings","Silver Bracelets",
  "Silver Bangles","Silver Chains","Silver Mangalsutra","Silver Anklets",
  "Silver Nose Pins & Septum Rings","Silver Brooches & Pins","Silver Toe Rings",
  "Silver Armlets / Bajuband","Silver Maang Tikka & Head Jewelry",
  "Silver Jewelry Sets","Silver Cufflinks & Shirt Studs",
  "Silver Charm Bracelets & Anklets","Silver Lockets",
  "Silver Waist Chains / Kamarbandh","Silver Coins & Bars",
];

const purities = [
  "24K","22K","18K","Fine Silver (999 Silver)",
  "Sterling Silver (925 Silver)","Coin Silver (900 Silver)",
  "Britannia Silver (958 Silver)","Argentium Silver (960 Purity)",
  "Tibetan / Tribal Silver (Alloy with lower silver content, often 30% to 50%)",
];

const states = [
  "Andhra Pradesh","Telangana","Karnataka","Tamil Nadu",
  "Kerala","Maharashtra","Delhi","Other",
];

const emptyForm = {
  product_id: "", product_name: "", category_name: "", purity: "",
  weight: "", offer_price: "", original_price: "", stock_quantity: "",
  product_place: "", product_description: "", product_images: [],
  imagePreviews: [], state: "", district: "", mandal: "", pincode: "",
};

const inputStyle = {
  width: "100%", height: 42, padding: "0 10px", boxSizing: "border-box",
  border: "1px solid #ccc", borderRadius: 6, outline: "none",
};

const labelStyle = {
  display: "block", fontSize: 13, fontWeight: 700, marginBottom: 7,
};

const buttonStyle = {
  border: 0, borderRadius: 6, padding: "10px 18px",
  cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
};

const FormInput = ({ label, value, onChange, type = "text", required }) => (
  <div>
    <label style={labelStyle}>{label}{required && " *"}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  </div>
);

const FormSelect = ({ label, options, value, onChange, required }) => (
  <div>
    <label style={labelStyle}>{label}{required && " *"}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">Select {label}</option>
      {options.map((item) => <option key={item}>{item}</option>)}
    </select>
  </div>
);

const GoldProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purityFilter, setPurityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const fileRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products/all`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const viewProduct = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/products/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Product not found");
      setSelectedProduct(data.product || data);
      setShowView(true);
    } catch (error) {
      console.error(error);
      alert(error.message || "Backend server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    form.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = "";
  };

  const closeAdd = () => {
    resetForm();
    setShowAdd(false);
  };

  const addImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({
      ...prev,
      product_images: [...prev.product_images, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews],
    }));

    e.target.value = "";
  };

  const removeImage = (index, e) => {
    e.stopPropagation();

    URL.revokeObjectURL(form.imagePreviews[index]);

    setForm((prev) => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const saveProduct = async (e) => {
    e?.preventDefault();

    const required = [
      "product_id", "product_name", "category_name", "purity", "weight",
      "offer_price", "original_price", "stock_quantity", "product_place",
      "product_description", "state", "district", "mandal", "pincode",
    ];

    for (const field of required) {
      if (!String(form[field] || "").trim()) {
        return alert(
          `Please fill in required field: ${field.replaceAll("_", " ")}`
        );
      }
    }

    if (!form.product_images.length) {
      return alert("Please upload at least one image");
    }

    setLoading(true);

    try {
      const fd = new FormData();

      required.forEach((field) => {
        fd.append(field, String(form[field]).trim());
      });

      form.product_images.forEach((file) => {
        fd.append("product_images", file);
      });

      const res = await fetch(`${API}/products/add`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to save product");
      }

      alert("Product added successfully!");
      closeAdd();
      await fetchProducts();
    } catch (error) {
      console.error("Save product:", error);
      alert(error.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      alert("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      console.error("Delete:", error);
      alert(error.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const parseImages = (raw) => {
    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw.filter(Boolean).map(String);
    }

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
      } catch {}

      return raw
        .replace(/[{}[\]"]/g, "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getImages = (product) =>
    parseImages(
      product?.product_images ||
      product?.product_image ||
      product?.images
    );

  const filteredProducts = products.filter((p) =>
    (purityFilter === "All" || (p.purity || "22K") === purityFilter) &&
    (categoryFilter === "All" || p.category_name === categoryFilter)
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f9fa",
      fontFamily: "Arial, sans-serif",
    }}>

      {/* NAVBAR */}
      <div style={{
        height: 64, background: "#fff", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", borderBottom: "1px solid #ddd",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Menu size={22} />
          <h1 style={{ fontSize: 20, margin: 0 }}>
            Gold Products Management
          </h1>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          style={{ ...buttonStyle, background: "#d97706", color: "#fff" }}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 24 }}>

        {/* FILTERS */}
        <div style={{
          background: "#fff", padding: 20, borderRadius: 8,
          display: "flex", gap: 24, marginBottom: 24,
          border: "1px solid #ddd", flexWrap: "wrap",
        }}>
          <div>
            <label style={labelStyle}>Filter by Purity</label>
            <select
              value={purityFilter}
              onChange={(e) => setPurityFilter(e.target.value)}
              style={{ ...inputStyle, width: 260 }}
            >
              <option value="All">All Purity Levels</option>
              {purities.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ ...inputStyle, width: 280 }}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div style={{
          background: "#fff", overflowX: "auto",
          border: "1px solid #ddd", borderRadius: 8,
        }}>
          <table style={{
            width: "100%", minWidth: 1200,
            borderCollapse: "collapse",
          }}>
            <thead>
              <tr style={{ background: "#f0fdf4" }}>
                {[
                  "Product ID", "Title", "Category", "Purity", "Weight",
                  "Offer Price", "Original Price", "Stock", "Location",
                  "Images", "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    style={{ padding: 14, textAlign: "left", whiteSpace: "nowrap" }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!filteredProducts.length ? (
                <tr>
                  <td colSpan="11" style={{ padding: 50, textAlign: "center" }}>
                    {loading ? "Loading products..." : "No products found"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const images = getImages(product);
                  const id = product.id || product.product_id;

                  return (
                    <tr
                      key={id}
                      onClick={() => viewProduct(id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={td}>{product.product_id}</td>
                      <td style={td}>{product.product_name}</td>
                      <td style={td}>{product.category_name}</td>
                      <td style={td}>{product.purity || "22K"}</td>
                      <td style={td}>{product.weight}g</td>

                      <td style={{ ...td, color: "#16a34a", fontWeight: 600 }}>
                        ₹{Number(product.offer_price || 0).toLocaleString("en-IN")}
                      </td>

                      <td style={{ ...td, color: "#dc2626" }}>
                        ₹{Number(product.original_price || 0).toLocaleString("en-IN")}
                      </td>

                      <td style={td}>{product.stock_quantity}</td>

                      <td style={td}>
                        <b>{product.product_place}</b>
                        <br />
                        {product.mandal}, {product.district}, {product.state}
                      </td>

                      <td style={td}>
                        <div style={{
                          display: "flex", gap: 5,
                          flexWrap: "wrap",
                        }}>
                          {images.length ? images.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="product"
                              style={{
                                width: 40, height: 40,
                                objectFit: "cover", borderRadius: 5,
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )) : "No Image"}
                        </div>
                      </td>

                      <td style={td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewProduct(id);
                            }}
                            style={{
                              background: "none", border: 0,
                              cursor: "pointer", color: "#d97706",
                            }}
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => deleteProduct(id, e)}
                            style={{
                              background: "none", border: 0,
                              cursor: "pointer", color: "#dc2626",
                            }}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAdd && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 1400 }}>
            <div style={modalHead}>
              <h2 style={{ margin: 0 }}>Add Gold Product</h2>
              <X size={22} style={{ cursor: "pointer" }} onClick={closeAdd} />
            </div>

            <div style={{ padding: 30 }}>
              <h3 style={section}>
                <Info size={18} />
                Product Information
              </h3>

              <div style={grid4}>
                <FormInput
                  label="Product Name"
                  value={form.product_name}
                  onChange={(v) => updateForm("product_name", v)}
                  required
                />

                <FormInput
                  label="Product ID"
                  value={form.product_id}
                  onChange={(v) => updateForm("product_id", v)}
                  required
                />

                <FormSelect
                  label="Category Name"
                  options={categories}
                  value={form.category_name}
                  onChange={(v) => updateForm("category_name", v)}
                  required
                />

                <FormSelect
                  label="Purity"
                  options={purities}
                  value={form.purity}
                  onChange={(v) => updateForm("purity", v)}
                  required
                />

                <FormInput
                  label="Weight (grams)"
                  type="number"
                  value={form.weight}
                  onChange={(v) => updateForm("weight", v)}
                  required
                />

                <FormInput
                  label="Offer Price"
                  type="number"
                  value={form.offer_price}
                  onChange={(v) => updateForm("offer_price", v)}
                  required
                />

                <FormInput
                  label="Original Price"
                  type="number"
                  value={form.original_price}
                  onChange={(v) => updateForm("original_price", v)}
                  required
                />

                <FormInput
                  label="Stock Quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={(v) => updateForm("stock_quantity", v)}
                  required
                />
              </div>

              <div style={grid2}>
                <div>
                  <label style={labelStyle}>Product Description *</label>
                  <textarea
                    value={form.product_description}
                    onChange={(e) =>
                      updateForm("product_description", e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      height: 130,
                      padding: 10,
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Product Images *</label>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={addImages}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      ...buttonStyle,
                      background: "#fef3c7",
                      border: "1px dashed #d97706",
                    }}
                  >
                    <Upload size={18} />
                    Upload Images
                  </button>

                  <div style={{
                    display: "flex", gap: 8,
                    flexWrap: "wrap", marginTop: 12,
                  }}>
                    {form.imagePreviews.map((url, i) => (
                      <div key={url} style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt="preview"
                          style={{
                            width: 70, height: 70,
                            objectFit: "cover", borderRadius: 5,
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => removeImage(i, e)}
                          style={{
                            position: "absolute", right: -5, top: -5,
                            border: 0, borderRadius: "50%",
                            background: "#dc2626", color: "#fff",
                            cursor: "pointer", width: 20, height: 20,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <FormInput
                  label="Product Place"
                  value={form.product_place}
                  onChange={(v) => updateForm("product_place", v)}
                  required
                />
              </div>

              <h3 style={section}>
                <MapPin size={18} />
                Location Information
              </h3>

              <div style={grid4}>
                <FormSelect
                  label="State"
                  options={states}
                  value={form.state}
                  onChange={(v) => updateForm("state", v)}
                  required
                />

                <FormInput
                  label="District"
                  value={form.district}
                  onChange={(v) => updateForm("district", v)}
                  required
                />

                <FormInput
                  label="Mandal"
                  value={form.mandal}
                  onChange={(v) => updateForm("mandal", v)}
                  required
                />

                <FormInput
                  label="Pincode"
                  value={form.pincode}
                  onChange={(v) => updateForm("pincode", v)}
                  required
                />
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between",
                borderTop: "1px solid #eee", paddingTop: 20,
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    ...buttonStyle,
                    background: "#fff",
                    border: "1px solid #ccc",
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={saveProduct}
                  disabled={loading}
                  style={{
                    ...buttonStyle,
                    background: loading ? "#9ca3af" : "#ca8a04",
                    color: "#fff",
                  }}
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL */}
      {showView && selectedProduct && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 850 }}>
            <div style={modalHead}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Product Details</h2>
              <X
                size={22}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowView(false);
                  setSelectedProduct(null);
                }}
              />
            </div>

            <div style={{ padding: 30 }}>
              <div style={grid2}>
                <div>
                  <div style={{
                    display: "flex", gap: 10,
                    flexWrap: "wrap",
                  }}>
                    {getImages(selectedProduct).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="product"
                        style={{
                          width: 100, height: 100,
                          objectFit: "cover", borderRadius: 7,
                        }}
                      />
                    ))}
                  </div>

                  <h4>Description</h4>
                  <p>
                    {selectedProduct.product_description || "No description"}
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}>
                  {[
                    ["Product ID", selectedProduct.product_id],
                    ["Product Name", selectedProduct.product_name],
                    ["Category", selectedProduct.category_name],
                    ["Purity", selectedProduct.purity || "22K"],
                    ["Weight", `${selectedProduct.weight || 0} grams`],
                    [
                      "Offer Price",
                      `₹${Number(
                        selectedProduct.offer_price || 0
                      ).toLocaleString("en-IN")}`,
                    ],
                    [
                      "Original Price",
                      `₹${Number(
                        selectedProduct.original_price || 0
                      ).toLocaleString("en-IN")}`,
                    ],
                    ["Stock", selectedProduct.stock_quantity],
                    ["Place", selectedProduct.product_place],
                    [
                      "Location",
                      `${selectedProduct.mandal || ""}, ${
                        selectedProduct.district || ""
                      }, ${selectedProduct.state || ""}`,
                    ],
                    ["Pincode", selectedProduct.pincode],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        background: "#f8fafc",
                        padding: 12,
                        border: "1px solid #e2e8f0",
                        borderRadius: 7,
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <small>{label}</small>
                      <b>{value || "-"}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const td = {
  padding: 14,
  borderBottom: "1px solid #eee",
  fontSize: 13,
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.5)",
  zIndex: 1000,
  overflowY: "auto",
  padding: "30px 0",
};

const modal = {
  background: "#fff",
  width: "92%",
  margin: "0 auto",
  borderRadius: 12,
  overflow: "hidden",
};

const modalHead = {
  padding: "18px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
};

const section = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#b45309",
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18,
  marginBottom: 20,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  marginBottom: 20,
};

export default GoldProductsDashboard;

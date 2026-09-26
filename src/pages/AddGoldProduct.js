import React, { useEffect, useRef, useState } from "react";
import {
  Menu, RotateCcw, X, Save, Trash2, Plus, Info,
  MapPin, Upload, Eye,
} from "lucide-react";

const API = "https://goldbackend-production-5c2a.up.railway.app";

const categories = [
  "Gold Rings","Gold Necklaces","Gold Pendants","Gold Earrings",
  "Gold Bracelets","Gold Bangles","Gold Chains","Gold Mangalsutra",
  "Gold Anklets","Gold Nose Pins & Septum Rings","Gold Brooches & Pins",
  "Gold Toe Rings","Gold Armlets / Bajuband","Gold Maang Tikka & Head Jewelry",
  "Gold Jewelry Sets","Gold Cufflinks & Shirt Studs",
  "Gold Charm Bracelets & Anklets","Gold Lockets",
  "Gold Waist Chains / Kamarbandh","Gold Coins & Bars",
  "Silver Rings","Silver Necklaces","Silver Pendants","Silver Earrings",
  "Silver Bracelets","Silver Bangles","Silver Chains","Silver Mangalsutra",
  "Silver Anklets","Silver Nose Pins & Septum Rings","Silver Brooches & Pins",
  "Silver Toe Rings","Silver Armlets / Bajuband",
  "Silver Maang Tikka & Head Jewelry","Silver Jewelry Sets",
  "Silver Cufflinks & Shirt Studs","Silver Charm Bracelets & Anklets",
  "Silver Lockets","Silver Waist Chains / Kamarbandh","Silver Coins & Bars",
];

const purities = [
  "24K",
  "22K",
  "18K",
  "Fine Silver (999 Silver)",
  "Sterling Silver (925 Silver)",
  "Coin Silver (900 Silver)",
  "Britannia Silver (958 Silver)",
  "Argentium Silver (960 Purity)",
  "Tibetan / Tribal Silver (Alloy with lower silver content, often 30% to 50%)",
];

const states = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Maharashtra",
  "Delhi",
  "Other",
];

const emptyForm = {
  product_id: "",
  product_name: "",
  category_name: "",
  purity: "",
  weight: "",
  offer_price: "",
  original_price: "",
  stock_quantity: "",
  product_place: "",
  product_description: "",
  product_images: [],
  imagePreviews: [],
  state: "",
  district: "",
  mandal: "",
  pincode: "",
};

const input = {
  width: "100%",
  height: 42,
  padding: "0 10px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: 6,
};

const label = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 7,
};

const button = {
  border: 0,
  borderRadius: 6,
  padding: "10px 18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 7,
};

const FormInput = ({ label: title, value, onChange, type = "text", required }) => (
  <div>
    <label style={label}>
      {title}{required && " *"}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={input}
      required={required}
    />
  </div>
);

const FormSelect = ({ label: title, options, value, onChange, required }) => (
  <div>
    <label style={label}>
      {title}{required && " *"}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={input}
      required={required}
    >
      <option value="">Select {title}</option>
      {options.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  </div>
);

const imagesFrom = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch {}

    return value
      .replace(/[{}[\]"]/g, "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
};

export default function GoldProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purity, setPurity] = useState("All");
  const [category, setCategory] = useState("All");
  const fileRef = useRef(null);

  const update = (key, value) =>
    setForm((old) => ({ ...old, [key]: value }));

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/products/all`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to load products");
      }

      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("GET PRODUCTS:", error);
      alert(`Unable to load products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const reset = () => {
    form.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = "";
  };

  const closeAdd = () => {
    reset();
    setShowAdd(false);
  };

  const selectImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setForm((old) => ({
      ...old,
      product_images: [...old.product_images, ...files],
      imagePreviews: [...old.imagePreviews, ...previews],
    }));

    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(form.imagePreviews[index]);

    setForm((old) => ({
      ...old,
      product_images: old.product_images.filter((_, i) => i !== index),
      imagePreviews: old.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!form.product_images.length) {
      alert("Please upload at least one product image.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      /*
        IMPORTANT:
        These names must match your Express multer/backend field names.
      */
      const fields = [
        "product_id",
        "product_name",
        "category_name",
        "purity",
        "weight",
        "offer_price",
        "original_price",
        "stock_quantity",
        "product_place",
        "product_description",
        "state",
        "district",
        "mandal",
        "pincode",
      ];

      fields.forEach((key) => {
        fd.append(key, String(form[key] ?? "").trim());
      });

      form.product_images.forEach((file) => {
        fd.append("product_images", file);
      });

      console.log("Sending product:", {
        product_id: form.product_id,
        product_name: form.product_name,
        category_name: form.category_name,
        purity: form.purity,
        weight: form.weight,
        offer_price: form.offer_price,
        original_price: form.original_price,
        stock_quantity: form.stock_quantity,
        product_place: form.product_place,
        state: form.state,
        district: form.district,
        mandal: form.mandal,
        pincode: form.pincode,
        images: form.product_images.map((x) => x.name),
      });

      const res = await fetch(`${API}/products/add`, {
        method: "POST",
        body: fd,
      });

      const text = await res.text();

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      console.log("ADD PRODUCT RESPONSE:", res.status, data);

      if (!res.ok) {
        throw new Error(
          data.message ||
          data.error ||
          `Server returned HTTP ${res.status}`
        );
      }

      alert(data.message || "Product added successfully!");

      closeAdd();
      await loadProducts();

    } catch (error) {
      console.error("ADD PRODUCT ERROR:", error);

      alert(
        `Product was not added.\n\n${error.message}\n\nCheck the browser Console for the exact backend error.`
      );
    } finally {
      setLoading(false);
    }
  };

  const viewProduct = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/products/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to get product");
      }

      setSelected(data.product || data);
      setShowView(true);

    } catch (error) {
      console.error("VIEW PRODUCT:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert(data.message || "Product deleted successfully.");
      await loadProducts();

    } catch (error) {
      console.error("DELETE PRODUCT:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      (purity === "All" || (p.purity || "22K") === purity) &&
      (category === "All" || p.category_name === category)
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      fontFamily: "Arial,sans-serif",
    }}>

      {/* HEADER */}
      <header style={{
        height: 64,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #ddd",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}>
          <Menu size={22} />
          <h1 style={{ fontSize: 20, margin: 0 }}>
            Gold Products Management
          </h1>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          style={{
            ...button,
            background: "#d97706",
            color: "#fff",
          }}
        >
          <Plus size={18} />
          Add Product
        </button>
      </header>

      <main style={{ padding: 24 }}>

        {/* FILTERS */}
        <div style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 20,
          border: "1px solid #ddd",
        }}>
          <div>
            <label style={label}>Filter by Purity</label>
            <select
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              style={{ ...input, width: 260 }}
            >
              <option value="All">All Purity Levels</option>
              {purities.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>

          <div>
            <label style={label}>Filter by Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...input, width: 280 }}
            >
              <option value="All">All Categories</option>
              {categories.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div style={{
          background: "#fff",
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}>
          <table style={{
            width: "100%",
            minWidth: 1200,
            borderCollapse: "collapse",
          }}>
            <thead>
              <tr style={{ background: "#f0fdf4" }}>
                {[
                  "Product ID",
                  "Title",
                  "Category",
                  "Purity",
                  "Weight",
                  "Offer Price",
                  "Original Price",
                  "Stock",
                  "Location",
                  "Images",
                  "Actions",
                ].map((x) => (
                  <th
                    key={x}
                    style={{
                      padding: 14,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!filtered.length ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{
                      padding: 50,
                      textAlign: "center",
                    }}
                  >
                    {loading ? "Loading..." : "No products found"}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const id = p.id || p.product_id;
                  const images = imagesFrom(
                    p.product_images || p.product_image || p.images
                  );

                  return (
                    <tr
                      key={id}
                      onClick={() => viewProduct(id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={td}>{p.product_id}</td>
                      <td style={td}>{p.product_name}</td>
                      <td style={td}>{p.category_name}</td>
                      <td style={td}>{p.purity || "22K"}</td>
                      <td style={td}>{p.weight}g</td>

                      <td style={{
                        ...td,
                        color: "#16a34a",
                        fontWeight: 600,
                      }}>
                        ₹{Number(p.offer_price || 0).toLocaleString("en-IN")}
                      </td>

                      <td style={{
                        ...td,
                        color: "#dc2626",
                      }}>
                        ₹{Number(p.original_price || 0).toLocaleString("en-IN")}
                      </td>

                      <td style={td}>{p.stock_quantity}</td>

                      <td style={td}>
                        <b>{p.product_place}</b>
                        <br />
                        {p.mandal}, {p.district}, {p.state}
                      </td>

                      <td style={td}>
                        <div style={{
                          display: "flex",
                          gap: 5,
                          flexWrap: "wrap",
                        }}>
                          {images.length ? (
                            images.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt="product"
                                style={{
                                  width: 42,
                                  height: 42,
                                  objectFit: "cover",
                                  borderRadius: 5,
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ))
                          ) : (
                            "No Image"
                          )}
                        </div>
                      </td>

                      <td style={td}>
                        <div style={{
                          display: "flex",
                          gap: 8,
                        }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewProduct(id);
                            }}
                            style={iconBtn}
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => deleteProduct(id, e)}
                            style={{
                              ...iconBtn,
                              color: "#dc2626",
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
      </main>

      {/* ADD PRODUCT */}
      {showAdd && (
        <div style={overlay}>
          <form
            onSubmit={saveProduct}
            style={{
              ...modal,
              maxWidth: 1400,
            }}
          >
            <div style={modalHead}>
              <h2 style={{ margin: 0 }}>Add Gold Product</h2>
              <X
                size={22}
                style={{ cursor: "pointer" }}
                onClick={closeAdd}
              />
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
                  onChange={(v) => update("product_name", v)}
                  required
                />

                <FormInput
                  label="Product ID"
                  value={form.product_id}
                  onChange={(v) => update("product_id", v)}
                  required
                />

                <FormSelect
                  label="Category Name"
                  options={categories}
                  value={form.category_name}
                  onChange={(v) => update("category_name", v)}
                  required
                />

                <FormSelect
                  label="Purity"
                  options={purities}
                  value={form.purity}
                  onChange={(v) => update("purity", v)}
                  required
                />

                <FormInput
                  label="Weight (grams)"
                  type="number"
                  value={form.weight}
                  onChange={(v) => update("weight", v)}
                  required
                />

                <FormInput
                  label="Offer Price"
                  type="number"
                  value={form.offer_price}
                  onChange={(v) => update("offer_price", v)}
                  required
                />

                <FormInput
                  label="Original Price"
                  type="number"
                  value={form.original_price}
                  onChange={(v) => update("original_price", v)}
                  required
                />

                <FormInput
                  label="Stock Quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={(v) => update("stock_quantity", v)}
                  required
                />
              </div>

              <div style={grid2}>

                <div>
                  <label style={label}>
                    Product Description *
                  </label>

                  <textarea
                    value={form.product_description}
                    onChange={(e) =>
                      update("product_description", e.target.value)
                    }
                    required
                    style={{
                      ...input,
                      height: 130,
                      padding: 10,
                    }}
                  />
                </div>

                <div>
                  <label style={label}>
                    Product Images *
                  </label>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={selectImages}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      ...button,
                      background: "#fef3c7",
                      border: "1px dashed #d97706",
                    }}
                  >
                    <Upload size={18} />
                    Upload Images
                  </button>

                  <div style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 12,
                  }}>
                    {form.imagePreviews.map((url, i) => (
                      <div
                        key={url}
                        style={{ position: "relative" }}
                      >
                        <img
                          src={url}
                          alt="preview"
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "cover",
                            borderRadius: 5,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          style={{
                            position: "absolute",
                            right: -6,
                            top: -6,
                            width: 20,
                            height: 20,
                            border: 0,
                            borderRadius: "50%",
                            background: "#dc2626",
                            color: "#fff",
                            cursor: "pointer",
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
                  onChange={(v) => update("product_place", v)}
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
                  onChange={(v) => update("state", v)}
                  required
                />

                <FormInput
                  label="District"
                  value={form.district}
                  onChange={(v) => update("district", v)}
                  required
                />

                <FormInput
                  label="Mandal"
                  value={form.mandal}
                  onChange={(v) => update("mandal", v)}
                  required
                />

                <FormInput
                  label="Pincode"
                  type="number"
                  value={form.pincode}
                  onChange={(v) => update("pincode", v)}
                  required
                />
              </div>

              <div style={footer}>
                <button
                  type="button"
                  onClick={reset}
                  style={{
                    ...button,
                    background: "#fff",
                    border: "1px solid #ccc",
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...button,
                    background: loading ? "#999" : "#ca8a04",
                    color: "#fff",
                  }}
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* VIEW PRODUCT */}
      {showView && selected && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 850 }}>

            <div style={modalHead}>
              <h2 style={{ margin: 0 }}>Product Details</h2>

              <X
                size={22}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowView(false);
                  setSelected(null);
                }}
              />
            </div>

            <div style={{ padding: 30 }}>
              <div style={grid2}>

                <div>
                  <div style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}>
                    {imagesFrom(
                      selected.product_images ||
                      selected.product_image ||
                      selected.images
                    ).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="product"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 7,
                        }}
                      />
                    ))}
                  </div>

                  <h4>Description</h4>

                  <p>
                    {selected.product_description || "No description"}
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}>
                  {[
                    ["Product ID", selected.product_id],
                    ["Product Name", selected.product_name],
                    ["Category", selected.category_name],
                    ["Purity", selected.purity],
                    ["Weight", `${selected.weight || 0} grams`],
                    [
                      "Offer Price",
                      `₹${Number(
                        selected.offer_price || 0
                      ).toLocaleString("en-IN")}`,
                    ],
                    [
                      "Original Price",
                      `₹${Number(
                        selected.original_price || 0
                      ).toLocaleString("en-IN")}`,
                    ],
                    ["Stock", selected.stock_quantity],
                    ["Place", selected.product_place],
                    [
                      "Location",
                      `${selected.mandal || ""}, ${
                        selected.district || ""
                      }, ${selected.state || ""}`,
                    ],
                    ["Pincode", selected.pincode],
                  ].map(([title, value]) => (
                    <div
                      key={title}
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
                      <small>{title}</small>
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
}

const td = {
  padding: 14,
  borderBottom: "1px solid #eee",
  fontSize: 13,
};

const iconBtn = {
  background: "none",
  border: 0,
  cursor: "pointer",
  color: "#d97706",
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
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 18,
  marginBottom: 20,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  marginBottom: 20,
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid #eee",
  paddingTop: 20,
};

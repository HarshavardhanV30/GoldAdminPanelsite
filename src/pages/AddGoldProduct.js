import React, { useState, useEffect, useRef } from "react";
import { Menu, RotateCcw, X, Save, Trash2, Plus, Info, MapPin, Upload, Eye } from "lucide-react";

const GoldProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Holds the product fetched by ID
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purityFilter, setPurityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Hidden file input reference handler
  const fileInputRef = useRef(null);

  // Initial State object to quickly clear or reset the form
  const initialFormState = {
    product_id: "", 
    product_name: "",
    category_name: "",
    purity: "", // 🌟 Added: Form control state parameter
    weight: "",
    offer_price: "",
    original_price: "",
    stock_quantity: "",
    product_place: "",
    product_description: "",
    product_images: [], // Storing actual File Objects for Multer stream upload
    imagePreviews: [],  // Temporary Blob URLs for immediate UI image rendering previews
    state: "",
    district: "",
    mandal: "",
    pincode:"",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://goldbackend-production-3359.up.railway.app/products/all");
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 Fetch single product details by explicit Database ID
  const fetchProductById = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://goldbackend-production-3359.up.railway.app/products/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSelectedProduct(data.product || data);
        setShowViewModal(true);
      } else {
        alert("Failed to fetch product details.");
      }
    } catch (error) {
      console.error("Error fetching single product details:", error);
      alert("Error reaching the database backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetForm = () => {
    formData.imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setFormData(initialFormState);
  };

  const handleClearSelectionId = () => {
    setFormData((prev) => ({ ...prev, product_id: "" }));
  };

  // Multiple Image Upload File Handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      product_images: [...prev.product_images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));

    e.target.value = "";
  };

  const handleRemoveImageFromForm = (indexToRemove, e) => {
    e.stopPropagation();
    
    if(formData.imagePreviews[indexToRemove]) {
      URL.revokeObjectURL(formData.imagePreviews[indexToRemove]);
    }

    setFormData((prev) => ({
      ...prev,
      product_images: prev.product_images.filter((_, idx) => idx !== indexToRemove),
      imagePreviews: prev.imagePreviews.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Save Product Form Submission Engine
  const handleSaveProduct = async () => {
    const requiredFields = [
      "product_id",
      "product_name",
      "category_name",
      "purity", // 🌟 Added validation check
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

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert("Please fill out all required fields marked with an asterisk (*)");
      return;
    }

    if (formData.product_images.length === 0) {
      alert("Please upload at least one Product Image.");
      return;
    }

    setIsLoading(true);
    try {
      const multiPartPayload = new FormData();
      
      multiPartPayload.append("product_id", formData.product_id);
      multiPartPayload.append("product_name", formData.product_name);
      multiPartPayload.append("category_name", formData.category_name);
      multiPartPayload.append("purity", formData.purity); // 🌟 Appending state selection wrapper
      multiPartPayload.append("weight", formData.weight);
      multiPartPayload.append("offer_price", formData.offer_price);
      multiPartPayload.append("original_price", formData.original_price);
      multiPartPayload.append("stock_quantity", formData.stock_quantity);
      multiPartPayload.append("product_place", formData.product_place);
      multiPartPayload.append("product_description", formData.product_description);
      multiPartPayload.append("state", formData.state);
      multiPartPayload.append("district", formData.district);
      multiPartPayload.append("mandal", formData.mandal);
      multiPartPayload.append("pincode", formData.pincode);

      formData.product_images.forEach((fileObject) => {
        multiPartPayload.append("product_images", fileObject);
      });

      const response = await fetch("https://goldbackend-production-3359.up.railway.app/products/add", {
        method: "POST",
        body: multiPartPayload,
      });

      const data = await response.json();
      if (data.success || response.ok) {
        alert("Product added successfully!");
        formData.imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setShowAddForm(false);
        setFormData(initialFormState);
        fetchProducts();
      } else {
        alert(data.message || "Failed to save product.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering details modal fetch logic
    if (!window.confirm("Delete this product?")) return;
    try {
      const response = await fetch(`https://goldbackend-production-3359.up.railway.app/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Deleted successfully.");
        fetchProducts();
      }
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  // Helper utility parsing functional structural response patterns safely
  const parseProductImages = (rawImages) => {
    let imageArray = [];
    if (Array.isArray(rawImages)) {
      imageArray = rawImages;
    } else if (typeof rawImages === "string") {
      try {
        imageArray = JSON.parse(rawImages);
      } catch (e) {
        imageArray = rawImages.replace(/[{}]/g, "").split(",");
      }
    }
    return imageArray.map(img => img.trim()).filter(img => img !== "");
  };

  // Dynamic filter processing logic
  const filteredProducts = products.filter((prod) => {
    const matchesPurity = purityFilter === "All" || (prod.purity || "22K") === purityFilter;
    const matchesCategory = categoryFilter === "All" || prod.category_name === categoryFilter;
    return matchesPurity && matchesCategory;
  });

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Top Navbar */}
      <div style={{ background: "#fff", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Menu size={22} color="#4b5563" style={{ cursor: "pointer" }} />
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>Gold Products Management</h1>
        </div>
        <button onClick={() => setShowAddForm(true)} style={{ background: "#d97706", color: "#fff", border: "none", borderRadius: "6px", padding: "10px 18px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Filters Panel */}
        <div style={{ background: "#fff", borderRadius: "8px", padding: "20px", marginBottom: "24px", border: "1px solid #e5e7eb", display: "flex", gap: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Filter by Purity</label>
            <select value={purityFilter} onChange={(e) => setPurityFilter(e.target.value)} style={filterStyle}>
              <option value="All">All Purity levels</option>
              <option value="24K">24K</option>
              <option value="22K">22K</option>
              <option value="18K">18K</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Filter by Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={filterStyle}>
              <option value="All">All Categories</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Rings">Rings</option>
              <option value="Earrings">Earrings</option>
              <option value="Bracelets">Bracelets</option>
            </select>
          </div>
        </div>

        {/* Workspace Data Table */}
        <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1200px" }}>
            <thead>
              <tr style={{ background: "#f0fdf4", color: "#166534", borderBottom: "2px solid #bbf7d0" }}>
                <th style={thStyle}>Product ID</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Purity</th>
                <th style={thStyle}>Weight</th>
                <th style={thStyle}>Offer Price</th>
                <th style={thStyle}>Original Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Location (Place/Mandal/Dist/State)</th>
                <th style={thStyle}>Product Images</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "48px", color: "#6b7280", fontSize: "14px" }}>
                    {isLoading ? "Loading your catalog inventory..." : "No items listed matching selection."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const imageArray = parseProductImages(prod.product_images || prod.product_image || prod.images);
                  const currentId = prod.id || prod.product_id;

                  return (
                    <tr key={currentId} onClick={() => fetchProductById(currentId)} style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fdfbf7"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                      <td style={{ ...tdStyle, fontWeight: "600" }}>{prod.product_id}</td>
                      <td style={tdStyle}>{prod.product_name}</td>
                      <td style={tdStyle}>{prod.category_name}</td>
                      <td style={tdStyle}>{prod.purity || "22K"}</td>
                      <td style={tdStyle}>{prod.weight}g</td>
                      <td style={{ ...tdStyle, color: "#16a34a", fontWeight: "600" }}>₹{parseFloat(prod.offer_price || 0).toLocaleString('en-IN')}</td>
                      <td style={{ ...tdStyle, color: "#dc2626", textDecoration: "line-through" }}>₹{parseFloat(prod.original_price || 0).toLocaleString('en-IN')}</td>
                      <td style={tdStyle}>{prod.stock_quantity}</td>
                      <td style={{ ...tdStyle, fontSize: "12px", color: "#6b7280" }}>
                        <strong>{prod.product_place}</strong> <br />
                        {prod.mandal}, {prod.district}, {prod.state}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "220px" }}>
                          {imageArray.length > 0 ? (
                            imageArray.map((imgUrl, imgIdx) => (
                              <img 
                                key={imgIdx}
                                src={imgUrl} 
                                alt={`gold product ${imgIdx + 1}`} 
                                style={{ width: "38px", height: "38px", borderRadius: "4px", objectFit: "cover", border: "1px solid #e5e7eb" }} 
                                onError={(e) => { e.target.src = "https://via.placeholder.com/38?text=Gold"; }} 
                              />
                            ))
                          ) : (
                            <img 
                              src="https://via.placeholder.com/38?text=No+Img" 
                              alt="fallback placeholder" 
                              style={{ width: "38px", height: "38px", borderRadius: "4px", objectFit: "cover", border: "1px solid #e5e7eb" }} 
                            />
                          )}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <button onClick={(e) => { e.stopPropagation(); fetchProductById(currentId); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                            <Eye size={16} color="#d97706" />
                          </button>
                          <button onClick={(e) => handleDelete(currentId, e)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                            <Trash2 size={16} color="#ef4444" />
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

      {/* Full Screen Form Overlay Modal */}
      {showAddForm && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(17, 24, 39, 0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "flex-start", zIndex: 1000, overflowY: "auto", padding: "40px 0" }}>
          <div style={{ background: "#ffffff", width: "92%", maxWidth: "1400px", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
            
            {/* Form Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 }}>Add Gold Product</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Dashboard &gt; Products &gt; <span style={{ color: "#d97706", fontWeight: "500" }}>Add Product</span>
                </div>
                <X size={20} color="#9ca3af" style={{ cursor: "pointer" }} onClick={() => setShowAddForm(false)} />
              </div>
            </div>

            <div style={{ padding: "32px 40px" }}>
              {/* SECTION 1: Product Information Heading */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <div style={{ background: "#f59e0b", padding: "6px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Info size={16} color="#fff" />
                </div>
                <h3 style={{ color: "#d97706", margin: 0, fontSize: "16px", fontWeight: "700" }}>Product Information</h3>
              </div>

              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                <FormInput label="Product Name" placeholder="Enter product name" value={formData.product_name} onChange={(val) => handleInputChange("product_name", val)} required />
                <FormInput label="Product ID" placeholder="Enter product ID" value={formData.product_id} onChange={(val) => handleInputChange("product_id", val)} required />
                <FormSelect label="Category Name" options={["Necklaces", "Rings", "Earrings", "Bracelets"]} value={formData.category_name} onChange={(val) => handleInputChange("category_name", val)} required />
                {/* 🌟 Dynamic Form Purity Implementation */}
                <FormSelect label="Purity" options={["24K", "22K", "18K"]} value={formData.purity} onChange={(val) => handleInputChange("purity", val)} required />
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                <FormInput label="Weight (grams)" type="number" placeholder="e.g. 25.75" value={formData.weight} onChange={(val) => handleInputChange("weight", val)} required />
                <FormInput label="Offer Price" type="number" placeholder="Enter offer price" value={formData.offer_price} onChange={(val) => handleInputChange("offer_price", val)} icon="₹" required />
                <FormInput label="Original Price" type="number" placeholder="Enter original price" value={formData.original_price} onChange={(val) => handleInputChange("original_price", val)} icon="₹" required />
                <FormInput label="Stock Quantity" type="number" placeholder="Enter stock quantity" value={formData.stock_quantity} onChange={(val) => handleInputChange("stock_quantity", val)} required />
              </div>

              {/* Row 3 Description and Image Selection Container */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "24px", marginBottom: "32px" }}>
                <div>
                  <label style={labelStyle}>Product Description <span style={{ color: "red" }}>*</span></label>
                  <textarea rows={6} placeholder="Enter product description..." value={formData.product_description} onChange={(e) => handleInputChange("product_description", e.target.value)} style={{ ...inputStyle, height: "140px", padding: "12px", fontFamily: "inherit", resize: "none" }} />
                </div>
                <div>
                  <label style={labelStyle}>Product Images Upload ({formData.product_images.length} added) <span style={{ color: "red" }}>*</span></label>
                  <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />

                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div onClick={triggerFileBrowser} style={{ border: "2px dashed #ca8a04", borderRadius: "8px", width: "160px", height: "140px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#fefce8", cursor: "pointer", textAlign: "center", padding: "0 8px", boxSizing: "border-box" }}>
                      <div style={{ color: "#ca8a04", marginBottom: "6px" }}>
                        <Upload size={22} />
                      </div>
                      <span style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>Upload Images</span>
                      <span style={{ fontSize: "10px", color: "#718096", marginTop: "2px" }}>Select multiple</span>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", overflowY: "auto", height: "140px", flex: 1, border: "1px dashed #e5e7eb", borderRadius: "8px", padding: "10px", background: "#fafafa" }}>
                      {formData.imagePreviews.length === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "#9ca3af", fontSize: "13px" }}>
                          No image files uploaded yet.
                        </div>
                      ) : (
                        formData.imagePreviews.map((imgUrl, index) => (
                          <div key={index} style={{ position: "relative", width: "70px", height: "70px", borderRadius: "6px", border: "1px solid #cbd5e1", overflow: "hidden", background: "#fff" }}>
                            <img src={imgUrl} alt={`Preview index ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button 
                              type="button"
                              onClick={(e) => handleRemoveImageFromForm(index, e)} 
                              style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(239, 68, 68, 0.85)", border: "none", borderRadius: "50%", padding: "3px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <X size={10} color="#fff" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "20px" }}>
                <FormInput label="Product Place" placeholder="Enter product local neighborhood marketplace or town vendor yard location" value={formData.product_place} onChange={(val) => handleInputChange("product_place", val)} required />
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "24px 0" }} />

              {/* SECTION 2: Location Information Heading */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <div style={{ background: "#f59e0b", padding: "6px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={16} color="#fff" />
                </div>
                <h3 style={{ color: "#d97706", margin: 0, fontSize: "16px", fontWeight: "700" }}>Location Information</h3>
              </div>

              {/* Location Selection Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "40px" }}>
                <FormSelect label="State" options={["Andhra Pradesh", "Telangana", "California"]} value={formData.state} onChange={(val) => handleInputChange("state", val)} required />
                <FormSelect label="District" options={["Anantapur", "Chittoor", "YSR Kadapa", "Los Angeles"]} value={formData.district} onChange={(val) => handleInputChange("district", val)} required />
                <FormSelect label="Mandal" options={["Anantapur", "Dharmavaram", "Gooty", "Central"]} value={formData.mandal} onChange={(val) => handleInputChange("mandal", val)} required />
                <FormInput label="Pincode"type="text"placeholder="Enter 6-digit pincode"value={formData.pincode}onChange={(val) => handleInputChange("pincode", val)}required />
                </div>

              {/* Footer Form Navigation controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: "24px" }}>
                <button onClick={handleResetForm} style={secBtn}>
                  <RotateCcw size={16} /> Reset Form
                </button>
                
                <div style={{ display: "flex", gap: "16px" }}>
                  <button onClick={handleClearSelectionId} style={{ ...secBtn, borderColor: "#e5e7eb" }}>
                    <X size={16} /> Clear Selection ID
                  </button>
                  <button onClick={handleSaveProduct} disabled={isLoading} style={priBtn}>
                    <Save size={16} /> {isLoading ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 Dynamic View Detailed Single Product Row Column Modal Overlay (Get By ID Implementation) */}
      {showViewModal && selectedProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(17, 24, 39, 0.5)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100 }}>
          <div style={{ background: "#ffffff", width: "90%", maxWidth: "850px", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={18} color="#d97706" />
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Product Inventory Deep-View [ID: {selectedProduct.product_id}]</h2>
              </div>
              <X size={20} color="#64748b" style={{ cursor: "pointer" }} onClick={() => { setShowViewModal(false); setSelectedProduct(null); }} />
            </div>

            {/* Modal Core Body Content Panel */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                
                {/* Visual Imagery Previews Column */}
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Catalog Images</h4>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {parseProductImages(selectedProduct.product_images || selectedProduct.product_image || selectedProduct.images).length > 0 ? (
                      parseProductImages(selectedProduct.product_images || selectedProduct.product_image || selectedProduct.images).map((imgUrl, idx) => (
                        <img 
                          key={idx} 
                          src={imgUrl} 
                          alt="Detailed specification catalog product reference" 
                          style={{ width: "80px", height: "80px", borderRadius: "6px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Gold"; }}
                        />
                      ))
                    ) : (
                      <div style={{ fontSize: "13px", color: "#94a3b8", padding: "10px" }}>No imagery files found on database stack structure.</div>
                    )}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Description</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: "1.5", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "80px", whiteSpace: "pre-wrap" }}>
                      {selectedProduct.product_description || "No supplemental details provided."}
                    </p>
                  </div>
                </div>

                {/* Technical Metric Data Key Values Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Product Name</span>
                      <span style={detailValueStyle}>{selectedProduct.product_name}</span>
                    </div>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Category Group</span>
                      <span style={detailValueStyle}>{selectedProduct.category_name}</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Gold Purity Standard</span>
                      <span style={{ ...detailValueStyle, color: "#b45309", fontWeight: "700" }}>{selectedProduct.purity || "22K"}</span>
                    </div>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Net Weight (Mass)</span>
                      <span style={detailValueStyle}>{selectedProduct.weight} grams</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Offer Valuation Price</span>
                      <span style={{ ...detailValueStyle, color: "#16a34a", fontWeight: "700" }}>₹{parseFloat(selectedProduct.offer_price || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Original Tag Price</span>
                      <span style={{ ...detailValueStyle, color: "#dc2626", textDecoration: "line-through" }}>₹{parseFloat(selectedProduct.original_price || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div style={detailBoxStyle}>
                    <span style={detailLabelStyle}>Current Stock Quantity</span>
                    <span style={detailValueStyle}>{selectedProduct.stock_quantity} units available</span>
                  </div>

                  <div style={{ ...detailBoxStyle, background: "#fefce8", borderColor: "#fef08a" }}>
                    <span style={detailLabelStyle}>Geographic Region & Center Location</span>
                    <span style={{ ...detailValueStyle, fontSize: "12px", marginTop: "4px" }}>
                      <strong style={{ color: "#a16207" }}>{selectedProduct.product_place}</strong><br />
                      Mandal: {selectedProduct.mandal} | District: {selectedProduct.district} | State: {selectedProduct.state}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer Controls */}
            <div style={{ padding: "12px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowViewModal(false); setSelectedProduct(null); }} style={{ ...secBtn, padding: "8px 20px", fontSize: "13px" }}>
                Close Window View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

/* Utilities UI Form Components Wrapper */
const FormInput = ({ label, type = "text", placeholder, value, onChange, icon, required }) => (
  <div style={{ width: "100%" }}>
    <label style={labelStyle}>
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {icon && (
        <span style={{ position: "absolute", left: "12px", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>
          {icon}
        </span>
      )}
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange && onChange(e.target.value)} style={{ ...inputStyle, paddingLeft: icon ? "28px" : "12px" }} />
    </div>
  </div>
);

const FormSelect = ({ label, options, value, onChange, required }) => (
  <div style={{ width: "100%" }}>
    <label style={labelStyle}>
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/* Stylesheet Theme Mappings */
const labelStyle = { display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "700", color: "#1f2937" };
const thStyle = { padding: "14px 16px", fontSize: "14px", fontWeight: "600" };
const tdStyle = { padding: "14px 16px", fontSize: "13px", color: "#4b5563" };
const filterStyle = { width: "180px", height: "38px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0 10px", outline: "none", color: "#334155" };
const inputStyle = { width: "100%", height: "40px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0 12px", boxSizing: "border-box", fontSize: "14px", outline: "none" };
const priBtn = { background: "#ca8a04", color: "#fff", border: "none", borderRadius: "6px", padding: "10px 22px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };
const secBtn = { background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "6px", padding: "10px 22px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };

const detailBoxStyle = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column" };
const detailLabelStyle = { fontSize: "11px", textTransform: "uppercase", tracking: "0.05em", color: "#64748b", fontWeight: "600", marginBottom: "2px" };
const detailValueStyle = { fontSize: "14px", color: "#0f172a", fontWeight: "500" };

export default GoldProductsDashboard;

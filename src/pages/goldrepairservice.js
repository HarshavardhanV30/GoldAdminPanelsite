import React, { useState, useEffect } from "react";

const GoldRepairService = ({ existingServiceId = null }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    service_id: "SRV-GOLD-007",
    service_name: "Gold Earring Repair",
    service_fee: "449.00",
    original_price: "1000",
  });

  // State for image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for API and UI feedback
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const BASE_URL = "https://goldbackend-production-0ed4.up.railway.app/goldservice";

  // ==========================================
  // GET API (Fetch for Edit Mode)
  // ==========================================
  useEffect(() => {
    if (existingServiceId) {
      setIsEditing(true);
      fetchServiceDetails(existingServiceId);
    }
  }, [existingServiceId]);

  const fetchServiceDetails = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/all`); // Or specific GET by ID if available
      const data = await response.json();
      const service = data.find((item) => item.id === id);
      
      if (service) {
        setFormData({
          service_id: service.service_id,
          service_name: service.service_name,
          service_fee: service.service_fee,
          original_price: service.original_price,
        });
        setImagePreview(service.service_image);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const calculateDiscount = () => {
    const fee = parseFloat(formData.service_fee);
    const original = parseFloat(formData.original_price);
    if (original > 0 && original > fee) {
      return Math.round(((original - fee) / original) * 100);
    }
    return 0;
  };

  // ==========================================
  // POST & PUT APIs (Save/Update)
  // ==========================================
  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    const submitData = new FormData();
    submitData.append("service_id", formData.service_id);
    submitData.append("service_name", formData.service_name);
    submitData.append("service_fee", formData.service_fee);
    submitData.append("original_price", formData.original_price);
    
    if (imageFile) {
      submitData.append("service_image", imageFile);
    }

    const url = isEditing ? `${BASE_URL}/${existingServiceId}` : `${BASE_URL}/add`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(isEditing ? "Service updated successfully!" : "Service created successfully!");
      } else {
        setMessage(`Error: ${result.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE API
  // ==========================================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/${existingServiceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Service deleted successfully.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem", display: "flex", justifyContent: "center", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "72rem", width: "100%", display: "flex", flexWrap: "wrap", gap: "2rem", backgroundColor: "#ffffff", padding: "2rem", borderRadius: "0.75rem", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6", boxSizing: "border-box" }}>
        
        {/* Left Side: Form */}
        <div style={{ flex: "1 1 45%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <button style={{ padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "9999px", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg style={{ width: "1.25rem", height: "1.25rem", color: "#4b5563" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Add / Edit Gold Repair Service</h1>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0, marginTop: "0.25rem" }}>Manage your gold repair services and pricing details</p>
            </div>
          </div>

          {message && (
            <div style={{ padding: "0.75rem", borderRadius: "0.25rem", fontSize: "0.875rem", backgroundColor: message.includes("Error") || message.includes("Failed") ? "#fee2e2" : "#dcfce3", color: message.includes("Error") || message.includes("Failed") ? "#b91c1c" : "#15803d" }}>
              {message}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.25rem" }}>Service ID <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <input type="text" name="service_id" value={formData.service_id} onChange={handleInputChange} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.25rem" }}>Service Name <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <input type="text" name="service_name" value={formData.service_name} onChange={handleInputChange} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.25rem" }}>Service Fee (₹) <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <input type="number" name="service_fee" value={formData.service_fee} onChange={handleInputChange} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", outline: "none", boxSizing: "border-box" }} />
                <span style={{ position: "absolute", right: "1rem", top: "0.75rem", color: "#9ca3af", fontWeight: "bold" }}>₹</span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.25rem" }}>Original Price (₹) <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <input type="number" name="original_price" value={formData.original_price} onChange={handleInputChange} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", outline: "none", boxSizing: "border-box" }} />
                <span style={{ position: "absolute", right: "1rem", top: "0.75rem", color: "#9ca3af", fontWeight: "bold" }}>₹</span>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.25rem" }}>Service Image <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <label style={{ flex: 1, border: "2px dashed #d1d5db", borderRadius: "0.5rem", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "transparent" }}>
                  <svg style={{ width: "2rem", height: "2rem", color: "#6b7280", marginBottom: "0.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <span style={{ fontSize: "0.875rem", color: "#4b5563" }}><span style={{ fontWeight: "600", color: "#000" }}>Click to upload</span> or drag and drop</span>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>PNG, JPG, JPEG (Max 5MB)</span>
                  <input type="file" style={{ display: "none" }} accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                </label>
                
                {imagePreview && (
                  <div style={{ position: "relative", width: "8rem", height: "8rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", overflow: "hidden", flexShrink: 0 }}>
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button onClick={removeImage} style={{ position: "absolute", top: "0.25rem", right: "0.25rem", backgroundColor: "#ffffff", borderRadius: "9999px", padding: "0.25rem", border: "none", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg style={{ width: "1rem", height: "1rem", color: "#374151" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                )}
              </div>
              {imageFile && <p style={{ fontSize: "0.75rem", color: "#16a34a", marginTop: "0.5rem" }}>✓ Image selected: {imageFile.name}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button style={{ flex: 1, padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontWeight: "600", color: "#374151", backgroundColor: "#ffffff", cursor: "pointer" }}>
              Cancel
            </button>
            {isEditing && (
              <button onClick={handleDelete} style={{ flex: 1, padding: "0.75rem 1rem", border: "1px solid #fca5a5", borderRadius: "0.5rem", fontWeight: "600", color: "#dc2626", backgroundColor: "#fef2f2", cursor: "pointer" }}>
                Delete
              </button>
            )}
            <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: "0.75rem 1rem", border: "none", borderRadius: "0.5rem", fontWeight: "600", color: "#000000", backgroundColor: "#eab308", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: loading ? "not-allowed" : "pointer" }}>
              <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              {loading ? "Saving..." : "Save Service"}
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview Card */}
        <div style={{ flex: "1 1 45%", backgroundColor: "rgba(254, 252, 232, 0.4)", borderRadius: "0.75rem", padding: "1.5rem", border: "1px solid #fef08a", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: "bold", color: "#1f2937", margin: 0, fontSize: "1.125rem" }}>Service Preview</h2>
            <span style={{ backgroundColor: "#fef08a", color: "#854d0e", fontSize: "0.75rem", fontWeight: "bold", padding: "0.25rem 0.75rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <svg style={{ width: "0.75rem", height: "0.75rem" }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9.5 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-1 4.5h3v4.5h-3V10z"></path></svg>
              Gold Repair Service
            </span>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", border: "1px solid #f3f4f6", overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Preview Image Area */}
            <div style={{ height: "16rem", backgroundColor: "#f3f4f6", width: "100%", position: "relative" }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Service Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>Image Preview</div>
              )}
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>{formData.service_name || "Service Name"}</h3>
                <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#4b5563", backgroundColor: "#f3f4f6", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}>
                  {formData.service_id || "ID"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ca8a04" }}>₹{formData.service_fee || "0.00"}</span>
                <span style={{ fontSize: "1.125rem", color: "#9ca3af", textDecoration: "line-through" }}>₹{formData.original_price || "0"}</span>
                {calculateDiscount() > 0 && (
                  <span style={{ backgroundColor: "#dcfce3", color: "#15803d", fontSize: "0.75rem", fontWeight: "bold", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                    {calculateDiscount()}% OFF
                  </span>
                )}
              </div>

              {/* Feature Tags (Static per UI design) */}
              <div style={{ backgroundColor: "#FAF8F3", borderRadius: "0.5rem", padding: "1rem", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem", textAlign: "center", fontSize: "0.75rem", fontWeight: "500", color: "#374151" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", borderRight: "1px solid #e5e7eb", padding: "0 0.5rem" }}>
                  <svg style={{ width: "1.5rem", height: "1.5rem", color: "#0f766e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Expert Repair Service
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", borderRight: "1px solid #e5e7eb", padding: "0 0.5rem" }}>
                  <svg style={{ width: "1.5rem", height: "1.5rem", color: "#0f766e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  High Quality Workmanship
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "0 0.5rem" }}>
                  <svg style={{ width: "1.5rem", height: "1.5rem", color: "#0f766e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  Original Shine Restored
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoldRepairService;

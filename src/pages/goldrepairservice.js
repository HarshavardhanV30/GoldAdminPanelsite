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
      setImagePreview(URL.createObjectURL(file)); // Generate local preview
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
        body: submitData, // Browser automatically sets multipart/form-data headers
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
        // Reset form or redirect user here
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center font-sans">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <button className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Add / Edit Gold Repair Service</h1>
              <p className="text-sm text-gray-500">Manage your gold repair services and pricing details</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded text-sm ${message.includes("Error") || message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service ID <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="text" name="service_id" value={formData.service_id} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="text" name="service_name" value={formData.service_name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Fee (₹) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" name="service_fee" value={formData.service_fee} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
                <span className="absolute right-4 top-3 text-gray-400 font-bold">₹</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" name="original_price" value={formData.original_price} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
                <span className="absolute right-4 top-3 text-gray-400 font-bold">₹</span>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Image <span className="text-red-500">*</span></label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <span className="text-sm text-gray-600"><span className="font-semibold text-black">Click to upload</span> or drag and drop</span>
                  <span className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</span>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                </label>
                
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={removeImage} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                )}
              </div>
              {imageFile && <p className="text-xs text-green-600 mt-2 flex items-center gap-1">✓ Image selected: {imageFile.name}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            {isEditing && (
              <button onClick={handleDelete} className="flex-1 py-3 px-4 border border-red-300 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                Delete
              </button>
            )}
            <button onClick={handleSave} disabled={loading} className="flex-1 py-3 px-4 bg-yellow-500 rounded-lg font-semibold text-black hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              {loading ? "Saving..." : "Save Service"}
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview Card */}
        <div className="w-full lg:w-1/2 bg-yellow-50/40 rounded-xl p-6 border border-yellow-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Service Preview</h2>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9.5 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-1 4.5h3v4.5h-3V10z"></path></svg>
              Gold Repair Service
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex-1 flex flex-col">
            {/* Preview Image Area */}
            <div className="h-64 bg-gray-100 w-full relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Service Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Image Preview</div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{formData.service_name || "Service Name"}</h3>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                  {formData.service_id || "ID"}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-yellow-600">₹{formData.service_fee || "0.00"}</span>
                <span className="text-lg text-gray-400 line-through">₹{formData.original_price || "0"}</span>
                {calculateDiscount() > 0 && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                    {calculateDiscount()}% OFF
                  </span>
                )}
              </div>

              {/* Feature Tags (Static per UI design) */}
              <div className="bg-[#FAF8F3] rounded-lg p-4 grid grid-cols-3 gap-2 text-center text-xs font-medium text-gray-700">
                <div className="flex flex-col items-center gap-2 border-r border-gray-200 px-2">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Expert Repair Service
                </div>
                <div className="flex flex-col items-center gap-2 border-r border-gray-200 px-2">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  High Quality Workmanship
                </div>
                <div className="flex flex-col items-center gap-2 px-2">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
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

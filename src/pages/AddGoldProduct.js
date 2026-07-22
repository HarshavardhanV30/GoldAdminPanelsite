import axios from "axios";
import { useState } from "react";

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_id: "",
    product_name: "",
    category_name: "",
    weight: "",
    offer_price: "",
    original_price: "",
    stock_quantity: "",
    product_place: "",
    product_description: "",
    state: "",
    district: "",
    mandal: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle standard text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData object for multipart/form-data request
    const formData = new FormData();

    // Append text fields
    formData.append("product_id", product.product_id);
    formData.append("product_name", product.product_name);
    formData.append("category_name", product.category_name);
    formData.append("weight", parseFloat(product.weight) || 0);
    formData.append("offer_price", parseFloat(product.offer_price) || 0);
    formData.append("original_price", parseFloat(product.original_price) || 0);
    formData.append("stock_quantity", parseInt(product.stock_quantity, 10) || 0);
    formData.append("product_place", product.product_place);
    formData.append("product_description", product.product_description);
    formData.append("state", product.state);
    formData.append("district", product.district);
    formData.append("mandal", product.mandal);

    // Append raw image files
    imageFiles.forEach((file) => {
      // Note: "product_images" matches your backend field key
      formData.append("product_images", file);
    });

    try {
      const response = await axios.post(
        "https://goldbackend-production-3359.up.railway.app/products/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      alert(`Product added successfully! System ID: ${response.data.product?.id || "Success"}`);

      // Reset form state
      setProduct({
        product_id: "",
        product_name: "",
        category_name: "",
        weight: "",
        offer_price: "",
        original_price: "",
        stock_quantity: "",
        product_place: "",
        product_description: "",
        state: "",
        district: "",
        mandal: "",
      });
      setImageFiles([]);
    } catch (error) {
      setLoading(false);
      console.error("Error adding product:", error);
      alert("Failed to add product! Please check input or server logs.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.headerBar}>
          <h1 style={styles.pageTitle}>Add Product</h1>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Product Details</h2>
          <p style={styles.sectionSubtitle}>
            Fill in the information below to upload a new product with images.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Product ID */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product ID *</label>
              <input
                type="text"
                name="product_id"
                placeholder="e.g. PRD002"
                value={product.product_id}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Product Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                name="product_name"
                placeholder="e.g. Gold Necklace"
                value={product.product_name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Category Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Category Name *</label>
              <input
                type="text"
                name="category_name"
                placeholder="e.g. Necklaces"
                value={product.category_name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Weight */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (g) *</label>
              <input
                type="number"
                step="0.01"
                name="weight"
                placeholder="e.g. 25.75"
                value={product.weight}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Offer Price */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Offer Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                name="offer_price"
                placeholder="e.g. 125000"
                value={product.offer_price}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Original Price */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Original Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                name="original_price"
                placeholder="e.g. 135000"
                value={product.original_price}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Stock Quantity */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                placeholder="e.g. 5"
                value={product.stock_quantity}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Product Place */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Place</label>
              <input
                type="text"
                name="product_place"
                placeholder="e.g. Vijayawada"
                value={product.product_place}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* State */}
            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Andhra Pradesh"
                value={product.state}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* District */}
            <div style={styles.formGroup}>
              <label style={styles.label}>District</label>
              <input
                type="text"
                name="district"
                placeholder="e.g. NTR"
                value={product.district}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Mandal */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Mandal</label>
              <input
                type="text"
                name="mandal"
                placeholder="e.g. Vijayawada Urban"
                value={product.mandal}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* File Upload Input */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Upload Product Images *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
                style={styles.fileInput}
              />
              {imageFiles.length > 0 && (
                <p style={styles.fileCount}>
                  Selected {imageFiles.length} file(s): {imageFiles.map(f => f.name).join(", ")}
                </p>
              )}
            </div>

            {/* Description */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Product Description</label>
              <textarea
                name="product_description"
                rows="4"
                placeholder="Provide a detailed description of the product..."
                value={product.product_description}
                onChange={handleChange}
                style={styles.textarea}
              />
            </div>

            {/* Submit Button */}
            <div style={styles.formGroupFull}>
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Uploading Product..." : "+ Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    padding: "30px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  headerBar: {
    marginBottom: "20px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
  },
  card: {
    background: "#fff",
    padding: "25px 30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#222",
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  formGroupFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "500",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  fileInput: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    backgroundColor: "#fff",
  },
  fileCount: {
    fontSize: "12px",
    color: "#007bff",
    marginTop: "5px",
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default AddProduct;

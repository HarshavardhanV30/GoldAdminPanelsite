import axios from "axios";
import { useState } from "react";

const AddProduct = () => {
  const initialState = {
    product_id: "",
    product_name: "",
    category_name: "",
    weight: "",
    offer_price: "",
    original_price: "",
    stock_quantity: "",
    product_place: "",
    product_description: "",
    product_images: "", // Entered as comma-separated URLs
    state: "",
    district: "",
    mandal: "",
  };

  const [product, setProduct] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the payload to match the API expectation
    const payload = {
      product_id: product.product_id,
      product_name: product.product_name,
      category_name: product.category_name,
      weight: Number(product.weight),
      offer_price: Number(product.offer_price),
      original_price: Number(product.original_price),
      stock_quantity: Number(product.stock_quantity),
      product_place: product.product_place,
      product_description: product.product_description,
      // Split comma-separated URLs into an array and clean whitespace
      product_images: product.product_images
        ? product.product_images.split(",").map((url) => url.trim())
        : [],
      state: product.state,
      district: product.district,
      mandal: product.mandal,
    };

    try {
      const response = await axios.post(
        "https://goldbackend-production-3359.up.railway.app/products/add",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      alert(
        `Product added successfully! ID: ${
          response.data?.product?.product_id || response.data?.product_id || "Success"
        }`
      );
      setProduct(initialState);
    } catch (error) {
      setLoading(false);
      console.error("Error adding product:", error);
      alert(
        `Failed to add product! ${
          error.response?.data?.message || "Please check your inputs and try again."
        }`
      );
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.headerBar}>
          <h1 style={styles.pageTitle}>Add Product</h1>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          <p style={styles.sectionSubtitle}>
            Information to help define a product.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Product ID */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product ID</label>
              <input
                type="text"
                name="product_id"
                value={product.product_id}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. PRD002"
              />
            </div>

            {/* Product Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                name="product_name"
                value={product.product_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. Gold Necklace"
              />
            </div>

            {/* Category Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Category Name</label>
              <input
                type="text"
                name="category_name"
                value={product.category_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. Necklaces"
              />
            </div>

            {/* Weight */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (g)</label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. 25.75"
              />
            </div>

            {/* Offer Price */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Offer Price (₹)</label>
              <input
                type="number"
                step="0.01"
                name="offer_price"
                value={product.offer_price}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. 125000.00"
              />
            </div>

            {/* Original Price */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Original Price (₹)</label>
              <input
                type="number"
                step="0.01"
                name="original_price"
                value={product.original_price}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. 135000.00"
              />
            </div>

            {/* Stock Quantity */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={product.stock_quantity}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. 5"
              />
            </div>

            {/* Product Place */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Place</label>
              <input
                type="text"
                name="product_place"
                value={product.product_place}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. Vijayawada"
              />
            </div>

            {/* State */}
            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                name="state"
                value={product.state}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. Andhra Pradesh"
              />
            </div>

            {/* District */}
            <div style={styles.formGroup}>
              <label style={styles.label}>District</label>
              <input
                type="text"
                name="district"
                value={product.district}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. NTR"
              />
            </div>

            {/* Mandal */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Mandal</label>
              <input
                type="text"
                name="mandal"
                value={product.mandal}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. Vijayawada Urban"
              />
            </div>

            {/* Product Description */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Product Description</label>
              <textarea
                name="product_description"
                value={product.product_description}
                onChange={handleChange}
                required
                style={{ ...styles.input, minHeight: "80px" }}
                placeholder="Traditional gold necklace suitable for weddings."
              />
            </div>

            {/* Product Images */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>
                Product Image URLs (comma-separated)
              </label>
              <input
                type="text"
                name="product_images"
                value={product.product_images}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              />
            </div>

            {/* Submit Button */}
            <div style={styles.formGroupFull}>
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Adding Product..." : "+ Add Product"}
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
    transition: "border 0.2s",
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
    transition: "background 0.3s",
  },
};

export default AddProduct;

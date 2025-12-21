import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    productId: "",
    title: "",
    purity: "",
    weight: "",
    price: "",
    stock: "",
    featured: "No",
    image_urls: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setProduct({ ...product, [name]: Array.from(files) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productId", String(product.productId));
      formData.append("title", product.title);
      formData.append("purity", product.purity);
      formData.append("weight", product.weight);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));
      formData.append("featured", product.featured === "Yes");

      // Append all images
      product.image_urls.forEach((file) => {
        formData.append("image_urls", file);
      });

      const response = await axios.post(
        "https://rendergoldapp-1.onrender.com/products/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(`Product added successfully! ID: ${response.data.product.id}`);

      // Reset form
      setProduct({
        productId: "",
        title: "",
        purity: "",
        weight: "",
        price: "",
        stock: "",
        featured: "No",
        image_urls: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to add product! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Add Product</h1>

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
                name="productId"
                value={product.productId}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Purity */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Purity</label>
              <select
                name="purity"
                value={product.purity}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select</option>
                <option value="22k">22K</option>
                <option value="24k">24K</option>
              </select>
            </div>

            {/* Weight */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight</label>
              <input
                type="text"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Price */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Stock */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Featured */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Featured</label>
              <select
                name="featured"
                value={product.featured}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Images */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Product Images</label>
              <input
                type="file"
                name="image_urls"
                accept="image/*"
                multiple
                onChange={handleChange}
                required
                style={styles.fileInput}
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
  pageTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
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
  select: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  fileInput: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    backgroundColor: "#fff",
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

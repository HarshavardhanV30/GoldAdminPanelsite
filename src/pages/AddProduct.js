import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    productId: "",
    title: "",
    purity: "",
    weight: "",
    price: "",
    stock: "",
    featured: "false",
    images: [],
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file selection
  const handleImageChange = (e) => {
    setProduct({ ...product, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append fields (MATCH POSTMAN KEYS EXACTLY)
      formData.append("productId", product.productId);
      formData.append("title", product.title);
      formData.append("purity", product.purity);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("featured", product.featured);
      formData.append("weight", product.weight);

      // Append image file(s)
      for (let i = 0; i < product.images.length; i++) {
        formData.append("image_urls", product.images[i]);
      }

      const response = await axios.post(
        "https://rendergoldapp-1.onrender.com/products/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Product Added Successfully!");

      // Reset form
      setProduct({
        productId: "",
        title: "",
        purity: "",
        weight: "",
        price: "",
        stock: "",
        featured: "false",
        images: [],
      });
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "❌ Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2>Add Product</h2>

        <input
          type="text"
          name="productId"
          placeholder="Product ID"
          value={product.productId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={product.title}
          onChange={handleChange}
          required
        />

        <select
          name="purity"
          value={product.purity}
          onChange={handleChange}
          required
        >
          <option value="">Select Purity</option>
          <option value="22k">22K</option>
          <option value="24k">24K</option>
        </select>

        <input
          type="text"
          name="weight"
          placeholder="Weight (100g)"
          value={product.weight}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          required
        />

        <select
          name="featured"
          value={product.featured}
          onChange={handleChange}
        >
          <option value="false">Not Featured</option>
          <option value="true">Featured</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "#f4f6f8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
};

export default AddProduct;

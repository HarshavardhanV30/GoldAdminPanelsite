import React, { useEffect, useState } from "react";
import {
  Menu,
  RotateCcw,
  X,
  Save,
  Trash2,
  Plus,
  Info,
  MapPin,
  Eye,
} from "lucide-react";

const API_BASE =
  "https://goldbackend-production-3359.up.railway.app";

const initialFormState = {
  product_id: "",
  product_name: "",
  category_name: "",
  weight: "",
  offer_price: "",
  original_price: "",
  stock_quantity: "",
  product_place: "",
  product_description: "",
  product_images: [""],
  state: "",
  district: "",
  mandal: "",
};

const GoldProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState(initialFormState);

  // ============================================================
  // GET ALL PRODUCTS
  // ============================================================

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE}/products/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = [];
      }

      console.log("GET products status:", response.status);
      console.log("GET products response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Unable to fetch products. Status: ${response.status}`
        );
      }

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ============================================================
  // IMAGE URL
  // API EXPECTS:
  //
  // product_images: [
  //   "https://example.com/image.jpg"
  // ]
  //
  // ============================================================

  const handleImageUrlChange = (index, value) => {
    setFormData((previous) => {
      const updatedImages = [...previous.product_images];

      updatedImages[index] = value;

      return {
        ...previous,
        product_images: updatedImages,
      };
    });
  };

  const addImageUrlField = () => {
    setFormData((previous) => ({
      ...previous,
      product_images: [...previous.product_images, ""],
    }));
  };

  const removeImageUrlField = (index) => {
    setFormData((previous) => {
      const updatedImages = previous.product_images.filter(
        (_, imageIndex) => imageIndex !== index
      );

      return {
        ...previous,
        product_images:
          updatedImages.length > 0 ? updatedImages : [""],
      };
    });
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleResetForm = () => {
    setFormData(initialFormState);
  };

  // ============================================================
  // ADD PRODUCT
  // POST:
  // https://goldbackend-production-3359.up.railway.app/products/add
  // ============================================================

  const handleSaveProduct = async () => {
    const requiredFields = [
      "product_id",
      "product_name",
      "category_name",
      "weight",
      "offer_price",
      "original_price",
      "stock_quantity",
      "product_place",
      "product_description",
      "state",
      "district",
      "mandal",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];

      return (
        value === "" ||
        value === null ||
        value === undefined
      );
    });

    if (missingFields.length > 0) {
      alert(
        `Please fill all required fields:\n${missingFields.join(", ")}`
      );

      return;
    }

    // Remove empty image URLs
    const validImages = formData.product_images
      .map((image) => image.trim())
      .filter((image) => image !== "");

    if (validImages.length === 0) {
      alert("Please enter at least one product image URL.");
      return;
    }

    // Validate numeric fields
    const weight = Number(formData.weight);
    const offerPrice = Number(formData.offer_price);
    const originalPrice = Number(formData.original_price);
    const stockQuantity = Number(formData.stock_quantity);

    if (
      Number.isNaN(weight) ||
      Number.isNaN(offerPrice) ||
      Number.isNaN(originalPrice) ||
      Number.isNaN(stockQuantity)
    ) {
      alert(
        "Weight, prices and stock quantity must contain valid numbers."
      );

      return;
    }

    // This payload matches the JSON structure provided
    const payload = {
      product_id: formData.product_id.trim(),
      product_name: formData.product_name.trim(),
      category_name: formData.category_name,

      weight: weight,

      offer_price: offerPrice,

      original_price: originalPrice,

      stock_quantity: stockQuantity,

      product_place: formData.product_place.trim(),

      product_description:
        formData.product_description.trim(),

      product_images: validImages,

      state: formData.state,

      district: formData.district,

      mandal: formData.mandal,
    };

    console.log("====================================");
    console.log("ADD PRODUCT PAYLOAD");
    console.log(payload);
    console.log(JSON.stringify(payload, null, 2));
    console.log("====================================");

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE}/products/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      // Read response as text first.
      // This prevents response.json() from crashing
      // when backend returns plain text / HTML.
      const responseText = await response.text();

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {
          message: responseText,
        };
      }

      console.log("====================================");
      console.log("ADD PRODUCT STATUS:", response.status);
      console.log("ADD PRODUCT RESPONSE:", data);
      console.log("====================================");

      if (!response.ok) {
        const backendMessage =
          data?.message ||
          data?.error ||
          data?.details ||
          `Product failed. HTTP Status: ${response.status}`;

        throw new Error(backendMessage);
      }

      alert(
        data?.message ||
          "Product added successfully!"
      );

      // Reset form
      setFormData(initialFormState);

      // Close modal
      setShowAddForm(false);

      // Reload table
      await fetchProducts();
    } catch (error) {
      console.error("ADD PRODUCT ERROR:", error);

      alert(
        `Failed to add product.\n\n${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // GET SINGLE PRODUCT
  // ============================================================

  const fetchProductById = async (id) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE}/products/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      console.log("Single product:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to fetch product."
        );
      }

      setSelectedProduct(data.product || data);
      setShowViewModal(true);
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDelete = async (id, event) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const responseText = await response.text();

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message: responseText,
        };
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to delete product."
        );
      }

      alert(
        data?.message ||
          "Product deleted successfully."
      );

      await fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);

      alert(error.message);
    }
  };

  // ============================================================
  // PARSE PRODUCT IMAGES
  // ============================================================

  const parseProductImages = (rawImages) => {
    if (!rawImages) {
      return [];
    }

    if (Array.isArray(rawImages)) {
      return rawImages.filter(Boolean);
    }

    if (typeof rawImages === "string") {
      try {
        const parsed = JSON.parse(rawImages);

        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch {
        return rawImages
          .replace(/[{}[\]"]/g, "")
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredProducts = products.filter((product) => {
    if (categoryFilter === "All") {
      return true;
    }

    return product.category_name === categoryFilter;
  });

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
        fontFamily:
          "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* NAVBAR */}

      <div
        style={{
          background: "#fff",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Menu size={22} />

          <h1
            style={{
              fontSize: "20px",
              margin: 0,
            }}
          >
            Gold Products Management
          </h1>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          style={priBtn}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* CONTENT */}

      <div style={{ padding: "24px" }}>
        {/* FILTER */}

        <div
          style={{
            background: "#fff",
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "8px",
          }}
        >
          <label style={labelStyle}>
            Filter by Category
          </label>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            style={inputStyle}
          >
            <option value="All">
              All Categories
            </option>

            <option value="Necklaces">
              Necklaces
            </option>

            <option value="Rings">
              Rings
            </option>

            <option value="Earrings">
              Earrings
            </option>

            <option value="Bracelets">
              Bracelets
            </option>
          </select>
        </div>

        {/* TABLE */}

        <div
          style={{
            background: "#fff",
            overflowX: "auto",
            borderRadius: "8px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1200px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Product ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Weight</th>
                <th style={thStyle}>Offer Price</th>
                <th style={thStyle}>Original Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Images</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading &&
              products.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const id =
                    product.id ||
                    product.product_id;

                  const images =
                    parseProductImages(
                      product.product_images
                    );

                  return (
                    <tr
                      key={id}
                      onClick={() =>
                        fetchProductById(id)
                      }
                      style={{
                        cursor: "pointer",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      <td style={tdStyle}>
                        {product.product_id}
                      </td>

                      <td style={tdStyle}>
                        {product.product_name}
                      </td>

                      <td style={tdStyle}>
                        {product.category_name}
                      </td>

                      <td style={tdStyle}>
                        {product.weight} g
                      </td>

                      <td style={tdStyle}>
                        ₹
                        {Number(
                          product.offer_price || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td style={tdStyle}>
                        ₹
                        {Number(
                          product.original_price ||
                            0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td style={tdStyle}>
                        {product.stock_quantity}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {product.product_place}
                        </strong>

                        <br />

                        {product.mandal},{" "}
                        {product.district},{" "}
                        {product.state}
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          {images.map(
                            (image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt="Product"
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit:
                                    "cover",
                                  borderRadius:
                                    "5px",
                                }}
                              />
                            )
                          )}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            fetchProductById(id);
                          }}
                          style={iconButton}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={(event) =>
                            handleDelete(
                              id,
                              event
                            )
                          }
                          style={iconButton}
                        >
                          <Trash2
                            size={17}
                            color="red"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          ADD PRODUCT MODAL
      ===================================================== */}

      {showAddForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h2>Add Gold Product</h2>

              <X
                size={24}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowAddForm(false)
                }
              />
            </div>

            <div style={{ padding: "30px" }}>
              <h3>
                <Info size={17} /> Product
                Information
              </h3>

              <div style={gridStyle}>
                <FormInput
                  label="Product ID"
                  value={formData.product_id}
                  placeholder="PRD002"
                  onChange={(value) =>
                    handleInputChange(
                      "product_id",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Product Name"
                  value={formData.product_name}
                  placeholder="Gold Necklace"
                  onChange={(value) =>
                    handleInputChange(
                      "product_name",
                      value
                    )
                  }
                  required
                />

                <FormSelect
                  label="Category"
                  value={formData.category_name}
                  options={[
                    "Necklaces",
                    "Rings",
                    "Earrings",
                    "Bracelets",
                  ]}
                  onChange={(value) =>
                    handleInputChange(
                      "category_name",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  placeholder="25.75"
                  onChange={(value) =>
                    handleInputChange(
                      "weight",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Offer Price"
                  type="number"
                  value={formData.offer_price}
                  placeholder="125000"
                  onChange={(value) =>
                    handleInputChange(
                      "offer_price",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Original Price"
                  type="number"
                  value={
                    formData.original_price
                  }
                  placeholder="135000"
                  onChange={(value) =>
                    handleInputChange(
                      "original_price",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Stock Quantity"
                  type="number"
                  value={
                    formData.stock_quantity
                  }
                  placeholder="5"
                  onChange={(value) =>
                    handleInputChange(
                      "stock_quantity",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Product Place"
                  value={
                    formData.product_place
                  }
                  placeholder="Vijayawada"
                  onChange={(value) =>
                    handleInputChange(
                      "product_place",
                      value
                    )
                  }
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div style={{ marginTop: "20px" }}>
                <label style={labelStyle}>
                  Product Description *
                </label>

                <textarea
                  value={
                    formData.product_description
                  }
                  placeholder="Traditional gold necklace suitable for weddings."
                  onChange={(e) =>
                    handleInputChange(
                      "product_description",
                      e.target.value
                    )
                  }
                  style={{
                    ...inputStyle,
                    height: "100px",
                    padding: "12px",
                  }}
                />
              </div>

              {/* IMAGE URL */}

              <div style={{ marginTop: "20px" }}>
                <label style={labelStyle}>
                  Product Image URLs *
                </label>

                {formData.product_images.map(
                  (image, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <input
                        type="url"
                        value={image}
                        placeholder="https://example.com/images/necklace1.jpg"
                        onChange={(e) =>
                          handleImageUrlChange(
                            index,
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      {image && (
                        <img
                          src={image}
                          alt="Preview"
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImageUrlField(
                            index
                          )
                        }
                        style={deleteBtn}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                )}

                <button
                  type="button"
                  onClick={addImageUrlField}
                  style={secBtn}
                >
                  <Plus size={16} />
                  Add Another Image
                </button>
              </div>

              {/* LOCATION */}

              <h3
                style={{
                  marginTop: "30px",
                }}
              >
                <MapPin size={17} /> Location
                Information
              </h3>

              <div style={gridStyle}>
                <FormSelect
                  label="State"
                  value={formData.state}
                  options={[
                    "Andhra Pradesh",
                    "Telangana",
                  ]}
                  onChange={(value) =>
                    handleInputChange(
                      "state",
                      value
                    )
                  }
                  required
                />

                <FormSelect
                  label="District"
                  value={formData.district}
                  options={[
                    "NTR",
                    "Anantapur",
                    "Chittoor",
                    "YSR Kadapa",
                    "Guntur",
                    "Krishna",
                  ]}
                  onChange={(value) =>
                    handleInputChange(
                      "district",
                      value
                    )
                  }
                  required
                />

                <FormInput
                  label="Mandal"
                  value={formData.mandal}
                  placeholder="Vijayawada Urban"
                  onChange={(value) =>
                    handleInputChange(
                      "mandal",
                      value
                    )
                  }
                  required
                />
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "30px",
                }}
              >
                <button
                  onClick={handleResetForm}
                  style={secBtn}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  onClick={handleSaveProduct}
                  disabled={isLoading}
                  style={{
                    ...priBtn,
                    opacity: isLoading
                      ? 0.6
                      : 1,
                  }}
                >
                  <Save size={16} />

                  {isLoading
                    ? "Saving..."
                    : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW PRODUCT
      ===================================================== */}

      {showViewModal && selectedProduct && (
        <div style={overlayStyle}>
          <div
            style={{
              ...modalStyle,
              maxWidth: "800px",
            }}
          >
            <div style={modalHeaderStyle}>
              <h2>
                {selectedProduct.product_name}
              </h2>

              <X
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
              />
            </div>

            <div style={{ padding: "30px" }}>
              <p>
                <strong>Product ID:</strong>{" "}
                {selectedProduct.product_id}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {selectedProduct.category_name}
              </p>

              <p>
                <strong>Weight:</strong>{" "}
                {selectedProduct.weight} grams
              </p>

              <p>
                <strong>Offer Price:</strong> ₹
                {Number(
                  selectedProduct.offer_price ||
                    0
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>
                  Original Price:
                </strong>{" "}
                ₹
                {Number(
                  selectedProduct.original_price ||
                    0
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {selectedProduct.stock_quantity}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {
                  selectedProduct.product_description
                }
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {selectedProduct.product_place},{" "}
                {selectedProduct.mandal},{" "}
                {selectedProduct.district},{" "}
                {selectedProduct.state}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >
                {parseProductImages(
                  selectedProduct.product_images
                ).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Product"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// FORM INPUT
// ============================================================

const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}) => {
  return (
    <div>
      <label style={labelStyle}>
        {label}

        {required && (
          <span style={{ color: "red" }}>
            {" "}
            *
          </span>
        )}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
};

// ============================================================
// FORM SELECT
// ============================================================

const FormSelect = ({
  label,
  options,
  value,
  onChange,
  required,
}) => {
  return (
    <div>
      <label style={labelStyle}>
        {label}

        {required && (
          <span style={{ color: "red" }}>
            {" "}
            *
          </span>
        )}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={inputStyle}
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================================
// STYLES
// ============================================================

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  height: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "0 12px",
  boxSizing: "border-box",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  background: "#f0fdf4",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "14px",
  fontSize: "13px",
};

const priBtn = {
  background: "#ca8a04",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "10px 20px",
  cursor: "pointer",
  display: "flex",
  gap: "7px",
  alignItems: "center",
};

const secBtn = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "10px 18px",
  cursor: "pointer",
  display: "flex",
  gap: "7px",
  alignItems: "center",
};

const deleteBtn = {
  background: "#fee2e2",
  border: "none",
  borderRadius: "6px",
  padding: "10px",
  cursor: "pointer",
  color: "#dc2626",
};

const iconButton = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "5px",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  overflowY: "auto",
  padding: "40px 0",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  width: "92%",
  maxWidth: "1200px",
  borderRadius: "10px",
  overflow: "hidden",
};

const modalHeaderStyle = {
  padding: "15px 25px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default GoldProductsDashboard;

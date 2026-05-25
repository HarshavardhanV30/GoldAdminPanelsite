import React from "react";
import {
  Menu,
  Search,
  Bell,
  Upload,
  RotateCcw,
  X,
  Save,
  MapPin,
  Package,
} from "lucide-react";

const AddGoldProduct = () => {
  return (
    <div
      style={{
        background: "#f5f5f7",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#fff",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          borderBottom: "1px solid #ececec",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <Menu size={30} color="#222" />

          <div
            style={{
              width: "380px",
              height: "45px",
              border: "1px solid #e4e4e4",
              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              background: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Search here..."
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "15px",
                color: "#777",
              }}
            />
            <Search color="#777" />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div style={{ position: "relative" }}>
            <Bell color="#222" size={24} />
            <div
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#ff1d1d",
                color: "#fff",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              5
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontWeight: "700",
                fontSize: "20px",
                color: "#111",
              }}
            >
              Admin
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#777",
                marginTop: "2px",
              }}
            >
              Super Admin
            </div>
          </div>

          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                background: "#facc15",
                borderRadius: "50%",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "20px",
                  background: "#facc15",
                  borderRadius: "20px",
                  position: "absolute",
                  top: "20px",
                  left: "-6px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "35px" }}>
        {/* TOP TITLE */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontSize: "46px",
              margin: 0,
              fontWeight: "700",
              color: "#111",
            }}
          >
            Add Gold Product
          </h1>

          <div
            style={{
              display: "flex",
              gap: "12px",
              color: "#8a8a8a",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            <span>Dashboard</span>
            <span>›</span>
            <span>Products</span>
            <span>›</span>
            <span style={{ color: "#d8a300", fontWeight: "700" }}>
              Add Product
            </span>
          </div>
        </div>

        {/* PRODUCT INFORMATION */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "28px",
            border: "1px solid #ececec",
            marginBottom: "28px",
          }}
        >
          {/* SECTION TITLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#d8a300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package size={18} color="#fff" />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "34px",
                color: "#d8a300",
                fontWeight: "700",
              }}
            >
              Product Information
            </h2>
          </div>

          <div
            style={{
              borderTop: "1px solid #efefef",
              paddingTop: "28px",
            }}
          >
            {/* ROW 1 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "28px",
                marginBottom: "28px",
              }}
            >
              <FormInput
                label="Product Name"
                placeholder="Enter product name"
              />

              <div>
                <Label title="Product ID" />
                <input
                  value="GBR-2024-0001"
                  readOnly
                  style={inputStyle}
                />
                <div
                  style={{
                    marginTop: "10px",
                    color: "#999",
                    fontSize: "15px",
                  }}
                >
                  Auto generated
                </div>
              </div>

              <FormSelect label="Category Name" />
              <FormSelect label="Weight" />
            </div>

            {/* ROW 2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "28px",
                marginBottom: "28px",
              }}
            >
              <PriceInput label="Offer Price" />
              <PriceInput label="Original Price" />

              <FormInput
                label="Stock Quantity"
                placeholder="Enter stock quantity"
              />

              <FormInput
                label="Product Place"
                placeholder="Enter product place"
              />
            </div>

            {/* ROW 3 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: "28px",
              }}
            >
              {/* DESCRIPTION */}
              <div>
                <Label title="Product Description" />

                <textarea
                  placeholder="Enter product description..."
                  style={{
                    width: "100%",
                    height: "260px",
                    border: "1px solid #e4e4e4",
                    borderRadius: "10px",
                    padding: "18px",
                    fontSize: "16px",
                    outline: "none",
                    resize: "none",
                    color: "#777",
                  }}
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <Label title="Product Images" />

                <div
                  style={{
                    border: "2px dashed #e2e2e2",
                    borderRadius: "12px",
                    height: "260px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                  }}
                >
                  <Upload size={42} color="#d8a300" />

                  <div
                    style={{
                      marginTop: "18px",
                      fontSize: "24px",
                      color: "#444",
                    }}
                  >
                    Drag & drop images here
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      color: "#999",
                      fontSize: "18px",
                    }}
                  >
                    or
                  </div>

                  <button
                    style={{
                      marginTop: "18px",
                      background: "#d8a300",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "15px 34px",
                      fontSize: "18px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Upload Images
                  </button>

                  <div
                    style={{
                      marginTop: "18px",
                      color: "#999",
                      fontSize: "15px",
                    }}
                  >
                    (JPG, PNG, WEBP - Max size 5MB each)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION INFORMATION */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "28px",
            border: "1px solid #ececec",
            marginBottom: "28px",
          }}
        >
          {/* SECTION TITLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#d8a300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin size={18} color="#fff" />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "34px",
                color: "#d8a300",
                fontWeight: "700",
              }}
            >
              Location Information
            </h2>
          </div>

          <div
            style={{
              borderTop: "1px solid #efefef",
              paddingTop: "28px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "28px",
              }}
            >
              <FormSelect label="State" />
              <FormSelect label="District" />
              <FormSelect label="Mandal" />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #ececec",
            padding: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button style={secondaryButton}>
            <RotateCcw size={20} />
            Reset
          </button>

          <div style={{ display: "flex", gap: "18px" }}>
            <button style={secondaryButton}>
              <X size={20} />
              Cancel
            </button>

            <button
              style={{
                background: "#d8a300",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "16px 28px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <Save size={20} />
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* REUSABLE COMPONENTS */

const Label = ({ title }) => (
  <label
    style={{
      display: "block",
      marginBottom: "12px",
      fontSize: "18px",
      fontWeight: "700",
      color: "#222",
    }}
  >
    {title} <span style={{ color: "red" }}>*</span>
  </label>
);

const FormInput = ({ label, placeholder }) => (
  <div>
    <Label title={label} />
    <input placeholder={placeholder} style={inputStyle} />
  </div>
);

const FormSelect = ({ label }) => (
  <div>
    <Label title={label} />

    <select style={inputStyle}>
      <option>Select {label.toLowerCase()}</option>
    </select>
  </div>
);

const PriceInput = ({ label }) => (
  <div>
    <Label title={label} />

    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #e4e4e4",
        borderRadius: "10px",
        overflow: "hidden",
        height: "60px",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "100%",
          borderRight: "1px solid #e4e4e4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          color: "#555",
          background: "#fff",
        }}
      >
        ₹
      </div>

      <input
        placeholder={`Enter ${label.toLowerCase()}`}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          height: "100%",
          padding: "0 16px",
          fontSize: "16px",
          color: "#777",
        }}
      />
    </div>
  </div>
);

const inputStyle = {
  width: "100%",
  height: "60px",
  border: "1px solid #e4e4e4",
  borderRadius: "10px",
  padding: "0 16px",
  fontSize: "16px",
  outline: "none",
  color: "#777",
  background: "#fff",
};

const secondaryButton = {
  background: "#fff",
  color: "#333",
  border: "1px solid #e4e4e4",
  borderRadius: "10px",
  padding: "16px 28px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
};

export default AddGoldProduct;
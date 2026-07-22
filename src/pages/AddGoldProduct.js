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

  // Check required fields
  const missingFields = requiredFields.filter(
    (field) =>
      formData[field] === "" ||
      formData[field] === null ||
      formData[field] === undefined
  );

  if (missingFields.length > 0) {
    alert(
      `Please fill all required fields:\n${missingFields.join(", ")}`
    );
    return;
  }

  // Check product images
  if (!formData.product_images || formData.product_images.length === 0) {
    alert("Please add at least one product image.");
    return;
  }

  setIsLoading(true);

  try {
    const payload = {
      product_id: formData.product_id.trim(),
      product_name: formData.product_name.trim(),
      category_name: formData.category_name,

      weight: Number(formData.weight),
      offer_price: Number(formData.offer_price),
      original_price: Number(formData.original_price),
      stock_quantity: Number(formData.stock_quantity),

      product_place: formData.product_place.trim(),
      product_description: formData.product_description.trim(),

      product_images: formData.product_images,

      state: formData.state,
      district: formData.district,
      mandal: formData.mandal,
    };

    console.log("Sending product payload:", payload);

    const response = await fetch(
      "https://goldbackend-production-3359.up.railway.app/products/add",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      }
    );

    // Read backend response safely
    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        message: responseText,
      };
    }

    console.log("Add product status:", response.status);
    console.log("Add product response:", data);

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Failed to add product. Status: ${response.status}`
      );
    }

    alert(data.message || "Product added successfully!");

    // Remove preview object URLs
    formData.imagePreviews?.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    // Clear form
    setFormData(initialFormState);

    // Close Add Product modal
    setShowAddForm(false);

    // Reload products
    await fetchProducts();

  } catch (error) {
    console.error("Error adding product:", error);

    alert(
      error.message ||
        "Unable to add product. Please check the backend server."
    );
  } finally {
    setIsLoading(false);
  }
};

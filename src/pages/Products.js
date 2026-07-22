import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Products = () => {
  const [purityFilter, setPurityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [products, setProducts] = useState([]);

  const API_URL = 'https://goldbackend-production-3359.up.railway.app/products/all';
  const BASE_URL = 'https://goldbackend-production-3359.up.railway.app';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const purityMatch = purityFilter === 'All' || product.purity === purityFilter;
    const categoryMatch =
      categoryFilter === 'All' ||
      product.category_name?.toLowerCase() === categoryFilter.toLowerCase() ||
      product.product_name?.toLowerCase().includes(categoryFilter.toLowerCase());

    return purityMatch && categoryMatch;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`https://goldbackend-production-3359.up.railway.app/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Safe image array parser handling API property `product_images`
  const getImageArray = (imageField) => {
    if (!imageField) return [];
    try {
      if (Array.isArray(imageField)) return imageField;
      if (typeof imageField === 'string') return JSON.parse(imageField);
    } catch {
      return [];
    }
    return [];
  };

  // Resolve absolute image paths
  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${BASE_URL}${url}`;
    return `${BASE_URL}/uploads/${url}`;
  };

  return (
    <div className="products-page-wrapper">
      <style>{`
        .products-page-wrapper {
          padding: 30px;
          background-color: #f4f7fa;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .products-header h2 {
          font-weight: 700;
          color: #1a237e;
          margin: 0;
        }
        .btn-add {
          background: linear-gradient(90deg, #ffb300, #ff8f00);
          border: none;
          color: #fff;
          font-weight: 500;
          padding: 8px 15px;
          border-radius: 6px;
          transition: 0.3s ease;
        }
        .btn-add:hover {
          opacity: 0.85;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 25px;
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        .filter-label {
          font-weight: 500;
          margin-bottom: 5px;
          color: #333;
        }
        .form-select {
          border-radius: 6px;
        }
        .table-container {
          width: 100%;
          overflow-x: auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table thead {
          background-color: #e3f2fd;
        }
        table th {
          font-weight: 600;
          color: #0d47a1;
          padding: 12px;
          text-align: center;
        }
        table td {
          vertical-align: middle !important;
          padding: 10px;
          text-align: center;
        }
        tbody tr:nth-child(even) {
          background-color: #f9fbfc;
        }
        tbody tr:hover {
          background-color: #f1f8ff;
          transition: 0.2s ease;
        }
        .badge {
          font-size: 0.85rem;
          padding: 0.4em 0.7em;
          border-radius: 20px;
        }
        .product-image {
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #ddd;
          transition: transform 0.2s ease;
        }
        .product-image:hover {
          transform: scale(1.1);
        }
        .action-btn {
          border-radius: 50%;
          padding: 6px 9px;
          font-size: 14px;
        }
        .old-price {
          text-decoration: line-through;
          color: #888;
          font-size: 0.85rem;
          margin-left: 5px;
        }
      `}</style>

      <div className="products-header">
        <h2>Gold Products Management</h2>
        <Link to="/addproduct">
          <button className="btn-add">+ Add Product</button>
        </Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Filter by Purity</label>
          <select
            className="form-select"
            value={purityFilter}
            onChange={(e) => setPurityFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Filter by Category</label>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Bars">Bars</option>
            <option value="Coins">Coins</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Rings">Rings</option>
            <option value="Chains">Chains</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Weight (g)</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Location</th>
              <th>Product Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id || product.product_id || index}>
                  <td>{product.product_id}</td>
                  <td>
                    <strong>{product.product_name}</strong>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {product.category_name || 'N/A'}
                    </span>
                  </td>
                  <td>{product.weight}g</td>
                  <td>
                    ₹{product.offer_price}
                    {product.original_price && (
                      <span className="old-price">₹{product.original_price}</span>
                    )}
                  </td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    {product.product_place
                      ? `${product.product_place}, ${product.state}`
                      : 'N/A'}
                  </td>
                  <td>
                    {getImageArray(product.product_images).map((imgUrl, i) => (
                      <img
                        key={i}
                        src={getFullImageUrl(imgUrl)}
                        alt={`${product.product_name} ${i + 1}`}
                        width="50"
                        height="50"
                        className="product-image me-1"
                      />
                    ))}
                  </td>
                  <td>
                    <Link to={`/editproduct/${product.id || product.product_id}`}>
                      <button className="btn btn-sm btn-outline-primary me-2 action-btn">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger action-btn"
                      onClick={() => handleDelete(product.id || product.product_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted py-3">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;

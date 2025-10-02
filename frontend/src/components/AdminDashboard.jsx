import { useState } from "react";
import axios from "axios";
import { MdDashboard, MdShoppingBag, MdPeople, MdShoppingCart, MdLogout } from "react-icons/md";
import urbanstichlogo from "../images/urbanstichlogo.png";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Sidebar = ({ active, setActive, handleLogout }) => {
  const menus = [
    { name: "Dashboard", icon: <MdDashboard />, id: "dashboard" },
    { name: "Products", icon: <MdShoppingBag />, id: "products" },
    { name: "Orders", icon: <MdShoppingCart />, id: "orders" },
    { name: "Customers", icon: <MdPeople />, id: "customers" },
    { name: "Logout", icon: <MdLogout />, id: "logout" }, // Added Logout
  ];

  return (
    <div className="w-56 sm:w-64 xl:w-72 2xl:w-80 bg-gray-600 text-white min-h-screen p-4 sm:p-6 font-poppins">
      <img
        src={urbanstichlogo}
        alt="Site Logo"
        className="w-[120px] sm:w-[160px] md:w-[180px] xl:w-[200px] 2xl:w-[220px] mb-8"
      />
      <ul className="space-y-3 sm:space-y-4">
        {menus.map((menu) => (
          <li
            key={menu.id}
            onClick={() => {
              if (menu.id === "logout") {
                handleLogout();
              } else {
                setActive(menu.id);
              }
            }}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg cursor-pointer transition 
              ${active === menu.id ? "bg-green-600" : "hover:bg-gray-700"}`}
          >
            <span className="text-lg sm:text-xl">{menu.icon}</span>
            <span className="text-sm sm:text-base">{menu.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashboardCards = () => {
  // Fake data
  const customerData = [
    { month: "Jan", customers: 40 }, { month: "Feb", customers: 55 }, { month: "Mar", customers: 80 },
    { month: "Apr", customers: 65 }, { month: "May", customers: 90 }, { month: "Jun", customers: 40 },
    { month: "Jul", customers: 55 }, { month: "Sep", customers: 80 }, { month: "Oct", customers: 65 },
    { month: "Nov", customers: 90 }, { month: "Dec", customers: 25 }
  ];

  const orderData = [
    { day: "Mon", orders: 20 }, { day: "Tue", orders: 35 }, { day: "Wed", orders: 25 },
    { day: "Thu", orders: 50 }, { day: "Fri", orders: 40 }, { day: "Sat", orders: 10 }, { day: "Sun", orders: 70 }
  ];

  const salesData = [
    { name: "Pents", value: 400 }, { name: "Shirts", value: 300 },
    { name: "Watches", value: 200 }, { name: "Accessories", value: 100 },
    { name: "Coats", value: 30 }, { name: "Formal", value: 45 }
  ];

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea", "#0891b2"];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">📊 Admin Dashboard</h1>

      {/* Row 1 - Two responsive charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">

        {/* Customer Report */}
        <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-green-700">👥 Customer Report</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerData}>
              <Line type="monotone" dataKey="customers" stroke="#16a34a" strokeWidth={3} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Report */}
        <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-green-700">📦 Order Report</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders">
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 - Sales Pie Chart */}
      <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-green-700">💰 Sales Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={salesData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              sm={{ outerRadius: 100 }}
              fill="#16a34a"
              dataKey="value"
              label
            >
              {salesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AddProductModal = ({ isOpen, onClose }) => {
  const categories = ["Shirts", "Pants", "Watches", "Accessories", "Coats", "Formal"];
  const subcategories = ["Men", "Women", "Children"];
  const allSizes = ["S", "M", "L", "XL", "XXL"];
  const allColors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Off-White", "Yellow", "Brown"];

  const getEmptyForm = () => ({
    productid: "",
    name: "",
    category: "",
    subcategory: "",
    description: "",
    brand: "",
    discount: "",
    variations: [], // { color, price, sizes: [{ size, stock }], mainImage, gallery }
  });

  const [formData, setFormData] = useState(getEmptyForm());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(getEmptyForm());
    setMessage("");
    setMessageType("");
    onClose && onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") handleClose();
  };

  // Add a new variation for a color
  const addVariation = (color) => {
    if (!formData.variations.find(v => v.color === color)) {
      setFormData(prev => ({
        ...prev,
        variations: [...prev.variations, { color, price: 0, sizes: [], mainImage: null, gallery: [] }]
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Price per variation
  const handleVariationPriceChange = (color, value) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map(v =>
        v.color === color ? { ...v, price: value } : v
      )
    }));
  };

  // Stock per size
  const handleSizeStockChange = (color, size, stock) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map(v => {
        if (v.color === color) {
          const sizes = v.sizes.find(s => s.size === size)
            ? v.sizes.map(s => s.size === size ? { ...s, stock } : s)
            : [...v.sizes, { size, stock }];
          return { ...v, sizes };
        }
        return v;
      })
    }));
  };

  // Main image
  const handleMainImageChange = (color, file) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map(v => v.color === color ? { ...v, mainImage: file } : v)
    }));
  };

  // Gallery images
  const handleGalleryChange = (color, files) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map(v => v.color === color ? { ...v, gallery: Array.from(files) } : v)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append basic fields
    ["productid", "name", "category", "subcategory", "description", "brand", "discount"].forEach(key => {
      data.append(key, formData[key]);
    });

    // Append variations as JSON
    data.append("variations", JSON.stringify(formData.variations));

    // Append variation images separately
    formData.variations.forEach((v, idx) => {
      if (v.mainImage) data.append(`variation_${idx}_mainImage`, v.mainImage);
      if (v.gallery && v.gallery.length > 0) {
        v.gallery.forEach(file => data.append(`variation_${idx}_gallery`, file));
      }
    });

    try {
      const res = await fetch(import.meta.env.VITE_API_ADDPRODUCT, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setMessageType("success");
        setMessage("Product added successfully!");
        setFormData(getEmptyForm());
      } else {
        setMessageType("failure");
        setMessage(result.message || "Failed to add product");
      }
    } catch (err) {
      console.error("❌ AddProduct Error:", err);
      setMessageType("failure");
      setMessage(err.message || "Server Error");
    }
  };

  return (
    <div id="overlay" onClick={handleOverlayClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-red-600 text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic info */}
          <input type="text" name="productid" placeholder="Product ID" value={formData.productid} onChange={handleChange} className="border p-2 w-full rounded" required />
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="border p-2 w-full rounded" />
            <input type="number" name="discount" placeholder="Discount %" value={formData.discount} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500" required>
              <option value="">Select Category</option>
              {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            </select>
            <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500" required>
              <option value="">Select Subcategory</option>
              {subcategories.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
            </select>
          </div>

          {/* Color selection */}
          <div>
            <h3 className="font-semibold mb-2">Select Colors</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map(c => (
                <button type="button" key={c} className="px-3 py-1 border rounded hover:bg-green-600 hover:text-white" onClick={() => addVariation(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Variations */}
          {formData.variations.map((v, idx) => (
            <div key={idx} className="border p-3 rounded mt-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Variation - {v.color}</h4>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, variations: prev.variations.filter(x => x.color !== v.color) }))} className="text-sm text-red-600">Remove</button>
              </div>

              {/* Price */}
              <input type="number" placeholder="Price" value={v.price || ""} onChange={(e) => handleVariationPriceChange(v.color, Number(e.target.value))} className="border p-2 w-full rounded mt-2" />

              {/* Sizes & Stock */}
              <div className="flex gap-2 flex-wrap mt-2">
                {allSizes.map(s => (
                  <div key={s} className="flex items-center gap-1">
                    <input type="checkbox"
                      checked={!!v.sizes.find(sz => sz.size === s)}
                      onChange={(e) => handleSizeStockChange(v.color, s, e.target.checked ? 0 : undefined)}
                    />
                    <span className="ml-1 text-sm">{s}</span>
                    {v.sizes.find(sz => sz.size === s) && (
                      <input type="number" placeholder="Stock" value={v.sizes.find(sz => sz.size === s).stock} onChange={(e) => handleSizeStockChange(v.color, s, Number(e.target.value))} className="border p-1 w-16 ml-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="mt-2">
                <label>Main Image:</label>
                <input type="file" accept="image/*" onChange={(e) => handleMainImageChange(v.color, e.target.files[0])} />
              </div>

              {/* Gallery */}
              <div className="mt-2">
                <label>Gallery Images:</label>
                <input type="file" accept="image/*" multiple onChange={(e) => handleGalleryChange(v.color, e.target.files)} />
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add Product</button>
          </div>
        </form>

        {message && <p className={`mt-3 ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>{message}</p>}
      </div>
    </div>
  );
};

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const categories = ["Shirts", "Pants", "Watches", "Accessories", "Coats", "Formal"];
  const subcategories = ["Men", "Women", "Children"];
  const allSizes = ["S", "M", "L", "XL", "XXL"];
  const allColors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Off-White", "Yellow", "Brown"];

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_DISPLAYPRODUCT);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Open Edit Modal
  const handleEditClick = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleClose = () => {
    setEditProduct(null);
    setModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") handleClose();
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  // Variation functions
  const addVariation = (color) => {
    if (!editProduct.variations.find(v => v.color === color)) {
      setEditProduct(prev => ({
        ...prev,
        variations: [...prev.variations, { color, price: 0, sizes: [], mainImage: null, gallery: [] }]
      }));
    }
  };

  const handleVariationPriceChange = (color, value) => {
    setEditProduct(prev => ({
      ...prev,
      variations: prev.variations.map(v => v.color === color ? { ...v, price: value } : v)
    }));
  };

  const handleSizeStockChange = (color, size, stock) => {
    setEditProduct(prev => ({
      ...prev,
      variations: prev.variations.map(v => {
        if (v.color === color) {
          const sizes = v.sizes.find(s => s.size === size)
            ? v.sizes.map(s => s.size === size ? { ...s, stock } : s)
            : [...v.sizes, { size, stock }];
          return { ...v, sizes };
        }
        return v;
      })
    }));
  };

  const handleMainImageChange = (color, file) => {
    setEditProduct(prev => ({
      ...prev,
      variations: prev.variations.map(v => v.color === color ? { ...v, mainImage: file } : v)
    }));
  };

  const handleGalleryChange = (color, files) => {
    setEditProduct(prev => ({
      ...prev,
      variations: prev.variations.map(v => v.color === color ? { ...v, gallery: Array.from(files) } : v)
    }));
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    const data = new FormData();
    const fields = ["productid", "name", "category", "subcategory", "description", "brand", "discount"];

    fields.forEach(key => data.append(key, editProduct[key]));
    data.append("variations", JSON.stringify(editProduct.variations));

    editProduct.variations.forEach((v, idx) => {
      if (v.mainImage instanceof File) data.append(`variation_${idx}_mainImage`, v.mainImage);
      if (v.gallery && v.gallery.length > 0) {
        v.gallery.forEach(file => {
          if (file instanceof File) data.append(`variation_${idx}_gallery`, file);
        });
      }
    });

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_UPDATEPRODUCT}/${editProduct._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Update frontend state
      setProducts(products.map(p => p._id === res.data._id ? res.data : p));
      toast.success("Product updated successfully!");
      handleClose();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      toast.error("Update failed");
    }
  };

  // delete product
  const handleDelete = async (product) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_DELETEPRODUCT}/${product._id}`);
      setProducts(products.filter(p => p._id !== product._id));
      toast.success(`${product.name} has been deleted successfully`);
    } catch (err) {
      console.error("Delete failed:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="overflow-x-auto mt-10">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Subcategory</th>
                  <th className="border px-4 py-2">Brand</th>
                  <th className="border px-4 py-2">Variations</th>
                  <th className="border px-4 py-2">Discount (%)</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="text-center">
                    <td className="border px-4 py-2">{product.productid}</td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.category}</td>
                    <td className="border px-4 py-2">{product.subcategory}</td>
                    <td className="border px-4 py-2">{product.brand}</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col gap-2">
                        {product.variations.map((v, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col md:flex-row md:justify-between items-start md:items-center border rounded-lg p-2 bg-gray-50 shadow-sm"
                          >
                            {/* Color */}
                            <div className="font-semibold text-gray-700 mb-1 md:mb-0">
                              {v.color}
                            </div>

                            {/* Sizes & stock */}
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {v.sizes.map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                >
                                  {s.size} - {s.stock}
                                </span>
                              ))}
                            </div>

                            {/* Price */}
                            <div className="mt-1 md:mt-0 font-semibold text-gray-900">
                              Rs: {v.price || "0"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="border px-4 py-2">{product.discount}</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-row items-center"
                      >
                        <FaEdit onClick={() => handleEditClick(product)} />
                        <FaTrash onClick={() => handleDelete(product)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {modalOpen && editProduct && (
        <div id="overlay" onClick={handleOverlayClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-red-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" name="productid" value={editProduct.productid} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Product ID" required readOnly />
              <input type="text" name="name" value={editProduct.name} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Product Name" required />
              <textarea name="description" value={editProduct.description} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Description" />

              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="brand" value={editProduct.brand} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Brand" />
                <input type="number" name="discount" value={editProduct.discount} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Discount %" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select name="category" value={editProduct.category} onChange={handleChange} className="border p-2 rounded" required>
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </select>
                <select name="subcategory" value={editProduct.subcategory} onChange={handleChange} className="border p-2 rounded" required>
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                </select>
              </div>

              {/* Color selection */}
              <div>
                <h3 className="font-semibold mb-2">Select Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {allColors.map(c => (
                    <button type="button" key={c} className="px-3 py-1 border rounded hover:bg-green-600 hover:text-white" onClick={() => addVariation(c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Variations */}
              {editProduct.variations.map((v, idx) => (
                <div key={idx} className="border p-3 rounded mt-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Variation - {v.color}</h4>
                    <button type="button" className="text-sm text-red-600" onClick={() => setEditProduct(prev => ({ ...prev, variations: prev.variations.filter(x => x.color !== v.color) }))}>Remove</button>
                  </div>

                  <input type="number" placeholder="Price" value={v.price || ""} onChange={(e) => handleVariationPriceChange(v.color, Number(e.target.value))} className="border p-2 w-full rounded mt-2" />

                  <div className="flex gap-2 flex-wrap mt-2">
                    {allSizes.map(s => (
                      <div key={s} className="flex items-center gap-1">
                        <input type="checkbox" checked={!!v.sizes.find(sz => sz.size === s)} onChange={(e) => handleSizeStockChange(v.color, s, e.target.checked ? 0 : undefined)} />
                        <span className="ml-1 text-sm">{s}</span>
                        {v.sizes.find(sz => sz.size === s) && (
                          <input type="number" placeholder="Stock" value={v.sizes.find(sz => sz.size === s).stock} onChange={(e) => handleSizeStockChange(v.color, s, Number(e.target.value))} className="border p-1 w-16 ml-1" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2">
                    <label>Main Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => handleMainImageChange(v.color, e.target.files[0])} />
                  </div>

                  <div className="mt-2">
                    <label>Gallery Images:</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleGalleryChange(v.color, e.target.files)} />
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const Products = () => {
  const [addproductmodelopen, setaddproductmodelopen] = useState(false);

  return (
    <>
      <button onClick={() => setaddproductmodelopen(true)}
        className="float-right mt-8 w-fit px-12 py-2 bg-white border border-1 rounded-lg border-green-700 font-poppins text-sm hover:bg-green-700 hover:text-white transition delay-100 ease-in-out duration-150 hover:cursor-pointer">
        Add Product
      </button>

      <AddProductModal
        isOpen={addproductmodelopen}
        onClose={() => setaddproductmodelopen(false)}
      />

      <DisplayProducts />
    </>
  );
}

const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  // Fake logout function (replace with real Auth logic)
  const handleLogout = () => {
    alert("Admin logged out!");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {active === "dashboard" && (
          <>
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Dashboard Overview</h1>
            <DashboardCards />
          </>
        )}
        {active === "products" && (
          <>
            <h1 className="text-xl sm:text-2xl font-bold">Manage Products</h1>
            <Products />
          </>
        )}
        {active === "orders" && (
          <h1 className="text-xl sm:text-2xl font-bold">Manage Orders</h1>
        )}
        {active === "customers" && (
          <h1 className="text-xl sm:text-2xl font-bold">Manage Customers</h1>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
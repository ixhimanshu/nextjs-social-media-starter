'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    images: [''],
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (i, value) => {
    const updatedImages = [...form.images];
    updatedImages[i] = value;
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ''] });
  };

  const removeImageField = (i) => {
    const updatedImages = form.images.filter((_, index) => index !== i);
    setForm({ ...form, images: updatedImages });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price) return;
    setLoading(true);

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/products?id=${editId}` : '/api/products';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ name: '', description: '', price: '', images: [''] });
    setEditId(null);
    setLoading(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images || [''],
    });
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">🛒 Admin Dashboard</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-2xl mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="bg-gray-700 text-white p-2 rounded"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
          />
          <input
            className="bg-gray-700 text-white p-2 rounded"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <textarea
            className="bg-gray-700 text-white p-2 rounded md:col-span-2"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">Product Images</label>
            {form.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                  placeholder={`Image URL ${i + 1}`}
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mt-2"
            >
              + Add Image
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded md:col-span-2 transition"
          >
            {editId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">📦 Products List</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images?.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="product"
                  className="w-24 h-24 object-cover rounded border border-gray-700"
                />
              ))}
            </div>
            <div className="mt-2">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-300 text-sm">{product.description}</p>
              <p className="text-green-400 font-bold">₹{product.price}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

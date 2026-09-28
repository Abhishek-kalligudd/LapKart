import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // For now, using the public endpoint which works correctly
      const res = await api.get('/public/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="border rounded-md bg-card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{product.id}</td>
                <td className="px-6 py-4">
                  <img 
                    src={product.productImgs?.[0]?.imageUrl || 'https://via.placeholder.com/40'} 
                    alt={product.name} 
                    className="h-10 w-10 object-cover rounded" 
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.stockQuantity}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Edit className="h-4 w-4 inline" />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No products found.</div>
        )}
      </div>
    </div>
  );
}

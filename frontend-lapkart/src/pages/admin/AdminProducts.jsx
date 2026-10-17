import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { 
  Plus, Edit2, Trash2, Image as ImageIcon, Search, X, Check, 
  ExternalLink, Laptop, DollarSign, Layers, Cpu, HardDrive, 
  Monitor, Star, AlertCircle, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productFormError, setProductFormError] = useState('');

  // Image Gallery Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeProductForImages, setActiveProductForImages] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImagePrimary, setNewImagePrimary] = useState(false);
  const [imageSubmitting, setImageSubmitting] = useState(false);
  const [imageError, setImageError] = useState('');

  // Product Form State
  const initialProductState = {
    brand: 'asus',
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    discountPrice: '',
    stockQuantity: 10,
    processor: '',
    ramGb: 16,
    storage: '',
    displaySpecs: '',
    gpu: '',
    os: 'Windows 11 Home',
    description: '',
    isActive: true,
    initialImageUrl: '',
  };
  const [productForm, setProductForm] = useState(initialProductState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/categories'),
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      console.error('Failed to load products or categories', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Product Modal (Add or Edit)
  const handleOpenProductModal = (product = null) => {
    setProductFormError('');
    if (product) {
      setEditingProduct(product);
      setProductForm({
        brand: product.brand || 'asus',
        name: product.name || '',
        sku: product.sku || '',
        categoryId: product.category?.id || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stockQuantity: product.stockQuantity ?? 0,
        processor: product.processor || '',
        ramGb: product.ramGb || 16,
        storage: product.storage || '',
        displaySpecs: product.displaySpecs || '',
        gpu: product.gpu || '',
        os: product.os || 'Windows 11 Home',
        description: product.description || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        initialImageUrl: '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        ...initialProductState,
        categoryId: categories.length > 0 ? categories[0].id : '',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductFormError('');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.brand || !productForm.price) {
      setProductFormError('Brand, Model Name, and Price are required.');
      return;
    }

    try {
      setProductSubmitting(true);
      setProductFormError('');

      const payload = {
        brand: productForm.brand,
        name: productForm.name,
        sku: productForm.sku,
        categoryId: productForm.categoryId ? Number(productForm.categoryId) : null,
        price: Math.round(Number(productForm.price)),
        discountPrice: productForm.discountPrice ? Math.round(Number(productForm.discountPrice)) : null,
        stockQuantity: Number(productForm.stockQuantity || 0),
        processor: productForm.processor,
        ramGb: productForm.ramGb ? Number(productForm.ramGb) : null,
        storage: productForm.storage,
        displaySpecs: productForm.displaySpecs,
        gpu: productForm.gpu,
        os: productForm.os,
        description: productForm.description,
        isActive: productForm.isActive,
      };

      if (!editingProduct && productForm.initialImageUrl) {
        payload.images = [
          {
            imageUrl: productForm.initialImageUrl,
            altText: productForm.name,
            isPrimary: true,
          },
        ];
      }

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      handleCloseProductModal();
      loadData();
    } catch (err) {
      console.error(err);
      setProductFormError(err.response?.data?.message || 'Error saving product. Please check your inputs.');
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/products/${id}`);
        loadData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete product.');
      }
    }
  };

  // Open Image Manager Modal
  const handleOpenImageModal = async (product) => {
    setActiveProductForImages(product);
    setIsImageModalOpen(true);
    setNewImageUrl('');
    setNewImageAlt(product.name || '');
    setNewImagePrimary(false);
    setImageError('');
    await fetchProductImages(product.id);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setActiveProductForImages(null);
    setProductImages([]);
    setImageError('');
    loadData(); // Refresh product thumbnail in main table
  };

  const fetchProductImages = async (productId) => {
    try {
      setImagesLoading(true);
      const res = await api.get(`/admin/products/${productId}/images`);
      setProductImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      setImageError('Image URL is required.');
      return;
    }

    try {
      setImageSubmitting(true);
      setImageError('');
      await api.post(`/admin/products/${activeProductForImages.id}/images`, {
        imageUrl: newImageUrl.trim(),
        altText: newImageAlt.trim() || activeProductForImages.name,
        isPrimary: newImagePrimary || productImages.length === 0,
      });

      setNewImageUrl('');
      setNewImageAlt(activeProductForImages.name);
      setNewImagePrimary(false);
      fetchProductImages(activeProductForImages.id);
    } catch (err) {
      console.error(err);
      setImageError('Failed to add image.');
    } finally {
      setImageSubmitting(false);
    }
  };

  const handleSetPrimaryImage = async (imgId) => {
    try {
      await api.put(`/admin/products/${activeProductForImages.id}/images/${imgId}/primary`);
      fetchProductImages(activeProductForImages.id);
    } catch (err) {
      console.error(err);
      alert('Failed to set primary image.');
    }
  };

  const handleDeleteImage = async (imgId) => {
    if (window.confirm('Delete this image?')) {
      try {
        await api.delete(`/admin/products/${activeProductForImages.id}/images/${imgId}`);
        fetchProductImages(activeProductForImages.id);
      } catch (err) {
        console.error(err);
        alert('Failed to delete image.');
      }
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (p.category && String(p.category.id) === String(selectedCategory));

    const matchesStock =
      stockFilter === 'ALL'
        ? true
        : stockFilter === 'IN_STOCK'
        ? (p.stockQuantity || 0) > 0
        : (p.stockQuantity || 0) === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your laptop catalog, specifications, stock, and multi-angle product photography.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2 border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenProductModal()}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 shadow transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by model, brand, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ALL">All Stock</option>
            <option value="IN_STOCK">In Stock (&gt; 0)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          </select>

          <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded-md">
            {filteredProducts.length} Laptops
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">
            Loading laptop catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No laptops found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Specs Overview</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Images</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((p) => {
                  const primaryImg = p.productImgs?.find((img) => img.isPrimary)?.imageUrl ||
                    p.productImgs?.[0]?.imageUrl ||
                    'https://via.placeholder.com/60?text=No+Img';
                  const imgCount = p.productImgs?.length || 0;
                  const isOutOfStock = (p.stockQuantity || 0) === 0;

                  return (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      {/* Product Model & Brand */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="h-12 w-12 object-contain bg-white rounded-lg border p-1 shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60?text=Laptop';
                            }}
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                {p.brand}
                              </span>
                              {p.sku && (
                                <span className="text-[11px] font-mono text-muted-foreground">
                                  • {p.sku}
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-foreground text-sm line-clamp-1">
                              {p.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        {p.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border">
                            {p.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unassigned</span>
                        )}
                      </td>

                      {/* Specs */}
                      <td className="px-6 py-4 text-xs text-muted-foreground space-y-0.5 max-w-xs">
                        {p.processor && (
                          <div className="flex items-center space-x-1 truncate">
                            <Cpu className="h-3 w-3 text-primary shrink-0" />
                            <span className="truncate">{p.processor}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-[11px]">
                          {p.ramGb && <span>{p.ramGb}GB RAM</span>}
                          {p.storage && <span>• {p.storage}</span>}
                          {p.gpu && <span>• {p.gpu}</span>}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(p.discountPrice ? p.discountPrice : p.price)}
                        </div>
                        {p.discountPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCurrency(p.price)}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isOutOfStock 
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' 
                            : p.stockQuantity < 10
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400'
                        }`}>
                          {p.stockQuantity} units
                        </span>
                      </td>

                      {/* Images count button */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleOpenImageModal(p)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs border rounded-lg hover:bg-muted font-medium transition-colors"
                          title="Manage Photos"
                        >
                          <ImageIcon className="h-3.5 w-3.5 text-primary" />
                          <span>{imgCount} photos</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenProductModal(p)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          title="Edit Laptop Specs"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-3xl my-8 rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-muted/30">
              <div className="flex items-center space-x-2">
                <Laptop className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  {editingProduct ? `Edit Laptop: ${editingProduct.name}` : 'Add New Laptop Product'}
                </h3>
              </div>
              <button
                onClick={handleCloseProductModal}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
              {productFormError && (
                <div className="p-3 bg-destructive/15 text-destructive rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{productFormError}</span>
                </div>
              )}

              {/* SECTION 1: Identity & Categorization */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  1. Brand & Identity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Brand <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="acer">Acer</option>
                      <option value="apple">Apple</option>
                      <option value="asus">ASUS</option>
                      <option value="dell">Dell</option>
                      <option value="hp">HP</option>
                      <option value="lenovo">Lenovo</option>
                      <option value="samsung">Samsung</option>
                      <option value="gigabyte">Gigabyte</option>
                      <option value="msi">MSI</option>
                      <option value="razer">Razer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Model / Product Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ROG Zephyrus G16, MacBook Air M5"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Category
                    </label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ASU-ROG-16 (auto if blank)"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Active Status
                    </label>
                    <select
                      value={productForm.isActive ? 'true' : 'false'}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.value === 'true' })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="true">Active (Visible in Store)</option>
                      <option value="false">Hidden / Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Pricing & Inventory */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  2. Pricing & Inventory
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Regular Price (₹) <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      placeholder="89999"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Sale / Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="79999 (optional)"
                      value={productForm.discountPrice}
                      onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Stock Quantity <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Technical Specifications */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  3. Hardware Specifications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Processor (CPU)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Intel Core i9-13900H, Apple M3"
                      value={productForm.processor}
                      onChange={(e) => setProductForm({ ...productForm, processor: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      RAM (GB)
                    </label>
                    <select
                      value={productForm.ramGb}
                      onChange={(e) => setProductForm({ ...productForm, ramGb: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="8">8 GB</option>
                      <option value="16">16 GB</option>
                      <option value="32">32 GB</option>
                      <option value="64">64 GB</option>
                      <option value="128">128 GB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Storage
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1TB NVMe SSD, 512GB SSD"
                      value={productForm.storage}
                      onChange={(e) => setProductForm({ ...productForm, storage: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Graphics (GPU)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NVIDIA RTX 4070, Intel Arc"
                      value={productForm.gpu}
                      onChange={(e) => setProductForm({ ...productForm, gpu: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Display Specifications
                    </label>
                    <input
                      type="text"
                      placeholder='e.g. 16" QHD+ 240Hz OLED'
                      value={productForm.displaySpecs}
                      onChange={(e) => setProductForm({ ...productForm, displaySpecs: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Operating System
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Windows 11 Home, macOS Sonoma"
                      value={productForm.os}
                      onChange={(e) => setProductForm({ ...productForm, os: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Description */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Product Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Comprehensive laptop overview, thermal cooling highlights, port selections..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* SECTION 5: Initial Image (When creating new product) */}
              {!editingProduct && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    4. Initial Product Photo (Optional)
                  </h4>
                  <input
                    type="url"
                    placeholder="https://ik.imagekit.io/... or https://..."
                    value={productForm.initialImageUrl}
                    onChange={(e) => setProductForm({ ...productForm, initialImageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    You can add more photos, back angles, and keyboard views after saving using the "Manage Photos" button.
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t shrink-0">
                <button
                  type="button"
                  onClick={handleCloseProductModal}
                  className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productSubmitting}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow disabled:opacity-50"
                >
                  {productSubmitting ? 'Saving...' : editingProduct ? 'Update Laptop' : 'Create Laptop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PRODUCT IMAGE GALLERY & UPLOADER */}
      {/* ======================================================== */}
      {isImageModalOpen && activeProductForImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-muted/30">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Photo Gallery: {activeProductForImages.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {productImages.length} images connected
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseImageModal}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Existing Images Grid */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Current Photos
                </h4>
                {imagesLoading ? (
                  <div className="p-8 text-center text-muted-foreground animate-pulse">
                    Loading photos...
                  </div>
                ) : productImages.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground bg-muted/30 border border-dashed rounded-xl">
                    No photos added yet. Add one below!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {productImages.map((img) => (
                      <div
                        key={img.id}
                        className={`group relative rounded-xl border bg-background overflow-hidden p-2 flex flex-col items-center transition-all ${
                          img.isPrimary ? 'ring-2 ring-primary border-primary shadow-sm' : ''
                        }`}
                      >
                        <div className="h-28 w-full flex items-center justify-center bg-white rounded-lg p-1">
                          <img
                            src={img.imageUrl}
                            alt={img.altText || 'Laptop image'}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                            }}
                          />
                        </div>

                        {img.isPrimary && (
                          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                            <Star className="h-3 w-3 fill-current" />
                            <span>Primary</span>
                          </div>
                        )}

                        <div className="w-full mt-2 pt-2 border-t flex items-center justify-between text-xs">
                          {!img.isPrimary ? (
                            <button
                              onClick={() => handleSetPrimaryImage(img.id)}
                              className="text-muted-foreground hover:text-primary transition-colors text-[11px] font-medium"
                            >
                              Make Primary
                            </button>
                          ) : (
                            <span className="text-primary text-[11px] font-medium">Cover</span>
                          )}

                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                            title="Delete image"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Image Form */}
              <div className="bg-muted/30 border rounded-xl p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center space-x-1.5">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span>Add New Photo</span>
                </h4>

                {imageError && (
                  <div className="p-2.5 bg-destructive/15 text-destructive rounded-lg text-xs mb-3">
                    {imageError}
                  </div>
                )}

                <form onSubmit={handleAddImage} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Direct Image URL <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://ik.imagekit.io/... or https://images.unsplash.com/..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-background border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Alt Label / Caption
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Keyboard view, Side ports"
                        value={newImageAlt}
                        onChange={(e) => setNewImageAlt(e.target.value)}
                        className="w-full px-3 py-2 bg-background border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-5">
                      <input
                        type="checkbox"
                        id="primaryCheck"
                        checked={newImagePrimary}
                        onChange={(e) => setNewImagePrimary(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="primaryCheck" className="text-xs text-foreground cursor-pointer">
                        Set as Primary / Main Cover Image
                      </label>
                    </div>
                  </div>

                  {newImageUrl && (
                    <div className="pt-2">
                      <span className="text-[11px] text-muted-foreground block mb-1">Live URL Preview:</span>
                      <div className="h-24 w-28 bg-white border rounded-lg p-1 flex items-center justify-center">
                        <img
                          src={newImageUrl}
                          alt="preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=Preview+Error';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={imageSubmitting}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors shadow disabled:opacity-50"
                    >
                      {imageSubmitting ? 'Uploading...' : 'Add Photo'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="px-6 py-3 border-t bg-muted/20 flex justify-end shrink-0">
              <button
                type="button"
                onClick={handleCloseImageModal}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

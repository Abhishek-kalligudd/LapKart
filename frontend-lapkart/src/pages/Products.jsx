import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingCart,
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ProductGridSkeleton } from '../components/Skeleton';

const brands = ['ALL', 'Apple', 'Dell', 'Asus', 'HP', 'Acer', 'Samsung', 'Gigabyte'];
const categories = ['ALL', 'Gaming', 'Office Use', 'Chromebooks'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/login?redirect=/products');
      return;
    }

    setAddingId(product.id);
    setErrorMessage('');
    const res = await addToCart(product.id, 1);
    setAddingId(null);

    if (res.success) {
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    } else {
      setErrorMessage(res.error || 'Failed to add product to cart');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.processor?.toLowerCase().includes(query) ||
        product.gpu?.toLowerCase().includes(query);

      // Brand matching
      const matchBrand =
        selectedBrand === 'ALL' ||
        product.brand?.toLowerCase() === selectedBrand.toLowerCase();

      // Category matching
      const matchCategory =
        selectedCategory === 'ALL' ||
        product.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
        product.category?.slug?.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchBrand && matchCategory;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // featured/default
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedCategory('ALL');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen py-10 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            All Laptop Models & Rigs
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Explore our curated inventory of enterprise ultrabooks, content creator powerhouses, and heavy-duty esports gaming machines.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-card border rounded-2xl p-5 mb-8 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by laptop name, processor, GPU, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 flex items-center justify-end gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-3 border-t flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-muted-foreground uppercase text-[11px] mr-1">Category:</span>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                    selectedCategory === c
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-muted-foreground uppercase text-[11px] mr-1">Brand:</span>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                    selectedBrand === b
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Product Grid */}
        <div className="flex justify-between items-center mb-6 text-xs text-muted-foreground">
          <span>Showing <strong className="text-foreground">{filteredProducts.length}</strong> machines</span>
          {(searchQuery || selectedBrand !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Matching Machines Found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We couldn't find any laptops matching your current filter criteria.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:bg-primary/90 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="aspect-[4/3] overflow-hidden bg-muted/40 p-4 flex items-center justify-center relative cursor-pointer"
                >
                  <img
                    src={product.productImgs?.[0]?.imageUrl || 'https://via.placeholder.com/400x300?text=Laptop'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.brand && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur px-2.5 py-0.5 rounded-full border">
                      {product.brand}
                    </span>
                  )}
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-sm">
                      Sale
                    </span>
                  )}
                </Link>

                <div className="p-5 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`} className="group-hover:text-primary transition-colors">
                    <h3 className="font-bold text-base mb-1 line-clamp-1">{product.name}</h3>
                  </Link>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {product.processor ? `${product.processor} • ${product.ramGb ? product.ramGb + 'GB RAM' : ''} • ${product.storage || ''}` : product.description}
                  </p>

                  <div className="mt-auto pt-3 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.discountPrice && product.discountPrice < product.price ? (
                        <>
                          <span className="text-lg font-bold text-primary">₹{product.discountPrice}</span>
                          <span className="text-[11px] text-muted-foreground line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">₹{product.price}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/product/${product.id}`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Specs"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingId === product.id}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          addedId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Added</span>
                          </>
                        ) : addingId === product.id ? (
                          <span>...</span>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShoppingCart,
  Eye,
  Check,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  Flame,
  Award
} from 'lucide-react';
import { api } from '../api/axios';
import { ProductGridSkeleton } from '../components/Skeleton';
import LookbackHero from '../components/LookbackHero';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/public/products');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product.id);
    setErrorMessage('');

    const res = await addToCart(product, 1);
    setAddingId(null);

    if (res.success) {
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    } else {
      setErrorMessage(res.error || 'Failed to add product to cart');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleToggleWishlist = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  const curatedFlagships = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ======================================================== */}
      {/* 1. LOOKBACK KINETIC SLIDING SHOWCASE (TOP 9 LAPTOPS)     */}
      {/* ======================================================== */}
      <LookbackHero
        products={products}
        loading={loading}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        addingId={addingId}
        addedId={addedId}
      />

      {/* ======================================================== */}
      {/* 3. CURATED FLAGSHIPS SECTION                             */}
      {/* ======================================================== */}
      <section id="curated-flagships" className="py-24 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Peak Hardware Benchmarks
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Curated Flagships
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              A hand-picked selection of our top benchmark-scoring laptops ready for dispatch.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-extrabold text-primary hover:underline flex items-center gap-1.5"
          >
            <span>View Complete Inventory (25+ Laptops)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {errorMessage && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center border border-destructive/20 font-medium">
            {errorMessage}
          </div>
        )}

        {/* 4 Flagship Laptops Grid or Shimmer Loading Skeleton */}
        {loading ? (
          <div className="mb-14">
            <ProductGridSkeleton count={4} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-14">
            {curatedFlagships.map((product) => {
              const isWishlisted = wishlistIds.has(product.id);
              const isLowStock = product.stockQuantity != null && product.stockQuantity <= 5 && product.stockQuantity > 0;
              const isOutOfStock = product.stockQuantity === 0;

              return (
                <div
                  key={product.id}
                  className="bg-card rounded-3xl overflow-hidden shadow-sm border hover:shadow-2xl transition-all duration-300 group flex flex-col p-5 relative"
                >
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => handleToggleWishlist(product, e)}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    className={`absolute top-8 right-8 z-10 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'bg-red-500 text-white border-red-500 shadow-md scale-105'
                        : 'bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 hover:border-red-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    className="aspect-[4/3] overflow-hidden bg-muted/40 rounded-2xl p-4 flex items-center justify-center relative cursor-pointer mb-4"
                  >
                    <img
                      src={product.productImgs?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {isLowStock && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold">
                        Only {product.stockQuantity} Left!
                      </span>
                    )}
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold uppercase text-primary tracking-wider">
                        {product.brand}
                      </span>
                      {product.discountPrice && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                          Save ₹{product.price - product.discountPrice}
                        </span>
                      )}
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-extrabold text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-4 flex-1">
                      {product.description || `${product.processor} • ${product.ramGb}GB RAM • ${product.storage}`}
                    </p>

                    <div className="pt-3 border-t flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black text-foreground">
                          ₹{product.discountPrice || product.price}
                        </div>
                        {product.discountPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            ₹{product.price}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={addingId === product.id || isOutOfStock}
                        className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                          addedId === product.id
                            ? 'bg-emerald-500 text-white scale-105'
                            : isOutOfStock
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md shadow-primary/20'
                        }`}
                        title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      >
                        {addedId === product.id ? (
                          <Check className="w-5 h-5" />
                        ) : addingId === product.id ? (
                          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all text-sm shadow-sm"
          >
            <span>Explore Entire 25+ Laptop Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

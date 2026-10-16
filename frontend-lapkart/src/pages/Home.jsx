import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShoppingCart,
  Eye,
  Check
} from 'lucide-react';
import { api } from '../api/axios';
import LaptopHero3D from '../components/LaptopHero3D';
import { ProductGridSkeleton } from '../components/Skeleton';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

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
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/login?redirect=/');
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

  // Curate ONLY 4 flagship laptops for the bottom section
  const curatedFlagships = products.slice(0, 4);

  const tickerItems = [
    'APPLE M5 PRO CHIPS',
    'NVIDIA GEFORCE RTX 4090',
    '240HZ DYNAMIC AMOLED',
    'CRYO-VAPOR LIQUID COOLING',
    'INTEL CORE ULTRA 9',
    '45+ TOPS NEURAL NPU',
    'AEROSPACE UNIBODY RIGIDITY',
    'ZERO THERMAL THROTTLING',
    '100% DCI-P3 COLOR ACCURACY',
    'DIRECT BRAND WARRANTY',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ======================================================== */}
      {/* 1. 3D INTERACTIVE ANIMATED LAPTOP SHOWCASE (HERO)        */}
      {/* ======================================================== */}
      <LaptopHero3D />

      {/* ======================================================== */}
      {/* 2. INFINITE KINETIC MARQUEE TICKER                       */}
      {/* ======================================================== */}
      <div className="py-5 bg-foreground text-background border-y overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex gap-8 items-center text-xs sm:text-sm font-black uppercase tracking-widest">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-cyan-400">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CURATED FLAGSHIPS (SHOWN AT VERY BOTTOM AS REQUESTED) */}
      {/* ======================================================== */}
      <section className="py-24 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Curated Flagships
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              A hand-picked selection of our top benchmark-scoring laptops.
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
          {curatedFlagships.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-3xl overflow-hidden shadow-sm border hover:shadow-2xl transition-all duration-300 group flex flex-col p-5"
            >
              <Link
                to={`/product/${product.id}`}
                className="aspect-[4/3] overflow-hidden bg-muted/40 rounded-2xl p-4 flex items-center justify-center relative cursor-pointer mb-4"
              >
                <img
                  src={product.productImgs?.[0]?.imageUrl || 'https://via.placeholder.com/400x300?text=Laptop'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {product.brand && (
                  <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-background/80 backdrop-blur px-2.5 py-0.5 rounded-full border">
                    {product.brand}
                  </span>
                )}
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-sm">
                    Sale
                  </span>
                )}
              </Link>

              <div className="flex-1 flex flex-col">
                <Link to={`/product/${product.id}`} className="group-hover:text-primary transition-colors">
                  <h3 className="font-extrabold text-base mb-1 line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {product.processor ? `${product.processor} • ${product.ramGb ? product.ramGb + 'GB RAM' : ''}` : product.description}
                </p>

                <div className="mt-auto pt-3 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.discountPrice && product.discountPrice < product.price ? (
                      <>
                        <span className="text-lg font-black text-primary">₹{product.discountPrice}</span>
                        <span className="text-[11px] text-muted-foreground line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-black">₹{product.price}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/product/${product.id}`}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
            </div>
          ))}
        </div>
        )}

        {/* Big CTA Banner to View All Machines */}
        <div className="bg-gradient-to-r from-card via-muted/40 to-card border rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-black mb-3">
            Looking for a Specific Model or Budget?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
            Filter our entire warehouse catalog by processor generation, graphics capability, RAM, and official category ratings.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-black text-sm shadow-xl hover:scale-105 transition-all hover:bg-primary/90"
          >
            <span>Explore All 27+ Laptops in Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

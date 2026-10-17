import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Eye,
  Check,
  Sparkles
} from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';

export default function Wishlist() {
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const [movingId, setMovingId] = useState(null);
  const [movedId, setMovedId] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleMoveToCart = async (product) => {
    setMovingId(product.id);
    const res = await addToCart(product, 1);
    setMovingId(null);
    if (res.success) {
      setMovedId(product.id);
      setTimeout(async () => {
        await removeFromWishlist(product.id);
        setMovedId(null);
      }, 900);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[75vh]">
      <div className="mb-8 pb-4 border-b flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Saved Flagships
          </div>
          <h1 className="text-3xl font-black tracking-tight">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? 'laptop' : 'laptops'} saved for later
          </p>
        </div>

        {items.length > 0 && (
          <Link
            to="/products"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold">Your Wishlist is Empty</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Found a dream laptop? Click the heart icon on any machine in our catalog to save it here for easy review and checkout!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all mt-2"
          >
            <span>Explore Flagship Laptops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-card border rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col group relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/product/${product.id}`}
                  className="aspect-[4/3] bg-muted/30 rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={product.productImgs?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider mb-1">
                    {product.brand}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1 mb-4 flex-1">
                    {product.processor} • {product.ramGb}GB RAM
                  </p>

                  <div className="pt-3 border-t flex justify-between items-baseline mb-4">
                    <div>
                      <span className="text-base font-black text-foreground">
                        {formatCurrency(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through ml-2">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={movingId === product.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                      movedId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {movedId === product.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Moved to Cart</span>
                      </>
                    ) : movingId === product.id ? (
                      <span>Moving...</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Move to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  Heart,
  ArrowUpRight,
  MoveHorizontal
} from 'lucide-react';

export default function LookbackHero({
  products = [],
  loading = false,
  wishlistIds = new Set(),
  onToggleWishlist,
  onAddToCart,
  addingId,
  addedId
}) {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  // Performance-optimized drag refs (Zero state re-renders during mousemove)
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const rafIdRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPointerActive, setIsPointerActive] = useState(false);

  // Take top 9 laptops from the database
  const top9Laptops = products.slice(0, 9);

  // Throttled scroll listener using RequestAnimationFrame
  const updateScrollState = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const atStart = scrollLeft <= 10;
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 10;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);

    const cardWidth = 360 + 24; // card width + gap
    const index = Math.min(
      Math.max(0, Math.round(scrollLeft / cardWidth)),
      Math.max(0, top9Laptops.length - 1)
    );
    setActiveIndex((prev) => (prev !== index ? index : prev));
  }, [top9Laptops.length]);

  const onScroll = useCallback(() => {
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(() => {
      updateScrollState();
      rafIdRef.current = null;
    });
  }, [updateScrollState]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', onScroll, { passive: true });
    updateScrollState();
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [onScroll, updateScrollState]);

  // Pointer drag events with hardware capture (Smooth, jitter-free 60/120fps)
  const onPointerDown = (e) => {
    if (!trackRef.current) return;
    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
    setIsPointerActive(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDownRef.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onPointerUp = (e) => {
    isDownRef.current = false;
    setIsPointerActive(false);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if pointer capture was already released
    }
  };

  // Ultra-responsive mousewheel horizontal translation
  const onWheel = (e) => {
    if (!trackRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 2) {
      trackRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  const handleCardClick = (product, e) => {
    // If user dragged, cancel navigation so it doesn't accidentally open page
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    navigate(`/product/${product.id}`);
  };

  // Nav Arrow Buttons with smooth scroll
  const scroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = 380;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') scroll('left');
    if (e.key === 'ArrowRight') scroll('right');
  };

  const cardTints = [
    'from-blue-950/20 via-slate-900/10 to-transparent',
    'from-indigo-950/20 via-slate-900/10 to-transparent',
    'from-emerald-950/20 via-slate-900/10 to-transparent',
    'from-amber-950/20 via-slate-900/10 to-transparent',
    'from-purple-950/20 via-slate-900/10 to-transparent',
    'from-cyan-950/20 via-slate-900/10 to-transparent',
    'from-rose-950/20 via-slate-900/10 to-transparent',
    'from-teal-950/20 via-slate-900/10 to-transparent',
    'from-violet-950/20 via-slate-900/10 to-transparent'
  ];

  return (
    <section
      className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden bg-background border-b border-border/40 select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Top Laptops Lookbook"
    >
      {/* Editorial Watermark Background */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none select-none -z-10 opacity-[0.03] dark:opacity-[0.05] text-[16vw] font-black tracking-tighter leading-none whitespace-nowrap text-foreground">
        LOOKBOOK 2026
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Editorial Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>THE 2026 HARDWARE ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[0.95]">
              Curated Rig <br />
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Lookbook & Showcase.
              </span>
            </h1>
          </div>

          {/* Navigation Controls & Reactive Counter */}
          <div className="flex items-center gap-4 self-start md:self-end">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-mono tracking-wider font-bold shadow-sm">
              <span className="text-primary">
                [{String(activeIndex + 1).padStart(2, '0')} / {String(top9Laptops.length || 9).padStart(2, '0')}]
              </span>
              <span className="hidden sm:inline text-muted-foreground text-[10px] uppercase">
                • DRAG TO EXPLORE
              </span>
              <MoveHorizontal className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous Laptop"
                className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'bg-white/[0.05] hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-sm'
                    : 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next Laptop"
                className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'bg-white/[0.05] hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-sm'
                    : 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kinetic Drag Carousel Track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className={`flex gap-6 overflow-x-auto scrollbar-none px-4 sm:px-8 md:px-12 pb-4 ${
          isPointerActive ? 'cursor-grabbing select-none' : 'cursor-grab'
        } overscroll-x-contain touch-pan-x`}
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {loading ? (
          Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 animate-pulse"
            >
              <div className="h-4 w-24 bg-muted/40 rounded mb-2" />
              <div className="aspect-[4/5] bg-muted/20 rounded-3xl" />
              <div className="h-4 w-3/4 bg-muted/40 rounded mt-3" />
            </div>
          ))
        ) : (
          top9Laptops.map((product, idx) => {
            const isWishlisted = wishlistIds.has(product.id);
            const isOutOfStock = product.stockQuantity === 0;
            const primaryImage =
              product.productImgs?.[0]?.imageUrl ||
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600';
            const tintClass = cardTints[idx % cardTints.length];

            return (
              <article
                key={product.id}
                onClick={(e) => handleCardClick(product, e)}
                className={`group relative w-[290px] sm:w-[330px] md:w-[360px] flex-shrink-0 select-none transform-gpu ${
                  isPointerActive ? 'pointer-events-none' : ''
                }`}
              >
                {/* Lookback Top Reveal Label */}
                <div className="overflow-hidden mb-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="overflow-hidden">
                    <span className="inline-block md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out font-black text-primary tracking-wider">
                      NO. {String(idx + 1).padStart(2, '0')} // 09
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <span className="inline-block md:transform md:-translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out text-muted-foreground uppercase text-[11px] font-semibold">
                      {product.brand} • {product.category?.name || 'LAPTOP'}
                    </span>
                  </div>
                </div>

                {/* Aspect-Ratio Framing Container */}
                <div
                  className={`aspect-[4/5] rounded-3xl border border-white/10 bg-gradient-to-b ${tintClass} bg-card/70 relative overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:border-white/20 transition-all duration-300 flex flex-col justify-between p-6`}
                >
                  {/* Top Floating Info Chips */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {product.processor ? product.processor.split(' ')[0] : 'FLAGSHIP'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.(product, e);
                      }}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                        isWishlisted
                          ? 'bg-red-500 text-white border-red-500 shadow-md scale-105'
                          : 'bg-black/60 backdrop-blur-md border-white/10 text-muted-foreground hover:text-red-500 hover:border-red-400/50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Centered High-Res Laptop Media with 3D Float Hover */}
                  <div className="relative flex-1 flex items-center justify-center py-4">
                    <img
                      src={primaryImage}
                      alt={product.name}
                      loading="lazy"
                      draggable="false"
                      className="max-h-[190px] sm:max-h-[220px] w-auto object-contain drop-shadow-2xl group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Bottom Image Frame Banner (Price & Stock) */}
                  <div className="z-10 flex items-end justify-between">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                        ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-muted-foreground line-through font-mono">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product, e);
                      }}
                      disabled={addingId === product.id || isOutOfStock}
                      title={isOutOfStock ? 'Out of Stock' : 'Quick Add to Cart'}
                      className={`p-3 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                        addedId === product.id
                          ? 'bg-emerald-500 text-white scale-105'
                          : isOutOfStock
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-white/10'
                      }`}
                    >
                      {addedId === product.id ? (
                        <Check className="w-4 h-4" />
                      ) : addingId === product.id ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lookback Bottom Reveal Specifications */}
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base tracking-tight truncate group-hover:text-primary transition-colors flex-1">
                      {product.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-1" />
                  </div>

                  {/* Revealed Specs with Smooth Micro-Animation */}
                  <div className="overflow-hidden mt-1">
                    <p className="text-xs font-mono text-muted-foreground line-clamp-1 md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      {product.processor || 'High-Performance CPU'} • {product.ramGb || 16}GB RAM •{' '}
                      {product.storage || 'SSD'}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

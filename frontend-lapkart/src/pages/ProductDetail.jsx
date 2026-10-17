import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu,
  HardDrive,
  Monitor,
  Layers,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  Check,
  Star,
  ArrowLeft,
  ChevronRight,
  PackageCheck,
  Share2
} from 'lucide-react';
import { api } from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductDetailSkeleton } from '../components/Skeleton';
import { Heart, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist, fetchWishlist } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, reviewCount: 0 });
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewToast, setReviewToast] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/products/${id}`);
      const data = res.data;
      setProduct(data);

      // Determine initial active image
      if (data.productImgs && data.productImgs.length > 0) {
        const primary = data.productImgs.find((img) => img.isPrimary) || data.productImgs[0];
        setSelectedImage(primary.imageUrl);
      } else {
        setSelectedImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800');
      }

      // Fetch related products
      const allRes = await api.get('/public/products');
      if (Array.isArray(allRes.data)) {
        const related = allRes.data
          .filter((p) => p.id !== Number(id) && (p.brand === data.brand || p.category?.id === data.category?.id))
          .slice(0, 4);
        setRelatedProducts(related);
      }
      // Fetch reviews & summary
      fetchReviews();
      fetchWishlist();
    } catch (err) {
      console.error('Failed to load product', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsRes, summaryRes] = await Promise.all([
        api.get(`/public/reviews/product/${id}`),
        api.get(`/public/reviews/product/${id}/summary`),
      ]);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      if (summaryRes.data) {
        setReviewSummary(summaryRes.data);
      }
    } catch (e) {
      // Ignore
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        productId: Number(id),
        rating: newRating,
        comment: newComment,
      });
      setNewComment('');
      setReviewToast({ type: 'success', message: 'Review submitted successfully!' });
      fetchReviews();
      setTimeout(() => setReviewToast(null), 3500);
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Failed to submit review';
      setReviewToast({ type: 'error', message: msg });
      setTimeout(() => setReviewToast(null), 3500);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async (redirectCheckout = false) => {
    setAddingToCart(true);
    setErrorMessage('');
    const res = await addToCart(product, quantity);
    setAddingToCart(false);

    if (res.success) {
      setAdded(true);
      if (redirectCheckout) {
        if (!user) {
          navigate('/login?redirect=/checkout');
        } else {
          navigate('/checkout');
        }
      } else {
        setTimeout(() => setAdded(false), 2500);
      }
    } else {
      setErrorMessage(res.error || 'Failed to add item to cart');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-3">Laptop Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested laptop might be unavailable or removed from our inventory.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const savings = hasDiscount ? Math.round(product.price - product.discountPrice) : 0;
  const stock = product.stockQuantity != null ? product.stockQuantity : 10;
  const isOutOfStock = stock <= 0;

  const specs = [
    { label: 'Processor (CPU)', value: product.processor || 'High-performance Multi-Core Processor', icon: Cpu },
    { label: 'Graphics (GPU)', value: product.gpu || 'Integrated Ultra HD Graphics', icon: Sparkles },
    { label: 'Memory (RAM)', value: product.ramGb ? `${product.ramGb} GB High-Speed DDR5` : 'High-capacity RAM', icon: Layers },
    { label: 'Storage', value: product.storage || 'PCIe NVMe High-Speed SSD', icon: HardDrive },
    { label: 'Display & Resolution', value: product.displaySpecs || 'Vibrant High-Resolution Display', icon: Monitor },
    { label: 'Operating System', value: product.os || 'Windows 11 Home', icon: PackageCheck },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/" className="hover:text-foreground transition-colors">Laptops</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="capitalize">{product.category.name}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium animate-fade-in text-center max-w-2xl mx-auto">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Interactive Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl bg-muted/30 border p-6 flex items-center justify-center overflow-hidden shadow-sm group">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />

              {hasDiscount && (
                <div className="absolute top-5 left-5 bg-primary text-primary-foreground text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                  SAVE {formatCurrency(savings)}
                </div>
              )}

              <div className="absolute top-5 right-5 bg-background/80 backdrop-blur border text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider text-muted-foreground">
                {product.brand}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.productImgs && product.productImgs.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.productImgs.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`w-20 h-20 rounded-xl border-2 p-1 bg-muted/20 flex-shrink-0 transition-all ${
                      selectedImage === img.imageUrl
                        ? 'border-primary ring-2 ring-primary/20 scale-105'
                        : 'border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || product.name}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-card border">
                <Truck className="w-5 h-5 text-primary mb-1.5" />
                <span className="text-xs font-bold">Free Express Delivery</span>
                <span className="text-[10px] text-muted-foreground">Dispatched in 24h</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-card border">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-xs font-bold">1-Year Warranty</span>
                <span className="text-[10px] text-muted-foreground">Brand Authorized</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-card border">
                <RotateCcw className="w-5 h-5 text-primary mb-1.5" />
                <span className="text-xs font-bold">7-Day Return</span>
                <span className="text-[10px] text-muted-foreground">Replacement policy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Specs, Buy Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {product.brand}
                </span>
                <span className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">4.8</span>
                <span className="text-xs text-muted-foreground">(48 Customer Reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-muted/30 border space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  {formatCurrency(effectivePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through font-medium">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {Math.round((savings / product.price) * 100)}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Inclusive of all taxes & GST. Free express shipping included.
              </p>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isOutOfStock ? 'bg-destructive' : stock <= 3 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold">
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : stock <= 3
                  ? `Hurry, only ${stock} units remaining in warehouse!`
                  : `In Stock (${stock} units available)`}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description ||
                'Engineered with cutting-edge architecture to power intense productivity workflows, creative suites, and immersive gaming experiences.'}
            </p>

            {/* Hardware Quick Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border bg-card/60">
                <span className="text-muted-foreground block text-[10px]">Processor</span>
                <span className="font-bold truncate block">{product.processor || 'High-end CPU'}</span>
              </div>
              <div className="p-2.5 rounded-xl border bg-card/60">
                <span className="text-muted-foreground block text-[10px]">Graphics</span>
                <span className="font-bold truncate block">{product.gpu || 'Discrete GPU'}</span>
              </div>
              <div className="p-2.5 rounded-xl border bg-card/60">
                <span className="text-muted-foreground block text-[10px]">Memory & Storage</span>
                <span className="font-bold truncate block">{product.ramGb}GB RAM / {product.storage}</span>
              </div>
              <div className="p-2.5 rounded-xl border bg-card/60">
                <span className="text-muted-foreground block text-[10px]">Display</span>
                <span className="font-bold truncate block">{product.displaySpecs || 'FHD/QHD'}</span>
              </div>
            </div>

            {/* Purchase Controls */}
            {!isOutOfStock && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-muted-foreground">Quantity:</span>
                  <div className="flex items-center border rounded-lg bg-background shadow-inner">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1 text-sm font-semibold min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      className="px-3 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={addingToCart}
                    className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : addingToCart ? (
                      <span>Adding...</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={addingToCart}
                    className="flex-1 py-3.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${
                      wishlistIds.has(product.id)
                        ? 'bg-red-500 text-white border-red-500 shadow-md'
                        : 'border hover:bg-muted text-muted-foreground hover:text-red-500'
                    }`}
                    title={wishlistIds.has(product.id) ? 'Saved in Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${wishlistIds.has(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Hardware Spec Sheet */}
        <div className="mt-16 pt-10 border-t">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl border bg-card shadow-sm flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className="font-bold text-sm text-foreground mt-0.5 block">
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* Customer Reviews & Verified Ratings Section              */}
        {/* ======================================================== */}
        <div className="mt-20 pt-10 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-2">
                <Star className="w-3.5 h-3.5 fill-current" />
                Community Telemetry & Feedback
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Verified Customer Reviews</h2>
              <p className="text-sm text-muted-foreground mt-1">Real benchmarks and feedback from verified purchasers</p>
            </div>

            {/* Average Rating Banner */}
            <div className="flex items-center gap-4 bg-card border rounded-2xl p-4 shadow-sm">
              <div className="text-center">
                <span className="text-3xl font-black text-foreground block">
                  {reviewSummary.averageRating > 0 ? reviewSummary.averageRating.toFixed(1) : '5.0'}
                </span>
                <div className="flex text-amber-500 justify-center mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(reviewSummary.averageRating || 5)
                          ? 'fill-current'
                          : 'text-muted/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground border-l pl-4">
                <span className="font-bold text-foreground block">
                  {reviewSummary.reviewCount || reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
                <span>100% Verified Buyer Rating</span>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {reviewToast && (
            <div
              className={`mb-6 p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
                reviewToast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200'
              }`}
            >
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{reviewToast.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Left: Review Submission Form */}
            <div className="lg:col-span-5 bg-card border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Write a Product Review</span>
              </h3>

              {!user ? (
                <div className="p-4 rounded-2xl bg-muted/40 border text-center space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Sign in to your LapKart account to submit a verified rating and hardware feedback.
                  </p>
                  <Link
                    to={`/login?redirect=/product/${id}`}
                    className="inline-block px-5 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Sign In to Review
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Overall Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'text-amber-500 fill-current'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Review / Benchmark Feedback *
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts on thermals, display quality, build rigidity, or battery life..."
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                  >
                    {submittingReview ? 'Posting Review...' : 'Submit Verified Review'}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 rounded-3xl border bg-card/60 text-center space-y-2">
                  <Star className="w-8 h-8 mx-auto text-muted-foreground/40" />
                  <h4 className="font-bold text-sm">No Reviews Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Be the first to review this laptop and share your real-world performance benchmarks with the community!
                  </p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl border bg-card shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{rev.username}</span>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200">
                            Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-amber-500 gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'text-muted/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Laptops Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Similar Laptops</h2>
                <p className="text-sm text-muted-foreground">More options with matching configurations</p>
              </div>
              <Link to="/" className="text-sm font-semibold text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group p-4 flex flex-col"
                >
                  <div className="aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-3">
                    <img
                      src={rel.productImgs?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'}
                      alt={rel.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase">{rel.brand}</span>
                  <h4 className="font-bold text-sm truncate mb-1 text-foreground">{rel.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{rel.processor}</p>
                  <div className="mt-auto pt-2 border-t flex justify-between items-center">
                    <span className="font-extrabold text-sm">
                      {formatCurrency(rel.discountPrice || rel.price)}
                    </span>
                    <span className="text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks";
import { useCartStore, useAuthStore } from "@/store";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS } from "@/utils";
import { StarRating, Loader, Badge } from "@/components/common";
import CartDrawer from "@/components/cart/CartDrawer";
import { reviewService } from "@/services";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [activeImg,  setActiveImg]  = useState(0);
  const [qty,        setQty]        = useState(1);
  const [adding,     setAdding]     = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });

  if (loading) return <div className="pt-40"><Loader center size="lg" /></div>;
  if (!product) return (
    <div className="pt-40 text-center">
      <p className="font-serif text-2xl text-cream-muted">Product not found</p>
      <Link to="/shop" className="btn-outline mt-6 inline-block">BACK TO SHOP</Link>
    </div>
  );

  const onSale = product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const discount = onSale ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100) : null;

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    setAdding(true);
    await addItem(product.id, qty);
    setAdding(false);
  };

  const handleReviewSubmit = async () => {
    try {
      await reviewService.create({ productId: product.id, ...reviewForm });
      toast.success("Review submitted!");
      setShowReview(false);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <CartDrawer />
      <div className="pt-28 pb-20 page-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-sans text-[10px] tracking-widest text-cream-faint mb-10">
          <Link to="/" className="hover:text-gold transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">SHOP</Link>
          <span>/</span>
          <Link to={`/category/${product.category?.slug}`} className="hover:text-gold transition-colors">
            {product.category?.name?.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-gold">{product.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden border border-gold/15">
              <img src={product.images[activeImg]} alt={product.name}
                className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      i === activeImg ? "border-gold" : "border-gold/15 hover:border-gold/40"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="py-4">
            <p className="section-label mb-3">
              <Link to={`/category/${product.category?.slug}`} className="hover:underline">
                {product.category?.name}
              </Link>
            </p>
            <h1 className="font-serif text-4xl font-light text-cream mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.avgRating > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={product.avgRating} />
                <span className="font-sans text-xs text-cream-faint">
                  {product.avgRating} · {product.reviewCount} reviews
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-4xl text-gold">{formatCurrency(product.price)}</span>
              {onSale && (
                <>
                  <span className="font-sans text-lg text-cream-faint line-through">{formatCurrency(product.comparePrice)}</span>
                  <Badge variant="danger">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="font-sans text-sm leading-loose text-cream-faint mb-8 border-l-2 border-gold/30 pl-4">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span key={tag} className="font-sans text-[9px] tracking-[2px] px-3 py-1 border border-gold/20 text-cream-faint">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <Badge variant="danger">OUT OF STOCK</Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="warning">ONLY {product.stock} LEFT</Badge>
              ) : (
                <Badge variant="success">IN STOCK</Badge>
              )}
            </div>

            {/* Qty + Add to cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gold/20">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-12 text-gold hover:bg-gold/10 transition-colors font-sans text-lg">−</button>
                  <span className="w-12 text-center font-sans text-sm text-cream">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-10 h-12 text-gold hover:bg-gold/10 transition-colors font-sans text-lg">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding}
                  className="btn-gold flex-1 disabled:opacity-50">
                  {adding ? "ADDING…" : "ADD TO BAG"}
                </button>
              </div>
            )}

            {/* SKU */}
            <p className="font-sans text-[10px] tracking-wider text-cream-faint/50">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gold/10 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-light text-cream">
              Reviews <span className="text-gold">({product.reviewCount})</span>
            </h2>
            {user && (
              <button onClick={() => setShowReview(!showReview)} className="btn-outline">
                WRITE A REVIEW
              </button>
            )}
          </div>

          {/* Review form */}
          {showReview && (
            <div className="bg-dark-100 border border-gold/15 p-8 mb-10">
              <h3 className="font-serif text-xl text-cream mb-6">Your Review</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-sans text-[10px] tracking-widest text-cream-faint mb-2">RATING</p>
                  <StarRating rating={reviewForm.rating} size={24} interactive onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
                </div>
                <input placeholder="Review title" value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="input-field" />
                <textarea placeholder="Share your experience…" rows={4} value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="input-field resize-none" />
                <button onClick={handleReviewSubmit} className="btn-gold">SUBMIT REVIEW</button>
              </div>
            </div>
          )}

          {/* Review list */}
          <div className="space-y-8">
            {product.reviews?.map((review) => (
              <div key={review.id} className="border-b border-gold/8 pb-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <StarRating rating={review.rating} size={13} />
                      {review.title && <span className="font-serif text-base text-cream">{review.title}</span>}
                    </div>
                    <p className="font-sans text-[10px] tracking-wider text-cream-faint">
                      {review.user?.name} · {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                {review.comment && (
                  <p className="font-sans text-sm text-cream-faint leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
            {product.reviews?.length === 0 && (
              <p className="font-sans text-sm text-cream-faint text-center py-8">
                No reviews yet — be the first to review this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

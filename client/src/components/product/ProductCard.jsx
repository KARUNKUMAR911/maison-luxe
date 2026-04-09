import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore, useAuthStore } from "@/store";
import { formatCurrency } from "@/utils";
import { wishlistService } from "@/services";
import toast from "react-hot-toast";

const StarIcon = ({ filled = true }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const BADGE_STYLES = {
  "New":        "bg-gold text-dark",
  "Sale":       "bg-red-800 text-cream",
  "Bestseller": "bg-dark-300 text-cream border border-gold/30",
};

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const badge = product.isFeatured ? "Bestseller" : null;
  const onSale = product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const displayBadge = onSale ? "Sale" : badge;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to add items"); return; }
    setAdding(true);
    await addItem(product.id, 1);
    setAdding(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in"); return; }
    try {
      const res = await wishlistService.toggle(product.id);
      setWishlisted(res.data.data.wishlisted);
      toast.success(res.data.data.wishlisted ? "Added to wishlist" : "Removed from wishlist");
    } catch { toast.error("Failed to update wishlist"); }
  };

  const discount = onSale
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : null;

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />

          {/* Badge */}
          {displayBadge && (
            <div className={`absolute top-4 left-4 badge ${BADGE_STYLES[displayBadge] || "bg-dark-100 text-cream"}`}>
              {displayBadge.toUpperCase()}
            </div>
          )}

          {/* Discount */}
          {discount && (
            <div className="absolute top-4 right-4 badge bg-red-800/80 text-cream">
              -{discount}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-dark-100/80 border border-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-gold"
          >
            <HeartIcon filled={wishlisted} />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="w-full py-3 bg-gold text-dark font-sans text-[10px] tracking-[3px] font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? "ADDING…" : product.stock === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">
            {product.category?.name?.toUpperCase()}
          </p>
          <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors duration-200 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <StarIcon key={i} filled={i <= Math.round(product.avgRating)} />
                ))}
              </div>
              <span className="font-sans text-[10px] text-cream-faint">
                {product.avgRating} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-serif text-xl text-gold">{formatCurrency(product.price)}</span>
            {onSale && (
              <span className="font-sans text-xs text-cream-faint line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="font-sans text-[9px] tracking-wider text-amber-400 mt-2">
              ONLY {product.stock} LEFT
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

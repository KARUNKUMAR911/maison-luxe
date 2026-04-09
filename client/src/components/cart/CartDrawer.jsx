import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore, useAuthStore } from "@/store";
import { formatCurrency } from "@/utils";

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
  </svg>
);

export default function CartDrawer() {
  const { items, subtotal, open, setOpen, updateItem, removeItem, fetchCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => { if (user) fetchCart(); }, [user]);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const shippingCost = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shippingCost;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 z-[201] w-full max-w-[420px] bg-dark-100 border-l border-gold/20 flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gold/10">
          <div>
            <h2 className="font-serif text-2xl font-light text-cream">Your Bag</h2>
            <p className="font-sans text-[10px] tracking-[3px] text-cream-faint mt-0.5">
              {items.length} ITEM{items.length !== 1 ? "S" : ""}
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="text-cream-faint hover:text-gold transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 border border-gold/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-cream-faint">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="font-serif text-lg text-cream-muted">Your bag is empty</p>
              <Link to="/shop" onClick={() => setOpen(false)} className="btn-outline text-xs">
                EXPLORE COLLECTION
              </Link>
            </div>
          ) : items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-6 border-b border-gold/8">
              <Link to={`/products/${item.product.slug}`} onClick={() => setOpen(false)}
                className="w-20 h-20 flex-shrink-0 overflow-hidden border border-gold/15">
                <img src={item.product.images[0]} alt={item.product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[9px] tracking-[2px] text-gold mb-1">
                  {item.product.category?.name?.toUpperCase()}
                </p>
                <Link to={`/products/${item.product.slug}`} onClick={() => setOpen(false)}
                  className="font-serif text-base text-cream hover:text-gold transition-colors block truncate">
                  {item.product.name}
                </Link>
                <p className="font-serif text-gold mt-1">
                  {formatCurrency(Number(item.product.price) * item.quantity)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gold/20">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors font-sans text-base">
                      −
                    </button>
                    <span className="w-8 text-center font-sans text-xs text-cream">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors font-sans text-base">
                      +
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="text-cream-faint hover:text-red-400 transition-colors">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-gold/10 space-y-3">
            <div className="flex justify-between font-sans text-xs text-cream-faint">
              <span>SUBTOTAL</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-sans text-xs">
              <span className="text-cream-faint">SHIPPING</span>
              <span className={shippingCost === 0 ? "text-gold" : "text-cream-faint"}>
                {shippingCost === 0 ? "Complimentary" : formatCurrency(shippingCost)}
              </span>
            </div>
            {shippingCost > 0 && (
              <p className="font-sans text-[10px] text-cream-faint/60">
                Add {formatCurrency(500 - subtotal)} more for free shipping
              </p>
            )}
            <div className="flex justify-between pt-3 border-t border-gold/10">
              <span className="font-serif text-lg text-cream">Total</span>
              <span className="font-serif text-xl text-gold">{formatCurrency(total)}</span>
            </div>
            <Link to="/checkout" onClick={() => setOpen(false)} className="btn-gold w-full text-center block mt-2">
              PROCEED TO CHECKOUT
            </Link>
            <button onClick={() => setOpen(false)}
              className="w-full font-sans text-[10px] tracking-widest text-cream-faint hover:text-gold transition-colors py-2">
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </>
  );
}

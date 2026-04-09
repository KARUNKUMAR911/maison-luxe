import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "@/services";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/utils";
import { Loader } from "@/components/common";

const STEPS = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getById(id)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-40"><Loader center size="lg" /></div>;
  if (!order)  return <div className="pt-40 text-center"><p className="font-serif text-xl text-cream-muted">Order not found</p></div>;

  const stepIndex = STEPS.indexOf(order.status);
  const addr = order.shippingAddress;

  return (
    <div className="pt-28 pb-20 page-container max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/account/orders" className="font-sans text-[10px] tracking-widest text-cream-faint hover:text-gold transition-colors">
          ← ORDERS
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="section-label mb-2">Order #{order.orderNumber}</p>
          <h1 className="font-serif text-3xl font-light text-cream">Order Details</h1>
          <p className="font-sans text-xs text-cream-faint mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <span className={`font-sans text-[9px] tracking-[2px] px-3 py-1.5 font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
          <p className={`font-sans text-xs mt-2 ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
            Payment: {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Progress tracker */}
      {!["CANCELLED","REFUNDED"].includes(order.status) && (
        <div className="border border-gold/10 p-6 mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-px bg-gold/10" />
            <div className="absolute top-3 left-0 h-px bg-gold transition-all duration-500"
              style={{ width: `${Math.max(0, (stepIndex / (STEPS.length - 1)) * 100)}%` }} />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-6 h-6 rounded-full border-2 transition-colors duration-300 ${
                  i <= stepIndex ? "bg-gold border-gold" : "bg-dark border-gold/20"
                }`} />
                <span className={`font-sans text-[8px] tracking-wider hidden sm:block ${
                  i <= stepIndex ? "text-gold" : "text-cream-faint"
                }`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-xl text-cream mb-4">Items Ordered</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 border border-gold/10 p-4">
              {item.image && (
                <div className="w-16 h-16 border border-gold/10 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-serif text-base text-cream">{item.name}</p>
                <p className="font-sans text-xs text-cream-faint">Qty: {item.quantity}</p>
              </div>
              <p className="font-serif text-gold">{formatCurrency(Number(item.price) * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="border border-gold/10 p-6">
            <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-4">ORDER SUMMARY</h3>
            <div className="space-y-2 font-sans text-xs">
              <div className="flex justify-between text-cream-faint">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-cream-faint">
                <span>Shipping</span>
                <span>{Number(order.shippingCost) === 0 ? "Free" : formatCurrency(order.shippingCost)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span><span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gold/10">
                <span className="font-serif text-base text-cream">Total</span>
                <span className="font-serif text-lg text-gold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {addr && (
            <div className="border border-gold/10 p-6">
              <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-4">SHIPPING TO</h3>
              <div className="font-sans text-xs text-cream-faint space-y-1">
                <p className="text-cream">{addr.firstName} {addr.lastName}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.city}, {addr.state} {addr.zip}</p>
                <p>{addr.country}</p>
              </div>
            </div>
          )}

          {order.trackingNumber && (
            <div className="border border-gold/10 p-6">
              <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-2">TRACKING</h3>
              <p className="font-sans text-xs text-cream">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

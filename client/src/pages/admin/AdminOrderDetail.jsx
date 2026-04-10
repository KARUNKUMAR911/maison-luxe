import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService, adminService } from "@/services";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/utils";
import { Loader } from "@/components/common";
import toast from "react-hot-toast";

const STATUSES = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"];
const STEPS    = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED"];

export default function AdminOrderDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [order,    setOrder]   = useState(null);
  const [loading,  setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    orderService.getById(id)
      .then((res) => { setOrder(res.data.data); setTracking(res.data.data.trackingNumber || ""); })
      .catch(() => toast.error("Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await adminService.updateOrderStatus(id, { status, trackingNumber: tracking });
      setOrder((prev) => ({ ...prev, status }));
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackingUpdate = async () => {
    setUpdating(true);
    try {
      await adminService.updateOrderStatus(id, { status: order.status, trackingNumber: tracking });
      toast.success("Tracking number saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader center />;
  if (!order)  return (
    <div className="text-center py-20">
      <p className="font-serif text-xl text-cream-muted mb-4">Order not found</p>
      <button onClick={() => navigate("/admin/orders")} className="btn-outline">BACK TO ORDERS</button>
    </div>
  );

  const addr       = order.shippingAddress;
  const stepIndex  = STEPS.indexOf(order.status);
  const isCancelled = ["CANCELLED","REFUNDED"].includes(order.status);

  const paymentLabel = {
    upi:  "🔷 UPI",
    cod:  "💵 Cash on Delivery",
    card: "💳 Card",
    stripe: "💳 Stripe",
  }[order.paymentMethod] || "💳 Online";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/admin/orders")}
          className="font-sans text-[10px] tracking-widest text-cream-faint hover:text-gold transition-colors">
          ← BACK TO ORDERS
        </button>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ORDER</p>
          <h1 className="font-serif text-3xl font-light text-cream">{order.orderNumber}</h1>
          <p className="font-sans text-xs text-cream-faint mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <span className={`font-sans text-[9px] tracking-[2px] px-3 py-1.5 font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
          <span className={`font-sans text-xs ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
            Payment: {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <div className="border border-gold/15 p-6 mb-8">
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-6">ORDER PROGRESS</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-px bg-gold/10" />
            <div className="absolute top-3 left-0 h-px bg-gold transition-all duration-500"
              style={{ width: `${Math.max(0, (stepIndex / (STEPS.length - 1)) * 100)}%` }} />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
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

        {/* Left - main info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer info */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">CUSTOMER</p>
            <p className="font-sans text-sm text-cream">{order.user?.name}</p>
            <p className="font-sans text-xs text-cream-faint">{order.user?.email}</p>
          </div>

          {/* Shipping address */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">SHIPPING ADDRESS</p>
            {addr ? (
              <div className="font-sans text-xs space-y-1">
                <p className="text-cream font-semibold">{addr.firstName} {addr.lastName}</p>
                <p className="text-cream-faint">{addr.line1}</p>
                {addr.line2 && <p className="text-cream-faint">{addr.line2}</p>}
                <p className="text-cream-faint">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-cream-faint">{addr.country}</p>
              </div>
            ) : (
              <p className="font-sans text-xs text-cream-faint">No address on file</p>
            )}
          </div>

          {/* Payment info */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">PAYMENT</p>
            <div className="space-y-2 font-sans text-xs">
              <div className="flex justify-between">
                <span className="text-cream-faint">Method</span>
                <span className="text-cream">{paymentLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-faint">Status</span>
                <span className={PAYMENT_STATUS_COLORS[order.paymentStatus]}>{order.paymentStatus}</span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-cream-faint">Payment ID</span>
                  <span className="text-cream text-[10px]">{order.paymentId}</span>
                </div>
              )}
              {order.notes && (
                <div className="flex justify-between">
                  <span className="text-cream-faint">Notes</span>
                  <span className="text-cream">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-6">ORDER ITEMS</p>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gold/8 last:border-0 last:pb-0">
                  {item.image && (
                    <div className="w-16 h-16 border border-gold/10 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-serif text-base text-cream">{item.name}</p>
                    <p className="font-sans text-xs text-cream-faint">Qty: {item.quantity}</p>
                    <p className="font-sans text-xs text-cream-faint">Unit price: {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-serif text-gold">{formatCurrency(Number(item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - actions */}
        <div className="space-y-6">

          {/* Order total */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">ORDER TOTAL</p>
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
                <span className="font-serif text-lg text-cream">Total</span>
                <span className="font-serif text-xl text-gold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update status */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">UPDATE STATUS</p>
            <div className="space-y-2">
              {STATUSES.map((status) => (
                <button key={status} onClick={() => handleStatusUpdate(status)} disabled={updating || order.status === status}
                  className={`w-full text-left px-4 py-2.5 font-sans text-xs tracking-wider transition-all duration-200 border ${
                    order.status === status
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/10 text-cream-faint hover:border-gold/30 hover:text-gold"
                  } disabled:cursor-not-allowed`}>
                  {order.status === status ? "✓ " : ""}{status}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking number */}
          <div className="border border-gold/15 p-6">
            <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">TRACKING NUMBER</p>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full bg-dark-200 border border-white/10 text-cream font-sans text-sm px-3 py-2 placeholder:text-cream-faint focus:border-gold/50 transition-colors mb-3"
            />
            <button onClick={handleTrackingUpdate} disabled={updating} className="btn-gold w-full py-2 text-xs disabled:opacity-50">
              {updating ? "SAVING..." : "SAVE TRACKING"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

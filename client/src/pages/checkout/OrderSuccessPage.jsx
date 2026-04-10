import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "@/services";
import { formatCurrency, formatDate } from "@/utils";
import { Loader } from "@/components/common";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getById(id)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-40"><Loader center size="lg" /></div>;

  const paymentLabel = {
    upi:  { icon: "🔷", text: "UPI Payment",       note: "Open your UPI app and approve the payment request to confirm your order." },
    cod:  { icon: "💵", text: "Cash on Delivery",   note: "Please keep the exact amount ready when your order arrives." },
    card: { icon: "💳", text: "Card Payment",       note: "Payment processed. A confirmation email will be sent shortly." },
  }[order?.paymentMethod] || { icon: "💳", text: "Online Payment", note: "A confirmation email will be sent shortly." };

  return (
    <div className="pt-28 pb-20 page-container max-w-2xl mx-auto text-center">

      {/* Success icon */}
      <div className="w-20 h-20 border-2 border-gold mx-auto mb-8 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <p className="section-label mb-4">— Order Confirmed</p>
      <h1 className="font-serif text-4xl font-light text-cream mb-4">
        Thank You for Your<br /><em className="italic text-gold">Purchase</em>
      </h1>

      <p className="font-sans text-sm text-cream-faint mb-2">
        Your order <span className="text-gold font-semibold">{order?.orderNumber}</span> has been placed successfully.
      </p>
      <p className="font-sans text-xs text-cream-faint mb-6">
        {formatDate(order?.createdAt)}
      </p>

      {/* Payment method badge */}
      <div className="inline-flex items-center gap-3 border border-gold/20 px-6 py-3 mb-8">
        <span className="text-xl">{paymentLabel.icon}</span>
        <div className="text-left">
          <p className="font-sans text-[9px] tracking-[2px] text-cream-faint">PAYMENT METHOD</p>
          <p className="font-sans text-sm text-gold font-semibold">{paymentLabel.text}</p>
        </div>
      </div>

      {/* Payment note */}
      <div className={`border p-4 mb-8 ${
        order?.paymentMethod === "upi" ? "border-blue-400/30 bg-blue-400/5" :
        order?.paymentMethod === "cod" ? "border-amber-400/30 bg-amber-400/5" :
        "border-green-400/30 bg-green-400/5"
      }`}>
        <p className="font-sans text-sm text-cream-faint">{paymentLabel.note}</p>
      </div>

      {/* UPI specific instructions */}
      {order?.paymentMethod === "upi" && (
        <div className="border border-gold/15 p-6 mb-8 text-left">
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">COMPLETE YOUR UPI PAYMENT</p>
          <ol className="font-sans text-xs text-cream-faint space-y-2">
            <li>1. Open <strong className="text-cream">GPay, PhonePe, Paytm</strong> or any UPI app</li>
            <li>2. Go to <strong className="text-cream">Payment Requests</strong> or <strong className="text-cream">Collect Requests</strong></li>
            <li>3. Find the payment request from <strong className="text-cream">Maison Luxe</strong></li>
            <li>4. Approve the payment of <strong className="text-gold">{formatCurrency(order?.total)}</strong></li>
            <li>5. Your order will be confirmed automatically</li>
          </ol>
          <div className="mt-4 border-t border-gold/10 pt-4">
            <p className="font-sans text-[10px] text-cream-faint">
              UPI ID used: <span className="text-gold">{order?.notes?.replace("UPI ID: ", "")}</span>
            </p>
          </div>
        </div>
      )}

      {/* COD specific info */}
      {order?.paymentMethod === "cod" && (
        <div className="border border-gold/15 p-6 mb-8 text-left">
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">CASH ON DELIVERY DETAILS</p>
          <ul className="font-sans text-xs text-cream-faint space-y-2">
            <li>• Amount to keep ready: <strong className="text-gold">{formatCurrency(order?.total)}</strong></li>
            <li>• Our delivery partner will collect payment on arrival</li>
            <li>• Please keep exact change if possible</li>
            <li>• You will receive a delivery notification via SMS</li>
          </ul>
        </div>
      )}

      {/* Order summary */}
      {order && (
        <div className="border border-gold/15 p-8 text-left mb-10">
          <h2 className="font-sans text-[10px] tracking-[3px] text-gold mb-6">ORDER SUMMARY</h2>
          <div className="space-y-3 mb-6">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                {item.image && (
                  <div className="w-12 h-12 border border-gold/10 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-sans text-xs text-cream">{item.name}</p>
                  <p className="font-sans text-[10px] text-cream-faint">Qty: {item.quantity}</p>
                </div>
                <span className="font-serif text-sm text-gold">{formatCurrency(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/10 pt-4 space-y-2">
            <div className="flex justify-between font-sans text-xs text-cream-faint">
              <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between font-sans text-xs text-cream-faint">
              <span>Shipping</span>
              <span>{Number(order.shippingCost) === 0 ? "Free" : formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gold/10">
              <span className="font-serif text-lg text-cream">Total</span>
              <span className="font-serif text-xl text-gold">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Shipping address */}
      {order?.shippingAddress && (
        <div className="border border-gold/15 p-6 text-left mb-10">
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">DELIVERING TO</p>
          <p className="font-sans text-xs text-cream">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="font-sans text-xs text-cream-faint">{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p className="font-sans text-xs text-cream-faint">{order.shippingAddress.line2}</p>}
          <p className="font-sans text-xs text-cream-faint">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
          <p className="font-sans text-xs text-cream-faint">{order.shippingAddress.country}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={`/account/orders/${id}`} className="btn-outline">VIEW ORDER DETAILS</Link>
        <Link to="/shop" className="btn-gold">CONTINUE SHOPPING</Link>
      </div>
    </div>
  );
}

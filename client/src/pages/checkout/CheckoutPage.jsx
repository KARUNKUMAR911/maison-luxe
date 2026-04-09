import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store";
import { orderService, paymentService } from "@/services";
import { formatCurrency } from "@/utils";
import toast from "react-hot-toast";

const STEPS = ["Shipping", "Review", "Payment"];

export default function CheckoutPage() {
  const { items, subtotal, reset } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [placing, setPlacing] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", line1: "", line2: "",
    city: "", state: "", zip: "", country: "US",
  });

  const shippingCost = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shippingCost;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const required = ["firstName","lastName","line1","city","state","zip","country"];
    const missing = required.filter((k) => !shipping[k].trim());
    if (missing.length) { toast.error("Please fill all required fields"); return; }
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderRes = await orderService.place({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: shipping,
        paymentMethod: "stripe",
      });
      const order = orderRes.data.data;

      // Create Stripe payment intent
      await paymentService.createIntent({ orderId: order.id });

      reset();
      navigate(`/order-success/${order.id}`);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const inputClass = "w-full bg-dark-200 border border-white/10 text-cream font-sans text-sm px-4 py-3 placeholder:text-cream-faint focus:border-gold/50 transition-colors";
  const labelClass = "font-sans text-[10px] tracking-[2px] text-cream-faint block mb-1.5";

  if (items.length === 0) {
    return (
      <div className="pt-40 text-center page-container">
        <p className="font-serif text-2xl text-cream-muted mb-6">Your bag is empty</p>
        <button onClick={() => navigate("/shop")} className="btn-gold">CONTINUE SHOPPING</button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 page-container">
      <p className="section-label mb-3">— Checkout</p>
      <h1 className="font-serif text-4xl font-light text-cream mb-10">Secure Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-12 max-w-sm">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? "text-gold" : "text-cream-faint"}`}>
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-sans text-xs transition-colors ${
                i < step ? "bg-gold border-gold text-dark" : i === step ? "border-gold text-gold" : "border-gold/20 text-cream-faint"
              }`}>{i < step ? "✓" : i + 1}</div>
              <span className="font-sans text-[10px] tracking-widest hidden sm:block">{s.toUpperCase()}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-px mx-3 ${i < step ? "bg-gold" : "bg-gold/15"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left - form */}
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <form onSubmit={handleShippingSubmit} className="space-y-5">
              <h2 className="font-serif text-2xl text-cream mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>FIRST NAME *</label>
                  <input value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>LAST NAME *</label>
                  <input value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} className={inputClass} required />
                </div>
              </div>
              <div>
                <label className={labelClass}>ADDRESS LINE 1 *</label>
                <input value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} className={inputClass} placeholder="Street address" required />
              </div>
              <div>
                <label className={labelClass}>ADDRESS LINE 2</label>
                <input value={shipping.line2} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })} className={inputClass} placeholder="Apartment, suite, etc." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CITY *</label>
                  <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>STATE *</label>
                  <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className={inputClass} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>ZIP CODE *</label>
                  <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>COUNTRY *</label>
                  <select value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className={inputClass}>
                    <option value="US" className="bg-dark-100">United States</option>
                    <option value="GB" className="bg-dark-100">United Kingdom</option>
                    <option value="FR" className="bg-dark-100">France</option>
                    <option value="DE" className="bg-dark-100">Germany</option>
                    <option value="AE" className="bg-dark-100">UAE</option>
                    <option value="SA" className="bg-dark-100">Saudi Arabia</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-gold w-full mt-4">CONTINUE TO REVIEW</button>
            </form>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl text-cream mb-6">Review Order</h2>
              <div className="space-y-3 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border border-gold/10 p-4">
                    <div className="w-16 h-16 border border-gold/10 overflow-hidden flex-shrink-0">
                      <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-base text-cream">{item.product?.name}</p>
                      <p className="font-sans text-xs text-cream-faint">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-gold">{formatCurrency(Number(item.product?.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border border-gold/15 p-6 mb-6">
                <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-4">SHIPPING TO</h3>
                <p className="font-sans text-xs text-cream">{shipping.firstName} {shipping.lastName}</p>
                <p className="font-sans text-xs text-cream-faint">{shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ""}</p>
                <p className="font-sans text-xs text-cream-faint">{shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
                <button onClick={() => setStep(0)} className="font-sans text-[10px] tracking-widest text-gold hover:text-gold-light mt-3">
                  EDIT ADDRESS
                </button>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="btn-ghost flex-1">BACK</button>
                <button onClick={() => setStep(2)} className="btn-gold flex-1">CONTINUE TO PAYMENT</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl text-cream mb-6">Payment</h2>
              <div className="border border-gold/15 p-8 mb-6">
                <p className="font-sans text-[10px] tracking-[3px] text-gold mb-4">SECURE PAYMENT</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>CARD NUMBER</label>
                    <input className={inputClass} placeholder="4242 4242 4242 4242" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>EXPIRY</label>
                      <input className={inputClass} placeholder="MM / YY" maxLength={7} />
                    </div>
                    <div>
                      <label className={labelClass}>CVC</label>
                      <input className={inputClass} placeholder="•••" maxLength={4} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 border-t border-gold/10 pt-4">
                  <span className="text-gold text-xs">🔒</span>
                  <p className="font-sans text-[10px] text-cream-faint">256-bit SSL encryption. Your payment info is never stored.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">BACK</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-gold flex-1 disabled:opacity-50">
                  {placing ? "PLACING ORDER…" : `PAY ${formatCurrency(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right - Order summary */}
        <div>
          <div className="border border-gold/15 p-6 sticky top-28">
            <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-6">ORDER SUMMARY</h3>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between font-sans text-xs">
                  <span className="text-cream-faint truncate mr-2">{item.product?.name} ×{item.quantity}</span>
                  <span className="text-cream flex-shrink-0">{formatCurrency(Number(item.product?.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gold/10 pt-4 space-y-2">
              <div className="flex justify-between font-sans text-xs text-cream-faint">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-xs">
                <span className="text-cream-faint">Shipping</span>
                <span className={shippingCost === 0 ? "text-gold" : "text-cream-faint"}>
                  {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gold/10">
                <span className="font-serif text-lg text-cream">Total</span>
                <span className="font-serif text-xl text-gold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

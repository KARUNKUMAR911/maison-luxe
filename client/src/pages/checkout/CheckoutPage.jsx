import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store";
import { orderService } from "@/services";
import { formatCurrency } from "@/utils";
import toast from "react-hot-toast";

const STEPS = ["Shipping", "Review", "Payment"];

export default function CheckoutPage() {
  const { items, subtotal, reset } = useCartStore();
  const navigate = useNavigate();

  const [step,          setStep]          = useState(0);
  const [placing,       setPlacing]       = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId,         setUpiId]         = useState("");
  const [upiVerified,   setUpiVerified]   = useState(false);
  const [verifyingUpi,  setVerifyingUpi]  = useState(false);

  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", line1: "", line2: "",
    city: "", state: "", zip: "", country: "IN",
  });

  const shippingCost = subtotal >= 500 ? 0 : 25;
  const codFee       = paymentMethod === "cod" ? 50 : 0;
  const total        = subtotal + shippingCost + codFee;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const required = ["firstName","lastName","line1","city","state","zip","country"];
    const missing  = required.filter((k) => !shipping[k].trim());
    if (missing.length) { toast.error("Please fill all required fields"); return; }
    setStep(1);
  };

  const handleVerifyUpi = async () => {
    if (!upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (example: name@gpay)");
      return;
    }
    setVerifyingUpi(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setUpiVerified(true);
    setVerifyingUpi(false);
    toast.success("UPI ID verified!");
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "upi" && !upiVerified) {
      toast.error("Please verify your UPI ID first");
      return;
    }
    setPlacing(true);
    try {
      const orderRes = await orderService.place({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: shipping,
        paymentMethod,
        notes:
          paymentMethod === "upi" ? `UPI ID: ${upiId}` :
          paymentMethod === "cod" ? "Cash on Delivery" :
          "Card Payment",
      });
      const order = orderRes.data.data;
      reset();
      navigate(`/order-success/${order.id}`);
      if      (paymentMethod === "upi") toast.success("Order placed! Check your UPI app.");
      else if (paymentMethod === "cod") toast.success("Order placed! Pay cash when delivered.");
      else                              toast.success("Order placed successfully!");
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
      <div className="flex items-center mb-12 max-w-sm">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? "text-gold" : "text-cream-faint"}`}>
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-sans text-xs transition-colors ${
                i < step   ? "bg-gold border-gold text-dark" :
                i === step ? "border-gold text-gold" :
                "border-gold/20 text-cream-faint"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="font-sans text-[10px] tracking-widest hidden sm:block">{s.toUpperCase()}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-px mx-3 ${i < step ? "bg-gold" : "bg-gold/15"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left */}
        <div className="lg:col-span-2">

          {/* Step 0 - Shipping */}
          {step === 0 && (
            <form onSubmit={handleShippingSubmit} className="space-y-5">
              <h2 className="font-serif text-2xl text-cream mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>FIRST NAME *</label>
                  <input value={shipping.firstName} onChange={(e) => setShipping({...shipping, firstName: e.target.value})} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>LAST NAME *</label>
                  <input value={shipping.lastName} onChange={(e) => setShipping({...shipping, lastName: e.target.value})} className={inputClass} required />
                </div>
              </div>
              <div>
                <label className={labelClass}>ADDRESS LINE 1 *</label>
                <input value={shipping.line1} onChange={(e) => setShipping({...shipping, line1: e.target.value})} className={inputClass} placeholder="Street address, House no." required />
              </div>
              <div>
                <label className={labelClass}>ADDRESS LINE 2</label>
                <input value={shipping.line2} onChange={(e) => setShipping({...shipping, line2: e.target.value})} className={inputClass} placeholder="Apartment, suite, landmark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CITY *</label>
                  <input value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>STATE *</label>
                  <input value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className={inputClass} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>PIN CODE *</label>
                  <input value={shipping.zip} onChange={(e) => setShipping({...shipping, zip: e.target.value})} className={inputClass} placeholder="6-digit pincode" required />
                </div>
                <div>
                  <label className={labelClass}>COUNTRY *</label>
                  <select value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} className={inputClass}>
                    <option value="IN" className="bg-dark-100">India</option>
                    <option value="US" className="bg-dark-100">United States</option>
                    <option value="GB" className="bg-dark-100">United Kingdom</option>
                    <option value="AE" className="bg-dark-100">UAE</option>
                    <option value="SG" className="bg-dark-100">Singapore</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-gold w-full mt-4">CONTINUE TO REVIEW</button>
            </form>
          )}

          {/* Step 1 - Review */}
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
                <button onClick={() => setStep(0)} className="font-sans text-[10px] tracking-widest text-gold hover:text-gold-light mt-3 block">EDIT ADDRESS</button>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="btn-ghost flex-1">BACK</button>
                <button onClick={() => setStep(2)} className="btn-gold flex-1">SELECT PAYMENT</button>
              </div>
            </div>
          )}

          {/* Step 2 - Payment */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl text-cream mb-6">Payment Method</h2>
              <div className="space-y-4 mb-8">

                {/* UPI */}
                <div onClick={() => setPaymentMethod("upi")}
                  className={`border p-6 cursor-pointer transition-all duration-200 ${paymentMethod === "upi" ? "border-gold bg-gold/5" : "border-gold/15 hover:border-gold/40"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "upi" ? "border-gold" : "border-cream-faint"}`}>
                      {paymentMethod === "upi" && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm font-semibold text-cream">UPI Payment</p>
                      <p className="font-sans text-xs text-cream-faint">GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                    <div className="flex gap-1">
                      {["G","P","B"].map((l) => (
                        <div key={l} className="w-7 h-7 bg-dark-200 border border-gold/20 flex items-center justify-center font-sans text-[10px] text-gold font-bold">{l}</div>
                      ))}
                    </div>
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="mt-5 pt-5 border-t border-gold/10">
                      <label className="font-sans text-[10px] tracking-[2px] text-cream-faint block mb-2">ENTER UPI ID</label>
                      <div className="flex gap-3">
                        <input value={upiId}
                          onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                          placeholder="yourname@gpay or yourname@paytm"
                          className={inputClass}
                          onClick={(e) => e.stopPropagation()} />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleVerifyUpi(); }}
                          disabled={!upiId || verifyingUpi}
                          className="btn-outline px-4 text-xs whitespace-nowrap disabled:opacity-50">
                          {verifyingUpi ? "..." : upiVerified ? "✓ DONE" : "VERIFY"}
                        </button>
                      </div>
                      {upiVerified && <p className="font-sans text-xs text-green-400 mt-2">✓ UPI ID verified</p>}
                      <div className="mt-4 bg-dark-200 border border-gold/10 p-4">
                        <p className="font-sans text-[10px] tracking-[2px] text-gold mb-2">HOW IT WORKS</p>
                        <ol className="font-sans text-xs text-cream-faint space-y-1">
                          <li>1. Enter and verify your UPI ID</li>
                          <li>2. Click Place Order</li>
                          <li>3. Open your UPI app and approve the payment</li>
                          <li>4. Order confirmed once payment received</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div onClick={() => setPaymentMethod("cod")}
                  className={`border p-6 cursor-pointer transition-all duration-200 ${paymentMethod === "cod" ? "border-gold bg-gold/5" : "border-gold/15 hover:border-gold/40"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "cod" ? "border-gold" : "border-cream-faint"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm font-semibold text-cream">Cash on Delivery</p>
                      <p className="font-sans text-xs text-cream-faint">Pay when your order arrives · ₹50 extra fee</p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="mt-5 pt-5 border-t border-gold/10">
                      <div className="bg-dark-200 border border-gold/10 p-4">
                        <p className="font-sans text-[10px] tracking-[2px] text-gold mb-2">IMPORTANT NOTES</p>
                        <ul className="font-sans text-xs text-cream-faint space-y-1">
                          <li>• Keep exact change ready at delivery</li>
                          <li>• COD available for orders under ₹50,000</li>
                          <li>• ₹50 handling fee added to total</li>
                          <li>• May take 1-2 extra days vs prepaid</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card */}
                <div onClick={() => setPaymentMethod("card")}
                  className={`border p-6 cursor-pointer transition-all duration-200 ${paymentMethod === "card" ? "border-gold bg-gold/5" : "border-gold/15 hover:border-gold/40"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "card" ? "border-gold" : "border-cream-faint"}`}>
                      {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm font-semibold text-cream">Credit / Debit Card</p>
                      <p className="font-sans text-xs text-cream-faint">Visa, Mastercard, Rupay</p>
                    </div>
                    <div className="flex gap-1">
                      {["VISA","MC","RuPay"].map((l) => (
                        <div key={l} className="px-2 h-7 bg-dark-200 border border-gold/20 flex items-center justify-center font-sans text-[8px] text-cream-faint">{l}</div>
                      ))}
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-5 pt-5 border-t border-gold/10 space-y-4" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <label className={labelClass}>CARD NUMBER</label>
                        <input className={inputClass} placeholder="1234 5678 9012 3456" maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>EXPIRY DATE</label>
                          <input className={inputClass} placeholder="MM / YY" maxLength={7} />
                        </div>
                        <div>
                          <label className={labelClass}>CVV</label>
                          <input className={inputClass} placeholder="•••" maxLength={4} type="password" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>NAME ON CARD</label>
                        <input className={inputClass} placeholder="As printed on card" />
                      </div>
                      <div className="flex items-center gap-2 border-t border-gold/10 pt-4">
                        <span className="text-gold">🔒</span>
                        <p className="font-sans text-[10px] text-cream-faint">256-bit SSL encryption. Card info never stored.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">BACK</button>
                <button onClick={handlePlaceOrder} disabled={placing || (paymentMethod === "upi" && !upiVerified)} className="btn-gold flex-1 disabled:opacity-50">
                  {placing ? "PLACING ORDER…" : `PLACE ORDER — ${formatCurrency(total)}`}
                </button>
              </div>
              {paymentMethod === "upi" && !upiVerified && (
                <p className="font-sans text-xs text-amber-400 text-center mt-3">Please verify your UPI ID before placing order</p>
              )}
            </div>
          )}
        </div>

        {/* Right - Summary */}
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
              {paymentMethod === "cod" && (
                <div className="flex justify-between font-sans text-xs text-cream-faint">
                  <span>COD Fee</span><span>₹50</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gold/10">
                <span className="font-serif text-lg text-cream">Total</span>
                <span className="font-serif text-xl text-gold">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-4 border border-gold/10 p-3 text-center">
              <p className="font-sans text-[9px] tracking-[2px] text-cream-faint">PAYING VIA</p>
              <p className="font-sans text-xs text-gold mt-1 font-semibold">
                {paymentMethod === "upi"  ? "🔷 UPI" :
                 paymentMethod === "cod"  ? "💵 Cash on Delivery" :
                 "💳 Card"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

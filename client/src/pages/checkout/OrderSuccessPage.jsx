import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "@/services";
import { formatCurrency, formatDate } from "@/utils";
import { Loader } from "@/components/common";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getById(id)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-40"><Loader center size="lg" /></div>;

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
        Your order <span className="text-gold">{order?.orderNumber}</span> has been placed.
      </p>
      <p className="font-sans text-xs text-cream-faint mb-10">
        A confirmation email will be sent shortly.
      </p>

      {order && (
        <div className="border border-gold/15 p-8 text-left mb-10">
          <h2 className="font-sans text-[10px] tracking-[3px] text-gold mb-6">ORDER SUMMARY</h2>
          <div className="space-y-3 mb-6">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between font-sans text-xs">
                <span className="text-cream-faint">{item.name} ×{item.quantity}</span>
                <span className="text-cream">{formatCurrency(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/10 pt-4 flex justify-between">
            <span className="font-serif text-lg text-cream">Total</span>
            <span className="font-serif text-xl text-gold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={`/account/orders/${id}`} className="btn-outline">VIEW ORDER DETAILS</Link>
        <Link to="/shop" className="btn-gold">CONTINUE SHOPPING</Link>
      </div>
    </div>
  );
}

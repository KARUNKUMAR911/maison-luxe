import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "@/services";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS } from "@/utils";
import { Loader, Pagination, Badge } from "@/components/common";

export default function OrdersPage() {
  const [orders, setOrders]     = useState([]);
  const [pagination, setPag]    = useState(null);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);

  useEffect(() => {
    setLoading(true);
    orderService.getAll({ page, limit: 10 })
      .then((res) => { setOrders(res.data.data); setPag(res.data.pagination); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="pt-28 pb-20 page-container max-w-4xl mx-auto">
      <p className="section-label mb-3">— Account</p>
      <h1 className="font-serif text-4xl font-light text-cream mb-10">My Orders</h1>

      {loading ? <Loader center /> : orders.length === 0 ? (
        <div className="text-center py-20 border border-gold/10">
          <p className="font-serif text-xl text-cream-muted mb-4">No orders yet</p>
          <Link to="/shop" className="btn-outline">START SHOPPING</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/account/orders/${order.id}`}
              className="block border border-gold/10 hover:border-gold/30 p-6 transition-all duration-200 group">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ORDER</p>
                  <p className="font-serif text-lg text-cream group-hover:text-gold transition-colors">{order.orderNumber}</p>
                  <p className="font-sans text-xs text-cream-faint mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`font-sans text-[9px] tracking-[2px] px-3 py-1 font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="font-serif text-xl text-gold mt-2">{formatCurrency(order.total)}</p>
                  <p className="font-sans text-[10px] text-cream-faint">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              {/* Item thumbnails */}
              {order.items?.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="w-12 h-12 border border-gold/10 overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 border border-gold/10 flex items-center justify-center">
                      <span className="font-sans text-[10px] text-cream-faint">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
          <Pagination pagination={pagination} onPage={setPage} />
        </div>
      )}
    </div>
  );
}

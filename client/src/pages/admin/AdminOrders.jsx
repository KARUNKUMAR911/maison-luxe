import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/services";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS } from "@/utils";
import { Loader, Pagination } from "@/components/common";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders,      setOrders]   = useState([]);
  const [pagination,  setPag]      = useState(null);
  const [loading,     setLoading]  = useState(true);
  const [page,        setPage]     = useState(1);
  const [search,      setSearch]   = useState("");
  const [statusFilter,setStatus]   = useState("");
  const navigate = useNavigate();

  const STATUSES = ["","PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"];

  const fetch = () => {
    setLoading(true);
    adminService.getAllOrders({ page, limit: 20, search: search||undefined, status: statusFilter||undefined })
      .then((res) => { setOrders(res.data.data); setPag(res.data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, search, statusFilter]);

  const handleStatusUpdate = async (id, status, e) => {
    e.stopPropagation();
    try {
      await adminService.updateOrderStatus(id, { status });
      toast.success("Status updated");
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ADMIN</p>
        <h1 className="font-serif text-3xl font-light text-cream">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by order # or email…"
          className="bg-dark-200 border border-white/10 text-cream font-sans text-sm px-4 py-2 w-64 placeholder:text-cream-faint focus:border-gold/50 transition-colors" />
        <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-dark-200 border border-white/10 text-cream font-sans text-sm px-4 py-2 focus:border-gold/50 transition-colors">
          {STATUSES.map((s) => <option key={s} value={s} className="bg-dark-100">{s || "All Statuses"}</option>)}
        </select>
      </div>

      {loading ? <Loader center /> : (
        <>
          <div className="border border-gold/15 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  {["Order #","Customer","Date","Payment","Total","Status","Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-[9px] tracking-[3px] text-gold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="border-b border-gold/8 hover:bg-gold/5 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-sans text-xs text-cream">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-xs text-cream">{order.user?.name}</p>
                      <p className="font-sans text-[10px] text-cream-faint">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-faint">
                      {formatDate(order.createdAt, { month:"short", day:"numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-sans text-xs text-cream-faint capitalize">
                        {order.paymentMethod === "cod"  ? "💵 COD"  :
                         order.paymentMethod === "upi"  ? "🔷 UPI"  :
                         "💳 Card"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-gold">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] tracking-wider px-2 py-0.5 ${ORDER_STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="font-sans text-[10px] tracking-wider text-gold hover:text-gold-light transition-colors border border-gold/30 px-2 py-1">
                          VIEW
                        </button>
                        <select value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value, e)}
                          className="bg-dark-200 border border-white/10 text-cream font-sans text-[10px] px-2 py-1 focus:border-gold/50">
                          {STATUSES.filter(Boolean).map((s) => (
                            <option key={s} value={s} className="bg-dark-100">{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-16 border border-gold/10">
              <p className="font-serif text-xl text-cream-muted">No orders found</p>
            </div>
          )}

          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </div>
  );
}

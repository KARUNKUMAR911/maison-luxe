import { useEffect, useState } from "react";
import { adminService } from "@/services";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS } from "@/utils";
import { Loader } from "@/components/common";

const StatCard = ({ label, value, sub, color = "text-gold" }) => (
  <div className="border border-gold/15 p-6 bg-dark-100">
    <p className="font-sans text-[10px] tracking-[3px] text-cream-faint mb-3">{label}</p>
    <p className={`font-serif text-3xl font-light ${color}`}>{value}</p>
    {sub && <p className="font-sans text-xs text-cream-faint mt-1">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <Loader center />;

  const growthColor = stats.revenue.growth >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ADMIN</p>
        <h1 className="font-serif text-3xl font-light text-cream">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="TOTAL REVENUE" value={formatCurrency(stats.revenue.total)}
          sub={`This month: ${formatCurrency(stats.revenue.thisMonth)}`} />
        <StatCard label="REVENUE GROWTH" value={`${stats.revenue.growth > 0 ? "+" : ""}${stats.revenue.growth}%`}
          color={growthColor} sub="vs last month" />
        <StatCard label="TOTAL ORDERS" value={stats.orders.total}
          sub={`This month: ${stats.orders.thisMonth}`} />
        <StatCard label="CUSTOMERS" value={stats.users.total}
          sub={`New this month: ${stats.users.thisMonth}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Product stats */}
        <div className="border border-gold/15 p-6">
          <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-4">INVENTORY</h3>
          <div className="space-y-3">
            <div className="flex justify-between font-sans text-xs">
              <span className="text-cream-faint">Active Products</span>
              <span className="text-cream">{stats.products.total}</span>
            </div>
            <div className="flex justify-between font-sans text-xs">
              <span className="text-cream-faint">Low Stock (≤5)</span>
              <span className={stats.products.lowStock > 0 ? "text-amber-400" : "text-green-400"}>
                {stats.products.lowStock}
              </span>
            </div>
          </div>
        </div>

        {/* Orders by status */}
        <div className="border border-gold/15 p-6 lg:col-span-2">
          <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-4">ORDERS BY STATUS</h3>
          <div className="grid grid-cols-3 gap-3">
            {stats.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-3 border border-gold/10">
                <p className={`font-sans text-[9px] tracking-wider mb-1 ${ORDER_STATUS_COLORS[status]?.split(" ")[0] || "text-cream-faint"}`}>
                  {status}
                </p>
                <p className="font-serif text-xl text-cream">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="border border-gold/15 p-6">
          <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-5">RECENT ORDERS</h3>
          <div className="space-y-3">
            {stats.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gold/8 last:border-0">
                <div>
                  <p className="font-sans text-xs text-cream">{order.orderNumber}</p>
                  <p className="font-sans text-[10px] text-cream-faint">{order.user?.name} · {formatDate(order.createdAt, { month: "short", day: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-sm text-gold">{formatCurrency(order.total)}</p>
                  <span className={`font-sans text-[8px] tracking-wider px-2 py-0.5 ${ORDER_STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="border border-gold/15 p-6">
          <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-5">TOP PRODUCTS</h3>
          <div className="space-y-3">
            {stats.topProducts?.map((product, i) => (
              <div key={product.id || i} className="flex items-center gap-3 py-2 border-b border-gold/8 last:border-0">
                <span className="font-sans text-[10px] text-cream-faint w-4">{i + 1}</span>
                {product.images?.[0] && (
                  <div className="w-10 h-10 border border-gold/10 overflow-hidden flex-shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-cream truncate">{product.name}</p>
                  <p className="font-sans text-[10px] text-cream-faint">{product.totalSold} sold</p>
                </div>
                <p className="font-serif text-sm text-gold">{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

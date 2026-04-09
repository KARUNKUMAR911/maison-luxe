import { useEffect, useState } from "react";
import { adminService } from "@/services";
import { formatCurrency } from "@/utils";
import { Loader } from "@/components/common";

const Bar = ({ value, max, label, color = "bg-gold" }) => (
  <div className="flex items-center gap-3">
    <span className="font-sans text-[10px] text-cream-faint w-24 text-right truncate">{label}</span>
    <div className="flex-1 bg-dark-200 h-5 overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-700`}
        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
      />
    </div>
    <span className="font-sans text-[10px] text-cream w-16">{formatCurrency(value)}</span>
  </div>
);

const StatBox = ({ label, value, sub, trend }) => (
  <div className="border border-gold/15 p-6">
    <p className="font-sans text-[10px] tracking-[3px] text-cream-faint mb-3">{label}</p>
    <p className="font-serif text-3xl font-light text-gold">{value}</p>
    {sub   && <p className="font-sans text-xs text-cream-faint mt-1">{sub}</p>}
    {trend !== undefined && (
      <p className={`font-sans text-xs mt-2 ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
        {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
      </p>
    )}
  </div>
);

export default function AdminAnalytics() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((r) => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader center />;

  const ORDER_STATUS_COLORS = {
    PENDING:    "bg-yellow-400/70",
    CONFIRMED:  "bg-blue-400/70",
    PROCESSING: "bg-purple-400/70",
    SHIPPED:    "bg-cyan-400/70",
    DELIVERED:  "bg-green-400/70",
    CANCELLED:  "bg-red-400/70",
    REFUNDED:   "bg-orange-400/70",
  };

  const statusEntries   = Object.entries(stats.ordersByStatus || {});
  const maxStatusCount  = Math.max(...statusEntries.map(([, v]) => v), 1);
  const topProducts     = stats.topProducts || [];
  const maxProductSales = Math.max(...topProducts.map((p) => p.totalSold || 0), 1);

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ADMIN</p>
        <h1 className="font-serif text-3xl font-light text-cream">Analytics</h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatBox label="TOTAL REVENUE"    value={formatCurrency(stats.revenue.total)}     sub={`This month: ${formatCurrency(stats.revenue.thisMonth)}`} trend={stats.revenue.growth} />
        <StatBox label="TOTAL ORDERS"     value={stats.orders.total}                      sub={`This month: +${stats.orders.thisMonth}`} />
        <StatBox label="TOTAL CUSTOMERS"  value={stats.users.total}                       sub={`New this month: +${stats.users.thisMonth}`} />
        <StatBox label="ACTIVE PRODUCTS"  value={stats.products.total}                    sub={`Low stock: ${stats.products.lowStock}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders by status - horizontal bar chart */}
        <div className="border border-gold/15 p-6">
          <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-6">ORDERS BY STATUS</h3>
          <div className="space-y-3">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="font-sans text-[9px] tracking-wider text-cream-faint w-24 text-right">{status}</span>
                <div className="flex-1 bg-dark-200 h-5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${ORDER_STATUS_COLORS[status] || "bg-gold/50"}`}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
                <span className="font-sans text-[10px] text-cream w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top selling products */}
        <div className="border border-gold/15 p-6">
          <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-6">TOP PRODUCTS BY SALES</h3>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <Bar
                key={p.id}
                label={p.name}
                value={p.totalSold || 0}
                max={maxProductSales}
                color="bg-gold/70"
              />
            ))}
            {topProducts.length === 0 && (
              <p className="font-sans text-xs text-cream-faint text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="border border-gold/15 p-6 mb-6">
        <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-6">REVENUE BREAKDOWN</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            ["Total Revenue",      formatCurrency(stats.revenue.total),                         "All-time paid orders"],
            ["This Month",         formatCurrency(stats.revenue.thisMonth),                     "Current month earnings"],
            ["Monthly Growth",     `${stats.revenue.growth >= 0 ? "+" : ""}${stats.revenue.growth}%`, "vs previous month"],
          ].map(([label, value, sub]) => (
            <div key={label} className="text-center border border-gold/10 p-6">
              <p className="font-sans text-[10px] tracking-[3px] text-cream-faint mb-3">{label.toUpperCase()}</p>
              <p className={`font-serif text-3xl font-light ${label === "Monthly Growth" && stats.revenue.growth < 0 ? "text-red-400" : "text-gold"}`}>
                {value}
              </p>
              <p className="font-sans text-[10px] text-cream-faint/60 mt-2">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="border border-gold/15 p-6">
        <h3 className="font-sans text-[10px] tracking-[3px] text-gold mb-5">RECENT ACTIVITY</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                {["Order", "Customer", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left pb-3 font-sans text-[9px] tracking-[2px] text-gold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((order) => (
                <tr key={order.id} className="border-b border-gold/8">
                  <td className="py-3 font-sans text-xs text-cream">{order.orderNumber}</td>
                  <td className="py-3 font-sans text-xs text-cream-faint">{order.user?.name}</td>
                  <td className="py-3 font-serif text-sm text-gold">{formatCurrency(order.total)}</td>
                  <td className="py-3">
                    <span className="font-sans text-[8px] tracking-wider px-2 py-0.5 bg-gold/10 text-gold">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

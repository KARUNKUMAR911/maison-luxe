import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

const NAV = [
  { to: "/admin",             label: "Dashboard",  icon: "▦", end: true },
  { to: "/admin/products",    label: "Products",   icon: "◈" },
  { to: "/admin/orders",      label: "Orders",     icon: "◎" },
  { to: "/admin/users",       label: "Users",      icon: "◉" },
  { to: "/admin/categories",  label: "Categories", icon: "◈" },
  { to: "/admin/analytics",   label: "Analytics",  icon: "▲" },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <div className="flex min-h-screen bg-dark">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-100 border-r border-gold/10 flex flex-col fixed top-0 bottom-0 left-0 z-10">
        <div className="px-6 py-7 border-b border-gold/10">
          <p className="font-serif text-lg font-light tracking-[4px] text-cream">MAISON</p>
          <p className="font-sans text-[8px] tracking-[4px] text-gold mt-0.5">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-sans text-xs tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-gold/10 text-gold border-l-2 border-gold pl-3"
                    : "text-cream-faint hover:text-gold hover:bg-gold/5"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-gold/10">
          <p className="font-sans text-[10px] text-cream-faint truncate">{user?.name}</p>
          <p className="font-sans text-[9px] tracking-wider text-gold/60">{user?.role}</p>
          <button onClick={handleLogout}
            className="mt-3 font-sans text-[10px] tracking-widest text-red-400 hover:text-red-300 transition-colors">
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

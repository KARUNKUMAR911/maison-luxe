import { Link } from "react-router-dom";
import { useAuthStore } from "@/store";
import { formatDate } from "@/utils";

export default function AccountPage() {
  const { user } = useAuthStore();
  const links = [
    { to: "/account/orders",   label: "My Orders",   desc: "Track and manage your orders", icon: "◎" },
    { to: "/account/wishlist", label: "Wishlist",     desc: "Your saved items",             icon: "♡" },
    { to: "/account/profile",  label: "Profile",      desc: "Manage your account details",  icon: "◉" },
  ];
  return (
    <div className="pt-28 pb-20 page-container max-w-3xl mx-auto">
      <p className="section-label mb-3">— My Account</p>
      <h1 className="font-serif text-4xl font-light text-cream mb-2">Hello, <em className="italic text-gold">{user?.name?.split(" ")[0]}</em></h1>
      <p className="font-sans text-xs text-cream-faint mb-10">Member since {formatDate(user?.createdAt)}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="group border border-gold/15 p-8 hover:border-gold/40 transition-all duration-300">
            <span className="text-2xl text-gold mb-4 block">{l.icon}</span>
            <h3 className="font-serif text-xl text-cream group-hover:text-gold transition-colors mb-2">{l.label}</h3>
            <p className="font-sans text-xs text-cream-faint">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

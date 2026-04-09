import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useCartStore, useUIStore } from "@/store";
import { useDebounce } from "@/hooks";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const NAV_LINKS = [
  { label: "Shop",        to: "/shop" },
  { label: "Collections", to: "/shop?featured=true" },
  { label: "About",       to: "/about" },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const { itemCount, setOpen: setCartOpen } = useCartStore();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, navigate]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? "bg-dark-100/95 backdrop-blur-xl border-b border-gold/15" : "bg-transparent"
      }`}>
        <div className="page-container h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-serif text-xl font-light tracking-[6px] text-cream">MAISON</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-px w-6 bg-gold" />
              <span className="font-sans text-[7px] tracking-[4px] text-gold font-medium">LUXE</span>
              <div className="h-px w-6 bg-gold" />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="nav-link">{l.label.toUpperCase()}</Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 text-cream-muted">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-gold transition-colors">
              <SearchIcon />
            </button>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative hover:text-gold transition-colors">
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-dark text-[10px] font-bold font-sans w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="hover:text-gold transition-colors flex items-center gap-2">
                  {user.avatar
                    ? <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-gold/30" />
                    : <UserIcon />
                  }
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-dark-100 border border-gold/20 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gold/10 mb-1">
                      <p className="font-sans text-[10px] tracking-widest text-gold">ACCOUNT</p>
                      <p className="font-serif text-sm text-cream truncate">{user.name}</p>
                    </div>
                    {[
                      { label: "My Orders",  to: "/account/orders" },
                      { label: "Wishlist",   to: "/account/wishlist" },
                      { label: "Profile",    to: "/account/profile" },
                      ...(["ADMIN","SUPER_ADMIN"].includes(user.role) ? [{ label: "Admin Dashboard", to: "/admin" }] : []),
                    ].map((item) => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 font-sans text-xs text-cream-muted hover:text-gold hover:bg-gold/5 transition-colors">
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2 font-sans text-xs text-red-400 hover:bg-red-400/5 transition-colors border-t border-gold/10 mt-1">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-gold transition-colors"><UserIcon /></Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden hover:text-gold transition-colors">
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gold/15 bg-dark-100/98 backdrop-blur-xl px-10 py-4 flex items-center gap-4">
            <SearchIcon />
            <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories…"
              className="flex-1 bg-transparent border-none text-cream font-serif text-lg placeholder:text-cream-faint" />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-cream-faint hover:text-gold transition-colors">
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gold/15 bg-dark-100/98 backdrop-blur-xl py-6 px-10 flex flex-col gap-6">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className="font-sans text-sm tracking-widest text-cream-muted hover:text-gold transition-colors">
                {l.label.toUpperCase()}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline w-fit text-center">
                SIGN IN
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}

import { Link } from "react-router-dom";

const LINKS = {
  Collections: [
    { label: "New Arrivals", to: "/shop?sort=createdAt" },
    { label: "Best Sellers", to: "/shop?featured=true" },
    { label: "Watches",      to: "/category/watches" },
    { label: "Bags",         to: "/category/bags" },
    { label: "Clothing",     to: "/category/clothing" },
    { label: "Home",         to: "/category/home" },
  ],
  Services: [
    { label: "Personal Shopping", to: "/about" },
    { label: "Gift Wrapping",     to: "/about" },
    { label: "Returns Policy",    to: "/about" },
    { label: "Care Guide",        to: "/about" },
  ],
  Company: [
    { label: "About Us",    to: "/about" },
    { label: "Careers",     to: "/about" },
    { label: "Press",       to: "/about" },
    { label: "Contact",     to: "/about" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0908] border-t border-gold/15">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <span className="font-serif text-xl font-light tracking-[6px] text-cream">MAISON</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-6 bg-gold" />
                <span className="font-sans text-[7px] tracking-[4px] text-gold">LUXE</span>
                <div className="h-px w-6 bg-gold" />
              </div>
            </div>
            <p className="font-sans text-xs leading-loose text-cream-faint max-w-[220px]">
              A sanctuary for those who appreciate the extraordinary. Each piece chosen for exceptional craftsmanship.
            </p>
            <div className="flex gap-4 mt-6">
              {["IG", "FB", "TW", "YT"].map((s) => (
                <button key={s} className="w-8 h-8 border border-gold/20 flex items-center justify-center font-sans text-[9px] text-cream-faint hover:border-gold hover:text-gold transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-[10px] tracking-[3px] text-gold mb-5">{title.toUpperCase()}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="font-sans text-xs text-cream-faint hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gold/10 border-b border-gold/10 py-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] tracking-[4px] text-gold mb-1">NEWSLETTER</p>
            <p className="font-serif text-xl font-light text-cream">Join the inner circle</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="input-field md:w-72 border-r-0"
            />
            <button className="btn-gold whitespace-nowrap">SUBSCRIBE</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] text-cream-faint/50 tracking-wider">
            © {new Date().getFullYear()} MAISON LUXE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <span key={t} className="font-sans text-[10px] text-cream-faint/50 hover:text-gold transition-colors cursor-pointer tracking-wider">
                {t.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

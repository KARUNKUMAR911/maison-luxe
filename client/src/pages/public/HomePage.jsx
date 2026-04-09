import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService, categoryService } from "@/services";
import ProductGrid from "@/components/product/ProductGrid";
import CartDrawer from "@/components/cart/CartDrawer";

export default function HomePage() {
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getFeatured(8),
      categoryService.getAll(),
    ]).then(([fp, cp]) => {
      setFeatured(fp.data.data);
      setCategories(cp.data.data.slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <CartDrawer />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG grid */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

        {/* Decorative circles */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-gold/10 pointer-events-none" />
        <div className="absolute right-[13%] top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-gold/6 pointer-events-none" />

        {/* Right image collage */}
        <div className="hidden lg:flex absolute right-[5%] top-1/2 -translate-y-1/2 gap-4 pointer-events-none">
          <div className="flex flex-col gap-4 mt-16">
            <div className="w-44 h-56 border border-gold/20 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-44 h-40 border border-gold/20 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-52 h-72 border border-gold/20 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-52 h-28 border border-gold/20 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Gradient over images */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{ background: "linear-gradient(to left, transparent 0%, #0d0c0a 55%)" }} />

        {/* Content */}
        <div className="page-container relative z-10 pt-32 pb-20">
          <p className="section-label animate-fade-up mb-6">— New Collection 2026</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.08] text-cream tracking-wide animate-fade-up mb-8 max-w-xl">
            Where Luxury<br />
            <em className="italic text-gold">Meets Craft</em>
          </h1>
          <p className="font-sans text-sm leading-loose text-cream-faint max-w-md animate-fade-up mb-10">
            Discover an exclusive curation of timeless pieces — from bespoke timepieces to handcrafted leather goods, each chosen for exceptional quality.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up">
            <Link to="/shop" className="btn-gold">EXPLORE COLLECTION</Link>
            <Link to="/about" className="btn-ghost">OUR STORY</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <div className="bg-dark-100 border-y border-gold/15 py-8">
        <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-8">
          {[["12,400+","Happy Clients"],["340+","Curated Products"],["28","Luxury Brands"],["100%","Authentic Items"]].map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="font-serif text-3xl font-light text-gold">{v}</div>
              <div className="font-sans text-[9px] tracking-[3px] text-cream-faint mt-1">{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ─────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="section-label mb-4">— Shop By Category</p>
            <h2 className="section-title">Browse <em className="italic text-gold">Collections</em></h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug}`}
                className="group relative overflow-hidden aspect-square border border-gold/10 hover:border-gold/40 transition-all duration-300">
                {cat.image && (
                  <img src={cat.image} alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-dark/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-serif text-sm text-cream group-hover:text-gold transition-colors">{cat.name}</p>
                  <p className="font-sans text-[9px] tracking-wider text-cream-faint">{cat._count?.products || 0} ITEMS</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────── */}
      <section className="py-16 bg-dark-100">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="section-label mb-4">— Handpicked For You</p>
            <h2 className="section-title">Featured <em className="italic text-gold">Pieces</em></h2>
            <div className="gold-divider" />
          </div>
          <ProductGrid products={featured} loading={loading} cols={4} />
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-outline">VIEW ALL PRODUCTS</Link>
          </div>
        </div>
      </section>

      {/* ── Membership Banner ──────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="relative bg-dark-200 border border-gold/20 p-16 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full border border-gold/6 pointer-events-none" />
            <div className="absolute -right-4 -bottom-16 w-48 h-48 rounded-full border border-gold/6 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="section-label mb-3">Exclusive Membership</p>
                <h2 className="font-serif text-4xl font-light text-cream mb-4">
                  Join Maison Luxe<br /><em className="italic text-gold">Privilege Club</em>
                </h2>
                <p className="font-sans text-sm leading-loose text-cream-faint">
                  Unlock early access to new arrivals, private sales, complimentary monogramming, and dedicated concierge services.
                </p>
              </div>
              <Link to="/register" className="btn-outline whitespace-nowrap flex-shrink-0">BECOME A MEMBER</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

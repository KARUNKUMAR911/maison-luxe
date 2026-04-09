import { useState } from "react";

const SORT_OPTIONS = [
  { label: "Newest",        value: "createdAt:desc" },
  { label: "Price: Low",   value: "price:asc" },
  { label: "Price: High",  value: "price:desc" },
  { label: "Name A–Z",     value: "name:asc" },
];

export default function ProductFilters({ categories, filters, onChange }) {
  const [priceMin, setPriceMin] = useState(filters.minPrice || "");
  const [priceMax, setPriceMax] = useState(filters.maxPrice || "");

  const apply = () => onChange({ ...filters, minPrice: priceMin, maxPrice: priceMax });

  return (
    <aside className="w-64 flex-shrink-0 space-y-8">
      {/* Category */}
      <div>
        <h3 className="section-label mb-4">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => onChange({ ...filters, category: undefined })}
            className={`block w-full text-left font-sans text-xs px-3 py-2 transition-colors ${
              !filters.category ? "text-gold border-l border-gold pl-4" : "text-cream-faint hover:text-gold"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: cat.slug })}
              className={`block w-full text-left font-sans text-xs px-3 py-2 transition-colors ${
                filters.category === cat.slug ? "text-gold border-l border-gold pl-4" : "text-cream-faint hover:text-gold"
              }`}
            >
              {cat.name}
              <span className="ml-1 text-cream-faint/50">({cat._count?.products || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="section-label mb-4">Sort By</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((opt) => {
            const [sort, order] = opt.value.split(":");
            const active = filters.sort === sort && filters.order === order;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, sort, order })}
                className={`block w-full text-left font-sans text-xs px-3 py-2 transition-colors ${
                  active ? "text-gold border-l border-gold pl-4" : "text-cream-faint hover:text-gold"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="section-label mb-4">Price Range</h3>
        <div className="space-y-3">
          <input
            type="number" placeholder="Min price" value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="input-field text-sm py-2"
          />
          <input
            type="number" placeholder="Max price" value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="input-field text-sm py-2"
          />
          <button onClick={apply} className="btn-outline w-full py-2 text-xs">
            APPLY
          </button>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <h3 className="section-label mb-4">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => onChange({ ...filters, inStock: !filters.inStock })}
            className={`w-9 h-5 rounded-full transition-colors relative ${filters.inStock ? "bg-gold" : "bg-dark-200"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-dark transition-transform ${filters.inStock ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          <span className="font-sans text-xs text-cream-faint">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({})}
        className="font-sans text-[10px] tracking-widest text-cream-faint hover:text-gold transition-colors"
      >
        CLEAR ALL FILTERS
      </button>
    </aside>
  );
}

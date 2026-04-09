import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, cols = 4 }) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[cols] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-dark-200 aspect-[3/4] w-full" />
            <div className="p-5 space-y-3">
              <div className="h-2 bg-dark-200 rounded w-1/3" />
              <div className="h-4 bg-dark-200 rounded w-3/4" />
              <div className="h-4 bg-dark-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="font-serif text-2xl text-cream-muted">No products found</p>
        <p className="font-sans text-xs tracking-widest text-cream-faint">TRY ADJUSTING YOUR FILTERS</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks";
import { useProducts } from "@/hooks";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import { Pagination } from "@/components/common";
import CartDrawer from "@/components/cart/CartDrawer";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const [page, setPage] = useState(1);

  const filters = {
    category: searchParams.get("category") || undefined,
    sort:     searchParams.get("sort") || "createdAt",
    order:    searchParams.get("order") || "desc",
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    featured: searchParams.get("featured") || undefined,
  };

  const { products, pagination, loading } = useProducts({ ...filters, page, limit: 12 });

  const handleFilterChange = (newFilters) => {
    const params = {};
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
    setPage(1);
  };

  return (
    <>
      <CartDrawer />
      <div className="pt-28 pb-20">
        {/* Header */}
        <div className="page-container mb-12">
          <p className="section-label mb-3">— Our Collection</p>
          <div className="flex items-end justify-between">
            <h1 className="section-title">
              {filters.category
                ? categories.find((c) => c.slug === filters.category)?.name || "Collection"
                : filters.featured ? "Featured Pieces" : "All Products"
              }
            </h1>
            {pagination && (
              <p className="font-sans text-xs text-cream-faint hidden md:block">
                {pagination.total} PRODUCTS
              </p>
            )}
          </div>
          <div className="gold-divider mx-0 mt-6" />
        </div>

        {/* Layout */}
        <div className="page-container flex gap-12">
          {/* Filters sidebar */}
          <div className="hidden lg:block">
            <ProductFilters
              categories={categories}
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} cols={3} />
            <Pagination pagination={pagination} onPage={setPage} />
          </div>
        </div>
      </div>
    </>
  );
}

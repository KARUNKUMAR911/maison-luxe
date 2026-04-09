import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks";
import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { Pagination } from "@/components/common";
import CartDrawer from "@/components/cart/CartDrawer";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const { products, pagination, loading } = useProducts({ search: q, page, limit: 12 });

  return (
    <>
      <CartDrawer />
      <div className="pt-28 pb-20 page-container">
        <p className="section-label mb-4">— Search Results</p>
        <h1 className="section-title mb-2">"{q}"</h1>
        {pagination && <p className="font-sans text-xs text-cream-faint mb-4">{pagination.total} results found</p>}
        <div className="gold-divider mx-0 mb-12" />
        <ProductGrid products={products} loading={loading} cols={4} />
        <Pagination pagination={pagination} onPage={setPage} />
      </div>
    </>
  );
}

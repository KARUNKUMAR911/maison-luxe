import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/hooks";
import ProductGrid from "@/components/product/ProductGrid";
import { Pagination } from "@/components/common";
import CartDrawer from "@/components/cart/CartDrawer";

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const { products, pagination, loading } = useProducts({ category: slug, page, limit: 12 });

  return (
    <>
      <CartDrawer />
      <div className="pt-28 pb-20 page-container">
        <p className="section-label mb-4">— Category</p>
        <h1 className="section-title capitalize mb-2">{slug?.replace(/-/g, " ")}</h1>
        <div className="gold-divider mx-0 mb-12" />
        <ProductGrid products={products} loading={loading} cols={4} />
        <Pagination pagination={pagination} onPage={setPage} />
      </div>
    </>
  );
}
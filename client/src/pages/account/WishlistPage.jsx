import { useState, useEffect } from "react";
import { wishlistService } from "@/services";
import ProductGrid from "@/components/product/ProductGrid";
import { Loader } from "@/components/common";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    wishlistService.get()
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-20 page-container">
      <p className="section-label mb-3">— Account</p>
      <h1 className="font-serif text-4xl font-light text-cream mb-10">My Wishlist</h1>
      {loading ? <Loader center /> : <ProductGrid products={products} loading={false} cols={4} />}
    </div>
  );
}

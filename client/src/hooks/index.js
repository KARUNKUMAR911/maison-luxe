import { useState, useEffect, useCallback, useRef } from "react";
import { productService, categoryService, orderService, wishlistService } from "@/services";

// ── Debounce ──────────────────────────────────────────────
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

// ── Products ──────────────────────────────────────────────
export const useProducts = (params = {}) => {
  const [data, setData]       = useState({ products: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll(params);
      setData({ products: res.data.data, pagination: res.data.pagination });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { ...data, loading, error, refetch: fetch };
};

export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getBySlug(slug)
      .then((res) => setProduct(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
};

// ── Categories ────────────────────────────────────────────
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    categoryService.getAll()
      .then((res) => setCategories(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
};

// ── Orders ────────────────────────────────────────────────
export const useOrders = (params = {}) => {
  const [data, setData]       = useState({ orders: [], pagination: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAll(params)
      .then((res) => setData({ orders: res.data.data, pagination: res.data.pagination }))
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { ...data, loading };
};

// ── Wishlist ──────────────────────────────────────────────
export const useWishlist = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistService.get()
      .then((res) => setItems(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (productId) => {
    const res = await wishlistService.toggle(productId);
    const { wishlisted } = res.data.data;
    setItems((prev) =>
      wishlisted
        ? [...prev, { id: productId }]
        : prev.filter((i) => i.id !== productId)
    );
    return wishlisted;
  };

  const isWishlisted = (productId) => items.some((i) => i.id === productId);

  return { items, loading, toggle, isWishlisted };
};

// ── Click Outside ─────────────────────────────────────────
export const useClickOutside = (handler) => {
  const ref = useRef();
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [handler]);
  return ref;
};

// ── Local Storage ─────────────────────────────────────────
export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; }
    catch { return initial; }
  });
  const set = (v) => { setValue(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [value, set];
};

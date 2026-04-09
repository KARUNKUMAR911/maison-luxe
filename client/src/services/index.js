import api from "./api";

// ── Auth ──────────────────────────────────────────────────
export const authService = {
  register:       (data)     => api.post("/auth/register", data),
  login:          (data)     => api.post("/auth/login", data),
  logout:         ()         => api.post("/auth/logout"),
  getMe:          ()         => api.get("/auth/me"),
  updateProfile:  (data)     => api.put("/auth/profile", data),
  changePassword: (data)     => api.put("/auth/password", data),
};

// ── Products ──────────────────────────────────────────────
export const productService = {
  getAll:    (params) => api.get("/products", { params }),
  getFeatured: (limit) => api.get("/products/featured", { params: { limit } }),
  getBySlug: (slug)   => api.get(`/products/${slug}`),
  create:    (data)   => api.post("/products", data),
  update:    (id, data) => api.put(`/products/${id}`, data),
  delete:    (id)     => api.delete(`/products/${id}`),
};

// ── Categories ────────────────────────────────────────────
export const categoryService = {
  getAll:      ()       => api.get("/categories"),
  getBySlug:   (slug)   => api.get(`/categories/${slug}`),
  create:      (data)   => api.post("/categories", data),
  update:      (id, d)  => api.put(`/categories/${id}`, d),
  delete:      (id)     => api.delete(`/categories/${id}`),
};

// ── Cart ──────────────────────────────────────────────────
export const cartService = {
  get:        ()              => api.get("/cart"),
  addItem:    (data)          => api.post("/cart", data),
  updateItem: (itemId, data)  => api.put(`/cart/${itemId}`, data),
  removeItem: (itemId)        => api.delete(`/cart/${itemId}`),
  clear:      ()              => api.delete("/cart"),
};

// ── Orders ────────────────────────────────────────────────
export const orderService = {
  place:     (data)   => api.post("/orders", data),
  getAll:    (params) => api.get("/orders", { params }),
  getById:   (id)     => api.get(`/orders/${id}`),
};

// ── Payment ───────────────────────────────────────────────
export const paymentService = {
  createIntent: (data) => api.post("/payment/intent", data),
};

// ── Wishlist ──────────────────────────────────────────────
export const wishlistService = {
  get:    ()           => api.get("/wishlist"),
  toggle: (productId)  => api.post("/wishlist", { productId }),
};

// ── Reviews ───────────────────────────────────────────────
export const reviewService = {
  create: (data) => api.post("/reviews", data),
  delete: (id)   => api.delete(`/reviews/${id}`),
};

// ── Upload ────────────────────────────────────────────────
export const uploadService = {
  images: (files) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
  },
};

// ── Admin ─────────────────────────────────────────────────
export const adminService = {
  getStats:          ()           => api.get("/admin/stats"),
  getUsers:          (params)     => api.get("/admin/users", { params }),
  toggleUser:        (id)         => api.patch(`/admin/users/${id}/toggle`),
  getAllOrders:       (params)     => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, data)   => api.patch(`/admin/orders/${id}`, data),
};

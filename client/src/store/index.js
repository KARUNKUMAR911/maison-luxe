import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, cartService } from "@/services";
import toast from "react-hot-toast";

// ── Auth Store ────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (data) => {
        set({ loading: true });
        try {
          const res = await authService.login(data);
          const { user, token } = res.data.data;
          localStorage.setItem("token", token);
          set({ user, token, loading: false });
          toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
          return { success: true };
        } catch (err) {
          set({ loading: false });
          toast.error(err.message);
          return { success: false };
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          const res = await authService.register(data);
          const { user, token } = res.data.data;
          localStorage.setItem("token", token);
          set({ user, token, loading: false });
          toast.success("Account created!");
          return { success: true };
        } catch (err) {
          set({ loading: false });
          toast.error(err.message);
          return { success: false };
        }
      },

      logout: async () => {
        try { await authService.logout(); } catch (_) {}
        localStorage.removeItem("token");
        set({ user: null, token: null });
        useCartStore.getState().reset();
        toast.success("Logged out");
      },

      fetchMe: async () => {
        try {
          const res = await authService.getMe();
          set({ user: res.data.data });
        } catch (_) {
          set({ user: null, token: null });
          localStorage.removeItem("token");
        }
      },

      isAdmin: () => ["ADMIN", "SUPER_ADMIN"].includes(get().user?.role),
    }),
    { name: "auth-store", partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);

// ── Cart Store ────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  loading: false,
  open: false,

  setOpen: (open) => set({ open }),

  fetchCart: async () => {
    if (!useAuthStore.getState().token) return;
    try {
      const res = await cartService.get();
      const { items, subtotal, itemCount } = res.data.data;
      set({ items, subtotal, itemCount });
    } catch (_) {}
  },

  addItem: async (productId, quantity = 1) => {
    set({ loading: true });
    try {
      const res = await cartService.addItem({ productId, quantity });
      const { items, subtotal, itemCount } = res.data.data;
      set({ items, subtotal, itemCount, loading: false, open: true });
      toast.success("Added to bag");
    } catch (err) {
      set({ loading: false });
      toast.error(err.message);
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const res = await cartService.updateItem(itemId, { quantity });
      const { items, subtotal, itemCount } = res.data.data;
      set({ items, subtotal, itemCount });
    } catch (err) {
      toast.error(err.message);
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await cartService.removeItem(itemId);
      const { items, subtotal, itemCount } = res.data.data;
      set({ items, subtotal, itemCount });
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.message);
    }
  },

  reset: () => set({ items: [], subtotal: 0, itemCount: 0 }),
}));

// ── UI Store ──────────────────────────────────────────────
export const useUIStore = create((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}));

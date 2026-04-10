import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Public pages
import HomePage       from "@/pages/public/HomePage";
import ShopPage       from "@/pages/public/ShopPage";
import ProductPage    from "@/pages/public/ProductPage";
import CategoryPage   from "@/pages/public/CategoryPage";
import SearchPage     from "@/pages/public/SearchPage";
import AboutPage      from "@/pages/public/AboutPage";
import NotFoundPage   from "@/pages/public/NotFoundPage";

// Auth pages
import LoginPage          from "@/pages/auth/LoginPage";
import RegisterPage       from "@/pages/auth/RegisterPage";

// Account pages
import AccountPage     from "@/pages/account/AccountPage";
import OrdersPage      from "@/pages/account/OrdersPage";
import OrderDetailPage from "@/pages/account/OrderDetailPage";
import WishlistPage    from "@/pages/account/WishlistPage";
import ProfilePage     from "@/pages/account/ProfilePage";

// Checkout
import CheckoutPage     from "@/pages/checkout/CheckoutPage";
import OrderSuccessPage from "@/pages/checkout/OrderSuccessPage";

// Admin
import AdminLayout     from "@/components/admin/AdminLayout";
import AdminDashboard  from "@/pages/admin/AdminDashboard";
import AdminProducts   from "@/pages/admin/AdminProducts";
import AdminOrders     from "@/pages/admin/AdminOrders";
import AdminUsers      from "@/pages/admin/AdminUsers";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminAnalytics    from "@/pages/admin/AdminAnalytics";
import AdminOrderDetail  from "@/pages/admin/AdminOrderDetail";

import CartDrawer from "@/components/cart/CartDrawer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute     from "@/components/auth/AdminRoute";

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#111009", color: "#e8e0d0", border: "1px solid rgba(201,168,76,0.3)", fontFamily: "Montserrat, sans-serif", fontSize: "12px" },
          success: { iconTheme: { primary: "#C9A84C", secondary: "#0d0c0a" } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><ShopPage /></PublicLayout>} />
        <Route path="/products/:slug" element={<PublicLayout><ProductPage /></PublicLayout>} />
        <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

        {/* Auth */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Account */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account"              element={<PublicLayout><AccountPage /></PublicLayout>} />
          <Route path="/account/orders"       element={<PublicLayout><OrdersPage /></PublicLayout>} />
          <Route path="/account/orders/:id"   element={<PublicLayout><OrderDetailPage /></PublicLayout>} />
          <Route path="/account/wishlist"     element={<PublicLayout><WishlistPage /></PublicLayout>} />
          <Route path="/account/profile"      element={<PublicLayout><ProfilePage /></PublicLayout>} />
          <Route path="/checkout"             element={<PublicLayout><CheckoutPage /></PublicLayout>} />
          <Route path="/order-success/:id"    element={<PublicLayout><OrderSuccessPage /></PublicLayout>} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index           element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders"      element={<AdminOrders />} />
            <Route path="orders/:id"  element={<AdminOrderDetail />} />
            <Route path="users"    element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="analytics"  element={<AdminAnalytics />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

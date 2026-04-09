import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.success) navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden lg:block w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-dark/20" />
        <div className="absolute bottom-16 left-16">
          <p className="font-serif text-4xl font-light text-cream leading-tight">
            Welcome<br />back to<br /><em className="text-gold italic">Maison Luxe</em>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-dark">
        <div className="w-full max-w-md">
          <Link to="/" className="flex flex-col mb-12">
            <span className="font-serif text-2xl font-light tracking-[6px] text-cream">MAISON</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-6 bg-gold" />
              <span className="font-sans text-[7px] tracking-[4px] text-gold">LUXE</span>
              <div className="h-px w-6 bg-gold" />
            </div>
          </Link>

          <p className="section-label mb-3">— Welcome Back</p>
          <h1 className="font-serif text-3xl font-light text-cream mb-8">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-sans text-[10px] tracking-[2px] text-cream-faint block mb-1.5">EMAIL</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[2px] text-cream-faint block mb-1.5">PASSWORD</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
              {loading ? "SIGNING IN…" : "SIGN IN"}
            </button>
          </form>

          <p className="font-sans text-xs text-cream-faint text-center mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-gold hover:text-gold-light transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

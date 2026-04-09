import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register({ name: form.name, email: form.email, password: form.password });
    if (res.success) navigate("/");
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div>
      <label className="font-sans text-[10px] tracking-[2px] text-cream-faint block mb-1.5">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={`input-field ${errors[key] ? "border-red-400/50" : ""}`} />
      {errors[key] && <p className="font-sans text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-dark/20" />
        <div className="absolute bottom-16 left-16">
          <p className="font-serif text-4xl font-light text-cream leading-tight">
            Join the<br /><em className="text-gold italic">Privilege Club</em>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-dark overflow-y-auto py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex flex-col mb-12">
            <span className="font-serif text-2xl font-light tracking-[6px] text-cream">MAISON</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-6 bg-gold" />
              <span className="font-sans text-[7px] tracking-[4px] text-gold">LUXE</span>
              <div className="h-px w-6 bg-gold" />
            </div>
          </Link>

          <p className="section-label mb-3">— New Member</p>
          <h1 className="font-serif text-3xl font-light text-cream mb-8">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {field("name",     "Full Name",        "text",     "Jane Doe")}
            {field("email",    "Email Address",    "email",    "your@email.com")}
            {field("password", "Password",         "password", "Min. 8 characters")}
            {field("confirm",  "Confirm Password", "password", "Repeat password")}
            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
              {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="font-sans text-xs text-cream-faint text-center mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

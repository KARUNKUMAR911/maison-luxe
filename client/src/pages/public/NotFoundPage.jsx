import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 px-6">
      <p className="font-serif text-[120px] font-light leading-none" style={{ color: "rgba(201,168,76,0.15)" }}>404</p>
      <h1 className="font-serif text-4xl font-light text-cream -mt-8">Page Not Found</h1>
      <p className="font-sans text-sm text-cream-faint">The page you're looking for has moved or doesn't exist.</p>
      <Link to="/" className="btn-gold mt-4">RETURN HOME</Link>
    </div>
  );
}

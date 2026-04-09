// ── Loader ────────────────────────────────────────────────
export function Loader({ size = "md", center = false }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={center ? "flex justify-center py-20" : ""}>
      <div className={`${sizes[size]} border-2 border-gold/20 border-t-gold rounded-full animate-spin`} />
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────
export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;

  const getPages = () => {
    const nums = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) nums.push(i);
    return nums;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="w-9 h-9 flex items-center justify-center border border-gold/20 text-cream-faint hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-sans text-xs"
      >
        ‹
      </button>
      {page > 3 && (
        <>
          <button onClick={() => onPage(1)} className="w-9 h-9 border border-gold/20 text-cream-faint hover:border-gold hover:text-gold transition-colors font-sans text-xs">1</button>
          <span className="text-cream-faint">…</span>
        </>
      )}
      {getPages().map((n) => (
        <button key={n} onClick={() => onPage(n)}
          className={`w-9 h-9 border font-sans text-xs transition-colors ${
            n === page ? "border-gold bg-gold text-dark font-semibold" : "border-gold/20 text-cream-faint hover:border-gold hover:text-gold"
          }`}
        >
          {n}
        </button>
      ))}
      {page < pages - 2 && (
        <>
          <span className="text-cream-faint">…</span>
          <button onClick={() => onPage(pages)} className="w-9 h-9 border border-gold/20 text-cream-faint hover:border-gold hover:text-gold transition-colors font-sans text-xs">{pages}</button>
        </>
      )}
      <button
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="w-9 h-9 flex items-center justify-center border border-gold/20 text-cream-faint hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-sans text-xs"
      >
        ›
      </button>
    </div>
  );
}

// ── StarRating ────────────────────────────────────────────
export function StarRating({ rating, max = 5, size = 14, interactive = false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < rating ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="1.5"
          className={interactive ? "cursor-pointer hover:fill-gold" : ""}
          onClick={() => interactive && onChange && onChange(i + 1)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = "md" }) {
  if (!open) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${sizes[size]} w-full bg-dark-100 border border-gold/20 animate-fade-in`}>
        {title && (
          <div className="flex items-center justify-between px-8 py-5 border-b border-gold/10">
            <h2 className="font-serif text-xl text-cream">{title}</h2>
            <button onClick={onClose} className="text-cream-faint hover:text-gold transition-colors font-sans text-xl leading-none">×</button>
          </div>
        )}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const variants = {
    default:  "bg-dark-300 text-cream border border-gold/20",
    gold:     "bg-gold text-dark",
    success:  "bg-green-400/10 text-green-400",
    warning:  "bg-yellow-400/10 text-yellow-400",
    danger:   "bg-red-400/10 text-red-400",
    info:     "bg-blue-400/10 text-blue-400",
    purple:   "bg-purple-400/10 text-purple-400",
    cyan:     "bg-cyan-400/10 text-cyan-400",
  };
  return (
    <span className={`font-sans text-[9px] tracking-[2px] px-2.5 py-1 font-semibold uppercase ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ── Input ─────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="font-sans text-[10px] tracking-[2px] text-cream-faint">{label.toUpperCase()}</label>}
      <input className={`input-field ${error ? "border-red-400/50" : ""} ${className}`} {...props} />
      {error && <p className="font-sans text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────
export function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="font-sans text-[10px] tracking-[2px] text-cream-faint">{label.toUpperCase()}</label>}
      <select className={`input-field ${error ? "border-red-400/50" : ""} ${className}`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-dark-100">{o.label}</option>
        ))}
      </select>
      {error && <p className="font-sans text-xs text-red-400">{error}</p>}
    </div>
  );
}

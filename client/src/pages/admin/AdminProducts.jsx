import { useState, useEffect } from "react";
import { productService, categoryService, uploadService } from "@/services";
import { formatCurrency } from "@/utils";
import { Loader, Pagination, Modal } from "@/components/common";
import toast from "react-hot-toast";

const EMPTY = { name:"",slug:"",description:"",price:"",comparePrice:"",stock:"",sku:"",categoryId:"",isFeatured:false,isActive:true,tags:"",images:[] };

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPag]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState("");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [saving,     setSaving]     = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    productService.getAll({ page, limit: 15, search: search || undefined })
      .then((res) => { setProducts(res.data.data); setPag(res.data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page, search]);
  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data.data));
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit   = (p)  => {
    setEditing(p);
    setForm({ ...p, tags: p.tags?.join(", ") || "", comparePrice: p.comparePrice || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: Number(form.stock), tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [] };
    try {
      if (editing) await productService.update(editing.id, payload);
      else await productService.create(payload);
      toast.success(editing ? "Product updated" : "Product created");
      setModalOpen(false);
      fetchProducts();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await productService.delete(id);
    toast.success("Product deleted");
    fetchProducts();
  };

  const inputClass = "w-full bg-dark-200 border border-white/10 text-cream font-sans text-sm px-3 py-2 placeholder:text-cream-faint focus:border-gold/50 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ADMIN</p>
          <h1 className="font-serif text-3xl font-light text-cream">Products</h1>
        </div>
        <button onClick={openCreate} className="btn-gold">+ ADD PRODUCT</button>
      </div>

      {/* Search */}
      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search products…"
        className="w-full max-w-sm bg-dark-200 border border-white/10 text-cream font-sans text-sm px-4 py-2 mb-6 placeholder:text-cream-faint focus:border-gold/50 transition-colors" />

      {/* Table */}
      {loading ? <Loader center /> : (
        <>
          <div className="border border-gold/15 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  {["Product","Category","Price","Stock","Status",""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-[9px] tracking-[3px] text-gold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gold/8 hover:bg-gold/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-gold/10 overflow-hidden flex-shrink-0">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-sans text-xs text-cream">{p.name}</p>
                          <p className="font-sans text-[10px] text-cream-faint">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-faint">{p.category?.name}</td>
                    <td className="px-4 py-3 font-serif text-sm text-gold">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-xs ${p.stock <= 5 ? "text-amber-400" : "text-green-400"}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] tracking-wider px-2 py-0.5 ${p.isActive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="font-sans text-[10px] tracking-wider text-gold hover:text-gold-light">EDIT</button>
                        <button onClick={() => handleDelete(p.id)} className="font-sans text-[10px] tracking-wider text-red-400 hover:text-red-300">DEL</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "New Product"} size="xl">
        <div className="grid grid-cols-2 gap-4">
          {[["name","Name"],["slug","Slug"],["sku","SKU"],["price","Price"],["comparePrice","Compare Price"],["stock","Stock"]].map(([k,l]) => (
            <div key={k}>
              <label className="font-sans text-[9px] tracking-[2px] text-cream-faint block mb-1">{l.toUpperCase()}</label>
              <input value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inputClass} />
            </div>
          ))}
          <div className="col-span-2">
            <label className="font-sans text-[9px] tracking-[2px] text-cream-faint block mb-1">DESCRIPTION</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} resize-none`} rows={3} />
          </div>
          <div>
            <label className="font-sans text-[9px] tracking-[2px] text-cream-faint block mb-1">CATEGORY</label>
            <select value={form.categoryId || ""} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
              <option value="" className="bg-dark-100">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id} className="bg-dark-100">{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-sans text-[9px] tracking-[2px] text-cream-faint block mb-1">TAGS (comma separated)</label>
            <input value={form.tags || ""} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="font-sans text-[9px] tracking-[2px] text-cream-faint block mb-1">IMAGE URLS (one per line)</label>
            <textarea value={(form.images || []).join("\n")}
              onChange={(e) => setForm({ ...form, images: e.target.value.split("\n").filter(Boolean) })}
              className={`${inputClass} resize-none`} rows={3} />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-gold" />
              <span className="font-sans text-xs text-cream-faint">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-gold" />
              <span className="font-sans text-xs text-cream-faint">Active</span>
            </label>
          </div>
          <div className="col-span-2 flex gap-4 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">CANCEL</button>
            <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 disabled:opacity-50">
              {saving ? "SAVING…" : editing ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

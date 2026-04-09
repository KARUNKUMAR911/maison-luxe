import { useState, useEffect } from "react";
import { categoryService } from "@/services";
import { Modal } from "@/components/common";
import { Loader } from "@/components/common";
import toast from "react-hot-toast";

const EMPTY = { name: "", slug: "", image: "" };

export default function AdminCategories() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const fetch = () => {
    setLoading(true);
    categoryService.getAll().then((res) => setCats(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (c)  => { setEditing(c); setForm({ name: c.name, slug: c.slug, image: c.image || "" }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await categoryService.update(editing.id, form);
      else await categoryService.create(form);
      toast.success(editing ? "Category updated" : "Category created");
      setModal(false);
      fetch();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try { await categoryService.delete(id); toast.success("Deleted"); fetch(); }
    catch (err) { toast.error(err.message); }
  };

  const inputClass = "w-full bg-dark-200 border border-white/10 text-cream font-sans text-sm px-3 py-2 placeholder:text-cream-faint focus:border-gold/50 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ADMIN</p>
          <h1 className="font-serif text-3xl font-light text-cream">Categories</h1>
        </div>
        <button onClick={openCreate} className="btn-gold">+ ADD CATEGORY</button>
      </div>

      {loading ? <Loader center /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat) => (
            <div key={cat.id} className="border border-gold/15 p-5 flex items-center gap-4 hover:border-gold/30 transition-colors">
              {cat.image && (
                <div className="w-14 h-14 border border-gold/10 overflow-hidden flex-shrink-0">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base text-cream">{cat.name}</p>
                <p className="font-sans text-[10px] text-cream-faint">{cat._count?.products || 0} products</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(cat)} className="font-sans text-[10px] tracking-wider text-gold hover:text-gold-light">EDIT</button>
                <button onClick={() => handleDelete(cat.id)} className="font-sans text-[10px] tracking-wider text-red-400 hover:text-red-300">DEL</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Category" : "New Category"} size="sm">
        <div className="space-y-4">
          {[["name","Name"],["slug","Slug"],["image","Image URL"]].map(([k,l]) => (
            <div key={k}>
              <label className="font-sans text-[9px] tracking-[2px] text-cream-faint block mb-1">{l.toUpperCase()}</label>
              <input value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inputClass} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost flex-1 py-2">CANCEL</button>
            <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 py-2 disabled:opacity-50">
              {saving ? "SAVING…" : editing ? "UPDATE" : "CREATE"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { useAuthStore } from "@/store";
import { authService } from "@/services";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [form, setForm]   = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(form);
      await fetchMe();
      toast.success("Profile updated");
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    if (pwForm.newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setSaving(true);
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full bg-dark-200 border border-white/10 text-cream font-sans text-sm px-4 py-3 placeholder:text-cream-faint focus:border-gold/50 transition-colors";
  const labelClass = "font-sans text-[10px] tracking-[2px] text-cream-faint block mb-1.5";

  return (
    <div className="pt-28 pb-20 page-container max-w-2xl mx-auto">
      <p className="section-label mb-3">— Account</p>
      <h1 className="font-serif text-4xl font-light text-cream mb-10">Profile Settings</h1>

      {/* Profile Info */}
      <form onSubmit={handleProfile} className="border border-gold/15 p-8 mb-8">
        <h2 className="font-serif text-xl text-cream mb-6">Personal Information</h2>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>FULL NAME</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass} placeholder="Your name" />
          </div>
          <div>
            <label className={labelClass}>EMAIL</label>
            <input value={user?.email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
            <p className="font-sans text-[10px] text-cream-faint mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className={labelClass}>PHONE</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass} placeholder="+1 (555) 000-0000" />
          </div>
          <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
            {saving ? "SAVING…" : "SAVE CHANGES"}
          </button>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePassword} className="border border-gold/15 p-8">
        <h2 className="font-serif text-xl text-cream mb-6">Change Password</h2>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>CURRENT PASSWORD</label>
            <input type="password" value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>NEW PASSWORD</label>
            <input type="password" value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className={inputClass} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className={labelClass}>CONFIRM NEW PASSWORD</label>
            <input type="password" value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              className={inputClass} placeholder="Repeat new password" />
          </div>
          <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
            {saving ? "SAVING…" : "CHANGE PASSWORD"}
          </button>
        </div>
      </form>
    </div>
  );
}

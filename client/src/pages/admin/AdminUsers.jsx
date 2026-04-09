import { useState, useEffect } from "react";
import { adminService } from "@/services";
import { formatDate } from "@/utils";
import { Loader, Pagination } from "@/components/common";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users,      setUsers]   = useState([]);
  const [pagination, setPag]     = useState(null);
  const [loading,    setLoading] = useState(true);
  const [page,       setPage]    = useState(1);
  const [search,     setSearch]  = useState("");

  const fetch = () => {
    setLoading(true);
    adminService.getUsers({ page, limit: 20, search: search||undefined })
      .then((res) => { setUsers(res.data.data); setPag(res.data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, search]);

  const handleToggle = async (id) => {
    try {
      const res = await adminService.toggleUser(id);
      toast.success(`User ${res.data.data.isActive ? "activated" : "deactivated"}`);
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const ROLE_COLORS = { CUSTOMER: "text-blue-400", ADMIN: "text-gold", SUPER_ADMIN: "text-purple-400" };

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-[3px] text-gold mb-1">ADMIN</p>
        <h1 className="font-serif text-3xl font-light text-cream">Users</h1>
      </div>

      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by name or email…"
        className="w-full max-w-sm bg-dark-200 border border-white/10 text-cream font-sans text-sm px-4 py-2 mb-6 placeholder:text-cream-faint focus:border-gold/50 transition-colors" />

      {loading ? <Loader center /> : (
        <>
          <div className="border border-gold/15 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  {["Name","Email","Role","Orders","Joined","Status","Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-[9px] tracking-[3px] text-gold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gold/8 hover:bg-gold/3 transition-colors">
                    <td className="px-4 py-3 font-sans text-xs text-cream">{user.name}</td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-faint">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] tracking-wider ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream">{user._count?.orders || 0}</td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-faint">
                      {formatDate(user.createdAt, { month:"short", day:"numeric", year:"numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] tracking-wider px-2 py-0.5 ${user.isActive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                        {user.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(user.id)}
                        className={`font-sans text-[10px] tracking-wider ${user.isActive ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"} transition-colors`}>
                        {user.isActive ? "DEACTIVATE" : "ACTIVATE"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../services";

export default function ManageUsers() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminService.users(),
    select: (d) => d.data.data,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">User Accounts</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Registered Fans</h1>
      </div>

      <div className="bg-card border border-border rounded-card p-6 shadow-card">
        {isLoading ? (
          <p className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="py-12 text-center text-xs font-mono text-muted">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted font-mono uppercase">
                  <th className="pb-3 pt-2 font-semibold">Name</th>
                  <th className="pb-3 pt-2 font-semibold">Email</th>
                  <th className="pb-3 pt-2 font-semibold">Role</th>
                  <th className="pb-3 pt-2 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 font-semibold text-text-primary">{u.name}</td>
                    <td className="py-3 text-text-secondary">{u.email}</td>
                    <td className="py-3">
                      <span className={u.role === "admin" ? "badge-gold" : "badge-jade"}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

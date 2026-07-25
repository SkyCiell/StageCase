import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services';

export default function ManageUsers() {
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.users(),
    select: d => d.data.data,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-[1px] bg-bronze" />
          <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
            User Accounts
          </span>
        </div>
        <h1 className="font-display font-black text-ivory text-3xl tracking-tight">
          Registered Fans & Admins
        </h1>
      </div>

      {/* Table block */}
      <div className="border border-white/[0.06] bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-graphite text-text-muted font-mono uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5 font-semibold">Name</th>
                <th className="py-4 px-5 font-semibold">Email</th>
                <th className="py-4 px-5 font-semibold">Role</th>
                <th className="py-4 px-5 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5 font-bold text-ivory text-sm">{u.name}</td>
                  <td className="py-4 px-5 text-text-secondary">{u.email}</td>
                  <td className="py-4 px-5 uppercase font-mono font-bold text-bronze">{u.role}</td>
                  <td className="py-4 px-5 text-text-muted font-mono">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../services";

const S = { muted: "rgba(141,167,204,0.5)", white: "#F5F3F5", accent: "#8DA7CC", dimmed: "rgba(245,243,245,0.45)" };

const TH = ({ children }) => (
  <th className="py-3.5 px-5 font-mono font-bold text-[10px] uppercase tracking-[0.15em]" style={{ color: S.muted }}>{children}</th>
);

export default function ManageUsers() {
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminService.users(),
    select: (d) => d.data.data,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2" style={{ color: S.muted }}>User Accounts</p>
        <h1 className="font-display font-black uppercase tracking-tight" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: S.white, lineHeight: 1 }}>Registered Fans</h1>
      </div>

      <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)", background: "var(--admin-card)" }}>
                <TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Joined</TH>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(245,243,245,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(42,98,156,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="py-4 px-5 font-bold" style={{ color: S.white }}>{u.name}</td>
                  <td className="py-4 px-5" style={{ color: S.dimmed }}>{u.email}</td>
                  <td className="py-4 px-5 font-mono font-bold uppercase text-[10px] tracking-widest" style={{ color: S.accent }}>{u.role}</td>
                  <td className="py-4 px-5 font-mono" style={{ color: S.muted }}>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

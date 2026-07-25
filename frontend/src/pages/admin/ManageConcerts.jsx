import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { formatDateShort } from "../../utils";

const S = { muted: "rgba(141,167,204,0.5)", white: "#F5F3F5", accent: "#8DA7CC", dimmed: "rgba(245,243,245,0.45)" };

const TH = ({ children, right }) => (
  <th className={`py-3.5 px-5 font-mono font-bold text-[10px] uppercase tracking-[0.15em] ${right ? "text-right" : ""}`} style={{ color: S.muted }}>{children}</th>
);

export default function ManageConcerts() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", venue_id: "", description: "" });

  const { data: concerts = [] } = useQuery({
    queryKey: ["admin-concerts"],
    queryFn: () => adminService.concerts(),
    select: (d) => d.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (fd) => adminService.createConcert(fd),
    onSuccess: () => { toast.success("Concert created!"); queryClient.invalidateQueries(["admin-concerts"]); setIsOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteConcert(id),
    onSuccess: () => { toast.success("Concert deleted."); queryClient.invalidateQueries(["admin-concerts"]); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    createMutation.mutate(fd);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2" style={{ color: S.muted }}>Live Show Management</p>
          <h1 className="font-display font-black uppercase tracking-tight" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: S.white, lineHeight: 1 }}>Manage Concerts</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className="text-[11px] font-mono font-bold uppercase tracking-widest px-5 py-2.5 transition-colors" style={{ background: "#2A629C", color: "#F5F3F5" }}>
          + Add Concert
        </button>
      </div>

      <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)", background: "var(--admin-card)" }}>
                <TH>Title</TH><TH>Date & Time</TH><TH>Venue</TH><TH>Status</TH><TH right>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {concerts.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(245,243,245,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(42,98,156,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="py-4 px-5 font-bold" style={{ color: S.white }}>{c.title}</td>
                  <td className="py-4 px-5 font-mono" style={{ color: S.dimmed }}>{formatDateShort(c.date)} ({c.time})</td>
                  <td className="py-4 px-5" style={{ color: S.muted }}>{c.venue?.name || "—"}</td>
                  <td className="py-4 px-5"><Badge variant="jade">{c.status}</Badge></td>
                  <td className="py-4 px-5 text-right">
                    <button onClick={() => confirm("Delete this concert?") && deleteMutation.mutate(c.id)}
                      className="text-[10px] font-mono font-bold uppercase tracking-widest transition-colors" style={{ color: "#D65A5A" }}
                      onMouseEnter={e => e.target.style.opacity = "0.7"} onMouseLeave={e => e.target.style.opacity = "1"}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Concert">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Concert Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            <Input label="Time" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required />
          </div>
          <Input label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <button type="submit" disabled={createMutation.isLoading} className="w-full py-3.5 text-xs font-mono font-bold uppercase tracking-widest transition-colors disabled:opacity-50" style={{ background: "#2A629C", color: "#F5F3F5" }}>
            {createMutation.isLoading ? "Creating..." : "Create Concert"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

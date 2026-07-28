import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2, Calendar, Clock, MapPin } from "lucide-react";
import { adminService } from "../../services";
import Modal from "../../components/ui/Modal";
import { formatDateShort } from "../../utils";

export default function ManageConcerts() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", venue_id: "", description: "" });

  const { data: concerts = [], isLoading } = useQuery({
    queryKey: ["admin-concerts"],
    queryFn: () => adminService.concerts(),
    select: (d) => d.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (fd) => adminService.createConcert(fd),
    onSuccess: () => { 
      toast.success("Concert created!"); 
      queryClient.invalidateQueries(["admin-concerts"]); 
      setIsOpen(false);
      setForm({ title: "", date: "", time: "", venue_id: "", description: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create concert."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteConcert(id),
    onSuccess: () => { toast.success("Concert deleted."); queryClient.invalidateQueries(["admin-concerts"]); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete concert."),
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
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Live Show Management</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Manage Concerts</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className="btn-primary text-xs py-2.5 px-4 justify-center">
          <Plus className="w-4 h-4" /> Add New Concert
        </button>
      </div>

      {/* Concerts Table */}
      <div className="bg-card border border-border rounded-card p-6 shadow-card">
        {isLoading ? (
          <p className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted">Loading concerts...</p>
        ) : concerts.length === 0 ? (
          <p className="py-12 text-center text-xs font-mono text-muted">No concerts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted font-mono uppercase">
                  <th className="pb-3 pt-2 font-semibold">Title</th>
                  <th className="pb-3 pt-2 font-semibold">Date & Time</th>
                  <th className="pb-3 pt-2 font-semibold">Venue</th>
                  <th className="pb-3 pt-2 font-semibold">Status</th>
                  <th className="pb-3 pt-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {concerts.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 font-semibold text-text-primary">{c.title}</td>
                    <td className="py-3 font-mono text-text-secondary">
                      {formatDateShort(c.date)} ({c.time})
                    </td>
                    <td className="py-3 text-muted">{c.venue?.name || "—"}</td>
                    <td className="py-3">
                      <span className="badge-jade uppercase text-[10px]">{c.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => window.confirm("Delete this concert?") && deleteMutation.mutate(c.id)}
                        className="btn-ghost text-xs text-danger hover:bg-danger/10 py-1.5 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Concert">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Concert Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-premium"
              placeholder="e.g. Crayon Case World Tour 2026"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="input-premium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="input-premium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-premium min-h-[80px] resize-none"
              placeholder="Live event description and tour details..."
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="btn-primary w-full py-3 text-xs justify-center disabled:opacity-50"
          >
            {createMutation.isLoading ? "Creating..." : "Create Concert"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

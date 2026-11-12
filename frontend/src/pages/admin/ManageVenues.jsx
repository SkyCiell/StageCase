import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Music, Trash2 } from 'lucide-react';
import { adminService } from '../../services';
import Modal from '../../components/ui/Modal';

export default function ManageVenues() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', province: '', address: '', capacity: '', artist_name: '' });

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: () => adminService.venues({ limit: 100 }),
    select: (d) => d.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminService.createVenue(data),
    onSuccess: () => {
      toast.success('Venue added!');
      queryClient.invalidateQueries(); // Invalidate all queries across app for realtime sync
      setIsOpen(false);
      setForm({ name: '', city: '', province: '', address: '', capacity: '', artist_name: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add venue.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteVenue(id),
    onSuccess: () => {
      toast.success('Venue deleted!');
      queryClient.invalidateQueries(); // Invalidate all queries across app for realtime sync
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete venue.'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Location Database</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Manage Venues</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className="btn-primary text-xs py-2.5 px-4 justify-center">
          <Plus className="w-4 h-4" /> Add Venue
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-card p-6 shadow-card">
        {isLoading ? (
          <p className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted">Loading venues...</p>
        ) : venues.length === 0 ? (
          <p className="py-12 text-center text-xs font-mono text-muted">No venues found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted font-mono uppercase">
                  <th className="pb-3 pt-2 font-semibold">Venue Name</th>
                  <th className="pb-3 pt-2 font-semibold">Performing Band / Artist</th>
                  <th className="pb-3 pt-2 font-semibold">City</th>
                  <th className="pb-3 pt-2 font-semibold">Province</th>
                  <th className="pb-3 pt-2 font-semibold">Address</th>
                  <th className="pb-3 pt-2 font-semibold">Capacity</th>
                  <th className="pb-3 pt-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {venues.map((v) => (
                  <tr key={v.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 font-semibold text-text-primary">{v.name}</td>
                    <td className="py-3">
                      {v.concerts && v.concerts.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {v.concerts.map((c) => (
                            <span
                              key={c.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20"
                              title={c.title}
                            >
                              <Music className="w-3 h-3" />
                              {c.artist_name || c.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted text-[11px] font-mono italic">— No Band Assigned</span>
                      )}
                    </td>
                    <td className="py-3 text-text-secondary">{v.city}</td>
                    <td className="py-3 text-muted">{v.province || '—'}</td>
                    <td className="py-3 text-muted max-w-[200px] truncate">{v.address || '—'}</td>
                    <td className="py-3 font-mono font-semibold text-accent">{v.capacity ? `${v.capacity.toLocaleString()} seats` : 'N/A'}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete venue "${v.name}" and its associated concerts?`)) {
                            deleteMutation.mutate(v.id);
                          }
                        }}
                        disabled={deleteMutation.isLoading}
                        className="p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                        title="Delete Venue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Venue Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Venue">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Venue Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="input-premium"
              placeholder="e.g. Istora Senayan"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gold uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> Performing Band / Artist (Optional)
            </label>
            <input
              type="text"
              value={form.artist_name}
              onChange={e => setForm(p => ({ ...p, artist_name: e.target.value }))}
              className="input-premium border-gold/30 focus:border-gold"
              placeholder="e.g. Coldplay, Sheila On 7, Noah"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="input-premium"
                placeholder="Jakarta"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Province</label>
              <input
                type="text"
                value={form.province}
                onChange={e => setForm(p => ({ ...p, province: e.target.value }))}
                className="input-premium"
                placeholder="DKI Jakarta"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              className="input-premium"
              placeholder="Jl. Pintu Satu Senayan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Capacity</label>
            <input
              type="number"
              value={form.capacity}
              onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
              className="input-premium"
              placeholder="7500"
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="btn-primary w-full py-3 text-xs justify-center disabled:opacity-50"
          >
            {createMutation.isLoading ? "Saving..." : "Save Venue"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

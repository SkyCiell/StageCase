import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const S = {
  muted: 'rgba(141,167,204,0.5)',
  white: '#F5F3F5',
  accent: '#8DA7CC',
  dimmed: 'rgba(245,243,245,0.45)',
};

const TH = ({ children }) => (
  <th
    className="py-3.5 px-5 font-mono font-bold text-[10px] uppercase tracking-[0.15em]"
    style={{ color: S.muted }}
  >
    {children}
  </th>
);

export default function ManageVenues() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', province: '', address: '', capacity: '' });

  const { data: venues = [] } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: () => adminService.venues ? adminService.venues() : Promise.resolve({ data: { data: [] } }),
    select: (d) => d.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminService.createVenue(data),
    onSuccess: () => {
      toast.success('Venue added!');
      queryClient.invalidateQueries(['admin-venues']);
      setIsOpen(false);
      setForm({ name: '', city: '', province: '', address: '', capacity: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2"
            style={{ color: S.muted }}
          >
            Location Database
          </p>
          <h1
            className="font-display font-black uppercase tracking-tight"
            style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: S.white, lineHeight: 1 }}
          >
            Manage Venues
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-[11px] font-mono font-bold uppercase tracking-widest px-5 py-2.5 transition-colors"
          style={{ background: '#2A629C', color: '#F5F3F5' }}
        >
          + Add Venue
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-card)' }}>
                <TH>Venue Name</TH>
                <TH>City</TH>
                <TH>Province</TH>
                <TH>Address</TH>
                <TH>Capacity</TH>
              </tr>
            </thead>
            <tbody>
              {venues.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center font-mono text-[11px]" style={{ color: S.muted }}>
                    No venues found.
                  </td>
                </tr>
              )}
              {venues.map((v) => (
                <tr
                  key={v.id}
                  style={{ borderBottom: '1px solid rgba(245,243,245,0.04)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(42,98,156,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="py-4 px-5 font-bold" style={{ color: S.white }}>{v.name}</td>
                  <td className="py-4 px-5" style={{ color: S.dimmed }}>{v.city}</td>
                  <td className="py-4 px-5" style={{ color: S.muted }}>{v.province}</td>
                  <td className="py-4 px-5 max-w-xs truncate" style={{ color: S.muted }}>{v.address}</td>
                  <td className="py-4 px-5 font-mono font-bold" style={{ color: S.accent }}>
                    {v.capacity ? v.capacity.toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Venue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Venue Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              required
            />
            <Input
              label="Province"
              value={form.province}
              onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
              required
            />
          </div>
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            required
          />
          <Input
            label="Capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
          />
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="w-full py-3.5 text-xs font-mono font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
            style={{ background: '#2A629C', color: '#F5F3F5' }}
          >
            {createMutation.isLoading ? 'Saving...' : 'Save Venue'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

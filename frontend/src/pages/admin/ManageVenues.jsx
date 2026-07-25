import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { concertService, adminService } from '../../services';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

export default function ManageVenues() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', province: '', address: '', capacity: '' });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => concertService.list({ limit: 50 }),
    select: d => d.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminService.createVenue(data),
    onSuccess: () => {
      toast.success('Venue added!');
      queryClient.invalidateQueries(['venues']);
      setIsOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-[1px] bg-bronze" />
            <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
              Location Database
            </span>
          </div>
          <h1 className="font-display font-black text-ivory text-3xl tracking-tight">
            Manage Venues
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary px-6 py-3 text-xs font-bold tracking-widest uppercase"
        >
          + Add New Venue
        </button>
      </div>

      {/* Table block */}
      <div className="border border-white/[0.06] bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-graphite text-text-muted font-mono uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5 font-semibold">Venue Name</th>
                <th className="py-4 px-5 font-semibold">City</th>
                <th className="py-4 px-5 font-semibold">Address</th>
                <th className="py-4 px-5 font-semibold">Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {venues.map(v => (
                <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5 font-bold text-ivory text-sm">{v.name}</td>
                  <td className="py-4 px-5 text-text-secondary">{v.city}</td>
                  <td className="py-4 px-5 text-text-muted max-w-xs truncate">{v.address}</td>
                  <td className="py-4 px-5 font-mono text-bronze font-bold">{v.capacity?.toLocaleString() || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Venue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Venue Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required />
            <Input label="Province" value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))} required />
          </div>
          <Input label="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required />
          <Input label="Capacity" type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} />
          <button type="submit" disabled={createMutation.isLoading} className="w-full btn-primary py-3.5 text-xs font-bold tracking-widest uppercase">
            Save Venue
          </button>
        </form>
      </Modal>
    </div>
  );
}

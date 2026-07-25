import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService, concertService } from '../../services';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { formatDateShort } from '../../utils';

export default function ManageConcerts() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', venue_id: '', description: '' });

  const { data: concerts = [] } = useQuery({
    queryKey: ['admin-concerts'],
    queryFn: () => adminService.concerts(),
    select: d => d.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (formData) => adminService.createConcert(formData),
    onSuccess: () => {
      toast.success('Concert created!');
      queryClient.invalidateQueries(['admin-concerts']);
      setIsCreateOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteConcert(id),
    onSuccess: () => {
      toast.success('Concert deleted');
      queryClient.invalidateQueries(['admin-concerts']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-[1px] bg-bronze" />
            <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
              Live Show Management
            </span>
          </div>
          <h1 className="font-display font-black text-ivory text-3xl tracking-tight">
            Manage Concerts
          </h1>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary px-6 py-3 text-xs font-bold tracking-widest uppercase"
        >
          + Add New Concert
        </button>
      </div>

      {/* Table block */}
      <div className="border border-white/[0.06] bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-graphite text-text-muted font-mono uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5 font-semibold">Concert Title</th>
                <th className="py-4 px-5 font-semibold">Date & Time</th>
                <th className="py-4 px-5 font-semibold">Venue</th>
                <th className="py-4 px-5 font-semibold">Status</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {concerts.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5 font-bold text-ivory text-sm">{c.title}</td>
                  <td className="py-4 px-5 text-text-secondary font-mono">{formatDateShort(c.date)} ({c.time})</td>
                  <td className="py-4 px-5 text-text-muted">{c.venue?.name || '—'}</td>
                  <td className="py-4 px-5"><Badge variant="jade">{c.status}</Badge></td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => confirm('Delete concert listing?') && deleteMutation.mutate(c.id)}
                      className="text-xs text-red-400 hover:text-red-300 underline uppercase tracking-wider font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Concert">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Concert Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            <Input label="Time" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required />
          </div>
          <Input label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <button type="submit" disabled={createMutation.isLoading} className="w-full btn-primary py-3.5 text-xs font-bold tracking-widest uppercase">
            Create Concert
          </button>
        </form>
      </Modal>
    </div>
  );
}

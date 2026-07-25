import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService, getImageUrl } from '../../services';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils';

export default function ManageBookings() {
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminService.bookings(),
    select: d => d.data.data,
  });

  const approveMutation = useMutation({
    mutationFn: (paymentId) => adminService.approvePayment(paymentId),
    onSuccess: () => {
      toast.success('Payment approved! E-ticket issued.');
      queryClient.invalidateQueries(['admin-bookings']);
      setSelectedPayment(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve payment.'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ paymentId, reason }) => adminService.rejectPayment(paymentId, reason),
    onSuccess: () => {
      toast.success('Payment rejected.');
      queryClient.invalidateQueries(['admin-bookings']);
      setSelectedPayment(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reject payment.'),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-[1px] bg-bronze" />
          <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
            Order Administration
          </span>
        </div>
        <h1 className="font-display font-black text-ivory text-3xl tracking-tight">
          Manage Orders & Payments
        </h1>
      </div>

      {/* Table block */}
      <div className="border border-white/[0.06] bg-surface">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted font-mono tracking-widest uppercase">
            Fetching Order Database...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-graphite text-text-muted font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5 font-semibold">Booking Ref</th>
                  <th className="py-4 px-5 font-semibold">Customer</th>
                  <th className="py-4 px-5 font-semibold">Concert</th>
                  <th className="py-4 px-5 font-semibold">Amount</th>
                  <th className="py-4 px-5 font-semibold">Status</th>
                  <th className="py-4 px-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-bronze">{b.booking_code}</td>
                    <td className="py-4 px-5 text-ivory font-semibold">
                      {b.user?.name}
                      <p className="text-[11px] font-normal text-text-muted">{b.user?.email}</p>
                    </td>
                    <td className="py-4 px-5 text-text-secondary max-w-[200px] truncate">{b.concert?.title}</td>
                    <td className="py-4 px-5 font-bold text-amber font-display">{formatCurrency(b.total_price)}</td>
                    <td className="py-4 px-5">
                      <Badge variant={getStatusColor(b.status)}>{getStatusLabel(b.status)}</Badge>
                    </td>
                    <td className="py-4 px-5 text-right">
                      {b.payment?.proof_image && (
                        <button
                          onClick={() => setSelectedPayment(b)}
                          className="px-4 py-2 border border-white/10 hover:border-bronze text-ivory text-[11px] font-bold tracking-wider uppercase transition-colors"
                        >
                          Review Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Review Payment Receipt">
        {selectedPayment && (
          <div className="space-y-6">
            <div className="text-xs space-y-1 border-b border-white/[0.06] pb-4">
              <p className="text-text-muted">Booking Reference: <span className="font-mono text-bronze font-bold">{selectedPayment.booking_code}</span></p>
              <p className="text-text-muted">Total Amount: <span className="font-bold text-amber font-display">{formatCurrency(selectedPayment.total_price)}</span></p>
            </div>

            {selectedPayment.payment?.proof_image && (
              <div className="border border-white/[0.06] bg-background p-4 flex justify-center">
                <img
                  src={getImageUrl(selectedPayment.payment.proof_image, 'payments')}
                  alt="Payment Receipt Proof"
                  className="max-h-80 object-contain"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
              <button
                onClick={() => approveMutation.mutate(selectedPayment.payment.id)}
                disabled={approveMutation.isLoading}
                className="flex-1 btn-primary py-3.5 text-xs font-bold tracking-widest uppercase disabled:opacity-50"
              >
                Approve Payment
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Reason for rejecting payment:');
                  if (reason) rejectMutation.mutate({ paymentId: selectedPayment.payment.id, reason });
                }}
                disabled={rejectMutation.isLoading}
                className="flex-1 px-6 py-3.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                Reject Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

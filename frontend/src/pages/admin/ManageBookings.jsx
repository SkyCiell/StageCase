import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, X, FileText, Eye } from "lucide-react";
import { adminService, getImageUrl } from "../../services";
import Modal from "../../components/ui/Modal";
import { formatCurrency, getStatusLabel } from "../../utils";

export default function ManageBookings() {
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminService.bookings(),
    select: (d) => d.data.data,
  });

  const approveMutation = useMutation({
    mutationFn: (paymentId) => adminService.approvePayment(paymentId),
    onSuccess: () => {
      toast.success("Payment approved! E-ticket issued.");
      queryClient.invalidateQueries(["admin-bookings"]);
      setSelectedPayment(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to approve."),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ paymentId, reason }) => adminService.rejectPayment(paymentId, reason),
    onSuccess: () => {
      toast.success("Payment rejected.");
      queryClient.invalidateQueries(["admin-bookings"]);
      setSelectedPayment(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to reject."),
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Order Administration</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          Manage Orders & Payments
        </h1>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-card p-6 shadow-card">
        {isLoading ? (
          <p className="py-12 text-center text-xs font-mono uppercase tracking-widest text-muted">Loading orders...</p>
        ) : bookings.length === 0 ? (
          <p className="py-12 text-center text-xs font-mono text-muted">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted font-mono uppercase">
                  <th className="pb-3 pt-2 font-semibold">Booking Ref</th>
                  <th className="pb-3 pt-2 font-semibold">Customer</th>
                  <th className="pb-3 pt-2 font-semibold">Concert</th>
                  <th className="pb-3 pt-2 font-semibold">Amount</th>
                  <th className="pb-3 pt-2 font-semibold">Status</th>
                  <th className="pb-3 pt-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-accent">#{b.booking_code}</td>
                    <td className="py-3">
                      <p className="font-semibold text-text-primary">{b.user?.name}</p>
                      <p className="text-[11px] text-muted">{b.user?.email}</p>
                    </td>
                    <td className="py-3 text-text-secondary max-w-[180px] truncate">{b.concert?.title}</td>
                    <td className="py-3 font-mono font-semibold text-text-primary">{formatCurrency(b.total_price)}</td>
                    <td className="py-3">
                      <span className={b.status === "confirmed" ? "badge-jade" : "badge-gold"}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {b.payment?.proof_image && (
                        <button
                          onClick={() => setSelectedPayment(b)}
                          className="btn-ghost text-xs py-1.5 px-3"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review Receipt
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

      {/* Review Receipt Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Review Payment Receipt">
        {selectedPayment && (
          <div className="space-y-4 pt-2">
            <div className="text-xs space-y-1 pb-3 border-b border-border">
              <p className="text-muted font-mono">Booking Ref: <span className="font-bold text-accent">#{selectedPayment.booking_code}</span></p>
              <p className="text-muted font-mono">Total Amount: <span className="font-bold text-text-primary">{formatCurrency(selectedPayment.total_price)}</span></p>
            </div>
            {selectedPayment.payment?.proof_image && (
              <div className="flex justify-center p-3 bg-surface rounded-md border border-border">
                <img src={getImageUrl(selectedPayment.payment.proof_image, "payments")} alt="Payment Proof" className="max-h-72 object-contain rounded-md" />
              </div>
            )}
            <div className="flex gap-3 pt-3 border-t border-border">
              <button
                onClick={() => approveMutation.mutate(selectedPayment.payment.id)}
                disabled={approveMutation.isLoading}
                className="btn-primary flex-1 text-xs justify-center py-2.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> Approve Payment
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Reason for rejecting:");
                  if (reason) rejectMutation.mutate({ paymentId: selectedPayment.payment.id, reason });
                }}
                disabled={rejectMutation.isLoading}
                className="btn-ghost text-xs flex-1 text-danger border-danger/30 hover:bg-danger/10 justify-center py-2.5 disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Reject Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

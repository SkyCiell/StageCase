import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, X, FileText, Eye, QrCode, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { adminService, getImageUrl } from "../../services";
import Modal from "../../components/ui/Modal";
import QRScannerModal from "../../components/admin/QRScannerModal";
import { formatCurrency, getStatusLabel } from "../../utils";

export default function ManageBookings() {
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminService.bookings({ limit: 100 }),
    refetchInterval: 3000,
    select: (d) => {
      const payload = d?.data?.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Order Administration</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Manage Orders & Payments
          </h1>
        </div>
        <button
          onClick={() => setIsScannerOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold inline-flex items-center gap-2 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <QrCode className="w-4 h-4 text-accent" /> Scan & Validate Gate Pass
        </button>
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
                {bookings.map((b) => {
                  const isRejected = b.status === "rejected" || b.status === "cancelled" || b.payment?.status === "rejected";
                  const isConfirmed = b.status === "confirmed" || b.payment?.status === "approved";
                  
                  const rowClass = isRejected
                    ? "bg-danger/10 hover:bg-danger/15 border-l-4 border-l-danger transition-colors"
                    : isConfirmed
                    ? "hover:bg-surface/50 border-l-4 border-l-success transition-colors"
                    : "hover:bg-surface/50 border-l-4 border-l-warning transition-colors";

                  return (
                    <tr key={b.id} className={rowClass}>
                      <td className="py-3 px-3 font-mono font-bold text-accent">#{b.booking_code}</td>
                      <td className="py-3">
                        <p className="font-semibold text-text-primary">{b.user?.name}</p>
                        <p className="text-[11px] text-muted">{b.user?.email}</p>
                      </td>
                      <td className="py-3 text-text-secondary max-w-[180px] truncate">{b.concert?.title}</td>
                      <td className="py-3 font-mono font-semibold text-text-primary">{formatCurrency(b.total_price)}</td>
                      <td className="py-3">
                        <span className={
                          isRejected
                            ? "bg-danger text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                            : isConfirmed 
                            ? "badge-jade" 
                            : "badge-gold"
                        }>
                          {isRejected ? "REJECTED" : getStatusLabel(b.status)}
                        </span>
                        {b.payment?.rejection_reason && (
                          <p className="text-[10px] text-danger font-semibold italic truncate max-w-[150px] mt-1" title={b.payment.rejection_reason}>
                            Reason: {b.payment.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="py-3 text-right pr-3">
                        <button
                          onClick={() => setSelectedPayment(b)}
                          className={`btn-ghost text-xs py-1.5 px-3 ${isRejected ? 'text-danger hover:bg-danger/20' : ''}`}
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Receipt & Order Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Order & E-Ticket Pass Details">
        {selectedPayment && (
          <div className="space-y-4 pt-2">
            <div className="text-xs space-y-1 pb-3 border-b border-border">
              <p className="text-muted font-mono">Booking Ref: <span className="font-bold text-accent">#{selectedPayment.booking_code}</span></p>
              <p className="text-muted font-mono">Customer: <span className="font-semibold text-text-primary">{selectedPayment.user?.name} ({selectedPayment.user?.email})</span></p>
              <p className="text-muted font-mono">Concert: <span className="font-semibold text-text-primary">{selectedPayment.concert?.title}</span></p>
              <p className="text-muted font-mono">Total Amount: <span className="font-bold text-text-primary">{formatCurrency(selectedPayment.total_price)}</span></p>
              <p className="text-muted font-mono">Current Status: <span className="font-bold text-accent uppercase">{selectedPayment.status}</span></p>
            </div>

            {/* Official User QR Code Pass View for Confirmed Orders */}
            {(selectedPayment.status === "confirmed" || selectedPayment.payment?.status === "approved") && (
              <div className="p-4 bg-surface rounded-card border border-border text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-success font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> Official Confirmed E-Ticket QR Pass
                </div>
                <div className="p-4 bg-white inline-block rounded-card border-2 border-border shadow-md">
                  <QRCodeSVG
                    value={selectedPayment.details?.[0]?.qr_code_data || selectedPayment.booking_code}
                    size={150}
                    bgColor="#FFFFFF"
                    fgColor="#0D1117"
                  />
                </div>
                <p className="text-[11px] font-mono text-muted">Pass Code: <span className="font-bold text-accent">#{selectedPayment.booking_code}</span></p>
              </div>
            )}

            {selectedPayment.payment?.proof_image ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-primary">Payment Proof Image:</p>
                <div className="flex justify-center p-3 bg-surface rounded-md border border-border">
                  <img src={getImageUrl(selectedPayment.payment.proof_image, "payments")} alt="Payment Proof" className="max-h-72 object-contain rounded-md" />
                </div>
              </div>
            ) : !(selectedPayment.status === "confirmed" || selectedPayment.payment?.status === "approved") && (
              <div className="p-3 bg-surface rounded-md border border-border text-center text-xs text-muted">
                No manual receipt uploaded (Online Payment / Waiting Payment)
              </div>
            )}

            {/* If payment is already finalized (approved/confirmed or rejected), disable actions */}
            {(selectedPayment.status === "confirmed" || selectedPayment.status === "rejected" || selectedPayment.payment?.status === "approved" || selectedPayment.payment?.status === "rejected") ? (
              <div className="p-3 bg-surface border border-border rounded-md text-center text-xs font-mono">
                <p className="font-bold text-muted">Status finalized. E-ticket issued / rejected.</p>
                {selectedPayment.payment?.rejection_reason && (
                  <p className="text-danger mt-1">Reason: "{selectedPayment.payment.rejection_reason}"</p>
                )}
              </div>
            ) : (
              <div className="flex gap-3 pt-3 border-t border-border">
                {selectedPayment.payment?.id && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* QR Scanner & Gate Pass Authenticator Modal */}
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}

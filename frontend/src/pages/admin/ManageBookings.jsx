import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminService, getImageUrl } from "../../services";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { formatCurrency, getStatusColor, getStatusLabel } from "../../utils";

const S = {
  muted:   "rgba(141,167,204,0.5)",
  dimmed:  "rgba(245,243,245,0.45)",
  accent:  "#8DA7CC",
  white:   "#F5F3F5",
  border:  "1px solid rgba(245,243,245,0.06)",
};

function PageHeader({ label, title }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2" style={{ color: S.muted }}>{label}</p>
      <h1 className="font-display font-black uppercase tracking-tight" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: S.white, lineHeight: 1 }}>{title}</h1>
    </div>
  );
}

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
      <PageHeader label="Order Administration" title="Manage Orders & Payments" />

      {/* Table */}
      <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        {isLoading ? (
          <p className="p-8 text-center text-xs font-mono uppercase tracking-widest" style={{ color: S.muted }}>Loading orders...</p>
        ) : bookings.length === 0 ? (
          <p className="p-12 text-center text-xs font-mono" style={{ color: S.muted }}>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)", background: "var(--admin-card)" }}>
                  {["Booking Ref", "Customer", "Concert", "Amount", "Status", "Action"].map((h, i) => (
                    <th key={h} className={`py-3.5 px-5 font-mono font-bold uppercase tracking-[0.15em] ${i === 5 ? "text-right" : ""}`} style={{ color: S.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: "1px solid rgba(245,243,245,0.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(42,98,156,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td className="py-4 px-5 font-mono font-bold" style={{ color: S.accent }}>{b.booking_code}</td>
                    <td className="py-4 px-5">
                      <p className="font-semibold" style={{ color: S.white }}>{b.user?.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: S.muted }}>{b.user?.email}</p>
                    </td>
                    <td className="py-4 px-5 max-w-[180px] truncate" style={{ color: S.dimmed }}>{b.concert?.title}</td>
                    <td className="py-4 px-5 font-bold font-mono" style={{ color: S.white }}>{formatCurrency(b.total_price)}</td>
                    <td className="py-4 px-5"><Badge variant={getStatusColor(b.status)}>{getStatusLabel(b.status)}</Badge></td>
                    <td className="py-4 px-5 text-right">
                      {b.payment?.proof_image && (
                        <button
                          onClick={() => setSelectedPayment(b)}
                          className="text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2 transition-colors"
                          style={{ border: "1px solid rgba(141,167,204,0.3)", color: S.accent }}
                          onMouseEnter={e => { e.target.style.borderColor = "#8DA7CC"; e.target.style.color = S.white; }}
                          onMouseLeave={e => { e.target.style.borderColor = "rgba(141,167,204,0.3)"; e.target.style.color = S.accent; }}
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

      {/* Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Review Payment Receipt">
        {selectedPayment && (
          <div className="space-y-5">
            <div className="text-xs space-y-1 pb-4" style={{ borderBottom: "1px solid rgba(245,243,245,0.06)" }}>
              <p style={{ color: S.muted }}>Booking Ref: <span className="font-mono font-bold" style={{ color: S.accent }}>{selectedPayment.booking_code}</span></p>
              <p style={{ color: S.muted }}>Amount: <span className="font-bold" style={{ color: S.white }}>{formatCurrency(selectedPayment.total_price)}</span></p>
            </div>
            {selectedPayment.payment?.proof_image && (
              <div className="flex justify-center p-4" style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                <img src={getImageUrl(selectedPayment.payment.proof_image, "payments")} alt="Payment Proof" className="max-h-80 object-contain" />
              </div>
            )}
            <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid rgba(245,243,245,0.06)" }}>
              <button
                onClick={() => approveMutation.mutate(selectedPayment.payment.id)}
                disabled={approveMutation.isLoading}
                className="flex-1 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                style={{ background: "#2A629C", color: "#F5F3F5" }}
              >
                Approve Payment
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Reason for rejecting:");
                  if (reason) rejectMutation.mutate({ paymentId: selectedPayment.payment.id, reason });
                }}
                disabled={rejectMutation.isLoading}
                className="flex-1 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                style={{ border: "1px solid rgba(214,90,90,0.4)", color: "#D65A5A" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(214,90,90,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
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

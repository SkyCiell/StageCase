import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CreditCard, FileText, Upload, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Building2 } from 'lucide-react';
import { bookingService, paymentService } from '../../services';
import Layout from '../../components/layout/Layout';
import { formatCurrency } from '../../utils';

const BANK_ACCOUNTS = [
  { bank: 'BCA',           number: '8410-992-110',      holder: 'PT STAGECASE INDONESIA' },
  { bank: 'Mandiri',       number: '137-00-99211-00',   holder: 'PT STAGECASE INDONESIA' },
  { bank: 'GoPay / QRIS',  number: '0812-3456-7890',    holder: 'StageCase Official' },
];

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState('gateway'); // 'gateway' or 'manual'
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [method, setMethod] = useState('BCA');
  const [uploading, setUploading] = useState(false);
  const [processingGateway, setProcessingGateway] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
    select: d => d.data.data,
  });

  // Load Midtrans Snap script
  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_KEY';
    
    if (window.snap) {
      setSnapReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    
    script.onload = () => setSnapReady(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('File size must be under 5MB.');
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePayWithGateway = async () => {
    if (!snapReady || !window.snap) {
      toast.error('Payment gateway is loading... Please try again in a moment.');
      return;
    }

    setProcessingGateway(true);
    try {
      const response = await paymentService.createGateway(id);
      const { snap_token } = response.data.data;

      window.snap.pay(snap_token, {
        onSuccess: function(result) {
          toast.success('Payment successful! Generating your e-ticket...');
          setTimeout(() => navigate(`/booking/success/${id}`), 1500);
        },
        onPending: function(result) {
          toast.success('Payment processing...');
          setTimeout(() => navigate(`/booking/success/${id}`), 1500);
        },
        onError: function(result) {
          toast.error('Payment failed. Please try again.');
        },
        onClose: function() {
          toast('Payment cancelled', { icon: 'ℹ️' });
        }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment gateway.');
    } finally {
      setProcessingGateway(false);
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error('Please select an image file to upload.');
    setUploading(true);

    const formData = new FormData();
    formData.append('proof_image', selectedFile);
    formData.append('method', method);
    formData.append('amount', booking.total_price);

    try {
      await paymentService.uploadProof(id, formData);
      toast.success('Payment proof uploaded successfully!');
      navigate(`/booking/success/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload payment proof.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <p className="text-xs text-muted font-mono tracking-widest uppercase">Loading Payment Session...</p>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <h2 className="font-display font-bold text-2xl text-text-primary mb-2">Booking Not Found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium max-w-4xl">

          {/* ── Header ── */}
          <div className="border-b border-border pb-8 mb-8">
            <span className="badge-jade text-[10px] uppercase tracking-wider mb-2">Step 3 of 3 — Final Step</span>
            <div className="flex flex-wrap items-baseline justify-between gap-4 mt-1">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Complete Payment</h1>
              <p className="text-xs text-muted font-mono">
                BOOKING CODE: <span className="text-accent font-bold">{booking.booking_code}</span>
              </p>
            </div>
          </div>

          {/* Amount Due Banner */}
          <div className="bg-card border border-border rounded-card p-8 text-center mb-8 shadow-card relative overflow-hidden">
            <p className="text-[10px] text-muted uppercase tracking-wider font-mono font-semibold mb-2">
              Total Amount Due
            </p>
            <p className="font-display font-black text-accent text-3xl sm:text-5xl">
              {formatCurrency(booking.total_price)}
            </p>
          </div>

          {/* Payment Mode Selector */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMode('gateway')}
              className={`p-5 rounded-card border transition-all duration-200 cursor-pointer ${
                paymentMode === 'gateway'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-gold'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-bold text-sm text-text-primary">Instant Online Payment</p>
                  <p className="text-[11px] text-muted">GoPay, QRIS, Credit Card, Virtual Account</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMode('manual')}
              className={`p-5 rounded-card border transition-all duration-200 cursor-pointer ${
                paymentMode === 'manual'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-gold'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-bold text-sm text-text-primary">Manual Bank Transfer</p>
                  <p className="text-[11px] text-muted">Upload transfer receipt for verification</p>
                </div>
              </div>
            </button>
          </div>

          {/* Payment Gateway Mode */}
          {paymentMode === 'gateway' && (
            <div className="bg-card border border-border rounded-card p-8 text-center space-y-6 shadow-card">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/30">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Instant Payment Gateway</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Pay securely using Midtrans. Your e-ticket pass will be generated immediately upon payment confirmation.
                </p>
                <div className="flex flex-wrap gap-2 justify-center py-2">
                  {['GoPay', 'ShopeePay', 'BCA VA', 'Mandiri VA', 'Credit Card', 'QRIS'].map(m => (
                    <span key={m} className="px-3 py-1 bg-surface border border-border rounded-full text-[11px] font-mono text-muted">
                      {m}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handlePayWithGateway}
                  disabled={processingGateway || !snapReady}
                  className="btn-primary w-full py-3.5 text-xs font-semibold justify-center disabled:opacity-50"
                >
                  {!snapReady ? 'Loading Gateway...' : processingGateway ? 'Processing...' : 'Pay Now with Midtrans'} <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-muted flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" /> Secured by Midtrans Encryption
                </p>
              </div>
            </div>
          )}

          {/* Manual Transfer Mode */}
          {paymentMode === 'manual' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── Left — Bank Account Selector ── */}
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 space-y-4 shadow-card">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <Building2 className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider">
                    1. Select Bank Account
                  </h3>
                </div>

                <div className="space-y-3">
                  {BANK_ACCOUNTS.map(b => {
                    const isSelected = method === b.bank;
                    return (
                      <div
                        key={b.bank}
                        onClick={() => setMethod(b.bank)}
                        className={`p-4 rounded-md border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-surface/30 hover:border-gold'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-text-primary text-sm">{b.bank}</span>
                          <span className={`text-[10px] uppercase font-mono tracking-wider ${isSelected ? 'text-accent font-bold' : 'text-muted'}`}>
                            {isSelected ? '✓ Selected' : 'Select'}
                          </span>
                        </div>
                        <p className="font-mono text-accent text-base font-bold select-all tracking-wider">{b.number}</p>
                        <p className="text-[11px] text-muted mt-1">{b.holder}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Right — Upload Proof ── */}
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 space-y-4 shadow-card">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <Upload className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold text-text-text-primary uppercase font-mono tracking-wider">
                    2. Upload Receipt
                  </h3>
                </div>

                <form onSubmit={handleUploadProof} className="space-y-4">
                  <div className="border-2 border-dashed border-border hover:border-primary transition-colors p-8 text-center flex flex-col items-center justify-center min-h-[180px] relative bg-surface rounded-md">
                    {preview ? (
                      <img src={preview} alt="Proof preview" className="max-h-40 object-contain rounded-md" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted mb-2" />
                        <p className="text-xs font-semibold text-text-primary">Click to select receipt image</p>
                        <p className="text-[10px] text-muted mt-1 font-mono">JPG, PNG, WEBP — MAX 5MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="btn-primary w-full py-3.5 text-xs font-semibold justify-center disabled:opacity-50"
                  >
                    {uploading ? 'Uploading Receipt...' : 'Submit Payment Proof'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

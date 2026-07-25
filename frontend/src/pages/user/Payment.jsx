import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [method, setMethod] = useState('BCA');
  const [uploading, setUploading] = useState(false);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
    select: d => d.data.data,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('File size must be under 5MB.');
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
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
          <p className="text-xs text-text-muted tracking-widest uppercase">Loading Payment Data...</p>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <h2 className="font-display font-bold text-2xl text-ivory mb-2">Booking Not Found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium max-w-4xl">

          {/* ── Header ── */}
          <div className="border-b border-white/[0.06] pb-8 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-[1px] bg-bronze" />
              <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-mono font-semibold">
                STEP 03 / 03 — PAYMENT PROOF
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h1
                className="font-display font-black text-ivory leading-none tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                Complete Payment
              </h1>
              <p className="text-xs text-text-muted font-mono">
                CODE: <span className="text-bronze font-bold">{booking.booking_code}</span>
              </p>
            </div>
          </div>

          {/* Amount Due Banner */}
          <div className="border border-white/[0.06] bg-graphite p-8 text-center mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary" />
            <p className="text-[10px] text-text-muted uppercase tracking-[0.25em] font-semibold mb-2">
              Total Amount Due
            </p>
            <p
              className="font-display font-black text-amber leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              {formatCurrency(booking.total_price)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* ── Left — Bank Account Selector ── */}
            <div className="border border-white/[0.06] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-[1px] bg-bronze" />
                <h3 className="text-xs font-bold text-ivory tracking-[0.15em] uppercase">
                  1. Select Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {BANK_ACCOUNTS.map(b => {
                  const isSelected = method === b.bank;
                  return (
                    <div
                      key={b.bank}
                      onClick={() => setMethod(b.bank)}
                      className={`p-5 border cursor-pointer transition-all duration-300 relative ${
                        isSelected
                          ? 'border-bronze bg-bronze/10'
                          : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {isSelected && <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-bronze" />}
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-ivory text-sm">{b.bank}</span>
                        <span className={`text-[10px] uppercase font-mono tracking-wider ${isSelected ? 'text-bronze' : 'text-text-muted'}`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                      <p className="font-mono text-amber text-lg font-bold select-all tracking-wider">{b.number}</p>
                      <p className="text-[11px] text-text-muted mt-1">{b.holder}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right — Upload Proof ── */}
            <div className="border border-white/[0.06] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-[1px] bg-bronze" />
                <h3 className="text-xs font-bold text-ivory tracking-[0.15em] uppercase">
                  2. Upload Transfer Receipt
                </h3>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                <div className="border border-dashed border-white/20 hover:border-bronze transition-colors p-8 text-center flex flex-col items-center justify-center min-h-[200px] relative bg-white/[0.01]">
                  {preview ? (
                    <img src={preview} alt="Proof preview" className="max-h-44 object-contain" />
                  ) : (
                    <>
                      <p className="text-4xl mb-3 opacity-40">📷</p>
                      <p className="text-xs font-bold text-ivory tracking-wide">Click or drag receipt file here</p>
                      <p className="text-[10px] text-text-muted mt-1 font-mono">JPG, PNG, WEBP — MAX 5MB</p>
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
                  className="w-full btn-primary py-4 text-xs font-bold tracking-[0.2em] uppercase disabled:opacity-50"
                >
                  {uploading ? 'Uploading Receipt...' : 'Submit Payment Proof'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect, useRef } from 'react';
import { QrCode, Search, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Ticket, User, Calendar, Camera, CameraOff, Upload, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { adminService } from '../../services';
import Modal from '../ui/Modal';
import { formatCurrency, formatDate } from '../../utils';

export default function QRScannerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'file' | 'manual'
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const html5QrCodeRef = useRef(null);

  // Initialize and stop camera on tab change or modal close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResult(null);
      setCode('');
      return;
    }

    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(false);

    try {
      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      // Small delay to ensure container element '#qr-reader' is rendered in DOM
      setTimeout(async () => {
        try {
          const scanner = new Html5Qrcode("qr-reader");
          html5QrCodeRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              handleQRScanned(decodedText);
            },
            () => {
              // Ignore frame scan errors
            }
          );
          setIsCameraActive(true);
        } catch (err) {
          console.error("Camera start error:", err);
          setCameraError(err.message || "Could not access camera. Please allow camera permissions or use manual entry.");
          setIsCameraActive(false);
        }
      }, 300);
    } catch (err) {
      setCameraError(err.message || "Failed to initialize camera scanner.");
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      } finally {
        html5QrCodeRef.current = null;
        setIsCameraActive(false);
      }
    }
  };

  const handleQRScanned = async (scannedCode) => {
    if (!scannedCode || loading) return;
    setCode(scannedCode);
    stopCamera();
    await verifyCode(scannedCode);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setCameraError('');
    try {
      const html5QrCode = new Html5Qrcode("file-qr-reader-temp");
      const decodedText = await html5QrCode.scanFile(file, true);
      setCode(decodedText);
      await verifyCode(decodedText);
    } catch (err) {
      setResult({
        status: 'INVALID',
        message: 'Could not detect or read a valid QR code from the uploaded image file.',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (targetCode) => {
    const codeToVerify = (targetCode || code).trim();
    if (!codeToVerify) return;

    setLoading(true);
    try {
      const res = await adminService.verifyQR(codeToVerify);
      setResult(res.data.data);
    } catch (err) {
      setResult({
        status: 'INVALID',
        message: err.response?.data?.message || 'Error verifying ticket pass code.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    verifyCode(code);
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gate Pass QR Scanner & Authenticator">
      <div className="space-y-4 pt-1">
        
        {/* Navigation Mode Tabs */}
        <div className="flex bg-surface p-1 rounded-md border border-border">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'camera' ? 'bg-primary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Live Camera
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'file' ? 'bg-primary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload Image
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'manual' ? 'bg-primary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Manual Ref
          </button>
        </div>

        {/* 📷 1. CAMERA SCANNER MODE */}
        {activeTab === 'camera' && !result && (
          <div className="space-y-3">
            <div className="relative bg-black rounded-card overflow-hidden border border-border flex flex-col items-center justify-center min-h-[260px]">
              
              {/* Target Container for Html5Qrcode Camera View */}
              <div id="qr-reader" className="w-full h-full max-w-[320px] rounded-card overflow-hidden" />

              {!isCameraActive && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-background/90 text-center space-y-3 z-10">
                  <Camera className="w-10 h-10 text-accent animate-bounce" />
                  <p className="text-xs text-text-primary font-semibold">Starting camera scanner...</p>
                  <p className="text-[11px] text-muted">Please grant camera permissions when prompted.</p>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-background/95 text-center space-y-3 z-10">
                  <CameraOff className="w-10 h-10 text-danger" />
                  <p className="text-xs text-danger font-semibold">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Camera Access
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted px-1">
              <span>Point camera at attendee's E-Ticket QR Code</span>
              {isCameraActive && (
                <button
                  onClick={stopCamera}
                  className="text-danger hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <CameraOff className="w-3 h-3" /> Stop Camera
                </button>
              )}
            </div>
          </div>
        )}

        {/* 📁 2. FILE UPLOAD QR SCANNER MODE */}
        {activeTab === 'file' && !result && (
          <div className="space-y-3">
            <div id="file-qr-reader-temp" className="hidden" />
            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border hover:border-accent rounded-card bg-surface/50 cursor-pointer transition-colors text-center">
              <Upload className="w-10 h-10 text-accent" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Click to upload QR Code image / screenshot</p>
                <p className="text-[11px] text-muted mt-1">Supports PNG, JPG, WEBP formats</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
        )}

        {/* ⌨️ 3. MANUAL REF MODE */}
        {activeTab === 'manual' && !result && (
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Booking Ref (e.g. SC65603289SHQ)..."
                className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-text-primary focus:border-accent focus:outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="btn-primary text-xs py-2.5 px-4 font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? 'Verifying...' : <><QrCode className="w-4 h-4" /> Verify</>}
            </button>
          </form>
        )}

        {/* 📋 SCAN / VERIFICATION RESULT CARD DISPLAY */}
        {result && (
          <div className="space-y-4 pt-2">
            
            {/* Status Banner */}
            {result.status === 'VALID' && (
              <div className="p-4 bg-success/15 border-2 border-success/40 rounded-card space-y-2 text-center">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
                <h3 className="font-display font-bold text-lg text-success uppercase tracking-wide">
                  Official Verified Gate Pass ✅
                </h3>
                <p className="text-xs text-text-primary font-medium">{result.message}</p>
              </div>
            )}

            {result.status === 'REJECTED' && (
              <div className="p-4 bg-danger/15 border-2 border-danger/40 rounded-card space-y-2 text-center">
                <XCircle className="w-10 h-10 text-danger mx-auto" />
                <h3 className="font-display font-bold text-lg text-danger uppercase tracking-wide">
                  Fraud / Rejected Ticket ❌
                </h3>
                <p className="text-xs text-text-primary font-medium">{result.message}</p>
              </div>
            )}

            {result.status === 'UNPAID' && (
              <div className="p-4 bg-gold/15 border-2 border-gold/40 rounded-card space-y-2 text-center">
                <AlertTriangle className="w-10 h-10 text-gold mx-auto" />
                <h3 className="font-display font-bold text-lg text-gold uppercase tracking-wide">
                  Payment Unverified ⚠️
                </h3>
                <p className="text-xs text-text-primary font-medium">{result.message}</p>
              </div>
            )}

            {result.status === 'INVALID' && (
              <div className="p-4 bg-danger/20 border-2 border-danger/50 rounded-card space-y-2 text-center">
                <XCircle className="w-10 h-10 text-danger mx-auto" />
                <h3 className="font-display font-bold text-lg text-danger uppercase tracking-wide">
                  Fake / Invalid QR Code 🚨
                </h3>
                <p className="text-xs text-text-primary font-semibold">{result.message}</p>
              </div>
            )}

            {/* Ticket & Booking Information Details */}
            {result.booking && (
              <div className="bg-card border border-border rounded-card p-5 space-y-4 shadow-card">
                
                <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
                  <div>
                    <span className="text-[10px] text-muted font-mono uppercase">Booking Reference</span>
                    <p className="font-mono font-bold text-accent text-sm">#{result.booking.booking_code}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted font-mono uppercase">Total Paid</span>
                    <p className="font-mono font-bold text-text-primary">{formatCurrency(result.booking.total_price)}</p>
                  </div>
                </div>

                {/* Customer & Event Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-muted uppercase flex items-center gap-1">
                      <User className="w-3 h-3 text-accent" /> Ticket Holder
                    </p>
                    <p className="font-semibold text-text-primary">{result.booking.user?.name}</p>
                    <p className="text-[11px] text-muted">{result.booking.user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-muted uppercase flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-accent" /> Concert Title
                    </p>
                    <p className="font-semibold text-text-primary">{result.booking.concert?.title}</p>
                    <p className="text-[11px] text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(result.booking.concert?.date)}
                    </p>
                  </div>
                </div>

                {/* Categories & Seats */}
                {result.booking.details && result.booking.details.length > 0 && (
                  <div className="pt-2 border-t border-border space-y-2">
                    <p className="text-[10px] font-mono uppercase text-muted font-semibold">Seat & Category Breakdown</p>
                    {result.booking.details.map((d) => (
                      <div key={d.id} className="p-2.5 bg-surface rounded-md border border-border text-xs flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-text-primary">{d.ticketCategory?.name}</p>
                          {d.seat && (
                            <p className="text-[11px] font-mono font-bold text-accent mt-0.5">
                              SEAT: {d.seat.label || `${d.seat.row}${d.seat.number}`}
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-accent">Qty: {d.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live QR Render for Visual Match */}
                {result.status === 'VALID' && (
                  <div className="pt-3 border-t border-border text-center space-y-2">
                    <p className="text-[10px] font-mono uppercase text-accent font-bold">System Generated Official QR Code</p>
                    <div className="p-3 bg-white inline-block rounded-md border border-border">
                      <QRCodeSVG
                        value={result.booking.details?.[0]?.qr_code_data || result.booking.booking_code}
                        size={120}
                        bgColor="#FFFFFF"
                        fgColor="#0D1117"
                      />
                    </div>
                  </div>
                )}

              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full btn-secondary text-xs py-2.5 px-4 justify-center font-bold flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Scan / Verify Another Pass
            </button>
          </div>
        )}

      </div>
    </Modal>
  );
}

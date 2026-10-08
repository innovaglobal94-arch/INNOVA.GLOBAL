import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Copy,
  Check,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Package, PaymentMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api, DEFAULT_PACKAGES } from '../../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: Package | null;
  onPaymentSubmitted: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  onPaymentSubmitted,
}) => {
  const { user, settings } = useAuth();

  const [chosenPkg, setChosenPkg] = useState<Package>(
    selectedPackage || DEFAULT_PACKAGES[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [senderMobile, setSenderMobile] = useState(user?.mobile || '');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedPackage) {
      setChosenPkg(selectedPackage);
    }
    if (isOpen) {
      setSuccess(false);
      setError(null);
      setTransactionId('');
    }
  }, [selectedPackage, isOpen]);

  if (!isOpen) return null;

  const targetNumber =
    paymentMethod === 'bKash' ? settings.bkash_number : settings.nagad_number;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(targetNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image screenshot (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login first to submit activation payment.');
      return;
    }

    if (!transactionId.trim()) {
      setError('Transaction ID is required.');
      return;
    }
    if (!senderMobile.trim()) {
      setError('Sender mobile number is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitPayment({
        memberId: user.id,
        packageId: chosenPkg.id,
        amount: chosenPkg.price,
        paymentMethod,
        transactionId: transactionId.trim(),
        senderMobile: senderMobile.trim(),
        screenshotUrl: screenshotPreview,
      });

      setSuccess(true);
      setTimeout(() => {
        onPaymentSubmitted();
        onClose();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace(/^\d+:\s*/, ''));
      } else {
        setError('Failed to submit payment. Please verify details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-[#252737] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 overflow-y-auto max-h-[90vh]">
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f7df8b] via-[#d4af37] to-[#8d6a13]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#f7df8b] via-[#d4af37] to-[#8d6a13] p-0.5 shadow-lg shadow-[#d4af37]/20 mb-3">
            <div className="w-full h-full bg-[#08080a] rounded-[14px] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <h3 className="text-2xl font-black font-heading text-white">Activation Payment</h3>
          <p className="text-xs text-slate-400 mt-1">
            Submit your package activation payment for verification by Root Admin
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Payment Submitted Successfully</h4>
            <div className="p-4 bg-[#141622] rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Status: PENDING ADMIN APPROVAL</span>
              </div>
              <p>
                Your transaction details have been registered in the database. Root Admin (000001) will
                review and approve the payment to activate your account and package.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Package Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selected Package Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DEFAULT_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setChosenPkg(pkg)}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      chosenPkg.id === pkg.id
                        ? 'bg-[#1e202e] border-[#d4af37] text-[#f7df8b]'
                        : 'bg-[#131520] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{pkg.name}</div>
                    <div className="text-sm font-black font-mono mt-0.5">৳{pkg.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bKash')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'bKash'
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                      : 'bg-[#131520] border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  bKash (Send Money)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                      : 'bg-[#131520] border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  Nagad (Send Money)
                </button>
              </div>
            </div>

            {/* Official Number Copy Box */}
            <div className="p-3.5 rounded-2xl bg-[#141622] border border-[#d4af37]/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Official {paymentMethod} Number
                </div>
                <div className="font-mono text-base font-bold text-white mt-0.5">
                  {targetNumber}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5 transition-all"
              >
                {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedNumber ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Sender Mobile & Transaction ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sender Mobile
                </label>
                <input
                  type="tel"
                  value={senderMobile}
                  onChange={(e) => setSenderMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 9J47K2L8"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono uppercase"
                  required
                />
              </div>
            </div>

            {/* Payment Screenshot */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Screenshot (Proof)
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-[#d4af37]/50 rounded-2xl p-4 text-center cursor-pointer bg-[#131520] relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {screenshotPreview ? (
                  <div className="space-y-2">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot Preview"
                      className="max-h-32 mx-auto rounded-lg border border-slate-600 object-contain"
                    />
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      Screenshot attached. Click to change.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <div className="text-xs text-slate-300 font-semibold">
                      Tap or drop payment screenshot
                    </div>
                    <div className="text-[10px] text-slate-500">JPG, PNG, WEBP allowed</div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Note: Submitting this form creates a PENDING payment record. Activation takes effect only
                after verified approval by Root Admin (000001).
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold gold-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Payment...</span>
                </>
              ) : (
                <>
                  <span>SUBMIT ACTIVATION (৳{chosenPkg.price})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

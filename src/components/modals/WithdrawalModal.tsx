import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/supabase';
import { PaymentMethod, Withdrawal } from '../../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose }) => {
  const { user, availableBalance, refreshProfile } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [paymentNumber, setPaymentNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      if (method === 'bKash' && user.bkash_number) {
        setPaymentNumber(user.bkash_number);
      } else if (method === 'Nagad' && user.nagad_number) {
        setPaymentNumber(user.nagad_number);
      } else {
        setPaymentNumber(user.mobile);
      }

      setLoadingHistory(true);
      api
        .getMemberWithdrawals(user.id)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [user, isOpen, method]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Insufficient available balance. You only have ৳${availableBalance.toFixed(2)}.`);
      return;
    }

    if (!paymentNumber.trim()) {
      setError('Please provide your recipient mobile number.');
      return;
    }

    setLoading(true);
    try {
      const w = await api.requestWithdrawal({
        memberId: user.id,
        amount: numAmount,
        paymentMethod: method,
        paymentNumber: paymentNumber.trim(),
      });
      setSuccess(`Withdrawal request of ৳${w.amount} placed successfully! Status: PENDING.`);
      setAmount('');
      await refreshProfile();
      const updatedHistory = await api.getMemberWithdrawals(user.id);
      setHistory(updatedHistory);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace(/^\d+:\s*/, ''));
      } else {
        setError('Withdrawal request failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-[#262838] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 overflow-y-auto max-h-[90vh]">
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
              <Wallet className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <h3 className="text-2xl font-black font-heading text-white">Withdraw Funds</h3>
          <p className="text-xs text-slate-400 mt-1">
            Request verified disbursements to your bKash or Nagad wallet
          </p>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-[#141622] border border-[#d4af37]/30 flex justify-between items-center mb-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Available Balance</div>
            <div className="text-2xl font-black text-[#f7df8b] font-mono mt-0.5">
              ৳{availableBalance.toFixed(2)}
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              user.status === 'ACTIVE'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {user.status}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Payout Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('bKash')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  method === 'bKash'
                    ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                    : 'bg-[#131520] border-slate-800 text-slate-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                bKash
              </button>
              <button
                type="button"
                onClick={() => setMethod('Nagad')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  method === 'Nagad'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                    : 'bg-[#131520] border-slate-800 text-slate-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Nagad
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {method} Recipient Number
            </label>
            <input
              type="tel"
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Withdrawal Amount (৳)
            </label>
            <input
              type="number"
              step="any"
              min="1"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono text-base font-bold"
              required
            />
          </div>

          <div className="p-3 bg-[#131520] border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              10-minute security cooldown between requests. Admin manually processes and marks PAID
              after sending transfer.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || availableBalance <= 0 || user.status !== 'ACTIVE'}
            className="w-full py-3.5 rounded-xl text-sm font-bold gold-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Request...</span>
              </>
            ) : (
              <>
                <span>REQUEST WITHDRAWAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Withdrawal History */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Recent Withdrawal Requests
          </h4>
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((w) => (
                <div
                  key={w.id}
                  className="p-3 bg-[#131520] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white font-mono">
                      ৳{w.amount} via {w.payment_method}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(w.created_at).toLocaleString()} • {w.payment_number}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      w.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : w.status === 'REJECTED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 bg-[#12141d] rounded-xl border border-slate-800">
              No previous withdrawal records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

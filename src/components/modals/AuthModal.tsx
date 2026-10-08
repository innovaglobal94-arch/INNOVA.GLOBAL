import React, { useState } from 'react';
import { X, Lock, Phone, User, Share2, AlertCircle, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
  onSuccess: (profile: Profile) => void;
  defaultReferralId?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onSuccess,
  defaultReferralId = '',
}) => {
  const { login, register, stats } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginQuery, setLoginQuery] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralId, setReferralId] = useState(defaultReferralId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isFirstEverAccount = stats.total_members === 0;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!loginQuery.trim() || !loginPassword.trim()) {
        throw new Error('Please enter your INNOVA ID or Mobile, and your Password.');
      }
      const profile = await login({
        innovaId: loginQuery.trim(),
        mobile: loginQuery.trim(),
        password: loginPassword,
      });
      onSuccess(profile);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace(/^\d+:\s*/, ''));
      } else {
        setError('Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!fullName.trim()) throw new Error('Full Name is required.');
      if (!mobile.trim() || mobile.trim().length < 10) {
        throw new Error('Please enter a valid mobile phone number.');
      }
      if (regPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      if (regPassword !== confirmPassword) {
        throw new Error('Passwords do not match. Please verify.');
      }

      if (!isFirstEverAccount && !referralId.trim()) {
        throw new Error('Referral ID is required for registration.');
      }

      const profile = await register({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        password: regPassword,
        referralId: referralId.trim() || undefined,
      });

      setSuccessMsg(
        `Account created successfully! Your unique INNOVA ID is: ${profile.innova_id}. Next step: Activation payment.`
      );
      setTimeout(() => {
        onSuccess(profile);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace(/^\d+:\s*/, ''));
      } else {
        setError('Registration failed. Please check details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0e1017] border border-[#262838] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f7df8b] via-[#d4af37] to-[#8d6a13]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#f7df8b] via-[#d4af37] to-[#8d6a13] p-0.5 shadow-lg shadow-[#d4af37]/20 mb-3">
            <div className="w-full h-full bg-[#08080a] rounded-[14px] flex items-center justify-center">
              <span className="font-serif font-black text-xl gold-gradient-text">IN</span>
            </div>
          </div>
          <h3 className="text-2xl font-black font-heading text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Real Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your INNOVA.GLOBAL dashboard'
              : isFirstEverAccount
              ? 'First registration becomes 000001 (Root Member & Root Admin)'
              : 'Join the smart digital network platform'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#141622] p-1 rounded-xl mb-6 border border-slate-800">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                INNOVA ID or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginQuery}
                  onChange={(e) => setLoginQuery(e.target.value)}
                  placeholder="e.g. 000001 or 01712345678"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                  required
                />
                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                  required
                />
                <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold gold-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>LOGIN TO ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full legal name"
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  required
                />
                <Phone className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Referral ID {isFirstEverAccount ? '(Optional for 000001)' : '(Required)'}
                </label>
                {isFirstEverAccount && (
                  <span className="text-[10px] text-[#f7df8b] font-medium">Root Account</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  placeholder={isFirstEverAccount ? 'Optional for first account' : 'e.g. 000001'}
                  className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] font-mono"
                  required={!isFirstEverAccount}
                />
                <Share2 className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold gold-btn flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>REGISTER & GET INNOVA ID</span>
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

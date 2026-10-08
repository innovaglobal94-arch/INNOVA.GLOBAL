import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Copy,
  Check,
  User,
  Phone,
  Calendar,
  Share2,
  Shield,
  Crown,
  AlertCircle,
  Loader2,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, isRootAdmin, updateAvatar, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Payment numbers form
  const [bkashNum, setBkashNum] = useState(user?.bkash_number || '');
  const [nagadNum, setNagadNum] = useState(user?.nagad_number || '');
  const [savingNumbers, setSavingNumbers] = useState(false);

  if (!isOpen || !user) return null;

  const referralLink = `${window.location.origin}/?ref=${user.innova_id}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.innova_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // In production, we upload the file and retrieve the public/secure URL
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          await updateAvatar(dataUrl);
          setSuccess('Profile photo updated successfully!');
        } catch (uploadErr: unknown) {
          if (uploadErr instanceof Error) {
            setError(uploadErr.message);
          } else {
            setError('Failed to save profile photo.');
          }
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error uploading photo.');
      }
      setUploading(false);
    }
  };

  const handleSavePaymentNumbers = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNumbers(true);
    setError(null);
    try {
      await api.updatePaymentNumbers(user.innova_id, {
        bkash_number: bkashNum.trim() || undefined,
        nagad_number: nagadNum.trim() || undefined,
      });
      await refreshProfile();
      setSuccess('Withdrawal payment numbers saved successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update payment numbers.');
      }
    } finally {
      setSavingNumbers(false);
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

        <h3 className="text-xl font-bold font-heading text-white mb-6">Member Profile</h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Avatar With Camera Button */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#181a26] border-2 border-[#d4af37] shadow-xl flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-black text-3xl gold-gradient-text">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Camera Icon Overlay */}
            <button
              type="button"
              onClick={handleCameraClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#d4af37] text-black hover:brightness-110 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Change Profile Photo"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-3 text-center">
            <h4 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
              {user.full_name}
              {isRootAdmin && <Crown className="w-4 h-4 text-[#d4af37]" />}
            </h4>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              INNOVA ID: <span className="text-[#f7df8b] font-bold">{user.innova_id}</span>
            </div>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                  user.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                Account: {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Member Details List */}
        <div className="space-y-3 mb-6 bg-[#131520] p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Mobile Number:
            </span>
            <span className="font-mono text-white">{user.mobile}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Joining Date:
            </span>
            <span className="text-slate-200">
              {new Date(user.joining_date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Upline Sponsor:
            </span>
            <span className="font-mono text-[#f7df8b] font-bold">
              {user.upline_id || 'ROOT (None)'}
            </span>
          </div>

          <div className="pt-1">
            <span className="text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Referral Link:
            </span>
            <div className="flex items-center gap-2 bg-[#0c0d14] p-2 rounded-xl border border-slate-700">
              <span className="font-mono text-[11px] text-slate-300 truncate flex-1">
                {referralLink}
              </span>
              <button
                type="button"
                onClick={handleCopyReferral}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#d4af37] text-black hover:brightness-110 flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Withdrawal Mobile Accounts Configuration */}
        <form onSubmit={handleSavePaymentNumbers} className="space-y-3 bg-[#131520] p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="font-bold text-white mb-1">Saved Withdrawal Numbers</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-pink-400 font-semibold mb-1">bKash Number</label>
              <input
                type="tel"
                value={bkashNum}
                onChange={(e) => setBkashNum(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-[#0c0d14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-orange-400 font-semibold mb-1">Nagad Number</label>
              <input
                type="tel"
                value={nagadNum}
                onChange={(e) => setNagadNum(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-[#0c0d14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingNumbers}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#1e202e] hover:bg-[#282b3d] text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            {savingNumbers ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#d4af37]" />
            )}
            <span>Save Numbers</span>
          </button>
        </form>
      </div>
    </div>
  );
};

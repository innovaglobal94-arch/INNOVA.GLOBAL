import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: 'privacy' | 'terms' | 'disclosure' | 'support';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, topic }) => {
  const { settings } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1017] border border-[#262838] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 overflow-y-auto max-h-[85vh]">
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f7df8b] via-[#d4af37] to-[#8d6a13]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {topic === 'terms' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-[#d4af37]" />
              <h3 className="text-xl font-bold font-heading text-white">Terms & Conditions</h3>
            </div>
            <p>
              Welcome to <strong>INNOVA.GLOBAL</strong>. By creating an account or accessing platform features,
              you agree to adhere to all terms, policies, and operating regulations set forth herein.
            </p>
            <h4 className="font-bold text-white text-sm pt-2">1. Account Eligibility & Responsibilities</h4>
            <p>
              Each user must register with truthful personal information. Multiple duplicate accounts created
              to manipulate referral bonuses or fabricate task earnings will lead to account termination.
            </p>
            <h4 className="font-bold text-white text-sm pt-2">2. Package Activations</h4>
            <p>
              Package activations are subject to Root Admin verification of genuine bKash or Nagad payment proofs.
              Each purchase carries a defined duration (15 days) and daily task eligibility quota.
            </p>
            <h4 className="font-bold text-white text-sm pt-2">3. Prohibited Practices</h4>
            <p>
              Automated scripts, bots, click-farming, and unauthorized API tampering are strictly prohibited.
              All tasks must be completed through manual, authentic member actions.
            </p>
          </div>
        )}

        {topic === 'privacy' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold font-heading text-white">Privacy Policy</h3>
            </div>
            <p>
              INNOVA.GLOBAL prioritizes user security and data privacy. We ensure all personal records are
              protected using Row Level Security (RLS) in PostgreSQL.
            </p>
            <h4 className="font-bold text-white text-sm pt-2">Information We Collect</h4>
            <p>
              We collect your full name, mobile number, and payment transaction IDs solely for account authorization,
              task verification, and disbursement requests. We never sell, lease, or share member information.
            </p>
            <h4 className="font-bold text-white text-sm pt-2">Payment Screenshots & Receipts</h4>
            <p>
              Screenshots submitted for payment verification are stored privately in encrypted storage and accessible
              solely by Root Admin (000001) during audit workflows.
            </p>
          </div>
        )}

        {topic === 'disclosure' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold font-heading text-white">Reward / Earning Disclosure</h3>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <p className="font-bold mb-1">Zero Guaranteed Income Policy</p>
              <p>
                INNOVA.GLOBAL is NOT an investment platform, deposit scheme, or high-yield investment program (HYIP).
                No member is promised or guaranteed fixed profits, passive returns, or returns on capital.
              </p>
            </div>
            <h4 className="font-bold text-white text-sm pt-2">Basis of Rewards</h4>
            <p>
              All rewards are strictly contingent on active participation, completed platform evaluations (~20s tasks),
              verified referral activations, and valid network development.
            </p>
            <h4 className="font-bold text-white text-sm pt-2">Withdrawals & Processing</h4>
            <p>
              Withdrawals require manual verification to protect against fraudulent claims. Funds are disbursed
              directly to member bKash or Nagad accounts following standard administrative auditing.
            </p>
          </div>
        )}

        {topic === 'support' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-6 h-6 text-[#d4af37]" />
              <h3 className="text-xl font-bold font-heading text-white">Support & Assistance</h3>
            </div>
            <p>
              Our administration desk is prepared to assist with any onboarding, verification, or task questions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Voice Helpline</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">{settings.support_number}</div>
              </div>
              <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Executive Telegram</div>
                <a
                  href={settings.support_telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#229ED9] hover:underline mt-0.5 block"
                >
                  @PARVEZ_OWNER_7X
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

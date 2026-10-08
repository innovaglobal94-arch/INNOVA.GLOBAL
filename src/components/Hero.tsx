import React from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  Globe2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onExplorePackages: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuth, onExplorePackages }) => {
  const { user, stats } = useAuth();

  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#d4af37]/15 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-12 left-1/4 w-72 h-72 bg-[#f7df8b]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Sacred Opening Inscription */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#161722] border border-[#d4af37]/30 shadow-inner">
            <span className="font-serif text-sm tracking-wider text-[#f7df8b]">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
              (Bismillahir Rahmanir Rahim)
            </span>
          </div>

          {/* Title and Tagline */}
          <div className="space-y-3">
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white">
              INNOVA<span className="gold-gradient-text">.GLOBAL</span>
            </h1>

            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#d4af37] bg-[#1a1b24]/60 px-4 py-1 rounded-full border border-[#d4af37]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#f7df8b]" />
              <span>CONNECT • LEARN • GROW</span>
              <Sparkles className="w-3.5 h-3.5 text-[#f7df8b]" />
            </div>

            <p className="text-xl sm:text-2xl font-light text-slate-300 max-w-2xl mx-auto">
              Smart Digital Network Platform
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A next-generation digital ecosystem unifying community collaboration, eligible micro-tasks,
            peer empowerment, and structured verified network performance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!user ? (
              <>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto gold-btn px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-200 bg-[#14151e] hover:bg-[#1d1f2b] border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                >
                  LOGIN
                </button>
              </>
            ) : (
              <button
                onClick={onExplorePackages}
                className="w-full sm:w-auto gold-btn px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>EXPLORE PACKAGES</span>
                <Zap className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Verification Badge */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Database-Verified Records • Real Idempotent Transactions • Zero Fake Claims</span>
          </div>
        </div>

        {/* LIVE PUBLIC STATISTICS BAR (ZERO INITIAL DATA COMPLIANT) */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-[#0f1017] border border-[#232533] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1b1c28]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#d4af37]" />
                  Live Platform Statistics
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time database queries. Initial state starts strictly from clean zero records.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Network Feed
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Stat 1: Total Members */}
              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-[#d4af37]" />
                  <span>Total Members</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
                  {stats.total_members.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Verified registrations</div>
              </div>

              {/* Stat 2: Active Members */}
              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Active Members</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
                  {stats.active_members.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Approved & active packages</div>
              </div>

              {/* Stat 3: Total Joining */}
              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Total Joining</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
                  {stats.total_joining.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Lifetime platform participants</div>
              </div>

              {/* Stat 4: Total Verified Earnings */}
              <div className="p-4 rounded-xl bg-[#141520] border border-[#d4af37]/30 bg-gradient-to-br from-[#141520] to-[#1c1912]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f7df8b] uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#d4af37]" />
                  <span>Verified Earnings</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#f7df8b] mt-2 font-mono">
                  ৳{stats.total_verified_earnings.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Audited ledger disbursements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

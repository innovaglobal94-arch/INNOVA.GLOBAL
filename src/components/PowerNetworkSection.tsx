import React, { useState, useEffect } from 'react';
import {
  Share2,
  Users,
  Copy,
  Check,
  Award,
  Shield,
  Layers,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/supabase';
import { Profile } from '../types';

interface PowerNetworkSectionProps {
  onOpenAuth?: (mode: 'register') => void;
}

export const PowerNetworkSection: React.FC<PowerNetworkSectionProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [networkInfo, setNetworkInfo] = useState<{
    uplineId: string | null;
    directPartners: Profile[];
    totalTeamCount: number;
    generations: { gen1: number; gen2: number; gen3: number };
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .getNetworkInfo(user.innova_id)
        .then((info) => setNetworkInfo(info))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const referralLink = user
    ? `${window.location.origin}/?ref=${user.innova_id}`
    : `${window.location.origin}/?ref=000001`;

  const copyReferral = () => {
    navigator.clipboard.writeText(user?.innova_id || '000001');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="network" className="py-20 bg-[#07080c] border-t border-[#181a25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161722] border border-[#d4af37]/30 text-xs font-bold text-[#f7df8b] uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5" />
            <span>Power Network Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            Transparent Multi-Tier Synergy
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Empower your associates with mutual growth. Direct sponsors receive configured ৳30 referral rewards
            upon verified account activation, with support across 3 tiers.
          </p>
        </div>

        {user ? (
          /* AUTHORIZED LOGGED-IN NETWORK PANEL */
          <div className="bg-[#0e1017] border border-[#232533] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                  Authorized Network Dashboard
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <Users className="w-5 h-5 text-[#d4af37]" />
                  Your Power Network Overview
                </h3>
              </div>

              {/* Referral ID Quick Share */}
              <div className="flex items-center gap-2 bg-[#151722] p-2 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-300 pl-2">
                  My Referral ID: <strong className="text-[#f7df8b] font-mono">{user.innova_id}</strong>
                </div>
                <button
                  onClick={copyReferral}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#d4af37] text-black hover:brightness-110 flex items-center gap-1 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy ID
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Direct Partners</div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                  {networkInfo?.directPartners.length || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Tier 1 directly sponsored</div>
              </div>

              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Team Size</div>
                <div className="text-2xl sm:text-3xl font-black text-[#f7df8b] font-mono mt-1">
                  {networkInfo?.totalTeamCount || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Across 3 generations</div>
              </div>

              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Upline Sponsor ID</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-200 font-mono mt-1 flex items-center gap-1">
                  {networkInfo?.uplineId || (
                    <span className="text-xs text-slate-400 font-normal">ROOT MEMBER</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Verified sponsor</div>
              </div>

              <div className="p-4 rounded-xl bg-[#141520] border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Referral Reward Rate</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
                  ৳30
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Per active activation</div>
              </div>
            </div>

            {/* 3 Generations Breakdown */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#d4af37]" />
                Generation Distribution
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#11131c] border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">Generation 1 (Direct)</span>
                    <span className="font-mono font-bold text-[#f7df8b]">
                      {networkInfo?.generations.gen1 || 0} Members
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[#d4af37] h-full"
                      style={{
                        width: `${Math.min(100, ((networkInfo?.generations.gen1 || 0) / 10) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#11131c] border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">Generation 2</span>
                    <span className="font-mono font-bold text-slate-300">
                      {networkInfo?.generations.gen2 || 0} Members
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full"
                      style={{
                        width: `${Math.min(100, ((networkInfo?.generations.gen2 || 0) / 10) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#11131c] border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">Generation 3</span>
                    <span className="font-mono font-bold text-slate-300">
                      {networkInfo?.generations.gen3 || 0} Members
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full"
                      style={{
                        width: `${Math.min(100, ((networkInfo?.generations.gen3 || 0) / 10) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Partners List (Safe Authorized Info Only) */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-white mb-3">Direct Associates List</h4>
              {networkInfo && networkInfo.directPartners.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">INNOVA ID</th>
                        <th className="py-2.5 px-3">Member Name</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Joining Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {networkInfo.directPartners.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#f7df8b]">{p.innova_id}</td>
                          <td className="py-2.5 px-3 text-slate-200">{p.full_name}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === 'ACTIVE'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(p.joining_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-[#12141c] rounded-xl border border-slate-800">
                  No direct associates registered yet. Share your Referral ID ({user.innova_id}) to expand your
                  network!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PUBLIC EXPLANATION FOR VISITORS */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#181a26] border border-[#d4af37]/30 flex items-center justify-center font-bold text-[#f7df8b]">
                01
              </div>
              <h3 className="text-base font-bold text-white">Direct Sponsoring (Gen 1)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Invite colleagues and team partners with your unique six-digit INNOVA ID. Receive ৳30 verified reward
                immediately upon their package activation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#181a26] border border-slate-700 flex items-center justify-center font-bold text-white">
                02
              </div>
              <h3 className="text-base font-bold text-white">Team Expansion (Gen 2 & 3)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As your associates guide their own partners, track team depth through transparent generational metrics
                with zero hidden fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#181a26] border border-slate-700 flex items-center justify-center font-bold text-white">
                03
              </div>
              <h3 className="text-base font-bold text-white">Security & Audit Proof</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All network interactions strictly adhere to server-side Row Level Security. Member contact details and
                sensitive records remain private and shielded.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

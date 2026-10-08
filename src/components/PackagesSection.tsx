import React, { useEffect, useState } from 'react';
import {
  Check,
  Zap,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Package } from '../types';
import { api, DEFAULT_PACKAGES } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface PackagesSectionProps {
  onSelectPackage: (pkg: Package) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onSelectPackage,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getPackages()
      .then((data) => {
        if (data && data.length > 0) setPackages(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="packages" className="py-20 bg-[#09090e] border-t border-[#1a1c27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161722] border border-[#d4af37]/30 text-xs font-bold text-[#f7df8b] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Database-Driven Packages</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            Select Your Network Tier
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Transparent packages with configured task limits, defined validities, and verified daily reward
            parameters. Multiple package activations supported.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => {
            const isFeatured = pkg.id === 'plus' || idx === 1;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-[#10121a] border-2 border-[#d4af37] shadow-xl shadow-[#d4af37]/15 md:-translate-y-2'
                    : 'bg-[#0d0e15] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f7df8b] to-[#d4af37] text-black text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Header & Price */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-black text-white">{pkg.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Package Tier</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#171924] border border-slate-800 flex items-center justify-center text-[#d4af37]">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="py-4 border-y border-slate-800/80 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        ৳{pkg.price}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        / {pkg.duration_days} days
                      </span>
                    </div>
                    <div className="text-xs text-[#d4af37] font-semibold mt-1">
                      Configured Daily Reward: ৳{pkg.daily_reward}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#141620]">
                      <span className="text-slate-400">Daily Tasks:</span>
                      <span className="font-bold text-white">{pkg.tasks_per_day} Tasks / Day</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#141620]">
                      <span className="text-slate-400">Task Duration:</span>
                      <span className="font-bold text-white">~{pkg.task_duration_seconds} Seconds each</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#141620]">
                      <span className="text-slate-400">Validity Period:</span>
                      <span className="font-bold text-white">{pkg.duration_days} Days</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 mb-8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Included Capabilities
                    </div>
                    {pkg.features &&
                      pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="pt-4 border-t border-slate-800/60">
                  {user ? (
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isFeatured
                          ? 'gold-btn'
                          : 'bg-[#1b1d28] hover:bg-[#252737] text-white border border-slate-700'
                      }`}
                    >
                      <span>ACTIVATE / PURCHASE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenAuth('register')}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isFeatured
                          ? 'gold-btn'
                          : 'bg-[#1b1d28] hover:bg-[#252737] text-white border border-slate-700'
                      }`}
                    >
                      <span>CREATE ACCOUNT TO BUY</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on multiple packages */}
        <div className="mt-12 text-center text-xs text-slate-400 max-w-xl mx-auto">
          Members can purchase multiple packages simultaneously. Each package is tracked as an independent,
          isolated subscription with its own historical activation snapshot and expiry timeline.
        </div>
      </div>
    </section>
  );
};

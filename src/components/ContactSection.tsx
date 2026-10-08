import React from 'react';
import { Phone, Send, Youtube, ExternalLink, ShieldCheck, MessageCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ContactSection: React.FC = () => {
  const { settings } = useAuth();

  return (
    <section id="contact" className="py-20 bg-[#090a0f] border-t border-[#181a26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161722] border border-[#d4af37]/30 text-xs font-bold text-[#f7df8b] uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Official Communications</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            Connect With Administration
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Reach out via verified channels for technical onboarding, transaction inquiries, or community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Support Phone & Helpline */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Voice & Helpline Support</h3>
              <p className="text-xs text-slate-400 mt-1">Available for urgent verification and payment checks.</p>
            </div>
            <div className="p-3 bg-[#13151f] rounded-xl border border-slate-700/80">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Helpline Number</div>
              <div className="font-mono text-base font-bold text-white mt-0.5">{settings.support_number}</div>
            </div>
          </div>

          {/* Official Payment Accounts */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-slate-700 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Official Merchant Numbers</h3>
              <p className="text-xs text-slate-400 mt-1">Only send package activation fees to these numbers.</p>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-[#13151f] rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-pink-400">bKash</span>
                <span className="font-mono text-xs font-bold text-white">{settings.bkash_number}</span>
              </div>
              <div className="p-2.5 bg-[#13151f] rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-orange-400">Nagad</span>
                <span className="font-mono text-xs font-bold text-white">{settings.nagad_number}</span>
              </div>
            </div>
          </div>

          {/* Telegram Support Desk */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Executive Desk Telegram</h3>
              <p className="text-xs text-slate-400 mt-1">Direct contact with platform administration desk.</p>
            </div>
            <a
              href={settings.support_telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-xs font-bold text-[#229ED9] transition-all"
            >
              <span>@PARVEZ_OWNER_7X</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Telegram Community Group */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Telegram Community</h3>
              <p className="text-xs text-slate-400 mt-1">Collaborate with active network associates.</p>
            </div>
            <a
              href={settings.telegram_group}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#14151e] hover:bg-[#1c1e2b] border border-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              <span>Join Telegram Group</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </a>
          </div>

          {/* Telegram Channel */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Announcements Channel</h3>
              <p className="text-xs text-slate-400 mt-1">Official system broadcasts and feature notices.</p>
            </div>
            <a
              href={settings.telegram_channel}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#14151e] hover:bg-[#1c1e2b] border border-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              <span>Open Official Channel</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </a>
          </div>

          {/* YouTube Channel */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-red-500/30 flex items-center justify-center text-red-500">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PowerNetwork7X YouTube</h3>
              <p className="text-xs text-slate-400 mt-1">Platform guides, walk-through tutorials and news.</p>
            </div>
            <a
              href={settings.youtube_channel}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 transition-all"
            >
              <span>Watch YouTube Videos</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

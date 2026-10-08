import React from 'react';
import { Send, Youtube, Phone, ShieldCheck, HelpCircle, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onOpenLegal: (topic: 'privacy' | 'terms' | 'disclosure' | 'support') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const { settings } = useAuth();

  return (
    <footer className="bg-[#050507] border-t border-[#1b1d26] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f7df8b] via-[#d4af37] to-[#8d6a13] p-0.5">
                <div className="w-full h-full bg-[#08080a] rounded-[10px] flex items-center justify-center">
                  <span className="font-serif font-black text-lg gold-gradient-text">IN</span>
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg text-white">
                  INNOVA<span className="text-[#d4af37]">.GLOBAL</span>
                </div>
                <div className="text-[10px] font-semibold tracking-wider text-[#94a3b8] uppercase">
                  CONNECT • LEARN • GROW
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Digital Network Platform designed for modern community participation, verified task engagement,
              and peer-to-peer digital learning.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.telegram_channel}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#14151e] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_channel}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#14151e] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-500/40 transition-colors"
                title="Official YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.support_telegram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#14151e] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#f7df8b] hover:border-[#f7df8b]/40 transition-colors"
                title="Support Telegram"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Official Channels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Official Channels</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={settings.telegram_group}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-[#f7df8b] transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Telegram Community Group</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.telegram_channel}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-[#f7df8b] transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Official Announcements Channel</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.youtube_channel}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>PowerNetwork7X YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.support_telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-[#f7df8b] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Executive Support Desk</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Support & Payment Numbers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Help & Payments</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#0e1017] rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Official Helpline</div>
                <div className="font-mono text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  {settings.support_number}
                </div>
              </div>
              <div className="p-2.5 bg-[#0e1017] rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-slate-400">bKash Merchant/Personal</div>
                  <div className="font-mono text-xs font-semibold text-slate-200">{settings.bkash_number}</div>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded">
                  bKash
                </span>
              </div>
              <div className="p-2.5 bg-[#0e1017] rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-slate-400">Nagad Merchant/Personal</div>
                  <div className="font-mono text-xs font-semibold text-slate-200">{settings.nagad_number}</div>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
                  Nagad
                </span>
              </div>
            </div>
          </div>

          {/* Policies & Disclosures */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal & Trust</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="flex items-center gap-2 hover:text-[#f7df8b] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="flex items-center gap-2 hover:text-[#f7df8b] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('disclosure')}
                  className="flex items-center gap-2 hover:text-[#f7df8b] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-slate-300">Reward / Earning Disclosure</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('support')}
                  className="flex items-center gap-2 hover:text-[#f7df8b] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Support Center</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#0b0c12] border border-[#1e202d] text-[11px] text-slate-400 leading-relaxed mb-8">
          <strong className="text-slate-200 font-semibold">Important Platform Disclosure: </strong>
          INNOVA.GLOBAL does not offer or promise guaranteed income, passive returns, or investment schemes.
          Platform rewards and peer-to-peer activity incentives depend strictly on active verified task completion,
          legitimate network participation, adherence to platform guidelines, and administration verification.
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-6 border-t border-[#181a24]">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">INNOVA.GLOBAL</strong>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Version 2.0 Production</span>
            <span>•</span>
            <span>Postgres DB Backend</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

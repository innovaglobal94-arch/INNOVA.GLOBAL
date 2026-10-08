import React, { useState } from 'react';
import {
  Shield,
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Sparkles,
  Crown,
  Wallet,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenWithdrawal: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenProfile,
  onOpenNotifications,
  onOpenWithdrawal,
  activeView,
  setActiveView,
}) => {
  const { user, isRootAdmin, logout, unreadNotificationsCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Power Network', view: 'network' },
    { label: 'Packages', view: 'packages' },
    { label: 'How It Works', view: 'how-it-works' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090c]/90 backdrop-blur-md border-b border-[#22242e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f7df8b] via-[#d4af37] to-[#8d6a13] p-0.5 shadow-lg shadow-[#d4af37]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#08080a] rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-xl gold-gradient-text">IN</span>
              </div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl tracking-wider text-white flex items-center gap-1.5">
                INNOVA<span className="text-[#d4af37]">.GLOBAL</span>
              </div>
              <div className="text-[10px] font-semibold tracking-widest text-[#94a3b8] uppercase">
                CONNECT • LEARN • GROW
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === link.view
                    ? 'text-[#f7df8b] bg-[#1a1b24]'
                    : 'text-slate-300 hover:text-white hover:bg-[#14151c]'
                }`}
              >
                {link.label}
              </button>
            ))}

            {user && (
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'dashboard'
                    ? 'text-[#f7df8b] bg-[#1a1b24]'
                    : 'text-slate-200 hover:text-white hover:bg-[#14151c]'
                }`}
              >
                Dashboard
              </button>
            )}

            {isRootAdmin && (
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeView === 'admin'
                    ? 'text-[#09090c] bg-gradient-to-r from-[#f7df8b] to-[#d4af37]'
                    : 'text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/10'
                }`}
              >
                <Crown className="w-4 h-4 text-[#d4af37] group-hover:rotate-12" />
                Root Admin
              </button>
            )}
          </nav>

          {/* Auth / Profile Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#181922] transition-colors border border-transparent hover:border-slate-800"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#d4af37]/20 flex items-center gap-1.5"
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2.5 rounded-xl bg-[#14151c] text-slate-300 hover:text-white hover:bg-[#1c1d27] border border-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Withdraw shortcut */}
                <button
                  onClick={onOpenWithdrawal}
                  className="p-2.5 rounded-xl bg-[#14151c] text-slate-300 hover:text-[#d4af37] hover:bg-[#1c1d27] border border-slate-800 transition-colors"
                  title="Withdraw Funds"
                >
                  <Wallet className="w-4 h-4" />
                </button>

                {/* Member ID pill & profile click */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-[#14151c] hover:bg-[#1c1d27] border border-[#2b2d3a] rounded-xl transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-[#d4af37]">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-none flex items-center gap-1">
                      {user.innova_id}
                      {isRootAdmin && <Crown className="w-3 h-3 text-[#d4af37]" />}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-1">
                      {user.status === 'ACTIVE' ? (
                        <span className="text-emerald-400 font-semibold">Active</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Pending</span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-[#14151c] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg bg-[#14151c] text-slate-300"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] text-black font-extrabold text-[9px] rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#14151c] text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0e14] border-b border-[#232532] px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="p-3 bg-[#151620] rounded-xl border border-slate-800 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-[#d4af37] flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-[#d4af37]">{user.full_name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {user.full_name}
                    {isRootAdmin && <Crown className="w-3.5 h-3.5 text-[#d4af37]" />}
                  </div>
                  <div className="text-xs text-slate-400">
                    ID: <span className="text-[#f7df8b] font-mono">{user.innova_id}</span> •{' '}
                    <span className={user.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1.5 text-xs bg-[#202230] text-slate-200 rounded-lg"
              >
                Profile
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  setActiveView(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-lg text-sm text-left font-medium ${
                  activeView === link.view ? 'bg-[#1e202e] text-[#f7df8b]' : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}

            {user && (
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-lg text-sm text-left font-semibold ${
                  activeView === 'dashboard' ? 'bg-[#1e202e] text-[#f7df8b]' : 'text-slate-200'
                }`}
              >
                Dashboard
              </button>
            )}

            {isRootAdmin && (
              <button
                onClick={() => {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 px-3 py-2.5 rounded-lg text-sm font-bold text-left bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7df8b] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#d4af37]" />
                  Root Admin Panel
                </span>
                <span className="text-[10px] bg-[#d4af37] text-black px-1.5 py-0.5 rounded font-black">
                  000001
                </span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800">
            {!user ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-[#1a1b24] text-white border border-slate-700"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-center text-sm font-bold gold-btn"
                >
                  CREATE ACCOUNT
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenWithdrawal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-[#1b1c28] text-sm text-slate-200 font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4 text-[#d4af37]" />
                  Withdraw
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 bg-rose-500/10 text-rose-400 text-sm font-semibold rounded-xl border border-rose-500/20"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldAlert,
  Users,
  CreditCard,
  Package as PackageIcon,
  Layers,
  Wallet,
  Settings,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  ExternalLink,
  Save,
  Send,
  Database,
  Copy,
  Check,
  RefreshCw,
  PlayCircle,
  TrendingUp,
  Share2,
  Clock,
  LayoutDashboard,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, getSavedAnonKey, saveAnonKey, SUPABASE_URL, DEFAULT_PACKAGES } from '../lib/supabase';
import {
  Payment,
  Profile,
  Withdrawal,
  AdminLog,
  SiteSettings,
  Package,
  Task,
  EarningLedger,
  Referral,
  Notification,
} from '../types';
import { SUPABASE_SQL_MIGRATION } from '../lib/sqlMigration';

export const AdminPanel: React.FC = () => {
  const { user, isRootAdmin } = useAuth();

  // Strict 403 enforcement
  if (!user || user.innova_id !== '000001' || !isRootAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0f1018] border border-rose-500/30 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-heading text-white">403: Access Denied</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Administrative permissions are restricted solely to Root Admin (INNOVA ID: 000001).
            Your account ({user?.innova_id || 'unauthenticated'}) does not have administrative privileges.
          </p>
        </div>
      </div>
    );
  }

  return <AdminPanelContent adminUser={user} />;
};

type AdminTab =
  | 'dashboard'
  | 'members'
  | 'payments'
  | 'packages'
  | 'tasks'
  | 'earnings'
  | 'referrals'
  | 'withdrawals'
  | 'notifications'
  | 'announcements'
  | 'settings'
  | 'logs'
  | 'database';

const AdminPanelContent: React.FC<{ adminUser: Profile }> = ({ adminUser }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Stats
  const [stats, setStats] = useState<{
    totalMembers: number;
    activeMembers: number;
    pendingPayments: number;
    pendingPackageActivations: number;
    pendingApprovals: number;
    pendingWithdrawals: number;
    totalVerifiedEarnings: number;
  } | null>(null);

  // Data lists
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [earnings, setEarnings] = useState<EarningLedger[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Rejection modal
  const [rejectModalPayment, setRejectModalPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Payment verification mismatch / invalid TrxID.');

  // Announcements form
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  // Settings form
  const [supportNum, setSupportNum] = useState('');
  const [bkashNum, setBkashNum] = useState('');
  const [nagadNum, setNagadNum] = useState('');
  const [telegramGroup, setTelegramGroup] = useState('');
  const [telegramChannel, setTelegramChannel] = useState('');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [supportTelegram, setSupportTelegram] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Supabase Anon Key config & SQL migration
  const [anonKeyInput, setAnonKeyInput] = useState(getSavedAnonKey());
  const [copiedSql, setCopiedSql] = useState(false);

  // Filters & Search
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, p, m, w, l, setts, pkgs, t, earn, refs, notifs] = await Promise.all([
        api.getAdminStats(adminUser.innova_id),
        api.getAdminPayments(adminUser.innova_id),
        api.getAdminMembers(adminUser.innova_id),
        api.getAdminWithdrawals(adminUser.innova_id),
        api.getAdminLogs(adminUser.innova_id),
        api.getSiteSettings(),
        api.getAllPackagesAdmin(),
        api.getAdminTasks(adminUser.innova_id),
        api.getAdminAllEarnings(adminUser.innova_id),
        api.getAdminAllReferrals(adminUser.innova_id),
        api.getAdminAllNotifications(adminUser.innova_id),
      ]);
      setStats(s);
      setPayments(p);
      setMembers(m);
      setWithdrawals(w);
      setLogs(l);
      setSettings(setts);
      setPackages(pkgs);
      setTasks(t);
      setEarnings(earn);
      setReferrals(refs);
      setAllNotifications(notifs);

      setSupportNum(setts.support_number);
      setBkashNum(setts.bkash_number);
      setNagadNum(setts.nagad_number);
      setTelegramGroup(setts.telegram_group);
      setTelegramChannel(setts.telegram_channel);
      setYoutubeChannel(setts.youtube_channel);
      setSupportTelegram(setts.support_telegram);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotificationMsg({ type: 'error', text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [adminUser]);

  // CRITICAL PAYMENT APPROVAL
  const handleApprovePayment = async (paymentId: string) => {
    setActionLoadingId(paymentId);
    setNotificationMsg(null);
    try {
      const result = await api.approvePayment(paymentId, adminUser.innova_id);
      setNotificationMsg({ type: 'success', text: result.message });
      await loadAll();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotificationMsg({ type: 'error', text: err.message });
      } else {
        setNotificationMsg({ type: 'error', text: 'Approval failed.' });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // REJECT PAYMENT
  const handleConfirmReject = async () => {
    if (!rejectModalPayment) return;
    setActionLoadingId(rejectModalPayment.id);
    setNotificationMsg(null);
    try {
      await api.rejectPayment(rejectModalPayment.id, adminUser.innova_id, rejectionReason);
      setNotificationMsg({ type: 'success', text: 'Payment marked REJECTED and member notified.' });
      setRejectModalPayment(null);
      await loadAll();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotificationMsg({ type: 'error', text: err.message });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // WITHDRAWAL STATUS UPDATE
  const handleProcessWithdrawal = async (wId: string, status: 'PAID' | 'REJECTED') => {
    setActionLoadingId(wId);
    setNotificationMsg(null);
    try {
      await api.processWithdrawal(wId, adminUser.innova_id, status);
      setNotificationMsg({ type: 'success', text: `Withdrawal marked ${status} successfully.` });
      await loadAll();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotificationMsg({ type: 'error', text: err.message });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // BROADCAST ANNOUNCEMENT
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;
    setSendingAnnouncement(true);
    setNotificationMsg(null);
    try {
      await api.sendAnnouncement({
        adminInnovaId: adminUser.innova_id,
        title: announcementTitle.trim(),
        message: announcementMsg.trim(),
        targetMemberId: 'ALL',
      });
      setNotificationMsg({ type: 'success', text: 'Announcement broadcasted to all members!' });
      setAnnouncementTitle('');
      setAnnouncementMsg('');
      await loadAll();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotificationMsg({ type: 'error', text: err.message });
      }
    } finally {
      setSendingAnnouncement(false);
    }
  };

  // SAVE GLOBAL SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setNotificationMsg(null);
    try {
      await api.updateSiteSettings(
        {
          website_name: 'INNOVA.GLOBAL',
          tagline: 'CONNECT • LEARN • GROW',
          description: 'Smart Digital Network Platform',
          support_number: supportNum.trim(),
          bkash_number: bkashNum.trim(),
          nagad_number: nagadNum.trim(),
          telegram_group: telegramGroup.trim(),
          telegram_channel: telegramChannel.trim(),
          youtube_channel: youtubeChannel.trim(),
          support_telegram: supportTelegram.trim(),
        },
        adminUser.innova_id
      );
      setNotificationMsg({ type: 'success', text: 'Global platform settings updated successfully.' });
      await loadAll();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotificationMsg({ type: 'error', text: err.message });
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveAnonKey = () => {
    saveAnonKey(anonKeyInput);
    setNotificationMsg({
      type: 'success',
      text: 'Supabase Project Key updated and saved to client configuration.',
    });
  };

  const copySqlMigration = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Filtered lists
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.innova_id.includes(memberSearch.trim()) ||
      m.full_name.toLowerCase().includes(memberSearch.toLowerCase().trim()) ||
      m.mobile.includes(memberSearch.trim());
    const matchesStatus =
      memberStatusFilter === 'ALL' ? true : m.status === memberStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter((p) => {
    if (paymentStatusFilter === 'ALL') return true;
    return p.status === paymentStatusFilter;
  });

  const pendingPaymentsCount = payments.filter((p) => p.status === 'PENDING').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#08080c] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Root Admin Top Header */}
      <div className="bg-[#0f1017] border-2 border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#f7df8b] via-[#d4af37] to-[#8d6a13]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f7df8b] via-[#d4af37] to-[#8d6a13] p-0.5 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black font-heading text-white">Root Administration Panel</h1>
                <span className="text-[10px] font-black bg-[#d4af37] text-black px-2 py-0.5 rounded-full">
                  000001
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrated administrative portal for Root Admin 000001
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAll}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#181a26] hover:bg-[#202235] text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
              <span>Refresh DB Data</span>
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {notificationMsg && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs flex items-center justify-between border ${
              notificationMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {notificationMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{notificationMsg.text}</span>
            </div>
            <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* REAL DATABASE STATS STRIP */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Members</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">{stats.totalMembers}</div>
            </div>
            <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Members</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{stats.activeMembers}</div>
            </div>
            <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
              <div className="text-[10px] text-amber-400 uppercase font-bold">Pending Payments</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{stats.pendingPayments}</div>
            </div>
            <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
              <div className="text-[10px] text-amber-400 uppercase font-bold">Pending Activations</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{stats.pendingPackageActivations}</div>
            </div>
            <div className="p-3 bg-[#131520] rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Withdrawals</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">{stats.pendingWithdrawals}</div>
            </div>
            <div className="p-3 bg-[#131520] rounded-xl border border-[#d4af37]/30">
              <div className="text-[10px] text-[#f7df8b] uppercase font-bold">Verified Earnings</div>
              <div className="text-xl font-black text-[#f7df8b] font-mono mt-0.5">
                ৳{stats.totalVerifiedEarnings.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 12 FULL NAVIGATION TABS (Strictly matching specifications) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payments ({pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Pending` : payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <PackageIcon className="w-3.5 h-3.5" />
          <span>Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Tasks ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'earnings'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Earnings</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Referrals</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Withdrawals ({pendingWithdrawalsCount > 0 ? `${pendingWithdrawalsCount} Pending` : withdrawals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Announcements</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Website Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Admin Logs ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'database'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SQL & Schema</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-[#d4af37]" />
              Database Real-Time Overview
            </h3>
            <span className="text-xs text-slate-400">Values populated directly from Postgres tables</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Registered Members</span>
              <div className="text-3xl font-black text-white font-mono">{stats.totalMembers}</div>
              <p className="text-[11px] text-slate-400">Total accounts registered in system</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-emerald-500/30 space-y-2">
              <span className="text-xs text-emerald-400 font-semibold uppercase">Active Approved Members</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">{stats.activeMembers}</div>
              <p className="text-[11px] text-slate-400">Members with approved packages</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-amber-500/30 space-y-2">
              <span className="text-xs text-amber-400 font-semibold uppercase">Pending Activation Payments</span>
              <div className="text-3xl font-black text-amber-400 font-mono">{stats.pendingPayments}</div>
              <p className="text-[11px] text-slate-400">Awaiting Root Admin approval</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Pending Package Activations</span>
              <div className="text-3xl font-black text-white font-mono">{stats.pendingPackageActivations}</div>
              <p className="text-[11px] text-slate-400">Package purchases awaiting payment verification</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Pending Withdrawals</span>
              <div className="text-3xl font-black text-white font-mono">{stats.pendingWithdrawals}</div>
              <p className="text-[11px] text-slate-400">Disbursement requests pending</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-[#d4af37]/40 space-y-2">
              <span className="text-xs text-[#f7df8b] font-semibold uppercase">Total Verified Earnings</span>
              <div className="text-3xl font-black text-[#f7df8b] font-mono">৳{stats.totalVerifiedEarnings.toFixed(2)}</div>
              <p className="text-[11px] text-slate-400">Lifetime disbursements recorded in ledger</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMBERS DIRECTORY */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#d4af37]" />
              Platform Members Directory
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ID, Name, Mobile..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="bg-[#131520] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              </div>

              <select
                value={memberStatusFilter}
                onChange={(e) => setMemberStatusFilter(e.target.value as any)}
                className="bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">INNOVA ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Upline Sponsor</th>
                  <th className="py-3 px-4">Joining Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-mono font-black text-[#f7df8b] flex items-center gap-1.5">
                      {m.innova_id}
                      {m.innova_id === '000001' && <Crown className="w-3 h-3 text-[#d4af37]" />}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{m.full_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{m.mobile}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {m.upline_id || 'ROOT'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(m.joining_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS APPROVAL (CRITICAL WORKFLOW) */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d4af37]" />
              Submitted Activation Payments
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value as any)}
                className="bg-[#131520] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="ALL">All Payments</option>
                <option value="PENDING">Pending Only</option>
                <option value="APPROVED">Approved Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>
            </div>
          </div>

          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Member ID & Name</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method & TrxID</th>
                    <th className="py-3 px-4">Sender Mobile</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPayments.map((p) => {
                    const isProcessing = actionLoadingId === p.id;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/20">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-[#f7df8b]">{p.innova_id}</div>
                          <div className="text-[11px] text-slate-300">{p.member_name}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">{p.package_name}</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">৳{p.amount}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{p.payment_method}</div>
                          <div className="font-mono text-[11px] text-slate-400">{p.transaction_id}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">{p.sender_mobile}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(p.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : p.status === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          {p.status === 'PENDING' ? (
                            <>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleApprovePayment(p.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm disabled:opacity-50 transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3 h-3" />
                                )}
                                <span>APPROVE</span>
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => setRejectModalPayment(p)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 disabled:opacity-50 transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>REJECT</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-[#0f1118] rounded-2xl border border-slate-800">
              No payments match filter.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-[#d4af37]" />
              Database Packages Configuration
            </h3>
            <span className="text-xs text-slate-400">Editable by Root Admin 000001</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                  <span className="font-mono text-xl font-bold text-[#f7df8b]">৳{pkg.price}</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span>{pkg.duration_days} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tasks per Day:</span>
                    <span>{pkg.tasks_per_day} Tasks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Task Duration:</span>
                    <span>~{pkg.task_duration_seconds} Seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Reward:</span>
                    <span className="font-mono font-bold text-emerald-400">৳{pkg.daily_reward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold">{pkg.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400">
                  Package configurations update database rules without modifying previous snapshots.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-[#d4af37]" />
            Platform Task Pool ({tasks.length} Tasks)
          </h3>
          <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reward Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-semibold text-white">{t.title}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">~{t.duration_seconds}s</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">৳{t.reward_amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">{t.is_active ? 'Active' : 'Disabled'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: EARNINGS LEDGER */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#d4af37]" />
            Global Financial Earning Ledger ({earnings.length} Records)
          </h3>
          {earnings.length > 0 ? (
            <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {earnings.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 text-slate-400">{new Date(e.created_at).toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{e.member_id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{e.source}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{e.reference_id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">+৳{e.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-[#0f1118] rounded-2xl border border-slate-800">
              No earning records in ledger yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 7: REFERRALS */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#d4af37]" />
            Referrals Network Records ({referrals.length})
          </h3>
          {referrals.length > 0 ? (
            <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Referrer</th>
                    <th className="py-3 px-4">Referee</th>
                    <th className="py-3 px-4">Generation</th>
                    <th className="py-3 px-4">Reward</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {referrals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 text-slate-400">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{r.referrer_id}</td>
                      <td className="py-3 px-4 font-mono text-[#f7df8b]">{r.referee_id}</td>
                      <td className="py-3 px-4">Gen {r.generation}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">৳{r.reward_amount}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-[#0f1118] rounded-2xl border border-slate-800">
              No referral rewards generated yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 8: WITHDRAWALS */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#d4af37]" />
            Member Withdrawal Requests
          </h3>

          {withdrawals.length > 0 ? (
            <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Member ID & Name</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method & Number</th>
                    <th className="py-3 px-4">Requested Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {withdrawals.map((w) => {
                    const isProcessing = actionLoadingId === w.id;

                    return (
                      <tr key={w.id} className="hover:bg-slate-800/20">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-[#f7df8b]">{w.innova_id}</div>
                          <div className="text-[11px] text-slate-300">{w.member_name}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">৳{w.amount}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{w.payment_method}</div>
                          <div className="font-mono text-slate-400">{w.payment_number}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(w.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {w.status === 'PENDING' ? (
                            <>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleProcessWithdrawal(w.id, 'PAID')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm disabled:opacity-50 cursor-pointer"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <span>MARK PAID</span>
                                )}
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleProcessWithdrawal(w.id, 'REJECTED')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 cursor-pointer"
                              >
                                REJECT
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-[#0f1118] rounded-2xl border border-slate-800">
              No withdrawal requests pending.
            </div>
          )}
        </div>
      )}

      {/* TAB 9: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#d4af37]" />
            Platform System Notifications Log ({allNotifications.length})
          </h3>
          {allNotifications.length > 0 ? (
            <div className="space-y-2">
              {allNotifications.slice(0, 30).map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-[#0f1118] border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300">{n.message}</p>
                  <span className="text-[10px] text-[#d4af37] font-semibold uppercase mt-1 block">
                    Type: {n.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-[#0f1118] rounded-2xl border border-slate-800">
              No system notifications recorded yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 10: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="max-w-2xl bg-[#0f1118] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-[#d4af37]" />
            Broadcast System Announcement
          </h3>
          <p className="text-xs text-slate-400">
            Send in-app notifications directly to all registered members.
          </p>

          <form onSubmit={handleSendAnnouncement} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Platform Network Update & Maintenance"
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Content</label>
              <textarea
                rows={4}
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                placeholder="Type your official announcement here..."
                className="w-full bg-[#131520] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sendingAnnouncement}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {sendingAnnouncement ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 11: WEBSITE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl bg-[#0f1118] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#d4af37]" />
            Global Platform Settings & Contact Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Support Helpline</label>
              <input
                type="text"
                value={supportNum}
                onChange={(e) => setSupportNum(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-pink-400 mb-1">bKash Number</label>
              <input
                type="text"
                value={bkashNum}
                onChange={(e) => setBkashNum(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-orange-400 mb-1">Nagad Number</label>
              <input
                type="text"
                value={nagadNum}
                onChange={(e) => setNagadNum(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#229ED9] mb-1">Support Telegram</label>
              <input
                type="text"
                value={supportTelegram}
                onChange={(e) => setSupportTelegram(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Telegram Community Group URL</label>
              <input
                type="text"
                value={telegramGroup}
                onChange={(e) => setTelegramGroup(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Telegram Channel URL</label>
              <input
                type="text"
                value={telegramChannel}
                onChange={(e) => setTelegramChannel(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={youtubeChannel}
                onChange={(e) => setYoutubeChannel(e.target.value)}
                className="w-full bg-[#131520] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Settings</span>
          </button>
        </form>
      )}

      {/* TAB 12: ADMIN LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#d4af37]" />
            Administrative Audit Trail
          </h3>

          <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Admin ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#f7df8b]">{log.admin_id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{log.action}</td>
                    <td className="py-3 px-4 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 13: SUPABASE DATABASE & SQL MIGRATION */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#d4af37]" />
                  Supabase Project Integration
                </h3>
                <p className="text-xs text-slate-400">
                  Target Project: <span className="font-mono text-slate-300">{SUPABASE_URL}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Postgres RLS Enabled
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Supabase Anon (Public) Key
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={anonKeyInput}
                  onChange={(e) => setAnonKeyInput(e.target.value)}
                  placeholder="Paste your Supabase Project Anon Key here..."
                  className="flex-1 bg-[#131520] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={handleSaveAnonKey}
                  className="gold-btn px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Safe public key for direct Supabase REST, Auth, and Storage queries.
              </p>
            </div>
          </div>

          {/* Copy-Paste SQL Migration Box */}
          <div className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Production SQL Migration Script</h4>
                <p className="text-xs text-slate-400">
                  Execute this idempotent script in your Supabase SQL Editor to provision all tables, sequences,
                  and atomic stored procedures.
                </p>
              </div>
              <button
                type="button"
                onClick={copySqlMigration}
                className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied SQL' : 'Copy Full SQL'}
              </button>
            </div>

            <pre className="p-4 bg-[#0a0b10] border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72">
              {SUPABASE_SQL_MIGRATION}
            </pre>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f1118] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              Reject Payment {rejectModalPayment.innova_id}
            </h4>
            <p className="text-xs text-slate-400">
              Provide a valid rejection reason. This will be recorded and notified to the member.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-[#131520] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setRejectModalPayment(null)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

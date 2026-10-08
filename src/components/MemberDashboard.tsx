import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Clock,
  PlayCircle,
  CheckCircle2,
  PackageCheck,
  Share2,
  Users,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  Shield,
  Layers,
  Crown,
  Camera,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, DEFAULT_PACKAGES } from '../lib/supabase';
import { Package, PackagePurchase, Task, EarningLedger, Profile } from '../types';

interface MemberDashboardProps {
  onOpenProfile: () => void;
  onOpenWithdrawal: () => void;
  onOpenNotifications: () => void;
  onOpenPaymentModal: (pkg?: Package) => void;
  onOpenAdminPanel?: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  onOpenProfile,
  onOpenWithdrawal,
  onOpenNotifications,
  onOpenPaymentModal,
  onOpenAdminPanel,
}) => {
  const {
    user,
    isRootAdmin,
    availableBalance,
    totalEarnings,
    todayEarnings,
    refreshProfile,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'tasks' | 'packages' | 'network' | 'ledger'>('tasks');
  const [packages, setPackages] = useState<PackagePurchase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [canPerformTasks, setCanPerformTasks] = useState(false);
  const [activePackage, setActivePackage] = useState<PackagePurchase | null>(null);
  const [ledger, setLedger] = useState<EarningLedger[]>([]);

  // Task execution state
  const [activeRunningTask, setActiveRunningTask] = useState<Task | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskSuccess, setTaskSuccess] = useState<string | null>(null);

  // Referral info
  const [networkInfo, setNetworkInfo] = useState<{
    uplineId: string | null;
    directPartners: Profile[];
    totalTeamCount: number;
    generations: { gen1: number; gen2: number; gen3: number };
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const [pkgs, taskData, ledg, net] = await Promise.all([
        api.getMemberPackages(user.id),
        api.getMemberTasks(user.id),
        api.getMemberLedger(user.id),
        api.getNetworkInfo(user.innova_id),
      ]);
      setPackages(pkgs);
      setTasks(taskData.tasks);
      setCompletedTaskIds(taskData.completedTaskIds);
      setCanPerformTasks(taskData.canPerformTasks);
      setActivePackage(taskData.activePackage);
      setLedger(ledg);
      setNetworkInfo(net);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    }
  };

  // Timer countdown for running task (~20s duration)
  useEffect(() => {
    if (!activeRunningTask || timerSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTask(activeRunningTask.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeRunningTask, timerSecondsLeft]);

  const handleStartTask = (task: Task) => {
    if (!canPerformTasks) {
      setTaskError('You need an ACTIVE package to perform tasks. Please activate a package first.');
      return;
    }
    if (completedTaskIds.includes(task.id)) {
      setTaskError('Task already completed for today.');
      return;
    }

    setTaskError(null);
    setTaskSuccess(null);
    setActiveRunningTask(task);
    setTimerSecondsLeft(task.duration_seconds || 20);
  };

  const handleFinishTask = async (taskId: string) => {
    if (!user) return;
    setTaskSubmitting(true);
    try {
      const result = await api.completeTask(user.id, taskId);
      setTaskSuccess(result.message);
      setActiveRunningTask(null);
      await Promise.all([loadDashboardData(), refreshProfile()]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTaskError(err.message.replace(/^\d+:\s*/, ''));
      } else {
        setTaskError('Failed to complete task.');
      }
      setActiveRunningTask(null);
    } finally {
      setTaskSubmitting(false);
    }
  };

  const copyReferral = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.innova_id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#08080c] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header / Profile Bar */}
      <div className="bg-[#0f1017] border border-[#232533] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f7df8b] via-[#d4af37] to-[#8d6a13]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Profile Left: Avatar, Name, ID, Status */}
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer" onClick={onOpenProfile}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#181a26] border-2 border-[#d4af37] shadow-lg flex items-center justify-center shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading font-black text-2xl gold-gradient-text">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Update Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                  {user.full_name}
                </h2>
                {isRootAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#d4af37] text-black flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3" /> ROOT ADMIN
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span>
                  INNOVA ID: <strong className="text-[#f7df8b] font-mono text-sm">{user.innova_id}</strong>
                </span>
                <span>•</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {user.status === 'ACTIVE' ? 'Active Account' : 'Pending Activation'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Quick Actions (Admin Panel for 000001, Notifications, Withdraw, Settings, Logout) */}
          <div className="flex items-center gap-2.5">
            {isRootAdmin && onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="gold-btn px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#d4af37]/25 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-black" />
                <span>ADMIN PANEL</span>
              </button>
            )}

            <button
              onClick={onOpenWithdrawal}
              className="px-4 py-2.5 rounded-xl bg-[#171926] hover:bg-[#202235] text-slate-200 border border-slate-700 hover:border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Wallet className="w-4 h-4 text-[#d4af37]" />
              <span>Withdraw</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="p-2.5 rounded-xl bg-[#171926] hover:bg-[#202235] text-slate-300 border border-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenProfile}
              className="p-2.5 rounded-xl bg-[#171926] hover:bg-[#202235] text-slate-300 border border-slate-700 transition-colors"
              title="Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Prominent Stat Cards (Available Balance, Total Earnings, Today's Earnings) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 pt-8 border-t border-slate-800/80">
          <div className="p-5 rounded-2xl bg-[#141520] border border-[#d4af37]/30 bg-gradient-to-br from-[#141520] to-[#1d1a12]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f7df8b]">
                Available Balance
              </span>
              <Wallet className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div className="text-3xl font-black text-[#f7df8b] font-mono mt-2">
              ৳{availableBalance.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Ready for withdrawal</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#141520] border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Earnings
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2">
              ৳{totalEarnings.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Lifetime verified earnings</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#141520] border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today&apos;s Earnings
              </span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2">
              ৳{todayEarnings.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Completed tasks & bonuses today</div>
          </div>
        </div>

        {/* Pending Activation Banner if not active */}
        {user.status === 'PENDING' && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Activation Payment Pending</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your account is registered as PENDING. Submit your ৳200 activation payment to start
                  completing daily tasks and earning verified rewards.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenPaymentModal()}
              className="gold-btn px-4 py-2 rounded-xl text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5"
            >
              <span>PAY ACTIVATION FEE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>Daily Tasks ({completedTaskIds.length}/{tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'packages'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'network'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Power Network & Referrals</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#12141e] text-slate-300 hover:bg-[#1a1c2a]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Earning Ledger</span>
        </button>
      </div>

      {/* TAB CONTENT 1: DAILY TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Active Task Running Overlay */}
          {activeRunningTask && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171926] to-[#1c1912] border-2 border-[#d4af37] shadow-xl text-center space-y-4 animate-in fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#f7df8b] text-xs font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Task Evaluation In Progress
              </span>
              <h3 className="text-xl font-bold text-white">{activeRunningTask.title}</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {activeRunningTask.description}
              </p>

              {/* 20-second active countdown */}
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#d4af37] flex items-center justify-center font-mono text-3xl font-black text-white shadow-lg shadow-[#d4af37]/20">
                {timerSecondsLeft}s
              </div>
              <p className="text-[11px] text-slate-400">
                Please remain on page while task verification finalizes.
              </p>
            </div>
          )}

          {taskError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{taskError}</span>
            </div>
          )}
          {taskSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{taskSuccess}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-[#d4af37]" />
                Today&apos;s Eligible Platform Tasks
              </h3>
              <p className="text-xs text-slate-400">
                12 configured tasks daily. Each task takes approximately 20 seconds.
              </p>
            </div>
            {activePackage && (
              <span className="text-xs font-semibold px-3 py-1 bg-[#151722] border border-slate-700 rounded-full text-slate-200">
                Active Tier: <strong className="text-[#f7df8b]">{activePackage.package_name_snapshot}</strong>
              </span>
            )}
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, idx) => {
              const isCompleted = completedTaskIds.includes(task.id);
              const isRunning = activeRunningTask?.id === task.id;

              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-[#101118]/60 border-slate-800 opacity-70'
                      : 'bg-[#10121a] border-slate-800 hover:border-[#d4af37]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        Task #{idx + 1}
                      </span>
                      {isCompleted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{task.duration_seconds}s
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{task.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Reward:</span>
                      <span className="font-mono text-xs font-bold text-[#f7df8b] ml-1">
                        ৳{task.reward_amount.toFixed(2)}
                      </span>
                    </div>

                    <button
                      disabled={isCompleted || isRunning || !canPerformTasks}
                      onClick={() => handleStartTask(task)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : isRunning
                          ? 'bg-[#d4af37] text-black animate-pulse'
                          : 'gold-btn cursor-pointer'
                      }`}
                    >
                      {isCompleted ? 'Done' : isRunning ? 'Running...' : 'Start Task'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: MY PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-[#d4af37]" />
                  My Packages ({packages.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Your active and historical package subscriptions. Multiple packages remain isolated.
                </p>
              </div>
            </div>

            {packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((p) => {
                  const isApproved = p.status === 'ACTIVE';
                  const isPending = p.status === 'PENDING';
                  const isRejected = p.status === 'REJECTED';
                  const isExpired = p.status === 'EXPIRED';

                  return (
                    <div
                      key={p.id}
                      className={`p-6 rounded-2xl border transition-all space-y-4 ${
                        isApproved
                          ? 'bg-[#0f121a] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                          : isPending
                          ? 'bg-[#14120e] border-amber-500/40 shadow-lg shadow-amber-500/5'
                          : isRejected
                          ? 'bg-[#140e0e] border-rose-500/40'
                          : 'bg-[#0f1118] border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h4 className="text-base font-black text-white flex items-center gap-1.5">
                            {p.package_name_snapshot}
                            <span className="text-xs font-normal text-slate-400">—</span>
                            <span
                              className={`text-xs font-black ${
                                isApproved
                                  ? 'text-emerald-400'
                                  : isPending
                                  ? 'text-amber-400'
                                  : isRejected
                                  ? 'text-rose-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {p.status}
                            </span>
                          </h4>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : isRejected
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Package Price:</span>
                          <span className="font-mono font-bold text-white">৳{p.price_snapshot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-white">{p.duration_snapshot} Days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Daily Tasks:</span>
                          <span className="text-white">12 Tasks / Day (~20s each)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Activation Date:</span>
                          <span className="text-slate-200">
                            {p.activation_date
                              ? new Date(p.activation_date).toLocaleDateString()
                              : 'Awaiting Admin Approval'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expiry Date:</span>
                          <span className="text-slate-200">
                            {p.expiry_date
                              ? new Date(p.expiry_date).toLocaleDateString()
                              : isPending
                              ? 'Starts Upon Approval'
                              : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {isPending && (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                          Payment under review by Root Admin (000001). Status will automatically transition to ACTIVE upon approval.
                        </div>
                      )}
                      {isApproved && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Subscription. Daily tasks and rewards unlocked!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-300 bg-[#0f1118] rounded-2xl border border-slate-800 space-y-2 mb-6">
                <div className="text-base font-bold text-amber-400">No package activated yet.</div>
                <p className="text-slate-400 max-w-md mx-auto">
                  You currently have no active package subscriptions. Choose from the three available tiers below to activate your account.
                </p>
              </div>
            )}
          </div>

          {/* THREE AVAILABLE PACKAGES (STARTER, PLUS, PRO) */}
          <div className="pt-4 border-t border-slate-800">
            <div className="mb-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#d4af37]" />
                Available Packages to Purchase
              </h4>
              <p className="text-xs text-slate-400">
                You can activate any of the three distinct packages. Multiple concurrent packages are fully supported.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEFAULT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-6 rounded-2xl bg-[#0d0e15] border border-slate-800 hover:border-[#d4af37]/40 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-base font-black text-white">{pkg.name}</h5>
                      <span className="font-mono text-lg font-black text-[#f7df8b]">
                        ৳{pkg.price}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 mb-4 pb-4 border-b border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Validity:</span>
                        <span className="font-semibold text-white">{pkg.duration_days} Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Daily Tasks:</span>
                        <span className="font-semibold text-white">{pkg.tasks_per_day} Tasks / Day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Task Duration:</span>
                        <span className="font-semibold text-white">~{pkg.task_duration_seconds}s per task</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Configured Daily Reward:</span>
                        <span className="font-mono font-bold text-emerald-400">৳{pkg.daily_reward}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-6 text-[11px] text-slate-400">
                      {pkg.features.slice(0, 3).map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenPaymentModal(pkg)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold gold-btn flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>PURCHASE / ACTIVATE (৳{pkg.price})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: POWER NETWORK */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#12141f] rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-[#d4af37] uppercase">Referral Link</span>
              <div className="font-mono text-sm font-bold text-white mt-0.5">
                {window.location.origin}/?ref={user.innova_id}
              </div>
            </div>
            <button
              onClick={copyReferral}
              className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedRef ? 'Copied' : 'Copy Referral ID'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0f1118] border border-slate-800">
              <span className="text-xs text-slate-400">Direct Associates (Gen 1)</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {networkInfo?.generations.gen1 || 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f1118] border border-slate-800">
              <span className="text-xs text-slate-400">Generation 2</span>
              <div className="text-2xl font-black text-slate-300 font-mono mt-1">
                {networkInfo?.generations.gen2 || 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f1118] border border-slate-800">
              <span className="text-xs text-slate-400">Generation 3</span>
              <div className="text-2xl font-black text-slate-300 font-mono mt-1">
                {networkInfo?.generations.gen3 || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: EARNING LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#d4af37]" />
            Verified Financial Ledger
          </h3>
          {ledger.length > 0 ? (
            <div className="overflow-x-auto bg-[#0f1118] rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Reference ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ledger.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{item.source}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{item.reference_id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        +৳{item.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-[#0f1118] rounded-2xl border border-slate-800">
              No ledger entries yet. Verified earnings appear here upon task completion or referral activations.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

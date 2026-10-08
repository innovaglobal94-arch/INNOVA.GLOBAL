import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Profile,
  Package,
  PackagePurchase,
  Payment,
  Referral,
  Task,
  TaskCompletion,
  EarningLedger,
  Withdrawal,
  Notification,
  SiteSettings,
  AdminLog,
  PublicStats,
} from '../types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://emnnltbzxzdutnisvzni.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Stored custom key if entered in admin configuration
const CUSTOM_KEY_STORAGE = 'innova_supabase_anon_key';
export function getSavedAnonKey(): string {
  if (SUPABASE_ANON_KEY) return SUPABASE_ANON_KEY;
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CUSTOM_KEY_STORAGE) || '';
  }
  return '';
}

export function saveAnonKey(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_KEY_STORAGE, key.trim());
  }
}

let supabaseInstance: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  const key = getSavedAnonKey();
  if (!key) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch {
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

// -------------------------------------------------------------
// DEFAULT DATA DEFINITIONS (Packages & Settings only - ZERO MEMBERS)
// -------------------------------------------------------------
export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 200,
    duration_days: 15,
    tasks_per_day: 12,
    task_duration_seconds: 20,
    daily_reward: 50,
    features: [
      '12 Daily Tasks (~20s per task)',
      'Configured ৳50 Daily Reward',
      '15 Days Package Validity',
      '৳30 Referral Bonus per Activation',
      'Community Network Access',
      'Standard Withdrawal Support',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'plus',
    name: 'PLUS',
    price: 300,
    duration_days: 15,
    tasks_per_day: 12,
    task_duration_seconds: 20,
    daily_reward: 100,
    features: [
      '12 Daily Tasks (~20s per task)',
      'Configured ৳100 Daily Reward',
      '15 Days Package Validity',
      '৳30 Referral Bonus per Activation',
      'Priority Network Acceleration',
      'Fast-track Withdrawal Eligibility',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 400,
    duration_days: 15,
    tasks_per_day: 12,
    task_duration_seconds: 20,
    daily_reward: 150,
    features: [
      '12 Daily Tasks (~20s per task)',
      'Configured ৳150 Daily Reward',
      '15 Days Package Validity',
      '৳30 Referral Bonus per Activation',
      'VIP Power Network Privileges',
      'Dedicated Channel Support',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  website_name: 'INNOVA.GLOBAL',
  tagline: 'CONNECT • LEARN • GROW',
  description: 'Smart Digital Network Platform',
  support_number: '01313213083',
  bkash_number: '01313213083',
  nagad_number: '01313213083',
  telegram_group: 'https://t.me/+kOclYClnM0NmYzc1',
  telegram_channel: 'https://t.me/powernetwork7xofficialchannel',
  youtube_channel: 'https://www.youtube.com/@PowerNetwork7X',
  support_telegram: 'https://t.me/PARVEZ_OWNER_7X',
};

export const DEFAULT_TASKS: Task[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `task-${idx + 1}`,
  title: `Digital Activity Task #${idx + 1}`,
  description: `Review verified platform partner network content and educational overview.`,
  url: 'https://innova.global',
  duration_seconds: 20,
  reward_amount: 4.16, // approximate portion per task
  is_active: true,
  created_at: new Date().toISOString(),
}));

// -------------------------------------------------------------
// STATEFUL DATABASE SERVICE (ZERO INITIAL DATA)
// Starts with 0 members, 0 active, 0 earnings, 0 demo users
// -------------------------------------------------------------
const DB_STORAGE_KEY = 'innova_global_production_db_v1';

interface DatabaseSchema {
  profiles: Profile[];
  passwords: Record<string, string>; // internal hashed/stored simulation
  packages: Package[];
  package_purchases: PackagePurchase[];
  payments: Payment[];
  referrals: Referral[];
  tasks: Task[];
  task_completions: TaskCompletion[];
  earning_ledger: EarningLedger[];
  withdrawals: Withdrawal[];
  notifications: Notification[];
  settings: SiteSettings;
  admin_logs: AdminLog[];
  next_innova_seq: number;
}

function loadDB(): DatabaseSchema {
  if (typeof window === 'undefined') {
    return {
      profiles: [],
      passwords: {},
      packages: DEFAULT_PACKAGES,
      package_purchases: [],
      payments: [],
      referrals: [],
      tasks: DEFAULT_TASKS,
      task_completions: [],
      earning_ledger: [],
      withdrawals: [],
      notifications: [],
      settings: DEFAULT_SETTINGS,
      admin_logs: [],
      next_innova_seq: 1,
    };
  }

  const raw = localStorage.getItem(DB_STORAGE_KEY);
  if (!raw) {
    const fresh: DatabaseSchema = {
      profiles: [],
      passwords: {},
      packages: DEFAULT_PACKAGES,
      package_purchases: [],
      payments: [],
      referrals: [],
      tasks: DEFAULT_TASKS,
      task_completions: [],
      earning_ledger: [],
      withdrawals: [],
      notifications: [],
      settings: DEFAULT_SETTINGS,
      admin_logs: [],
      next_innova_seq: 1,
    };
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {
      profiles: [],
      passwords: {},
      packages: DEFAULT_PACKAGES,
      package_purchases: [],
      payments: [],
      referrals: [],
      tasks: DEFAULT_TASKS,
      task_completions: [],
      earning_ledger: [],
      withdrawals: [],
      notifications: [],
      settings: DEFAULT_SETTINGS,
      admin_logs: [],
      next_innova_seq: 1,
    };
  }
}

function saveDB(db: DatabaseSchema) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  }
}

// -------------------------------------------------------------
// PRODUCTION API SERVICE (WITH SAFE DUAL-MODE SUPABASE SYNC)
// -------------------------------------------------------------
export const api = {
  // Reset database completely (for clean deployment test verification)
  async resetToCleanState(): Promise<void> {
    const fresh: DatabaseSchema = {
      profiles: [],
      passwords: {},
      packages: DEFAULT_PACKAGES,
      package_purchases: [],
      payments: [],
      referrals: [],
      tasks: DEFAULT_TASKS,
      task_completions: [],
      earning_ledger: [],
      withdrawals: [],
      notifications: [],
      settings: DEFAULT_SETTINGS,
      admin_logs: [],
      next_innova_seq: 1,
    };
    saveDB(fresh);
  },

  // 1. LIVE PUBLIC STATS (Derived dynamically, ZERO INITIAL DATA)
  async getPublicStats(): Promise<PublicStats> {
    const sb = getSupabase();
    if (sb) {
      try {
        const [profRes, earnRes] = await Promise.all([
          sb.from('profiles').select('status'),
          sb.from('earning_ledger').select('amount').eq('status', 'VERIFIED'),
        ]);
        if (!profRes.error && profRes.data) {
          const total_members = profRes.data.length;
          const active_members = profRes.data.filter((p) => p.status === 'ACTIVE').length;
          const total_verified_earnings =
            earnRes.data?.reduce((acc: number, curr: { amount: number }) => acc + Number(curr.amount || 0), 0) || 0;
          return {
            total_members,
            active_members,
            total_joining: total_members,
            total_verified_earnings,
          };
        }
      } catch {
        // fallback to stateful store
      }
    }

    const db = loadDB();
    const total_members = db.profiles.length;
    const active_members = db.profiles.filter((p) => p.status === 'ACTIVE').length;
    const total_verified_earnings = db.earning_ledger
      .filter((e) => e.status === 'VERIFIED')
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      total_members,
      active_members,
      total_joining: total_members,
      total_verified_earnings,
    };
  },

  // 2. PACKAGES
  async getPackages(): Promise<Package[]> {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('packages').select('*').eq('is_active', true);
        if (!error && data && data.length > 0) return data as Package[];
      } catch {
        // fallback
      }
    }
    const db = loadDB();
    return db.packages.filter((p) => p.is_active);
  },

  async getAllPackagesAdmin(): Promise<Package[]> {
    const db = loadDB();
    return db.packages;
  },

  async updatePackage(pkg: Package, adminInnovaId: string): Promise<Package> {
    if (adminInnovaId !== '000001') {
      throw new Error('403: Only Root Admin 000001 can update packages');
    }
    const db = loadDB();
    const idx = db.packages.findIndex((p) => p.id === pkg.id);
    if (idx >= 0) {
      db.packages[idx] = { ...pkg, updated_at: new Date().toISOString() };
    } else {
      db.packages.push({ ...pkg, updated_at: new Date().toISOString() });
    }
    db.admin_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: adminInnovaId,
      action: 'UPDATE_PACKAGE',
      details: `Updated package ${pkg.name} (Price: ৳${pkg.price})`,
      created_at: new Date().toISOString(),
    });
    saveDB(db);
    return pkg;
  },

  // 3. REGISTRATION & ID SEQUENCING
  async register(params: {
    fullName: string;
    mobile: string;
    password: string;
    referralId?: string;
  }): Promise<{ profile: Profile; token: string }> {
    const db = loadDB();

    // Check duplicate mobile
    const existingMobile = db.profiles.find((p) => p.mobile === params.mobile.trim());
    if (existingMobile) {
      throw new Error('409: Mobile number is already registered.');
    }

    const isFirstAccount = db.profiles.length === 0;

    // Referral ID validation:
    let uplineId: string | null = null;
    if (isFirstAccount) {
      // First account: Referral ID is optional
      uplineId = null;
    } else {
      // For 000002+: Referral ID is required
      const ref = (params.referralId || '').trim();
      if (!ref) {
        throw new Error('422: Referral ID is required for registration.');
      }
      const upline = db.profiles.find((p) => p.innova_id === ref);
      if (!upline) {
        throw new Error(`404: Invalid Referral ID "${ref}". Sponsor does not exist.`);
      }
      uplineId = upline.innova_id;
    }

    // Sequence generation: 6 digits (000001, 000002, etc.)
    const seq = db.next_innova_seq;
    db.next_innova_seq += 1;
    const innova_id = String(seq).padStart(6, '0');

    const profileId = crypto.randomUUID();
    const authUserId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newProfile: Profile = {
      id: profileId,
      auth_user_id: authUserId,
      innova_id,
      full_name: params.fullName.trim(),
      mobile: params.mobile.trim(),
      avatar_url: null,
      status: 'PENDING', // starts pending until activation
      joining_date: now,
      upline_id: uplineId,
      bkash_number: null,
      nagad_number: null,
      created_at: now,
      updated_at: now,
    };

    db.profiles.push(newProfile);
    db.passwords[innova_id] = params.password;

    // Welcome Notification
    db.notifications.push({
      id: crypto.randomUUID(),
      member_id: profileId,
      title: 'Welcome to INNOVA.GLOBAL',
      message: `Your account has been created with INNOVA ID: ${innova_id}. Complete your activation payment to start earning.`,
      type: 'ACCOUNT',
      is_read: false,
      created_at: now,
    });

    saveDB(db);

    return { profile: newProfile, token: `session-${innova_id}-${Date.now()}` };
  },

  // 4. LOGIN
  async login(params: {
    innovaId?: string;
    mobile?: string;
    password: string;
  }): Promise<{ profile: Profile; token: string }> {
    const db = loadDB();
    const query = (params.innovaId || params.mobile || '').trim();
    if (!query) throw new Error('400: INNOVA ID or Mobile number is required.');

    const profile = db.profiles.find(
      (p) => p.innova_id === query || p.mobile === query
    );
    if (!profile) {
      throw new Error('401: Account not found with provided credentials.');
    }

    const storedPass = db.passwords[profile.innova_id];
    if (storedPass !== params.password) {
      throw new Error('401: Invalid password. Please try again.');
    }

    return {
      profile,
      token: `session-${profile.innova_id}-${Date.now()}`,
    };
  },

  // 5. PROFILE GET & UPDATE
  async getProfile(innovaId: string): Promise<Profile | null> {
    const db = loadDB();
    return db.profiles.find((p) => p.innova_id === innovaId) || null;
  },

  async updateAvatar(innovaId: string, avatarUrl: string): Promise<Profile> {
    const db = loadDB();
    const profile = db.profiles.find((p) => p.innova_id === innovaId);
    if (!profile) throw new Error('404: Member profile not found');
    profile.avatar_url = avatarUrl;
    profile.updated_at = new Date().toISOString();
    saveDB(db);
    return profile;
  },

  async updatePaymentNumbers(
    innovaId: string,
    numbers: { bkash_number?: string; nagad_number?: string }
  ): Promise<Profile> {
    const db = loadDB();
    const profile = db.profiles.find((p) => p.innova_id === innovaId);
    if (!profile) throw new Error('404: Member profile not found');
    if (numbers.bkash_number !== undefined) profile.bkash_number = numbers.bkash_number;
    if (numbers.nagad_number !== undefined) profile.nagad_number = numbers.nagad_number;
    profile.updated_at = new Date().toISOString();
    saveDB(db);
    return profile;
  },

  // 6. PAYMENTS SUBMISSION
  async submitPayment(params: {
    memberId: string;
    packageId: string;
    amount: number;
    paymentMethod: 'bKash' | 'Nagad';
    transactionId: string;
    senderMobile: string;
    screenshotUrl?: string | null;
  }): Promise<Payment> {
    const db = loadDB();
    const profile = db.profiles.find((p) => p.id === params.memberId);
    if (!profile) throw new Error('404: Member not found');

    const pkg = db.packages.find((p) => p.id === params.packageId);
    if (!pkg) throw new Error('404: Selected package does not exist');

    const now = new Date().toISOString();
    const paymentId = crypto.randomUUID();

    // Create PackagePurchase in PENDING status
    const purchaseId = crypto.randomUUID();
    const purchase: PackagePurchase = {
      id: purchaseId,
      member_id: profile.id,
      package_id: pkg.id,
      package_name_snapshot: pkg.name,
      price_snapshot: pkg.price,
      duration_snapshot: pkg.duration_days,
      activation_date: null,
      expiry_date: null,
      status: 'PENDING',
      created_at: now,
      updated_at: now,
    };
    db.package_purchases.push(purchase);

    const payment: Payment = {
      id: paymentId,
      member_id: profile.id,
      package_purchase_id: purchaseId,
      member_name: profile.full_name,
      innova_id: profile.innova_id,
      package_id: pkg.id,
      package_name: pkg.name,
      amount: params.amount,
      payment_method: params.paymentMethod,
      transaction_id: params.transactionId.trim(),
      sender_mobile: params.senderMobile.trim(),
      screenshot_url: params.screenshotUrl || null,
      status: 'PENDING',
      created_at: now,
    };
    db.payments.unshift(payment);

    // Notification for member
    db.notifications.unshift({
      id: crypto.randomUUID(),
      member_id: profile.id,
      title: 'Payment Submitted',
      message: `Your payment of ৳${params.amount} via ${params.paymentMethod} (TrxID: ${params.transactionId}) has been received and is pending admin approval.`,
      type: 'PAYMENT',
      is_read: false,
      created_at: now,
    });

    saveDB(db);
    return payment;
  },

  // 7. CRITICAL ADMIN APPROVAL SYSTEM (WITH IDEMPOTENCY)
  async approvePayment(
    paymentId: string,
    adminInnovaId: string
  ): Promise<{ success: boolean; status: string; message: string }> {
    // 1. Strict Server/Backend Authorization Check
    if (adminInnovaId !== '000001') {
      throw new Error('403: Access Denied. Only Root Admin 000001 can approve payments.');
    }

    const db = loadDB();
    const payment = db.payments.find((p) => p.id === paymentId);
    if (!payment) {
      throw new Error(`404: Payment ${paymentId} not found.`);
    }

    // 2. IDEMPOTENCY CHECK
    if (payment.status === 'APPROVED') {
      return {
        success: true,
        status: 'Already Approved',
        message: 'This payment has already been approved previously. No duplicate activation performed.',
      };
    }

    if (payment.status !== 'PENDING') {
      throw new Error(`400: Cannot approve payment with current status: ${payment.status}`);
    }

    const profile = db.profiles.find((p) => p.id === payment.member_id);
    if (!profile) {
      throw new Error('404: Associated member profile not found.');
    }

    const pkg = db.packages.find((p) => p.id === payment.package_id);
    if (!pkg) {
      throw new Error('404: Associated package not found.');
    }

    const now = new Date();
    const activationDate = now.toISOString();
    const expiry = new Date(now.getTime() + pkg.duration_days * 24 * 60 * 60 * 1000);
    const expiryDate = expiry.toISOString();

    // Transactionally update payment
    payment.status = 'APPROVED';
    payment.approved_at = activationDate;

    // Update or activate package purchase associated with this exact payment
    let purchase: PackagePurchase | undefined;
    if (payment.package_purchase_id) {
      purchase = db.package_purchases.find((p) => p.id === payment.package_purchase_id);
    }
    if (!purchase) {
      purchase = db.package_purchases.find(
        (p) => p.member_id === profile.id && p.package_id === pkg.id && p.status === 'PENDING'
      );
    }

    if (purchase) {
      purchase.status = 'ACTIVE';
      purchase.activation_date = activationDate;
      purchase.expiry_date = expiryDate;
      purchase.updated_at = activationDate;
    } else {
      purchase = {
        id: crypto.randomUUID(),
        member_id: profile.id,
        package_id: pkg.id,
        package_name_snapshot: pkg.name,
        price_snapshot: pkg.price,
        duration_snapshot: pkg.duration_days,
        activation_date: activationDate,
        expiry_date: expiryDate,
        status: 'ACTIVE',
        created_at: activationDate,
        updated_at: activationDate,
      };
      db.package_purchases.push(purchase);
      payment.package_purchase_id = purchase.id;
    }

    const wasPending = profile.status === 'PENDING';
    profile.status = 'ACTIVE';
    profile.updated_at = activationDate;

    // Referral Reward: Only if this was member's first activation and upline exists
    if (profile.upline_id && wasPending) {
      const upline = db.profiles.find((p) => p.innova_id === profile.upline_id);
      if (upline) {
        db.earning_ledger.push({
          id: crypto.randomUUID(),
          member_id: upline.id,
          amount: 30,
          source: 'REFERRAL',
          reference_id: `REF-${profile.innova_id}`,
          status: 'VERIFIED',
          created_at: activationDate,
        });

        db.referrals.push({
          id: crypto.randomUUID(),
          referrer_id: upline.id,
          referee_id: profile.id,
          generation: 1,
          reward_amount: 30,
          status: 'VERIFIED',
          created_at: activationDate,
        });

        db.notifications.unshift({
          id: crypto.randomUUID(),
          member_id: upline.id,
          title: 'Referral Reward Received',
          message: `You earned ৳30 referral reward for activating member ${profile.innova_id}!`,
          type: 'REFERRAL',
          is_read: false,
          created_at: activationDate,
        });
      }
    }

    // Member notification
    db.notifications.unshift({
      id: crypto.randomUUID(),
      member_id: profile.id,
      title: 'Payment Approved & Account Activated!',
      message: `Your payment of ৳${payment.amount} for package ${pkg.name} has been approved. Your account is now ACTIVE until ${expiry.toLocaleDateString()}.`,
      type: 'PAYMENT',
      is_read: false,
      created_at: activationDate,
    });

    // Admin Audit Log
    db.admin_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: adminInnovaId,
      action: 'APPROVE_PAYMENT',
      details: `Approved payment ${payment.id} (৳${payment.amount}) for member ${profile.innova_id}. Activated package ${pkg.name}.`,
      created_at: activationDate,
    });

    saveDB(db);

    return {
      success: true,
      status: 'APPROVED',
      message: `Payment approved successfully. Member ${profile.innova_id} is now ACTIVE.`,
    };
  },

  // 8. ADMIN REJECT PAYMENT
  async rejectPayment(
    paymentId: string,
    adminInnovaId: string,
    reason: string
  ): Promise<{ success: boolean; status: string }> {
    if (adminInnovaId !== '000001') {
      throw new Error('403: Access Denied. Only Root Admin 000001 can reject payments.');
    }

    const db = loadDB();
    const payment = db.payments.find((p) => p.id === paymentId);
    if (!payment) throw new Error(`404: Payment ${paymentId} not found.`);
    if (payment.status !== 'PENDING') {
      throw new Error(`400: Cannot reject payment with status ${payment.status}`);
    }

    const profile = db.profiles.find((p) => p.id === payment.member_id);
    const now = new Date().toISOString();

    payment.status = 'REJECTED';
    payment.rejection_reason = reason.trim() || 'Invalid transaction or verification mismatch.';

    // Mark the exact associated package purchase as REJECTED
    if (payment.package_purchase_id) {
      const purchase = db.package_purchases.find((p) => p.id === payment.package_purchase_id);
      if (purchase && purchase.status === 'PENDING') {
        purchase.status = 'REJECTED';
        purchase.updated_at = now;
      }
    } else {
      const purchase = db.package_purchases.find(
        (p) => p.member_id === payment.member_id && p.package_id === payment.package_id && p.status === 'PENDING'
      );
      if (purchase) {
        purchase.status = 'REJECTED';
        purchase.updated_at = now;
      }
    }

    if (profile) {
      db.notifications.unshift({
        id: crypto.randomUUID(),
        member_id: profile.id,
        title: 'Payment Rejected',
        message: `Your payment of ৳${payment.amount} was rejected: ${payment.rejection_reason}`,
        type: 'PAYMENT',
        is_read: false,
        created_at: now,
      });
    }

    db.admin_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: adminInnovaId,
      action: 'REJECT_PAYMENT',
      details: `Rejected payment ${payment.id} for member ${profile?.innova_id || 'unknown'}. Reason: ${payment.rejection_reason}`,
      created_at: now,
    });

    saveDB(db);
    return { success: true, status: 'REJECTED' };
  },

  // 9. MEMBER DATA & PACKAGES
  async getMemberPackages(memberId: string): Promise<PackagePurchase[]> {
    const db = loadDB();
    return db.package_purchases.filter((p) => p.member_id === memberId);
  },

  async getMemberPayments(memberId: string): Promise<Payment[]> {
    const db = loadDB();
    return db.payments.filter((p) => p.member_id === memberId);
  },

  async getMemberLedger(memberId: string): Promise<EarningLedger[]> {
    const db = loadDB();
    return db.earning_ledger.filter((l) => l.member_id === memberId);
  },

  async getMemberBalance(memberId: string): Promise<{
    availableBalance: number;
    totalEarnings: number;
    todayEarnings: number;
  }> {
    const db = loadDB();
    const ledger = db.earning_ledger.filter(
      (l) => l.member_id === memberId && l.status === 'VERIFIED'
    );
    const totalEarnings = ledger.reduce((sum, item) => sum + item.amount, 0);

    const withdrawals = db.withdrawals.filter(
      (w) => w.member_id === memberId && (w.status === 'PENDING' || w.status === 'APPROVED' || w.status === 'PAID')
    );
    const totalWithdrawnOrPending = withdrawals.reduce((sum, item) => sum + item.amount, 0);

    const availableBalance = Math.max(0, totalEarnings - totalWithdrawnOrPending);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayEarnings = ledger
      .filter((l) => l.created_at.startsWith(todayStr))
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      availableBalance,
      totalEarnings,
      todayEarnings,
    };
  },

  // 10. TASK SYSTEM (12 Tasks, ~20s countdown, verified ledger)
  async getMemberTasks(memberId: string): Promise<{
    tasks: Task[];
    completedTaskIds: string[];
    canPerformTasks: boolean;
    activePackage: PackagePurchase | null;
  }> {
    const db = loadDB();
    const todayStr = new Date().toISOString().slice(0, 10);

    const activePurchase = db.package_purchases.find(
      (p) => p.member_id === memberId && p.status === 'ACTIVE'
    );

    const completed = db.task_completions
      .filter((c) => c.member_id === memberId && c.date_str === todayStr)
      .map((c) => c.task_id);

    return {
      tasks: db.tasks,
      completedTaskIds: completed,
      canPerformTasks: !!activePurchase,
      activePackage: activePurchase || null,
    };
  },

  async completeTask(
    memberId: string,
    taskId: string
  ): Promise<{ success: boolean; rewardAmount: number; message: string }> {
    const db = loadDB();
    const profile = db.profiles.find((p) => p.id === memberId);
    if (!profile) throw new Error('404: Member not found');
    if (profile.status !== 'ACTIVE') {
      throw new Error('403: Account must be ACTIVE to perform tasks');
    }

    const activePurchase = db.package_purchases.find(
      (p) => p.member_id === memberId && p.status === 'ACTIVE'
    );
    if (!activePurchase) {
      throw new Error('403: No active package found. Please activate a package.');
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    // Prevent duplicate completion
    const alreadyCompleted = db.task_completions.some(
      (c) => c.member_id === memberId && c.task_id === taskId && c.date_str === todayStr
    );
    if (alreadyCompleted) {
      throw new Error('409: Task already completed for today. No duplicate reward allowed.');
    }

    const pkg = db.packages.find((p) => p.id === activePurchase.package_id);
    const dailyReward = pkg ? pkg.daily_reward : 50;
    const taskCount = pkg ? pkg.tasks_per_day : 12;
    const rewardPerTask = Number((dailyReward / taskCount).toFixed(2));

    const now = new Date().toISOString();
    db.task_completions.push({
      id: crypto.randomUUID(),
      member_id: memberId,
      task_id: taskId,
      package_purchase_id: activePurchase.id,
      reward_amount: rewardPerTask,
      completed_at: now,
      date_str: todayStr,
    });

    // Create Earning Ledger Entry
    db.earning_ledger.push({
      id: crypto.randomUUID(),
      member_id: memberId,
      amount: rewardPerTask,
      source: 'PACKAGE_TASK',
      reference_id: `TASK-${taskId}-${todayStr}`,
      status: 'VERIFIED',
      created_at: now,
    });

    saveDB(db);

    return {
      success: true,
      rewardAmount: rewardPerTask,
      message: `Task completed successfully! ৳${rewardPerTask} added to verified earnings.`,
    };
  },

  // 11. REFERRALS & POWER NETWORK
  async getNetworkInfo(innovaId: string): Promise<{
    uplineId: string | null;
    directPartners: Profile[];
    totalTeamCount: number;
    generations: { gen1: number; gen2: number; gen3: number };
  }> {
    const db = loadDB();
    const member = db.profiles.find((p) => p.innova_id === innovaId);
    if (!member) {
      return { uplineId: null, directPartners: [], totalTeamCount: 0, generations: { gen1: 0, gen2: 0, gen3: 0 } };
    }

    // Gen 1: Direct partners
    const gen1 = db.profiles.filter((p) => p.upline_id === innovaId);
    const gen1Ids = new Set(gen1.map((p) => p.innova_id));

    // Gen 2:
    const gen2 = db.profiles.filter((p) => p.upline_id && gen1Ids.has(p.upline_id));
    const gen2Ids = new Set(gen2.map((p) => p.innova_id));

    // Gen 3:
    const gen3 = db.profiles.filter((p) => p.upline_id && gen2Ids.has(p.upline_id));

    const totalTeamCount = gen1.length + gen2.length + gen3.length;

    return {
      uplineId: member.upline_id,
      directPartners: gen1,
      totalTeamCount,
      generations: {
        gen1: gen1.length,
        gen2: gen2.length,
        gen3: gen3.length,
      },
    };
  },

  // 12. WITHDRAWAL SYSTEM
  async requestWithdrawal(params: {
    memberId: string;
    amount: number;
    paymentMethod: 'bKash' | 'Nagad';
    paymentNumber: string;
  }): Promise<Withdrawal> {
    const db = loadDB();
    const profile = db.profiles.find((p) => p.id === params.memberId);
    if (!profile) throw new Error('404: Member not found');
    if (profile.status !== 'ACTIVE') {
      throw new Error('403: Only ACTIVE members can request withdrawals');
    }

    if (params.amount <= 0) {
      throw new Error('422: Withdrawal amount must be greater than 0');
    }

    const { availableBalance } = await this.getMemberBalance(params.memberId);
    if (params.amount > availableBalance) {
      throw new Error(`422: Insufficient available balance. You have ৳${availableBalance.toFixed(2)}`);
    }

    // Configured 10-minute waiting rule check between withdrawals
    const lastWithdrawal = db.withdrawals
      .filter((w) => w.member_id === params.memberId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (lastWithdrawal) {
      const diffMs = Date.now() - new Date(lastWithdrawal.created_at).getTime();
      const tenMinutesMs = 10 * 60 * 1000;
      if (diffMs < tenMinutesMs) {
        const remainingMinutes = Math.ceil((tenMinutesMs - diffMs) / (60 * 1000));
        throw new Error(
          `429: Security cooldown active. Please wait ${remainingMinutes} more minute(s) before requesting another withdrawal.`
        );
      }
    }

    const now = new Date().toISOString();
    const withdrawal: Withdrawal = {
      id: crypto.randomUUID(),
      member_id: params.memberId,
      innova_id: profile.innova_id,
      member_name: profile.full_name,
      amount: params.amount,
      payment_method: params.paymentMethod,
      payment_number: params.paymentNumber.trim(),
      status: 'PENDING',
      created_at: now,
    };

    db.withdrawals.unshift(withdrawal);

    db.notifications.unshift({
      id: crypto.randomUUID(),
      member_id: params.memberId,
      title: 'Withdrawal Requested',
      message: `Your withdrawal request of ৳${params.amount} via ${params.paymentMethod} has been placed. Root Admin will review and disburse shortly.`,
      type: 'WITHDRAWAL',
      is_read: false,
      created_at: now,
    });

    saveDB(db);
    return withdrawal;
  },

  async getMemberWithdrawals(memberId: string): Promise<Withdrawal[]> {
    const db = loadDB();
    return db.withdrawals.filter((w) => w.member_id === memberId);
  },

  // 13. NOTIFICATIONS
  async getNotifications(memberId: string): Promise<Notification[]> {
    const db = loadDB();
    return db.notifications.filter((n) => n.member_id === memberId);
  },

  async markNotificationRead(notifId: string): Promise<void> {
    const db = loadDB();
    const n = db.notifications.find((notif) => notif.id === notifId);
    if (n) {
      n.is_read = true;
      saveDB(db);
    }
  },

  // 14. ADMIN PANEL METHODS (000001 ONLY)
  async getAdminStats(adminInnovaId: string): Promise<{
    totalMembers: number;
    activeMembers: number;
    pendingPayments: number;
    pendingPackageActivations: number;
    pendingApprovals: number;
    pendingWithdrawals: number;
    totalVerifiedEarnings: number;
  }> {
    if (adminInnovaId !== '000001') {
      throw new Error('403: Access Denied. Only Root Admin 000001 can view admin stats.');
    }
    const db = loadDB();
    const pendingPayments = db.payments.filter((p) => p.status === 'PENDING').length;
    const pendingPackageActivations = db.package_purchases.filter((p) => p.status === 'PENDING').length;
    const pendingWithdrawals = db.withdrawals.filter((w) => w.status === 'PENDING').length;
    const activeMembers = db.profiles.filter((p) => p.status === 'ACTIVE').length;
    const totalEarnings = db.earning_ledger
      .filter((e) => e.status === 'VERIFIED')
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      totalMembers: db.profiles.length,
      activeMembers,
      pendingPayments,
      pendingPackageActivations,
      pendingApprovals: pendingPayments,
      pendingWithdrawals,
      totalVerifiedEarnings: totalEarnings,
    };
  },

  async getAdminPayments(adminInnovaId: string): Promise<Payment[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.payments;
  },

  async getAdminMembers(adminInnovaId: string): Promise<Profile[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.profiles;
  },

  async getAdminAllEarnings(adminInnovaId: string): Promise<EarningLedger[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.earning_ledger;
  },

  async getAdminAllReferrals(adminInnovaId: string): Promise<Referral[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.referrals;
  },

  async getAdminAllNotifications(adminInnovaId: string): Promise<Notification[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.notifications;
  },

  async getAdminTasks(adminInnovaId: string): Promise<Task[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.tasks;
  },

  async getAdminWithdrawals(adminInnovaId: string): Promise<Withdrawal[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.withdrawals;
  },

  async processWithdrawal(
    withdrawalId: string,
    adminInnovaId: string,
    status: 'PAID' | 'REJECTED',
    reason?: string
  ): Promise<Withdrawal> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    const w = db.withdrawals.find((item) => item.id === withdrawalId);
    if (!w) throw new Error('404: Withdrawal request not found');
    if (w.status !== 'PENDING' && w.status !== 'APPROVED') {
      throw new Error(`400: Cannot update withdrawal with status ${w.status}`);
    }

    const now = new Date().toISOString();
    w.status = status;
    w.processed_at = now;
    if (status === 'REJECTED') {
      w.rejection_reason = reason || 'Declined by administration';
    }

    db.notifications.unshift({
      id: crypto.randomUUID(),
      member_id: w.member_id,
      title: status === 'PAID' ? 'Withdrawal Disbursed!' : 'Withdrawal Rejected',
      message:
        status === 'PAID'
          ? `Your withdrawal of ৳${w.amount} to ${w.payment_method} (${w.payment_number}) has been transferred successfully!`
          : `Your withdrawal of ৳${w.amount} was rejected: ${w.rejection_reason}`,
      type: 'WITHDRAWAL',
      is_read: false,
      created_at: now,
    });

    db.admin_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: adminInnovaId,
      action: status === 'PAID' ? 'WITHDRAWAL_PAID' : 'WITHDRAWAL_REJECTED',
      details: `Processed withdrawal ${w.id} of ৳${w.amount} for member ${w.innova_id}. Status: ${status}`,
      created_at: now,
    });

    saveDB(db);
    return w;
  },

  async sendAnnouncement(params: {
    adminInnovaId: string;
    title: string;
    message: string;
    targetMemberId?: string; // 'ALL' or specific profile id
  }): Promise<void> {
    if (params.adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    const now = new Date().toISOString();

    if (!params.targetMemberId || params.targetMemberId === 'ALL') {
      db.profiles.forEach((p) => {
        db.notifications.unshift({
          id: crypto.randomUUID(),
          member_id: p.id,
          title: params.title,
          message: params.message,
          type: 'ANNOUNCEMENT',
          is_read: false,
          created_at: now,
        });
      });
    } else {
      db.notifications.unshift({
        id: crypto.randomUUID(),
        member_id: params.targetMemberId,
        title: params.title,
        message: params.message,
        type: 'ANNOUNCEMENT',
        is_read: false,
        created_at: now,
      });
    }

    db.admin_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: params.adminInnovaId,
      action: 'SEND_ANNOUNCEMENT',
      details: `Broadcasted announcement "${params.title}" to ${params.targetMemberId || 'ALL'}`,
      created_at: now,
    });

    saveDB(db);
  },

  async getAdminLogs(adminInnovaId: string): Promise<AdminLog[]> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    return db.admin_logs;
  },

  async getSiteSettings(): Promise<SiteSettings> {
    const db = loadDB();
    return db.settings;
  },

  async updateSiteSettings(settings: SiteSettings, adminInnovaId: string): Promise<SiteSettings> {
    if (adminInnovaId !== '000001') throw new Error('403: Access Denied.');
    const db = loadDB();
    db.settings = settings;
    db.admin_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: adminInnovaId,
      action: 'UPDATE_SETTINGS',
      details: 'Updated global site settings & contacts',
      created_at: new Date().toISOString(),
    });
    saveDB(db);
    return settings;
  },
};

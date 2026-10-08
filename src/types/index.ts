export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export interface Profile {
  id: string; // uuid
  auth_user_id: string;
  innova_id: string; // '000001', '000002', etc.
  full_name: string;
  mobile: string;
  avatar_url: string | null;
  status: AccountStatus;
  joining_date: string;
  upline_id: string | null;
  bkash_number: string | null;
  nagad_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  tasks_per_day: number;
  task_duration_seconds: number;
  daily_reward: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PurchaseStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';

export interface PackagePurchase {
  id: string;
  member_id: string; // profile uuid
  package_id: string;
  package_name_snapshot: string;
  price_snapshot: number;
  duration_snapshot: number;
  activation_date: string | null;
  expiry_date: string | null;
  status: PurchaseStatus;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 'bKash' | 'Nagad';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Payment {
  id: string;
  member_id: string;
  package_purchase_id?: string;
  member_name?: string;
  innova_id?: string;
  package_id: string;
  package_name?: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  sender_mobile: string;
  screenshot_url: string | null;
  status: PaymentStatus;
  rejection_reason?: string | null;
  created_at: string;
  approved_at?: string | null;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  generation: number;
  reward_amount: number;
  status: 'PENDING' | 'VERIFIED';
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  url: string;
  duration_seconds: number;
  reward_amount: number;
  is_active: boolean;
  created_at: string;
}

export interface TaskCompletion {
  id: string;
  member_id: string;
  task_id: string;
  package_purchase_id?: string;
  reward_amount: number;
  completed_at: string;
  date_str: string; // YYYY-MM-DD
}

export type EarningSource =
  | 'PACKAGE_TASK'
  | 'REFERRAL'
  | 'BONUS'
  | 'MONTHLY_REWARD'
  | 'ADMIN_ADJUSTMENT';

export interface EarningLedger {
  id: string;
  member_id: string;
  amount: number;
  source: EarningSource;
  reference_id: string;
  status: 'VERIFIED' | 'PENDING';
  created_at: string;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface Withdrawal {
  id: string;
  member_id: string;
  innova_id?: string;
  member_name?: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_number: string;
  status: WithdrawalStatus;
  rejection_reason?: string | null;
  created_at: string;
  processed_at?: string | null;
}

export type NotificationType =
  | 'ACCOUNT'
  | 'PAYMENT'
  | 'PACKAGE'
  | 'TASK'
  | 'EARNING'
  | 'REFERRAL'
  | 'WITHDRAWAL'
  | 'BONUS'
  | 'MONTHLY_REWARD'
  | 'ANNOUNCEMENT'
  | 'SYSTEM';

export interface Notification {
  id: string;
  member_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  website_name: string;
  tagline: string;
  description: string;
  support_number: string;
  bkash_number: string;
  nagad_number: string;
  telegram_group: string;
  telegram_channel: string;
  youtube_channel: string;
  support_telegram: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  details: string;
  created_at: string;
}

export interface PublicStats {
  total_members: number;
  active_members: number;
  total_joining: number;
  total_verified_earnings: number;
}

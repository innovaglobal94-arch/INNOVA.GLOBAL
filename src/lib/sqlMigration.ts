export const SUPABASE_SQL_MIGRATION = `-- ===================================================
-- INNOVA.GLOBAL PRODUCTION DATABASE SCHEMA & RPC
-- Safe Idempotent Migration for emnnltbzxzdutnisvzni.supabase.co
-- ===================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEQUENCES FOR SIX-DIGIT INNOVA IDs
CREATE SEQUENCE IF NOT EXISTS innova_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_innova_id()
RETURNS TEXT AS $$
DECLARE
  next_val BIGINT;
BEGIN
  -- Database-controlled concurrency-safe sequence
  next_val := nextval('innova_id_seq');
  RETURN LPAD(next_val::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  innova_id VARCHAR(6) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
  joining_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  upline_id VARCHAR(6) DEFAULT NULL,
  bkash_number VARCHAR(20) DEFAULT NULL,
  nagad_number VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  duration_days INT NOT NULL,
  tasks_per_day INT NOT NULL DEFAULT 12,
  task_duration_seconds INT NOT NULL DEFAULT 20,
  daily_reward NUMERIC(10, 2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Packages if not exist
INSERT INTO public.packages (id, name, price, duration_days, tasks_per_day, task_duration_seconds, daily_reward, features, is_active)
VALUES
  ('starter', 'STARTER', 200, 15, 12, 20, 50, '["12 Tasks Daily (~20s each)", "৳50 Daily Reward", "15 Days Package Validity", "৳30 Referral Bonus", "Community Network Access"]'::jsonb, true),
  ('plus', 'PLUS', 300, 15, 12, 20, 100, '["12 Tasks Daily (~20s each)", "৳100 Daily Reward", "15 Days Package Validity", "৳30 Referral Bonus", "Priority Support & Access"]'::jsonb, true),
  ('pro', 'PRO', 400, 15, 12, 20, 150, '["12 Tasks Daily (~20s each)", "৳150 Daily Reward", "15 Days Package Validity", "৳30 Referral Bonus", "VIP Power Network Privileges"]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days,
  daily_reward = EXCLUDED.daily_reward;

-- 5. PACKAGE PURCHASES TABLE
CREATE TABLE IF NOT EXISTS public.package_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL REFERENCES public.packages(id),
  package_name_snapshot TEXT NOT NULL,
  price_snapshot NUMERIC(10, 2) NOT NULL,
  duration_snapshot INT NOT NULL,
  activation_date TIMESTAMPTZ DEFAULT NULL,
  expiry_date TIMESTAMPTZ DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL REFERENCES public.packages(id),
  package_purchase_id UUID REFERENCES public.package_purchases(id),
  amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('bKash', 'Nagad')),
  transaction_id VARCHAR(100) NOT NULL,
  sender_mobile VARCHAR(20) NOT NULL,
  screenshot_url TEXT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  rejection_reason TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ DEFAULT NULL
);

-- 7. TASKS & COMPLETIONS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '#',
  duration_seconds INT NOT NULL DEFAULT 20,
  reward_amount NUMERIC(10, 2) NOT NULL DEFAULT 4.16,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  package_purchase_id UUID REFERENCES public.package_purchases(id),
  reward_amount NUMERIC(10, 2) NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_str VARCHAR(10) NOT NULL, -- 'YYYY-MM-DD'
  CONSTRAINT unique_member_task_per_day UNIQUE (member_id, task_id, date_str)
);

-- 8. EARNING LEDGER
CREATE TABLE IF NOT EXISTS public.earning_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  source VARCHAR(50) NOT NULL CHECK (source IN ('PACKAGE_TASK', 'REFERRAL', 'BONUS', 'MONTHLY_REWARD', 'ADMIN_ADJUSTMENT')),
  reference_id TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'PENDING')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  generation INT NOT NULL DEFAULT 1,
  reward_amount NUMERIC(10, 2) NOT NULL DEFAULT 30,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_referee_referral UNIQUE (referee_id)
);

-- 10. WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('bKash', 'Nagad')),
  payment_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PAID', 'REJECTED')),
  rejection_reason TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ DEFAULT NULL
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ADMIN LOGS
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================================================
-- CRITICAL TRANSACTIONAL RPC FUNCTIONS
-- ===================================================

-- APPROVE PAYMENT RPC (Atomic, Idempotent)
CREATE OR REPLACE FUNCTION approve_payment_rpc(p_payment_id UUID, p_admin_innova_id TEXT)
RETURNS JSONB AS $$
DECLARE
  v_payment RECORD;
  v_profile RECORD;
  v_purchase RECORD;
  v_package RECORD;
  v_activation_date TIMESTAMPTZ := NOW();
  v_expiry_date TIMESTAMPTZ;
  v_referrer_profile RECORD;
BEGIN
  -- 1. Security Check: Only Root Admin 000001
  IF p_admin_innova_id <> '000001' THEN
    RAISE EXCEPTION 'Access Denied: Only Root Admin 000001 can approve payments';
  END IF;

  -- 2. Lock & Fetch Payment
  SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found: %', p_payment_id;
  END IF;

  -- 3. Idempotency Check:
  IF v_payment.status = 'APPROVED' THEN
    RETURN jsonb_build_object('success', true, 'status', 'Already Approved', 'message', 'Payment was already approved previously');
  END IF;

  IF v_payment.status <> 'PENDING' THEN
    RAISE EXCEPTION 'Cannot approve payment with status %', v_payment.status;
  END IF;

  -- 4. Fetch Profile & Package
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_payment.member_id FOR UPDATE;
  SELECT * INTO v_package FROM public.packages WHERE id = v_payment.package_id;
  
  v_expiry_date := v_activation_date + (v_package.duration_days || ' days')::INTERVAL;

  -- 5. Update Payment
  UPDATE public.payments
  SET status = 'APPROVED', approved_at = v_activation_date
  WHERE id = p_payment_id;

  -- 6. Update or Create Package Purchase
  IF v_payment.package_purchase_id IS NOT NULL THEN
    UPDATE public.package_purchases
    SET status = 'ACTIVE', activation_date = v_activation_date, expiry_date = v_expiry_date, updated_at = NOW()
    WHERE id = v_payment.package_purchase_id;
  ELSE
    INSERT INTO public.package_purchases (member_id, package_id, package_name_snapshot, price_snapshot, duration_snapshot, activation_date, expiry_date, status)
    VALUES (v_profile.id, v_package.id, v_package.name, v_package.price, v_package.duration_days, v_activation_date, v_expiry_date, 'ACTIVE');
  END IF;

  -- 7. Activate Member
  UPDATE public.profiles
  SET status = 'ACTIVE', updated_at = NOW()
  WHERE id = v_profile.id;

  -- 8. Referral Bonus if upline exists and this is first activation
  IF v_profile.upline_id IS NOT NULL AND v_profile.status = 'PENDING' THEN
    SELECT * INTO v_referrer_profile FROM public.profiles WHERE innova_id = v_profile.upline_id;
    IF FOUND THEN
      -- Record referral earning
      INSERT INTO public.earning_ledger (member_id, amount, source, reference_id, status)
      VALUES (v_referrer_profile.id, 30.00, 'REFERRAL', 'REF-' || v_profile.innova_id, 'VERIFIED');

      -- Record referral status
      INSERT INTO public.referrals (referrer_id, referee_id, generation, reward_amount, status)
      VALUES (v_referrer_profile.id, v_profile.id, 1, 30.00, 'VERIFIED')
      ON CONFLICT (referee_id) DO UPDATE SET status = 'VERIFIED';

      -- Notify referrer
      INSERT INTO public.notifications (member_id, title, message, type)
      VALUES (v_referrer_profile.id, 'Referral Bonus Received', 'You received ৳30 referral reward for activating member ' || v_profile.innova_id, 'REFERRAL');
    END IF;
  END IF;

  -- 9. Member Notification
  INSERT INTO public.notifications (member_id, title, message, type)
  VALUES (v_profile.id, 'Account Activated!', 'Your payment for ' || v_package.name || ' (৳' || v_payment.amount || ') was approved. Your account is now ACTIVE!', 'PAYMENT');

  -- 10. Admin Audit Log
  INSERT INTO public.admin_logs (admin_id, action, details)
  VALUES (p_admin_innova_id, 'APPROVE_PAYMENT', 'Approved payment ' || p_payment_id || ' of ৳' || v_payment.amount || ' for member ' || v_profile.innova_id);

  RETURN jsonb_build_object('success', true, 'status', 'APPROVED', 'innova_id', v_profile.innova_id);
END;
$$ LANGUAGE plpgsql;

-- REJECT PAYMENT RPC
CREATE OR REPLACE FUNCTION reject_payment_rpc(p_payment_id UUID, p_admin_innova_id TEXT, p_reason TEXT)
RETURNS JSONB AS $$
DECLARE
  v_payment RECORD;
  v_profile RECORD;
BEGIN
  IF p_admin_innova_id <> '000001' THEN
    RAISE EXCEPTION 'Access Denied: Only Root Admin 000001 can reject payments';
  END IF;

  SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found: %', p_payment_id;
  END IF;

  IF v_payment.status <> 'PENDING' THEN
    RAISE EXCEPTION 'Cannot reject payment with status %', v_payment.status;
  END IF;

  SELECT * INTO v_profile FROM public.profiles WHERE id = v_payment.member_id;

  UPDATE public.payments
  SET status = 'REJECTED', rejection_reason = p_reason
  WHERE id = p_payment_id;

  IF v_payment.package_purchase_id IS NOT NULL THEN
    UPDATE public.package_purchases
    SET status = 'REJECTED', updated_at = NOW()
    WHERE id = v_payment.package_purchase_id;
  END IF;

  INSERT INTO public.notifications (member_id, title, message, type)
  VALUES (v_profile.id, 'Payment Rejected', 'Your payment (৳' || v_payment.amount || ') was rejected: ' || p_reason, 'PAYMENT');

  INSERT INTO public.admin_logs (admin_id, action, details)
  VALUES (p_admin_innova_id, 'REJECT_PAYMENT', 'Rejected payment ' || p_payment_id || ' for member ' || v_profile.innova_id || '. Reason: ' || p_reason);

  RETURN jsonb_build_object('success', true, 'status', 'REJECTED');
END;
$$ LANGUAGE plpgsql;
`;

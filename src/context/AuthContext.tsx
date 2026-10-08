import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile, PublicStats, SiteSettings } from '../types';
import { api, DEFAULT_SETTINGS } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isRootAdmin: boolean;
  token: string | null;
  loading: boolean;
  availableBalance: number;
  totalEarnings: number;
  todayEarnings: number;
  unreadNotificationsCount: number;
  stats: PublicStats;
  settings: SiteSettings;
  login: (credentials: { innovaId?: string; mobile?: string; password: string }) => Promise<Profile>;
  register: (data: { fullName: string; mobile: string; password: string; referralId?: string }) => Promise<Profile>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  updateAvatar: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'innova_active_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [stats, setStats] = useState<PublicStats>({
    total_members: 0,
    active_members: 0,
    total_joining: 0,
    total_verified_earnings: 0,
  });
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const isRootAdmin = user?.innova_id === '000001';

  const refreshStats = useCallback(async () => {
    try {
      const liveStats = await api.getPublicStats();
      setStats(liveStats);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const s = await api.getSiteSettings();
      setSettings(s);
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  }, []);

  const refreshBalanceAndNotifs = useCallback(async (memberId: string) => {
    try {
      const [bal, notifs] = await Promise.all([
        api.getMemberBalance(memberId),
        api.getNotifications(memberId),
      ]);
      setAvailableBalance(bal.availableBalance);
      setTotalEarnings(bal.totalEarnings);
      setTodayEarnings(bal.todayEarnings);
      setUnreadNotificationsCount(notifs.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error('Error fetching member balance/notifs', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const updated = await api.getProfile(user.innova_id);
      if (updated) {
        setUser(updated);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        await refreshBalanceAndNotifs(updated.id);
      }
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  }, [user, refreshBalanceAndNotifs]);

  // Initial load
  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([refreshStats(), refreshSettings()]);

      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          const parsed: Profile = JSON.parse(stored);
          const fresh = await api.getProfile(parsed.innova_id);
          if (fresh) {
            setUser(fresh);
            setToken(`session-${fresh.innova_id}`);
            await refreshBalanceAndNotifs(fresh.id);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setLoading(false);
    }
    init();
  }, [refreshStats, refreshSettings, refreshBalanceAndNotifs]);

  const login = async (credentials: { innovaId?: string; mobile?: string; password: string }) => {
    const res = await api.login(credentials);
    setUser(res.profile);
    setToken(res.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(res.profile));
    await Promise.all([refreshBalanceAndNotifs(res.profile.id), refreshStats()]);
    return res.profile;
  };

  const register = async (data: {
    fullName: string;
    mobile: string;
    password: string;
    referralId?: string;
  }) => {
    const res = await api.register(data);
    setUser(res.profile);
    setToken(res.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(res.profile));
    await Promise.all([refreshBalanceAndNotifs(res.profile.id), refreshStats()]);
    return res.profile;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
    setAvailableBalance(0);
    setTotalEarnings(0);
    setTodayEarnings(0);
    setUnreadNotificationsCount(0);
    refreshStats();
  };

  const updateAvatar = async (url: string) => {
    if (!user) throw new Error('Not logged in');
    const updated = await api.updateAvatar(user.innova_id, url);
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isRootAdmin,
        token,
        loading,
        availableBalance,
        totalEarnings,
        todayEarnings,
        unreadNotificationsCount,
        stats,
        settings,
        login,
        register,
        logout,
        refreshProfile,
        refreshStats,
        refreshSettings,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

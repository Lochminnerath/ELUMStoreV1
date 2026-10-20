import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { api, type AppUse, type ElumStatus, type Health, type ServiceStage } from '../api';
import { useAuth } from '../auth/AuthProvider';

/**
 * What Store knows beyond its catalogue: which apps the person has (from the platform), and how
 * each app is running (from the elum-status function). Shared by every page, fetched once and
 * refreshed when it matters.
 */

/** How far along each app is before the platform has answered, or when signed out. */
const DEFAULT_STAGES: Record<string, ServiceStage> = { write: 'active', type: 'beta', make: 'beta', browse: 'beta', store: 'beta' };

interface Mine {
  status: 'idle' | 'loading' | 'ready' | 'error';
  apps: Record<string, AppUse>;
  /** The account these answers are for, so a new sign-in asks again. */
  userId: string | null;
}

let mine: Mine = { status: 'idle', apps: {}, userId: null };
const listeners = new Set<() => void>();
const emit = (next: Mine) => {
  mine = next;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

async function loadMine(userId: string) {
  emit({ ...mine, status: 'loading', userId });
  try {
    const list = await api.myApps();
    if (mine.userId !== userId) return;
    emit({ status: 'ready', apps: Object.fromEntries(list.map((a) => [a.id, a])), userId });
  } catch {
    if (mine.userId === userId) emit({ ...mine, status: 'error' });
  }
}

export interface MyApps {
  status: Mine['status'];
  /** They have it. False while unknown or signed out. */
  has(id: string): boolean;
  stage(id: string): ServiceStage;
  lastSeen(id: string): string | null;
  /** Adds the app to their ELUM account. */
  get(id: string): Promise<void>;
  refresh(): void;
}

/** The apps the person signed in has. Signed out, they have none and every app can be got. */
export function useMyApps(): MyApps {
  const { status, user } = useAuth();
  const state = useSyncExternalStore(subscribe, () => mine);
  const userId = status === 'signed-in' ? (user?.id ?? null) : null;

  useEffect(() => {
    if (!userId) {
      if (mine.userId) emit({ status: 'idle', apps: {}, userId: null });
      return;
    }
    if (mine.userId !== userId || mine.status === 'idle') void loadMine(userId);
  }, [userId]);

  const get = useCallback(
    async (id: string) => {
      await api.getApp(id);
      emit({
        ...mine,
        apps: { ...mine.apps, [id]: { id, stage: mine.apps[id]?.stage ?? DEFAULT_STAGES[id] ?? 'beta', joined: true, lastSeenAt: new Date().toISOString() } },
      });
      if (userId) void loadMine(userId);
    },
    [userId],
  );

  const ours = userId && state.userId === userId ? state : { status: 'idle' as const, apps: {} as Record<string, AppUse> };
  return {
    status: ours.status,
    has: (id) => !!ours.apps[id]?.joined,
    stage: (id) => ours.apps[id]?.stage ?? DEFAULT_STAGES[id] ?? 'beta',
    lastSeen: (id) => ours.apps[id]?.lastSeenAt ?? null,
    get,
    refresh: () => userId && void loadMine(userId),
  };
}

// -------------------------------------------------------------------- status

interface Running {
  status: 'idle' | 'loading' | 'ready' | 'error';
  report: ElumStatus | null;
  at: number;
}

let running: Running = { status: 'idle', report: null, at: 0 };
const runningListeners = new Set<() => void>();
const subscribeRunning = (l: () => void) => {
  runningListeners.add(l);
  return () => runningListeners.delete(l);
};
const setRunning = (next: Running) => {
  running = next;
  runningListeners.forEach((l) => l());
};

/** Answers younger than this are reused. */
const FRESH_MS = 60_000;

async function loadRunning() {
  setRunning({ ...running, status: 'loading' });
  try {
    const report = await api.status();
    setRunning({ status: report ? 'ready' : 'error', report, at: Date.now() });
  } catch {
    setRunning({ status: 'error', report: running.report, at: Date.now() });
  }
}

/** How every ELUM app is running, checked at most once a minute. */
export function useRunning(): { status: Running['status']; health(id: string): { health: Health; note: string } | null; overall: Health | null } {
  const state = useSyncExternalStore(subscribeRunning, () => running);
  useEffect(() => {
    if (running.status !== 'loading' && Date.now() - running.at > FRESH_MS) void loadRunning();
  }, []);
  return {
    status: state.status,
    health: (id) => {
      const check = state.report?.checks.find((c) => c.id === id && c.group === 'apps');
      return check ? { health: check.health, note: check.note } : null;
    },
    overall: state.report?.overall ?? null,
  };
}

/** For tests: forget everything. */
export function resetStoreState() {
  mine = { status: 'idle', apps: {}, userId: null };
  running = { status: 'idle', report: null, at: 0 };
}

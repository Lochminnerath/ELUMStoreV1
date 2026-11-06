import { useSyncExternalStore } from 'react';
import { DEFAULTS, type Content, type SectionKey } from './defaults';

/**
 * Store's home page content: what is built in (defaults.ts) with the ELUM team's changes from
 * the Console laid over it. Changes are read when Store opens, kept on this device so the next
 * visit shows them at once, and checked again in the background.
 *
 * Laying over is careful, the same way the ELUM site does it: a change only replaces a part of the
 * same kind, list items keep the built-in parts they do not mention, and pictures and colours must
 * look like pictures and colours. Anything else is ignored, so a bad change never breaks the page.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Overrides = Partial<Record<SectionKey, Json>>;

const env = import.meta.env;
const SUPABASE_URL = (env.VITE_SUPABASE_URL?.trim() || 'https://afdnnvngrpdodsfwpaqo.supabase.co').replace(/\/+$/, '');
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY?.trim() || 'sb_publishable_0o6tXC51UwLFHi8j8d9zcQ_xeB1eKyz';
const CACHE = 'elum.store.content';

const isObject = (v: unknown): v is Record<string, Json> => !!v && typeof v === 'object' && !Array.isArray(v);

function blank(like: unknown): unknown {
  if (typeof like === 'string') return '';
  if (typeof like === 'number') return 0;
  if (typeof like === 'boolean') return false;
  if (Array.isArray(like)) return [];
  if (isObject(like)) return Object.fromEntries(Object.entries(like).map(([k, v]) => [k, blank(v)]));
  return like;
}

/** `base` with `over` laid on top, keeping the shape of `base`. */
export function layOver<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    if (!base.length || typeof base[0] === 'string') return over.filter((x) => typeof x === 'string') as T;
    const like = base[0];
    const byId = isObject(like) && 'id' in like;
    return over.map((item) => {
      const match = byId && isObject(item) ? base.find((b) => isObject(b) && b.id === item.id) : undefined;
      return layOver(match ?? blank(like), item);
    }) as T;
  }
  if (isObject(base)) {
    if (!isObject(over)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(over)) if (k in base) out[k] = layOver((base as Record<string, unknown>)[k], over[k]);
    return out as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

/** A picture link Store will show: one of its own files, or an https address. */
export function safeImage(src: string | undefined | null): string | null {
  const s = src?.trim();
  if (!s) return null;
  if (/^\/(?!\/)[\w\-./%]+$/.test(s)) return s;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

/** A colour Store will use: hex or rgb(a) only. */
export function safeColor(value: string | undefined | null, fallback: string): string {
  const v = value?.trim() ?? '';
  return /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(,\s*[\d.]+\s*)?\))$/i.test(v) ? v : fallback;
}

/** A link Store will follow: https, or a path on Store itself. */
export function safeLink(url: string | undefined | null): string | null {
  const s = url?.trim();
  if (!s) return null;
  if (/^(\/(?!\/)|#)/.test(s)) return s;
  try {
    return new URL(s).protocol === 'https:' ? s : null;
  } catch {
    return null;
  }
}

function build(o: Overrides): Content {
  const out = { ...DEFAULTS } as Record<SectionKey, unknown>;
  for (const k of Object.keys(DEFAULTS) as SectionKey[]) if (o[k] !== undefined) out[k] = layOver(DEFAULTS[k], o[k]);
  return out as Content;
}

function readCache(): Overrides {
  try {
    const v = JSON.parse(localStorage.getItem(CACHE) ?? 'null');
    return isObject(v) ? (v as Overrides) : {};
  } catch {
    return {};
  }
}

let overrides: Overrides = readCache();
let content: Content = build(overrides);
const listeners = new Set<() => void>();

export function setOverrides(next: Overrides, keep = true) {
  overrides = next;
  content = build(next);
  if (keep) {
    try {
      if (Object.keys(next).length) localStorage.setItem(CACHE, JSON.stringify(next));
      else localStorage.removeItem(CACHE);
    } catch {
      // The changes still show in this tab.
    }
  }
  listeners.forEach((l) => l());
}

/** Only the Store sections from everything the Console saved. */
export function storeOnly(all: unknown): Overrides {
  if (!isObject(all)) return {};
  return Object.fromEntries(Object.entries(all).filter(([k]) => k in DEFAULTS)) as Overrides;
}

/** Reads the team's changes. Without a connection, Store shows what is built in (or kept). */
export async function loadContent(): Promise<void> {
  if (typeof fetch === 'undefined') return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/elum_site_content`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'content-type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) return;
    const next = storeOnly(await res.json());
    if (JSON.stringify(next) !== JSON.stringify(overrides)) setOverrides(next);
  } catch {
    // Offline or blocked: what is built in (or kept from last time) shows.
  }
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** One section of Store's content, which updates when the team's changes arrive. */
export function useStoreContent<K extends SectionKey>(key: K): Content[K] {
  return useSyncExternalStore(subscribe, () => content[key], () => DEFAULTS[key]);
}

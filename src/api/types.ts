/**
 * Shared data shapes for ELUM Store. The Supabase API and the in-browser preview API both speak
 * these, so the screens never know which one is behind them.
 */

/**
 * `type`: an ELUM Type address (handle@type.elum.services).
 * `external`: the person's own email provider.
 */
export type AccountType = 'type' | 'external';

export interface User {
  id: string;
  name: string;
  email: string;
  /** Avatar colour, one of the product colours. */
  color: string;
  accountType: AccountType;
  createdAt: string;
  /** Their profile picture (set in ELUM Account), as a link the browser can load. */
  pictureUrl?: string | null;
}

export type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'color'>;

export interface Session {
  user: User;
}

export interface SignUpInput {
  name: string;
  /** Their own email, for `external` accounts. Unused for Type accounts. */
  email: string;
  password: string;
  /** Defaults to `external`. `type` creates an ELUM Type address (needs the ELUM platform). */
  accountType?: AccountType;
  /** Type accounts: the name before @<type domain>. */
  handle?: string;
  /** Type accounts: an outside address for getting back in after a forgotten password. */
  recoveryEmail?: string;
}

export interface SignInInput {
  /** An email, an ELUM Type address, or just the name before @<type domain>. */
  email: string;
  password: string;
}

// -------------------------------------------------------------------- store

/** How far along an ELUM app is, as the platform records it (elum.services). */
export type ServiceStage = 'planned' | 'beta' | 'active' | 'retired';

/** One ELUM app, as it stands for the person signed in (elum_me's services). */
export interface AppUse {
  id: string;
  stage: ServiceStage;
  /** They have it: they got it in Store, or signed in to it. */
  joined: boolean;
  lastSeenAt: string | null;
}

/** What /status shows: the elum-status function's answer (supabase/functions/_shared/status.ts). */
export type Health = 'up' | 'slow' | 'down';
export interface StatusCheck {
  id: string;
  name: string;
  group: 'apps' | 'platform' | 'search';
  health: Health;
  ms: number;
  note: string;
}
export interface ElumStatus {
  checkedAt: string;
  overall: Health;
  checks: StatusCheck[];
}

export type ServiceId = 'write' | 'type' | 'browse' | 'make' | 'store' | 'inquire';

export interface AppNotification {
  id: string;
  service: ServiceId | 'elum';
  type: string;
  title: string;
  body: string | null;
  /** A path inside the service, or a full URL. */
  link: string | null;
  createdAt: string;
  readAt: string | null;
  actor: Pick<PublicUser, 'id' | 'name' | 'color'> | null;
}
